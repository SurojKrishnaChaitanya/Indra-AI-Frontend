// Precomputed 2D grid: risk score as a function of ΔT (-5 to +5 °C) and ΔP (-50% to +50%)
// useSimulatorGrid.js will linearly interpolate between these nodes client-side.
const deltaTSteps = [-5, -2.5, 0, 2.5, 5];
const deltaPSteps = [-50, -25, 0, 25, 50];

function computeRisk(baseRisk, dT, dP) {
  const tFactor = dT * 4.5;   // warmer air holds more moisture → higher risk
  const pFactor = dP * 0.6;   // more precipitation → higher risk
  const score = baseRisk + tFactor + pFactor;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function buildGrid(baseRisk) {
  const grid = [];
  for (const dT of deltaTSteps) {
    for (const dP of deltaPSteps) {
      grid.push({ deltaT: dT, deltaP: dP, riskScore: computeRisk(baseRisk, dT, dP) });
    }
  }
  return grid;
}

export const mockSimulator = {
  deltaTRange: { min: -5, max: 5, step: 0.5 },
  deltaPRange: { min: -50, max: 50, step: 5 },

  // Keyed by regionId — each region has its own base risk + precomputed grid
  grids: {
    'IN-MH-MUM': { baseRisk: 60, grid: buildGrid(60) },
    'IN-HP-SOL': { baseRisk: 50, grid: buildGrid(50) },
    'IN-HP-SHM': { baseRisk: 45, grid: buildGrid(45) },
    'IN-UK-RUD': { baseRisk: 42, grid: buildGrid(42) },
    'IN-AS-GUW': { baseRisk: 35, grid: buildGrid(35) },
    'IN-WB-DAR': { baseRisk: 38, grid: buildGrid(38) },
    'IN-TN-CHE': { baseRisk: 15, grid: buildGrid(15) },
    'IN-MH-PUN': { baseRisk: 10, grid: buildGrid(10) },
  },
};