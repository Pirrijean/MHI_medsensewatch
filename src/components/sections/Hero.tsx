import { site } from "@/lib/site";
import { HeroWatchShowcase } from "@/components/animations/HeroWatchShowcase";
import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section
      id="top"
      data-section="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-night lg:min-h-[100svh]"
    >
      {/* Clean ambient focus glow only — no background grids, no flying lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_72%_48%,rgba(25,230,212,0.09),rgba(76,141,255,0.05)_45%,transparent_75%)]"
      />

      <div className="relative z-10 container-x flex min-h-[100svh] items-center pt-28 pb-16 lg:pt-28 lg:pb-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left column: Minimalist, high-impact presentation of MHI → MedSense Watch */}
          <div className="lg:col-span-6">
            <Reveal>
              <h1
                id="hero-title"
                className="text-[2.6rem] leading-[1.03] font-semibold tracking-tight sm:text-6xl lg:text-[4.15rem]"
              >
                Your body is more than a set of vital signs.
              </h1>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 font-display text-xl font-medium text-gradient-signal sm:text-2xl">
                <strong className="font-semibold text-white">{site.companyShort}</strong> presents{" "}
                <strong className="font-semibold text-white">{site.productName}</strong> — a new
                dimension of health monitoring.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[540px] text-base leading-relaxed text-fog sm:text-[17px]">
                Developed by {site.companyName} ({site.companyShort}), {site.productName} integrates
                continuous physiological sensing, non-invasive molecular sweat bioanalysis and
                personalized artificial intelligence in one modular wearable architecture.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-3.5 sm:flex-row">
                <CtaButton href="#technology" ctaId="hero_explore">
                  Explore {site.productName}
                </CtaButton>
                <CtaButton
                  href="#contact"
                  ctaId="hero_partner"
                  interest="partnership"
                  variant="secondary"
                >
                  Become a development partner
                </CtaButton>
              </div>
            </Reveal>
          </div>

          {/* Right column: Semi-disassembled MedSense Watch with live multi-mode screen & sensor callouts */}
          <div className="lg:col-span-6">
            <Reveal delay={0.12}>
              <HeroWatchShowcase />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
