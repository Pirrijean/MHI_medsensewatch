"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import { track } from "@/lib/analytics";

const phases = [
  {
    id: "sampling",
    title: "Capillary Laminar Sampling",
    potential: "E = 0.00 V (OCP)",
    metric: "Q = 0.82 µL/min · Re < 0.1",
    text: "Eccrine sweat enters through a micro-pillar inlet filter into an 80 µm microfluidic channel under passive capillary pressure, establishing a clean laminar parabolic flow across the 3-electrode cell.",
  },
  {
    id: "recognition",
    title: "Steric & H-Bond MIP Binding",
    potential: "Incubation · pH 6.42",
    metric: "Kd ≈ nM–µM · Selectivity > 98 %",
    text: "Target biomarkers diffuse across the Nernst boundary layer and dock into shape- and functional-group-complementary cavities electropolymerized in the MIP film, while interferents are sterically excluded.",
  },
  {
    id: "transduction",
    title: "DPV / EIS Signal Transduction",
    potential: "Scan −0.2 → +0.4 V vs Ag/AgCl",
    metric: "ΔI_peak ∝ [Analyte] (Langmuir)",
    text: "Cavity occupancy modulates interfacial charge-transfer resistance (Rct) on the Au / PEDOT:PSS working electrode. Differential pulse voltammetry quantifies ΔI, compensated in real time by sweat pH and skin temperature.",
  },
  {
    id: "regeneration",
    title: "Electrochemical Desorption",
    potential: "Pulse +0.60 V vs Ag/AgCl",
    metric: "Baseline restored > 97 %",
    text: "A controlled potential pulse perturbs local interfacial pH and electrostatic equilibrium, releasing bound target molecules into the capillary outlet stream to reset the MIP cavities for the next cycle.",
  },
] as const;

type Phase = (typeof phases)[number]["id"];

const CAVITIES = [148, 224, 300, 376, 452];
const CH_TOP = 64;
const CH_BOT = 138;
const MIP_Y = 138;
const CAV_Y = 149;

const steroidGlyph = "M-9,2 L-4,-5 L4,-5 L8,2 L4,8 L-4,8 Z M8,2 L13,-2 L16,4 L11,8";

/** Realistic DPV voltammogram curves (I vs E vs Ag/AgCl): baseline peak vs suppressed peak upon MIP binding. */
const dpvCurve: Record<Phase, string> = {
  sampling:
    "M592 214 C 614 212, 628 206, 642 170 C 654 114, 666 102, 676 102 C 686 102, 698 114, 710 170 C 724 206, 738 212, 756 214",
  recognition:
    "M592 214 C 614 213, 628 209, 642 184 C 654 146, 666 136, 676 136 C 686 136, 698 146, 710 184 C 724 209, 738 213, 756 214",
  transduction:
    "M592 214 C 614 213, 628 211, 642 196 C 654 172, 666 164, 676 164 C 686 164, 698 172, 710 196 C 724 211, 738 213, 756 214",
  regeneration:
    "M592 214 C 614 212, 628 206, 642 172 C 654 118, 666 106, 676 106 C 686 106, 698 118, 710 172 C 724 206, 738 212, 756 214",
};

/**
 * Technically realistic cross-section of a 3-electrode MIP microfluidic biosensor:
 * - Laminar parabolic velocity profile in an 80 µm capillary microchannel
 * - Au / PEDOT:PSS working electrode + Ag/AgCl reference + Pt counter electrode
 * - Steric cavity docking vs interferent rejection
 * - Differential Pulse Voltammetry (DPV) peak attenuation ΔI_p & +0.60 V desorption reset
 */
export function MicrofluidicFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const phase = phases[idx].id;

  useEffect(() => {
    if (!playing || !inView || reduce) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % phases.length), 4600);
    return () => clearTimeout(t);
  }, [idx, playing, inView, reduce]);

  const choose = (i: number) => {
    setIdx(i);
    setPlaying(false);
    track("tech_interaction", { component: "biosensor", phase: phases[i].id });
  };

  const flowing = !reduce;
  const bound = phase === "recognition" || phase === "transduction";

  return (
    <div ref={ref} className="border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10.5px] tracking-wider text-tech uppercase">
            3-Electrode Microfluidic MIP Cell · {phases[idx].potential}
          </p>
          <p className="mt-0.5 font-mono text-xs text-fog">{phases[idx].metric}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-fog uppercase transition-colors hover:text-white"
          aria-label={playing ? "Pause biosensor cycle" : "Play biosensor cycle"}
        >
          {playing ? <Pause className="size-3" aria-hidden /> : <Play className="size-3" aria-hidden />}
          {playing ? "Pause" : "Auto-cycle"}
        </button>
      </div>

      <svg
        viewBox="0 0 776 310"
        className="mt-4 w-full"
        role="img"
        aria-label={`Electrochemical MIP biosensor cross-section — ${phases[idx].title}: ${phases[idx].text}`}
      >
        <defs>
          <linearGradient id="laminar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#19e6d4" stopOpacity="0.04" />
            <stop offset="0.5" stopColor="#19e6d4" stopOpacity="0.16" />
            <stop offset="1" stopColor="#19e6d4" stopOpacity="0.06" />
          </linearGradient>
          <clipPath id="channel-clip">
            <rect x="44" y={CH_TOP} width="506" height={CH_BOT - CH_TOP + 26} />
          </clipPath>
        </defs>

        {/* Eccrine sweat inlet & micro-pillar filter */}
        <path
          d="M18 242 C 18 158, 22 101, 44 101"
          fill="none"
          stroke="rgba(25,230,212,0.4)"
          strokeWidth="2"
          strokeDasharray="4 5"
          className={flowing ? "animate-dash-flow" : ""}
        />
        <text x="6" y="260" className="fill-fog font-mono text-[9.5px]">
          ECCRINE SWEAT
        </text>
        {/* Micro-filter pillars */}
        {[74, 92, 110, 126].map((py) => (
          <rect key={py} x="48" y={py} width="3" height="8" rx="1" fill="rgba(159,176,200,0.45)" />
        ))}

        {/* Top PDMS polymer ceiling */}
        <rect x="44" y={CH_TOP - 10} width="506" height="10" rx="2" fill="rgba(148,178,220,0.12)" />
        <text x="46" y={CH_TOP - 16} className="fill-fog font-mono text-[9.5px] tracking-wider">
          PDMS MICROCHANNEL (h = 80 µm) · LAMINAR CAPILLARY FLOW
        </text>
        <text x="550" y={CH_TOP - 16} textAnchor="end" className="fill-tech/80 font-mono text-[9.5px]">
          CAPILLARY PUMP →
        </text>

        {/* Fluidic lumen */}
        <rect
          x="44"
          y={CH_TOP}
          width="506"
          height={CH_BOT - CH_TOP}
          fill="url(#laminar-grad)"
          stroke="rgba(25,230,212,0.38)"
        />

        {/* Parabolic laminar velocity profile v(y) */}
        <g opacity="0.42">
          <path d="M72 68 Q 98 101 72 134" fill="none" stroke="#19e6d4" strokeWidth="1" />
          {[78, 90, 101, 112, 124].map((y, k) => {
            const len = [10, 18, 23, 18, 10][k];
            return (
              <line
                key={y}
                x1="72"
                x2={72 + len}
                y1={y}
                y2={y}
                stroke="#19e6d4"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* Nernst diffusion layer dashed line */}
        <line
          x1="108"
          x2="492"
          y1={MIP_Y - 12}
          y2={MIP_Y - 12}
          stroke="rgba(103,232,249,0.22)"
          strokeDasharray="3 5"
        />

        {/* Electropolymerized MIP Recognition Layer (d ~ 120 nm) */}
        <rect
          x="108"
          y={MIP_Y}
          width="384"
          height="28"
          fill="rgba(31,191,154,0.24)"
          stroke="#1fbf9a"
          strokeOpacity="0.7"
        />
        {CAVITIES.map((x) => (
          <path
            key={x}
            d={steroidGlyph}
            transform={`translate(${x} ${CAV_Y})`}
            fill="#071224"
            stroke="#1fbf9a"
            strokeWidth="1.1"
            strokeDasharray="2 1.5"
          />
        ))}
        <text x="108" y={MIP_Y + 43} className="fill-bio font-mono text-[9.5px] tracking-wider">
          MIP FILM + PEDOT:PSS TRANSDUCER
        </text>

        {/* 3-Electrode Substrate: RE (Ag/AgCl), WE (Au), CE (Pt) */}
        {/* Reference Electrode */}
        <rect x="60" y={MIP_Y + 48} width="38" height="10" rx="2" fill="#b8c4d6" />
        <text x="79" y={MIP_Y + 72} textAnchor="middle" className="fill-fog font-mono text-[8.5px]">
          RE Ag/AgCl
        </text>

        {/* Working Electrode */}
        <motion.rect
          x="108"
          y={MIP_Y + 48}
          width="384"
          height="10"
          rx="2"
          fill="#d6ad4f"
          animate={{ opacity: phase === "transduction" || phase === "regeneration" ? 1 : 0.7 }}
        />
        <text x="300" y={MIP_Y + 72} textAnchor="middle" className="fill-[#f3d48a] font-mono text-[9px] tracking-wider">
          WE · Au WORKING ELECTRODE
        </text>

        {/* Counter Electrode */}
        <rect x="502" y={MIP_Y + 48} width="38" height="10" rx="2" fill="#7c8da6" />
        <text x="521" y={MIP_Y + 72} textAnchor="middle" className="fill-fog font-mono text-[8.5px]">
          CE Pt
        </text>

        {/* +0.60 V Regeneration potential field lines */}
        {phase === "regeneration" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.rect
              x="104"
              y={MIP_Y - 4}
              width="392"
              height="66"
              rx="4"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="1.3"
              animate={reduce ? undefined : { opacity: [0.25, 0.95, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.1 }}
            />
            {CAVITIES.map((cx) => (
              <path
                key={`rep-${cx}`}
                d={`M${cx} ${CAV_Y - 2} V${CAV_Y - 24}`}
                stroke="#67e8f9"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            ))}
          </motion.g>
        )}

        {/* Potentiostat signal bus to DPV Voltammogram */}
        <path
          d={`M492 ${MIP_Y + 53} H568 V214 H592`}
          fill="none"
          stroke="rgba(214,173,79,0.55)"
          strokeWidth="1.4"
        />
        {(phase === "transduction" || phase === "regeneration") && (
          <path
            d={`M492 ${MIP_Y + 53} H568 V214 H592`}
            fill="none"
            stroke="#67e8f9"
            strokeWidth="2.2"
            strokeDasharray="3 10"
            className={flowing ? "animate-dash-flow" : ""}
          />
        )}

        {/* Right: Differential Pulse Voltammetry (DPV) analytical readout */}
        <g>
          <text x="592" y="62" className="fill-white font-mono text-[10px] tracking-wider">
            DPV READOUT · I (µA)
          </text>
          <line x1="592" x2="760" y1="214" y2="214" stroke="rgba(148,178,220,0.32)" />
          <line x1="592" x2="592" y1="78" y2="214" stroke="rgba(148,178,220,0.32)" />

          {/* Ghost baseline peak for ΔI comparison */}
          <path
            d={dpvCurve.sampling}
            fill="none"
            stroke="rgba(148,178,220,0.25)"
            strokeWidth="1.3"
            strokeDasharray="3 3"
          />

          {/* Live DPV curve */}
          <motion.path
            d={dpvCurve[phase]}
            animate={{ d: dpvCurve[phase] }}
            transition={reduce ? { duration: 0 } : { duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            fill="none"
            stroke="#19e6d4"
            strokeWidth="2.2"
          />

          {/* ΔI_peak annotation during transduction */}
          {phase === "transduction" && (
            <g>
              <line x1="676" x2="676" y1="102" y2="164" stroke="#ffb547" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="684" y="136" className="fill-alert font-mono text-[9.5px]">
                ΔI_p
              </text>
            </g>
          )}

          <text x="676" y="232" textAnchor="middle" className="fill-fog font-mono text-[9px]">
            E (V vs Ag/AgCl)
          </text>
          <text x="676" y="252" textAnchor="middle" className="fill-tech font-mono text-[9.5px]">
            pH 6.42 · 33.6 °C comp.
          </text>
        </g>

        {/* Flowing non-target interferents (lactate, urea, Na+, Cl-) — sterically rejected */}
        <g clipPath="url(#channel-clip)">
          {Array.from({ length: 8 }, (_, i) => {
            const y = 76 + ((i * 13) % 44);
            const start = 36 + i * 72;
            return (
              <motion.g
                key={`int-${i}`}
                initial={{ x: start, y }}
                animate={flowing ? { x: [start - 560, start + 24] } : { x: start }}
                transition={
                  flowing
                    ? { repeat: Infinity, duration: 6.4, ease: "linear", delay: -i * 0.8 }
                    : undefined
                }
              >
                {i % 2 ? (
                  <circle r="4.2" fill="none" stroke="#9fb0c8" strokeOpacity="0.65" strokeWidth="1.2" />
                ) : (
                  <polygon
                    points="-4,3 0,-4 4,3"
                    fill="none"
                    stroke="#9fb0c8"
                    strokeOpacity="0.65"
                    strokeWidth="1.2"
                  />
                )}
              </motion.g>
            );
          })}

          {/* Target biomarker molecules matching MIP cavity geometry */}
          {CAVITIES.map((cx, i) => {
            const laneY = 82 + ((i * 11) % 34);
            const flowX = 72 + i * 92;
            let animate: TargetAndTransition;
            let transition: Transition;

            if (phase === "sampling") {
              animate = flowing
                ? { x: [flowX - 480, flowX], y: laneY, opacity: 1 }
                : { x: flowX, y: laneY, opacity: 1 };
              transition = flowing
                ? {
                    x: { repeat: Infinity, duration: 5.2, ease: "linear", delay: -i * 1.0 },
                    y: { duration: 0.5 },
                    opacity: { duration: 0.3 },
                  }
                : { duration: 0 };
            } else if (bound) {
              animate = { x: cx, y: CAV_Y, opacity: 1 };
              transition = reduce
                ? { duration: 0 }
                : { duration: 0.95, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] };
            } else {
              animate = { x: cx + 140, y: laneY - 8, opacity: 0 };
              transition = reduce
                ? { duration: 0 }
                : { duration: 1.4, delay: 0.25 + i * 0.09, ease: "easeIn" };
            }

            return (
              <motion.g
                key={`target-${i}`}
                initial={{ x: flowX, y: laneY, opacity: 1 }}
                animate={animate}
                transition={transition}
              >
                <path
                  d={steroidGlyph}
                  fill="#19e6d4"
                  fillOpacity={bound ? 0.95 : 0.78}
                  stroke="#d4fffb"
                  strokeWidth="0.9"
                />
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* Clean 4-phase stepper */}
      <div role="tablist" aria-label="Biosensor operating phases" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {phases.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            onClick={() => choose(i)}
            className="group cursor-pointer text-left"
          >
            <span className="block h-[2px] overflow-hidden rounded-full bg-white/10">
              <motion.span
                key={`${idx}-${playing}`}
                className="block h-full bg-tech"
                initial={{ width: i < idx ? "100%" : "0%" }}
                animate={{
                  width:
                    i < idx || (i === idx && (!playing || reduce))
                      ? "100%"
                      : i === idx
                        ? "100%"
                        : "0%",
                }}
                transition={
                  i === idx && playing && !reduce ? { duration: 4.6, ease: "linear" } : { duration: 0 }
                }
              />
            </span>
            <span
              className={`mt-2.5 block font-mono text-[10.5px] tracking-wider uppercase ${
                i === idx ? "text-tech" : "text-fog/65 group-hover:text-fog"
              }`}
            >
              {p.title}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 min-h-[64px] text-[15px] leading-relaxed text-white/85" aria-live="polite">
        {phases[idx].text}
      </p>
    </div>
  );
}
