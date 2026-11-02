import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { DeviceExplodedView } from "@/components/animations/DeviceExplodedView";
import { DeviceExplorer } from "@/components/animations/DeviceExplorer";

export function DeviceAnatomy() {
  return (
    <section
      id="architecture"
      data-section="inside-the-device"
      className="relative bg-paper text-ink section-y"
    >
      <div className="relative container-x">
        <SectionHeader
          tone="light"
          title={
            <>
              Advanced bioelectronics. <br className="hidden lg:block" />
              Designed around the human body.
            </>
          }
          intro={`${site.productName} integrates physiological sensing, capillary sweat management, MIP electrochemical analysis and embedded processing in seven precision-engineered layers.`}
        />

        <div className="mt-16 lg:mt-8">
          <DeviceExplodedView />
        </div>

        <div className="mt-24 lg:mt-32">
          <Reveal>
            <h3 className="max-w-3xl text-3xl leading-tight font-semibold lg:text-4xl">
              Six components. Two sensing domains. One coherent device.
            </h3>
            <p className="mt-3 max-w-xl text-base text-ink-soft">
              Pass your cursor across the hardware or the component list to inspect each sensing module in {site.productName}.
            </p>
          </Reveal>
          <div className="mt-12">
            <DeviceExplorer />
          </div>
        </div>
      </div>
    </section>
  );
}
