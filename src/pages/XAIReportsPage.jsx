// import React from 'react';
// import {
//   ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';
// import { Brain, TrendingUp, TrendingDown, BarChart3, Flame, Sparkles } from 'lucide-react';
// import { useWeatherStore } from '../store/useWeatherStore';
// import { mockAlerts } from '../mock/mockAlerts';
// import { mockXaiData } from '../mock/mockXaiData';

// const HAZARD_COLORS = {
//   flashFlood: '#ef4444',
//   cloudburst: '#b45309',
//   thunderstorm: '#f59e0b',
// };

// function confidenceColor(value) {
//   if (value >= 80) return '#dc2626';
//   if (value >= 50) return '#f59e0b';
//   return '#16a34a';
// }

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

// function ConfidenceRing({ value }) {
//   const radius = 32;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (value / 100) * circumference;
//   const color = confidenceColor(value);
//   return (
//     <div className="relative flex h-20 w-20 items-center justify-center">
//       <svg width="80" height="80" className="-rotate-90">
//         <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
//         <circle
//           cx="40" cy="40" r={radius}
//           stroke={color} strokeWidth="8" fill="none"
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           style={{ transition: 'stroke-dashoffset 0.6s ease' }}
//         />
//       </svg>
//       <span className={`absolute text-xl font-extrabold ${value >= 80 ? 'animate-pulse' : ''}`} style={{ color }}>
//         {value}%
//       </span>
//     </div>
//   );
// }

// function AttentionHeatmap({ grid, color }) {
//   if (!grid || grid.length === 0) return null;
//   const lngs = grid.map((p) => p.position[0]);
//   const lats = grid.map((p) => p.position[1]);
//   const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
//   const minLat = Math.min(...lats), maxLat = Math.max(...lats);
//   const pad = 24;
//   const w = 260, h = 180;
//   const toX = (lng) => pad + ((lng - minLng) / (maxLng - minLng || 1)) * (w - pad * 2);
//   const toY = (lat) => h - pad - ((lat - minLat) / (maxLat - minLat || 1)) * (h - pad * 2);
  
//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full">
//       <defs>
//         <filter id="heatBlur" x="-20%" y="-20%" width="140%" height="140%">
//           <feGaussianBlur stdDeviation="8" />
//         </filter>
//       </defs>
//       <rect x="0" y="0" width={w} height={h} rx="10" fill="#f1f5f9" />
//       <g filter="url(#heatBlur)">
//         {grid.map((p, i) => (
//           <circle
//             key={i}
//             cx={toX(p.position[0])}
//             cy={toY(p.position[1])}
//             r={3 + p.attentionWeight * 14}
//             fill={color}
//             opacity={p.attentionWeight * 0.7}
//           />
//         ))}
//       </g>
//       <circle cx={w / 2} cy={h / 2} r="5" fill={color} stroke="white" strokeWidth="2" />
//       <text x={w / 2} y={h - 8} textAnchor="middle" className="fill-slate-600" fontSize="10" fontWeight="700">
//         AI Focus Zone
//       </text>
//     </svg>
//   );
// }

// export default function XAIReportsPage() {
//   const selectedRegion = useWeatherStore((state) => state.selectedRegion);
//   const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);

//   const predictions = Object.keys(mockXaiData)
//     .map((regionId) => {
//       const alert = mockAlerts.find((a) => a.regionId === regionId);
//       return { regionId, xai: mockXaiData[regionId], alert };
//     })
//     .filter((p) => p.alert)
//     .sort((a, b) => new Date(b.xai.generatedAt) - new Date(a.xai.generatedAt));

//   const activeId = selectedRegion?.id && mockXaiData[selectedRegion.id]
//     ? selectedRegion.id
//     : predictions[0]?.regionId;

//   const active = predictions.find((p) => p.regionId === activeId);
//   const xai = active?.xai;
//   const hazardColor = xai ? HAZARD_COLORS[xai.hazardType] ?? '#0ea5e9' : '#0ea5e9';

//   function selectPrediction(p) {
//     setSelectedRegion({
//       id: p.alert.regionId,
//       name: p.alert.regionName,
//       state: p.alert.state,
//       lat: p.alert.lat,
//       lng: p.alert.lng,
//       hazardType: p.alert.hazardType,
//       riskScore: p.alert.riskScore,
//       severity: p.alert.severity,
//     });
//   }

//   if (!xai || !active) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-bold">XAI Reports</h2>
//         <p className="mt-1 text-sm text-slate-400">No predictions available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-6 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 lg:grid-cols-4">
//       {/* LEFT: Recent Predictions list */}
//       <div className="space-y-3 lg:col-span-1">
//         <h2 className="text-2xl font-extrabold text-slate-900">XAI Reports</h2>
//         <div className="space-y-2">
//           {predictions.map((p) => (
//             <button
//               key={p.regionId}
//               onClick={() => selectPrediction(p)}
//               className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
//                 p.regionId === activeId
//                   ? 'border-sky-400 bg-sky-50 shadow-md ring-1 ring-sky-200'
//                   : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50 hover:shadow-sm'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <span className="font-extrabold text-slate-900">{p.alert.regionName}</span>
//                 <span
//                   className="rounded-full px-2 py-0.5 text-xs font-extrabold text-white"
//                   style={{ backgroundColor: confidenceColor(p.xai.confidence) }}
//                 >
//                   {p.xai.confidence}%
//                 </span>
//               </div>
//               <p className="mt-0.5 text-xs font-semibold capitalize text-slate-500">
//                 {p.alert.state} · {p.xai.hazardType}
//               </p>
//               <p className="mt-0.5 text-xs font-medium text-slate-400">
//                 {new Date(p.xai.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT: Report detail */}
//       <div className="space-y-6 lg:col-span-3">
//         {/* Header */}
//         <div
//           className="flex items-center justify-between rounded-xl border-2 p-5 shadow-sm transition-shadow hover:shadow-md"
//           style={{ background: `linear-gradient(135deg, ${hazardColor}18, white 65%)`, borderColor: `${hazardColor}40` }}
//         >
//           <div>
//             <h3 className="text-2xl font-extrabold text-slate-900">
//               {active.alert.regionName}, {active.alert.state}
//             </h3>
//             <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
//               {new Date(xai.generatedAt).toLocaleString([], {
//                 hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric',
//               })}
//               <span
//                 className="rounded-full px-2.5 py-1 text-xs font-extrabold capitalize text-white"
//                 style={{ backgroundColor: hazardColor }}
//               >
//                 {xai.hazardType}
//               </span>
//             </p>
//           </div>
//           <ConfidenceRing value={xai.confidence} />
//         </div>

//         {/* Plain-Language Summary */}
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
//           <SectionLabel icon={Brain} color="#0ea5e9">Plain-Language Summary</SectionLabel>
//           <p className="text-sm font-medium leading-relaxed text-slate-800">{xai.plainLanguageSummary}</p>
//         </div>

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* Feature Contribution */}
//           <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
//             <SectionLabel icon={BarChart3} color={hazardColor}>Feature Contribution</SectionLabel>
//             <div className="space-y-3">
//               {xai.featureContribution.map((f) => (
//                 <div key={f.feature}>
//                   <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
//                     <span>{f.feature}</span>
//                     <span className="font-extrabold text-slate-900">{f.weight}%</span>
//                   </div>
//                   <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full transition-all duration-500"
//                       style={{ width: `${f.weight}%`, backgroundColor: hazardColor }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Attention Heatmap */}
//           <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
//             <SectionLabel icon={Flame} color={hazardColor}>Attention Heatmap</SectionLabel>
//             <AttentionHeatmap grid={xai.attentionGrid} color={hazardColor} />
//           </div>
//         </div>

//         {/* What Changed */}
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
//           <SectionLabel icon={Sparkles} color="#0ea5e9">What Changed (Last 15m)</SectionLabel>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//             {[
//               { label: 'IWV (Integrated Water Vapor)', ...xai.whatChanged.iwv },
//               { label: 'CTT (Cloud Top Temp)', ...xai.whatChanged.ctt },
//               { label: 'Overall Risk Score', value: xai.whatChanged.riskScore.value, delta: xai.whatChanged.riskScore.delta, unit: '%' },
//             ].map((row) => {
//               const up = row.delta >= 0;
//               return (
//                 <div key={row.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
//                   <p className="text-xs font-bold text-slate-500">{row.label}</p>
//                   <p className="mt-1 text-2xl font-extrabold text-slate-900">
//                     {row.value}
//                     {row.unit ?? ''}
//                   </p>
//                   <p
//                     className={`mt-1 flex items-center gap-1 text-xs font-extrabold ${
//                       up ? 'text-red-600' : 'text-green-600'
//                     }`}
//                   >
//                     {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
//                     {up ? '+' : ''}{row.delta}{row.unit ?? ''}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Model Calibration */}
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
//           <SectionLabel icon={BarChart3} color="#0ea5e9">
//             Model Calibration — Hist. Accuracy vs Pred. Confidence
//           </SectionLabel>
//           <ResponsiveContainer width="100%" height={220}>
//             <ComposedChart margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//               <XAxis
//                 type="number" dataKey="predictedConfidence" name="Predicted"
//                 domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
//                 label={{ value: 'Predicted Confidence', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b', fontWeight: 700 }}
//               />
//               <YAxis
//                 type="number" dataKey="historicalAccuracy" name="Actual"
//                 domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
//               />
//               <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//               <Line
//                 data={[{ predictedConfidence: 0, historicalAccuracy: 0 }, { predictedConfidence: 100, historicalAccuracy: 100 }]}
//                 dataKey="historicalAccuracy" stroke="#cbd5e1" strokeDasharray="4 4" dot={false} legendType="none"
//               />
//               <Scatter data={xai.calibration} fill={hazardColor} />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef } from 'react';
import {
  ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Brain, TrendingUp, TrendingDown, BarChart3, Flame, Sparkles } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { mockAlerts } from '../mock/mockAlerts';
import { mockXaiData } from '../mock/mockXaiData';

const HAZARD_COLORS = {
  flashFlood: '#ef4444',
  cloudburst: '#b45309',
  thunderstorm: '#f59e0b',
};

const CARD_STYLE = 'rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-sm transition-all hover:shadow-md';

function confidenceColor(value) {
  if (value >= 80) return '#dc2626';
  if (value >= 50) return '#f59e0b';
  return '#16a34a';
}

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

function ConfidenceRing({ value }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = confidenceColor(value);
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg width="80" height="80" className="-rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="40" cy="40" r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className={`absolute text-xl font-extrabold ${value >= 80 ? 'animate-pulse' : ''}`} style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

function AttentionHeatmap({ grid, color }) {
  if (!grid || grid.length === 0) return null;
  const lngs = grid.map((p) => p.position[0]);
  const lats = grid.map((p) => p.position[1]);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const pad = 24;
  const w = 260, h = 180;
  const toX = (lng) => pad + ((lng - minLng) / (maxLng - minLng || 1)) * (w - pad * 2);
  const toY = (lat) => h - pad - ((lat - minLat) / (maxLat - minLat || 1)) * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full">
      <defs>
        <filter id="heatBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="10" fill="#f1f5f9" />
      <g filter="url(#heatBlur)">
        {grid.map((p, i) => (
          <circle
            key={i}
            cx={toX(p.position[0])}
            cy={toY(p.position[1])}
            r={3 + p.attentionWeight * 14}
            fill={color}
            opacity={p.attentionWeight * 0.7}
          />
        ))}
      </g>
      <circle cx={w / 2} cy={h / 2} r="5" fill={color} stroke="white" strokeWidth="2" />
      <text x={w / 2} y={h - 8} textAnchor="middle" className="fill-slate-600" fontSize="10" fontWeight="700">
        AI Focus Zone
      </text>
    </svg>
  );
}

// Zero-dependency Canvas 2D Light-Mode Neural Node Particle Network
function NeuralCanvas({ color = '#0ea5e9' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 45;
    const maxDist = 130;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.45;
        ctx.fill();

        // Connect neural link lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / maxDist) * 0.25;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function XAIReportsPage() {
  const selectedRegion = useWeatherStore((state) => state.selectedRegion);
  const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);

  const predictions = Object.keys(mockXaiData)
    .map((regionId) => {
      const alert = mockAlerts.find((a) => a.regionId === regionId);
      return { regionId, xai: mockXaiData[regionId], alert };
    })
    .filter((p) => p.alert)
    .sort((a, b) => new Date(b.xai.generatedAt) - new Date(a.xai.generatedAt));

  const activeId = selectedRegion?.id && mockXaiData[selectedRegion.id]
    ? selectedRegion.id
    : predictions[0]?.regionId;

  const active = predictions.find((p) => p.regionId === activeId);
  const xai = active?.xai;
  const hazardColor = xai ? HAZARD_COLORS[xai.hazardType] ?? '#0ea5e9' : '#0ea5e9';

  function selectPrediction(p) {
    setSelectedRegion({
      id: p.alert.regionId,
      name: p.alert.regionName,
      state: p.alert.state,
      lat: p.alert.lat,
      lng: p.alert.lng,
      hazardType: p.alert.hazardType,
      riskScore: p.alert.riskScore,
      severity: p.alert.severity,
    });
  }

  if (!xai || !active) {
    return (
      <div className="relative min-h-screen p-6 bg-slate-50 text-slate-900">
        <h2 className="text-xl font-bold">XAI Reports</h2>
        <p className="mt-1 text-sm text-slate-400">No predictions available.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 text-slate-900">
      {/* Light Theme Neural Node Canvas Background */}
      <NeuralCanvas color={hazardColor} />

      {/* Content Layer */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* LEFT: Recent Predictions list */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-2xl font-extrabold text-slate-900">XAI Reports</h2>
          <div className="space-y-2">
            {predictions.map((p) => (
              <button
                key={p.regionId}
                onClick={() => selectPrediction(p)}
                className={`w-full rounded-xl border-2 p-3 text-left backdrop-blur-md transition-all ${
                  p.regionId === activeId
                    ? 'border-sky-400 bg-sky-50/90 shadow-md ring-1 ring-sky-200'
                    : 'border-slate-200/80 bg-white/80 hover:border-sky-300 hover:bg-slate-50/90 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{p.alert.regionName}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-extrabold text-white"
                    style={{ backgroundColor: confidenceColor(p.xai.confidence) }}
                  >
                    {p.xai.confidence}%
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold capitalize text-slate-500">
                  {p.alert.state} · {p.xai.hazardType}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {new Date(p.xai.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Report Detail */}
        <div className="space-y-6 lg:col-span-3">
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-xl border-2 p-5 backdrop-blur-md shadow-sm transition-shadow hover:shadow-md"
            style={{
              background: `linear-gradient(135deg, ${hazardColor}18, rgba(255, 255, 255, 0.95) 70%)`,
              borderColor: `${hazardColor}40`,
            }}
          >
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {active.alert.regionName}, {active.alert.state}
              </h3>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                {new Date(xai.generatedAt).toLocaleString([], {
                  hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric',
                })}
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-extrabold capitalize text-white"
                  style={{ backgroundColor: hazardColor }}
                >
                  {xai.hazardType}
                </span>
              </p>
            </div>
            <ConfidenceRing value={xai.confidence} />
          </div>

          {/* Plain-Language Summary */}
          <div className={CARD_STYLE}>
            <SectionLabel icon={Brain} color="#0ea5e9">Plain-Language Summary</SectionLabel>
            <p className="text-sm font-medium leading-relaxed text-slate-800">{xai.plainLanguageSummary}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Feature Contribution */}
            <div className={CARD_STYLE}>
              <SectionLabel icon={BarChart3} color={hazardColor}>Feature Contribution</SectionLabel>
              <div className="space-y-3">
                {xai.featureContribution.map((f) => (
                  <div key={f.feature}>
                    <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
                      <span>{f.feature}</span>
                      <span className="font-extrabold text-slate-900">{f.weight}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${f.weight}%`, backgroundColor: hazardColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Heatmap */}
            <div className={CARD_STYLE}>
              <SectionLabel icon={Flame} color={hazardColor}>Attention Heatmap</SectionLabel>
              <AttentionHeatmap grid={xai.attentionGrid} color={hazardColor} />
            </div>
          </div>

          {/* What Changed */}
          <div className={CARD_STYLE}>
            <SectionLabel icon={Sparkles} color="#0ea5e9">What Changed (Last 15m)</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'IWV (Integrated Water Vapor)', ...xai.whatChanged.iwv },
                { label: 'CTT (Cloud Top Temp)', ...xai.whatChanged.ctt },
                { label: 'Overall Risk Score', value: xai.whatChanged.riskScore.value, delta: xai.whatChanged.riskScore.delta, unit: '%' },
              ].map((row) => {
                const up = row.delta >= 0;
                return (
                  <div key={row.label} className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 transition-colors hover:bg-slate-100/90">
                    <p className="text-xs font-bold text-slate-500">{row.label}</p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {row.value}
                      {row.unit ?? ''}
                    </p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-xs font-extrabold ${
                        up ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {up ? '+' : ''}{row.delta}{row.unit ?? ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Calibration */}
          <div className={CARD_STYLE}>
            <SectionLabel icon={BarChart3} color="#0ea5e9">
              Model Calibration — Hist. Accuracy vs Pred. Confidence
            </SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number" dataKey="predictedConfidence" name="Predicted"
                  domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  label={{ value: 'Predicted Confidence', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b', fontWeight: 700 }}
                />
                <YAxis
                  type="number" dataKey="historicalAccuracy" name="Actual"
                  domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }} />
                <Line
                  data={[{ predictedConfidence: 0, historicalAccuracy: 0 }, { predictedConfidence: 100, historicalAccuracy: 100 }]}
                  dataKey="historicalAccuracy" stroke="#cbd5e1" strokeDasharray="4 4" dot={false} legendType="none"
                />
                <Scatter data={xai.calibration} fill={hazardColor} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}