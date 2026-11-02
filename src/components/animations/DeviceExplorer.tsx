"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { sensorHotspots } from "@/data/sensors";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

const ZOOM = 1.48;

/**
 * Seamless floating anatomy explorer (no enclosing box).
 * Hovering over any hotspot or component row smoothly zooms into the module
 * and displays its working principle.
 */
export function DeviceExplorer() {
  const [selected, setSelected] = useState<string>(sensorHotspots[0].id);
  const [zooming, setZooming] = useState<boolean>(false);
  const reduce = useReducedMotion();

  const spot = sensorHotspots.find((s) => s.id === selected) ?? sensorHotspots[0];
  const scale = zooming ? ZOOM : 1;

  const hoverItem = (id: string, shouldZoom = true) => {
    if (id !== selected) {
      setSelected(id);
      track("tech_interaction", { component: "device_explorer", item: id });
    }
    setZooming(shouldZoom);
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Floating watch without any enclosing card or border */}
      <div
        className="relative lg:col-span-7"
        onMouseLeave={() => setZooming(false)}
      >
        <div className="relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden [mask-image:radial-gradient(closest-side,black_74%,transparent_100%)]">
          <motion.div
            className="absolute inset-0"
            animate={{ scale }}
            transition={reduce ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${spot.x}% ${spot.y}%` }}
          >
            <Image
              src="/images/exploded-view.jpg"
              alt={`Exploded hardware architecture of ${site.productName} floating seamlessly`}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover mix-blend-multiply"
            />

            {sensorHotspots.map((s) => {
              const on = s.id === selected;
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => hoverItem(s.id, true)}
                  onFocus={() => hoverItem(s.id, true)}
                  onClick={() => hoverItem(s.id, !zooming)}
                  aria-label={s.label}
                  aria-pressed={on}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <motion.span
                    className="relative grid size-8 place-items-center"
                    animate={{ scale: 1 / scale }}
                    transition={reduce ? { duration: 0 } : { duration: 0.75 }}
                  >
                    <span
                      className={`absolute inset-0 rounded-full ${
                        s.domain === "physiological" ? "bg-physio/30" : "bg-bio/30"
                      } ${on ? "scale-125" : "animate-soft-pulse"}`}
                    />
                    <span
                      className={`relative size-3 rounded-full ring-2 ring-paper transition-transform ${
                        s.domain === "physiological" ? "bg-physio" : "bg-[#0e8f86]"
                      } ${on ? "scale-125" : ""}`}
                    />
                  </motion.span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Minimal legend floating beneath */}
        <div className="mt-2 flex items-center justify-center gap-6 font-mono text-[11px] text-ink-soft">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-physio" /> Physiological module
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0e8f86]" /> Biochemical cartridge
          </span>
        </div>
      </div>

      {/* Hover-activated component list & live readout — clean hairlines, zero boxes */}
      <div
        className="lg:col-span-5"
        onMouseLeave={() => setZooming(false)}
      >
        <ul className="divide-y divide-ink/10 border-y hairline-light">
          {sensorHotspots.map((s) => {
            const on = s.id === selected;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseEnter={() => hoverItem(s.id, true)}
                  onFocus={() => hoverItem(s.id, true)}
                  onClick={() => hoverItem(s.id, true)}
                  className={`flex w-full cursor-pointer items-center justify-between py-3.5 text-left transition-colors ${
                    on ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <span
                      className={`w-11 font-mono text-[11px] ${
                        on
                          ? s.domain === "physiological"
                            ? "font-semibold text-physio"
                            : "font-semibold text-[#0e8f86]"
                          : "text-ink-soft/65"
                      }`}
                    >
                      {s.short}
                    </span>
                    <span className={`font-display text-base ${on ? "font-semibold" : "font-medium"}`}>
                      {s.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full transition-transform ${
                      on
                        ? s.domain === "physiological"
                          ? "scale-150 bg-physio"
                          : "scale-150 bg-[#0e8f86]"
                        : "bg-ink/15"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 min-h-[230px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={spot.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p
                className={`eyebrow ${
                  spot.domain === "physiological" ? "text-physio" : "text-[#0e8f86]"
                }`}
              >
                {spot.domain} sensing
              </p>
              <h4 className="mt-2 text-2xl font-semibold text-ink">{spot.label}</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{spot.principle}</p>

              <dl className="mt-6 space-y-2.5 border-t hairline-light pt-4 text-sm">
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="font-mono text-[11px] text-ink-soft uppercase">Measures</dt>
                  <dd className="text-ink">{spot.measures}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="font-mono text-[11px] text-ink-soft uppercase">Output</dt>
                  <dd className="text-ink">{spot.output}</dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
