export const mockXaiData = {
  'IN-MH-MUM': {
    predictionId: 'XAI-001',
    hazardType: 'flashFlood',
    confidence: 94,
    generatedAt: '2026-08-28T10:42:00Z',
    plainLanguageSummary:
      'Extreme moisture convergence over Mumbai Metro combined with high drainage density strain suggests severe flash flood risk within 2 hours. Urban runoff capacity is likely to be exceeded.',
    featureContribution: [
      { feature: 'IWV Spike', weight: 44 },
      { feature: 'CTT Drop', weight: 27 },
      { feature: 'CAPE', weight: 14 },
      { feature: 'Terrain Slope', weight: 9 },
      { feature: 'Drainage Dens.', weight: 6 },
    ],
    whatChanged: {
      iwv: { value: 62, delta: 14, unit: 'mm' },
      ctt: { value: -65, delta: -6, unit: '°C' },
      riskScore: { value: 94, delta: 16 },
    },
    calibration: [
      { predictedConfidence: 20, historicalAccuracy: 22 },
      { predictedConfidence: 45, historicalAccuracy: 48 },
      { predictedConfidence: 65, historicalAccuracy: 70 },
      { predictedConfidence: 94, historicalAccuracy: 88 },
    ],
  },
  'IN-UK-RUD': {
    predictionId: 'XAI-002',
    hazardType: 'cloudburst',
    confidence: 84,
    generatedAt: '2026-08-28T14:20:00Z',
    plainLanguageSummary:
      'Rapid cloud development and steep terrain slope suggest high cloudburst risk in the next 2 hours. The interaction between intense convective available potential energy (CAPE) and local orographic lift is creating highly unstable conditions.',
    featureContribution: [
      { feature: 'IWV Spike', weight: 42 },
      { feature: 'CTT Drop', weight: 30 },
      { feature: 'CAPE', weight: 15 },
      { feature: 'Terrain Slope', weight: 10 },
      { feature: 'Drainage Dens.', weight: 3 },
    ],
    whatChanged: {
      iwv: { value: 42, delta: 12, unit: 'mm' },
      ctt: { value: -45, delta: -8, unit: '°C' },
      riskScore: { value: 84, delta: 22 },
    },
    calibration: [
      { predictedConfidence: 25, historicalAccuracy: 30 },
      { predictedConfidence: 50, historicalAccuracy: 52 },
      { predictedConfidence: 74, historicalAccuracy: 68 },
      { predictedConfidence: 84, historicalAccuracy: 80 },
    ],
  },
  'IN-HP-SOL': {
    predictionId: 'XAI-003',
    hazardType: 'flashFlood',
    confidence: 89,
    generatedAt: '2026-08-28T14:02:45Z',
    plainLanguageSummary:
      'High moisture convergence and orographic lift over Solan District point to imminent flash flood risk near the Giri River basin within 2 hours.',
    featureContribution: [
      { feature: 'IWV Spike', weight: 40 },
      { feature: 'CTT Drop', weight: 25 },
      { feature: 'CAPE', weight: 18 },
      { feature: 'Terrain Slope', weight: 12 },
      { feature: 'Drainage Dens.', weight: 5 },
    ],
    whatChanged: {
      iwv: { value: 54, delta: 9, unit: 'mm' },
      ctt: { value: -65, delta: -5, unit: '°C' },
      riskScore: { value: 89, delta: 12 },
    },
    calibration: [
      { predictedConfidence: 30, historicalAccuracy: 33 },
      { predictedConfidence: 55, historicalAccuracy: 58 },
      { predictedConfidence: 70, historicalAccuracy: 66 },
      { predictedConfidence: 89, historicalAccuracy: 85 },
    ],
  },
  'IN-WB-DAR': {
    predictionId: 'XAI-004',
    hazardType: 'flashFlood',
    confidence: 78,
    generatedAt: '2026-08-28T09:35:00Z',
    plainLanguageSummary:
      'Steep terrain slope in Darjeeling combined with sustained moisture accumulation is increasing flash flood likelihood over the next 3-4 hours.',
    featureContribution: [
      { feature: 'IWV Spike', weight: 35 },
      { feature: 'Terrain Slope', weight: 28 },
      { feature: 'CTT Drop', weight: 20 },
      { feature: 'CAPE', weight: 12 },
      { feature: 'Drainage Dens.', weight: 5 },
    ],
    whatChanged: {
      iwv: { value: 46, delta: 7, unit: 'mm' },
      ctt: { value: -48, delta: -4, unit: '°C' },
      riskScore: { value: 78, delta: 10 },
    },
    calibration: [
      { predictedConfidence: 28, historicalAccuracy: 31 },
      { predictedConfidence: 52, historicalAccuracy: 55 },
      { predictedConfidence: 78, historicalAccuracy: 74 },
    ],
  },
};