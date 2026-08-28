// Bilinear interpolation over the precomputed 5x5 (deltaT x deltaP) risk grid.
// Lets slider positions between grid nodes (e.g. deltaT=1.5) resolve to a
// smooth, continuous risk score with zero server round-trip.

function findBracket(steps, value) {
  // Returns [lower, upper] steps that bracket `value`, clamped to range bounds.
  if (value <= steps[0]) return [steps[0], steps[0]];
  if (value >= steps[steps.length - 1]) return [steps[steps.length - 1], steps[steps.length - 1]];

  for (let i = 0; i < steps.length - 1; i++) {
    if (value >= steps[i] && value <= steps[i + 1]) {
      return [steps[i], steps[i + 1]];
    }
  }
  return [steps[0], steps[steps.length - 1]];
}

function getNodeValue(grid, deltaT, deltaP) {
  const node = grid.find((g) => g.deltaT === deltaT && g.deltaP === deltaP);
  return node ? node.riskScore : 0;
}

export function bilinearInterpolate(grid, deltaTSteps, deltaPSteps, targetT, targetP) {
  const [t0, t1] = findBracket(deltaTSteps, targetT);
  const [p0, p1] = findBracket(deltaPSteps, targetP);

  const q11 = getNodeValue(grid, t0, p0);
  const q21 = getNodeValue(grid, t1, p0);
  const q12 = getNodeValue(grid, t0, p1);
  const q22 = getNodeValue(grid, t1, p1);

  // Normalized position within the bracket (0..1); guard against zero-width brackets
  const tRatio = t1 === t0 ? 0 : (targetT - t0) / (t1 - t0);
  const pRatio = p1 === p0 ? 0 : (targetP - p0) / (p1 - p0);

  const top = q11 + (q21 - q11) * tRatio;
  const bottom = q12 + (q22 - q12) * tRatio;
  const result = top + (bottom - top) * pRatio;

  return Math.round(Math.min(100, Math.max(0, result)) * 10) / 10;
}