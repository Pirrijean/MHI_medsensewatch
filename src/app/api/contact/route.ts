import { NextResponse } from "next/server";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { contactPayloadSchema } from "@/lib/validation";

/** Simple per-IP sliding window limiter (max 6 submissions / 10 minutes). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const bucket = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (bucket.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    bucket.set(ip, recent);
    return true;
  }
  recent.push(now);
  bucket.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "local";

    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions in a short period. Please wait a few minutes." },
        { status: 429 },
      );
    }

    const raw: unknown = await request.json();
    const parsed = contactPayloadSchema.safeParse(raw);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid form fields.";
      return NextResponse.json({ ok: false, error: firstIssue }, { status: 400 });
    }

    const { website, startedAt, source, ...fields } = parsed.data;

    // Anti-spam: honeypot filled or unrealistically fast bot submission (< 1.2 s)
    const elapsed = Date.now() - startedAt;
    if ((website && website.length > 0) || elapsed < 1200) {
      return NextResponse.json({
        ok: true,
        referenceId: `MHI-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
        receivedAt: new Date().toISOString(),
      });
    }

    const referenceId = `MHI-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    const record = {
      referenceId,
      receivedAt,
      ...fields,
      source: source ?? {},
    };

    // Persist locally to data/leads.jsonl (optional webhook forwarding via LEAD_WEBHOOK_URL)
    try {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
    } catch {
      // Read-only serverless filesystems (e.g. Vercel) skip local file write cleanly
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, referenceId, receivedAt });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request payload." },
      { status: 400 },
    );
  }
}
