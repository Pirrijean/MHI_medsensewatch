/** Interactive hotspots on the exploded-view render (positions in % of the image). */
export type SensorHotspot = {
  id: string;
  label: string;
  short: string;
  x: number;
  y: number;
  domain: "physiological" | "biochemical";
  principle: string;
  measures: string;
  output: string;
};

export const sensorHotspots: SensorHotspot[] = [
  {
    id: "optical",
    label: "Optical sensor",
    short: "PPG",
    x: 49.5,
    y: 48,
    domain: "physiological",
    principle:
      "Multi-wavelength LEDs illuminate the skin; photodiodes capture the pulsatile change in absorbed light produced by each cardiac cycle (photoplethysmography).",
    measures: "Heart rate, inter-beat intervals, SpO₂ estimation",
    output: "Pulse waveform · HR · HRV · SpO₂",
  },
  {
    id: "thermal",
    label: "Thermal sensor",
    short: "TEMP",
    x: 56,
    y: 45.3,
    domain: "physiological",
    principle:
      "A contact thermistor in direct thermal coupling with the skin records surface temperature and continuously compensates electrochemical kinetics.",
    measures: "Skin-surface temperature",
    output: "Thermoregulation trend · kinetic calibration",
  },
  {
    id: "imu",
    label: "Inertial unit",
    short: "IMU",
    x: 57,
    y: 31,
    domain: "physiological",
    principle:
      "A 6-axis accelerometer and gyroscope sample motion to quantify activity, posture and gait-related patterns — and to gate motion artefacts across optical and electrochemical streams.",
    measures: "Movement, activity intensity, gait patterns",
    output: "Activity context · artefact rejection",
  },
  {
    id: "electrode",
    label: "Readout electrodes",
    short: "EC",
    x: 50.5,
    y: 59.5,
    domain: "biochemical",
    principle:
      "A flexible bioelectronic interface routes each sensing channel to a low-noise multi-channel potentiostat that applies controlled potentials and acquires voltammetric / impedimetric signals.",
    measures: "Faradaic current & interfacial impedance per channel",
    output: "Calibrated molecular concentration",
  },
  {
    id: "mip",
    label: "MIP cartridge",
    short: "MIP",
    x: 57,
    y: 72.5,
    domain: "biochemical",
    principle:
      "Molecularly imprinted polymers contain cavities shaped around each target molecule. Binding modulates the electrode interface; a controlled potential pulse releases the analyte and regenerates the surface.",
    measures: "Cortisol · glucose · lactate · urea · sweat pH",
    output: "Selective recognition · regenerable cycles",
  },
  {
    id: "microfluidic",
    label: "Microfluidics",
    short: "µF",
    x: 42.5,
    y: 76,
    domain: "biochemical",
    principle:
      "Serpentine microchannels draw sweat from the skin by capillary action, transport it across the sensing chambers and continuously renew the sample to prevent cross-cycle carryover.",
    measures: "Capillary collection, transport and flow renewal",
    output: "Fresh sweat sample at each measurement cycle",
  },
];

/**
 * The seven architectural layers of MedSense Watch in strict top-to-bottom sequence (01 → 07).
 * Order matches `layerArt` in `DeviceExplodedView.tsx`.
 */
export const deviceLayers = [
  {
    n: "01",
    title: "Processing and communication",
    text: "Embedded electronics manage sensor acquisition, pH/thermal calibration, signal processing and encrypted wireless communication.",
  },
  {
    n: "02",
    title: "Physiological sensor array",
    text: "Optical PPG, skin-contact thermal and 6-axis inertial sensing elements continuously monitor physiological activity.",
  },
  {
    n: "03",
    title: "Bioelectronic interface",
    text: "A flexible polyimide-gold interface connects the reusable MedSense Watch body with the replaceable biochemical cartridge.",
  },
  {
    n: "04",
    title: "Electrochemical sensing array",
    text: "Functionalized working, reference and counter electrodes translate molecular recognition events into measurable electrical signals.",
  },
  {
    n: "05",
    title: "Molecular recognition layer",
    text: "Molecularly imprinted polymers (MIPs) provide target-selective synthetic cavities for cortisol, glucose, lactate and urea.",
  },
  {
    n: "06",
    title: "Regeneration mechanism",
    text: "Controlled electrochemical potential pulses desorb bound analytes and restore the sensing surface for repeated measurement cycles.",
  },
  {
    n: "07",
    title: "Microfluidic sampling system",
    text: "Capillary microchannels collect, filter, transport and renew the sweat sample across the sensing chambers.",
  },
] as const;
