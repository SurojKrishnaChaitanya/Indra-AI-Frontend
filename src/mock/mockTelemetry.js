// Per-region atmospheric readings + forecast-horizon time series (+2h to +6h)
export const mockTelemetry = {
  'IN-MH-MUM': {
    current: { iwv: 62, cape: 3200, ctt: -65, cin: -10 },
    baseline: { iwv: 35, cape: 1200, ctt: -20, cin: -25 },
    forecastSeries: [
      { hour: 2, riskScore: 78, iwv: 58, cape: 2900, ctt: -60 },
      { hour: 3, riskScore: 85, iwv: 60, cape: 3050, ctt: -62 },
      { hour: 4, riskScore: 90, iwv: 61, cape: 3150, ctt: -64 },
      { hour: 5, riskScore: 93, iwv: 62, cape: 3200, ctt: -65 },
      { hour: 6, riskScore: 94, iwv: 62, cape: 3200, ctt: -65 },
    ],
  },
  'IN-HP-SOL': {
    current: { iwv: 54, cape: 2400, ctt: -65, cin: -15 },
    baseline: { iwv: 30, cape: 1100, ctt: -18, cin: -20 },
    forecastSeries: [
      { hour: 2, riskScore: 60, iwv: 48, cape: 2000, ctt: -55 },
      { hour: 3, riskScore: 70, iwv: 50, cape: 2150, ctt: -58 },
      { hour: 4, riskScore: 78, iwv: 52, cape: 2280, ctt: -61 },
      { hour: 5, riskScore: 83, iwv: 53, cape: 2350, ctt: -63 },
      { hour: 6, riskScore: 85, iwv: 54, cape: 2400, ctt: -65 },
    ],
  },
  'IN-HP-SHM': {
    current: { iwv: 49, cape: 2100, ctt: -58, cin: -12 },
    baseline: { iwv: 28, cape: 1050, ctt: -17, cin: -22 },
    forecastSeries: [
      { hour: 2, riskScore: 55, iwv: 44, cape: 1800, ctt: -50 },
      { hour: 3, riskScore: 64, iwv: 46, cape: 1900, ctt: -53 },
      { hour: 4, riskScore: 72, iwv: 47, cape: 2000, ctt: -55 },
      { hour: 5, riskScore: 78, iwv: 48, cape: 2050, ctt: -57 },
      { hour: 6, riskScore: 82, iwv: 49, cape: 2100, ctt: -58 },
    ],
  },
  'IN-UK-RUD': {
    current: { iwv: 42, cape: 1950, ctt: -45, cin: -8 },
    baseline: { iwv: 25, cape: 950, ctt: -15, cin: -20 },
    forecastSeries: [
      { hour: 2, riskScore: 50, iwv: 36, cape: 1600, ctt: -35 },
      { hour: 3, riskScore: 60, iwv: 38, cape: 1720, ctt: -38 },
      { hour: 4, riskScore: 70, iwv: 40, cape: 1830, ctt: -41 },
      { hour: 5, riskScore: 78, iwv: 41, cape: 1900, ctt: -43 },
      { hour: 6, riskScore: 84, iwv: 42, cape: 1950, ctt: -45 },
    ],
  },
  'IN-AS-GUW': {
    current: { iwv: 38, cape: 1700, ctt: -40, cin: -18 },
    baseline: { iwv: 26, cape: 1000, ctt: -16, cin: -24 },
    forecastSeries: [
      { hour: 2, riskScore: 40, iwv: 33, cape: 1400, ctt: -32 },
      { hour: 3, riskScore: 48, iwv: 34, cape: 1500, ctt: -34 },
      { hour: 4, riskScore: 55, iwv: 36, cape: 1580, ctt: -36 },
      { hour: 5, riskScore: 60, iwv: 37, cape: 1650, ctt: -38 },
      { hour: 6, riskScore: 65, iwv: 38, cape: 1700, ctt: -40 },
    ],
  },
  'IN-WB-DAR': {
    current: { iwv: 46, cape: 1850, ctt: -48, cin: -9 },
    baseline: { iwv: 27, cape: 980, ctt: -16, cin: -21 },
    forecastSeries: [
      { hour: 2, riskScore: 45, iwv: 40, cape: 1550, ctt: -38 },
      { hour: 3, riskScore: 55, iwv: 42, cape: 1650, ctt: -41 },
      { hour: 4, riskScore: 65, iwv: 43, cape: 1730, ctt: -44 },
      { hour: 5, riskScore: 72, iwv: 45, cape: 1800, ctt: -46 },
      { hour: 6, riskScore: 78, iwv: 46, cape: 1850, ctt: -48 },
    ],
  },
  'IN-TN-CHE': {
    current: { iwv: 30, cape: 900, ctt: -22, cin: -30 },
    baseline: { iwv: 24, cape: 850, ctt: -14, cin: -28 },
    forecastSeries: [
      { hour: 2, riskScore: 15, iwv: 28, cape: 820, ctt: -18 },
      { hour: 3, riskScore: 17, iwv: 29, cape: 850, ctt: -19 },
      { hour: 4, riskScore: 19, iwv: 29, cape: 870, ctt: -20 },
      { hour: 5, riskScore: 21, iwv: 30, cape: 890, ctt: -21 },
      { hour: 6, riskScore: 22, iwv: 30, cape: 900, ctt: -22 },
    ],
  },
  'IN-MH-PUN': {
    current: { iwv: 27, cape: 700, ctt: -15, cin: -32 },
    baseline: { iwv: 25, cape: 800, ctt: -14, cin: -27 },
    forecastSeries: [
      { hour: 2, riskScore: 20, iwv: 27, cape: 720, ctt: -16 },
      { hour: 3, riskScore: 15, iwv: 26, cape: 700, ctt: -15 },
      { hour: 4, riskScore: 10, iwv: 26, cape: 680, ctt: -14 },
      { hour: 5, riskScore: 8, iwv: 25, cape: 670, ctt: -13 },
      { hour: 6, riskScore: 5, iwv: 25, cape: 650, ctt: -12 },
    ],
  },
};