// import React from 'react';
// import {
//   LineChart, Line, AreaChart, Area, BarChart, Bar,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import { Droplet, CloudLightning, Wind, TrendingUp, MapPin, Activity, Shield } from 'lucide-react';
// import { useWeatherStore } from '../store/useWeatherStore';
// import { mockAlerts } from '../mock/mockAlerts';
// import { mockTelemetry } from '../mock/mockTelemetry';
// import { getRegionThresholds } from '../utils/thresholdEvaluator';

// const SEVERITY_STYLES = {
//   severe: 'bg-red-600',
//   high: 'bg-orange-500',
//   moderate: 'bg-yellow-500',
//   low: 'bg-green-600',
// };

// const THRESHOLD_ICONS = {
//   'flash-flood-critical': Droplet,
//   'cloudburst-warning': CloudLightning,
//   'high-wind-watch': Wind,
// };

// const HAZARD_COLORS = {
//   flashFlood: '#ef4444',
//   cloudburst: '#b45309',
//   thunderstorm: '#f59e0b',
// };

// const CARD = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5';

// function SectionLabel({ icon: Icon, color, children }) {
//   return (
//     <div className="mb-4 flex items-center gap-2">
//       <span
//         className="flex h-7 w-7 items-center justify-center rounded-lg"
//         style={{ backgroundColor: `${color}20`, color }}
//       >
//         <Icon size={15} strokeWidth={2.5} />
//       </span>
//       <p className="text-sm font-bold uppercase tracking-wide text-slate-700">{children}</p>
//     </div>
//   );
// }

// export default function RiskAnalysisPage() {
//   const selectedRegion = useWeatherStore((state) => state.selectedRegion);
//   const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);

//   const telemetry = selectedRegion ? mockTelemetry[selectedRegion.id] : null;
//   const thresholds = selectedRegion ? getRegionThresholds(selectedRegion.id) : null;
//   const sortedAlerts = [...mockAlerts].sort((a, b) => b.riskScore - a.riskScore);

//   return (
//     <div className="grid grid-cols-1 gap-6 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 lg:grid-cols-3">
//       {/* LEFT + CENTER (2/3 width) */}
//       <div className="space-y-6 lg:col-span-2">
//         <div>
//           <h2 className="text-2xl font-extrabold text-slate-900">Risk Analysis</h2>
//           <p className="text-sm font-medium text-slate-500">
//             Multi-hazard risk comparison and regional forecasting
//           </p>
//         </div>

//         {/* Multi-Hazard Risk Comparison */}
//         {telemetry && (
//           <div className={`${CARD} border-t-4 border-t-sky-400`}>
//             <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
//                   <TrendingUp size={15} strokeWidth={2.5} />
//                 </span>
//                 <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
//                   Multi-Hazard Risk Comparison
//                 </p>
//               </div>
//               <div className="flex gap-4 text-xs font-bold text-slate-600">
//                 <span className="flex items-center gap-1.5">
//                   <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.flashFlood }} />
//                   Flash Flood
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.cloudburst }} />
//                   Cloudburst
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.thunderstorm }} />
//                   Thunderstorm
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={260}>
//               <AreaChart data={telemetry.forecastSeries}>
//                 <defs>
//                   <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={HAZARD_COLORS.flashFlood} stopOpacity={0.4} />
//                     <stop offset="95%" stopColor={HAZARD_COLORS.flashFlood} stopOpacity={0.02} />
//                   </linearGradient>
//                   <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={HAZARD_COLORS.cloudburst} stopOpacity={0.35} />
//                     <stop offset="95%" stopColor={HAZARD_COLORS.cloudburst} stopOpacity={0.02} />
//                   </linearGradient>
//                   <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={HAZARD_COLORS.thunderstorm} stopOpacity={0.35} />
//                     <stop offset="95%" stopColor={HAZARD_COLORS.thunderstorm} stopOpacity={0.02} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                 <XAxis dataKey="hour" tickFormatter={(h) => `+${h}h`} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
//                 <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
//                 <Tooltip labelFormatter={(h) => `+${h}h`} />
//                 <Area type="monotone" dataKey="flashFlood" name="Flash Flood" stroke={HAZARD_COLORS.flashFlood} fill="url(#floodGrad)" strokeWidth={2.5} />
//                 <Area type="monotone" dataKey="cloudburst" name="Cloudburst" stroke={HAZARD_COLORS.cloudburst} fill="url(#cloudGrad)" strokeWidth={2.5} />
//                 <Area type="monotone" dataKey="thunderstorm" name="Thunderstorm" stroke={HAZARD_COLORS.thunderstorm} fill="url(#stormGrad)" strokeWidth={2.5} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Overall Risk Evolution */}
//         {telemetry && (
//           <div className={`${CARD} border-t-4 border-t-sky-400`}>
//             <div className="mb-4 flex items-center gap-2">
//               <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
//                 <Activity size={15} strokeWidth={2.5} />
//               </span>
//               <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Overall Risk Evolution</p>
//               <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-extrabold uppercase text-red-700">
//                 {selectedRegion.hazardType}
//               </span>
//             </div>
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={telemetry.forecastSeries}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                 <XAxis dataKey="hour" tickFormatter={(h) => `+${h}h`} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
//                 <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
//                 <Tooltip formatter={(value) => [`${value}%`, 'Risk Score']} labelFormatter={(h) => `+${h}h`} />
//                 <Line type="monotone" dataKey="riskScore" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 7 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Region Risk Ranking */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 border-t-4 border-t-slate-400 bg-white shadow-sm transition-shadow hover:shadow-md">
//           <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">
//             <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
//               <MapPin size={15} strokeWidth={2.5} />
//             </span>
//             <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Region Risk Ranking</p>
//           </div>
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b-2 border-slate-200 bg-slate-100 text-left text-xs font-extrabold uppercase tracking-wide text-slate-600">
//                 <th className="px-5 py-3">Region</th>
//                 <th className="px-5 py-3">State</th>
//                 <th className="px-5 py-3">Hazard</th>
//                 <th className="px-5 py-3">Risk Score</th>
//                 <th className="px-5 py-3">Last Updated</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedAlerts.map((alert) => (
//                 <tr
//                   key={alert.id}
//                   onClick={() =>
//                     setSelectedRegion({
//                       id: alert.regionId,
//                       name: alert.regionName,
//                       state: alert.state,
//                       lat: alert.lat,
//                       lng: alert.lng,
//                       hazardType: alert.hazardType,
//                       riskScore: alert.riskScore,
//                       severity: alert.severity,
//                     })
//                   }
//                   className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-sky-50/60 ${
//                     selectedRegion?.id === alert.regionId ? 'bg-sky-50' : ''
//                   }`}
//                 >
//                   <td className="px-5 py-3 font-bold text-slate-900">
//                     {selectedRegion?.id === alert.regionId && (
//                       <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
//                     )}
//                     {alert.regionName}
//                   </td>
//                   <td className="px-5 py-3 font-medium text-slate-600">{alert.state}</td>
//                   <td className="px-5 py-3 font-medium capitalize text-slate-600">{alert.hazardType}</td>
//                   <td className="px-5 py-3">
//                     <span
//                       className={`rounded-md px-2.5 py-1 text-sm font-extrabold text-white ${SEVERITY_STYLES[alert.severity]}`}
//                     >
//                       {alert.riskScore}%
//                     </span>
//                   </td>
//                   <td className="px-5 py-3 font-medium text-slate-500">
//                     {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* RIGHT (1/3 width) */}
//       <div className="space-y-6">
//         {/* Selected Region */}
//         <div className={`${CARD} border-t-4 border-t-red-400`}>
//           <p className="text-xs font-extrabold uppercase tracking-wide text-red-600">Selected Region</p>
//           {selectedRegion ? (
//             <>
//               <h3 className="mt-1 text-xl font-extrabold text-slate-900">
//                 {selectedRegion.name}, {selectedRegion.state}
//               </h3>
//               <span
//                 className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white ${SEVERITY_STYLES[selectedRegion.severity]} ${
//                   selectedRegion.severity === 'severe' ? 'animate-pulse' : ''
//                 }`}
//               >
//                 {selectedRegion.severity}
//               </span>
//             </>
//           ) : (
//             <p className="mt-1 text-sm text-slate-400">No region selected</p>
//           )}
//         </div>

//         {/* Baseline Deviation */}
//         {telemetry && (
//           <div className={`${CARD} border-t-4 border-t-orange-400`}>
//             <SectionLabel icon={Activity} color="#f97316">Baseline Deviation</SectionLabel>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart
//                 data={[
//                   { metric: 'IWV', Current: telemetry.current.iwv, Normal: telemetry.baseline.iwv },
//                   { metric: 'CAPE', Current: telemetry.current.cape, Normal: telemetry.baseline.cape },
//                   { metric: 'CTT', Current: telemetry.current.ctt, Normal: telemetry.baseline.ctt },
//                 ]}
//                 layout="vertical"
//                 margin={{ left: 10 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
//                 <XAxis type="number" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
//                 <YAxis dataKey="metric" type="category" tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 700 }} width={45} />
//                 <Tooltip />
//                 <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
//                 <Bar dataKey="Normal" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={14} />
//                 <Bar dataKey="Current" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={14} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Active Alert Thresholds */}
//         <div className={`${CARD} border-t-4 border-t-red-400`}>
//           <SectionLabel icon={Shield} color="#dc2626">Active Alert Thresholds</SectionLabel>
//           <div className="space-y-3">
//             {thresholds?.thresholds.map((rule) => {
//               const Icon = THRESHOLD_ICONS[rule.id] ?? Droplet;
//               return (
//                 <div
//                   key={rule.id}
//                   className={`rounded-lg border-2 p-3 transition-colors ${
//                     rule.isMet ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <p className={`flex items-center gap-1.5 text-sm font-bold ${rule.isMet ? 'text-red-700' : 'text-slate-600'}`}>
//                       <Icon size={14} />
//                       {rule.label}
//                     </p>
//                     <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
//                       rule.isMet ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-600'
//                     }`}>
//                       {rule.statusText}
//                     </span>
//                   </div>
//                   <p className="mt-1 font-mono text-xs font-semibold text-slate-500">{rule.ruleText}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Droplet, CloudLightning, Wind, TrendingUp, MapPin, Activity, Shield } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { mockAlerts } from '../mock/mockAlerts';
import { mockTelemetry } from '../mock/mockTelemetry';
import { getRegionThresholds } from '../utils/thresholdEvaluator';

const SEVERITY_STYLES = {
  severe: 'bg-red-600',
  high: 'bg-orange-500',
  moderate: 'bg-yellow-500',
  low: 'bg-green-600',
};

const THRESHOLD_ICONS = {
  'flash-flood-critical': Droplet,
  'cloudburst-warning': CloudLightning,
  'high-wind-watch': Wind,
};

const HAZARD_COLORS = {
  flashFlood: '#ef4444',
  cloudburst: '#b45309',
  thunderstorm: '#f59e0b',
};

const CARD = 'rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5';

function SectionLabel({ icon: Icon, color, children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon size={15} strokeWidth={2.5} />
      </span>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-700">{children}</p>
    </div>
  );
}

export default function RiskAnalysisPage() {
  const selectedRegion = useWeatherStore((state) => state.selectedRegion);
  const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);

  const telemetry = selectedRegion ? mockTelemetry[selectedRegion.id] : null;
  const thresholds = selectedRegion ? getRegionThresholds(selectedRegion.id) : null;
  const sortedAlerts = [...mockAlerts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 85%, rgba(239, 68, 68, 0.06) 0%, transparent 50%),
          linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 24px 24px, 24px 24px'
      }}
    >
      {/* Topographic Isobar Lines Background */}
      <svg 
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100,180 C300,80 600,380 1200,120 T2000,280" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 4" />
        <path d="M-100,320 C400,180 800,480 1400,280 T2200,420" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M-100,480 C200,320 700,580 1300,380 T2000,580" fill="none" stroke="#0284c7" strokeWidth="1" />
        <path d="M-100,620 C500,420 900,720 1500,520 T2300,680" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT + CENTER (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Risk Analysis</h2>
            <p className="text-sm font-medium text-slate-500">
              Multi-hazard risk comparison and regional forecasting
            </p>
          </div>

          {/* Multi-Hazard Risk Comparison */}
          {telemetry && (
            <div className={`${CARD} border-t-4 border-t-sky-400`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                    <TrendingUp size={15} strokeWidth={2.5} />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                    Multi-Hazard Risk Comparison
                  </p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.flashFlood }} />
                    Flash Flood
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.cloudburst }} />
                    Cloudburst
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: HAZARD_COLORS.thunderstorm }} />
                    Thunderstorm
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={telemetry.forecastSeries}>
                  <defs>
                    <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={HAZARD_COLORS.flashFlood} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={HAZARD_COLORS.flashFlood} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={HAZARD_COLORS.cloudburst} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={HAZARD_COLORS.cloudburst} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={HAZARD_COLORS.thunderstorm} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={HAZARD_COLORS.thunderstorm} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tickFormatter={(h) => `+${h}h`} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                  <Tooltip labelFormatter={(h) => `+${h}h`} />
                  <Area type="monotone" dataKey="flashFlood" name="Flash Flood" stroke={HAZARD_COLORS.flashFlood} fill="url(#floodGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="cloudburst" name="Cloudburst" stroke={HAZARD_COLORS.cloudburst} fill="url(#cloudGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="thunderstorm" name="Thunderstorm" stroke={HAZARD_COLORS.thunderstorm} fill="url(#stormGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Overall Risk Evolution */}
          {telemetry && (
            <div className={`${CARD} border-t-4 border-t-sky-400`}>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                  <Activity size={15} strokeWidth={2.5} />
                </span>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Overall Risk Evolution</p>
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-extrabold uppercase text-red-700">
                  {selectedRegion.hazardType}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={telemetry.forecastSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tickFormatter={(h) => `+${h}h`} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Risk Score']} labelFormatter={(h) => `+${h}h`} />
                  <Line type="monotone" dataKey="riskScore" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Region Risk Ranking */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 border-t-4 border-t-slate-400 bg-white/90 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                <MapPin size={15} strokeWidth={2.5} />
              </span>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Region Risk Ranking</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-100/70 text-left text-xs font-extrabold uppercase tracking-wide text-slate-600">
                  <th className="px-5 py-3">Region</th>
                  <th className="px-5 py-3">State</th>
                  <th className="px-5 py-3">Hazard</th>
                  <th className="px-5 py-3">Risk Score</th>
                  <th className="px-5 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {sortedAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() =>
                      setSelectedRegion({
                        id: alert.regionId,
                        name: alert.regionName,
                        state: alert.state,
                        lat: alert.lat,
                        lng: alert.lng,
                        hazardType: alert.hazardType,
                        riskScore: alert.riskScore,
                        severity: alert.severity,
                      })
                    }
                    className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-sky-50/60 ${
                      selectedRegion?.id === alert.regionId ? 'bg-sky-50/80' : ''
                    }`}
                  >
                    <td className="px-5 py-3 font-bold text-slate-900">
                      {selectedRegion?.id === alert.regionId && (
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                      )}
                      {alert.regionName}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-600">{alert.state}</td>
                    <td className="px-5 py-3 font-medium capitalize text-slate-600">{alert.hazardType}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-sm font-extrabold text-white ${SEVERITY_STYLES[alert.severity]}`}
                      >
                        {alert.riskScore}%
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT (1/3 width) */}
        <div className="space-y-6">
          {/* Selected Region */}
          <div className={`${CARD} border-t-4 border-t-red-400`}>
            <p className="text-xs font-extrabold uppercase tracking-wide text-red-600">Selected Region</p>
            {selectedRegion ? (
              <>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                  {selectedRegion.name}, {selectedRegion.state}
                </h3>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white ${SEVERITY_STYLES[selectedRegion.severity]} ${
                    selectedRegion.severity === 'severe' ? 'animate-pulse' : ''
                  }`}
                >
                  {selectedRegion.severity}
                </span>
              </>
            ) : (
              <p className="mt-1 text-sm text-slate-400">No region selected</p>
            )}
          </div>

          {/* Baseline Deviation */}
          {telemetry && (
            <div className={`${CARD} border-t-4 border-t-orange-400`}>
              <SectionLabel icon={Activity} color="#f97316">Baseline Deviation</SectionLabel>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { metric: 'IWV', Current: telemetry.current.iwv, Normal: telemetry.baseline.iwv },
                    { metric: 'CAPE', Current: telemetry.current.cape, Normal: telemetry.baseline.cape },
                    { metric: 'CTT', Current: telemetry.current.ctt, Normal: telemetry.baseline.ctt },
                  ]}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                  <YAxis dataKey="metric" type="category" tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 700 }} width={45} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                  <Bar dataKey="Normal" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="Current" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Active Alert Thresholds */}
          <div className={`${CARD} border-t-4 border-t-red-400`}>
            <SectionLabel icon={Shield} color="#dc2626">Active Alert Thresholds</SectionLabel>
            <div className="space-y-3">
              {thresholds?.thresholds.map((rule) => {
                const Icon = THRESHOLD_ICONS[rule.id] ?? Droplet;
                return (
                  <div
                    key={rule.id}
                    className={`rounded-lg border-2 p-3 transition-colors ${
                      rule.isMet ? 'border-red-300 bg-red-50/90' : 'border-slate-200 bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`flex items-center gap-1.5 text-sm font-bold ${rule.isMet ? 'text-red-700' : 'text-slate-600'}`}>
                        <Icon size={14} />
                        {rule.label}
                      </p>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        rule.isMet ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {rule.statusText}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs font-semibold text-slate-500">{rule.ruleText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}