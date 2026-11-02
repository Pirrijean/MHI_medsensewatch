"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { deviceLayers } from "@/data/sensors";

/* ------------------------------------------------------------------
   Flat drawings of each layer (200 × 240 units), projected isometrically
   ------------------------------------------------------------------ */
const PW = 200;
const PH = 240;
const RX = 46;
const ISO = "matrix(0.866 0.5 -0.866 0.5 17.3 -110)";

function Plate({ id, fill, stroke, edge, children }: { id: string; fill: string; stroke: string; edge: string; children?: ReactNode }) {
  return (
    <>
      {/* thickness */}
      <g transform="translate(0 7)">
        <g transform={ISO}>
          <rect width={PW} height={PH} rx={RX} fill={edge} />
        </g>
      </g>
      <g transform={ISO}>
        <defs>
          <clipPath id={`clip-${id}`}>
            <rect width={PW} height={PH} rx={RX} />
          </clipPath>
        </defs>
        <rect width={PW} height={PH} rx={RX} fill={fill} stroke={stroke} strokeWidth="1.2" />
        <g clipPath={`url(#clip-${id})`}>{children}</g>
      </g>
    </>
  );
}

const layerArt: ((on: boolean) => ReactNode)[] = [
  // 07 · processing & communication
  () => (
    <Plate id="pcb" fill="#1d2838" stroke="#3a4a63" edge="#0f1622">
      <rect x="60" y="80" width="56" height="56" rx="4" fill="#3b4a60" />
      <rect x="128" y="96" width="30" height="22" rx="3" fill="#2f3d52" />
      <rect x="40" y="150" width="34" height="26" rx="3" fill="#2f3d52" />
      <rect x="92" y="156" width="22" height="22" rx="3" fill="#2f3d52" />
      <rect x="130" y="140" width="24" height="40" rx="3" fill="#2f3d52" />
      <path d="M30 40 H170 V60 H30 V80 H170" fill="none" stroke="#19e6d4" strokeWidth="2" opacity="0.8" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={50 + i * 10} y="200" width="5" height="10" fill="#c9a24a" />
      ))}
    </Plate>
  ),
  // 01 · physiological sensor array
  () => (
    <Plate id="phys" fill="#2a3445" stroke="#4a5a74" edge="#151c27">
      <circle cx="100" cy="120" r="58" fill="#141b26" stroke="#5c6d88" strokeWidth="2" />
      <rect x="78" y="98" width="16" height="16" rx="3" fill="#2bd47d" />
      <rect x="106" y="126" width="16" height="16" rx="3" fill="#ff4d5e" />
      <rect x="106" y="98" width="16" height="16" rx="2" fill="#0b1220" stroke="#6b7c99" />
      <rect x="78" y="126" width="16" height="16" rx="2" fill="#0b1220" stroke="#6b7c99" />
      <circle cx="150" cy="70" r="6" fill="#d8b25a" />
      <circle cx="50" cy="170" r="6" fill="#d8b25a" />
    </Plate>
  ),
  // 02 · bioelectronic interface (flex)
  () => (
    <Plate id="flex" fill="#b9802c" stroke="#d9a24e" edge="#7a5218">
      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={`M${30 + i * 8} 20 V${110 + i * 6} H${120 + i * 8} V220`}
          fill="none"
          stroke="#f3d48a"
          strokeWidth="1.6"
          opacity="0.9"
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={118 + i * 8} y="205" width="5" height="14" fill="#ffe7a8" />
      ))}
    </Plate>
  ),
  // 05 · electrochemical sensing array
  () => (
    <Plate id="ec" fill="#e9edf2" stroke="#b8c2cf" edge="#aab4c2">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={100} cy={48 + i * 48} r="17" fill="#d6ad4f" />
          <circle cx={100} cy={48 + i * 48} r="10" fill="#3d4450" />
          <path d={`M117 ${48 + i * 48} H170`} stroke="#d6ad4f" strokeWidth="2" />
        </g>
      ))}
    </Plate>
  ),
  // 03 · molecular recognition layer (MIP)
  () => (
    <Plate id="mip" fill="rgba(31,191,154,0.28)" stroke="#1fbf9a" edge="rgba(17,120,98,0.55)">
      {Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => {
          const x = 22 + c * 32 + (r % 2) * 16;
          const y = 24 + r * 32;
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (Math.PI / 3) * k;
            return `${x + 8 * Math.cos(a)},${y + 8 * Math.sin(a)}`;
          }).join(" ");
          return <polygon key={`${r}-${c}`} points={pts} fill="none" stroke="#0e8f78" strokeWidth="1.4" />;
        }),
      )}
    </Plate>
  ),
  // 06 · regeneration mechanism (counter / reference electrodes)
  () => (
    <Plate id="regen" fill="#dde3ea" stroke="#aeb9c7" edge="#9ea9b8">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M60 ${36 + i * 48} a24 24 0 1 0 80 0`}
          fill="none"
          stroke="#8f9aab"
          strokeWidth="3"
        />
      ))}
      <rect x="30" y="20" width="10" height="200" rx="5" fill="#b6bdc8" />
      <rect x="160" y="20" width="10" height="200" rx="5" fill="#4c8dff" opacity="0.55" />
    </Plate>
  ),
  // 04 · microfluidic sampling system
  (on) => (
    <Plate id="mf" fill="rgba(25,230,212,0.14)" stroke="#19e6d4" edge="rgba(15,160,150,0.45)">
      <path
        d="M30 30 H170 V62 H30 V94 H170 V126 H30 V158 H170 V190 H30 V215"
        fill="none"
        stroke="#0fb5a8"
        strokeWidth="7"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <path
        d="M30 30 H170 V62 H30 V94 H170 V126 H30 V158 H170 V190 H30 V215"
        fill="none"
        stroke="#19e6d4"
        strokeWidth="2.4"
        strokeDasharray="6 10"
        strokeLinejoin="round"
        className={on ? "animate-dash-flow" : ""}
      />
      <circle cx="30" cy="30" r="7" fill="#0b1220" stroke="#19e6d4" strokeWidth="1.5" />
      <circle cx="30" cy="215" r="7" fill="#0b1220" stroke="#19e6d4" strokeWidth="1.5" />
    </Plate>
  ),
];

/* ------------------------------------------------------------------ */
const VW = 900;
const VH = 1000;
const CX = 290;
const CY = 500;
const LABEL_X = 540;

function Layer({
  i,
  spread,
  labelOpacity,
  active,
}: {
  i: number;
  spread: MotionValue<number>;
  labelOpacity: MotionValue<number> | number;
  active: number;
}) {
  const y = useTransform(spread, (s) => CY + (i - 3) * s);
  const dim = active >= 0 && active !== i;
  const layer = deviceLayers[i];
  return (
    <motion.g style={{ y }} animate={{ opacity: dim ? 0.38 : 1 }} transition={{ duration: 0.4 }}>
      <g transform={`translate(${CX} 0)`}>{layerArt[i](active === i || active < 0)}</g>
      <motion.g style={{ opacity: labelOpacity }}>
        <line
          x1={CX + 196}
          x2={LABEL_X - 14}
          y1={-10}
          y2={-10}
          stroke={active === i ? "#0e8f86" : "rgba(11,18,32,0.25)"}
          strokeDasharray="2 4"
        />
        <circle cx={CX + 192} cy={-10} r="3.5" fill={active === i ? "#0e8f86" : "#0b1220"} />
        <text x={LABEL_X} y={-14} className="fill-[#0e8f86] font-mono text-[15px]">
          {layer.n}
        </text>
        <text x={LABEL_X + 36} y={-14} className="fill-ink font-display text-[19px] font-semibold">
          {layer.title}
        </text>
      </motion.g>
    </motion.g>
  );
}

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return d;
}

/**
 * Animation 2 — anatomy of the wearable.
 * Desktop: the stack separates with scroll, then each layer is explained in turn.
 * Mobile / reduced motion: a static exploded diagram with the full layer list.
 */
export function DeviceExplodedView() {
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const scrollMode = desktop && !reduce;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spread = useTransform(scrollYProgress, [0.02, 0.28], [16, 112], { clamp: true });
  const labels = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const staticSpread = useTransform(scrollYProgress, () => 112);
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!scrollMode) return;
    if (v < 0.3) setActive(-1);
    else setActive(Math.min(6, Math.floor(((v - 0.3) / 0.66) * 7)));
  });

  const svg = (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full" role="img" aria-label="Exploded diagram of the seven functional layers of the wearable">
      {/* drawn bottom → top so upper layers occlude lower ones */}
      {deviceLayers.map((_, k) => deviceLayers.length - 1 - k).map((i) => (
        <Layer
          key={i}
          i={i}
          spread={scrollMode ? spread : staticSpread}
          labelOpacity={scrollMode ? labels : 1}
          active={scrollMode ? active : -1}
        />
      ))}
    </svg>
  );

  if (!scrollMode) {
    return (
      <div ref={ref}>
        <div className="mx-auto aspect-[9/10] w-full max-w-[720px]">{svg}</div>
        <ol className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {[...deviceLayers]
            .sort((a, b) => a.n.localeCompare(b.n))
            .map((l) => (
              <li key={l.n} className="border-t hairline-light pt-4">
                <p className="font-mono text-xs text-[#0e8f86]">{l.n}</p>
                <p className="mt-1 font-semibold text-ink">{l.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{l.text}</p>
              </li>
            ))}
        </ol>
      </div>
    );
  }

  const current = active >= 0 ? deviceLayers[active] : null;
  return (
    <div ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full grid-cols-12 items-center gap-10">
          <div className="col-span-8 h-[86vh]">{svg}</div>
          <div className="col-span-4" aria-live="polite">
            <p className="eyebrow text-ink-soft">The wearable system</p>
            <div className="mt-6 min-h-[200px]">
              {current ? (
                <motion.div key={current.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                  <p className="font-mono text-sm text-[#0e8f86]">{current.n}</p>
                  <h3 className="mt-2 text-3xl font-semibold text-ink">{current.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-soft">{current.text}</p>
                </motion.div>
              ) : (
                <p className="text-lg leading-relaxed text-ink-soft">
                  Scroll to separate the device into its functional layers — from embedded electronics down to
                  the microfluidic interface in contact with the skin.
                </p>
              )}
            </div>
            <div className="mt-8 flex gap-1.5" aria-hidden>
              {deviceLayers.map((l, i) => (
                <span key={l.n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= active ? "bg-[#0e8f86]" : "bg-ink/10"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
