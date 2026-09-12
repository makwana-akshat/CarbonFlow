import React, { useState, useEffect, useMemo } from 'react';
import type {
  MapMode,
  SelectedEntity,
  MapFilterState,
} from '../../types/maps';
import { DEFAULT_MAP_FILTERS } from '../../types/maps';
import { InteractiveMap } from './InteractiveMap';
import { MapHeader } from './MapHeader';
import { MapModeSelector } from './MapModeSelector';
import { MapToolbar } from './MapToolbar';
import { MapLegend } from './MapLegend';
import { MapFilters } from './MapFilters';
import { MapDetailPanel } from './MapDetailPanel';
import {
  getSuppliers,
  getBuyers,
  getFacilities,
  getRoutes,
  getRegions,
  getCarbonFlows,
} from '../../services/mapService';


interface MapsPageProps {
  onBack: () => void;
  onOpenMarketplace: () => void;
}

const VALID_MODES: MapMode[] = [
  'marketplace',
  'routes',
  'supply',
  'demand',
  'price',
  'carbon-flow',
];

export const MapsPage: React.FC<MapsPageProps> = ({
  onBack,
  onOpenMarketplace,
}) => {
  // Mode state with initial check from URL
  const [mode, setMode] = useState<MapMode>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode') as MapMode;
      if (urlMode && VALID_MODES.includes(urlMode)) {
        return urlMode;
      }
    } catch {
      // ignore
    }
    return 'marketplace';
  });

  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [filters, setFilters] = useState<MapFilterState>(DEFAULT_MAP_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync mode to URL query param
  const handleModeChange = (newMode: MapMode) => {
    setMode(newMode);
    setSelectedEntity(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      window.history.pushState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  // Sync URL changes (e.g. browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlMode = urlParams.get('mode') as MapMode;
        if (urlMode && VALID_MODES.includes(urlMode)) {
          setMode(urlMode);
          setSelectedEntity(null);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Data via mapService (centralized filtering) ──
  const filteredSuppliers = useMemo(() => getSuppliers(filters, searchQuery), [filters, searchQuery]);
  const filteredBuyers = useMemo(() => getBuyers(filters, searchQuery), [filters, searchQuery]);
  const filteredFacilities = useMemo(() => getFacilities(filters, searchQuery), [filters, searchQuery]);
  const filteredRoutes = useMemo(() => getRoutes(filters, searchQuery), [filters, searchQuery]);
  const filteredRegions = useMemo(() => getRegions(filters), [filters]);
  const carbonFlows = useMemo(() => getCarbonFlows(), []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EDF3F0] select-none flex flex-col font-sans">
      {/* ── Top Header ── */}
      <MapHeader
        onBack={onBack}
        onOpenMarketplace={onOpenMarketplace}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── Main Map Area ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Interactive Google Map (replaces SVG MapCanvas) */}
        <InteractiveMap
          mode={mode}
          suppliers={filteredSuppliers}
          buyers={filteredBuyers}
          facilities={filteredFacilities}
          routes={filteredRoutes}
          regions={filteredRegions}
          carbonFlowEdges={carbonFlows}
          selectedEntity={selectedEntity}
          onSelectEntity={setSelectedEntity}
        />

        {/* ── Floating Controls ── */}

        {/* Top-Left Filters Button & Popover */}
        <div className="absolute top-14 left-4 z-20">
          <MapFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_MAP_FILTERS)}
            mode={mode}
          />
        </div>

        {/* Bottom-Center Map Mode Segmented Pill */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
          <MapModeSelector
            mode={mode}
            onChange={handleModeChange}
          />
        </div>

        {/* Bottom-Left Adaptive Legend */}
        <div className="hidden sm:block absolute bottom-5 left-4 z-20">
          <MapLegend mode={mode} />
        </div>

        {/* Bottom-Right Toolbar */}
        <div className="absolute bottom-5 right-4 z-20">
          <MapToolbar
            onRecenter={() => setSelectedEntity(null)}
          />
        </div>

        {/* Floating Detail Panel (Desktop: Right sheet, Mobile: Bottom sheet) */}
        <MapDetailPanel
          selectedEntity={selectedEntity}
          onDismiss={() => setSelectedEntity(null)}
          onOpenMarketplace={onOpenMarketplace}
        />
      </div>
    </div>
  );
};

export default MapsPage;
