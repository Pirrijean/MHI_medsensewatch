import Image from "next/image";
import { biomarkers } from "@/data/biomarkers";
import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { MicrofluidicFlow } from "@/components/animations/MicrofluidicFlow";

/** Positions of the four sensing chambers on the cartridge macro render (%). */
const chambers = [
  { x: 43, y: 53.4 },
  { x: 48.5, y: 47.9 },
  { x: 54.1, y: 42.3 },
  { x: 59.6, y: 37.1 },
];

export function MolecularSensing() {
  return (
    <section id="molecular" data-section="molecular-sensing" className="relative overflow-hidden bg-night section-y">
      <div className="relative container-x">
        <SectionHeader
          title={
            <>
              Four molecular signals. <br className="hidden lg:block" />
              <span className="text-gradient-signal">One integrated platform.</span>
            </>
          }
          intro={`The first biochemical cartridge for ${site.productName} is engineered around four core sweat biomarkers.`}
        />

        {/* Cartridge macro render */}
        <Reveal className="mt-16 lg:mt-20">
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[28px] sm:aspect-[16/8]">
            <Image
              src="/images/cartridge-macro.jpg"
              alt={`Macro view of the ${site.productName} translucent biochemical cartridge showing serpentine microchannels and four MIP sensing chambers`}
              fill
              sizes="(min-width: 1240px) 1160px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
            {chambers.map((c, i) => (
              <div
                key={i}
                className="absolute hidden -translate-x-1/2 sm:block"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                aria-hidden
              >
                <div className="relative flex flex-col items-center">
                  <span className="h-14 w-px -translate-y-full bg-gradient-to-t from-tech to-transparent" />
                  <span className="absolute -top-[84px] rounded-full bg-night/85 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-tech backdrop-blur">
                    {biomarkers[i].name}
                  </span>
                </div>
              </div>
            ))}
          </figure>
        </Reveal>

        {/* Four target biomarkers */}
        <div className="mt-16 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {biomarkers.map((b, i) => (
            <Reveal
              key={b.id}
              delay={i * 0.07}
              className={`border-b border-white/10 py-10 sm:px-0 lg:border-b-0 ${
                i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
              } ${i > 0 ? "lg:border-l lg:pl-8" : ""} lg:pr-8`}
            >
              <span className="font-mono text-[11px] text-fog">{b.readout}</span>
              <p className="mt-6 font-mono text-2xl text-tech">{b.formula}</p>
              <h3 className="mt-3 text-[1.65rem] font-semibold tracking-tight uppercase">{b.name}</h3>
              <p className="eyebrow mt-1 text-fog/80">{b.category}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-fog">{b.description}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-white/85">
                <span className="eyebrow mb-2 block text-bio">Monitoring objective</span>
                {b.objective}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Molecular recognition & 3-electrode microfluidic cell */}
        <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="text-3xl leading-tight font-semibold">
                Each analyte has its own recognition layer and sensing channel.
              </h3>
              <p className="mt-6 leading-relaxed text-fog">
                Molecularly imprinted polymer (MIP) cavities selectively bind their target molecule
                while the 3-electrode potentiostat quantifies interfacial current changes using
                analyte-, pH- and temperature-calibrated models.
              </p>
              <dl className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm">
                {[
                  ["Recognition", "Electropolymerized MIP cavities"],
                  ["Electrodes", "Au/PEDOT:PSS WE · Ag/AgCl RE · Pt CE"],
                  ["Calibration", "Active sweat pH & skin thermistor"],
                  ["Regeneration", "+0.60 V electrochemical desorption"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-4">
                    <dt className="font-mono text-[11px] tracking-wider text-fog uppercase">{k}</dt>
                    <dd className="text-white/90">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <MicrofluidicFlow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
