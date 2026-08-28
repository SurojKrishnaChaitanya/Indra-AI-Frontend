// import React, { useState, useMemo } from 'react';
// import Map from '@vis.gl/react-maplibre';
// import DeckGL from '@deck.gl/react';
// import { PolygonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
// import { FlyToInterpolator } from '@deck.gl/core';
// import 'maplibre-gl/dist/maplibre-gl.css';

// import { mockAlerts } from '../../mock/mockAlerts'; 
// import { mockTelemetry } from '../../mock/mockTelemetry';
// import { useWeatherStore } from '../../store/useWeatherStore';

// // const MAP_STYLE = {
// //   version: 8,
// //   sources: {
// //     'carto-light-tiles': {
// //       type: 'raster',
// //       tiles: [
// //         'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
// //         'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
// //         'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
// //         'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
// //       ],
// //       tileSize: 256,
// //       attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
// //     },
// //   },
// //   layers: [{ id: 'carto-light-layer', type: 'raster', source: 'carto-light-tiles' }],
// // };
// const MAP_STYLE = {
//   version: 8,
//   sources: {
//     'osm-tiles': {
//       type: 'raster',
//       tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
//       tileSize: 256,
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

//   // 1. Correct lookup: Match telemetry using regionId
//   const telemetryData = useMemo(() => {
//     if (!selectedAlert?.regionId) return null;
//     return mockTelemetry[selectedAlert.regionId] || null;
//   }, [selectedAlert]);

//   // Dynamic readings driven by lead-time slider forecast series
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

//   // Filter alerts tab list
//   const filteredAlerts = useMemo(() => {
//     const hazardFilter = mapLayers?.activeHazard;
//     if (!hazardFilter || hazardFilter === 'all') return mockAlerts;
//     return mockAlerts.filter(
//       (a) => (a.hazardType || '').toLowerCase() === hazardFilter.toLowerCase()
//     );
//   }, [mapLayers?.activeHazard]);

//   // 2. Fly to position using lat and lng
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

//   const layers = useMemo(() => {
//     const activeDeckLayers = [
//       new ScatterplotLayer({
//         id: 'alert-hotspots',
//         data: filteredAlerts,
//         pickable: true,
//         getPosition: (d) => [d.lng, d.lat],
//         getRadius: (d) => (selectedAlert?.id === d.id ? 14000 : 25000),
//         getFillColor: (d) =>
//           d.severity === 'severe'
//             ? [220, 38, 38, 200]
//             : d.severity === 'high'
//             ? [234, 88, 12, 200]
//             : [234, 179, 8, 200],
//         getLineColor: [255, 255, 255, 255],
//         getLineWidth: 3,
//         stroked: true,
//         radiusMinPixels: 10,
//         radiusMaxPixels: 24,
//         onClick: (info) => info.object && handleSelectAlert(info.object),
//       }),

//       new TextLayer({
//         id: 'alert-labels',
//         data: filteredAlerts,
//         getPosition: (d) => [d.lng, d.lat],
//         getText: (d) => `${d.regionName} (${d.severity})`,
//         getSize: 12,
//         getColor: [30, 41, 59, 255],
//         getPixelOffset: [0, -22],
//         fontFamily: 'sans-serif',
//         fontWeight: 'bold',
//       }),
//     ];

//     if (selectedAlert?.lng && selectedAlert?.lat) {
//       activeDeckLayers.push(
//         new PolygonLayer({
//           id: 'radar-range-rings',
//           data: [
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 2.0), color: [234, 88, 12, 220] },
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 4.0), color: [217, 119, 6, 200] },
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 6.0), color: [5, 150, 105, 180] },
//           ],
//           getPolygon: (d) => d.polygon,
//           getFillColor: [0, 0, 0, 0],
//           getLineColor: (d) => d.color,
//           getLineWidth: 1.5,
//           lineWidthUnits: 'pixels',
//           filled: false,
//           stroked: true,
//         })
//       );
//     }

//     return activeDeckLayers;
//   }, [filteredAlerts, selectedAlert, activeLayerMode]);

//   return (
//     <div className="flex flex-col h-full w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
//       {/* Sub-Header */}
//       <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
//         <nav className="flex gap-6 text-xs font-semibold">
//           {[
//             { id: 'all', label: 'All' },
//             { id: 'thunderstorm', label: 'Thunderstorms' },
//             { id: 'cloudburst', label: 'Cloudbursts' },
//             { id: 'flashflood', label: 'Flash Floods' },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveHazard?.(tab.id)}
//               className={`py-3 border-b-2 transition-colors ${
//                 (mapLayers?.activeHazard || 'all') === tab.id
//                   ? 'border-teal-700 text-teal-800 font-bold'
//                   : 'border-transparent text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               {tab.label}
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
//             <h1 className="text-base font-bold text-slate-800 tracking-tight">
//               {selectedAlert
//                 ? `${selectedAlert.regionName}, ${selectedAlert.state}`
//                 : 'National Hazard Overview — India'}
//             </h1>
//           </div>

//           {/* Layer Switcher */}
//           <div className="absolute top-4 right-4 bg-white/95 backdrop-blur border border-slate-200 rounded-lg shadow-md p-2 z-10 flex flex-col gap-1 w-40 text-xs font-medium">
//             <button
//               onClick={() => setActiveLayerMode('contour')}
//               className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left ${
//                 activeLayerMode === 'contour' ? 'bg-slate-100 text-teal-800 font-semibold' : 'text-slate-600'
//               }`}
//             >
//               <span>≈</span> Contour/Heatmap
//             </button>
//             <button
//               onClick={() => setActiveLayerMode('moisture')}
//               className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left ${
//                 activeLayerMode === 'moisture' ? 'bg-slate-100 text-teal-800 font-semibold' : 'text-slate-600'
//               }`}
//             >
//               <span>💧</span> Moisture
//             </button>
//             <button
//               onClick={() => setActiveLayerMode('instability')}
//               className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left ${
//                 activeLayerMode === 'instability' ? 'bg-slate-100 text-teal-800 font-semibold' : 'text-slate-600'
//               }`}
//             >
//               <span>⛈️</span> Instability
//             </button>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-5 overflow-y-auto space-y-5 z-10 shrink-0">
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

//               {/* Countdown & Risk Score */}
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

import React, { useState, useMemo } from 'react';
import Map from '@vis.gl/react-maplibre';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { FlyToInterpolator } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

import { mockAlerts } from '../../mock/mockAlerts'; 
import { mockTelemetry } from '../../mock/mockTelemetry';
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

export default function LiveMap() {
  const [viewState, setViewState] = useState(INDIA_VIEW_STATE);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeLayerMode, setActiveLayerMode] = useState('contour');

  const forecastHorizon = useWeatherStore((state) => state.forecastHorizon);
  const setForecastHorizonValue = useWeatherStore((state) => state.setForecastHorizonValue);
  const mapLayers = useWeatherStore((state) => state.mapLayers);
  const setActiveHazard = useWeatherStore((state) => state.setActiveHazard);

  const telemetryData = useMemo(() => {
    if (!selectedAlert?.regionId) return null;
    return mockTelemetry[selectedAlert.regionId] || null;
  }, [selectedAlert]);

  const activeReadings = useMemo(() => {
    if (!telemetryData) return null;
    const selectedHour = forecastHorizon?.value || 3;
    const seriesItem = telemetryData.forecastSeries?.find((s) => s.hour === selectedHour);
    
    return {
      iwv: seriesItem?.iwv ?? telemetryData.current?.iwv,
      cape: seriesItem?.cape ?? telemetryData.current?.cape,
      ctt: seriesItem?.ctt ?? telemetryData.current?.ctt,
      cin: telemetryData.current?.cin,
      riskScore: seriesItem?.riskScore ?? selectedAlert?.riskScore,
    };
  }, [telemetryData, forecastHorizon?.value, selectedAlert]);

  const filteredAlerts = useMemo(() => {
    const hazardFilter = mapLayers?.activeHazard;
    if (!hazardFilter || hazardFilter === 'all') return mockAlerts;
    return mockAlerts.filter(
      (a) => (a.hazardType || '').toLowerCase() === hazardFilter.toLowerCase()
    );
  }, [mapLayers?.activeHazard]);

  const handleSelectAlert = (alertItem) => {
    if (alertItem.lng == null || alertItem.lat == null) return;

    setSelectedAlert(alertItem);
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
    setSelectedAlert(null);
    setViewState({
      ...INDIA_VIEW_STATE,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

//   const layers = useMemo(() => {
//     const activeDeckLayers = [
//       new ScatterplotLayer({
//         id: 'alert-hotspots',
//         data: filteredAlerts,
//         pickable: true,
//         getPosition: (d) => [d.lng, d.lat],
//         getRadius: (d) => (selectedAlert?.id === d.id ? 14000 : 25000),
//         getFillColor: (d) =>
//           d.severity === 'severe'
//             ? [220, 38, 38, 200]
//             : d.severity === 'high'
//             ? [234, 88, 12, 200]
//             : d.severity === 'moderate'
//             ? [234, 179, 8, 200]
//             : [34, 197, 94, 200],
//         getLineColor: [255, 255, 255, 255],
//         getLineWidth: 3,
//         stroked: true,
//         radiusMinPixels: 10,
//         radiusMaxPixels: 24,
//         onClick: (info) => info.object && handleSelectAlert(info.object),
//       }),

//       new TextLayer({
//         id: 'alert-labels',
//         data: filteredAlerts,
//         getPosition: (d) => [d.lng, d.lat],
//         getText: (d) => `${d.regionName} (${d.severity})`,
//         getSize: 12,
//         getColor: [30, 41, 59, 255],
//         getPixelOffset: [0, -22],
//         fontFamily: 'sans-serif',
//         fontWeight: 'bold',
//       }),
//     ];

//     if (selectedAlert?.lng && selectedAlert?.lat) {
//       activeDeckLayers.push(
//         new PolygonLayer({
//           id: 'radar-range-rings',
//           data: [
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 2.0), color: [234, 88, 12, 220] },
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 4.0), color: [217, 119, 6, 200] },
//             { polygon: createCirclePolygon(selectedAlert.lng, selectedAlert.lat, 6.0), color: [5, 150, 105, 180] },
//           ],
//           getPolygon: (d) => d.polygon,
//           getFillColor: [0, 0, 0, 0],
//           getLineColor: (d) => d.color,
//           getLineWidth: 1.5,
//           lineWidthUnits: 'pixels',
//           filled: false,
//           stroked: true,
//         })
//       );
//     }

//     return activeDeckLayers;
//   }, [filteredAlerts, selectedAlert, activeLayerMode]);

    // Replace your existing "const layers = useMemo(...)" with this block:
  const layers = useMemo(() => {
        const activeDeckLayers = [];

        // 1. DYNAMIC HEATMAP OVERLAY (based on activeLayerMode)
        if (activeLayerMode === 'contour') {
        activeDeckLayers.push(
            new HeatmapLayer({
            id: 'risk-heatmap',
            data: filteredAlerts,
            getPosition: (d) => [d.lng, d.lat],
            getWeight: (d) => d.riskScore,
            radiusPixels: 70,
            intensity: 1.5,
            })
        );
        } else if (activeLayerMode === 'moisture') {
        activeDeckLayers.push(
            new HeatmapLayer({
            id: 'moisture-heatmap',
            data: filteredAlerts,
            getPosition: (d) => [d.lng, d.lat],
            getWeight: (d) => mockTelemetry[d.regionId]?.current?.iwv || 0,
            colorRange: [
                [224, 242, 254, 100],
                [56, 189, 248, 180],
                [14, 116, 144, 220],
                [3, 105, 161, 255],
            ],
            radiusPixels: 80,
            })
        );
        } else if (activeLayerMode === 'instability') {
        activeDeckLayers.push(
            new HeatmapLayer({
            id: 'instability-heatmap',
            data: filteredAlerts,
            getPosition: (d) => [d.lng, d.lat],
            getWeight: (d) => mockTelemetry[d.regionId]?.current?.cape || 0,
            colorRange: [
                [254, 240, 138, 100],
                [249, 115, 22, 180],
                [220, 38, 38, 220],
                [127, 29, 29, 255],
            ],
            radiusPixels: 80,
            })
        );
        }

        // 2. BASE SCATTERPLOT PINS (Rendered on top of heatmaps)
        activeDeckLayers.push(
        new ScatterplotLayer({
            id: 'alert-hotspots',
            data: filteredAlerts,
            pickable: true,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: (d) => (selectedAlert?.id === d.id ? 14000 : 25000),
            getFillColor: (d) =>
            d.severity === 'severe'
                ? [220, 38, 38, 200]
                : d.severity === 'high'
                ? [234, 88, 12, 200]
                : d.severity === 'moderate'
                ? [234, 179, 8, 200]
                : [34, 197, 94, 200],
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

        // 3. TARGET RINGS (Rendered when a region is selected)
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
    }, [filteredAlerts, selectedAlert, activeLayerMode]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* Sub-Header */}
      <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
        <nav className="flex gap-6 text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'thunderstorm', label: 'Thunderstorms' },
            { id: 'cloudburst', label: 'Cloudbursts' },
            { id: 'flashflood', label: 'Flash Floods' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveHazard?.(tab.id)}
              className={`py-3 border-b-2 transition-colors ${
                (mapLayers?.activeHazard || 'all') === tab.id
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {selectedAlert && (
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
              value={forecastHorizon?.value || 3}
              onChange={(e) => setForecastHorizonValue?.(Number(e.target.value))}
              className="w-24 accent-teal-700 cursor-pointer h-1 bg-slate-200 rounded"
            />
            <span className="text-xs font-mono font-bold text-teal-800">
              +{forecastHorizon?.value || 3}h
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
            <h1 className="text-base font-bold text-slate-800 tracking-tight">
              {selectedAlert
                ? `${selectedAlert.regionName}, ${selectedAlert.state}`
                : 'National Hazard Overview — India'}
            </h1>
          </div>

          {/* Dark-Themed Layer Switcher (Top-Right) */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-2.5 z-10 flex flex-col gap-1.5 w-44 text-xs font-medium text-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-0.5">
              Map View Modes
            </span>
            <button
              onClick={() => setActiveLayerMode('contour')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeLayerMode === 'contour'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-teal-400">≈</span> Contour/Heatmap
            </button>
            <button
              onClick={() => setActiveLayerMode('moisture')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeLayerMode === 'moisture'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-cyan-400">💧</span> Moisture
            </button>
            <button
              onClick={() => setActiveLayerMode('instability')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeLayerMode === 'instability'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-amber-400">⛈️</span> Instability
            </button>
          </div>

          {/* Risk Meter / Severity Legend (Bottom-Left) */}
          <div className="absolute bottom-6 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-3 w-52 text-xs text-slate-200">
            <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>Risk Severity Meter</span>
              <span className="text-[10px] font-mono text-slate-400">Score</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"></span>
                  <span className="font-semibold text-slate-200">Severe</span>
                </div>
                <span className="font-mono text-[11px] text-red-400 font-bold">85 - 100</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.7)]"></span>
                  <span className="font-semibold text-slate-200">High</span>
                </div>
                <span className="font-mono text-[11px] text-orange-400 font-bold">70 - 84</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"></span>
                  <span className="font-semibold text-slate-200">Moderate</span>
                </div>
                <span className="font-mono text-[11px] text-yellow-400 font-bold">40 - 69</span>
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
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
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-5 overflow-y-auto space-y-5 z-10 shrink-0">
          {selectedAlert ? (
            <>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Selected Region
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedAlert.regionName}, {selectedAlert.state}
                </h2>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
                  {selectedAlert.hazardType} ({selectedAlert.severity})
                </span>
              </div>

              {/* Risk Score */}
              <div className="border-2 border-red-600 rounded-lg p-3 text-center bg-red-50/30">
                <span className="text-xs text-red-600 font-bold block mb-1">
                  Risk Score (+{forecastHorizon?.value || 3}h)
                </span>
                <span className="text-3xl font-mono font-bold text-red-600 tracking-wider">
                  {activeReadings?.riskScore ?? selectedAlert.riskScore}/100
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
                      <div className="text-xs font-bold text-slate-800">
                        {alertItem.regionName}
                      </div>
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