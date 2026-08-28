export const mockHistorical = {
  kpis: {
    modelPrecision: { value: 91.4, yoyChange: 2.1 },
    recallRate: { value: 87.2, yoyChange: 0.8 },
    avgLeadTime: { value: 3.2, yoyChange: 0.4, unit: 'hrs' },
    falseAlarmRate: { value: 8.1, yoyChange: -1.2 },
  },

  events: [
    {
      id: 'EVT-001',
      date: '2026-03-14T08:30:00Z',
      regionId: 'IN-MH-MUM',
      region: 'Mumbai Metro',
      state: 'Maharashtra',
      hazardType: 'flashFlood',
      severity: 'severe',
      leadTime: 1.8,
      outcome: 'confirmed',
      replay: {
        peakOffset: '-01:45:00',
        series: [
          { tOffset: -6, iwv: 30, ctt: -20, riskScore: 0.1 },
          { tOffset: -3, iwv: 42, ctt: -38, riskScore: 0.35 },
          { tOffset: -1, iwv: 50, ctt: -55, riskScore: 0.68 },
          { tOffset: 0, iwv: 54.2, ctt: -68.4, riskScore: 0.92 },
          { tOffset: 2, iwv: 48, ctt: -50, riskScore: 0.6 },
        ],
      },
    },
    {
      id: 'EVT-002',
      date: '2026-02-22T14:15:00Z',
      regionId: 'IN-HP-SHM',
      region: 'Shimla',
      state: 'Himachal Pradesh',
      hazardType: 'cloudburst',
      severity: 'high',
      leadTime: 3.5,
      outcome: 'confirmed',
      replay: {
        peakOffset: '-02:10:00',
        series: [
          { tOffset: -6, iwv: 25, ctt: -18, riskScore: 0.08 },
          { tOffset: -3, iwv: 35, ctt: -30, riskScore: 0.3 },
          { tOffset: 0, iwv: 46, ctt: -52, riskScore: 0.82 },
          { tOffset: 2, iwv: 40, ctt: -44, riskScore: 0.55 },
        ],
      },
    },
    {
      id: 'EVT-003',
      date: '2026-02-18T22:00:00Z',
      regionId: 'IN-AS-GUW',
      region: 'Guwahati',
      state: 'Assam',
      hazardType: 'thunderstorm',
      severity: 'moderate',
      leadTime: 4.2,
      outcome: 'falseAlarm',
      replay: {
        peakOffset: '-03:00:00',
        series: [
          { tOffset: -6, iwv: 22, ctt: -16, riskScore: 0.1 },
          { tOffset: -3, iwv: 30, ctt: -25, riskScore: 0.4 },
          { tOffset: 0, iwv: 33, ctt: -30, riskScore: 0.52 },
          { tOffset: 2, iwv: 28, ctt: -22, riskScore: 0.25 },
        ],
      },
    },
    {
      id: 'EVT-004',
      date: '2026-01-05T06:45:00Z',
      regionId: 'IN-MH-PUN',
      region: 'Pune Outskirts',
      state: 'Maharashtra',
      hazardType: 'thunderstorm',
      severity: 'high',
      leadTime: 2.9,
      outcome: 'confirmed',
      replay: {
        peakOffset: '-01:30:00',
        series: [
          { tOffset: -6, iwv: 24, ctt: -14, riskScore: 0.05 },
          { tOffset: -3, iwv: 32, ctt: -28, riskScore: 0.42 },
          { tOffset: 0, iwv: 38, ctt: -40, riskScore: 0.7 },
          { tOffset: 2, iwv: 33, ctt: -32, riskScore: 0.4 },
        ],
      },
    },
  ],

  // Monthly event frequency for the Event Archive bar chart
  monthlyFrequency: [
    { month: 'Jan', count: 3 }, { month: 'Feb', count: 5 },
    { month: 'Mar', count: 8 }, { month: 'Apr', count: 4 },
    { month: 'May', count: 6 }, { month: 'Jun', count: 9 },
    { month: 'Jul', count: 11 }, { month: 'Aug', count: 14 },
    { month: 'Sep', count: 7 }, { month: 'Oct', count: 5 },
    { month: 'Nov', count: 3 }, { month: 'Dec', count: 2 },
  ],

  // 2-row x 12-col intensity grid for the Seasonal Patterns heatmap
  seasonalIntensity: [
    [1, 1, 1, 2, 3, 3, 4, 5, 4, 2, 1, 1],
    [1, 1, 1, 2, 3, 4, 5, 5, 3, 2, 1, 1],
  ],
};