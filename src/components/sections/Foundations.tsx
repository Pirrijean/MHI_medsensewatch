import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const disciplines = [
  {
    title: "Molecularly imprinted polymers",
    layer: "Recognition chemistry",
    text: "Synthetic molecular recognition cavities engineered around target-specific steric and hydrogen-bond interactions.",
  },
  {
    title: "Electrochemical biosensing",
    layer: "Signal transduction",
    text: "Voltammetric and impedimetric quantification of interfacial binding events across multi-channel microelectrodes.",
  },
  {
    title: "Capillary microfluidics",
    layer: "Fluidic transport",
    text: "Passive micro-pillar filtration, laminar sweat transport and continuous sample renewal without moving pumps.",
  },
  {
    title: "Wearable bioelectronics",
    layer: "Analog front-end & MCU",
    text: "Low-noise multi-channel potentiostat, electrochemical regeneration driver and synchronized optical/inertial acquisition.",
  },
  {
    title: "Multimodal computing",
    layer: "Stream synchronization",
    text: "Real-time alignment of sweat biochemistry with sweat pH, skin temperature, autonomic HRV and physical workload.",
  },
  {
    title: "Personal longitudinal AI",
    layer: "Individualized modeling",
    text: "Adaptive personal reference envelopes, context-gated deviation detection and clinically structured longitudinal trajectories.",
  },
];

const signalChain = [
  {
    stage: "Transduction",
    title: "MIP + PPG / ECG / IMU",
    detail: "4-ch working/ref/counter electrodes, sweat pH & skin thermistor",
  },
  {
    stage: "Analog Front-End",
    title: "Potentiostat & Regen",
    detail: "Picoampere DPV/EIS readout + +0.60 V surface desorption driver",
  },
  {
    stage: "Embedded System",
    title: "Calibration MCU & BLE",
    detail: "Synchronized multi-rate ADC, kinetic compensation & encrypted link",
  },
  {
    stage: "Longitudinal Engine",
    title: "MHI Personal AI",
    detail: "30-day rolling baseline, anomaly gating & clinical reporting",
  },
];

export function Foundations() {
  return (
    <section
      id="foundations"
      data-section="bioelectronic-foundations"
      className="relative overflow-hidden border-t border-white/[0.06] bg-night-2 section-y"
    >
      {/* Ambient glow only — no background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_30%_30%,rgba(76,141,255,0.07),transparent_70%)]"
      />

      <div className="relative container-x">
        <SectionHeader
          title={
            <>
              Where bioengineering meets <br className="hidden lg:block" />
              <span className="text-gradient-signal">intelligent computing.</span>
            </>
          }
          intro={`Inside ${site.companyName} (${site.companyShort}), ${site.productName} unites materials chemistry, microfluidics, low-noise analog electronics and longitudinal machine learning.`}
        />

        {/* Six core disciplines — clean hairlines, no ENG-01 codes */}
        <div className="mt-16 grid border-t border-white/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Reveal
              key={d.title}
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
              <span className="font-mono text-[10.5px] tracking-wider text-tech uppercase">
                {d.layer}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">{d.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fog">{d.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Clean borderless end-to-end bioelectronic signal chain timeline (no boxes) */}
        <Reveal className="mt-20 border-t border-white/10 pt-12 lg:mt-24">
          <p className="font-mono text-[11px] tracking-wider text-fog uppercase">
            End-to-end signal chain · molecule → electron → calibrated insight
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {signalChain.map((item, idx) => (
              <div key={item.stage} className="relative border-t-2 border-tech/45 pt-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-tech uppercase">
                  <span>{item.stage}</span>
                  {idx < signalChain.length - 1 && (
                    <span className="hidden text-fog/60 lg:inline" aria-hidden>
                      →
                    </span>
                  )}
                </div>
                <h4 className="mt-2 font-display text-lg font-semibold text-white">{item.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-fog">{item.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
