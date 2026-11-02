"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires `section_view` once per section and `scroll_depth` at 25/50/75/100 %. */
export function EngagementTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).dataset.section;
          if (e.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            track("section_view", { section: id });
          }
        });
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => io.observe(el));

    const marks = [25, 50, 75, 100];
    const hit = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      marks.forEach((m) => {
        if (pct >= m - 1 && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent: m });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
