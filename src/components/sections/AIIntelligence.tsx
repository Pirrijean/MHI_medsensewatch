"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

const capabilities = [
  {
    title: "Personal longitudinal baseline",
    text: "Replaces broad population averages with an evolving individual reference envelope mapped across circadian phase, sleep architecture and metabolic state.",
  },
  {
    title: "Physicochemical & multimodal fusion",
    text: "Synchronizes sweat cortisol, glucose, lactate and urea with beat-to-beat HRV, IMU workload, sweat pH and skin temperature in a unified state-space model.",
  },
  {
    title: "Context-gated anomaly detection",
    text: "Separates expected physiological responses — such as post-exercise lactate or morning cortisol peaks — from true multi-sigma deviations in personal biology.",
  },
  {
    title: "Application-specific risk trajectories",
    text: "Tracks multi-week slopes in autonomic recovery, glycemic variability and HPA stress load to surface early individual drift before acute events.",
  },
  {
    title: "Signal-transparent notifications",
    text: "Every alert specifies which molecular and physiological channels shifted, by how many standard deviations from personal norm, and under what activity context.",
  },
  {
    title: "Structured clinical longitudinal output",
    text: "Compiles calibrated time-series trends, sensor quality metrics and baseline deviations into concise longitudinal summaries for physician review.",
  },
];

const modelStages = [
  {
    id: "mapping",
    horizon: "Days 1 – 7",
    title: "Signal acquisition & kinetic normalization",
    summary:
      "MedSense Watch maps circadian cortisol amplitude, resting HRV, nocturnal skin temperature nadir and sweat pH kinetics — still compared against a wide population prior.",
    bandOuter:
      "M40 72 C 160 44, 280 96, 400 66 C 520 40, 640 84, 760 62 L 760 198 C 640 214, 520 176, 400 198 C 280 222, 160 182, 40 202 Z",
    meanLine:
      "M40 138 C 160 112, 280 158, 400 132 C 520 108, 640 148, 760 130",
    liveSignal:
      "M40 144 C 120 118, 200 152, 280 162 C 360 140, 440 124, 520 112 C 600 136, 680 146, 760 128",
    showAnomaly: false,
    stats: [
      ["Reference band", "Population prior (±2.5σ)"],
      ["pH / Temp calibration", "Active per measurement cycle"],
      ["Model confidence", " Calibrating individual rhythm"],
    ],
  },
  {
    id: "baseline",
    horizon: "Days 8 – 30",
    title: "Narrowed personal reference envelope",
    summary:
      "Bayesian longitudinal updating contracts the uncertainty band by 64 %, locking onto your personal cortisol awakening slope, post-meal glucose clearance and HRV–lactate coupling.",
    bandOuter:
      "M40 112 C 160 88, 280 134, 400 108 C 520 84, 640 124, 760 106 L 760 154 C 640 172, 520 132, 400 156 C 280 182, 160 136, 40 162 Z",
    meanLine:
      "M40 137 C 160 112, 280 158, 400 132 C 520 108, 640 148, 760 130",
    liveSignal:
      "M40 140 C 120 116, 200 144, 280 156 C 360 142, 440 128, 520 110 C 600 132, 680 144, 760 131",
    showAnomaly: false,
    stats: [
      ["Reference band", "Individualized (±1.5σ personal)"],
      ["Variance reduction", "−64 % vs population range"],
      ["Confounders learned", "Exercise load · sleep debt · meals"],
    ],
  },
  {
    id: "deviation",
    horizon: "Continuous Live",
    title: "Context-gated personal deviation (+2.8σ)",
    summary:
      "A subtle afternoon cortisol elevation and HRV suppression inside normal population limits is detected immediately because it breaches your narrow personal band while IMU confirms zero physical exertion.",
    bandOuter:
      "M40 112 C 160 88, 280 134, 400 108 C 520 84, 640 124, 760 106 L 760 154 C 640 172, 520 132, 400 156 C 280 182, 160 136, 40 162 Z",
    meanLine:
      "M40 137 C 160 112, 280 158, 400 132 C 520 108, 640 148, 760 130",
    liveSignal:
      "M40 140 C 120 116, 200 144, 280 156 C 360 142, 450 126, 520 52 C 585 48, 660 118, 760 126",
    showAnomaly: true,
    stats: [
      ["Detected shift", "+2.8σ vs personal · missed by pop. norm"],
      ["Activity gate", "0.04 g-rms (exercise ruled out)"],
      ["Primary drivers", "Cortisol +58 % · HRV −39 %"],
    ],
  },
] as const;

export function AIIntelligence() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const reduce = useReducedMotion();
  const [stageIdx, setStageIdx] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => {
      setStageIdx((i) => (i + 1) % modelStages.length);
    }, 4800);
    return () => clearTimeout(t);
  }, [stageIdx, inView, paused, reduce]);

  const stage = modelStages[stageIdx];

  return (
    <section
      ref={ref}
      id="ai"
      data-section="ai-personalized-health"
      className="relative overflow-hidden bg-night section-y"
    >
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[520px] rounded-full bg-physio/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 size-[520px] rounded-full bg-tech/[0.05] blur-3xl" />

      <div className="relative container-x">
        <SectionHeader
          title={
            <>
              Intelligence that learns <br className="hidden lg:block" />
              <span className="text-gradient-signal">your individual patterns.</span>
            </>
          }
          intro={`Developed by ${site.companyShort}, the computational layer behind ${site.productName} models how your biochemistry and physiology co-evolve over weeks — detecting subtle personal shifts that static population thresholds miss.`}
        />

        {/* Minimalist, specific Longitudinal Personal Baseline Visualization — zero boxed text */}
        <div
          className="mt-16 border-t border-white/10 pt-10 lg:mt-24"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Horizon selector */}
          <div role="tablist" aria-label="Longitudinal learning stages" className="grid gap-6 sm:grid-cols-3">
            {modelStages.map((s, i) => {
              const on = i === stageIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setStageIdx(i);
                    setPaused(true);
                    track("tech_interaction", { component: "ai_baseline_stage", stage: s.id });
                  }}
                  className="cursor-pointer text-left"
                >
                  <span className="block h-[2px] w-full bg-white/10">
                    <span
                      className={`block h-full transition-all duration-500 ${
                        on ? "w-full bg-tech" : "w-0 bg-transparent"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-3 block font-mono text-xs uppercase ${
                      on ? "text-tech" : "text-fog/60"
                    }`}
                  >
                    {s.horizon}
                  </span>
                  <span
                    className={`mt-1 block font-display text-base font-semibold transition-colors ${
                      on ? "text-white" : "text-white/55 hover:text-white/80"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pure signal curve — no boxes inside SVG, zero text overflow */}
          <div className="mt-10">
            <svg
              viewBox="0 0 800 236"
              className="w-full"
              role="img"
              aria-label={`${stage.horizon} — ${stage.title}: ${stage.summary}`}
            >
              {/* Subtle reference lines */}
              {[52, 132, 206].map((y) => (
                <line
                  key={y}
                  x1="40"
                  x2="760"
                  y1={y}
                  y2={y}
                  stroke="rgba(148,178,220,0.08)"
                  strokeDasharray="3 5"
                />
              ))}

              {/* Static population upper limit line for comparison */}
              <line
                x1="40"
                x2="760"
                y1="44"
                y2="44"
                stroke="rgba(159,176,200,0.25)"
                strokeDasharray="6 6"
              />
              <text x="40" y="34" className="fill-fog/65 font-mono text-[10px]">
                POPULATION CLINICAL THRESHOLD (STATIC)
              </text>

              {/* Evolving personal uncertainty envelope */}
              <motion.path
                d={stage.bandOuter}
                animate={{ d: stage.bandOuter }}
                transition={reduce ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                fill="rgba(25,230,212,0.12)"
                stroke="rgba(25,230,212,0.32)"
                strokeWidth="1"
              />

              {/* Personal expected trajectory */}
              <motion.path
                d={stage.meanLine}
                animate={{ d: stage.meanLine }}
                transition={reduce ? { duration: 0 } : { duration: 0.85 }}
                fill="none"
                stroke="rgba(103,232,249,0.45)"
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />

              {/* Live fused multimodal trajectory */}
              <motion.path
                d={stage.liveSignal}
                animate={{ d: stage.liveSignal }}
                transition={reduce ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                fill="none"
                stroke={stage.showAnomaly ? "#FFB547" : "#19E6D4"}
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Personal deviation marker */}
              {stage.showAnomaly && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <line x1="538" x2="538" y1="50" y2="112" stroke="#FFB547" strokeWidth="1.4" strokeDasharray="2 3" />
                  <circle cx="538" cy="50" r="5" fill="#050B18" stroke="#FFB547" strokeWidth="2.2" />
                  <text x="552" y="54" className="fill-alert font-mono text-[10.5px]">
                    +2.8σ PERSONAL DEVIATION
                  </text>
                </motion.g>
              )}

              <text x="40" y="226" className="fill-fog/60 font-mono text-[10px]">
                06:00
              </text>
              <text x="400" y="226" textAnchor="middle" className="fill-fog/60 font-mono text-[10px]">
                18:00 · CIRCADIAN &amp; METABOLIC PHASE
              </text>
              <text x="760" y="226" textAnchor="end" className="fill-fog/60 font-mono text-[10px]">
                06:00 (+24H)
              </text>
            </svg>
          </div>

          {/* Clean HTML readout row — responsive typography, never clipped */}
          <div className="mt-6 grid gap-8 border-t border-white/10 pt-6 lg:grid-cols-12">
            <p className="text-[15px] leading-relaxed text-white/90 lg:col-span-5">
              {stage.summary}
            </p>
            <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
              {stage.stats.map(([label, val]) => (
                <div key={label} className="border-l border-white/12 pl-4">
                  <dt className="font-mono text-[10px] tracking-wider text-fog uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1.5 font-mono text-xs text-white">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Six AI pillars — no AI-01..06 codes, clean editorial hairlines */}
        <div className="mt-20 grid border-t border-white/10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 0.05}
              className={`border-b border-white/10 py-10 ${
                i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
              } ${
                i % 3 === 0
                  ? "lg:border-l-0 lg:pl-0 lg:pr-10"
                  : i % 3 === 1
                    ? "lg:border-l lg:px-10"
                    : "lg:border-l lg:pl-10 lg:pr-0"
              } ${i >= 3 ? "lg:border-b-0" : ""}`}
            >
              <h3 className="text-xl font-semibold tracking-tight text-white">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fog">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
