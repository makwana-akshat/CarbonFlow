import React from 'react';
import type { RouteOption } from './types';
import { Navigation, Clock, ShieldCheck, Leaf } from 'lucide-react';

interface RouteOptionsPanelProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  className?: string;
  hideHeader?: boolean;
}

export const RouteOptionsPanel: React.FC<RouteOptionsPanelProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className = '',
  hideHeader = false,
}) => {
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      {/* Panel Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">
              Route Options
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Routing Matrix • Evaluated
            </p>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            {routes.length} Corridors
          </span>
        </div>
      )}

      {/* Stacked Route Cards */}
      <div className="flex flex-col gap-2.5 w-full">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isRecommended = route.isRecommended;

          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`w-full text-left rounded-xl p-3 border transition-all relative flex flex-col gap-2 cursor-pointer bg-white ${
                isSelected
                  ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 shadow-2xs'
              } ${isRecommended ? 'border-l-4 border-l-[#F4611E]' : ''}`}
            >
              {/* Header: Route Name & Recommended Tag */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-gray-900 leading-snug truncate">
                      {route.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                    {route.viaDescription}
                  </p>
                </div>

                {isRecommended && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#F4611E] border border-[#F4611E]/30 shrink-0">
                    Recommended
                  </span>
                )}
              </div>

              {/* Distance and ETA */}
              <div className="flex items-center gap-3 text-[11px] text-gray-600 py-1 border-y border-gray-100">
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-gray-700" />
                  <span className="font-semibold text-gray-900">
                    {route.distanceKm} km
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-700" />
                  <span className="font-semibold text-gray-900">
                    {route.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Cost, Emissions, Safety Footer */}
              <div className="space-y-1.5 pt-0.5">
                {/* Transport Cost */}
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-gray-500">Transport Cost</span>
                  <span className="text-[13px] font-bold text-gray-900">
                    {formatCurrency(route.transportCostINR)}
                  </span>
                </div>

                {/* Transport Emissions & Safety Level */}
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold">+{route.transportEmissionsTons} t CO₂e</span>
                  </div>
                  {route.safetyLevel && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{route.safetyLevel}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
