import { NavLink } from 'react-router-dom';
import {
  Map,
  BarChart3,
  Bell,
  Brain,
  SlidersHorizontal,
  History,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { to: '/live-map', label: 'Live Map', icon: Map },
  { to: '/risk-analysis', label: 'Risk Analysis', icon: BarChart3 },
  { to: '/alert-ticker', label: 'Alert Ticker', icon: Bell },
  { to: '/xai-reports', label: 'XAI Reports', icon: Brain },
  { to: '/simulator', label: 'Simulator', icon: SlidersHorizontal },
  { to: '/historical', label: 'Historical Data', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <h1 className="text-lg font-bold text-sky-600">Astraeus Sentinel</h1>
        <p className="text-xs text-slate-500">Disaster Management AI</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-200 px-3 py-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        <NavLink
          to="/support"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </NavLink>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-4">
        <div className="h-8 w-8 rounded-full bg-sky-100" />
        <div>
          <p className="text-sm font-medium text-slate-900">Command Center</p>
          <p className="text-xs text-slate-500">Disaster Mgmt India</p>
        </div>
      </div>
    </aside>
  );
}