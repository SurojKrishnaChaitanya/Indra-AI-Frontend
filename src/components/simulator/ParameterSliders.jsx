import React from 'react';
import { Wind, CloudRain, RotateCcw } from 'lucide-react';
import { mockSimulator } from '../../mock/mockSimulator';

export default function ParameterSliders({
  windSpeed,
  precipRate,
  baseline,
  onWindChange,
  onPrecipChange,
  onApplyPreset,
  onReset,
}) {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">What-If Parameters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <RotateCcw size={13} />
          Reset to baseline
        </button>
      </div>

      {/* Wind Speed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Wind size={15} className="text-sky-600" />
            Wind Speed
          </span>
          <span className="font-mono text-sm font-bold text-sky-700">
            {windSpeed} km/h
          </span>
        </div>
        <input
          type="range"
          min={mockSimulator.windSpeedRange.min}
          max={mockSimulator.windSpeedRange.max}
          step={mockSimulator.windSpeedRange.step}
          value={windSpeed}
          onChange={(e) => onWindChange(Number(e.target.value))}
          className="w-full accent-sky-600 cursor-pointer"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>{mockSimulator.windSpeedRange.min} km/h</span>
          <span>Baseline: {baseline?.windSpeed ?? '—'} km/h</span>
          <span>{mockSimulator.windSpeedRange.max} km/h</span>
        </div>
      </div>

      {/* Precipitation Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CloudRain size={15} className="text-teal-600" />
            Precipitation Rate
          </span>
          <span className="font-mono text-sm font-bold text-teal-700">
            {precipRate} mm/h
          </span>
        </div>
        <input
          type="range"
          min={mockSimulator.precipRange.min}
          max={mockSimulator.precipRange.max}
          step={mockSimulator.precipRange.step}
          value={precipRate}
          onChange={(e) => onPrecipChange(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>{mockSimulator.precipRange.min} mm/h</span>
          <span>Baseline: {baseline?.precipRate ?? '—'} mm/h</span>
          <span>{mockSimulator.precipRange.max} mm/h</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Quick Scenarios
        </p>
        <div className="grid grid-cols-2 gap-2">
          {mockSimulator.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              title={preset.description}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}