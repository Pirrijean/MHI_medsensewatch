export type Cartridge = {
  id: string;
  name: string;
  status: "In development" | "Proposed" | "Configurable";
  summary: string;
  channels: { label: string; sub: string }[];
  /** visual tint used in the cartridge diagram */
  tint: string;
};

export const cartridges: Cartridge[] = [
  {
    id: "core",
    name: "Core panel",
    status: "In development",
    summary:
      "The first biochemical cartridge: four MIP channels for stress, metabolic and nitrogen-metabolism markers.",
    channels: [
      { label: "Cortisol", sub: "CH-01 · MIP" },
      { label: "Glucose", sub: "CH-02 · MIP" },
      { label: "Lactate", sub: "CH-03 · MIP" },
      { label: "Urea", sub: "CH-04 · MIP" },
    ],
    tint: "#19e6d4",
  },
  {
    id: "metabolic",
    name: "Metabolic panel",
    status: "Proposed",
    summary:
      "Focused on energy metabolism and exercise response, with a pH reference channel for signal correction.",
    channels: [
      { label: "Glucose", sub: "CH-01 · MIP" },
      { label: "Lactate", sub: "CH-02 · MIP" },
      { label: "Urea", sub: "CH-03 · MIP" },
      { label: "pH", sub: "CH-04 · reference" },
    ],
    tint: "#4c8dff",
  },
  {
    id: "stress",
    name: "Stress-response panel",
    status: "Proposed",
    summary:
      "Designed to characterize acute and chronic stress responses together with HRV and sleep data.",
    channels: [
      { label: "Cortisol", sub: "CH-01 · MIP" },
      { label: "Glucose", sub: "CH-02 · MIP" },
      { label: "Lactate", sub: "CH-03 · MIP" },
      { label: "Na⁺", sub: "CH-04 · sweat-rate ref." },
    ],
    tint: "#8b7bff",
  },
  {
    id: "hydration",
    name: "Hydration & electrolyte panel",
    status: "Proposed",
    summary:
      "Ion-selective channels to study sweat composition, hydration status and thermal stress.",
    channels: [
      { label: "Na⁺", sub: "CH-01 · ISE" },
      { label: "K⁺", sub: "CH-02 · ISE" },
      { label: "Cl⁻", sub: "CH-03 · ISE" },
      { label: "pH", sub: "CH-04 · reference" },
    ],
    tint: "#1fbf9a",
  },
  {
    id: "research",
    name: "Specialized research panel",
    status: "Configurable",
    summary:
      "Open channel configuration for research partners developing new molecular recognition targets.",
    channels: [
      { label: "Target A", sub: "CH-01 · custom MIP" },
      { label: "Target B", sub: "CH-02 · custom MIP" },
      { label: "Target C", sub: "CH-03 · custom MIP" },
      { label: "Control", sub: "CH-04 · reference" },
    ],
    tint: "#67e8f9",
  },
];
