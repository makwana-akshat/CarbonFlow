import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type {
  MapMode,
  SelectedEntity,
  MapFilterState,
  SupplierNode,
  BuyerNode,
  FacilityNode,
  RouteData,
  CarbonFlowEdge,
  RegionData,
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
  fetchSuppliers,
  fetchBuyers,
  fetchFacilities,
  fetchRoutes,
  fetchCarbonFlows,
  getSuppliers,
  getBuyers,
  getFacilities,
  getRoutes,
  getRegions,
  getCarbonFlows,
  fetchRegions,
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
  const { getToken } = useAuth();
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

  // Raw data state
  const [rawSuppliers, setRawSuppliers] = useState<SupplierNode[]>([]);
  const [rawBuyers, setRawBuyers] = useState<BuyerNode[]>([]);
  const [rawFacilities, setRawFacilities] = useState<FacilityNode[]>([]);
  const [rawRoutes, setRawRoutes] = useState<RouteData[]>([]);
  const [rawFlows, setRawFlows] = useState<CarbonFlowEdge[]>([]);
  const [rawRegions, setRawRegions] = useState<RegionData[]>([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const token = await getToken();
      const [supps, byrs, facs, rts, flws, regs] = await Promise.all([
        fetchSuppliers(token),
        fetchBuyers(token),
        fetchFacilities(token),
        fetchRoutes(token),
        fetchCarbonFlows(token),
        fetchRegions(token)
      ]);
      if (active) {
        setRawSuppliers(supps);
        setRawBuyers(byrs);
        setRawFacilities(facs);
        setRawRoutes(rts);
        setRawFlows(flws);
        setRawRegions(regs);
      }
    };
    loadData();
    return () => { active = false; };
  }, [getToken]);

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
  const filteredSuppliers = useMemo(() => getSuppliers(rawSuppliers, filters, searchQuery), [rawSuppliers, filters, searchQuery]);
  const filteredBuyers = useMemo(() => getBuyers(rawBuyers, filters, searchQuery), [rawBuyers, filters, searchQuery]);
  const filteredFacilities = useMemo(() => getFacilities(rawFacilities, filters, searchQuery), [rawFacilities, filters, searchQuery]);
  const filteredRoutes = useMemo(() => getRoutes(rawRoutes, filters, searchQuery), [rawRoutes, filters, searchQuery]);
  const filteredRegions = useMemo(() => getRegions(rawRegions, filters), [rawRegions, filters]);
  const carbonFlows = useMemo(() => getCarbonFlows(rawFlows), [rawFlows]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EDF3F0] select-none flex flex-col font-sans">
      <MapHeader
        onBack={onBack}
        onOpenMarketplace={onOpenMarketplace}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative flex-1 w-full h-full overflow-hidden">
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

        <div className="absolute top-14 left-4 z-20">
          <MapFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_MAP_FILTERS)}
            mode={mode}
          />
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
          <MapModeSelector
            mode={mode}
            onChange={handleModeChange}
          />
        </div>

        <div className="hidden sm:block absolute bottom-5 left-4 z-20">
          <MapLegend mode={mode} />
        </div>

        <div className="absolute bottom-5 right-4 z-20">
          <MapToolbar
            onRecenter={() => setSelectedEntity(null)}
          />
        </div>

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
