"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

type Domain = {
  id: string;
  title: string;
  description: string;
  contextRole: string;
  metrics: string[];
  unit: string;
  sampleValue: string;
  wave: string;
  secondaryWave?: string;
};

const domains: Domain[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular",
    description: "Heart rate, HRV, activity patterns and optional ECG measurements.",
    contextRole:
      "Autonomic balance (HRV) and cardiac load distinguish acute sympathetic stress from metabolic or exercise-driven biomarker shifts.",
    metrics: ["PPG heart rate", "Beat-to-beat HRV (RMSSD)", "Pulse wave morphology", "Optional single-lead ECG"],
    unit: "ms RMSSD · bpm",
    sampleValue: "62 ms · 58 bpm",
    wave: "M0 62 L38 62 L46 56 L54 62 L64 62 L70 68 L77 18 L84 78 L91 62 L106 62 L118 48 L130 62 L178 62 L186 56 L194 62 L204 62 L210 68 L217 18 L224 78 L231 62 L246 62 L258 48 L270 62 L318 62 L326 56 L334 62 L344 62 L350 68 L357 20",
  },
  {
    id: "respiratory",
    title: "Respiratory",
    description:
      "Peripheral oxygen saturation and physiological patterns associated with respiratory monitoring.",
    contextRole:
      "Dual-wavelength optical absorption and respiratory sinus arrhythmia contextualize aerobic vs. anaerobic sweat lactate dynamics.",
    metrics: ["Peripheral SpO₂", "Respiratory rate", "Nocturnal desaturation trends", "Perfusion index"],
    unit: "% SpO₂ · brpm",
    sampleValue: "98 % · 14.2 brpm",
    wave: "M0 54 C 30 24, 60 24, 90 54 C 120 82, 150 82, 180 54 C 210 24, 240 24, 270 54 C 300 82, 330 82, 360 54",
    secondaryWave:
      "M0 58 C 30 34, 60 34, 90 58 C 120 76, 150 76, 180 58 C 210 34, 240 34, 270 58 C 300 76, 330 76, 360 58",
  },
  {
    id: "thermoregulation",
    title: "Thermoregulation",
    description:
      "Skin temperature and its relationship with activity and environmental conditions.",
    contextRole:
      "Surface temperature calibrates electrochemical MIP kinetics in real time and anchors sweat-rate and circadian phase estimation.",
    metrics: ["Skin-surface temperature", "Circadian thermal amplitude", "Thermal recovery slope", "Kinetic calibration"],
    unit: "°C · Δ baseline",
    sampleValue: "33.6 °C · +0.2 °C",
    wave: "M0 68 C 50 66, 90 60, 130 48 C 175 34, 215 30, 260 38 C 300 45, 330 56, 360 60",
  },
  {
    id: "movement",
    title: "Movement",
    description:
      "Acceleration, motion, gait-related patterns and activity intensity.",
    contextRole:
      "6-axis inertial sensing quantifies mechanical workload, gates motion artefacts on optical/electrochemical channels, and tracks motor regularity.",
    metrics: ["6-axis accelerometry & gyro", "Activity intensity & cadence", "Gait symmetry", "Motion-artefact gating"],
    unit: "g-rms · steps/min",
    sampleValue: "0.14 g · 112 spm",
    wave: "M0 56 L15 44 L30 66 L45 34 L60 72 L75 38 L90 64 L105 48 L120 58 L135 52 L150 56 L165 55 L180 56 L195 40 L210 70 L225 30 L240 74 L255 42 L270 62 L285 50 L300 57 L315 54 L330 56 L360 56",
    secondaryWave:
      "M0 64 L20 58 L40 70 L60 50 L80 68 L100 56 L120 62 L140 60 L160 62 L180 62 L200 54 L220 72 L240 48 L260 68 L280 58 L300 62 L360 62",
  },
  {
    id: "sleep",
    title: "Sleep & recovery",
    description:
      "Longitudinal sleep and recovery indicators integrated with physiological and biochemical trends.",
    contextRole:
      "Overnight autonomic restoration establishes the morning reference against which the cortisol awakening response and metabolic readiness are interpreted.",
    metrics: ["Sleep–wake staging", "Nocturnal HRV & resting HR", "Overnight recovery index", "Morning HPA context"],
    unit: "h · recovery alignment",
    sampleValue: "7 h 28 m · aligned",
    wave: "M0 26 L42 26 L42 48 L96 48 L96 74 L154 74 L154 48 L198 48 L198 34 L236 34 L236 70 L282 70 L282 48 L326 48 L326 30 L360 30",
  },
];

const AUTO_MS = 4400;

export function PhysiologicalSensing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  // Automatic progression through all 5 signals when in view, unless paused by user hover
  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => {
      setIdx((current) => (current + 1) % domains.length);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [idx, inView, paused, reduce]);

  const active = domains[idx];

  const select = (nextIdx: number) => {
    setIdx(nextIdx);
    track("tech_interaction", {
      component: "physiological_domains",
      domain: domains[nextIdx].id,
    });
  };

  return (
    <section
      ref={ref}
      id="physiological"
      data-section="physiological-intelligence"
      className="relative bg-paper text-ink section-y"
    >
      <div className="container-x">
        <SectionHeader
          tone="light"
          title={
            <>
              The signals that define <br className="hidden lg:block" />
              how your body responds.
            </>
          }
          intro={`The physiological module inside ${site.productName} provides continuous biological context for every molecular measurement.`}
        />

        <div
          className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Clean borderless live waveform telemetry — no heavy card frame */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="border-t-2 border-ink pt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-semibold text-ink">{active.title}</h3>
                <span className="font-mono text-xs text-physio">{active.sampleValue}</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-soft">{active.unit}</p>

              {/* Open waveform canvas */}
              <div className="mt-6 border-y hairline-light py-6">
                <svg
                  viewBox="0 0 360 96"
                  className="h-28 w-full"
                  role="img"
                  aria-label={`Physiological waveform for ${active.title}`}
                >
                  {[24, 48, 72].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="360"
                      y1={y}
                      y2={y}
                      stroke="rgba(11,18,32,0.06)"
                      strokeDasharray="2 4"
                    />
                  ))}
                  {active.secondaryWave && (
                    <motion.path
                      key={`${active.id}-sec`}
                      d={active.secondaryWave}
                      fill="none"
                      stroke="#9fb0c8"
                      strokeWidth="1.5"
                      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <motion.path
                    key={active.id}
                    d={active.wave}
                    fill="none"
                    stroke="#2f6fe0"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </div>

              <div className="mt-6">
                <p className="eyebrow text-[#0e8f86]">Molecular context</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{active.contextRole}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t hairline-light pt-4 font-mono text-[11px] text-ink">
                {active.metrics.map((m) => (
                  <span key={m} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-physio" />
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Five physiological domains — auto-cycling with hairline progress + click/hover */}
          <div className="divide-y divide-ink/10 border-y hairline-light lg:col-span-7">
            {domains.map((d, i) => {
              const on = i === idx;
              return (
                <Reveal key={d.id} delay={i * 0.04}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    aria-pressed={on}
                    className={`relative block w-full cursor-pointer py-7 text-left transition-colors ${
                      on ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className={`text-xl tracking-tight uppercase transition-all sm:text-2xl ${
                          on ? "font-semibold text-ink" : "font-medium text-ink/65"
                        }`}
                      >
                        {d.title}
                      </h3>
                      <span
                        aria-hidden
                        className={`size-2 rounded-full transition-transform ${
                          on ? "scale-125 bg-physio" : "bg-ink/15"
                        }`}
                      />
                    </div>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                      {d.description}
                    </p>

                    {/* Subtle auto-advance progress hairline on the active item */}
                    {on && !reduce && (
                      <motion.span
                        key={`${idx}-${paused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: paused ? "100%" : "100%" }}
                        transition={paused ? { duration: 0.2 } : { duration: AUTO_MS / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[2px] bg-physio"
                      />
                    )}
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
