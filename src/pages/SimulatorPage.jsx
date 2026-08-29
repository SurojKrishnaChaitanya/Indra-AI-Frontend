// import React, { useEffect, useMemo } from 'react';
// import { mockAlerts } from '../mock/mockAlerts';
// import { mockSimulator } from '../mock/mockSimulator';
// import { useSimulatorGrid } from '../hooks/useSimulatorGrid';
// import { useWeatherStore } from '../store/useWeatherStore';
// import ParameterSliders from '../components/simulator/ParameterSliders';
// import RiskComparisionCanvas from '../components/simulator/RiskComparisionCanvas';
// import SimulatorChat from '../components/simulator/SimulatorChat';

// export default function SimulatorPage() {
//   const selectedRegion = useWeatherStore((state) => state.selectedRegion);
//   const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);
//   const simulatorParams = useWeatherStore((state) => state.simulatorParams);
//   const setSimulatorParams = useWeatherStore((state) => state.setSimulatorParams);
//   const resetSimulatorParams = useWeatherStore((state) => state.resetSimulatorParams);

//   const regionData = selectedRegion?.id ? mockSimulator.regions[selectedRegion.id] : null;
//   const baseline = regionData?.baseline;

//   // Initialize sliders to the selected region's telemetry baseline whenever
//   // the region changes (including on first mount).
//   useEffect(() => {
//     if (baseline) {
//       setSimulatorParams({ windSpeed: baseline.windSpeed, precipRate: baseline.precipRate });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedRegion?.id]);

//   const windSpeed = simulatorParams.windSpeed ?? baseline?.windSpeed ?? 30;
//   const precipRate = simulatorParams.precipRate ?? baseline?.precipRate ?? 40;

//   const result = useSimulatorGrid(selectedRegion?.id, windSpeed, precipRate);

//   const availableRegions = useMemo(
//     () => mockAlerts.map((a) => ({ id: a.regionId, name: a.regionName, state: a.state })),
//     []
//   );

//   const handleApplyPreset = (preset) => {
//     if (!baseline) return;
//     setSimulatorParams({
//       windSpeed: Math.min(
//         mockSimulator.windSpeedRange.max,
//         Math.max(mockSimulator.windSpeedRange.min, baseline.windSpeed + preset.deltaWind)
//       ),
//       precipRate: Math.min(
//         mockSimulator.precipRange.max,
//         Math.max(mockSimulator.precipRange.min, baseline.precipRate + preset.deltaPrecip)
//       ),
//     });
//   };

//   const handleReset = () => {
//     if (baseline) {
//       setSimulatorParams({ windSpeed: baseline.windSpeed, precipRate: baseline.precipRate });
//     } else {
//       resetSimulatorParams();
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">What-If Scenario Simulator</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Adjust wind speed and precipitation to see simulated risk impact.
//           </p>
//         </div>

//         <select
//           value={selectedRegion?.id || ''}
//           onChange={(e) => setSelectedRegion(e.target.value)}
//           className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//         >
//           {availableRegions.map((r) => (
//             <option key={r.id} value={r.id}>
//               {r.name}, {r.state}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
//         <div className="space-y-6">
//           <ParameterSliders
//             windSpeed={windSpeed}
//             precipRate={precipRate}
//             baseline={baseline}
//             onWindChange={(v) => setSimulatorParams({ windSpeed: v })}
//             onPrecipChange={(v) => setSimulatorParams({ precipRate: v })}
//             onApplyPreset={handleApplyPreset}
//             onReset={handleReset}
//           />
//           <SimulatorChat
//             result={result}
//             regionName={selectedRegion?.name}
//             windSpeed={windSpeed}
//             precipRate={precipRate}
//           />
//         </div>

//         <RiskComparisionCanvas result={result} regionName={selectedRegion?.name} />
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo } from 'react';
import { mockAlerts } from '../mock/mockAlerts';
import { mockSimulator } from '../mock/mockSimulator';
import { useSimulatorGrid } from '../hooks/useSimulatorGrid';
import { useWeatherStore } from '../store/useWeatherStore';
import ParameterSliders from '../components/simulator/ParameterSliders';
import RiskComparisionCanvas from '../components/simulator/RiskComparisionCanvas';
import SimulatorChat from '../components/simulator/SimulatorChat';

export default function SimulatorPage() {
  const selectedRegion = useWeatherStore((state) => state.selectedRegion);
  const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);
  const simulatorParams = useWeatherStore((state) => state.simulatorParams);
  const setSimulatorParams = useWeatherStore((state) => state.setSimulatorParams);
  const resetSimulatorParams = useWeatherStore((state) => state.resetSimulatorParams);

  const regionData = selectedRegion?.id ? mockSimulator.regions[selectedRegion.id] : null;
  const baseline = regionData?.baseline;

  // Initialize sliders to the selected region's telemetry baseline whenever
  // the region changes (including on first mount).
  useEffect(() => {
    if (baseline) {
      setSimulatorParams({ windSpeed: baseline.windSpeed, precipRate: baseline.precipRate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion?.id]);

  const windSpeed = simulatorParams.windSpeed ?? baseline?.windSpeed ?? 30;
  const precipRate = simulatorParams.precipRate ?? baseline?.precipRate ?? 40;

  const result = useSimulatorGrid(selectedRegion?.id, windSpeed, precipRate);

  const availableRegions = useMemo(
    () => mockAlerts.map((a) => ({ id: a.regionId, name: a.regionName, state: a.state })),
    []
  );

  const handleApplyPreset = (preset) => {
    if (!baseline) return;
    setSimulatorParams({
      windSpeed: Math.min(
        mockSimulator.windSpeedRange.max,
        Math.max(mockSimulator.windSpeedRange.min, baseline.windSpeed + preset.deltaWind)
      ),
      precipRate: Math.min(
        mockSimulator.precipRange.max,
        Math.max(mockSimulator.precipRange.min, baseline.precipRate + preset.deltaPrecip)
      ),
    });
  };

  const handleReset = () => {
    if (baseline) {
      setSimulatorParams({ windSpeed: baseline.windSpeed, precipRate: baseline.precipRate });
    } else {
      resetSimulatorParams();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 p-6 text-slate-900">
      {/* Background Visual Layer: Reactive Atmospheric Isobar Mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-sky-200/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-[450px] w-[450px] rounded-full bg-indigo-200/20 blur-3xl" />
        
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 120 C 300 320, 600 -80, 1600 220"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8 8"
          />
          <path
            d="M-50 420 C 400 620, 800 120, 1700 520"
            stroke="#38bdf8"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M100 720 C 600 820, 1000 420, 1800 820"
            stroke="#818cf8"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      {/* Main Dashboard Interactive Layer */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">What-If Scenario Simulator</h2>
            <p className="mt-1 text-sm text-slate-500">
              Adjust wind speed and precipitation to see simulated risk impact.
            </p>
          </div>

          <select
            value={selectedRegion?.id || ''}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-10 rounded-lg border border-slate-200/80 bg-white/90 px-3 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {availableRegions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}, {r.state}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <ParameterSliders
              windSpeed={windSpeed}
              precipRate={precipRate}
              baseline={baseline}
              onWindChange={(v) => setSimulatorParams({ windSpeed: v })}
              onPrecipChange={(v) => setSimulatorParams({ precipRate: v })}
              onApplyPreset={handleApplyPreset}
              onReset={handleReset}
            />
            <SimulatorChat
              result={result}
              regionName={selectedRegion?.name}
              windSpeed={windSpeed}
              precipRate={precipRate}
            />
          </div>

          <RiskComparisionCanvas result={result} regionName={selectedRegion?.name} />
        </div>
      </div>
    </div>
  );
}