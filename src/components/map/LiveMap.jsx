// import React, { useState, useMemo } from 'react';
// import Map from '@vis.gl/react-maplibre';
// import DeckGL from '@deck.gl/react';
// import { PolygonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
// import { FlyToInterpolator } from '@deck.gl/core';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import { HeatmapLayer } from '@deck.gl/aggregation-layers';

// import { mockAlerts } from '../../mock/mockAlerts'; 
// import { mockTelemetry } from '../../mock/mockTelemetry';
// import { useWeatherStore } from '../../store/useWeatherStore';

// const MAP_STYLE = {
//   version: 8,
//   sources: {
//     'osm-tiles': {
//       type: 'raster',
//       tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
//       tileSize: 256,
//       attribution: '&copy; OpenStreetMap contributors',
//     },
//   },
//   layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles' }],
// };

// const INDIA_VIEW_STATE = {
//   longitude: 78.9629,
//   latitude: 22.5937,
//   zoom: 4.3,
//   pitch: 0,
//   bearing: 0,
// };

// function createCirclePolygon(centerLng, centerLat, radiusKm, points = 64) {
//   const coords = [];
//   const kmInDegLat = 1 / 111.0;
//   const kmInDegLng = 1 / (111.0 * Math.cos((centerLat * Math.PI) / 180));
//   for (let i = 0; i < points; i++) {
//     const theta = (i / points) * (2 * Math.PI);
//     coords.push([
//       centerLng + radiusKm * kmInDegLng * Math.cos(theta),
//       centerLat + radiusKm * kmInDegLat * Math.sin(theta),
//     ]);
//   }
//   coords.push(coords[0]);
//   return coords;
// }

// export default function LiveMap() {
//   const [viewState, setViewState] = useState(INDIA_VIEW_STATE);
//   const [selectedAlert, setSelectedAlert] = useState(null);
//   const [activeLayerMode, setActiveLayerMode] = useState('contour');

//   const forecastHorizon = useWeatherStore((state) => state.forecastHorizon);
//   const setForecastHorizonValue = useWeatherStore((state) => state.setForecastHorizonValue);
//   const mapLayers = useWeatherStore((state) => state.mapLayers);
//   const setActiveHazard = useWeatherStore((state) => state.setActiveHazard);

//   const telemetryData = useMemo(() => {
//     if (!selectedAlert?.regionId) return null;
//     return mockTelemetry[selectedAlert.regionId] || null;
//   }, [selectedAlert]);

//   const activeReadings = useMemo(() => {
//     if (!telemetryData) return null;
//     const selectedHour = forecastHorizon?.value || 3;
//     const seriesItem = telemetryData.forecastSeries?.find((s) => s.hour === selectedHour);
    
//     return {
//       iwv: seriesItem?.iwv ?? telemetryData.current?.iwv,
//       cape: seriesItem?.cape ?? telemetryData.current?.cape,
//       ctt: seriesItem?.ctt ?? telemetryData.current?.ctt,
//       cin: telemetryData.current?.cin,
//       riskScore: seriesItem?.riskScore ?? selectedAlert?.riskScore,
//     };
//   }, [telemetryData, forecastHorizon?.value, selectedAlert]);

//   const filteredAlerts = useMemo(() => {
//     const hazardFilter = mapLayers?.activeHazard;
//     if (!hazardFilter || hazardFilter === 'all') return mockAlerts;
//     return mockAlerts.filter(
//       (a) => (a.hazardType || '').toLowerCase() === hazardFilter.toLowerCase()
//     );
//   }, [mapLayers?.activeHazard]);

//   const handleSelectAlert = (alertItem) => {
//     if (alertItem.lng == null || alertItem.lat == null) return;

//     setSelectedAlert(alertItem);
//     setViewState({
//       longitude: alertItem.lng,
//       latitude: alertItem.lat,
//       zoom: 11.5,
//       pitch: 0,
//       bearing: 0,
//       transitionDuration: 1800,
//       transitionInterpolator: new FlyToInterpolator(),
//     });
//   };

//   const handleResetToIndia = () => {
//     setSelectedAlert(null);
//     setViewState({
//       ...INDIA_VIEW_STATE,
//       transitionDuration: 1500,
//       transitionInterpolator: new FlyToInterpolator(),
//     });
//   };
//     // Replace your existing "const layers = useMemo(...)" with this block:
//   const layers = useMemo(() => {
//         const activeDeckLayers = [];

//         // 1. DYNAMIC HEATMAP OVERLAY (based on activeLayerMode)
//         if (activeLayerMode === 'contour') {
//         activeDeckLayers.push(
//             new HeatmapLayer({
//             id: 'risk-heatmap',
//             data: filteredAlerts,
//             getPosition: (d) => [d.lng, d.lat],
//             getWeight: (d) => d.riskScore,
//             radiusPixels: 70,
//             intensity: 1.5,
//             })
//         );
//         } else if (activeLayerMode === 'moisture') {
//         activeDeckLayers.push(
//             new HeatmapLayer({
//             id: 'moisture-heatmap',
//             data: filteredAlerts,
//             getPosition: (d) => [d.lng, d.lat],
//             getWeight: (d) => mockTelemetry[d.regionId]?.current?.iwv || 0,
//             colorRange: [
//                 [224, 242, 254, 100],
//                 [56, 189, 248, 180],
//                 [14, 116, 144, 220],
//                 [3, 105, 161, 255],
//             ],
//             radiusPixels: 80,
//             })
//         );
//         } else if (activeLayerMode === 'instability') {
//         activeDeckLayers.push(
//             new HeatmapLayer({
//             id: 'instability-heatmap',
//             data: filteredAlerts,
//             getPosition: (d) => [d.lng, d.lat],
//             getWeight: (d) => mockTelemetry[d.regionId]?.current?.cape || 0,
//             colorRange: [
//                 [254, 240, 138, 100],
//                 [249, 115, 22, 180],
//                 [220, 38, 38, 220],
//                 [127, 29, 29, 255],
//             ],
//             radiusPixels: 80,
//             })
//         );
//         }

//         // 2. BASE SCATTERPLOT PINS (Rendered on top of heatmaps)
//         activeDeckLayers.push(
//         new ScatterplotLayer({
//             id: 'alert-hotspots',
//             data: filteredAlerts,
//             pickable: true,
//             getPosition: (d) => [d.lng, d.lat],
//             getRadius: (d) => (selectedAlert?.id === d.id ? 14000 : 25000),
//             getFillColor: (d) =>
//             d.severity === 'severe'
//                 ? [239, 68, 68, 230]
//                 : d.severity === 'high'
//                 ? [249, 115, 22, 230]
//                 : d.severity === 'moderate'
//                 ? [250, 204, 21, 230]
//                 : [74, 222, 128, 230],
//             getLineColor: [255, 255, 255, 255],
//             getLineWidth: 3,
//             stroked: true,
//             radiusMinPixels: 10,
//             radiusMaxPixels: 24,
//             onClick: (info) => info.object && handleSelectAlert(info.object),
//         }),

//         new TextLayer({
//             id: 'alert-labels',
//             data: filteredAlerts,
//             getPosition: (d) => [d.lng, d.lat],
//             getText: (d) => `${d.regionName} (${d.severity})`,
//             getSize: 12,
//             getColor: [30, 41, 59, 255],
//             getPixelOffset: [0, -22],
//             fontFamily: 'sans-serif',
//             fontWeight: 'bold',
//         })
//         );

//         // 3. TARGET RINGS (Rendered when a region is selected)
//         if (selectedAlert?.lng && selectedAlert?.lat) {
//         activeDeckLayers.push(
//             new PolygonLayer({
//             id: 'radar-range-rings',
//             data: [
//                 { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 2.0), color: [234, 88, 12, 220] },
//                 { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 4.0), color: [217, 119, 6, 200] },
//                 { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 6.0), color: [5, 150, 105, 180] },
//             ],
//             getPolygon: (d) => d.polygon,
//             getFillColor: [0, 0, 0, 0],
//             getLineColor: (d) => d.color,
//             getLineWidth: 1.5,
//             lineWidthUnits: 'pixels',
//             filled: false,
//             stroked: true,
//             })
//         );
//         }

//         return activeDeckLayers;
//     }, [filteredAlerts, selectedAlert, activeLayerMode]);

//   return (
//     <div className="flex flex-col h-full w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
//       {/* Sub-Header */}
//       <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
//         <nav className="flex gap-6 text-xs font-semibold">
//           {[
//             { id: 'all', label: 'All', activeColor: 'text-teal-700 border-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.4)]', hoverColor: 'hover:text-teal-700' },
//             { id: 'thunderstorm', label: 'Thunderstorms', activeColor: 'text-purple-700 border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]', hoverColor: 'hover:text-purple-700' },
//             { id: 'cloudburst', label: 'Cloudbursts', activeColor: 'text-orange-700 border-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.4)]', hoverColor: 'hover:text-orange-700' },
//             { id: 'flashflood', label: 'Flash Floods', activeColor: 'text-sky-700 border-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.4)]', hoverColor: 'hover:text-sky-700'},
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveHazard?.(tab.id)}
//               className={`px-4 py-3 rounded-xl border transition-all duration-300 transform group ${
//                 (mapLayers?.activeHazard || 'all') === tab.id
//               ? `${tab.activeColor} font-bold scale-[1.03] shadow-sm`
//                 : `border-transparent bg-transparent text-slate-600 ${tab.hoverColor} hover:-translate-y-0.5`
//                 }`}
//               >
//               <span className="transition-transform duration-300 inline-block">
//                 {tab.label}
//               </span>
//             </button>
//           ))}
//         </nav>

//         <div className="flex items-center gap-3">
//           {selectedAlert && (
//             <button
//               onClick={handleResetToIndia}
//               className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded border border-slate-300 transition-all"
//             >
//               🇮🇳 Overview Map
//             </button>
//           )}

//           <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
//             <span className="text-[11px] font-semibold text-slate-500">Lead-Time:</span>
//             <input
//               type="range"
//               min={forecastHorizon?.min || 2}
//               max={forecastHorizon?.max || 6}
//               step={1}
//               value={forecastHorizon?.value || 3}
//               onChange={(e) => setForecastHorizonValue?.(Number(e.target.value))}
//               className="w-24 accent-teal-700 cursor-pointer h-1 bg-slate-200 rounded"
//             />
//             <span className="text-xs font-mono font-bold text-teal-800">
//               +{forecastHorizon?.value || 3}h
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main Container */}
//       <div className="flex flex-1 overflow-hidden relative">
//         <div className="flex-1 relative bg-slate-200 z-0 overflow-hidden">
//           <DeckGL
//             viewState={viewState}
//             onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState)}
//             controller={true}
//             layers={layers}
//             getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'default')}
//           >
//             <Map reuseMaps mapStyle={MAP_STYLE} />
//           </DeckGL>

//           {/* Map Heading */}
//           <div className="absolute top-4 left-4 z-10 pointer-events-none bg-white/80 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
//             <h1 className="text-xs font-bold bg-linear-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
//               {selectedAlert
//                 ? `${selectedAlert.regionName}, ${selectedAlert.state}`
//                 : 'National Hazard Overview — India'}
//             </h1>
//           </div>

//           {/* Dark-Themed Layer Switcher (Top-Right) */}
//           <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-2.5 z-10 flex flex-col gap-1.5 w-44 text-xs font-medium text-slate-200 transition-all duration-300">
//             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-0.5">
//               Map View Modes
//             </span>
//             <button
//               onClick={() => setActiveLayerMode('contour')}
//               className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
//                 activeLayerMode === 'contour'
//                   ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
//                   : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
//               }`}
//             >
//               <span className="text-teal-400">≈</span> Contour/Heatmap
//             </button>
//             <button
//               onClick={() => setActiveLayerMode('moisture')}
//               className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
//                 activeLayerMode === 'moisture'
//                   ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
//                   : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
//               }`}
//             >
//               <span className="text-cyan-400">💧</span> Moisture
//             </button>
//             <button
//               onClick={() => setActiveLayerMode('instability')}
//               className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
//                 activeLayerMode === 'instability'
//                   ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
//                   : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
//               }`}
//             >
//               <span className="text-amber-400">⛈️</span> Instability
//             </button>
//           </div>

//           {/* Risk Meter / Severity Legend (Bottom-Left) */}
//           <div className="absolute bottom-6 left-4 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-3 w-52 text-xs text-slate-200 transition-all duration-300">
//             <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
//               <span>Risk Severity Meter</span>
//               <span className="text-[10px] font-mono text-slate-400">Score</span>
//             </div>
            
//             <div className="space-y-1.5">
//               <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"></span>
//                   <span className="font-semibold text-slate-200">Severe</span>
//                 </div>
//                 <span className="font-mono text-[11px] text-red-400 font-bold">85 - 100</span>
//               </div>

//               <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.7)]"></span>
//                   <span className="font-semibold text-slate-200">High</span>
//                 </div>
//                 <span className="font-mono text-[11px] text-orange-400 font-bold">70 - 84</span>
//               </div>

//               <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"></span>
//                   <span className="font-semibold text-slate-200">Moderate</span>
//                 </div>
//                 <span className="font-mono text-[11px] text-yellow-400 font-bold">40 - 69</span>
//               </div>

//               <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]"></span>
//                   <span className="font-semibold text-slate-200">Low</span>
//                 </div>
//                 <span className="font-mono text-[11px] text-emerald-400 font-bold">0 - 39</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <aside className="w-80 bg-white/95 backdrop-blur-md border-l border-slate-200 flex flex-col p-5 overflow-y-auto space-y-5 z-10 shrink-0 transition-all duration-300 ease-in-out shadow-2xl">
//           {selectedAlert ? (
//             <>
//               <div>
//                 <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
//                   Selected Region
//                 </span>
//                 <h2 className="text-base font-bold text-slate-900">
//                   {selectedAlert.regionName}, {selectedAlert.state}
//                 </h2>
//                 <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
//                   {selectedAlert.hazardType} ({selectedAlert.severity})
//                 </span>
//               </div>

//               {/* Risk Score */}
//               <div className="border-2 border-red-600 rounded-lg p-3 text-center bg-red-50/30">
//                 <span className="text-xs text-red-600 font-bold block mb-1">
//                   Risk Score (+{forecastHorizon?.value || 3}h)
//                 </span>
//                 <span className="text-3xl font-mono font-bold text-red-600 tracking-wider">
//                   {activeReadings?.riskScore ?? selectedAlert.riskScore}/100
//                 </span>
//               </div>

//               {/* XAI Analysis */}
//               <div className="border border-teal-600 rounded-lg overflow-hidden bg-white shadow-sm">
//                 <div className="bg-teal-50 border-b border-teal-100 px-3 py-2 flex items-center gap-2">
//                   <span className="text-teal-700">💡</span>
//                   <span className="font-bold text-xs text-teal-900">XAI Analysis</span>
//                 </div>
//                 <div className="p-3 text-xs space-y-3">
//                   <p className="text-slate-700 leading-relaxed text-[11px]">
//                     {selectedAlert.description}
//                   </p>
//                   <div className="flex justify-between items-center pt-2 border-t border-slate-100">
//                     <span className="text-slate-500 font-medium text-[11px]">Confidence Score</span>
//                     <span className="font-bold text-teal-800 font-mono text-xs">
//                       {selectedAlert.confidence}%
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Atmospheric Telemetry */}
//               <div className="space-y-3">
//                 <h3 className="text-xs font-bold text-slate-700">Atmospheric Telemetry</h3>
//                 <div className="space-y-2 text-xs">
//                   <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
//                     <span className="text-slate-600 text-[11px]">Integrated Water Vapor (IWV)</span>
//                     <span className="font-bold font-mono text-teal-800">
//                       {activeReadings?.iwv != null ? `${activeReadings.iwv} mm` : 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
//                     <span className="text-slate-600 text-[11px]">CAPE</span>
//                     <span className="font-bold font-mono text-teal-800">
//                       {activeReadings?.cape != null ? `${activeReadings.cape} J/kg` : 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
//                     <span className="text-slate-600 text-[11px]">Cloud Top Temp (CTT)</span>
//                     <span className="font-bold font-mono text-teal-800">
//                       {activeReadings?.ctt != null ? `${activeReadings.ctt}°C` : 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
//                     <span className="text-slate-600 text-[11px]">Conv. Inhibition (CIN)</span>
//                     <span className="font-bold font-mono text-teal-800">
//                       {activeReadings?.cin != null ? `${activeReadings.cin} J/kg` : 'N/A'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="h-full flex flex-col justify-center space-y-4">
//               <div className="text-center">
//                 <span className="text-3xl block mb-2">📍</span>
//                 <h3 className="text-sm font-bold text-slate-800">Select a Region</h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Click on any alert on the map or select from the list below.
//                 </p>
//               </div>

//               <div className="space-y-2 pt-4 border-t border-slate-200">
//                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
//                   Active Alerts ({filteredAlerts.length})
//                 </span>
//                 {filteredAlerts.map((alertItem) => (
//                   <button
//                     key={alertItem.id}
//                     onClick={() => handleSelectAlert(alertItem)}
//                     className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 transition-all flex items-center justify-between"
//                   >
//                     <div>
//                       <div className="text-xs font-bold text-slate-800">
//                         {alertItem.regionName}
//                       </div>
//                       <div className="text-[10px] text-slate-500">{alertItem.state}</div>
//                     </div>
//                     <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
//                       {alertItem.severity}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo, useDeferredValue } from 'react';
import Map from '@vis.gl/react-maplibre';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer, ContourLayer } from '@deck.gl/aggregation-layers';
import { FlyToInterpolator } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';

import { mockAlerts } from '../../mock/mockAlerts';
import { mockTelemetry } from '../../mock/mockTelemetry';
import { nationalHazardGrids, nationalCompositeGrid } from '../../mock/mockNationalGrid';
import { getRegionThresholds } from '../../utils/thresholdEvaluator';
import { useWeatherStore } from '../../store/useWeatherStore';

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles' }],
};

const INDIA_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 22.5937,
  zoom: 4.3,
  pitch: 0,
  bearing: 0,
};

function createCirclePolygon(centerLng, centerLat, radiusKm, points = 64) {
  const coords = [];
  const kmInDegLat = 1 / 111.0;
  const kmInDegLng = 1 / (111.0 * Math.cos((centerLat * Math.PI) / 180));
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    coords.push([
      centerLng + radiusKm * kmInDegLng * Math.cos(theta),
      centerLat + radiusKm * kmInDegLat * Math.sin(theta),
    ]);
  }
  coords.push(coords[0]);
  return coords;
}

function getDefaultViewState() {
  const defaultId = useWeatherStore.getState().selectedRegion?.id;
  const defaultAlert = mockAlerts.find((a) => a.regionId === defaultId);
  if (defaultAlert) {
    return {
      longitude: defaultAlert.lng,
      latitude: defaultAlert.lat,
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
    };
  }
  return INDIA_VIEW_STATE;
}

export default function LiveMap() {
  const [viewState, setViewState] = useState(getDefaultViewState);

  // ---- Global store: region selection (single source of truth, shared with Risk Analysis / XAI Reports) ----
  const selectedRegion = useWeatherStore((state) => state.selectedRegion);
  const setSelectedRegion = useWeatherStore((state) => state.setSelectedRegion);

  const selectedAlert = useMemo(() => {
    if (!selectedRegion?.id) return null;
    return mockAlerts.find((a) => a.regionId === selectedRegion.id) || null;
  }, [selectedRegion]);

  // ---- Global store: forecast lead-time scrubber (+2h to +6h) ----
  const forecastHorizon = useWeatherStore((state) => state.forecastHorizon);
  const setForecastHorizonValue = useWeatherStore((state) => state.setForecastHorizonValue);
  const deferredHorizonValue = useDeferredValue(forecastHorizon?.value);

  // ---- Global store: hazard tab + render style (Heatmap/Contour) ----
  const mapLayers = useWeatherStore((state) => state.mapLayers);
  const setActiveHazard = useWeatherStore((state) => state.setActiveHazard);
  const setRenderStyle = useWeatherStore((state) => state.setRenderStyle);

  const telemetryData = useMemo(() => {
    if (!selectedRegion?.id) return null;
    return mockTelemetry[selectedRegion.id] || null;
  }, [selectedRegion]);

  const activeReadings = useMemo(() => {
    if (!telemetryData) return null;
    const selectedHour = deferredHorizonValue || 2;
    const seriesItem = telemetryData.forecastSeries?.find((s) => s.hour === selectedHour);

    return {
      iwv: seriesItem?.iwv ?? telemetryData.current?.iwv,
      cape: seriesItem?.cape ?? telemetryData.current?.cape,
      ctt: seriesItem?.ctt ?? telemetryData.current?.ctt,
      cin: telemetryData.current?.cin,
      riskScore: seriesItem?.riskScore ?? selectedAlert?.riskScore,
    };
  }, [telemetryData, deferredHorizonValue, selectedAlert]);

  const activeThresholds = useMemo(() => {
    if (!selectedRegion?.id) return null;
    return getRegionThresholds(selectedRegion.id);
  }, [selectedRegion]);

  const filteredAlerts = useMemo(() => {
    const hazardFilter = mapLayers?.activeHazard;
    if (!hazardFilter || hazardFilter === 'all') return mockAlerts;
    return mockAlerts.filter(
      (a) => (a.hazardType || '').toLowerCase() === hazardFilter.toLowerCase()
    );
  }, [mapLayers?.activeHazard]);

  const handleSelectAlert = (alertItem) => {
    if (alertItem.lng == null || alertItem.lat == null) return;

    setSelectedRegion(alertItem.regionId);
    setViewState({
      longitude: alertItem.lng,
      latitude: alertItem.lat,
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1800,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const handleResetToIndia = () => {
    setSelectedRegion(null);
    setViewState({
      ...INDIA_VIEW_STATE,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const layers = useMemo(() => {
    const activeDeckLayers = [];

    // 1. NATIONAL RISK SURFACE — full-India Gaussian-decayed grid, keyed to the active hazard tab
    const activeGrid =
      !mapLayers?.activeHazard || mapLayers.activeHazard === 'all'
        ? nationalCompositeGrid
        : nationalHazardGrids[mapLayers.activeHazard] || nationalCompositeGrid;

    if (mapLayers?.renderStyle === 'contour') {
      activeDeckLayers.push(
        new ContourLayer({
          id: 'national-risk-contour',
          data: activeGrid,
          getPosition: (d) => [d.lng, d.lat],
          getWeight: (d) => d.value,
          cellSize: 120000, // matches ~1° grid spacing in mockNationalGrid.js so cells actually aggregate points
          contours: [
            { threshold: [0, 20], color: [34, 197, 94, 120] },
            { threshold: [20, 40], color: [250, 204, 21, 150] },
            { threshold: [40, 70], color: [249, 115, 22, 180] },
            { threshold: [70, 100], color: [220, 38, 38, 200] },
          ],
        })
      );
    } else {
      activeDeckLayers.push(
        new HeatmapLayer({
          id: 'national-risk-heatmap',
          data: activeGrid,
          getPosition: (d) => [d.lng, d.lat],
          getWeight: (d) => d.value,
          radiusPixels: 60,
          intensity: 1.2,
          threshold: 0.25,
        })
      );
    }

    // 2. BASE SCATTERPLOT PINS (rendered on top of the risk surface)
    activeDeckLayers.push(
      new ScatterplotLayer({
        id: 'alert-hotspots',
        data: filteredAlerts,
        pickable: true,
        getPosition: (d) => [d.lng, d.lat],
        getRadius: (d) => (selectedAlert?.id === d.id ? 14000 : 25000),
        getFillColor: (d) =>
          d.severity === 'severe'
            ? [239, 68, 68, 230]
            : d.severity === 'high'
            ? [249, 115, 22, 230]
            : d.severity === 'moderate'
            ? [250, 204, 21, 230]
            : [74, 222, 128, 230],
        getLineColor: [255, 255, 255, 255],
        getLineWidth: 3,
        stroked: true,
        radiusMinPixels: 10,
        radiusMaxPixels: 24,
        onClick: (info) => info.object && handleSelectAlert(info.object),
      }),

      new TextLayer({
        id: 'alert-labels',
        data: filteredAlerts,
        getPosition: (d) => [d.lng, d.lat],
        getText: (d) => `${d.regionName} (${d.severity})`,
        getSize: 12,
        getColor: [30, 41, 59, 255],
        getPixelOffset: [0, -22],
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
      })
    );

    // 3. TARGET RINGS (rendered when a region is selected)
    if (selectedAlert?.lng && selectedAlert?.lat) {
      activeDeckLayers.push(
        new PolygonLayer({
          id: 'radar-range-rings',
          data: [
            { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 2.0), color: [234, 88, 12, 220] },
            { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 4.0), color: [217, 119, 6, 200] },
            { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 6.0), color: [5, 150, 105, 180] },
          ],
          getPolygon: (d) => d.polygon,
          getFillColor: [0, 0, 0, 0],
          getLineColor: (d) => d.color,
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          filled: false,
          stroked: true,
        })
      );
    }

    return activeDeckLayers;
  }, [filteredAlerts, selectedAlert, mapLayers?.activeHazard, mapLayers?.renderStyle]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* Sub-Header */}
      <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
        <nav className="flex gap-6 text-xs font-semibold">
          {[
            { id: 'all', label: 'All', activeColor: 'text-teal-700 border-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.4)]', hoverColor: 'hover:text-teal-700' },
            { id: 'thunderstorm', label: 'Thunderstorms', activeColor: 'text-purple-700 border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]', hoverColor: 'hover:text-purple-700' },
            { id: 'cloudburst', label: 'Cloudbursts', activeColor: 'text-orange-700 border-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.4)]', hoverColor: 'hover:text-orange-700' },
            { id: 'flashflood', label: 'Flash Floods', activeColor: 'text-sky-700 border-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.4)]', hoverColor: 'hover:text-sky-700' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveHazard?.(tab.id)}
              className={`px-4 py-3 rounded-xl border transition-all duration-300 transform group ${
                (mapLayers?.activeHazard || 'all') === tab.id
                  ? `${tab.activeColor} font-bold scale-[1.03] shadow-sm`
                  : `border-transparent bg-transparent text-slate-600 ${tab.hoverColor} hover:-translate-y-0.5`
              }`}
            >
              <span className="transition-transform duration-300 inline-block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {selectedRegion && (
            <button
              onClick={handleResetToIndia}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded border border-slate-300 transition-all"
            >
              🇮🇳 Overview Map
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Lead-Time:</span>
            <input
              type="range"
              min={forecastHorizon?.min || 2}
              max={forecastHorizon?.max || 6}
              step={1}
              value={forecastHorizon?.value || 2}
              onChange={(e) => setForecastHorizonValue?.(Number(e.target.value))}
              className="w-24 accent-teal-700 cursor-pointer h-1 bg-slate-200 rounded"
            />
            <span className="text-xs font-mono font-bold text-teal-800">
              +{forecastHorizon?.value || 2}h
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative bg-slate-200 z-0 overflow-hidden">
          <DeckGL
            viewState={viewState}
            onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState)}
            controller={true}
            layers={layers}
            getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'default')}
          >
            <Map reuseMaps mapStyle={MAP_STYLE} />
          </DeckGL>

          {/* Map Heading */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-white/80 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
            <h1 className="text-xs font-bold bg-linear-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
              {selectedRegion
                ? `${selectedRegion.name}, ${selectedRegion.state}`
                : 'National Hazard Overview — India'}
            </h1>
          </div>

          {/* Map View Modes (Top-Right) — bound to store's renderStyle */}
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-2.5 z-10 flex flex-col gap-1.5 w-44 text-xs font-medium text-slate-200 transition-all duration-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-0.5">
              Map View Modes
            </span>
            <button
              onClick={() => setRenderStyle('heatmap')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
                (mapLayers?.renderStyle || 'heatmap') === 'heatmap'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-teal-400">≈</span> Heatmap
            </button>
            <button
              onClick={() => setRenderStyle('contour')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
                mapLayers?.renderStyle === 'contour'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-teal-400">◎</span> Contour
            </button>
          </div>

          {/* Risk Meter / Severity Legend (Bottom-Left) */}
          <div className="absolute bottom-6 left-4 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-3 w-52 text-xs text-slate-200 transition-all duration-300">
            <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>Risk Severity Meter</span>
              <span className="text-[10px] font-mono text-slate-400">Score</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"></span>
                  <span className="font-semibold text-slate-200">Severe</span>
                </div>
                <span className="font-mono text-[11px] text-red-400 font-bold">85 - 100</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.7)]"></span>
                  <span className="font-semibold text-slate-200">High</span>
                </div>
                <span className="font-mono text-[11px] text-orange-400 font-bold">70 - 84</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"></span>
                  <span className="font-semibold text-slate-200">Moderate</span>
                </div>
                <span className="font-mono text-[11px] text-yellow-400 font-bold">40 - 69</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]"></span>
                  <span className="font-semibold text-slate-200">Low</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">0 - 39</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 bg-white/95 backdrop-blur-md border-l border-slate-200 flex flex-col p-5 overflow-y-auto space-y-5 z-10 shrink-0 transition-all duration-300 ease-in-out shadow-2xl">
          {selectedRegion && selectedAlert ? (
            <>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Selected Region
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedRegion.name}, {selectedRegion.state}
                </h2>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
                  {selectedRegion.hazardType} ({selectedRegion.severity})
                </span>
              </div>

              {/* Risk Score */}
              <div className="border-2 border-red-600 rounded-lg p-3 text-center bg-red-50/30">
                <span className="text-xs text-red-600 font-bold block mb-1">
                  Risk Score (+{forecastHorizon?.value || 2}h)
                </span>
                <span className="text-3xl font-mono font-bold text-red-600 tracking-wider">
                  {activeReadings?.riskScore ?? selectedRegion.riskScore}/100
                </span>
              </div>

              {/* XAI Analysis */}
              <div className="border border-teal-600 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-teal-50 border-b border-teal-100 px-3 py-2 flex items-center gap-2">
                  <span className="text-teal-700">💡</span>
                  <span className="font-bold text-xs text-teal-900">XAI Analysis</span>
                </div>
                <div className="p-3 text-xs space-y-3">
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {selectedAlert.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium text-[11px]">Confidence Score</span>
                    <span className="font-bold text-teal-800 font-mono text-xs">
                      {selectedAlert.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Atmospheric Telemetry */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700">Atmospheric Telemetry</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-600 text-[11px]">Integrated Water Vapor (IWV)</span>
                    <span className="font-bold font-mono text-teal-800">
                      {activeReadings?.iwv != null ? `${activeReadings.iwv} mm` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-600 text-[11px]">CAPE</span>
                    <span className="font-bold font-mono text-teal-800">
                      {activeReadings?.cape != null ? `${activeReadings.cape} J/kg` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-600 text-[11px]">Cloud Top Temp (CTT)</span>
                    <span className="font-bold font-mono text-teal-800">
                      {activeReadings?.ctt != null ? `${activeReadings.ctt}°C` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-600 text-[11px]">Conv. Inhibition (CIN)</span>
                    <span className="font-bold font-mono text-teal-800">
                      {activeReadings?.cin != null ? `${activeReadings.cin} J/kg` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Alert Thresholds */}
              {activeThresholds && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-700">Active Alert Thresholds</h3>
                  <div className="space-y-2">
                    {activeThresholds.thresholds.map((rule) => (
                      <div
                        key={rule.id}
                        className={`rounded-lg border p-2.5 text-xs ${
                          rule.isMet
                            ? 'bg-red-50 border-red-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-bold ${
                              rule.isMet ? 'text-red-700' : 'text-slate-500'
                            }`}
                          >
                            {rule.label}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              rule.isMet
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {rule.statusText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{rule.ruleText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col justify-center space-y-4">
              <div className="text-center">
                <span className="text-3xl block mb-2">📍</span>
                <h3 className="text-sm font-bold text-slate-800">Select a Region</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click on any alert on the map or select from the list below.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Active Alerts ({filteredAlerts.length})
                </span>
                {filteredAlerts.map((alertItem) => (
                  <button
                    key={alertItem.id}
                    onClick={() => handleSelectAlert(alertItem)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{alertItem.regionName}</div>
                      <div className="text-[10px] text-slate-500">{alertItem.state}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                      {alertItem.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}