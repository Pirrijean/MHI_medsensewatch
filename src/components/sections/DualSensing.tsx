"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import {
  MoleculeStructure,
  SignalFusion,
  type IntelligenceDomain,
} from "@/components/animations/SignalFusion";
import { track } from "@/lib/analytics";

const physioSignals = [
  {
    name: "PPG Heart Rate",
    wave: "M0 14 L10 14 L14 4 L18 19 L22 14 L34 14 L38 4 L42 19 L46 14 L56 14",
  },
  {
    name: "HRV (R–R)",
    wave: "M0 16 C 12 6, 22 20, 34 9 C 44 4, 50 15, 56 12",
  },
  {
    name: "SpO₂ Dual-λ",
    wave: "M0 13 C 9 6, 19 6, 28 13 C 37 20, 47 20, 56 13",
  },
  {
    name: "Skin Temp",
    wave: "M0 18 C 16 17, 30 10, 56 8",
  },
  {
    name: "6-Axis IMU",
    wave: "M0 13 L6 7 L12 19 L18 5 L24 20 L30 9 L36 16 L44 12 L56 13",
  },
  {
    name: "Optional ECG",
    wave: "M0 14 L14 14 L18 11 L21 14 L25 18 L28 2 L31 21 L34 14 L42 9 L47 14 L56 14",
  },
];

const biochemTargets: {
  id: "cortisol" | "glucose" | "lactate" | "urea";
  name: string;
  formula: string;
  role: string;
}[] = [
  { id: "cortisol", name: "Cortisol", formula: "C₂₁H₃₀O₅", role: "Physiological stress response" },
  { id: "glucose", name: "Glucose", formula: "C₆H₁₂O₆", role: "Metabolic monitoring" },
  { id: "lactate", name: "Lactate", formula: "C₃H₅O₃⁻", role: "Metabolic & exercise response" },
  { id: "urea", name: "Urea", formula: "CH₄N₂O", role: "Nitrogen metabolism" },
];

export function DualSensing() {
  const [active, setActive] = useState<IntelligenceDomain>("physiological");
  const reduce = useReducedMotion();

  const activate = (domain: IntelligenceDomain) => {
    if (domain === active) return;
    setActive(domain);
    track("tech_interaction", { component: "dual_sensing_hover", domain });
  };

  return (
    <section
      id="dimensions"
      data-section="two-dimensions"
      className="relative overflow-hidden bg-night section-y"
    >
      {/* Pure ambient focus glow — NO background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_68%_45%,rgba(25,230,212,0.08),rgba(76,141,255,0.06)_48%,transparent_75%)]"
      />

      <div className="relative container-x">
        {/* Centered expressive editorial title — no section numbers */}
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-[3.8rem]">
              A{" "}
              <span className="text-gradient-signal">multidimensional approach</span>
              <br />
              to human health.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fog sm:text-lg">
              Move across each layer of MedSense Watch to inspect its physiological waveforms,
              target molecular structures and synchronized multimodal fusion.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left: Clean borderless hover-expanding intelligence layers (no nested boxes) */}
          <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-5">
            {/* 1. Physiological intelligence */}
            <motion.div
              onMouseEnter={() => activate("physiological")}
              onFocus={() => activate("physiological")}
              onClick={() => activate("physiological")}
              tabIndex={0}
              animate={
                reduce
                  ? undefined
                  : {
                      paddingTop: active === "physiological" ? 28 : 20,
                      paddingBottom: active === "physiological" ? 28 : 20,
                      opacity: active === "physiological" ? 1 : 0.52,
                    }
              }
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer pl-5 outline-none"
            >
              <span
                className={`absolute top-0 bottom-0 left-0 w-[2px] transition-colors duration-300 ${
                  active === "physiological" ? "bg-physio" : "bg-transparent"
                }`}
              />
              <h3
                className={`font-display font-semibold transition-all duration-300 ${
                  active === "physiological" ? "text-2xl text-white sm:text-[1.7rem]" : "text-xl text-white/80"
                }`}
              >
                Physiological intelligence
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fog">
                A wearable sensor system continuously captures relevant physiological signals and
                establishes individual patterns.
              </p>

              {/* Explicit live signal waveforms instead of rounded pill boxes */}
              <motion.div
                initial={false}
                animate={{
                  height: active === "physiological" ? "auto" : 0,
                  opacity: active === "physiological" ? 1 : 0,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 pt-1 sm:grid-cols-3 lg:grid-cols-2">
                  {physioSignals.map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
                      <span className="font-mono text-[11px] text-white/90">{s.name}</span>
                      <svg viewBox="0 0 56 24" className="h-5 w-12 shrink-0" aria-hidden>
                        <path
                          d={s.wave}
                          fill="none"
                          stroke="#4C8DFF"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* 2. Biochemical intelligence */}
            <motion.div
              onMouseEnter={() => activate("biochemical")}
              onFocus={() => activate("biochemical")}
              onClick={() => activate("biochemical")}
              tabIndex={0}
              animate={
                reduce
                  ? undefined
                  : {
                      paddingTop: active === "biochemical" ? 28 : 20,
                      paddingBottom: active === "biochemical" ? 28 : 20,
                      opacity: active === "biochemical" ? 1 : 0.52,
                    }
              }
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer pl-5 outline-none"
            >
              <span
                className={`absolute top-0 bottom-0 left-0 w-[2px] transition-colors duration-300 ${
                  active === "biochemical" ? "bg-tech" : "bg-transparent"
                }`}
              />
              <h3
                className={`font-display font-semibold transition-all duration-300 ${
                  active === "biochemical" ? "text-2xl text-white sm:text-[1.7rem]" : "text-xl text-white/80"
                }`}
              >
                Biochemical intelligence
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fog">
                A modular bioelectronic interface collects and analyzes sweat using electrochemical
                molecular sensing.
              </p>

              {/* Explicit 2D molecular chemical structures — no pill boxes */}
              <motion.div
                initial={false}
                animate={{
                  height: active === "biochemical" ? "auto" : 0,
                  opacity: active === "biochemical" ? 1 : 0,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
                  {biochemTargets.map((m) => (
                    <div key={m.id} className="border-b border-white/[0.06] pb-3">
                      <MoleculeStructure molecule={m.id} className="h-11 w-20" />
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="font-display text-xs font-semibold text-white">
                          {m.name}
                        </span>
                        <span className="font-mono text-[10px] text-tech">{m.formula}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-fog/80">{m.role}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* 3. Multimodal intelligence */}
            <motion.div
              onMouseEnter={() => activate("multimodal")}
              onFocus={() => activate("multimodal")}
              onClick={() => activate("multimodal")}
              tabIndex={0}
              animate={
                reduce
                  ? undefined
                  : {
                      paddingTop: active === "multimodal" ? 28 : 20,
                      paddingBottom: active === "multimodal" ? 28 : 20,
                      opacity: active === "multimodal" ? 1 : 0.52,
                    }
              }
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer pl-5 outline-none"
            >
              <span
                className={`absolute top-0 bottom-0 left-0 w-[2px] transition-colors duration-300 ${
                  active === "multimodal" ? "bg-accent" : "bg-transparent"
                }`}
              />
              <h3
                className={`font-display font-semibold transition-all duration-300 ${
                  active === "multimodal" ? "text-2xl text-white sm:text-[1.7rem]" : "text-xl text-white/80"
                }`}
              >
                Multimodal intelligence
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fog">
                The two information streams are synchronized and processed together. MedSense Watch
                contextualizes biochemical variations using physiological activity, time, sweat pH,
                temperature and the individual&apos;s historical baseline.
              </p>

              <motion.div
                initial={false}
                animate={{
                  height: active === "multimodal" ? "auto" : 0,
                  opacity: active === "multimodal" ? 1 : 0,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex items-center gap-6 border-t border-white/[0.06] pt-3 font-mono text-[11px] text-accent">
                  <span>Lag alignment (Δt)</span>
                  <span>·</span>
                  <span>pH / Temp normalization</span>
                  <span>·</span>
                  <span>Personal baseline</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Synchronized borderless scientific visualization */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <SignalFusion activeDomain={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
