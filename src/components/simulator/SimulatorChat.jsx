import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

function generateAssistantReply(result, regionName, windSpeed, precipRate) {
  if (!result) return "Select a region to begin the simulation.";

  const { baselineRisk, simulatedRisk, delta } = result;

  if (Math.abs(delta) < 3) {
    return `Under these conditions (${windSpeed} km/h wind, ${precipRate} mm/h rainfall), the risk profile for ${regionName} stays close to baseline at ${simulatedRisk}/100 — no significant shift detected.`;
  }

  if (delta > 0) {
    return `Increasing wind speed to ${windSpeed} km/h and precipitation to ${precipRate} mm/h pushes ${regionName}'s risk score from ${baselineRisk} to ${simulatedRisk} — a rise of ${delta} points. This combination suggests conditions are trending toward the region's dominant hazard signature.`;
  }

  return `Easing conditions to ${windSpeed} km/h wind and ${precipRate} mm/h rainfall lowers ${regionName}'s risk score from ${baselineRisk} to ${simulatedRisk}, a reduction of ${Math.abs(delta)} points — indicating a subsiding threat.`;
}

export default function SimulatorChat({ result, regionName, windSpeed, precipRate }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "I'm the What-If Assistant. Adjust the sliders and ask me what the changes mean." },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    const assistantMessage = {
      role: 'assistant',
      text: generateAssistantReply(result, regionName, windSpeed, precipRate),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <Sparkles size={16} className="text-sky-600" />
        <h3 className="text-sm font-bold text-slate-800">What-If Assistant</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: 240 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-sky-50 text-sky-900'
                : 'ml-auto bg-slate-800 text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about this scenario..."
          className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
        <button
          onClick={handleSend}
          className="rounded-md bg-sky-600 p-2 text-white transition-colors hover:bg-sky-700"
          aria-label="Send"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}