import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import type { RouteOption, Shipment } from './types';
import { Factory, Building2, Truck } from 'lucide-react';

interface LogisticsMapProps {
  shipment: Shipment;
  activeRoute: RouteOption;
  allRoutes?: RouteOption[];
  onSelectRoute?: (routeId: string) => void;
  className?: string;
}

// ─── Smooth Spline Interpolation for Geographic Corridors ────────────────────

function generateSmoothPath(waypoints: [number, number][]): { lat: number; lng: number }[] {
  if (!waypoints || waypoints.length === 0) return [];
  if (waypoints.length === 1) return [{ lat: waypoints[0][0], lng: waypoints[0][1] }];

  if (waypoints.length === 2) {
    const [start, end] = waypoints;
    const midLat = (start[0] + end[0]) / 2 + (end[1] - start[1]) * 0.04;
    const midLng = (start[1] + end[1]) / 2 - (end[0] - start[0]) * 0.04;
    const result: { lat: number; lng: number }[] = [];
    const steps = 25;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const t1 = 1 - t;
      const lat = t1 * t1 * start[0] + 2 * t1 * t * midLat + t * t * end[0];
      const lng = t1 * t1 * start[1] + 2 * t1 * t * midLng + t * t * end[1];
      result.push({ lat, lng });
    }
    return result;
  }

  // Catmull-Rom spline formulation for smooth highway curves
  const result: { lat: number; lng: number }[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(i - 1, 0)];
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const p3 = waypoints[Math.min(i + 2, waypoints.length - 1)];

    const steps = 16;
    for (let s = 0; s < (i === waypoints.length - 2 ? steps + 1 : steps); s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;

      const lat = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );
      const lng = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );
      result.push({ lat, lng });
    }
  }
  return result;
}

// ─── Individual Route Polyline Overlay Component ─────────────────────────────

interface RouteLineOverlayProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect?: () => void;
  roadPathOverride?: { lat: number; lng: number }[] | null;
}

const RouteLineOverlay: React.FC<RouteLineOverlayProps> = ({
  route,
  isSelected,
  onSelect,
  roadPathOverride,
}) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Use roadPathOverride if Google Directions provided it, otherwise use smooth corridor waypoints
  const path = useMemo(() => {
    if (isSelected && roadPathOverride && roadPathOverride.length > 0) {
      return roadPathOverride;
    }
    return generateSmoothPath(route.waypoints);
  }, [route.waypoints, isSelected, roadPathOverride]);

  useEffect(() => {
    if (!map || !path || path.length === 0) return;

    const strokeColor = isSelected ? '#F4611E' : '#94A3B8';
    const strokeWeight = isSelected ? 5 : 3;
    const strokeOpacity = isSelected ? 0.95 : 0.6;
    const zIndex = isSelected ? 25 : 10;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      zIndex,
      geodesic: true,
      clickable: true,
      map,
    });

    if (onSelect) {
      polyline.addListener('click', onSelect);
    }

    polylineRef.current = polyline;

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, isSelected, onSelect]);

  return null;
};

// ─── Google Directions Road Path Service ─────────────────────────────────────

interface DirectionsServiceHelperProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: [number, number][];
  onPathCalculated: (path: { lat: number; lng: number }[]) => void;
}

const DirectionsServiceHelper: React.FC<DirectionsServiceHelperProps> = ({
  origin,
  destination,
  waypoints,
  onPathCalculated,
}) => {
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (!routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
  }, [routesLibrary]);

  useEffect(() => {
    if (!directionsService) return;

    const intermediateWaypoints: google.maps.DirectionsWaypoint[] =
      waypoints && waypoints.length > 2
        ? waypoints.slice(1, -1).map(([lat, lng]) => ({
            location: new google.maps.LatLng(lat, lng),
            stopover: false,
          }))
        : [];

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: intermediateWaypoints,
        optimizeWaypoints: false,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response && response.routes[0]) {
          const overviewPath = response.routes[0].overview_path;
          if (overviewPath && overviewPath.length > 0) {
            const formatted = overviewPath.map((p) => ({ lat: p.lat(), lng: p.lng() }));
            onPathCalculated(formatted);
          }
        } else {
          // If Google Directions fails or is restricted, corridor waypoints are already rendered
          console.info('Using corridor spline route geometry (DirectionsService status:', status, ')');
        }
      }
    );
  }, [directionsService, origin.lat, origin.lng, destination.lat, destination.lng, waypoints, onPathCalculated]);

  return null;
};

// ─── Map Bounds Auto-Fit Helper ──────────────────────────────────────────────

const MapBoundsFitter: React.FC<{
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: [number, number][];
}> = ({ origin, destination, waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
    bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));

    if (waypoints) {
      waypoints.forEach(([lat, lng]) => {
        bounds.extend(new google.maps.LatLng(lat, lng));
      });
    }

    // Responsive padding so route is framed between left (~320px) and right (~340px) panels
    const isDesktop = window.innerWidth >= 1024;
    const padding = isDesktop
      ? { top: 90, right: 380, bottom: 170, left: 360 }
      : { top: 50, right: 30, bottom: 50, left: 30 };

    map.fitBounds(bounds, padding);
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng, waypoints]);

  return null;
};

// ─── Main Logistics Map Component (Full-Bleed Background) ────────────────────

export const LogisticsMap: React.FC<LogisticsMapProps> = ({
  shipment,
  activeRoute,
  allRoutes = [],
  onSelectRoute,
  className = '',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Active InfoWindow state: 'origin' | 'destination' | 'carrier' | null
  const [activeInfo, setActiveInfo] = useState<'origin' | 'destination' | 'carrier' | null>(null);

  // Turn-by-turn road path from DirectionsService (if available)
  const [roadPathOverride, setRoadPathOverride] = useState<{ lat: number; lng: number }[] | null>(null);

  // Reset road override when activeRoute changes
  useEffect(() => {
    setRoadPathOverride(null);
  }, [activeRoute.id]);

  // Parse coordinates with fallback
  const rawOrigin = shipment.emitterLocation?.coordinates;
  const rawDest = shipment.buyerLocation?.coordinates;

  const originCoords = useMemo(() => {
    if (rawOrigin && rawOrigin[0] && rawOrigin[1]) {
      return { lat: rawOrigin[0], lng: rawOrigin[1] };
    }
    return { lat: 21.1702, lng: 72.8311 };
  }, [rawOrigin]);

  const destCoords = useMemo(() => {
    if (rawDest && rawDest[0] && rawDest[1]) {
      return { lat: rawDest[0], lng: rawDest[1] };
    }
    return { lat: 23.0225, lng: 72.5714 };
  }, [rawDest]);

  // Map center calculation
  const center = useMemo(() => {
    return {
      lat: (originCoords.lat + destCoords.lat) / 2,
      lng: (originCoords.lng + destCoords.lng) / 2,
    };
  }, [originCoords, destCoords]);

  // In-transit vehicle approximate position
  const carrierCoords = useMemo(() => {
    if (shipment.status !== 'in-transit') return null;
    const progress = (activeRoute.transitProgressPercent || 50) / 100;
    return {
      lat: originCoords.lat + (destCoords.lat - originCoords.lat) * progress,
      lng: originCoords.lng + (destCoords.lng - originCoords.lng) * progress,
    };
  }, [shipment.status, activeRoute.transitProgressPercent, originCoords, destCoords]);

  // Merge activeRoute into allRoutes list if missing
  const routesToRender = useMemo(() => {
    if (!allRoutes || allRoutes.length === 0) return [activeRoute];
    const exists = allRoutes.some((r) => r.id === activeRoute.id);
    return exists ? allRoutes : [activeRoute, ...allRoutes];
  }, [allRoutes, activeRoute]);

  return (
    <div className={`relative w-full h-full bg-slate-100 ${className}`}>
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={8}
            mapId="carbonflow-logistics-fullbleed"
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            scaleControl={true}
            streetViewControl={false}
            rotateControl={false}
            fullscreenControl={true}
            className="w-full h-full"
          >
            {/* 1. Auto-Fit Bounds with Padding for Floating Panels */}
            <MapBoundsFitter
              origin={originCoords}
              destination={destCoords}
              waypoints={activeRoute.waypoints}
            />

            {/* 2. Optional Real Road Directions Calculation */}
            <DirectionsServiceHelper
              origin={originCoords}
              destination={destCoords}
              waypoints={activeRoute.waypoints}
              onPathCalculated={setRoadPathOverride}
            />

            {/* 3. Render ALL Route Option Polylines (Selected in Orange, Others in Muted Gray) */}
            {routesToRender.map((route) => {
              const isSelected = route.id === activeRoute.id;
              return (
                <RouteLineOverlay
                  key={route.id}
                  route={route}
                  isSelected={isSelected}
                  onSelect={() => onSelectRoute && onSelectRoute(route.id)}
                  roadPathOverride={isSelected ? roadPathOverride : null}
                />
              );
            })}

            {/* 4. Origin Marker (Emitter - Hazira / Surat) */}
            <AdvancedMarker
              position={originCoords}
              title={`Origin: ${shipment.emitterLocation.name}`}
              onClick={() => setActiveInfo(activeInfo === 'origin' ? null : 'origin')}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-[#F4611E] text-white flex items-center justify-center shadow-lg ring-4 ring-[#F4611E]/20 transition-transform group-hover:scale-110">
                  <Factory className="w-4 h-4" />
                </div>
                <div className="w-1.5 h-2 bg-[#F4611E]" />
                <div className="w-2 h-2 rounded-full bg-[#F4611E]/50" />
              </div>
            </AdvancedMarker>

            {/* Origin Native InfoWindow */}
            {activeInfo === 'origin' && (
              <InfoWindow
                position={originCoords}
                onCloseClick={() => setActiveInfo(null)}
              >
                <div className="p-1 max-w-xs text-gray-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F4611E] mb-1">
                    <Factory className="w-3 h-3" />
                    <span>Origin Emitter</span>
                  </div>
                  <div className="font-bold text-[13px] text-gray-900 leading-tight">
                    {shipment.emitterLocation.name}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    {shipment.emitterLocation.facility}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-[11px] flex justify-between">
                    <span className="text-gray-500">Assay Purity:</span>
                    <span className="font-semibold text-gray-900">{shipment.purity}% CO₂</span>
                  </div>
                  <div className="text-[11px] flex justify-between mt-0.5">
                    <span className="text-gray-500">Physical State:</span>
                    <span className="font-semibold capitalize text-gray-900">{shipment.physicalState}</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* 5. Destination Marker (Buyer - Ahmedabad / Offtake) */}
            <AdvancedMarker
              position={destCoords}
              title={`Destination: ${shipment.buyerLocation.name}`}
              onClick={() => setActiveInfo(activeInfo === 'destination' ? null : 'destination')}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-[#34C77B] text-white flex items-center justify-center shadow-lg ring-4 ring-[#34C77B]/20 transition-transform group-hover:scale-110">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="w-1.5 h-2 bg-[#34C77B]" />
                <div className="w-2 h-2 rounded-full bg-[#34C77B]/50" />
              </div>
            </AdvancedMarker>

            {/* Destination Native InfoWindow */}
            {activeInfo === 'destination' && (
              <InfoWindow
                position={destCoords}
                onCloseClick={() => setActiveInfo(null)}
              >
                <div className="p-1 max-w-xs text-gray-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#34C77B] mb-1">
                    <Building2 className="w-3 h-3" />
                    <span>Offtake Destination</span>
                  </div>
                  <div className="font-bold text-[13px] text-gray-900 leading-tight">
                    {shipment.buyerLocation.name}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    {shipment.buyerLocation.facility}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-[11px] flex justify-between">
                    <span className="text-gray-500">Payload Volume:</span>
                    <span className="font-semibold text-gray-900">{shipment.volume.toLocaleString()} tonnes</span>
                  </div>
                  <div className="text-[11px] flex justify-between mt-0.5">
                    <span className="text-gray-500">Destination Hub:</span>
                    <span className="font-semibold text-gray-900">{shipment.buyerLocation.city}</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* 6. In-Transit Carrier Marker (Active Live GPS Telemetry) */}
            {carrierCoords && (
              <AdvancedMarker
                position={carrierCoords}
                title="In-Transit Carrier Convoy"
                onClick={() => setActiveInfo(activeInfo === 'carrier' ? null : 'carrier')}
              >
                <div className="relative flex items-center justify-center cursor-pointer group">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#F4611E] opacity-40" />
                  <div className="w-7 h-7 rounded-full bg-gray-900 text-[#F4611E] border-2 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Carrier Native InfoWindow */}
            {activeInfo === 'carrier' && carrierCoords && (
              <InfoWindow
                position={carrierCoords}
                onCloseClick={() => setActiveInfo(null)}
              >
                <div className="p-1 max-w-xs text-gray-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Carrier Telemetry</span>
                  </div>
                  <div className="font-bold text-[13px] text-gray-900">
                    ISO Cryo-Tanker Convoy
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Active on {activeRoute.name}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-[11px] flex justify-between">
                    <span className="text-gray-500">Progress:</span>
                    <span className="font-semibold text-gray-900">{activeRoute.transitProgressPercent || 62}%</span>
                  </div>
                  <div className="text-[11px] flex justify-between mt-0.5">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-semibold text-emerald-700">En Route</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
          <p className="font-semibold text-gray-700 text-sm">Google Maps API Key Not Configured</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            Please set VITE_GOOGLE_MAPS_API_KEY in your .env file to enable live road routing.
          </p>
        </div>
      )}
    </div>
  );
};
