// import { create } from 'zustand';
// import { mockAlerts } from '../mock/mockAlerts';

// // Pick the highest-risk active alert as the default selected region on boot
// function getDefaultRegion() {
//   const activeAlerts = mockAlerts.filter((a) => a.status === 'active');
//   const highest = [...activeAlerts].sort((a, b) => b.riskScore - a.riskScore)[0];

//   if (!highest) return null;

//   return {
//     id: highest.regionId,
//     name: highest.regionName,
//     state: highest.state,
//     lat: highest.lat,
//     lng: highest.lng,
//     hazardType: highest.hazardType,
//     riskScore: highest.riskScore,
//     severity: highest.severity,
//   };
// }

// export const useWeatherStore = create((set, get) => ({
//   // ---- Region selection (shared across Map, Risk Analysis, XAI, Historical) ----
//   selectedRegion: getDefaultRegion(),

//   setSelectedRegion: (region) => set({ selectedRegion: region }),

//   // ---- Live Map forecast lead-time scrubber (+2h to +6h, per problem statement) ----
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

//   // ---- Live Map hazard layer controls ----
//   // activeHazard: which of the 3 hazards (or composite "all") is painted across India
//   // renderStyle: how that hazard's grid is rendered
//   mapLayers: {
//     activeHazard: 'flashFlood', // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
//     renderStyle: 'heatmap',     // 'heatmap' | 'contour'
//   },

//   setActiveHazard: (activeHazard) =>
//     set((state) => ({ mapLayers: { ...state.mapLayers, activeHazard } })),

//   setRenderStyle: (renderStyle) =>
//     set((state) => ({ mapLayers: { ...state.mapLayers, renderStyle } })),

//   // ---- Simulator (What-If Scenario) sliders ----
//   simulatorParams: {
//     deltaT: 0, // temperature change, °C
//     deltaP: 0, // precipitation change, %
//   },

//   setDeltaT: (deltaT) =>
//     set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaT } })),

//   setDeltaP: (deltaP) =>
//     set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaP } })),

//   resetSimulatorParams: () =>
//     set({ simulatorParams: { deltaT: 0, deltaP: 0 } }),

//   // ---- Alert Ticker filters (Developer C reads/writes these) ----
//   alertFilters: {
//     hazardType: 'all',   // 'all' | 'thunderstorm' | 'cloudburst' | 'flashFlood'
//     severity: 'all',     // 'all' | 'severe' | 'high' | 'moderate' | 'low'
//     status: 'active',    // 'all' | 'active' | 'acknowledged' | 'resolved'
//     timeRange: '24h',
//   },

//   setAlertFilters: (filters) =>
//     set((state) => ({ alertFilters: { ...state.alertFilters, ...filters } })),

//   // ---- Historical Replay playback (Developer C reads/writes these) ----
//   replayState: {
//     isPlaying: false,
//     speed: 1, // 1x | 2x | 5x
//     currentEventId: null,
//   },

//   setReplayState: (partial) =>
//     set((state) => ({ replayState: { ...state.replayState, ...partial } })),
// }));

import { create } from 'zustand';
import { mockAlerts } from '../mock/mockAlerts';

// Defensive helper to extract a standardized region object
function formatRegionObject(regionIdOrObj) {
  if (!regionIdOrObj) return null;
  
  if (typeof regionIdOrObj === 'string') {
    const alert = mockAlerts.find((a) => a.regionId === regionIdOrObj);
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

  return regionIdOrObj;
}

// Fallback: Pick highest-risk active alert on boot
function getDefaultRegion() {
  const activeAlerts = mockAlerts.filter((a) => a.status === 'active');
  const highest = [...activeAlerts].sort((a, b) => b.riskScore - a.riskScore)[0];
  return formatRegionObject(highest || mockAlerts[0]);
}

export const useWeatherStore = create((set) => ({
  // ---- Region selection (Accepts object OR regionId string) ----
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

  // ---- Simulator (What-If Scenario) sliders ----
  simulatorParams: {
    deltaT: 0, // °C shift
    deltaP: 0, // % precipitation shift
  },

  setDeltaT: (deltaT) =>
    set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaT } })),

  setDeltaP: (deltaP) =>
    set((state) => ({ simulatorParams: { ...state.simulatorParams, deltaP } })),

  resetSimulatorParams: () =>
    set({ simulatorParams: { deltaT: 0, deltaP: 0 } }),

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
    currentEventId: 'EVT-2026-0814',
    currentFrameIndex: 0, // Index into tOffset array (-6h to +2h)
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