/**
 * Provider-agnostic analytics.
 * Works with Google Analytics 4 (gtag), Plausible, or any tag manager
 * reading `window.dataLayer`. If none is configured, calls are no-ops.
 */
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export type AnalyticsEvent =
  | "cta_click"
  | "section_view"
  | "scroll_depth"
  | "tech_interaction"
  | "form_start"
  | "form_submit"
  | "form_error";

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, props);
    window.plausible?.(event, { props });
    window.dataLayer?.push({ event, ...props });
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, props);
    }
  } catch {
    /* analytics must never break the page */
  }
}

const CTA_KEY = "mhi:last-cta";

/** Remembers the last CTA clicked so the lead can be attributed to it. */
export function rememberCta(id: string) {
  try {
    sessionStorage.setItem(CTA_KEY, id);
  } catch {}
}

export function lastCta(): string | undefined {
  try {
    return sessionStorage.getItem(CTA_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}
