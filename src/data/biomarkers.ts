export type Biomarker = {
  id: string;
  name: string;
  formula: string;
  channel: string;
  category: string;
  description: string;
  objective: string;
  readout: string;
};

/** First biochemical cartridge — four target biomarkers. */
export const biomarkers: Biomarker[] = [
  {
    id: "cortisol",
    name: "Cortisol",
    formula: "C₂₁H₃₀O₅",
    channel: "CH-01",
    category: "Steroid hormone",
    description: "A hormone involved in the hypothalamic–pituitary–adrenal axis.",
    objective:
      "Study individual stress-response patterns and their relationship with physiological recovery.",
    readout: "MIP · impedimetric",
  },
  {
    id: "glucose",
    name: "Glucose",
    formula: "C₆H₁₂O₆",
    channel: "CH-02",
    category: "Energy substrate",
    description: "A central molecule in energy metabolism.",
    objective:
      "Explore biochemical variations associated with metabolic activity and individual glucose-related patterns.",
    readout: "MIP · voltammetric",
  },
  {
    id: "lactate",
    name: "Lactate",
    formula: "C₃H₅O₃⁻",
    channel: "CH-03",
    category: "Metabolite",
    description: "A metabolite associated with energy production and metabolic activity.",
    objective:
      "Characterize metabolic responses to physical activity and physiological demand.",
    readout: "MIP · voltammetric",
  },
  {
    id: "urea",
    name: "Urea",
    formula: "CH₄N₂O",
    channel: "CH-04",
    category: "Nitrogen metabolism",
    description: "A product of nitrogen metabolism.",
    objective:
      "Explore longitudinal biochemical patterns associated with metabolic and renal physiology.",
    readout: "MIP · impedimetric",
  },
];
