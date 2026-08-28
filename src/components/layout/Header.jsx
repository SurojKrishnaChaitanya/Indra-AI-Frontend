import { Bell, Settings } from 'lucide-react';

export default function Header({ activeAlertCount = 0 }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search region, coordinates..."
          className="w-72 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
          {activeAlertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {activeAlertCount}
            </span>
          )}
        </button>
        <button
          aria-label="Settings"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-50"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}