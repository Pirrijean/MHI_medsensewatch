"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { track } from "@/lib/analytics";

type WatchMode = {
  id: "fusion" | "molecular" | "cardio" | "hydration" | "ai";
  short: string;
  watchTitle: string;
};

const watchModes: WatchMode[] = [
  { id: "fusion", short: "Live Fusion", watchTitle: "MULTIMODAL" },
  { id: "molecular", short: "MIP Biomarkers", watchTitle: "MOLECULAR" },
  { id: "cardio", short: "ECG & Vitals", watchTitle: "CARDIO · PPG" },
  { id: "hydration", short: "pH & Thermal", watchTitle: "MICROFLUIDICS" },
  { id: "ai", short: "Personal AI", watchTitle: "BASELINE AI" },
];

type HardwareNode = {
  id: string;
  label: string;
  detail: string;
  liveMetric: string;
  targetMode: WatchMode["id"];
  side: "left" | "right";
  /** Anchor on the 620x620 stage */
  ax: number;
  ay: number;
  /** Label endpoint on the 620x620 stage */
  lx: number;
  ly: number;
  color: string;
};

const hardwareNodes: HardwareNode[] = [
  {
    id: "oled",
    label: "Sapphire OLED Interface",
    detail: "Live multimodal telemetry & on-wrist insights",
    liveMetric: "5 live views · 60 Hz",
    targetMode: "fusion",
    side: "left",
    ax: 215,
    ay: 175,
    lx: 118,
    ly: 128,
    color: "#67E8F9",
  },
  {
    id: "ppg",
    label: "Optical PPG · SpO₂ · Temp",
    detail: "Multi-λ photodiodes + contact skin thermistor",
    liveMetric: "58 bpm · 98 % · 33.6 °C",
    targetMode: "cardio",
    side: "right",
    ax: 392,
    ay: 332,
    lx: 500,
    ly: 286,
    color: "#4C8DFF",
  },
  {
    id: "potentiostat",
    label: "Bioelectronic Readout",
    detail: "4-ch potentiostat + +0.6 V surface regeneration",
    liveMetric: "ΔI / EIS · pA resolution",
    targetMode: "ai",
    side: "left",
    ax: 238,
    ay: 368,
    lx: 118,
    ly: 356,
    color: "#67E8F9",
  },
  {
    id: "mip",
    label: "4-Ch MIP Biochemical Array",
    detail: "Cortisol · Glucose · Lactate · Urea cavities",
    liveMetric: "11.8 ng/mL · 92 µM",
    targetMode: "molecular",
    side: "right",
    ax: 382,
    ay: 444,
    lx: 500,
    ly: 432,
    color: "#19E6D4",
  },
  {
    id: "fluidic",
    label: "Sweat Microfluidics & pH",
    detail: "Capillary renewal · ionic & pH calibration",
    liveMetric: "pH 6.4 · 0.82 µL/min",
    targetMode: "hydration",
    side: "left",
    ax: 250,
    ay: 476,
    lx: 118,
    ly: 492,
    color: "#1FBF9A",
  },
];

/** Renders the live UI directly inside the MedSense Watch OLED screen. */
function WatchFaceScreen({ mode }: { mode: WatchMode["id"] }) {
  if (mode === "fusion") {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-tech opacity-75" />
              <span className="relative size-2 rounded-full bg-tech" />
            </span>
            <span className="font-mono text-[9px] tracking-widest text-tech uppercase">
              Fused Live
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/70">09:41</span>
        </div>

        {/* Central multimodal coherence ring + vitals */}
        <div className="my-1 flex items-center gap-3">
          <div className="relative grid size-[68px] shrink-0 place-items-center">
            <svg viewBox="0 0 72 72" className="size-full -rotate-90">
              <circle cx="36" cy="36" r="30" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
              <circle
                cx="36"
                cy="36"
                r="30"
                stroke="#19E6D4"
                strokeWidth="5"
                strokeDasharray="188.5"
                strokeDashoffset="15"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="36"
                cy="36"
                r="22"
                stroke="#4C8DFF"
                strokeWidth="3.5"
                strokeDasharray="138"
                strokeDashoffset="22"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute text-center leading-none">
              <span className="font-display text-[15px] font-bold text-white">94</span>
              <span className="block font-mono text-[7px] text-fog uppercase">Sync</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 font-mono text-[10px]">
            <div className="flex items-baseline justify-between">
              <span className="text-physio">HR / HRV</span>
              <span className="text-white">58 · 62ms</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-tech">Cortisol</span>
              <span className="text-white">11.8 ng/mL</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-bio">Glucose</span>
              <span className="text-white">92 µM</span>
            </div>
          </div>
        </div>

        {/* Bottom strip: pH, Temp, Lactate */}
        <div className="space-y-1.5 border-t border-white/10 pt-2">
          <svg viewBox="0 0 180 22" className="h-4 w-full" aria-hidden>
            <path
              d="M0 14 L22 14 L27 10 L32 14 L40 14 L44 18 L49 3 L54 19 L59 14 L82 14 L87 10 L92 14 L100 14 L104 18 L109 3 L114 19 L119 14 L145 14 L150 18 L155 4 L160 19 L165 14 L180 14"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex items-center justify-between font-mono text-[8.5px] text-fog">
            <span>pH 6.4</span>
            <span>33.6 °C</span>
            <span className="text-tech">LAC 1.4 mM</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "molecular") {
    const channels = [
      { k: "CORT", v: "11.8", u: "ng/mL", pct: "62%", c: "bg-tech" },
      { k: "GLU", v: "92", u: "µM", pct: "54%", c: "bg-bio" },
      { k: "LAC", v: "1.4", u: "mM", pct: "38%", c: "bg-accent" },
      { k: "UREA", v: "18.6", u: "mM", pct: "71%", c: "bg-physio" },
    ];
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-bio uppercase">
            MIP Sweat Array
          </span>
          <span className="font-mono text-[8.5px] text-tech">Cycle 14/36</span>
        </div>

        <div className="my-1 space-y-2">
          {channels.map((ch) => (
            <div key={ch.k} className="space-y-0.5">
              <div className="flex items-baseline justify-between font-mono text-[9.5px]">
                <span className="text-white/90">{ch.k}</span>
                <span className="text-white">
                  {ch.v} <span className="text-[8px] text-fog">{ch.u}</span>
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${ch.c}`} style={{ width: ch.pct }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8.5px] text-fog">
          <span>MIP Selectivity 99.2%</span>
          <span className="text-bio">Regen Ready</span>
        </div>
      </div>
    );
  }

  if (mode === "cardio") {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-physio uppercase">
            Single-Lead ECG
          </span>
          <span className="font-mono text-[9px] text-white/75">Sinus</span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-white">58</span>
            <span className="font-mono text-[9px] text-physio">BPM</span>
            <span className="ml-auto font-mono text-[10px] text-accent">62 ms HRV</span>
          </div>
          <svg viewBox="0 0 180 46" className="mt-1.5 h-11 w-full" aria-hidden>
            <path
              d="M0 30 L18 30 L24 25 L30 30 L38 30 L42 36 L47 6 L52 41 L57 30 L68 30 L75 21 L82 30 L108 30 L114 25 L120 30 L128 30 L132 36 L137 6 L142 41 L147 30 L158 30 L165 21 L172 30 L180 30"
              fill="none"
              stroke="#4C8DFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8.5px] text-fog">
          <span>SpO₂ 98 %</span>
          <span>14.2 brpm</span>
          <span className="text-physio">PPG Lock</span>
        </div>
      </div>
    );
  }

  if (mode === "hydration") {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-tech uppercase">
            Fluidic & Thermal
          </span>
          <span className="font-mono text-[8.5px] text-bio">Active Flow</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 py-1 font-mono">
          <div>
            <span className="block text-[8px] text-fog uppercase">Sweat pH</span>
            <span className="text-sm font-semibold text-white">6.42</span>
          </div>
          <div>
            <span className="block text-[8px] text-fog uppercase">Skin Temp</span>
            <span className="text-sm font-semibold text-white">33.6 °C</span>
          </div>
          <div>
            <span className="block text-[8px] text-fog uppercase">Flow Rate</span>
            <span className="text-xs text-tech">0.82 µL/m</span>
          </div>
          <div>
            <span className="block text-[8px] text-fog uppercase">Na⁺ Ref</span>
            <span className="text-xs text-bio">41 mM</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8.5px] text-fog">
          <span>Temp-calibrated</span>
          <span className="text-tech">Chamber Fresh</span>
        </div>
      </div>
    );
  }

  // Personal AI mode
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-widest text-accent uppercase">
          Personal Model
        </span>
        <span className="font-mono text-[8.5px] text-tech">±0.4σ</span>
      </div>

      <div className="py-1">
        <p className="font-display text-xs leading-snug font-semibold text-white">
          Circadian &amp; metabolic profile aligned
        </p>
        <svg viewBox="0 0 180 40" className="mt-2 h-9 w-full" aria-hidden>
          <path
            d="M0 24 C 35 16, 70 28, 110 18 C 140 12, 160 16, 180 14 L 180 30 C 160 32, 140 28, 110 33 C 70 39, 35 30, 0 35 Z"
            fill="rgba(25,230,212,0.16)"
          />
          <path
            d="M0 29 C 35 22, 70 33, 110 25 C 140 19, 160 23, 180 21"
            fill="none"
            stroke="#19E6D4"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8.5px] text-fog">
        <span>30-day rolling ref</span>
        <span className="text-accent">No anomalies</span>
      </div>
    </div>
  );
}

/**
 * Interactive semi-disassembled MedSense Watch hero centerpiece:
 * - Upper assembly: machined titanium case with a living, multi-mode OLED display
 * - Middle assembly: optical PPG / skin thermistor / potentiostat flex module
 * - Lower assembly: translucent microfluidic MIP biochemical sensor cartridge
 * Hovering any callout or mode switches the live watch screen in real time.
 */
export function HeroWatchShowcase() {
  const reduce = useReducedMotion();
  const [modeIdx, setModeIdx] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [exploded, setExploded] = useState(true);

  useEffect(() => {
    if (paused || reduce) return;
    const timer = setInterval(() => {
      setModeIdx((i) => (i + 1) % watchModes.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [paused, reduce]);

  const currentMode = watchModes[modeIdx];

  const handleHoverNode = (node: HardwareNode | null) => {
    if (!node) {
      setHoveredNode(null);
      setPaused(false);
      return;
    }
    setHoveredNode(node.id);
    setPaused(true);
    const idx = watchModes.findIndex((m) => m.id === node.targetMode);
    if (idx >= 0) setModeIdx(idx);
    track("tech_interaction", { component: "hero_watch", sensor: node.id });
  };

  // Vertical separation offsets when semi-disassembled vs assembled
  const caseY = exploded ? -34 : 0;
  const sensorY = exploded ? 26 : -4;
  const cartridgeY = exploded ? 94 : 10;

  return (
    <div
      className="relative mx-auto w-full max-w-[650px] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setHoveredNode(null);
      }}
    >
      {/* Subtle radial studio spotlight — no lines, no flying particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(25,230,212,0.13)_0%,rgba(76,141,255,0.08)_42%,transparent_72%)] blur-2xl"
      />

      {/* Interactive Hardware Stage */}
      <div className="relative aspect-square w-full">
        {/* SVG Callout Leader Lines (visible in semi-disassembled state on sm+) */}
        {exploded && (
          <svg
            viewBox="0 0 620 620"
            className="pointer-events-none absolute inset-0 z-30 hidden h-full w-full sm:block"
            aria-hidden
          >
            {hardwareNodes.map((n) => {
              const active = hoveredNode === n.id || (!hoveredNode && currentMode.id === n.targetMode);
              const elbowX = n.side === "left" ? n.lx + 24 : n.lx - 24;
              return (
                <g key={n.id} opacity={active ? 1 : 0.48} className="transition-opacity duration-300">
                  <polyline
                    points={`${n.ax},${n.ay} ${elbowX},${n.ly} ${n.lx},${n.ly}`}
                    fill="none"
                    stroke={active ? n.color : "rgba(159,176,200,0.45)"}
                    strokeWidth={active ? "1.3" : "1"}
                  />
                  <circle cx={n.ax} cy={n.ay} r={active ? "3.8" : "2.8"} fill={n.color} />
                  <circle
                    cx={n.ax}
                    cy={n.ay}
                    r="8"
                    fill="none"
                    stroke={n.color}
                    strokeOpacity={active ? "0.45" : "0"}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Interactive Callout Text Anchors (no heavy boxes — clean floating typography) */}
        {exploded && (
          <div className="hidden sm:block">
            {hardwareNodes.map((n) => {
              const active = hoveredNode === n.id || (!hoveredNode && currentMode.id === n.targetMode);
              const leftPct = (n.lx / 620) * 100;
              const topPct = (n.ly / 620) * 100;
              return (
                <button
                  key={n.id}
                  type="button"
                  onMouseEnter={() => handleHoverNode(n)}
                  onFocus={() => handleHoverNode(n)}
                  onBlur={() => handleHoverNode(null)}
                  style={{
                    top: `${topPct}%`,
                    ...(n.side === "left"
                      ? { right: `${100 - leftPct + 1.2}%`, textAlign: "right" as const }
                      : { left: `${leftPct + 1.2}%`, textAlign: "left" as const }),
                  }}
                  className="group absolute z-40 max-w-[148px] -translate-y-1/2 cursor-pointer transition-opacity focus:outline-none"
                >
                  <span
                    className={`block font-display text-[11.5px] leading-tight font-semibold transition-colors ${
                      active ? "text-white" : "text-fog/75 group-hover:text-white"
                    }`}
                  >
                    {n.label}
                  </span>
                  <span
                    className="mt-0.5 block font-mono text-[9.5px] leading-tight transition-colors"
                    style={{ color: active ? n.color : "rgba(159,176,200,0.6)" }}
                  >
                    {n.liveMetric}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ============================================================
            SEMI-DISASSEMBLED MEDSENSE WATCH HARDWARE STACK
            ============================================================ */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Top Strap Silhouette */}
          <motion.div
            animate={{ y: caseY }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            className="pointer-events-none absolute h-[74px] w-[124px] -translate-y-[156px] rounded-t-[34px] bg-gradient-to-b from-transparent via-[#141d2e] to-[#1d273b] opacity-90"
          />

          {/* Bottom Strap Silhouette */}
          <motion.div
            animate={{ y: cartridgeY }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            className="pointer-events-none absolute h-[78px] w-[124px] translate-y-[128px] rounded-b-[34px] bg-gradient-to-t from-transparent via-[#121a2a] to-[#1a2436] opacity-85"
          />

          {/* LAYER 3 (BOTTOM): Translucent Microfluidic MIP Biochemical Cartridge */}
          <motion.div
            animate={{ y: cartridgeY }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => handleHoverNode(hardwareNodes[3])}
            className="absolute z-10 cursor-pointer"
          >
            <svg
              viewBox="0 0 240 132"
              className="w-[218px] drop-shadow-[0_24px_38px_rgba(0,0,0,0.75)] sm:w-[238px]"
              aria-label="Translucent microfluidic biochemical MIP cartridge"
            >
              <defs>
                <linearGradient id="cart-body" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#19E6D4" stopOpacity="0.22" />
                  <stop offset="0.5" stopColor="#0C2233" stopOpacity="0.88" />
                  <stop offset="1" stopColor="#1FBF9A" stopOpacity="0.26" />
                </linearGradient>
              </defs>
              {/* Isometric cushion slab thickness */}
              <path
                d="M28 50 L120 14 L212 50 L212 63 L120 105 L28 63 Z"
                fill="#091a28"
                stroke="rgba(25,230,212,0.4)"
                strokeWidth="1"
              />
              {/* Top translucent face */}
              <path
                d="M28 50 L120 14 L212 50 L120 88 Z"
                fill="url(#cart-body)"
                stroke="#19E6D4"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
              {/* Serpentine capillary microchannels */}
              <path
                d="M66 50 L118 29 L130 34 L78 55 L90 60 L144 39 L156 44 L104 65 L120 71 L172 50"
                fill="none"
                stroke="#19E6D4"
                strokeOpacity="0.55"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 5"
                className={reduce ? "" : "animate-dash-flow"}
              />
              {/* Four gold/MIP circular sensing electrodes (Cortisol, Glucose, Lactate, Urea) */}
              {[
                { cx: 92, cy: 46 },
                { cx: 111, cy: 53 },
                { cx: 130, cy: 46 },
                { cx: 149, cy: 53 },
              ].map((el, idx) => (
                <g key={idx}>
                  <ellipse cx={el.cx} cy={el.cy} rx="6.2" ry="3.8" fill="#D6AD4F" />
                  <ellipse cx={el.cx} cy={el.cy} rx="3.6" ry="2.1" fill="#112638" stroke="#19E6D4" strokeWidth="0.7" />
                </g>
              ))}
              {/* pH & Sweat Inlet port */}
              <ellipse cx="70" cy="52" rx="4.5" ry="2.7" fill="#050B18" stroke="#1FBF9A" strokeWidth="1.2" />
              {/* Gold contact pads along rim */}
              {[0, 1, 2, 3].map((k) => (
                <rect
                  key={k}
                  x={152 + k * 9}
                  y={32 + k * 3.4}
                  width="5"
                  height="2.5"
                  rx="0.6"
                  fill="#F3D48A"
                  transform="rotate(21 160 36)"
                />
              ))}
            </svg>
          </motion.div>

          {/* LAYER 2 (MIDDLE): Optical PPG Puck + Skin Thermistor + Potentiostat Flex */}
          <motion.div
            animate={{ y: sensorY }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => handleHoverNode(hardwareNodes[1])}
            className="absolute z-20 cursor-pointer"
          >
            <svg
              viewBox="0 0 220 100"
              className="w-[196px] drop-shadow-[0_18px_28px_rgba(0,0,0,0.75)] sm:w-[214px]"
              aria-label="Optical PPG, thermal sensor and bioelectronic readout module"
            >
              {/* Polyimide gold flex bridge */}
              <path
                d="M42 52 L110 24 L178 52 L110 80 Z"
                fill="#1A2232"
                stroke="#4A5A74"
                strokeWidth="1.1"
              />
              <path
                d="M58 52 L110 31 L162 52 L110 73 Z"
                fill="none"
                stroke="#D6AD4F"
                strokeOpacity="0.55"
                strokeWidth="1"
              />
              {/* Ceramic optical sensor dome */}
              <ellipse cx="110" cy="52" rx="38" ry="18" fill="#0D131F" stroke="#5E7191" strokeWidth="1.2" />
              {/* Green + Red/IR LEDs & photodiodes */}
              <rect x="95" y="46" width="8" height="4.5" rx="1.2" fill="#2BD47D" />
              <rect x="117" y="53" width="8" height="4.5" rx="1.2" fill="#FF4D5E" />
              <rect x="117" y="46" width="8" height="4.5" rx="1" fill="#1F2B3E" stroke="#67E8F9" strokeWidth="0.6" />
              <rect x="95" y="53" width="8" height="4.5" rx="1" fill="#1F2B3E" stroke="#67E8F9" strokeWidth="0.6" />
              {/* Contact skin thermistor */}
              <ellipse cx="138" cy="52" rx="3.5" ry="2.2" fill="#F3D48A" />
            </svg>
          </motion.div>

          {/* Vertical alignment laser hairlines when semi-disassembled */}
          {exploded && (
            <svg
              viewBox="0 0 240 340"
              className="pointer-events-none absolute z-15 h-[310px] w-[220px]"
              aria-hidden
            >
              <line x1="62" y1="150" x2="62" y2="262" stroke="rgba(25,230,212,0.22)" strokeDasharray="2 4" />
              <line x1="178" y1="150" x2="178" y2="262" stroke="rgba(76,141,255,0.22)" strokeDasharray="2 4" />
            </svg>
          )}

          {/* LAYER 1 (TOP): Titanium Watch Chassis + Live Multi-Screen OLED Display */}
          <motion.div
            animate={{ y: caseY }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-25"
          >
            {/* Outer machined titanium cushion case */}
            <div className="relative h-[238px] w-[198px] rounded-[46px] bg-gradient-to-br from-[#6b778d] via-[#2c3547] to-[#141b28] p-[5px] shadow-[0_28px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.45)] sm:h-[252px] sm:w-[210px]">
              {/* Digital Crown & Side Action Button */}
              <button
                type="button"
                aria-label="Switch MedSense Watch display mode"
                onClick={() => {
                  setPaused(true);
                  setModeIdx((i) => (i + 1) % watchModes.length);
                }}
                className="absolute top-[54px] -right-[7px] h-10 w-[7px] cursor-pointer rounded-r-md bg-gradient-to-b from-[#8b98b0] via-[#414d63] to-[#232b3a] shadow-md transition-transform hover:scale-y-105"
              />
              <div
                aria-hidden
                className="absolute top-[112px] -right-[5px] h-14 w-[5px] rounded-r-sm bg-gradient-to-b from-[#69768d] to-[#242c3b]"
              />

              {/* Inner ceramic/sapphire bezel */}
              <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[41px] border border-white/12 bg-[#040914] p-4 shadow-[inset_0_0_24px_rgba(25,230,212,0.07)]">
                {/* Subtle sapphire curved glass reflection */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -left-16 h-40 w-56 rotate-[-22deg] bg-gradient-to-b from-white/[0.07] to-transparent"
                />

                {/* Live OLED Watch Content */}
                <div className="relative z-10 h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMode.id}
                      initial={reduce ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -5 }}
                      transition={{ duration: 0.24 }}
                      className="h-full"
                    >
                      <WatchFaceScreen mode={currentMode.id} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Minimalist interactive controls below the watch (no heavy cards) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {watchModes.map((m, idx) => {
          const active = idx === modeIdx;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setPaused(true);
                setModeIdx(idx);
                track("tech_interaction", { component: "hero_watch_face", mode: m.id });
              }}
              className={`relative py-1 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                active ? "text-white" : "text-fog/60 hover:text-fog"
              }`}
            >
              {m.short}
              {active && (
                <motion.span
                  layoutId="hero-watch-tab"
                  className="absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-tech"
                />
              )}
            </button>
          );
        })}

        <span className="hidden h-3 w-px bg-white/15 sm:inline-block" aria-hidden />

        <button
          type="button"
          onClick={() => setExploded((v) => !v)}
          className="font-mono text-[11px] tracking-wider text-tech/85 uppercase transition-colors hover:text-tech"
        >
          {exploded ? "Assemble watch" : "Inspect sensors"}
        </button>
      </div>
    </div>
  );
}
