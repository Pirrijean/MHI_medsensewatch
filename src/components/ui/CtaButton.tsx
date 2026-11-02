"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { rememberCta, track } from "@/lib/analytics";
import type { Interest } from "@/lib/validation";

type Variant = "primary" | "secondary" | "secondary-light" | "primary-light";

const styles: Record<Variant, string> = {
  primary:
    "bg-tech text-night hover:bg-accent shadow-[0_0_0_1px_rgba(25,230,212,0.4),0_10px_40px_-10px_rgba(25,230,212,0.55)]",
  secondary: "border border-white/20 text-white hover:border-tech/70 hover:text-tech",
  "primary-light": "bg-ink text-white hover:bg-night-3",
  "secondary-light": "border border-ink/20 text-ink hover:border-ink",
};

type Props = {
  href: string;
  children: ReactNode;
  ctaId: string;
  variant?: Variant;
  interest?: Interest;
  className?: string;
  arrow?: boolean;
};

export const INTEREST_EVENT = "mhi:interest";

/** Tracked CTA. Optionally preselects the "main interest" field of the contact form. */
export function CtaButton({
  href,
  children,
  ctaId,
  variant = "primary",
  interest,
  className = "",
  arrow = true,
}: Props) {
  return (
    <a
      href={href}
      onClick={() => {
        track("cta_click", { cta: ctaId });
        rememberCta(ctaId);
        if (interest) {
          window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: interest }));
        }
      }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
