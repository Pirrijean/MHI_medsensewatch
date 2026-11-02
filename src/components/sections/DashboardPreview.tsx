"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Activity, Clock, Droplets, HeartPulse, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

const pillars = [
  {
    id: "overview" as const,
    title: "Your health overview",
    text: "A unified readiness and coherence view combining physiological indicators, sweat biomarkers and live cartridge status.",
  },
  {
    id: "molecular" as const,
    title: "Molecular trends",
    text: "Continuous trajectories of cortisol, glucose, lactate and urea calibrated against sweat pH and skin temperature.",
  },
  {
    id: "physiological" as const,
    title: "Physiological trends",
    text: "Beat-to-beat HRV, heart rate, SpO₂, skin thermoregulation, inertial workload and sleep architecture.",
  },
  {
    id: "insights" as const,
    title: "Personalized insights",
    text: "Context-aware interpretation distinguishing exercise exertion from non-metabolic HPA stress against your 30-day baseline.",
  },
  {
    id: "history" as const,
    title: "Timeline & clinical reports",
    text: "Chronological multimodal event log and structured longitudinal PDF summaries ready for physician review.",
  },
];

const appTabs = [
  { id: "overview", label: "Today", Icon: Activity },
  { id: "molecular", label: "Molecular", Icon: Droplets },
  { id: "physiological", label: "Vitals", Icon: HeartPulse },
  { id: "insights", label: "AI", Icon: Sparkles },
  { id: "history", label: "History", Icon: Clock },
] as const;

type ScreenId = (typeof appTabs)[number]["id"];

/** Realistic native iOS MedTech screen views — clean hairlines, gradient curves, zero boxy cards. */
function NativePhoneScreen({ screen }: { screen: ScreenId }) {
  if (screen === "overview") {
    return (
      <div className="space-y-5">
        {/* Hero Biological Coherence Ring */}
        <div className="flex items-center gap-4 pt-1">
          <div className="relative grid size-[92px] shrink-0 place-items-center">
            <svg viewBox="0 0 96 96" className="size-full -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.07)" strokeWidth="6" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#19E6D4"
                strokeWidth="6"
                strokeDasharray="251.2"
                strokeDashoffset="20"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="48" cy="48" r="30" stroke="rgba(255,255,255,0.07)" strokeWidth="4.5" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="30"
                stroke="#4C8DFF"
                strokeWidth="4.5"
                strokeDasharray="188.4"
                strokeDashoffset="28"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute text-center leading-none">
              <span className="font-display text-2xl font-bold text-white">94</span>
              <span className="mt-0.5 block font-mono text-[8px] tracking-wider text-tech uppercase">
                Aligned
              </span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[9.5px] tracking-wider text-tech uppercase">
              Multimodal Coherence
            </p>
            <p className="mt-1 font-display text-[15px] leading-snug font-semibold text-white">
              Circadian &amp; metabolic recovery within personal band
            </p>
            <p className="mt-1 font-mono text-[10px] text-fog">
              pH 6.42 · 33.6 °C · Cycle 14/36
            </p>
          </div>
        </div>

        {/* Combined area chart */}
        <div className="border-t border-white/[0.08] pt-3.5">
          <div className="flex items-baseline justify-between font-mono text-[9.5px]">
            <span className="text-fog uppercase">Cortisol vs HRV · Today</span>
            <span className="text-tech">±0.4σ</span>
          </div>
          <svg viewBox="0 0 264 68" className="mt-2 h-16 w-full" aria-hidden>
            <defs>
              <linearGradient id="app-cort-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#19E6D4" stopOpacity="0.28" />
                <stop offset="1" stopColor="#19E6D4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 44 C 38 14, 72 18, 112 34 C 156 46, 205 50, 264 54 L 264 68 L 0 68 Z"
              fill="url(#app-cort-fill)"
            />
            <path
              d="M0 44 C 38 14, 72 18, 112 34 C 156 46, 205 50, 264 54"
              fill="none"
              stroke="#19E6D4"
              strokeWidth="2"
            />
            <path
              d="M0 26 C 42 42, 82 38, 122 28 C 166 22, 212 18, 264 16"
              fill="none"
              stroke="#4C8DFF"
              strokeWidth="1.6"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Clean native iOS metric list */}
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.08] text-xs">
          {[
            { label: "Sweat Cortisol", val: "11.8 ng/mL", delta: "Normal AM slope", dot: "bg-tech" },
            { label: "Sweat Glucose", val: "92 µM", delta: "Post-meal stable", dot: "bg-bio" },
            { label: "HRV · Resting HR", val: "62 ms · 58 bpm", delta: "+5 % vs 30d avg", dot: "bg-physio" },
            { label: "Lactate", val: "1.4 mM", delta: "Aerobic baseline", dot: "bg-accent" },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <span className={`size-1.5 rounded-full ${m.dot}`} />
                <div>
                  <span className="block font-medium text-white">{m.label}</span>
                  <span className="text-[10px] text-fog/75">{m.delta}</span>
                </div>
              </div>
              <span className="font-mono text-xs text-white">{m.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "molecular") {
    const analytes = [
      {
        name: "Cortisol",
        val: "11.8 ng/mL",
        sub: "Personal AM band 9.5–14.0",
        stroke: "#19E6D4",
        d: "M0 24 C 36 10, 78 16, 132 26 C 184 32, 224 35, 264 36",
      },
      {
        name: "Glucose",
        val: "92 µM",
        sub: "Cleared post-prandial peak in 42 min",
        stroke: "#1FBF9A",
        d: "M0 32 C 44 30, 78 8, 120 16 C 166 28, 214 30, 264 31",
      },
      {
        name: "Lactate",
        val: "1.4 mM",
        sub: "Morning Zone-2 surge resolved",
        stroke: "#67E8F9",
        d: "M0 34 L 58 33 L 94 7 L 136 24 L 188 33 L 264 34",
      },
      {
        name: "Urea",
        val: "18.6 mM",
        sub: "Nitrogen equilibrium · pH 6.42",
        stroke: "#4C8DFF",
        d: "M0 23 C 66 20, 132 26, 198 22 C 232 21, 248 22, 264 22",
      },
    ];
    return (
      <div className="divide-y divide-white/[0.08]">
        {analytes.map((a) => (
          <div key={a.name} className="py-3 first:pt-1">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-sm font-semibold text-white">{a.name}</span>
              <span className="font-mono text-xs font-medium" style={{ color: a.stroke }}>
                {a.val}
              </span>
            </div>
            <svg viewBox="0 0 264 40" className="mt-1 h-7 w-full" aria-hidden>
              <path d={a.d} fill="none" stroke={a.stroke} strokeWidth="1.9" strokeLinecap="round" />
            </svg>
            <p className="font-mono text-[9.5px] text-fog/80">{a.sub}</p>
          </div>
        ))}
      </div>
    );
  }

  if (screen === "physiological") {
    return (
      <div className="space-y-4 pt-1">
        <div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono text-[9.5px] text-physio uppercase">Single-Lead ECG &amp; PPG</span>
              <p className="font-display text-2xl font-bold text-white">
                58 <span className="text-xs font-normal text-fog">bpm</span> · 62{" "}
                <span className="text-xs font-normal text-fog">ms HRV</span>
              </p>
            </div>
            <span className="font-mono text-[10px] text-tech">Sinus</span>
          </div>

          <svg viewBox="0 0 264 62" className="mt-3 h-14 w-full" aria-hidden>
            <path
              d="M0 40 L26 40 L34 34 L42 40 L52 40 L58 48 L65 8 L72 54 L79 40 L94 40 L104 28 L114 40 L152 40 L160 34 L168 40 L178 40 L184 48 L191 8 L198 54 L205 40 L220 40 L230 28 L240 40 L264 40"
              fill="none"
              stroke="#4C8DFF"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="divide-y divide-white/[0.08] border-t border-white/[0.08] text-xs">
          {[
            ["Peripheral SpO₂", "98 %", "14.2 brpm nocturnal"],
            ["Skin Temperature", "33.6 °C", "Nadir −0.4 °C at 04:15"],
            ["Sleep Architecture", "7 h 28 m", "88 % restorative efficiency"],
            ["Inertial Workload", "42 min", "112 spm cadence · Zone 2"],
          ].map(([k, v, sub]) => (
            <div key={k} className="flex items-center justify-between py-3">
              <div>
                <span className="block font-medium text-white">{k}</span>
                <span className="text-[10px] text-fog/75">{sub}</span>
              </div>
              <span className="font-mono text-xs text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "insights") {
    return (
      <div className="space-y-4 pt-1">
        <div>
          <span className="font-mono text-[9.5px] tracking-wider text-accent uppercase">
            Personal Baseline Finding · 14:25
          </span>
          <h4 className="mt-1.5 font-display text-base leading-snug font-semibold text-white">
            Non-metabolic HPA stress signature separated from exercise
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-fog">
            Sweat cortisol rose +58 % above your afternoon envelope while HRV dropped 38 %. Inertial gating confirmed sedentary posture (0.04 g), ruling out physical workload.
          </p>
        </div>

        <div className="space-y-3 border-t border-white/[0.08] pt-4 font-mono text-[10.5px]">
          {[
            { k: "Cortisol deviation", v: "+2.8σ", w: "86%", c: "bg-tech" },
            { k: "HRV autonomic dip", v: "−2.1σ", w: "74%", c: "bg-physio" },
            { k: "Lactate & IMU load", v: "0.2σ (rest)", w: "16%", c: "bg-fog" },
          ].map((x) => (
            <div key={x.k}>
              <div className="flex justify-between">
                <span className="text-white/90">{x.k}</span>
                <span className="text-fog">{x.v}</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-white/10">
                <div className={`h-full rounded-full ${x.c}`} style={{ width: x.w }} />
              </div>
            </div>
          ))}
        </div>

        <p className="border-t border-white/[0.08] pt-3 text-[11px] leading-relaxed text-tech">
          Historical pattern: similar afternoon shifts delayed nocturnal HRV recovery by ~50 min unless followed by low-intensity decompression.
        </p>
      </div>
    );
  }

  // History & clinical export
  return (
    <div className="space-y-4 pt-1">
      <div className="relative space-y-4 border-l border-white/15 pl-4">
        {[
          {
            time: "Today · 14:25",
            title: "Acute sedentary HPA shift",
            detail: "Cortisol 16.4 ng/mL (+2.8σ) · HRV 38 ms",
            dot: "bg-alert",
          },
          {
            time: "Today · 09:30",
            title: "Aerobic metabolic session",
            detail: "Lactate peak 4.1 mM · cleared in 26 min",
            dot: "bg-tech",
          },
          {
            time: "Yesterday · 07:15",
            title: "30-day personal model updated",
            detail: "Circadian cortisol & glycemic bands recalibrated",
            dot: "bg-physio",
          },
        ].map((e) => (
          <div key={e.time} className="relative">
            <span className={`absolute top-1.5 -left-[20.5px] size-2 rounded-full ${e.dot}`} />
            <p className="font-mono text-[9.5px] text-fog">{e.time}</p>
            <p className="mt-0.5 text-xs font-semibold text-white">{e.title}</p>
            <p className="text-[11px] text-fog/85">{e.detail}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.08] pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xs font-semibold text-white">
              Physician Longitudinal Report
            </p>
            <p className="font-mono text-[9.5px] text-fog">
              30-day calibrated biomarkers + ECG/HRV PDF
            </p>
          </div>
          <span className="font-mono text-[10px] text-tech">Ready →</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardPreview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>("overview");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => {
      setScreen((cur) => {
        const idx = appTabs.findIndex((x) => x.id === cur);
        return appTabs[(idx + 1) % appTabs.length].id;
      });
    }, 4800);
    return () => clearTimeout(t);
  }, [screen, inView, paused, reduce]);

  const selectScreen = (id: ScreenId) => {
    setScreen(id);
    setPaused(true);
    track("tech_interaction", { component: "dashboard_preview", screen: id });
  };

  return (
    <section
      ref={ref}
      id="platform"
      data-section="health-dashboard"
      className="relative overflow-hidden bg-night section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_72%_52%,rgba(25,230,212,0.08),rgba(76,141,255,0.05)_45%,transparent_75%)]"
      />

      <div className="relative container-x">
        <SectionHeader
          title={
            <>
              Every signal tells <br className="hidden lg:block" />
              <span className="text-gradient-signal">part of your story.</span>
            </>
          }
          intro={`The ${site.productName} companion application translates continuous molecular and physiological streams into clear, personal and clinically structured intelligence.`}
        />

        <div
          className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left: Clean interactive feature rows synchronized with the phone screen */}
          <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-6">
            {pillars.map((p) => {
              const on = p.id === screen;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => selectScreen(p.id)}
                  onFocus={() => selectScreen(p.id)}
                  onClick={() => selectScreen(p.id)}
                  aria-pressed={on}
                  className="block w-full cursor-pointer py-6 text-left transition-opacity"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3
                      className={`font-display text-lg tracking-tight uppercase transition-colors sm:text-xl ${
                        on ? "font-semibold text-white" : "font-medium text-white/55 hover:text-white/80"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <span
                      aria-hidden
                      className={`size-2 rounded-full transition-transform ${
                        on ? "scale-125 bg-tech" : "bg-white/15"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm leading-relaxed transition-colors ${
                      on ? "text-fog" : "text-fog/55"
                    }`}
                  >
                    {p.text}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Realistic iPhone Titanium Mockup floating directly in space (no wrapper box) */}
          <Reveal className="lg:col-span-6" delay={0.08}>
            <div className="mx-auto w-full max-w-[336px]">
              {/* Titanium outer frame */}
              <div className="relative rounded-[54px] bg-gradient-to-b from-[#556178] via-[#252e40] to-[#121826] p-[6px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_50px_-15px_rgba(25,230,212,0.16)]">
                {/* Inner OLED glass */}
                <div className="relative flex min-h-[620px] flex-col justify-between overflow-hidden rounded-[48px] bg-[#050B16] px-5 pt-3.5 pb-3">
                  {/* iOS Status Bar + Dynamic Island */}
                  <div>
                    <div className="flex items-center justify-between px-1 font-sans text-[11px] font-semibold text-white">
                      <span>9:41</span>
                      <div className="flex h-[22px] w-[88px] items-center justify-end rounded-full bg-black px-2.5">
                        <span className="size-1.5 rounded-full bg-tech" />
                      </div>
                      <div className="flex items-center gap-1.5" aria-hidden>
                        <div className="flex items-end gap-[1.5px]">
                          <span className="h-1.5 w-[2px] rounded-xs bg-white" />
                          <span className="h-2 w-[2px] rounded-xs bg-white" />
                          <span className="h-2.5 w-[2px] rounded-xs bg-white" />
                          <span className="h-3 w-[2px] rounded-xs bg-white" />
                        </div>
                        <div className="h-2.5 w-5 rounded-[3px] border border-white/60 p-[1.5px]">
                          <div className="h-full w-[85%] rounded-[1px] bg-white" />
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="mt-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <div>
                        <span className="font-display text-sm font-bold tracking-tight text-white">
                          {site.productName}
                        </span>
                        <span className="block font-mono text-[9px] text-tech">
                          ● Connected · Sweat + PPG
                        </span>
                      </div>
                      <span className="font-mono text-[9px] tracking-wider text-fog/70 uppercase">
                        {site.companyShort}
                      </span>
                    </div>
                  </div>

                  {/* Active Native Screen View */}
                  <div className="my-auto py-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={screen}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <NativePhoneScreen screen={screen} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Native iOS Bottom Tab Bar + Home Indicator */}
                  <div>
                    <div
                      role="tablist"
                      aria-label="MedSense mobile navigation"
                      className="grid grid-cols-5 border-t border-white/[0.08] pt-2.5"
                    >
                      {appTabs.map(({ id, label, Icon }) => {
                        const on = id === screen;
                        return (
                          <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => selectScreen(id)}
                            className={`flex cursor-pointer flex-col items-center gap-1 py-1 transition-colors ${
                              on ? "text-tech" : "text-fog/55 hover:text-fog"
                            }`}
                          >
                            <Icon className="size-4" strokeWidth={on ? 2.2 : 1.7} aria-hidden />
                            <span className="font-sans text-[9.5px] font-medium">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mx-auto mt-2.5 h-1 w-28 rounded-full bg-white/25" aria-hidden />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center font-mono text-[10px] tracking-wider text-fog/60 uppercase">
                Prototype interface · illustrative non-clinical data
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
