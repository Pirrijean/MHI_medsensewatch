"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { track } from "@/lib/analytics";

export type IntelligenceDomain = "physiological" | "biochemical" | "multimodal";

/** Explicit 2D skeletal chemical structures for the four target molecules. */
export function MoleculeStructure({
  molecule,
  className = "h-14 w-24",
}: {
  molecule: "cortisol" | "glucose" | "lactate" | "urea";
  className?: string;
}) {
  if (molecule === "cortisol") {
    // Steroid 4-ring skeleton (A, B, C hex rings + D pentagon ring + C=O / -OH)
    return (
      <svg viewBox="0 0 132 68" fill="none" className={className} aria-hidden>
        <g stroke="#19E6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Ring A */}
          <polygon points="20,38 30,26 45,26 52,38 45,50 30,50" />
          {/* C=O on Ring A */}
          <line x1="20" y1="38" x2="10" y2="42" />
          <line x1="19" y1="41" x2="11" y2="45" />
          {/* Ring B */}
          <polyline points="52,38 67,38 74,50 67,62 52,62 45,50" />
          {/* Ring C */}
          <polyline points="67,38 74,26 89,26 96,38 89,50 74,50" />
          {/* -OH on C11 */}
          <line x1="74" y1="26" x2="70" y2="15" />
          {/* Ring D (5-membered) */}
          <polyline points="96,38 110,33 116,44 106,54 89,50" />
          {/* C17 ketol side chain */}
          <polyline points="110,33 116,20 126,18" />
          <line x1="110" y1="33" x2="120" y2="37" />
        </g>
        <text x="4" y="49" className="fill-fog font-mono text-[7px]">O</text>
        <text x="64" y="13" className="fill-tech font-mono text-[7px]">HO</text>
        <text x="121" y="42" className="fill-tech font-mono text-[7px]">OH</text>
      </svg>
    );
  }

  if (molecule === "glucose") {
    // Pyranose 6-membered ring with endocyclic oxygen + -OH substituents
    return (
      <svg viewBox="0 0 116 68" fill="none" className={className} aria-hidden>
        <g stroke="#1FBF9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="72,22 84,36 74,52 46,52 34,36 48,22" />
          <line x1="48" y1="22" x2="62" y2="22" />
          {/* Substituents */}
          <line x1="84" y1="36" x2="96" y2="32" />
          <line x1="74" y1="52" x2="80" y2="62" />
          <line x1="46" y1="52" x2="40" y2="62" />
          <line x1="34" y1="36" x2="22" y2="40" />
          <polyline points="48,22 42,11 32,11" />
        </g>
        <text x="64" y="25" className="fill-[#1FBF9A] font-mono text-[8px] font-bold">O</text>
        <text x="98" y="34" className="fill-fog font-mono text-[7px]">OH</text>
        <text x="8" y="43" className="fill-fog font-mono text-[7px]">HO</text>
        <text x="18" y="13" className="fill-[#1FBF9A] font-mono text-[7px]">HO</text>
      </svg>
    );
  }

  if (molecule === "lactate") {
    // CH3-CH(OH)-COO-
    return (
      <svg viewBox="0 0 116 68" fill="none" className={className} aria-hidden>
        <g stroke="#67E8F9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22,44 46,30 70,44 90,32" />
          {/* Hydroxyl on C2 */}
          <line x1="46" y1="30" x2="46" y2="16" />
          {/* Carbonyl C=O on C1 */}
          <line x1="68" y1="44" x2="68" y2="57" />
          <line x1="72" y1="44" x2="72" y2="57" />
        </g>
        <text x="41" y="13" className="fill-accent font-mono text-[8px]">OH</text>
        <text x="67" y="65" className="fill-fog font-mono text-[8px]">O</text>
        <text x="92" y="34" className="fill-accent font-mono text-[8px]">O⁻</text>
      </svg>
    );
  }

  // Urea: H2N - C(=O) - NH2
  return (
    <svg viewBox="0 0 116 68" fill="none" className={className} aria-hidden>
      <g stroke="#4C8DFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="34" y1="46" x2="58" y2="33" />
        <line x1="82" y1="46" x2="58" y2="33" />
        <line x1="56" y1="33" x2="56" y2="17" />
        <line x1="60" y1="33" x2="60" y2="17" />
      </g>
      <text x="54.5" y="14" className="fill-white font-mono text-[8px]">O</text>
      <text x="12" y="52" className="fill-physio font-mono text-[8px]">H₂N</text>
      <text x="85" y="52" className="fill-physio font-mono text-[8px]">NH₂</text>
    </svg>
  );
}

/* ---------- Deterministic 24h physiological + molecular trajectories ---------- */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const N = 97; // 06:00 → 06:00 (15-min steps)
const START_H = 6;

function buildStreams() {
  const r = rng(11);
  const hrv: number[] = [];
  const hr: number[] = [];
  const temp: number[] = [];
  const cort: number[] = [];
  const glu: number[] = [];
  const lac: number[] = [];
  const urea: number[] = [];

  for (let i = 0; i < N; i++) {
    const h = START_H + i / 4;
    const modH = h % 24;
    const night = modH >= 23 || modH < 6 ? 1 : 0;

    // Exercise bout at 09:30 (i ~ 14), non-metabolic acute stress at 14:30 (i ~ 34)
    const exercise = Math.exp(-(((i - 14) / 2.4) ** 2));
    const stressDip = Math.exp(-(((i - 34) / 2.3) ** 2));

    hrv.push(56 + night * 16 - exercise * 22 - stressDip * 24 + (r() - 0.5) * 4);
    hr.push(58 - night * 7 + exercise * 58 + stressDip * 18 + (r() - 0.5) * 3);
    temp.push(33.4 - night * 0.45 + exercise * 0.85 + (r() - 0.5) * 0.08);

    const circadianCort =
      4.8 + 12.5 * Math.exp(-(((h - 8.0) / 2.5) ** 2)) + 3.2 * Math.exp(-(((h - 30.2) / 1.9) ** 2));
    const stressCort = i >= 34 ? 8.8 * Math.exp(-(((i - 37) ** 2) / 9)) : 0;
    cort.push(Math.max(2.4, circadianCort + stressCort + (r() - 0.5) * 0.9));

    const breakfast = 42 * Math.exp(-(((i - 9) / 3.0) ** 2));
    const lunch = 48 * Math.exp(-(((i - 29) / 3.2) ** 2));
    const dinner = 38 * Math.exp(-(((i - 56) / 3.4) ** 2));
    glu.push(78 + breakfast + lunch + dinner + (r() - 0.5) * 4);

    lac.push(1.1 + exercise * 3.8 + (r() - 0.5) * 0.14);
    urea.push(18.2 + 1.4 * Math.sin(i / 15) + (r() - 0.5) * 0.35);
  }
  return { hrv, hr, temp, cort, glu, lac, urea };
}

const fmt = (i: number) => {
  const m = (START_H * 60 + i * 15) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const VW = 640;
const X0 = 42;
const X1 = 622;
const xAt = (i: number) => X0 + ((X1 - X0) * i) / (N - 1);

function linePath(vals: number[], top: number, height: number, min: number, max: number) {
  return vals
    .map((v, i) => {
      const y = top + height - ((v - min) / (max - min)) * height;
      return `${i ? "L" : "M"}${xAt(i).toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const yVal = (v: number, top: number, height: number, min: number, max: number) =>
  top + height - ((v - min) / (max - min)) * height;

/**
 * Dynamic borderless telemetry canvas synchronized with the hovered intelligence domain:
 * - "physiological": HR, HRV & Skin Temperature 24h traces + live ECG/PPG morphology
 * - "biochemical": Cortisol, Glucose, Lactate & Urea 24h sweat profiles + 2D chemical structures
 * - "multimodal": Synchronized HRV + Cortisol + Lactate fusion separating exercise from acute stress
 */
export function SignalFusion({ activeDomain }: { activeDomain: IntelligenceDomain }) {
  const reduce = useReducedMotion();
  const [cursor, setCursor] = useState(36);
  const interacted = useRef(false);
  const streams = useMemo(buildStreams, []);

  const scrub = (clientX: number, el: SVGSVGElement) => {
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * VW;
    const i = Math.round(((x - X0) / (X1 - X0)) * (N - 1));
    setCursor(Math.max(0, Math.min(N - 1, i)));
    if (!interacted.current) {
      interacted.current = true;
      track("tech_interaction", { component: "signal_fusion", domain: activeDomain });
    }
  };

  return (
    <div className="pt-2">
      <AnimatePresence mode="wait">
        {activeDomain === "physiological" && (
          <motion.div
            key="physio-view"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  Continuous Physiological Telemetry
                </p>
                <p className="text-xs text-fog">
                  Optical PPG, beat-to-beat HRV, skin temperature &amp; inertial activity · 24 h
                </p>
              </div>
              <span className="font-mono text-xs text-physio">{fmt(cursor)}</span>
            </div>

            <svg
              viewBox={`0 0 ${VW} 290`}
              className="mt-4 w-full touch-none select-none"
              role="img"
              aria-label="24-hour physiological streams: heart rate, heart rate variability and skin temperature"
              onPointerMove={(e) => scrub(e.clientX, e.currentTarget)}
              onPointerDown={(e) => scrub(e.clientX, e.currentTarget)}
            >
              {[50, 120, 190, 245].map((y) => (
                <line key={y} x1={X0} x2={X1} y1={y} y2={y} stroke="rgba(148,178,220,0.08)" />
              ))}

              <text x={X0} y="24" className="fill-physio font-mono text-[10px] tracking-wider">
                HEART RATE (BPM) &amp; HRV (MS)
              </text>
              <path
                d={linePath(streams.hr, 34, 96, 45, 130)}
                fill="none"
                stroke="#4C8DFF"
                strokeWidth="2"
              />
              <path
                d={linePath(streams.hrv, 34, 96, 20, 85)}
                fill="none"
                stroke="#67E8F9"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />

              <text x={X0} y="164" className="fill-fog font-mono text-[10px] tracking-wider">
                SKIN SURFACE TEMPERATURE (°C)
              </text>
              <path
                d={linePath(streams.temp, 174, 72, 32.6, 34.6)}
                fill="none"
                stroke="#9FB0C8"
                strokeWidth="1.8"
              />

              {/* Time ticks */}
              {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => (
                <text
                  key={i}
                  x={xAt(i)}
                  y={278}
                  textAnchor="middle"
                  className="fill-fog/60 font-mono text-[10px]"
                >
                  {fmt(i)}
                </text>
              ))}

              {/* Interactive scrubber line */}
              <line x1={xAt(cursor)} x2={xAt(cursor)} y1={30} y2={252} stroke="rgba(255,255,255,0.35)" />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.hr[cursor], 34, 96, 45, 130)}
                r="4"
                fill="#050B18"
                stroke="#4C8DFF"
                strokeWidth="2"
              />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.hrv[cursor], 34, 96, 20, 85)}
                r="3.5"
                fill="#050B18"
                stroke="#67E8F9"
                strokeWidth="2"
              />
            </svg>

            <div className="mt-3 grid grid-cols-4 gap-4 border-t border-white/10 pt-4 font-mono text-xs">
              <div>
                <span className="block text-[10px] text-fog uppercase">Heart rate</span>
                <span className="mt-0.5 block text-white">{streams.hr[cursor].toFixed(0)} bpm</span>
              </div>
              <div>
                <span className="block text-[10px] text-accent uppercase">HRV</span>
                <span className="mt-0.5 block text-white">{streams.hrv[cursor].toFixed(0)} ms</span>
              </div>
              <div>
                <span className="block text-[10px] text-fog uppercase">Skin temp</span>
                <span className="mt-0.5 block text-white">{streams.temp[cursor].toFixed(2)} °C</span>
              </div>
              <div>
                <span className="block text-[10px] text-physio uppercase">SpO₂</span>
                <span className="mt-0.5 block text-white">98 %</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeDomain === "biochemical" && (
          <motion.div
            key="biochem-view"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  Electrochemical Sweat Biomarker Streams
                </p>
                <p className="text-xs text-fog">
                  4-channel MIP recognition calibrated continuously by sweat pH (6.42) &amp; skin temperature
                </p>
              </div>
              <span className="font-mono text-xs text-tech">{fmt(cursor)}</span>
            </div>

            <svg
              viewBox={`0 0 ${VW} 290`}
              className="mt-4 w-full touch-none select-none"
              role="img"
              aria-label="24-hour biochemical streams: sweat cortisol, glucose, lactate and urea"
              onPointerMove={(e) => scrub(e.clientX, e.currentTarget)}
              onPointerDown={(e) => scrub(e.clientX, e.currentTarget)}
            >
              {[50, 120, 195, 248].map((y) => (
                <line key={y} x1={X0} x2={X1} y1={y} y2={y} stroke="rgba(148,178,220,0.08)" />
              ))}

              <text x={X0} y="24" className="fill-tech font-mono text-[10px] tracking-wider">
                CORTISOL (ng/mL) &amp; LACTATE (mM)
              </text>
              <path
                d={linePath(streams.cort, 34, 96, 0, 24)}
                fill="none"
                stroke="#19E6D4"
                strokeWidth="2.1"
              />
              <path
                d={linePath(streams.lac, 34, 96, 0.5, 5.5)}
                fill="none"
                stroke="#67E8F9"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />

              <text x={X0} y="164" className="fill-bio font-mono text-[10px] tracking-wider">
                SWEAT GLUCOSE (µM) &amp; UREA (mM)
              </text>
              <path
                d={linePath(streams.glu, 174, 74, 65, 140)}
                fill="none"
                stroke="#1FBF9A"
                strokeWidth="2"
              />
              <path
                d={linePath(streams.urea, 174, 74, 15, 22)}
                fill="none"
                stroke="#4C8DFF"
                strokeOpacity="0.8"
                strokeWidth="1.4"
              />

              {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => (
                <text
                  key={i}
                  x={xAt(i)}
                  y={278}
                  textAnchor="middle"
                  className="fill-fog/60 font-mono text-[10px]"
                >
                  {fmt(i)}
                </text>
              ))}

              <line x1={xAt(cursor)} x2={xAt(cursor)} y1={30} y2={252} stroke="rgba(255,255,255,0.35)" />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.cort[cursor], 34, 96, 0, 24)}
                r="4"
                fill="#050B18"
                stroke="#19E6D4"
                strokeWidth="2"
              />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.glu[cursor], 174, 74, 65, 140)}
                r="4"
                fill="#050B18"
                stroke="#1FBF9A"
                strokeWidth="2"
              />
            </svg>

            {/* Molecular readouts + explicit 2D chemical structures without enclosing boxes */}
            <div className="mt-3 grid grid-cols-2 gap-6 border-t border-white/10 pt-5 sm:grid-cols-4">
              <div>
                <MoleculeStructure molecule="cortisol" className="h-11 w-20" />
                <span className="mt-1 block font-mono text-[10px] text-tech uppercase">Cortisol</span>
                <span className="font-mono text-xs text-white">
                  {streams.cort[cursor].toFixed(1)} ng/mL
                </span>
              </div>
              <div>
                <MoleculeStructure molecule="glucose" className="h-11 w-20" />
                <span className="mt-1 block font-mono text-[10px] text-bio uppercase">Glucose</span>
                <span className="font-mono text-xs text-white">
                  {streams.glu[cursor].toFixed(0)} µM
                </span>
              </div>
              <div>
                <MoleculeStructure molecule="lactate" className="h-11 w-20" />
                <span className="mt-1 block font-mono text-[10px] text-accent uppercase">Lactate</span>
                <span className="font-mono text-xs text-white">
                  {streams.lac[cursor].toFixed(2)} mM
                </span>
              </div>
              <div>
                <MoleculeStructure molecule="urea" className="h-11 w-20" />
                <span className="mt-1 block font-mono text-[10px] text-physio uppercase">Urea</span>
                <span className="font-mono text-xs text-white">
                  {streams.urea[cursor].toFixed(1)} mM
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeDomain === "multimodal" && (
          <motion.div
            key="multimodal-view"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  Synchronized Multimodal Interpretation
                </p>
                <p className="text-xs text-fog">
                  Separating exercise exertion (09:30) from non-metabolic acute HPA stress (14:30)
                </p>
              </div>
              <span className="font-mono text-xs text-accent">{fmt(cursor)}</span>
            </div>

            <svg
              viewBox={`0 0 ${VW} 290`}
              className="mt-4 w-full touch-none select-none"
              role="img"
              aria-label="Synchronized multimodal graph comparing exercise lactate surge at 09:30 against sedentary cortisol surge and HRV dip at 14:30"
              onPointerMove={(e) => scrub(e.clientX, e.currentTarget)}
              onPointerDown={(e) => scrub(e.clientX, e.currentTarget)}
            >
              {/* Event 1: Exercise (09:00–10:15) */}
              <rect
                x={xAt(11)}
                y={28}
                width={xAt(18) - xAt(11)}
                height={224}
                fill="rgba(76,141,255,0.06)"
              />
              <text x={xAt(14.5)} y={22} textAnchor="middle" className="fill-physio font-mono text-[9.5px]">
                09:30 · AEROBIC LOAD
              </text>

              {/* Event 2: Non-exercise HPA stress (14:00–16:00) */}
              <rect
                x={xAt(32)}
                y={28}
                width={xAt(40) - xAt(32)}
                height={224}
                fill="rgba(255,181,71,0.07)"
              />
              <text x={xAt(36)} y={22} textAnchor="middle" className="fill-alert font-mono text-[9.5px]">
                14:30 · ACUTE STRESS
              </text>

              {/* Physiological HRV */}
              <path
                d={linePath(streams.hrv, 36, 94, 20, 85)}
                fill="none"
                stroke="#4C8DFF"
                strokeWidth="2"
              />
              {/* Molecular Cortisol */}
              <path
                d={linePath(streams.cort, 148, 98, 0, 24)}
                fill="none"
                stroke="#19E6D4"
                strokeWidth="2.1"
              />
              {/* Molecular Lactate */}
              <path
                d={linePath(streams.lac, 148, 98, 0.5, 5.5)}
                fill="none"
                stroke="#67E8F9"
                strokeOpacity="0.65"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              <text x={X0} y="48" className="fill-physio font-mono text-[9.5px]">
                HRV (ms)
              </text>
              <text x={X0} y="160" className="fill-tech font-mono text-[9.5px]">
                CORTISOL (solid) · LACTATE (dashed)
              </text>

              {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => (
                <text
                  key={i}
                  x={xAt(i)}
                  y={278}
                  textAnchor="middle"
                  className="fill-fog/60 font-mono text-[10px]"
                >
                  {fmt(i)}
                </text>
              ))}

              <line x1={xAt(cursor)} x2={xAt(cursor)} y1={28} y2={252} stroke="rgba(255,255,255,0.4)" />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.hrv[cursor], 36, 94, 20, 85)}
                r="4"
                fill="#050B18"
                stroke="#4C8DFF"
                strokeWidth="2"
              />
              <circle
                cx={xAt(cursor)}
                cy={yVal(streams.cort[cursor], 148, 98, 0, 24)}
                r="4"
                fill="#050B18"
                stroke="#19E6D4"
                strokeWidth="2"
              />
            </svg>

            <div className="mt-4 border-t border-white/10 pt-5">
              <p className="text-sm leading-relaxed text-white/90">
                Both <span className="font-mono text-physio">09:30</span> and{" "}
                <span className="font-mono text-alert">14:30</span> show an HRV drop on a conventional
                watch. By fusing sweat biochemistry,{" "}
                <strong className="font-semibold text-white">MedSense Watch</strong> distinguishes{" "}
                <span className="text-accent">metabolic exertion</span> (lactate surge, baseline
                cortisol) from <span className="text-tech">sedentary HPA stress</span> (+62 %
                cortisol, resting lactate).
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
