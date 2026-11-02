/** Signals available on the platform (columns of the application matrix). */
export const signals = [
  { id: "glu", label: "Glucose", kind: "bio" },
  { id: "cor", label: "Cortisol", kind: "bio" },
  { id: "lac", label: "Lactate", kind: "bio" },
  { id: "ure", label: "Urea", kind: "bio" },
  { id: "ele", label: "Electrolytes", kind: "bio" },
  { id: "hr", label: "HR / HRV", kind: "phys" },
  { id: "ecg", label: "ECG", kind: "phys" },
  { id: "spo2", label: "SpO₂", kind: "phys" },
  { id: "tmp", label: "Temperature", kind: "phys" },
  { id: "imu", label: "Movement", kind: "phys" },
  { id: "slp", label: "Sleep", kind: "phys" },
] as const;

export type SignalId = (typeof signals)[number]["id"];

export type Application = {
  id: string;
  title: string;
  text: string;
  stage: "Initial focus" | "Expansion module" | "Research track";
  signals: SignalId[];
};

export const applications: Application[] = [
  {
    id: "metabolic",
    title: "Metabolic health",
    text: "Explore glucose-related patterns and metabolic responses by combining biochemical measurements with physiological activity.",
    stage: "Initial focus",
    signals: ["glu", "lac", "hr", "imu", "slp"],
  },
  {
    id: "stress",
    title: "Stress & recovery",
    text: "Relate cortisol dynamics, HRV, heart rate, sleep and physical activity to individual stress-response profiles.",
    stage: "Initial focus",
    signals: ["cor", "hr", "slp", "imu", "tmp"],
  },
  {
    id: "hydration",
    title: "Hydration & thermal regulation",
    text: "Combine sweat composition, electrolyte measurements, temperature and sweat-rate information to characterize hydration and thermal stress.",
    stage: "Expansion module",
    signals: ["ele", "lac", "tmp", "hr", "imu"],
  },
  {
    id: "cardio",
    title: "Cardiovascular monitoring",
    text: "Integrate ECG, PPG, HRV and oxygen saturation for longitudinal cardiovascular monitoring and identification of unusual signal patterns.",
    stage: "Initial focus",
    signals: ["hr", "ecg", "spo2", "imu", "slp"],
  },
  {
    id: "renal",
    title: "Renal & metabolic physiology",
    text: "Explore urea-related molecular patterns and their relationship with additional physiological and biochemical measurements.",
    stage: "Expansion module",
    signals: ["ure", "glu", "ele", "tmp", "hr"],
  },
  {
    id: "neuro",
    title: "Neurological health",
    text: "Develop specialized molecular and digital sensing applications to study neurological biomarkers and changes in movement, sleep and behavior.",
    stage: "Research track",
    signals: ["cor", "imu", "slp", "hr"],
  },
];
