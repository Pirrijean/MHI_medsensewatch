/**
 * Central brand & product configuration.
 * MHI (Molecular Health Intelligence) is the company;
 * MedSense Watch is the flagship wearable product.
 */
export const site = {
  companyShort: "MHI",
  companyName: "Molecular Health Intelligence",
  productName: "MedSense Watch",
  platformLabel: "MHI · MedSense Watch",
  tagline: "Physiological sensing. Molecular bioanalysis. Personalized intelligence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "partnerships@mhihealth.com",
  description:
    "MHI presents MedSense Watch — a modular wearable combining physiological sensing, molecular sweat bioanalysis and artificial intelligence for continuous, multidimensional health intelligence.",
} as const;

export const navLinks = [
  { href: "#technology", label: "Overview" },
  { href: "#dimensions", label: "Intelligence" },
  { href: "#architecture", label: "Hardware" },
  { href: "#molecular", label: "Biosensing" },
  { href: "#ai", label: "AI" },
  { href: "#platform", label: "App" },
  { href: "#partnership", label: "Partnerships" },
] as const;
