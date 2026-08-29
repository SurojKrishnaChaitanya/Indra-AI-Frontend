import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function severityColor(score) {
  if (score >= 85) return '#dc2626';
  if (score >= 70) return '#ea580c';
  if (score >= 40) return '#ca8a04';
  return '#16a34a';
}

export default function RiskComparisonCanvas({ result, regionName }) {
  if (!result) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
        Select a region to run the simulation
      </div>
    );
  }

  const { baselineRisk, simulatedRisk, delta } = result;

  const chartData = [
    { label: 'Baseline', score: baselineRisk },
    { label: 'Simulated', score: simulatedRisk },
  ];

  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const deltaColor =
    delta > 0 ? 'text-red-600 bg-red-50 border-red-200'
    : delta < 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : 'text-slate-500 bg-slate-50 border-slate-200';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Risk Comparison</h3>
          <p className="text-xs text-slate-500">{regionName}</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${deltaColor}`}>
          <DeltaIcon size={13} />
          {delta > 0 ? '+' : ''}{delta} pts
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Baseline</p>
          <p className="mt-1 text-2xl font-mono font-bold text-slate-800">{baselineRisk}</p>
        </div>
        <div
          className="rounded-lg border p-3 text-center"
          style={{ borderColor: severityColor(simulatedRisk) + '55', backgroundColor: severityColor(simulatedRisk) + '10' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Simulated</p>
          <p className="mt-1 text-2xl font-mono font-bold" style={{ color: severityColor(simulatedRisk) }}>
            {simulatedRisk}
          </p>
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={severityColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}