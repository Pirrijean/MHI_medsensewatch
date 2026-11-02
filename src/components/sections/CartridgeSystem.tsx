"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cartridges } from "@/data/cartridges";
import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

const architecturePillars = [
  {
    title: "Reusable watch chassis",
    text: `Core processing electronics, optical PPG, thermistor, IMU and wireless communication remain permanently inside ${site.productName}.`,
  },
  {
    title: "Replaceable biochemical module",
    text: "The snap-in molecular cartridge houses the 4-channel MIP electrode array, Ag/AgCl reference, sweat pH pad and capillary microfluidics.",
  },
  {
    title: "Regenerable MIP surface",
    text: "Controlled electrochemical potential pulses desorb bound molecules between cycles, extending multi-day cartridge longevity.",
  },
  {
    title: "Expandable analyte panels",
    text: "Interchangeable cartridges adapt the same watch hardware to metabolic, endocrine, hydration or custom research biomarker panels.",
  },
];

/**
 * Interactive modular cartridge switcher — clean engineering CAD schematic,
 * zero nested boxes, and external callout leader lines so labels never touch or overflow circles.
 */
export function CartridgeSystem() {
  const [selectedId, setSelectedId] = useState<string>(cartridges[0].id);
  const reduce = useReducedMotion();
  const active = cartridges.find((c) => c.id === selectedId) ?? cartridges[0];

  const select = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    track("tech_interaction", { component: "cartridge_switcher", cartridge: id });
  };

  return (
    <section
      id="ecosystem"
      data-section="modular-cartridges"
      className="relative bg-paper text-ink section-y"
    >
      <div className="container-x">
        <SectionHeader
          tone="light"
          title={
            <>
              One watch. An evolving <br className="hidden lg:block" />
              molecular sensing ecosystem.
            </>
          }
          intro={`The biochemical interface of ${site.productName} is built around interchangeable microfluidic cartridges developed by ${site.companyShort}.`}
        />

        {/* Four modular pillars — clean hairlines, no MOD-01 codes */}
        <div className="mt-16 grid border-t hairline-light sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {architecturePillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.06}
              className={`border-b hairline-light py-9 lg:border-b-0 ${
                i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
              } ${i > 0 ? "lg:border-l lg:pl-8" : ""} lg:pr-8`}
            >
              <h3 className="text-lg font-semibold tracking-tight text-ink uppercase">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Clean Single-Surface Dark Engineering Stage (no nested inner boxes) */}
        <Reveal className="mt-20 lg:mt-24">
          <div className="rounded-[32px] bg-night px-6 py-10 text-white sm:px-12 sm:py-14">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left: Panel selector with clean hairlines */}
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] tracking-wider text-tech uppercase">
                  Interchangeable cartridge panels
                </p>
                <div
                  role="tablist"
                  aria-label="Biochemical cartridge configurations"
                  className="mt-5 divide-y divide-white/10 border-y border-white/10"
                >
                  {cartridges.map((c) => {
                    const on = c.id === selectedId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onMouseEnter={() => select(c.id)}
                        onFocus={() => select(c.id)}
                        onClick={() => select(c.id)}
                        className="flex w-full cursor-pointer items-center justify-between py-4 text-left transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="size-2.5 rounded-full transition-transform"
                            style={{
                              backgroundColor: c.tint,
                              transform: on ? "scale(1.25)" : "scale(0.85)",
                              opacity: on ? 1 : 0.45,
                            }}
                          />
                          <span
                            className={`font-display text-base ${
                              on ? "font-semibold text-white" : "font-medium text-fog hover:text-white"
                            }`}
                          >
                            {c.name}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] tracking-wider text-fog/75 uppercase">
                          {c.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Precision CAD Cartridge Plan View — labels placed cleanly outside circles */}
              <div className="lg:col-span-8" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                        {active.name}
                      </h3>
                      <span
                        className="font-mono text-xs tracking-wider uppercase"
                        style={{ color: active.tint }}
                      >
                        {active.status}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">
                      {active.summary}
                    </p>

                    {/* Engineering plan-view SVG — external callout lines prevent any text clipping */}
                    <svg
                      viewBox="0 0 640 250"
                      className="mt-6 w-full"
                      role="img"
                      aria-label={`${active.name} microfluidic schematic with four functionalized sensing chambers`}
                    >
                      {/* Cartridge outer contour */}
                      <rect
                        x="36"
                        y="48"
                        width="568"
                        height="144"
                        rx="38"
                        fill="rgba(255,255,255,0.02)"
                        stroke={active.tint}
                        strokeOpacity="0.55"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="48"
                        y="60"
                        width="544"
                        height="120"
                        rx="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                      />

                      {/* Gold pogo contact pads along top edge */}
                      {[0, 1, 2, 3, 4, 5].map((p) => (
                        <rect
                          key={p}
                          x={226 + p * 34}
                          y="44"
                          width="16"
                          height="7"
                          rx="1.5"
                          fill="#D6AD4F"
                        />
                      ))}

                      {/* Sweat inlet port */}
                      <circle cx="96" cy="120" r="14" fill="#050b18" stroke={active.tint} strokeWidth="1.6" />
                      <circle cx="96" cy="120" r="4" fill={active.tint} />
                      <text x="96" y="154" textAnchor="middle" className="fill-fog font-mono text-[9.5px]">
                        SWEAT INLET
                      </text>

                      {/* Serpentine microfluidic channel */}
                      <path
                        d="M110 120 H144 V82 H502 V158 H144"
                        fill="none"
                        stroke={active.tint}
                        strokeOpacity="0.16"
                        strokeWidth="9"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M110 120 H530"
                        fill="none"
                        stroke={active.tint}
                        strokeWidth="2"
                        strokeDasharray="5 7"
                        className={reduce ? "" : "animate-dash-flow"}
                      />

                      {/* Four 3-electrode MIP chambers — clean geometry inside, labels cleanly below */}
                      {active.channels.map((ch, idx) => {
                        const cx = 196 + idx * 84;
                        return (
                          <g key={ch.sub}>
                            {/* Counter/Ref outer gold ring */}
                            <circle
                              cx={cx}
                              cy="120"
                              r="22"
                              fill="#050b18"
                              stroke="#D6AD4F"
                              strokeWidth="1.8"
                            />
                            {/* MIP working electrode core */}
                            <circle
                              cx={cx}
                              cy="120"
                              r="12"
                              fill={active.tint}
                              fillOpacity="0.26"
                              stroke={active.tint}
                              strokeWidth="1.3"
                            />
                            {/* Trace to contact pad */}
                            <line x1={cx} y1="98" x2={cx} y2="60" stroke="#D6AD4F" strokeOpacity="0.65" strokeWidth="1.2" />
                            {/* Clean leader line downward outside the cartridge */}
                            <line
                              x1={cx}
                              y1="142"
                              x2={cx}
                              y2="208"
                              stroke="rgba(255,255,255,0.22)"
                              strokeDasharray="2 3"
                            />
                            <text
                              x={cx}
                              y="224"
                              textAnchor="middle"
                              className="fill-white font-display text-[12px] font-semibold"
                            >
                              {ch.label}
                            </text>
                            <text
                              x={cx}
                              y="239"
                              textAnchor="middle"
                              className="fill-fog font-mono text-[9.5px]"
                            >
                              {ch.sub}
                            </text>
                          </g>
                        );
                      })}

                      {/* Capillary vent */}
                      <circle cx="544" cy="120" r="10" fill="#050b18" stroke="rgba(159,176,200,0.65)" strokeWidth="1.4" />
                      <text x="544" y="150" textAnchor="middle" className="fill-fog font-mono text-[9.5px]">
                        VENT
                      </text>
                    </svg>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
