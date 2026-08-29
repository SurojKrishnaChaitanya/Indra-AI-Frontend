// import { create } from 'zustand';
// import { mockAlerts } from '../mock/mockAlerts';

// // Defensive helper to extract a standardized region object
// function formatRegionObject(regionIdOrObj) {
//   if (!regionIdOrObj) return null;
  
//   if (typeof regionIdOrObj === 'string') {
//     const alert = mockAlerts.find((a) => a.regionId === regionIdOrObj);
//     if (!alert) return null;
//     return {
//       id: alert.regionId,
//       name: alert.regionName,
//       state: alert.state,
//       lat: alert.lat,
//       lng: alert.lng,
//       hazardType: alert.hazardType,
//       riskScore: alert.riskScore,
//       severity: alert.severity,
//     };
//   }

//   return regionIdOrObj;
// }

// // Fallback: Pick highest-risk active alert on boot
// function getDefaultRegion() {
//   const activeAlerts = mockAlerts.filter((a) => a.status === 'active');
//   const highest = [...activeAlerts].sort((a, b) => b.riskScore - a.riskScore)[0];
//   return formatRegionObject(highest || mockAlerts[0]);
// }

// export const useWeatherStore = create((set) => ({
//   // ---- Region selection (Accepts object OR regionId string) ----
//   selectedRegion: getDefaultRegion(),

//   setSelectedRegion: (regionIdOrObj) =>
//     set({ selectedRegion: formatRegionObject(regionIdOrObj) }),

//   // ---- Live Map forecast lead-time scrubber (+2h to +6h) ----
//   forecastHorizon: {
//     min: 2,
//     max: 6,
//     value: 2,
//   },

//   setForecastHorizonValue: (value) =>
//     set((state) => ({
//       forecastHorizon: {
//         ...state.forecastHorizon,
//         value: Math.min(Math.max(value, state.forecastHorizon.min), state.forecastHorizon.max),
//       },
//     })),

//   // ---- Live Map hazard layer & overlay controls ----
//   mapLayers: {
//     activeHazard: 'all', // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
//     renderStyle: 'heatmap', // 'heatmap' | 'contour'
//   },

//   setActiveHazard: (activeHazard) =>
//     set((state) => ({ mapLayers: { ...state.mapLayers, activeHazard } })),

//   setRenderStyle: (renderStyle) =>
//     set((state) => ({ mapLayers: { ...state.mapLayers, renderStyle } })),

//   // ---- Simulator (What-If Scenario) sliders ----
//   simulatorParams: {
//     deltaT: 0, // °C shift
//     deltaP: 0, // % precipitation shift
//   },

//   setDeltaT: (deltaT) =>
//     set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaT } })),

//   setDeltaP: (deltaP) =>
//     set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaP } })),

//   resetSimulatorParams: () =>
//     set({ simulatorParams: { deltaT: 0, deltaP: 0 } }),

//   // ---- Alert Ticker filters ----
//   alertFilters: {
//     hazardType: 'all', // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
//     severity: 'all',   // 'all' | 'severe' | 'high' | 'moderate' | 'low'
//     status: 'active',  // 'all' | 'active' | 'acknowledged' | 'resolved'
//     searchQuery: '',
//   },

//   setAlertFilters: (filters) =>
//     set((state) => ({ alertFilters: { ...state.alertFilters, ...filters } })),

//   resetAlertFilters: () =>
//     set({
//       alertFilters: { hazardType: 'all', severity: 'all', status: 'active', searchQuery: '' },
//     }),

//   // ---- Historical Replay playback controller ----
//   replayState: {
//     isPlaying: false,
//     speed: 1, // 1x | 2x | 5x
//     currentEventId: 'EVT-2026-0814',
//     currentFrameIndex: 0, // Index into tOffset array (-6h to +2h)
//   },

//   setReplayState: (partial) =>
//     set((state) => ({ replayState: { ...state.replayState, ...partial } })),

//   nextReplayFrame: (maxFrames = 5) =>
//     set((state) => ({
//       replayState: {
//         ...state.replayState,
//         currentFrameIndex: (state.replayState.currentFrameIndex + 1) % maxFrames,
//       },
//     })),
// }));

import { create } from 'zustand';
import { mockAlerts } from '../mock/mockAlerts';

// Defensive helper to extract a standardized region object.
// Always normalizes through the string branch — never returns a raw
// mockAlerts object as-is, since its field names (regionId/regionName)
// don't match what components expect (id/name).
function formatRegionObject(regionIdOrObj) {
  if (!regionIdOrObj) return null;

  const regionId = typeof regionIdOrObj === 'string' ? regionIdOrObj : regionIdOrObj.regionId;

  const alert = mockAlerts.find((a) => a.regionId === regionId);
  if (!alert) return null;

  return {
    id: alert.regionId,
    name: alert.regionName,
    state: alert.state,
    lat: alert.lat,
    lng: alert.lng,
    hazardType: alert.hazardType,
    riskScore: alert.riskScore,
    severity: alert.severity,
  };
}

// Fallback: Pick highest-risk active alert on boot
function getDefaultRegion() {
  const activeAlerts = mockAlerts.filter((a) => a.status === 'active');
  const highest = [...activeAlerts].sort((a, b) => b.riskScore - a.riskScore)[0];
  const fallback = mockAlerts[0];
  // Always pass a regionId string through — forces normalization every time,
  // whether the source is the sorted highest-risk alert or the raw fallback.
  return formatRegionObject((highest || fallback).regionId);
}

export const useWeatherStore = create((set) => ({
  // ---- Region selection (accepts a regionId string OR an alert-shaped object) ----
  selectedRegion: getDefaultRegion(),

  setSelectedRegion: (regionIdOrObj) =>
    set({ selectedRegion: formatRegionObject(regionIdOrObj) }),

  // ---- Live Map forecast lead-time scrubber (+2h to +6h) ----
  forecastHorizon: {
    min: 2,
    max: 6,
    value: 2,
  },

  setForecastHorizonValue: (value) =>
    set((state) => ({
      forecastHorizon: {
        ...state.forecastHorizon,
        value: Math.min(Math.max(value, state.forecastHorizon.min), state.forecastHorizon.max),
      },
    })),

  // ---- Live Map hazard layer & overlay controls ----
  mapLayers: {
    activeHazard: 'all', // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
    renderStyle: 'heatmap', // 'heatmap' | 'contour'
  },

  setActiveHazard: (activeHazard) =>
    set((state) => ({ mapLayers: { ...state.mapLayers, activeHazard } })),

  setRenderStyle: (renderStyle) =>
    set((state) => ({ mapLayers: { ...state.mapLayers, renderStyle } })),


    // ---- Simulator (What-If Scenario) — absolute wind speed (km/h) and
    // precipitation (mm/h) values, initialized to null until the Simulator
    // page sets them from the selected region's telemetry baseline.
    simulatorParams: {
      windSpeed: null,
      precipRate: null,
    },

    setWindSpeed: (windSpeed) =>
      set((state) => ({ simulatorParams: { ...state.simulatorParams, windSpeed } })),

    setPrecipRate: (precipRate) =>
      set((state) => ({ simulatorParams: { ...state.simulatorParams, precipRate } })),

    setSimulatorParams: (partial) =>
      set((state) => ({ simulatorParams: { ...state.simulatorParams, ...partial } })),

    resetSimulatorParams: () =>
      set({ simulatorParams: { windSpeed: null, precipRate: null } }),

  // ---- Alert Ticker filters ----
  alertFilters: {
    hazardType: 'all', // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
    severity: 'all',   // 'all' | 'severe' | 'high' | 'moderate' | 'low'
    status: 'active',  // 'all' | 'active' | 'acknowledged' | 'resolved'
    searchQuery: '',
  },

  setAlertFilters: (filters) =>
    set((state) => ({ alertFilters: { ...state.alertFilters, ...filters } })),

  resetAlertFilters: () =>
    set({
      alertFilters: { hazardType: 'all', severity: 'all', status: 'active', searchQuery: '' },
    }),

  // ---- Historical Replay playback controller ----
  replayState: {
    isPlaying: false,
    speed: 1, // 1x | 2x | 5x
    currentEventId: null, // resolved by HistoricalPage.jsx (Developer C) — no fake default
    currentFrameIndex: 0,
  },

  setReplayState: (partial) =>
    set((state) => ({ replayState: { ...state.replayState, ...partial } })),

  nextReplayFrame: (maxFrames = 5) =>
    set((state) => ({
      replayState: {
        ...state.replayState,
        currentFrameIndex: (state.replayState.currentFrameIndex + 1) % maxFrames,
      },
    })),
}));