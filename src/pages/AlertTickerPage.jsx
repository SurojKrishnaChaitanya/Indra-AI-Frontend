// // import React, { useMemo, useState } from 'react';
// // import { Search, Radio } from 'lucide-react';

// // import { mockAlerts } from '../mock/mockAlerts';
// // import AlertCard from '../components/alerts/AlertCard';
// // import AlertDetails from '../components/alerts/AlertDetails';

// // export default function AlertTickerPage() {
// //   const [selectedAlert, setSelectedAlert] = useState(null);
// //   const [hazardFilter, setHazardFilter] = useState('all');
// //   const [severityFilter, setSeverityFilter] = useState('all');
// //   const [statusFilter, setStatusFilter] = useState('all');
// //   const [search, setSearch] = useState('');

// //   const filteredAlerts = useMemo(() => {
// //     const query = search.trim().toLowerCase();

// //     return mockAlerts.filter((alert) => {
// //       const matchesHazard =
// //         hazardFilter === 'all' || alert.hazardType === hazardFilter;

// //       const matchesSeverity =
// //         severityFilter === 'all' || alert.severity === severityFilter;

// //       const matchesStatus =
// //         statusFilter === 'all' || alert.status === statusFilter;

// //       const matchesSearch =
// //         !query ||
// //         alert.id.toLowerCase().includes(query) ||
// //         alert.regionName.toLowerCase().includes(query) ||
// //         alert.state.toLowerCase().includes(query);

// //       return (
// //         matchesHazard &&
// //         matchesSeverity &&
// //         matchesStatus &&
// //         matchesSearch
// //       );
// //     });
// //   }, [hazardFilter, severityFilter, statusFilter, search]);

// //   const totalAlerts = mockAlerts.length;

// //   const activeAlerts = mockAlerts.filter(
// //     (alert) => alert.status === 'active'
// //   ).length;

// //   const severeAlerts = mockAlerts.filter(
// //     (alert) => alert.severity === 'severe'
// //   ).length;

// //   const averageRisk =
// //     mockAlerts.length > 0
// //       ? Math.round(
// //           mockAlerts.reduce(
// //             (sum, alert) => sum + alert.riskScore,
// //             0
// //           ) / mockAlerts.length
// //         )
// //       : 0;

// //   return (
// //     <div className="space-y-6 p-6">
// //       <div>
// //         <h2 className="text-2xl font-semibold">Alert Ticker</h2>
// //         <p className="mt-1 text-sm text-slate-500">
// //           Real-time severe weather alerts and response status.
// //         </p>
// //       </div>
// //       <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

// //         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
// //           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
// //             Total Alerts
// //           </p>

// //           <div className="mt-2 flex items-end justify-between">
// //             <p className="text-2xl font-bold text-slate-900">
// //               {totalAlerts}
// //             </p>

// //             <span className="text-xs text-slate-400">
// //               All recorded
// //             </span>
// //           </div>
// //         </div>


// //         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
// //           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
// //             Active Alerts
// //           </p>

// //           <div className="mt-2 flex items-end justify-between">
// //             <p className="text-2xl font-bold text-red-600">
// //               {activeAlerts}
// //             </p>

// //             <span className="text-xs text-red-500">
// //               Requires attention
// //             </span>
// //           </div>
// //         </div>


// //         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
// //           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
// //             Severe Alerts
// //           </p>

// //           <div className="mt-2 flex items-end justify-between">
// //             <p className="text-2xl font-bold text-orange-600">
// //               {severeAlerts}
// //             </p>

// //             <span className="text-xs text-orange-500">
// //               High priority
// //             </span>
// //           </div>
// //         </div>


// //         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
// //           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
// //             Average Risk
// //           </p>

// //           <div className="mt-2 flex items-end justify-between">
// //             <p className="text-2xl font-bold text-slate-900">
// //               {averageRisk}%
// //             </p>

// //             <span className="text-xs text-slate-400">
// //               Current dataset
// //             </span>
// //           </div>
// //         </div>

// //       </div>



// //       <div className="rounded-lg border bg-white p-4 shadow-sm">
// //         <div className="flex flex-col gap-3 lg:flex-row">
// //           <div className="relative flex-1">
// //             <Search
// //               size={17}
// //               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
// //             />

// //             <input
// //               type="text"
// //               placeholder="Search alert ID, region or state..."
// //               value={search}
// //               onChange={(event) => setSearch(event.target.value)}
// //               className="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
// //             />
// //           </div>

// //           <select
// //             value={hazardFilter}
// //             onChange={(event) => setHazardFilter(event.target.value)}
// //             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
// //           >
// //             <option value="all">All Hazards</option>
// //             <option value="thunderstorm">Thunderstorm</option>
// //             <option value="cloudburst">Cloudburst</option>
// //             <option value="flashFlood">Flash Flood</option>
// //           </select>

// //           <select
// //             value={severityFilter}
// //             onChange={(event) => setSeverityFilter(event.target.value)}
// //             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
// //           >
// //             <option value="all">All Severities</option>
// //             <option value="severe">Severe</option>
// //             <option value="high">High</option>
// //             <option value="moderate">Moderate</option>
// //             <option value="low">Low</option>
// //           </select>

// //           <select
// //             value={statusFilter}
// //             onChange={(event) => setStatusFilter(event.target.value)}
// //             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
// //           >
// //             <option value="all">All Statuses</option>
// //             <option value="active">Active</option>
// //             <option value="acknowledged">Acknowledged</option>
// //             <option value="resolved">Resolved</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className="flex items-center justify-between">
// //         <h3 className="text-lg font-semibold">Current Alerts</h3>

// //         <div className="flex items-center gap-2 text-sm text-slate-500">
// //           <Radio size={15} className="text-green-600" />
// //           Live monitoring
// //         </div>
// //       </div>

// //       <div className="grid gap-4">
// //         {filteredAlerts.length > 0 ? (
// //           filteredAlerts.map((alert) => (
// //             <AlertCard
// //               key={alert.id}
// //               alert={alert}
// //               onClick={() => setSelectedAlert(alert)}
// //             />
// //           ))
// //         ) : (
// //           <div className="rounded-lg border bg-white p-10 text-center">
// //             <p className="font-medium">No alerts found</p>
// //             <p className="mt-1 text-sm text-slate-500">
// //               Try changing your filters or search query.
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //       <AlertDetails
// //         alert={selectedAlert}
// //         onClose={() => setSelectedAlert(null)}
// //       />
// //     </div>
// //   );
// // }

// import React, { useEffect, useMemo, useState } from 'react';
// import { Search, Radio } from 'lucide-react';

// import { mockAlerts } from '../mock/mockAlerts';
// import AlertCard from '../components/alerts/AlertCard';
// import AlertDetails from '../components/alerts/AlertDetails';
// import { useWeatherStore } from '../store/useWeatherStore';

// export default function AlertTickerPage() {
//   const [selectedAlert, setSelectedAlert] = useState(null);
//   const [hazardFilter, setHazardFilter] = useState('all');
//   const [severityFilter, setSeverityFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [search, setSearch] = useState('');

//   // Soft default: when the globally selected region changes (e.g. via a
//   // click on Live Map), seed the search box with its name so this page
//   // opens scoped to that region. The user can still clear it to browse everything.
//   const selectedRegion = useWeatherStore((state) => state.selectedRegion);

//   useEffect(() => {
//     if (selectedRegion?.name) {
//       setSearch(selectedRegion.name);
//     }
//   }, [selectedRegion]);

//   const filteredAlerts = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return mockAlerts.filter((alert) => {
//       const matchesHazard =
//         hazardFilter === 'all' || alert.hazardType === hazardFilter;

//       const matchesSeverity =
//         severityFilter === 'all' || alert.severity === severityFilter;

//       const matchesStatus =
//         statusFilter === 'all' || alert.status === statusFilter;

//       const matchesSearch =
//         !query ||
//         alert.id.toLowerCase().includes(query) ||
//         alert.regionName.toLowerCase().includes(query) ||
//         alert.state.toLowerCase().includes(query);

//       return (
//         matchesHazard &&
//         matchesSeverity &&
//         matchesStatus &&
//         matchesSearch
//       );
//     });
//   }, [hazardFilter, severityFilter, statusFilter, search]);

//   const totalAlerts = mockAlerts.length;

//   const activeAlerts = mockAlerts.filter(
//     (alert) => alert.status === 'active'
//   ).length;

//   const severeAlerts = mockAlerts.filter(
//     (alert) => alert.severity === 'severe'
//   ).length;

//   const averageRisk =
//     mockAlerts.length > 0
//       ? Math.round(
//           mockAlerts.reduce(
//             (sum, alert) => sum + alert.riskScore,
//             0
//           ) / mockAlerts.length
//         )
//       : 0;

//   return (
//     <div className="space-y-6 p-6">
//       <div>
//         <h2 className="text-2xl font-semibold">Alert Ticker</h2>
//         <p className="mt-1 text-sm text-slate-500">
//           Real-time severe weather alerts and response status.
//         </p>
//       </div>
//       <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

//         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
//           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//             Total Alerts
//           </p>

//           <div className="mt-2 flex items-end justify-between">
//             <p className="text-2xl font-bold text-slate-900">
//               {totalAlerts}
//             </p>

//             <span className="text-xs text-slate-400">
//               All recorded
//             </span>
//           </div>
//         </div>


//         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
//           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//             Active Alerts
//           </p>

//           <div className="mt-2 flex items-end justify-between">
//             <p className="text-2xl font-bold text-red-600">
//               {activeAlerts}
//             </p>

//             <span className="text-xs text-red-500">
//               Requires attention
//             </span>
//           </div>
//         </div>


//         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
//           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//             Severe Alerts
//           </p>

//           <div className="mt-2 flex items-end justify-between">
//             <p className="text-2xl font-bold text-orange-600">
//               {severeAlerts}
//             </p>

//             <span className="text-xs text-orange-500">
//               High priority
//             </span>
//           </div>
//         </div>


//         <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
//           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//             Average Risk
//           </p>

//           <div className="mt-2 flex items-end justify-between">
//             <p className="text-2xl font-bold text-slate-900">
//               {averageRisk}%
//             </p>

//             <span className="text-xs text-slate-400">
//               Current dataset
//             </span>
//           </div>
//         </div>

//       </div>



//       <div className="rounded-lg border bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-3 lg:flex-row">
//           <div className="relative flex-1">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               placeholder="Search alert ID, region or state..."
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               className="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
//             />
//           </div>

//           <select
//             value={hazardFilter}
//             onChange={(event) => setHazardFilter(event.target.value)}
//             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//           >
//             <option value="all">All Hazards</option>
//             <option value="thunderstorm">Thunderstorm</option>
//             <option value="cloudburst">Cloudburst</option>
//             <option value="flashFlood">Flash Flood</option>
//           </select>

//           <select
//             value={severityFilter}
//             onChange={(event) => setSeverityFilter(event.target.value)}
//             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//           >
//             <option value="all">All Severities</option>
//             <option value="severe">Severe</option>
//             <option value="high">High</option>
//             <option value="moderate">Moderate</option>
//             <option value="low">Low</option>
//           </select>

//           <select
//             value={statusFilter}
//             onChange={(event) => setStatusFilter(event.target.value)}
//             className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//           >
//             <option value="all">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="acknowledged">Acknowledged</option>
//             <option value="resolved">Resolved</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Current Alerts</h3>

//         <div className="flex items-center gap-2 text-sm text-slate-500">
//           <Radio size={15} className="text-green-600" />
//           Live monitoring
//         </div>
//       </div>

//       <div className="grid gap-4">
//         {filteredAlerts.length > 0 ? (
//           filteredAlerts.map((alert) => (
//             <AlertCard
//               key={alert.id}
//               alert={alert}
//               onClick={() => setSelectedAlert(alert)}
//             />
//           ))
//         ) : (
//           <div className="rounded-lg border bg-white p-10 text-center">
//             <p className="font-medium">No alerts found</p>
//             <p className="mt-1 text-sm text-slate-500">
//               Try changing your filters or search query.
//             </p>
//           </div>
//         )}
//       </div>
//       <AlertDetails
//         alert={selectedAlert}
//         onClose={() => setSelectedAlert(null)}
//       />
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Radio } from 'lucide-react';

import { mockAlerts } from '../mock/mockAlerts';
import AlertCard from '../components/alerts/AlertCard';
import AlertDetails from '../components/alerts/AlertDetails';
import { useWeatherStore } from '../store/useWeatherStore';

export default function AlertTickerPage() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [hazardFilter, setHazardFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Soft default: when the globally selected region changes (e.g. via a
  // click on Live Map), seed the search box with its name so this page
  // opens scoped to that region. The user can still clear it to browse everything.
  const selectedRegion = useWeatherStore((state) => state.selectedRegion);

  useEffect(() => {
    if (selectedRegion?.name) {
      setSearch(selectedRegion.name);
    }
  }, [selectedRegion]);

  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockAlerts.filter((alert) => {
      const matchesHazard =
        hazardFilter === 'all' || alert.hazardType === hazardFilter;

      const matchesSeverity =
        severityFilter === 'all' || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === 'all' || alert.status === statusFilter;

      const matchesSearch =
        !query ||
        alert.id.toLowerCase().includes(query) ||
        alert.regionName.toLowerCase().includes(query) ||
        alert.state.toLowerCase().includes(query);

      return (
        matchesHazard &&
        matchesSeverity &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [hazardFilter, severityFilter, statusFilter, search]);

  const totalAlerts = mockAlerts.length;

  const activeAlerts = mockAlerts.filter(
    (alert) => alert.status === 'active'
  ).length;

  const severeAlerts = mockAlerts.filter(
    (alert) => alert.severity === 'severe'
  ).length;

  const averageRisk =
    mockAlerts.length > 0
      ? Math.round(
          mockAlerts.reduce(
            (sum, alert) => sum + alert.riskScore,
            0
          ) / mockAlerts.length
        )
      : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100/50 to-amber-50/20 p-6 text-slate-900">
      {/* Background Visual Layer: Live Radar Sweep & Hazard Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Radar Concentric Circles Anchor (Top-Right) */}
        <div className="absolute -top-24 -right-24 flex h-[600px] w-[600px] items-center justify-center rounded-full border border-slate-200/60">
          <div className="h-[450px] w-[450px] rounded-full border border-slate-200/50" />
          <div className="h-[300px] w-[300px] animate-pulse rounded-full border border-sky-300/40" />
          <div className="h-[150px] w-[150px] rounded-full border border-amber-300/30" />
        </div>

        {/* Dynamic Hazard Ambient Glow Blurs */}
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/3 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Alert Ticker</h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time severe weather alerts and response status.
          </p>
        </div>

        {/* KPI Header Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Alerts
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-slate-900">{totalAlerts}</p>
              <span className="text-xs text-slate-400">All recorded</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active Alerts
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
              <span className="text-xs font-medium text-red-500">Requires attention</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Severe Alerts
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-orange-600">{severeAlerts}</p>
              <span className="text-xs font-medium text-orange-500">High priority</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Average Risk
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-slate-900">{averageRisk}%</p>
              <span className="text-xs text-slate-400">Current dataset</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search alert ID, region or state..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <select
              value={hazardFilter}
              onChange={(event) => setHazardFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All Hazards</option>
              <option value="thunderstorm">Thunderstorm</option>
              <option value="cloudburst">Cloudburst</option>
              <option value="flashFlood">Flash Flood</option>
            </select>

            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All Severities</option>
              <option value="severe">Severe</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Current Alerts</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Radio size={15} className="animate-pulse text-emerald-600" />
            Live monitoring
          </div>
        </div>

        {/* Alerts List Grid */}
        <div className="grid gap-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => setSelectedAlert(alert)}
              />
            ))
          ) : (
            <div className="rounded-lg border border-slate-200/80 bg-white/90 p-10 text-center backdrop-blur-sm">
              <p className="font-medium text-slate-800">No alerts found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or search query.
              </p>
            </div>
          )}
        </div>

        {/* Modal Overlay Component */}
        <AlertDetails
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      </div>
    </div>
  );
}