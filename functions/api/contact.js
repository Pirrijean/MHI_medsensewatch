/**
 * Independent Cloudflare Pages Function for POST /api/contact.
 * Works alongside Next.js static export (`out/`) when deployed to Cloudflare Pages.
 * Optional environment variable in Cloudflare Pages: LEAD_WEBHOOK_URL.
 */

const PROFILES = new Set(["research", "healthcare", "engineering", "investment", "industry"]);
const INTERESTS = new Set([
  "presentation",
  "partnership",
  "clinical",
  "research",
  "investment",
  "other",
]);

function generateReferenceId() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `MHI-${hex}`;
}

export async function onRequestPost(context) {
  try {
    const raw = await context.request.json();
    if (!raw || typeof raw !== "object") {
      return Response.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
    }

    const fullName = typeof raw.fullName === "string" ? raw.fullName.trim() : "";
    const email = typeof raw.email === "string" ? raw.email.trim() : "";
    const organization = typeof raw.organization === "string" ? raw.organization.trim() : "";
    const profile = typeof raw.profile === "string" ? raw.profile : "";
    const interest = typeof raw.interest === "string" ? raw.interest : "";
    const message = typeof raw.message === "string" ? raw.message.trim().slice(0, 2000) : "";
    const consent = raw.consent === true;
    const website = typeof raw.website === "string" ? raw.website : "";
    const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : 0;

    if (
      fullName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      organization.length < 2 ||
      !PROFILES.has(profile) ||
      !INTERESTS.has(interest) ||
      !consent
    ) {
      return Response.json({ ok: false, error: "Invalid form fields." }, { status: 400 });
    }

    const referenceId = generateReferenceId();
    const receivedAt = new Date().toISOString();

    // Anti-spam: honeypot filled or unrealistically fast bot submission (< 1.2 s)
    if (website.length > 0 || (startedAt > 0 && Date.now() - startedAt < 1200)) {
      return Response.json({ ok: true, referenceId, receivedAt });
    }

    const record = {
      referenceId,
      receivedAt,
      fullName,
      email,
      organization,
      profile,
      interest,
      message,
      consent,
      source: raw.source && typeof raw.source === "object" ? raw.source : {},
    };

    const webhook = context.env && context.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => undefined);
    }

    return Response.json({ ok: true, referenceId, receivedAt });
  } catch {
    return Response.json({ ok: false, error: "Malformed request payload." }, { status: 400 });
  }
}
