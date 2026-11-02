import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EngagementTracker } from "@/components/layout/EngagementTracker";
import { Hero } from "@/components/sections/Hero";
import { TechnologyIntro } from "@/components/sections/TechnologyIntro";
import { DualSensing } from "@/components/sections/DualSensing";
import { DeviceAnatomy } from "@/components/sections/DeviceAnatomy";
import { MolecularSensing } from "@/components/sections/MolecularSensing";
import { PhysiologicalSensing } from "@/components/sections/PhysiologicalSensing";
import { AIIntelligence } from "@/components/sections/AIIntelligence";
import { Applications } from "@/components/sections/Applications";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { CartridgeSystem } from "@/components/sections/CartridgeSystem";
import { Foundations } from "@/components/sections/Foundations";
import { Partnership } from "@/components/sections/Partnership";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        {/* I. Discover */}
        <Hero />
        <TechnologyIntro />
        <DualSensing />
        {/* II. Understand */}
        <DeviceAnatomy />
        <MolecularSensing />
        <PhysiologicalSensing />
        <AIIntelligence />
        {/* III. Participate */}
        <Applications />
        <DashboardPreview />
        <CartridgeSystem />
        <Foundations />
        <Partnership />
      </main>
      <Footer />
      <EngagementTracker />
    </>
  );
}
