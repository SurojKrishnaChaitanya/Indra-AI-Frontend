import React from 'react';
import LiveMap from '../components/map/LiveMap.jsx';

export default function LiveMapPage() {
  return (
    <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
      <LiveMap />
    </div>
  );
}