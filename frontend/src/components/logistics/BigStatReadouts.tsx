import React from 'react';
import type { RouteOption, Shipment } from './types';
import { Activity, Clock, Leaf, Weight } from 'lucide-react';

interface BigStatReadoutsProps {
  route: RouteOption;
  shipment: Shipment;
  className?: string;
}

export const BigStatReadouts: React.FC<BigStatReadoutsProps> = ({
  route,
  shipment,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 gap-2 w-full select-none ${className}`}>
      {/* 1. Distance */}
      <div className="rounded-xl border border-gray-100/90 bg-white/80 p-2.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Distance
          </span>
          <Activity className="w-3 h-3 text-[#F4611E]" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-gray-900 leading-none">
              {route.distanceKm}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">km</span>
          </div>
          <p className="text-[10px] text-gray-500 truncate mt-0.5" title={route.viaDescription}>
            {route.viaDescription}
          </p>
        </div>
      </div>

      {/* 2. ETA */}
      <div className="rounded-xl border border-gray-100/90 bg-white/80 p-2.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Est. Arrival
          </span>
          <Clock className="w-3 h-3 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[17px] sm:text-[19px] font-bold tracking-tight text-gray-900 leading-none">
              {route.estimatedTime}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 truncate mt-0.5">
            {shipment.status === 'in-transit' ? 'SCADA Telemetry' : 'Scheduled'}
          </p>
        </div>
      </div>

      {/* 3. Transport Footprint */}
      <div className="rounded-xl border border-gray-100/90 bg-white/80 p-2.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Transport CO₂
          </span>
          <Leaf className="w-3 h-3 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-emerald-700 leading-none">
              +{route.transportEmissionsTons}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700/80">t CO₂e</span>
          </div>
          <p className="text-[10px] text-gray-500 truncate mt-0.5">
            Scope 3 freight
          </p>
        </div>
      </div>

      {/* 4. Shipment Volume */}
      <div className="rounded-xl border border-gray-100/90 bg-white/80 p-2.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Volume
          </span>
          <Weight className="w-3 h-3 text-[#F4611E]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-gray-900 leading-none">
              {shipment.volume.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">t</span>
            <span
              className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded ${
                shipment.physicalState === 'liquefied'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {shipment.physicalState === 'liquefied' ? 'Liq' : 'Gas'}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 truncate mt-0.5">
            {shipment.purity}% Purity
          </p>
        </div>
      </div>
    </div>
  );
};
