// // Precomputed 2D grid: risk score as a function of ΔT (-5 to +5 °C) and ΔP (-50% to +50%)
// // useSimulatorGrid.js will linearly interpolate between these nodes client-side.
// const deltaTSteps = [-5, -2.5, 0, 2.5, 5];
// const deltaPSteps = [-50, -25, 0, 25, 50];

// function computeRisk(baseRisk, dT, dP) {
//   const tFactor = dT * 4.5;   // warmer air holds more moisture → higher risk
//   const pFactor = dP * 0.6;   // more precipitation → higher risk
//   const score = baseRisk + tFactor + pFactor;
//   return Math.min(100, Math.max(0, Math.round(score)));
// }

// function buildGrid(baseRisk) {
//   const grid = [];
//   for (const dT of deltaTSteps) {
//     for (const dP of deltaPSteps) {
//       grid.push({ deltaT: dT, deltaP: dP, riskScore: computeRisk(baseRisk, dT, dP) });
//     }
//   }
//   return grid;
// }

// export const mockSimulator = {
//   deltaTRange: { min: -5, max: 5, step: 0.5 },
//   deltaPRange: { min: -50, max: 50, step: 5 },

//   // Keyed by regionId — each region has its own base risk + precomputed grid
//   grids: {
//     'IN-MH-MUM': { baseRisk: 60, grid: buildGrid(60) },
//     'IN-HP-SOL': { baseRisk: 50, grid: buildGrid(50) },
//     'IN-HP-SHM': { baseRisk: 45, grid: buildGrid(45) },
//     'IN-UK-RUD': { baseRisk: 42, grid: buildGrid(42) },
//     'IN-AS-GUW': { baseRisk: 35, grid: buildGrid(35) },
//     'IN-WB-DAR': { baseRisk: 38, grid: buildGrid(38) },
//     'IN-TN-CHE': { baseRisk: 15, grid: buildGrid(15) },
//     'IN-MH-PUN': { baseRisk: 10, grid: buildGrid(10) },
//   },
// };

const deltaTSteps = [-5, -2.5, 0, 2.5, 5];
const deltaPSteps = [-50, -25, 0, 25, 50];

// Per-region physical sensitivity profile.
// tSensitivity: how strongly warming increases risk (moisture-holding capacity effect)
// pSensitivity: how strongly precipitation increases risk — elevated for
// mountainous/orographic-lift-prone regions (Solan, Shimla, Rudraprayag, Darjeeling)
// vs. flatter coastal/plains regions (Mumbai, Chennai, Guwahati, Pune).
const regionSensitivity = {
  'IN-MH-MUM': { tSensitivity: 4.5, pSensitivity: 0.65, baseRisk: 60 }, // coastal, flood-prone via drainage not terrain
  'IN-HP-SOL': { tSensitivity: 4.0, pSensitivity: 1.15, baseRisk: 50 }, // mountainous — high orographic sensitivity
  'IN-HP-SHM': { tSensitivity: 3.8, pSensitivity: 1.1, baseRisk: 45 },  // mountainous
  'IN-UK-RUD': { tSensitivity: 3.9, pSensitivity: 1.2, baseRisk: 42 }, // steep Himalayan terrain — highest pSensitivity
  'IN-AS-GUW': { tSensitivity: 4.8, pSensitivity: 0.55, baseRisk: 35 }, // plains, thunderstorm-driven (CAPE-sensitive not terrain)
  'IN-WB-DAR': { tSensitivity: 3.7, pSensitivity: 1.05, baseRisk: 38 }, // hill station, steep slope
  'IN-TN-CHE': { tSensitivity: 4.2, pSensitivity: 0.5, baseRisk: 15 },  // flat coastal plain — low orographic effect
  'IN-MH-PUN': { tSensitivity: 4.3, pSensitivity: 0.5, baseRisk: 10 }, // flat plateau, low terrain sensitivity
};

function computeRisk(baseRisk, dT, dP, tSensitivity, pSensitivity) {
  const tFactor = dT * tSensitivity;
  const pFactor = dP * pSensitivity;
  const score = baseRisk + tFactor + pFactor;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function buildGrid({ baseRisk, tSensitivity, pSensitivity }) {
  const grid = [];
  for (const dT of deltaTSteps) {
    for (const dP of deltaPSteps) {
      grid.push({
        deltaT: dT,
        deltaP: dP,
        riskScore: computeRisk(baseRisk, dT, dP, tSensitivity, pSensitivity),
      });
    }
  }
  return grid;
}

export const mockSimulator = {
  deltaTRange: { min: -5, max: 5, step: 0.5 },
  deltaPRange: { min: -50, max: 50, step: 5 },
  deltaTSteps,
  deltaPSteps,

  grids: Object.fromEntries(
    Object.entries(regionSensitivity).map(([regionId, profile]) => [
      regionId,
      { ...profile, grid: buildGrid(profile) },
    ])
  ),

  // Quick-select named scenarios — applied as a fixed (deltaT, deltaP) pair
  // that overrides slider position when selected.
  presets: [
    {
      id: 'rcp85-extreme',
      label: 'RCP 8.5 — Extreme Warming',
      description: 'High-emissions warming pathway: strong temperature rise with moderate precipitation increase.',
      deltaT: 4.5,
      deltaP: 20,
    },
    {
      id: 'monsoon-burst',
      label: 'Monsoon Burst',
      description: 'Sudden intense precipitation surge with modest warming — simulates a cloudburst-triggering event.',
      deltaT: 1.5,
      deltaP: 45,
    },
    {
      id: 'dry-lull',
      label: 'Dry Lull',
      description: 'Below-average precipitation with slight warming — a suppressed-risk baseline scenario.',
      deltaT: 1.0,
      deltaP: -35,
    },
    {
      id: 'baseline',
      label: 'Current Baseline',
      description: 'No deviation from present-day observed conditions.',
      deltaT: 0,
      deltaP: 0,
    },
  ],
};