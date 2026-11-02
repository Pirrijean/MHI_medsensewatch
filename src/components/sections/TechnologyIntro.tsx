import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const columns = [
  {
    label: "Physiological monitoring",
    lead: "Observe how the body responds.",
    color: "bg-physio",
    items: [
      "Heart rate and heart rate variability",
      "Blood oxygen saturation",
      "Skin temperature",
      "Movement and physical activity",
      "Sleep and recovery patterns",
      "Electrocardiographic signals through an optional ECG module",
    ],
  },
  {
    label: "Molecular monitoring",
    lead: "Explore what the body expresses chemically.",
    color: "bg-bio",
    items: [
      "Cortisol",
      "Glucose",
      "Lactate",
      "Urea",
      "Sweat pH and electrolytes through calibration & expansion modules",
      "Specialized biomarkers through future modular cartridges",
    ],
  },
  {
    label: "Intelligent interpretation",
    lead: "Connect both dimensions.",
    color: "bg-accent",
    items: [
      "Longitudinal data analysis",
      "Physicochemical pH & temperature compensation",
      "Individual reference baselines",
      "Context-aware multimodal interpretation",
    ],
  },
];

/** Enriched visual Signal Function panel: biomarkers + pH + temperature + vitals (no nested boxes). */
function EnrichedSignalFusionPanel() {
  const biomarkers = [
    {
      name: "Cortisol",
      role: "HPA stress axis",
      value: "11.8 ng/mL",
      delta: "Within AM personal band",
      color: "#0e8f86",
      spark: "M0 22 C 28 18, 54 10, 82 14 C 110 18, 136 24, 160 25",
    },
    {
      name: "Glucose",
      role: "Metabolic substrate",
      value: "92 µM",
      delta: "Post-prandial nominal",
      color: "#1fbf9a",
      spark: "M0 26 C 30 25, 58 8, 92 14 C 122 22, 142 24, 160 24",
    },
    {
      name: "Lactate",
      role: "Anaerobic & exertion flux",
      value: "1.4 mM",
      delta: "Resting clearance",
      color: "#2f6fe0",
      spark: "M0 26 L 45 25 L 76 7 L 108 19 L 138 25 L 160 26",
    },
    {
      name: "Urea",
      role: "Nitrogen & renal balance",
      value: "18.6 mM",
      delta: "7-day stable trend",
      color: "#0fb5a8",
      spark: "M0 19 C 40 17, 80 21, 120 18 C 140 17, 150 18, 160 18",
    },
  ];

  const calibrationSignals = [
    {
      label: "Sweat pH",
      value: "6.42 pH",
      detail: "Compensates MIP binding & charge state",
      barPct: "64%",
      barClass: "bg-bio",
    },
    {
      label: "Skin Temperature",
      value: "33.6 °C",
      detail: "Normalizes electrode diffusion kinetics",
      barPct: "72%",
      barClass: "bg-[#0e8f86]",
    },
    {
      label: "Capillary Sweat Rate",
      value: "0.82 µL/min",
      detail: "Verifies fresh sample turnover",
      barPct: "56%",
      barClass: "bg-physio",
    },
    {
      label: "HRV · HR · SpO₂",
      value: "62 ms · 58 bpm · 98 %",
      detail: "Separates exercise load from acute stress",
      barPct: "86%",
      barClass: "bg-ink",
    },
  ];

  return (
    <figure className="overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_30px_80px_-36px_rgba(5,11,24,0.45)]">
      <div className="border-b border-white/10 px-6 py-5 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <figcaption className="font-display text-lg font-semibold text-white sm:text-xl">
              {site.productName} — Live Multimodal Signal Function
            </figcaption>
            <p className="mt-0.5 text-xs text-fog">
              Simultaneous molecular concentrations, physicochemical calibration (pH &amp; temperature) and autonomic vitals.
            </p>
          </div>
          <span className="flex items-center gap-2 font-mono text-[11px] text-tech">
            <span className="size-2 rounded-full bg-tech animate-soft-pulse" />
            Calibrated stream · illustrative
          </span>
        </div>
      </div>

      <div className="grid divide-y divide-white/10 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* Left 7 cols: Four live biomarkers with sparklines */}
        <div className="p-6 sm:p-10 lg:col-span-7">
          <p className="font-mono text-[10px] tracking-[0.18em] text-tech uppercase">
            Molecular biomarker channels
          </p>
          <div className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {biomarkers.map((b) => (
              <div key={b.name} className="border-t border-white/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-base font-semibold text-white">{b.name}</span>
                  <span className="font-mono text-sm font-medium text-tech">{b.value}</span>
                </div>
                <p className="text-[11px] text-fog/75">{b.role}</p>
                <svg viewBox="0 0 160 32" className="mt-2.5 h-7 w-full" aria-hidden>
                  <path
                    d={b.spark}
                    fill="none"
                    stroke={b.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="font-mono text-[10.5px] text-fog">{b.delta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: pH, Skin Temperature, Flow Rate & Vitals Calibration */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
              Physicochemical &amp; physiological context
            </p>
            <div className="mt-6 space-y-5">
              {calibrationSignals.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-white/90">{s.label}</span>
                    <span className="font-mono text-white">{s.value}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${s.barClass === "bg-ink" ? "bg-accent" : s.barClass}`}
                      style={{ width: s.barPct }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-fog/80">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between font-mono text-xs">
            <span className="text-fog">Personal baseline status</span>
            <span className="text-tech">Coherent · ±0.4σ</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

type CellState = "full" | "partial" | "invasive" | "none";

const comparisonRows: {
  parameter: string;
  category: string;
  medsense: { state: CellState; note: string };
  apple: { state: CellState; note: string };
  garmin: { state: CellState; note: string };
  whoopOura: { state: CellState; note: string };
  cgm: { state: CellState; note: string };
}[] = [
  {
    parameter: "Heart rate, HRV & SpO₂ (Optical PPG)",
    category: "Physiological",
    medsense: { state: "full", note: "Continuous" },
    apple: { state: "full", note: "Continuous" },
    garmin: { state: "full", note: "Continuous" },
    whoopOura: { state: "full", note: "Continuous" },
    cgm: { state: "none", note: "—" },
  },
  {
    parameter: "Single-lead ECG & skin temperature",
    category: "Physiological",
    medsense: { state: "full", note: "Temp + opt. ECG" },
    apple: { state: "full", note: "ECG + wrist temp" },
    garmin: { state: "partial", note: "Select models" },
    whoopOura: { state: "partial", note: "Temp only" },
    cgm: { state: "none", note: "—" },
  },
  {
    parameter: "Non-invasive sweat glucose dynamics",
    category: "Molecular",
    medsense: { state: "full", note: "MIP sweat channel" },
    apple: { state: "none", note: "—" },
    garmin: { state: "none", note: "—" },
    whoopOura: { state: "none", note: "—" },
    cgm: { state: "invasive", note: "Subcutaneous filament" },
  },
  {
    parameter: "Cortisol (HPA stress hormone)",
    category: "Molecular",
    medsense: { state: "full", note: "MIP sweat channel" },
    apple: { state: "none", note: "—" },
    garmin: { state: "none", note: "—" },
    whoopOura: { state: "none", note: "HRV proxy only" },
    cgm: { state: "none", note: "—" },
  },
  {
    parameter: "Lactate & metabolic exertion response",
    category: "Molecular",
    medsense: { state: "full", note: "MIP sweat channel" },
    apple: { state: "none", note: "—" },
    garmin: { state: "partial", note: "HR-estimated only" },
    whoopOura: { state: "none", note: "—" },
    cgm: { state: "none", note: "—" },
  },
  {
    parameter: "Urea (nitrogen & renal physiology)",
    category: "Molecular",
    medsense: { state: "full", note: "MIP sweat channel" },
    apple: { state: "none", note: "—" },
    garmin: { state: "none", note: "—" },
    whoopOura: { state: "none", note: "—" },
    cgm: { state: "none", note: "—" },
  },
  {
    parameter: "Real-time sweat pH & thermal calibration",
    category: "Bioelectronics",
    medsense: { state: "full", note: "Active compensation" },
    apple: { state: "none", note: "—" },
    garmin: { state: "none", note: "—" },
    whoopOura: { state: "none", note: "—" },
    cgm: { state: "partial", note: "Temp only" },
  },
  {
    parameter: "Electrochemically regenerable MIP cartridges",
    category: "Architecture",
    medsense: { state: "full", note: "Interchangeable" },
    apple: { state: "none", note: "Fixed hardware" },
    garmin: { state: "none", note: "Fixed hardware" },
    whoopOura: { state: "none", note: "Fixed hardware" },
    cgm: { state: "invasive", note: "Single-use disposable" },
  },
  {
    parameter: "Fused physiological + molecular personal AI",
    category: "Intelligence",
    medsense: { state: "full", note: "Native dual-stream" },
    apple: { state: "none", note: "Biometrics only" },
    garmin: { state: "none", note: "Biometrics only" },
    whoopOura: { state: "none", note: "Biometrics only" },
    cgm: { state: "none", note: "Glucose only" },
  },
];

function StatusBadge({ state, note, highlight = false }: { state: CellState; note: string; highlight?: boolean }) {
  if (state === "full") {
    return (
      <span className={`inline-flex items-center gap-2 text-xs ${highlight ? "font-semibold text-ink" : "text-ink"}`}>
        <span className={`size-2 rounded-full ${highlight ? "bg-[#0e8f86]" : "bg-physio"}`} />
        {note}
      </span>
    );
  }
  if (state === "partial") {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-ink-soft">
        <span className="size-2 rounded-full border border-ink-soft/60" />
        {note}
      </span>
    );
  }
  if (state === "invasive") {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-[#9a6700]">
        <span className="size-2 rounded-full bg-[#d99000]" />
        {note}
      </span>
    );
  }
  return <span className="font-mono text-xs text-ink-soft/45">{note}</span>;
}

/** Comprehensive wearable & biosensor market comparison. */
function CompetitorComparison() {
  return (
    <div className="pt-4">
      <div className="max-w-3xl">
        <h3 className="text-2xl leading-snug font-semibold text-ink sm:text-3xl">
          Dimensions of {site.productName} from {site.companyName} in comparison with other wearables
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Conventional smartwatches and fitness trackers capture external physiological responses, while patch CGMs require invasive filaments for a single analyte. {site.productName} bridges non-invasive multi-analyte biochemistry and continuous physiology in one modular architecture.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink/15 text-xs">
              <th className="py-4 pr-6 font-mono text-[11px] tracking-wider text-ink-soft uppercase">
                Sensing &amp; Intelligence Parameter
              </th>
              <th className="bg-[#0e8f86]/[0.07] px-5 py-4 font-display text-sm font-bold text-ink">
                {site.productName}
                <span className="block font-mono text-[10px] font-normal text-[#0e8f86]">
                  {site.companyShort} · Modular Platform
                </span>
              </th>
              <th className="px-4 py-4 font-display text-xs font-semibold text-ink">
                Apple Watch
                <span className="block font-mono text-[10px] font-normal text-ink-soft">
                  Series / Ultra
                </span>
              </th>
              <th className="px-4 py-4 font-display text-xs font-semibold text-ink">
                Garmin
                <span className="block font-mono text-[10px] font-normal text-ink-soft">
                  Fenix / Epix
                </span>
              </th>
              <th className="px-4 py-4 font-display text-xs font-semibold text-ink">
                WHOOP / Oura
                <span className="block font-mono text-[10px] font-normal text-ink-soft">
                  Recovery Trackers
                </span>
              </th>
              <th className="px-4 py-4 font-display text-xs font-semibold text-ink">
                Patch CGMs
                <span className="block font-mono text-[10px] font-normal text-ink-soft">
                  Dexcom / Libre
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {comparisonRows.map((row) => (
              <tr key={row.parameter} className="transition-colors hover:bg-ink/[0.02]">
                <td className="py-4 pr-6">
                  <span className="block text-sm font-medium text-ink">{row.parameter}</span>
                  <span className="font-mono text-[10px] tracking-wider text-ink-soft uppercase">
                    {row.category}
                  </span>
                </td>
                <td className="bg-[#0e8f86]/[0.07] px-5 py-4">
                  <StatusBadge state={row.medsense.state} note={row.medsense.note} highlight />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge state={row.apple.state} note={row.apple.note} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge state={row.garmin.state} note={row.garmin.note} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge state={row.whoopOura.state} note={row.whoopOura.note} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge state={row.cgm.state} note={row.cgm.note} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TechnologyIntro() {
  return (
    <section
      id="technology"
      data-section="next-dimension"
      aria-labelledby="tech-title"
      className="relative bg-paper text-ink section-y"
    >
      <div className="container-x">
        {/* Manifesto — no section numbers or small eyebrow labels */}
        <Reveal>
          <p className="max-w-5xl font-display text-[2.4rem] leading-[1.04] font-semibold tracking-tight sm:text-6xl lg:text-[4.8rem]">
            Beyond biometric monitoring.{" "}
            <span className="bg-gradient-to-r from-[#2f6fe0] via-[#0fb5a8] to-[#11977b] bg-clip-text text-transparent">
              Towards molecular health intelligence.
            </span>
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 id="tech-title" className="text-3xl leading-tight font-semibold sm:text-4xl">
                From measuring the body to understanding its signals.
              </h2>
            </Reveal>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.05}>
              <p>
                Traditional wearable devices primarily focus on physiological parameters: heart rate,
                oxygen saturation, movement, sleep and activity.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Developed by <strong className="font-semibold text-ink">{site.companyName} ({site.companyShort})</strong>,{" "}
                <strong className="font-semibold text-ink">{site.productName}</strong> introduces a
                complementary dimension: <strong className="font-semibold text-ink">molecular sensing</strong>.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                By combining physiological measurements with calibrated biochemical information
                obtained from sweat, {site.productName} creates a continuous, multidimensional
                representation of individual health.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Enriched Multimodal Signal Function Panel (moved & expanded with pH, Temp & Biomarkers) */}
        <Reveal className="mt-16 lg:mt-24">
          <EnrichedSignalFusionPanel />
        </Reveal>

        {/* Three Dimensions Hairline Grid */}
        <div className="mt-20 grid border-t hairline-light lg:mt-24 lg:grid-cols-3">
          {columns.map((c, i) => (
            <Reveal
              key={c.label}
              delay={i * 0.08}
              className={`border-b hairline-light py-10 lg:border-b-0 lg:py-12 ${
                i > 0 ? "lg:border-l lg:pl-10" : ""
              } ${i < 2 ? "lg:pr-10" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className={`size-2 rounded-full ${c.color}`} />
                <h3 className="eyebrow text-ink">{c.label}</h3>
              </div>
              <p className="mt-5 font-display text-2xl font-medium">{c.lead}</p>
              <ul className="mt-6 space-y-3">
                {c.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[15px] leading-snug text-ink-soft">
                    <span className="mt-2 h-px w-3 shrink-0 bg-ink/30" />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Comprehensive Competitor Comparison Table */}
        <Reveal className="mt-20 border-t hairline-light pt-16 lg:mt-24 lg:pt-20">
          <CompetitorComparison />
        </Reveal>
      </div>
    </section>
  );
}
