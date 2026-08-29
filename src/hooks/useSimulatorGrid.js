import { useMemo } from 'react';
import { mockSimulator } from '../mock/mockSimulator';
import { bilinearInterpolate } from '../utils/simulatorInterpolation';

/**
 * Given a region and absolute wind speed / precipitation values (as set by
 * the What-If sliders), returns the simulated risk score by converting to
 * deltas-from-baseline and interpolating against the precomputed grid.
 */
export function useSimulatorGrid(regionId, windSpeed, precipRate) {
  return useMemo(() => {
    const regionData = mockSimulator.regions[regionId];
    if (!regionData) return null;

    const deltaWind = windSpeed - regionData.baseline.windSpeed;
    const deltaPrecip = precipRate - regionData.baseline.precipRate;

    const simulatedRisk = bilinearInterpolate(
      regionData.grid,
      mockSimulator.deltaWindSteps,
      mockSimulator.deltaPrecipSteps,
      deltaWind,
      deltaPrecip
    );

    return {
      baselineRisk: regionData.baseRisk,
      simulatedRisk,
      delta: Math.round((simulatedRisk - regionData.baseRisk) * 10) / 10,
    };
  }, [regionId, windSpeed, precipRate]);
}