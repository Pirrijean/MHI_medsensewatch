"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [frosted, setFrosted] = useState(false);
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setFrosted(y > 64);
  });

  // Progressive scroll-driven shrink into a wide, well-proportioned floating frosted pill
  const topOffset = useTransform(scrollY, [0, 170], [0, 14]);
  const maxWidth = useTransform(scrollY, [0, 170], [1240, 960]);
  const radius = useTransform(scrollY, [0, 170], [0, 999]);
  const height = useTransform(scrollY, [0, 170], [78, 54]);
  const padX = useTransform(scrollY, [0, 170], [32, 28]);

  // High-opacity whitish-grey frosted gradient (32px blur, subtle background diffusion, zero shadows)
  const glassProgress = useTransform(scrollY, [0, 170], [0, 1]);
  const backgroundImage = useTransform(
    glassProgress,
    (p) =>
      `linear-gradient(135deg, rgba(248, 250, 252, ${(0.91 * p).toFixed(3)}) 0%, rgba(232, 236, 243, ${(0.85 * p).toFixed(3)}) 100%)`,
  );
  const borderColor = useTransform(
    glassProgress,
    (p) => `rgba(148, 163, 184, ${(0.42 * p).toFixed(3)})`,
  );
  const backdropFilter = useTransform(
    glassProgress,
    (p) => `blur(${(32 * p).toFixed(1)}px) saturate(${Math.round(100 + 75 * p)}%)`,
  );

  // Track active section in view
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const onScrollTop = () => {
      if (window.scrollY < 220) setActive("");
    };
    window.addEventListener("scroll", onScrollTop, { passive: true });

    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-38% 0px -52% 0px" },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScrollTop);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const lightSurface = frosted || open || !!reduce;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:pointer-events-auto focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <motion.nav
        aria-label="Main"
        style={
          reduce
            ? undefined
            : {
                marginTop: topOffset,
                maxWidth,
                borderRadius: radius,
                height,
                paddingLeft: padX,
                paddingRight: padX,
                backgroundImage: open
                  ? "linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(232,236,243,0.91) 100%)"
                  : backgroundImage,
                borderColor: open ? "rgba(148, 163, 184, 0.45)" : borderColor,
                backdropFilter: open ? "blur(32px) saturate(175%)" : backdropFilter,
                WebkitBackdropFilter: open ? "blur(32px) saturate(175%)" : backdropFilter,
              }
        }
        className={`pointer-events-auto mx-auto flex w-full items-center justify-between gap-6 border ${
          reduce
            ? "mt-3.5 h-[54px] max-w-[960px] rounded-full border-slate-400/45 bg-slate-100/88 px-7 backdrop-blur-2xl backdrop-saturate-150"
            : ""
        }`}
      >
        {/* Stylized MHI wordmark — adapts smoothly to frosted light glass */}
        <a
          href="#top"
          className="flex shrink-0 items-center py-1 transition-opacity hover:opacity-80"
          aria-label={`${site.companyShort} — home`}
        >
          <LogoMark className="h-[20px] w-auto" tone={lightSurface ? "dark" : "light"} />
        </a>

        {/* Single-line, non-wrapping links with generous margins and a flat minimalist selection frame */}
        <ul className="hidden min-w-0 items-center gap-1.5 lg:flex xl:gap-2.5">
          {navLinks.map((l) => {
            const isCurrent = active === l.href.slice(1);
            return (
              <li key={l.href} className="relative shrink-0">
                <a
                  href={l.href}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`relative z-10 block rounded-full px-3.5 py-1.5 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-200 ${
                    lightSurface
                      ? isCurrent
                        ? "text-ink"
                        : "text-ink/65 hover:text-ink"
                      : isCurrent
                        ? "text-white"
                        : "text-fog/85 hover:text-white"
                  }`}
                >
                  {isCurrent && (
                    <motion.span
                      layoutId="nav-active-frame"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 34 }
                      }
                      className={`absolute inset-0 -z-10 rounded-full ${
                        lightSurface
                          ? "border border-ink/15 bg-ink/[0.07]"
                          : "border border-white/20 bg-white/[0.08]"
                      }`}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors lg:hidden ${
            lightSurface
              ? "border-ink/15 text-ink hover:bg-ink/[0.06]"
              : "border-white/20 text-white hover:bg-white/10"
          }`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </motion.nav>

      {open && (
        <div
          id="mobile-menu"
          className="pointer-events-auto mx-auto mt-2.5 max-w-md rounded-3xl border border-white/45 bg-slate-100/82 p-5 text-ink backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-ink/10">
            {navLinks.map((l) => {
              const isCurrent = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-3 font-display text-base ${
                      isCurrent ? "font-semibold text-ink" : "font-medium text-ink/70"
                    }`}
                  >
                    <span>{l.label}</span>
                    {isCurrent && (
                      <span className="rounded-full border border-ink/15 bg-ink/[0.07] px-2.5 py-0.5 font-mono text-[10px] text-ink">
                        Active
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
