/**
 * InteractiveMap — Real Google Maps implementation for CarbonFlow.
 *
 * Replaces the SVG MapCanvas with a fully interactive Google Map.
 * Uses @vis.gl/react-google-maps for the map engine.
 * All markers, overlays, routes, heatmaps, and flows render directly
 * on the Google Map via AdvancedMarker and custom overlay components.
 *
 * ENV: requires VITE_GOOGLE_MAPS_API_KEY in .env
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { CheckCircle2 } from 'lucide-react';
import type {
  MapMode,
  SupplierNode,
  BuyerNode,
  FacilityNode,
  RouteData,
  RegionData,
  CarbonFlowEdge,
  SelectedEntity,
  GeoPoint,
} from '../../types/maps';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../types/maps';
import { cn } from '../../lib/utils';
import { generateRouteGeometry } from '../../services/routeService';

// ─── Custom Map Style (CarbonFlow industrial palette) ────────────────────────

const CARBONFLOW_MAP_STYLE: google.maps.MapTypeStyle[] = [
  // Geometry
  { elementType: 'geometry', stylers: [{ color: '#EDF3F0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#EDF3F0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6B7C74' }] },
  // Water
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#D6E8E0' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#A8C0B5' }] },
  // Roads
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#D8E6DF' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#C8DDD5' }] },
  // Landscape
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#E8F0EB' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#E4ECE7' }] },
  // POI
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#D4E5DA' }, { visibility: 'simplified' }] },
  // Transit
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  // Administrative
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#C4D5CC' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#B0C4BB' }, { weight: 1 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#5A6B63' }] },
];

// ─── Heatmap color helpers ───────────────────────────────────────────────────

type HeatmapSubMode = 'supply' | 'demand' | 'price';

function getHeatColor(intensity: number, subMode: HeatmapSubMode): string {
  if (subMode === 'supply') {
    const r = Math.round(232 - intensity * 100);
    const g = Math.round(240 - intensity * 60);
    const b = Math.round(235 - intensity * 120);
    return `rgb(${r},${g},${b})`;
  }
  if (subMode === 'demand') {
    const r = Math.round(220 - intensity * 80);
    const g = Math.round(235 - intensity * 60);
    const b = Math.round(240 - intensity * 30);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(253 - intensity * 50);
  const g = Math.round(244 - intensity * 120);
  const b = Math.round(200 - intensity * 160);
  return `rgb(${r},${g},${b})`;
}

function normalize(value: number, values: number[]): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return max === min ? 0.5 : (value - min) / (max - min);
}

// ─── Polyline / Polygon overlay using Google Maps JS API directly ────────────

const PolylineOverlay: React.FC<{
  path: GeoPoint[];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity?: number;
  geodesic?: boolean;
  dashed?: boolean;
  onClick?: () => void;
  zIndex?: number;
}> = ({ path, strokeColor, strokeWeight, strokeOpacity = 1, geodesic = false, dashed = false, onClick, zIndex = 1 }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const icons = dashed
      ? [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '12px' }]
      : undefined;

    const polyline = new google.maps.Polyline({
      path: path.map((p) => ({ lat: p.lat, lng: p.lng })),
      strokeColor,
      strokeWeight,
      strokeOpacity: dashed ? 0 : strokeOpacity,
      geodesic,
      icons,
      map,
      clickable: !!onClick,
      zIndex,
    });

    if (onClick) {
      polyline.addListener('click', onClick);
    }

    polylineRef.current = polyline;

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity, geodesic, dashed, onClick, zIndex]);

  return null;
};

const PolygonOverlay: React.FC<{
  path: GeoPoint[];
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
  onClick?: () => void;
  zIndex?: number;
}> = ({ path, fillColor, fillOpacity, strokeColor, strokeWeight, onClick, zIndex = 1 }) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    const polygon = new google.maps.Polygon({
      paths: path.map((p) => ({ lat: p.lat, lng: p.lng })),
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWeight,
      map,
      clickable: !!onClick,
      zIndex,
    });

    if (onClick) {
      polygon.addListener('click', onClick);
    }

    polygonRef.current = polygon;

    return () => {
      polygon.setMap(null);
    };
  }, [map, path, fillColor, fillOpacity, strokeColor, strokeWeight, onClick, zIndex]);

  return null;
};

// ─── Marker Pin Components ───────────────────────────────────────────────────

const SupplierPin: React.FC<{ supplier: SupplierNode; isSelected: boolean }> = ({ supplier, isSelected }) => (
  <div className={cn('flex flex-col items-center', isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm')}>
    {isSelected && (
      <div className="mb-1 bg-[#0A0A0A] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
        {supplier.name}
      </div>
    )}
    <div
      className={cn(
        'relative w-8 h-8 rounded-[10px] flex items-center justify-center border-2 transition-colors',
        isSelected ? 'bg-[#F4611E] border-white shadow-lg' : 'bg-[#0A0A0A] border-white shadow-md',
        supplier.verified && 'ring-1 ring-[#2E8B57] ring-offset-1'
      )}
    >
      <span className="text-white text-[12px] font-semibold select-none">S</span>
      {supplier.verified && (
        <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-3 h-3 text-[#2E8B57] bg-white rounded-full" />
      )}
    </div>
    <div className={cn('w-0.5 h-2', isSelected ? 'bg-[#F4611E]' : 'bg-[#0A0A0A]')} />
    <div className={cn('w-1.5 h-1.5 rounded-full', isSelected ? 'bg-[#F4611E]' : 'bg-[#0A0A0A]')} />
  </div>
);

const BuyerPin: React.FC<{ buyer: BuyerNode; isSelected: boolean }> = ({ buyer, isSelected }) => (
  <div className={cn('flex flex-col items-center', isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm')}>
    {isSelected && (
      <div className="mb-1 bg-[#2E8B57] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
        {buyer.name}
      </div>
    )}
    <div
      className={cn(
        'relative w-7 h-7 flex items-center justify-center border-2 transition-colors rotate-45',
        isSelected ? 'bg-[#2E8B57] border-white shadow-lg' : 'bg-[#2E8B57] border-white shadow-md'
      )}
      style={{ borderRadius: '4px' }}
    >
      <span className="text-white text-[11px] font-semibold select-none" style={{ transform: 'rotate(-45deg)' }}>
        B
      </span>
    </div>
    <div className={cn('w-0.5 h-2', isSelected ? 'bg-[#2E8B57]' : 'bg-[#2E8B57]')} />
    <div className={cn('w-1.5 h-1.5 rounded-full', isSelected ? 'bg-[#2E8B57]' : 'bg-[#2E8B57]')} />
  </div>
);

const FacilityPin: React.FC<{ facility: FacilityNode; isSelected: boolean }> = ({ facility, isSelected }) => {
  const typeColors: Record<string, string> = {
    'capture-hub': '#7C3AED',
    terminal: '#0284C7',
    liquefaction: '#0891B2',
    'pipeline-head': '#6366F1',
  };
  const color = typeColors[facility.type] || '#6366F1';

  return (
    <div className={cn('flex flex-col items-center', isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm')}>
      {isSelected && (
        <div
          className="mb-1 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {facility.name}
        </div>
      )}
      <div
        className={cn(
          'relative w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors',
          isSelected ? 'border-white shadow-lg' : 'border-white shadow-md'
        )}
        style={{ backgroundColor: color }}
      >
        <span className="text-white text-[10px] font-bold select-none">F</span>
      </div>
      <div className="w-0.5 h-1.5" style={{ backgroundColor: color }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
};

// ─── Region Label Marker ─────────────────────────────────────────────────────

const RegionLabel: React.FC<{
  region: RegionData;
  isSelected: boolean;
}> = ({ region, isSelected }) => (
  <div
    className={cn(
      'px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap pointer-events-none',
      isSelected ? 'bg-[#F4611E] text-white font-bold' : 'bg-white/80 text-[#3A5248] border border-[#C4D5CC]'
    )}
  >
    {region.name.split(' ')[0]}
  </div>
);

// ─── Carbon Flow Node dot ────────────────────────────────────────────────────

const FlowNodeDot: React.FC<{ type: 'supplier' | 'buyer' }> = ({ type }) => (
  <div
    className={cn(
      'w-3 h-3 rounded-full border border-white shadow-sm',
      type === 'supplier' ? 'bg-[#0A0A0A]' : 'bg-[#2E8B57]'
    )}
  />
);

// ─── Inner Map Content (must be inside <Map>) ────────────────────────────────

interface MapContentProps {
  mode: MapMode;
  suppliers: SupplierNode[];
  buyers: BuyerNode[];
  facilities: FacilityNode[];
  routes: RouteData[];
  regions: RegionData[];
  carbonFlowEdges: CarbonFlowEdge[];
  selectedEntity: SelectedEntity | null;
  onSelectEntity: (entity: SelectedEntity | null) => void;
}

const MapContent: React.FC<MapContentProps> = ({
  mode,
  suppliers,
  buyers,
  facilities,
  routes,
  regions,
  carbonFlowEdges,
  selectedEntity,
  onSelectEntity,
}) => {
  const [infoEntity, setInfoEntity] = useState<{ type: string; position: GeoPoint; label: string } | null>(null);

  const showSuppliers = mode === 'marketplace' || mode === 'supply' || mode === 'routes' || mode === 'price';
  const showBuyers = mode === 'marketplace' || mode === 'demand' || mode === 'routes' || mode === 'price';
  const showFacilities = mode === 'marketplace';
  const showRoutes = mode === 'routes';
  const showHeatmap = mode === 'supply' || mode === 'demand' || mode === 'price';
  const showCarbonFlow = mode === 'carbon-flow';

  // Heatmap intensity values
  const intensityValues = useMemo(() => {
    if (!showHeatmap) return [];
    return regions.map((r) => {
      if (mode === 'supply') return r.supply.availableTonnes;
      if (mode === 'demand') return r.demand.totalDemandTonnes;
      return r.price.avgPricePerTon;
    });
  }, [regions, mode, showHeatmap]);

  return (
    <>
      {/* ── Heatmap Region Polygons ── */}
      {showHeatmap &&
        regions.map((region, idx) => {
          const intensity = normalize(intensityValues[idx], intensityValues);
          const fillColor = getHeatColor(intensity, mode as HeatmapSubMode);
          const isSelected = selectedEntity?.type === 'region' && selectedEntity.data.id === region.id;

          return (
            <React.Fragment key={region.id}>
              <PolygonOverlay
                path={region.polygon}
                fillColor={fillColor}
                fillOpacity={isSelected ? 0.85 : 0.55}
                strokeColor={isSelected ? '#F4611E' : '#B0C4BB'}
                strokeWeight={isSelected ? 2.5 : 1}
                onClick={() => onSelectEntity({ type: 'region', data: region, subMode: mode as HeatmapSubMode })}
                zIndex={1}
              />
              <AdvancedMarker
                position={region.coords}
                zIndex={2}
              >
                <RegionLabel region={region} isSelected={isSelected} />
              </AdvancedMarker>
            </React.Fragment>
          );
        })}

      {/* ── Route Polylines ── */}
      {showRoutes &&
        routes.map((route) => {
          const isSelected = selectedEntity?.type === 'route' && selectedEntity.data.id === route.id;
          const geometry = route.geometry || generateRouteGeometry(route.fromCoords, route.toCoords);

          return (
            <React.Fragment key={route.id}>
              {/* Glow under selected */}
              {isSelected && (
                <PolylineOverlay
                  path={geometry}
                  strokeColor="#F4611E"
                  strokeWeight={6}
                  strokeOpacity={0.15}
                  zIndex={2}
                />
              )}
              <PolylineOverlay
                path={geometry}
                strokeColor={isSelected ? '#F4611E' : route.isRecommended ? '#0A0A0A' : '#8A8A85'}
                strokeWeight={isSelected ? 3 : 2}
                strokeOpacity={isSelected ? 1 : 0.6}
                dashed={!route.isRecommended}
                onClick={() => onSelectEntity({ type: 'route', data: route })}
                zIndex={3}
              />
              {/* Midpoint distance label */}
              {isSelected && (
                <AdvancedMarker
                  position={{
                    lat: (route.fromCoords.lat + route.toCoords.lat) / 2,
                    lng: (route.fromCoords.lng + route.toCoords.lng) / 2,
                  }}
                  zIndex={10}
                >
                  <div className="bg-[#F4611E] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
                    {route.distanceKm} km · {route.transportMode}
                  </div>
                </AdvancedMarker>
              )}
            </React.Fragment>
          );
        })}

      {/* ── Carbon Flow Lines ── */}
      {showCarbonFlow &&
        carbonFlowEdges.map((edge) => {
          const geometry = generateRouteGeometry(edge.fromCoords, edge.toCoords, 0.2);
          const isSelected = selectedEntity?.type === 'flow' && selectedEntity.data.id === edge.id;
          const MAX_VOLUME = 31000;
          const strokeWeight = 2 + (edge.annualVolumeTonnes / MAX_VOLUME) * 4;

          return (
            <React.Fragment key={edge.id}>
              {/* Glow */}
              {edge.isActive && (
                <PolylineOverlay
                  path={geometry}
                  strokeColor="#F4611E"
                  strokeWeight={strokeWeight + 3}
                  strokeOpacity={0.08}
                  zIndex={1}
                />
              )}
              <PolylineOverlay
                path={geometry}
                strokeColor={isSelected ? '#F4611E' : edge.isActive ? '#E8622E' : '#8A8A85'}
                strokeWeight={isSelected ? strokeWeight + 1 : strokeWeight}
                strokeOpacity={edge.isActive ? (isSelected ? 1 : 0.7) : 0.3}
                dashed={!edge.isActive}
                onClick={() => onSelectEntity({ type: 'flow', data: edge })}
                zIndex={2}
              />
              {/* Source node dot */}
              <AdvancedMarker position={edge.fromCoords} zIndex={3}>
                <FlowNodeDot type="supplier" />
              </AdvancedMarker>
              {/* Destination node dot */}
              <AdvancedMarker position={edge.toCoords} zIndex={3}>
                <FlowNodeDot type="buyer" />
              </AdvancedMarker>
              {/* Volume label */}
              {isSelected && (
                <AdvancedMarker
                  position={{
                    lat: (edge.fromCoords.lat + edge.toCoords.lat) / 2,
                    lng: (edge.fromCoords.lng + edge.toCoords.lng) / 2,
                  }}
                  zIndex={10}
                >
                  <div className="bg-[#F4611E] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
                    {(edge.annualVolumeTonnes / 1000).toFixed(1)}kt/yr
                  </div>
                </AdvancedMarker>
              )}
            </React.Fragment>
          );
        })}

      {/* ── Supplier Markers ── */}
      {showSuppliers &&
        suppliers.map((supplier) => {
          const isSelected = selectedEntity?.type === 'supplier' && selectedEntity.data.id === supplier.id;
          return (
            <AdvancedMarker
              key={supplier.id}
              position={supplier.coords}
              zIndex={isSelected ? 20 : 5}
              onClick={() => onSelectEntity({ type: 'supplier', data: supplier })}
            >
              <SupplierPin supplier={supplier} isSelected={isSelected} />
            </AdvancedMarker>
          );
        })}

      {/* ── Buyer Markers ── */}
      {showBuyers &&
        buyers.map((buyer) => {
          const isSelected = selectedEntity?.type === 'buyer' && selectedEntity.data.id === buyer.id;
          return (
            <AdvancedMarker
              key={buyer.id}
              position={buyer.coords}
              zIndex={isSelected ? 20 : 4}
              onClick={() => onSelectEntity({ type: 'buyer', data: buyer })}
            >
              <BuyerPin buyer={buyer} isSelected={isSelected} />
            </AdvancedMarker>
          );
        })}

      {/* ── Facility Markers ── */}
      {showFacilities &&
        facilities.map((facility) => {
          const isSelected = selectedEntity?.type === 'facility' && selectedEntity.data.id === facility.id;
          return (
            <AdvancedMarker
              key={facility.id}
              position={facility.coords}
              zIndex={isSelected ? 20 : 3}
              onClick={() => onSelectEntity({ type: 'facility', data: facility })}
            >
              <FacilityPin facility={facility} isSelected={isSelected} />
            </AdvancedMarker>
          );
        })}

      {/* ── InfoWindow for hover/selection details ── */}
      {infoEntity && (
        <InfoWindow
          position={infoEntity.position}
          onCloseClick={() => setInfoEntity(null)}
        >
          <div className="text-xs font-medium text-[#0A0A0A] px-1">{infoEntity.label}</div>
        </InfoWindow>
      )}
    </>
  );
};

// ─── Main InteractiveMap Component ───────────────────────────────────────────

export interface InteractiveMapProps {
  mode: MapMode;
  suppliers: SupplierNode[];
  buyers: BuyerNode[];
  facilities: FacilityNode[];
  routes: RouteData[];
  regions: RegionData[];
  carbonFlowEdges: CarbonFlowEdge[];
  selectedEntity: SelectedEntity | null;
  onSelectEntity: (entity: SelectedEntity | null) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mode,
  suppliers,
  buyers,
  facilities,
  routes,
  regions,
  carbonFlowEdges,
  selectedEntity,
  onSelectEntity,
  className = '',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Fallback UI when no API key is provided
  if (!apiKey) {
    return (
      <div className={cn('relative w-full h-full flex items-center justify-center bg-[#EDF3F0]', className)}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F4611E]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#F4611E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#0A0A0A] mb-2">Google Maps API Key Required</h3>
          <p className="text-sm text-[#6B7C74] mb-4 leading-relaxed">
            To display the interactive map, add your Google Maps API key to the environment file.
          </p>
          <code className="inline-block bg-[#0A0A0A] text-[#E8F0EB] text-xs px-3 py-2 rounded-lg font-mono">
            VITE_GOOGLE_MAPS_API_KEY=your_key_here
          </code>
          <p className="text-[11px] text-[#8A8A85] mt-3">
            Create or update <span className="font-mono">.env</span> in the frontend directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={DEFAULT_MAP_CENTER}
          defaultZoom={DEFAULT_MAP_ZOOM}
          mapId="carbonflow-map"
          gestureHandling="greedy"
          disableDefaultUI={true}
          clickableIcons={false}
          styles={CARBONFLOW_MAP_STYLE}
          className="w-full h-full"
          onClick={() => onSelectEntity(null)}
        >
          <MapContent
            mode={mode}
            suppliers={suppliers}
            buyers={buyers}
            facilities={facilities}
            routes={routes}
            regions={regions}
            carbonFlowEdges={carbonFlowEdges}
            selectedEntity={selectedEntity}
            onSelectEntity={onSelectEntity}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default InteractiveMap;
