import React, { useState, useMemo, useEffect } from 'react';
import type { Shipment, TransportModeId } from './types';
import { SAMPLE_SHIPMENTS, getEligibleModes, getRouteOptionsForMode } from './mockShipments';
import { LogisticsMap } from './LogisticsMap';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { calculateRoute, fetchShipment } from '../../services/logisticsApi';
import { ModeSelectorPanel } from './ModeSelectorPanel';
import { RouteOptionsPanel } from './RouteOptionsPanel';
import { BigStatReadouts } from './BigStatReadouts';
import { WarningPanel, type WarningItem } from './WarningPanel';
import { StatusStepper } from './StatusStepper';
import { GlassPanel } from './GlassPanel';
import {
  ArrowLeft,
  AlertOctagon,
  Sparkles,
  ChevronDown,
  Menu,
  Truck,
  Milestone,
  TriangleAlert,
  Activity,
  MapPin,
  Radio,
} from 'lucide-react';

interface LogisticsRoutePlanningProps {
  initialShipment?: Shipment;
  onBackToOrders?: () => void;
  onRequestUpgrade?: () => void;
  onOpenMobileMenu?: () => void;
  className?: string;
}

export const LogisticsRoutePlanning: React.FC<LogisticsRoutePlanningProps> = ({
  onBackToOrders,
  onRequestUpgrade,
  onOpenMobileMenu,
  className = '',
}) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getToken } = useAuth();

  // Fetch real shipment data from backend using orderId
  const { data: currentShipment, isLoading: isLoadingShipment, error: shipmentError } = useQuery({
    queryKey: ['shipment', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('No order ID provided');
      const token = await getToken();
      return fetchShipment(token, orderId);
    },
    enabled: !!orderId,
  });

  // Mode eligibility calculations based on shipment specs
  const eligibleModes = useMemo(() => {
    return currentShipment ? getEligibleModes(currentShipment) : [];
  }, [currentShipment]);

  // Selected mode state (defaults to recommended eligible mode)
  const defaultModeId = useMemo(() => {
    const rec = eligibleModes.find((m) => m.isRecommended && m.isEligible);
    return rec ? rec.modeId : eligibleModes.find((m) => m.isEligible)?.modeId || 'onsite';
  }, [eligibleModes]);

  const [selectedModeId, setSelectedModeId] = useState<TransportModeId>(defaultModeId);

  // Floating Panels Collapsed States (persists across re-renders for the session, resets on new shipment)
  const [isModeCollapsed, setIsModeCollapsed] = useState(false);
  const [isRouteCollapsed, setIsRouteCollapsed] = useState(false);
  const [isAdvisoryCollapsed, setIsAdvisoryCollapsed] = useState(false);
  const [isKpiCollapsed, setIsKpiCollapsed] = useState(false);

  // Resets to expanded by default each time a new shipment is loaded per spec
  useEffect(() => {
    if (currentShipment?.id) {
      setIsModeCollapsed(false);
      setIsRouteCollapsed(false);
      setIsAdvisoryCollapsed(false);
      setIsKpiCollapsed(false);
    }
  }, [currentShipment?.id]);

  // Sync selectedModeId when shipment changes
  useEffect(() => {
    if (defaultModeId) setSelectedModeId(defaultModeId);
  }, [defaultModeId]);

  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        if (!currentShipment) return;
        const token = await getToken();
        if (!token) return;
        const opts = await calculateRoute(
          token,
          currentShipment.emitterLocation.city,
          currentShipment.buyerLocation.city,
          currentShipment.volume,
          currentShipment.purity
        );
        if (Array.isArray(opts)) {
          const filtered = opts.filter((o) => o && o.modeId === selectedModeId);
          setAvailableRoutes(filtered.length > 0 ? filtered : opts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoutes();
  }, [currentShipment, selectedModeId, getToken]);

  const defaultRoutes = useMemo(() => {
    return currentShipment ? getRouteOptionsForMode(currentShipment, selectedModeId) : [];
  }, [currentShipment, selectedModeId]);

  const effectiveRoutes = availableRoutes.length > 0 ? availableRoutes : defaultRoutes;

  // Selected route state (defaults to recommended route)
  const [selectedRouteId, setSelectedRouteId] = useState<string>(effectiveRoutes[0]?.id || '');

  // Sync selected route when available routes change
  useEffect(() => {
    const recommended = effectiveRoutes.find((r) => r.isRecommended);
    setSelectedRouteId(recommended ? recommended.id : effectiveRoutes[0]?.id || '');
  }, [effectiveRoutes]);

  const activeRoute = effectiveRoutes.find((r) => r.id === selectedRouteId) || effectiveRoutes[0] || defaultRoutes[0];

  // Dynamic corridor warnings
  const activeWarnings: WarningItem[] = useMemo(() => {
    const list: WarningItem[] = [];

    if (currentShipment && currentShipment.purity < 97.0) {
      list.push({
        id: 'warn-purity-fallback',
        type: 'warning',
        headline: 'Sub-Spec Assay Fallback Active',
        detail: `Shipment purity is ${currentShipment.purity}% (pipeline trunk requires 97%+, cryogenic truck requires >99%). On-site direct route utilized.`,
      });
    }

    if (currentShipment?.status === 'in-transit' && activeRoute?.id === 'ROUTE-A') {
      list.push({
        id: 'warn-express-corridor',
        type: 'warning',
        headline: 'Corridor Advisory: NH-48 Express',
        detail: 'Heavy industrial traffic clearance in Vadodara Ring. Dedicated green-channel toll clearance authorized.',
      });
    }

    return list;
  }, [currentShipment, activeRoute]);

  // Live Status Dot
  const renderLiveStatusDot = (status: Shipment['status']) => {
    const isOnline = status === 'in-transit';
    return (
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-[#34C77B]' : 'bg-[#F5A623]'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-[#34C77B]' : 'bg-[#F5A623]'
          }`}
        />
      </span>
    );
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col bg-[#F7F8F7] text-[var(--ink)] font-sans overflow-hidden select-none ${className}`}
    >
      {/* ========================================================================= */}
      {/* 1. EDGE STATES: SKELETON LOADING OR UNVIABLE ROUTE ======================= */}
      {/* ========================================================================= */}
      {isLoadingShipment ? (
        <div className="flex-1 w-full p-6 flex flex-col gap-4 animate-pulse z-20">
          <div className="flex-1 w-full rounded-2xl bg-gray-200 border border-gray-300 relative overflow-hidden" />
          <div className="text-center text-[12px] text-gray-500">
            Connecting real-time geospatial telemetry nodes...
          </div>
        </div>
      ) : !currentShipment || shipmentError ? (
        <div className="flex-1 w-full flex items-center justify-center p-6 z-20">
          <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">
              {shipmentError ? "Logistics Node Offline" : "No Active Route Context"}
            </h3>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              {shipmentError 
                ? "Failed to authenticate or fetch live telemetry context for this shipment ID. Please ensure your permissions are elevated."
                : "No active shipment or tracking order was provided in the context matrix. Please select an active order from your centralized dashboard to route."
              }
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onBackToOrders}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-primary)] text-white font-semibold text-[13px] hover:bg-[var(--accent-primary)]/90 transition-all shadow-md cursor-pointer"
              >
                Return to Active Orders
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {/* ========================================================================= */}
          {/* 2. DESKTOP VIEWPORT (lg: and above) — FULL-BLEED MAP + FLOATING PANELS     */}
          {/* ========================================================================= */}
          <div className="hidden lg:block absolute inset-0 z-0">
            {/* Background Layer: Real Google Map (fills entire content area edge-to-edge) */}
            <LogisticsMap
              shipment={currentShipment}
              activeRoute={activeRoute}
              allRoutes={effectiveRoutes}
              onSelectRoute={setSelectedRouteId}
              className="w-full h-full"
            />

            {/* Floating Layer: Absolute Positioned Cards with Light Theme Float Styles */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              {/* ───────────────────────────────────────────────────────────────── */}
              {/* 1. FLOATING ROUTE-INFO BAR (Docked Top over Map, starts at left-[118px] */}
              {/*    leaving Google's Map/Satellite toggle completely unobstructed)  */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <div
                className="absolute top-3 left-[118px] right-4 z-10 flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl pointer-events-auto"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}
              >
                {/* Left: Orders Back Link & Shipment ID Pill */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onBackToOrders || (() => window.history.back())}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                    title="Return to active orders & procurement manifests"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Orders</span>
                  </button>

                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-gray-200 bg-white text-[12px] shadow-2xs">
                    {renderLiveStatusDot(currentShipment.status)}
                    <span className="font-mono font-bold text-gray-900 text-[12px]">
                      {currentShipment.id}
                    </span>
                  </div>
                </div>

                {/* Center: Origin → Destination & Route Name */}
                <div className="flex items-center gap-2 min-w-0 mx-2">
                  <div className="w-6 h-6 rounded-lg bg-[#F4611E]/10 border border-[#F4611E]/20 flex items-center justify-center text-[#F4611E] shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-baseline gap-2 truncate">
                    <span className="text-[12.5px] font-bold text-gray-900 truncate">
                      {currentShipment.emitterLocation.city} ({currentShipment.emitterLocation.name}) → {currentShipment.buyerLocation.city} ({currentShipment.buyerLocation.name})
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[12px] font-semibold text-[#F4611E] truncate">
                      {activeRoute?.name || 'Standard Route'}
                    </span>
                  </div>
                </div>

                {/* Right: GPS Carrier Locked & Live Telemetry Badges + Scenario Switcher */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="hidden sm:inline">GPS CARRIER LOCKED</span>
                  </div>
                  <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-600">
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                    <span>Live Telemetry</span>
                  </div>

                  {/* Evaluator Scenario Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-gray-600 transition-colors shadow-2xs cursor-pointer"
                      title="Test different shipment scenarios"
                    >
                      <Sparkles className="w-3 h-3 text-[#F4611E]" />
                      <span className="hidden sm:inline">{currentShipment.purity}%</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    {isScenarioDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl border border-gray-200 bg-white shadow-xl p-1.5 z-50 flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">
                          Preset Shipments
                        </span>
                        {SAMPLE_SHIPMENTS.map((s, idx) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedScenarioIndex(idx);
                              setForcedState('normal');
                              setIsScenarioDropdownOpen(false);
                            }}
                            className={`text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                              selectedScenarioIndex === idx && forcedState === 'normal'
                                ? 'bg-[#FFF7ED] text-[#F4611E] font-semibold border border-[#F4611E]/30'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-bold text-[11px]">{s.id}</div>
                            <div className="text-[10px] text-gray-500">
                              {s.purity}% Purity • {s.physicalState} ({s.volume}t)
                            </div>
                          </button>
                        ))}
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => {
                            setForcedState('no-route');
                            setIsScenarioDropdownOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                            (forcedState as string) === 'no-route'
                              ? 'bg-[#FFF7ED] text-[#F4611E] font-semibold'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          Unviable Route State
                        </button>
                        <button
                          onClick={() => {
                            setForcedState('loading');
                            setIsScenarioDropdownOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                            (forcedState as string) === 'loading'
                              ? 'bg-[#FFF7ED] text-[#F4611E] font-semibold'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          Skeleton Loading
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* 2. TRANSPORT MODE PANEL (Floating Left, Collapsible to Truck Icon)  */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <div className="absolute top-[60px] left-4 z-10 w-[300px] xl:w-[325px] max-h-[calc(100vh-270px)] overflow-y-auto pointer-events-auto no-scrollbar">
                <GlassPanel
                  title="Transport Mode"
                  subtitle="Routing Engine"
                  collapsedIcon={<Truck className="w-5 h-5 text-[#F4611E]" />}
                  collapsedPosition="left"
                  isCollapsed={isModeCollapsed}
                  onToggleCollapse={setIsModeCollapsed}
                  className="w-full"
                >
                  <ModeSelectorPanel
                    modes={eligibleModes}
                    selectedModeId={selectedModeId}
                    onSelectMode={setSelectedModeId}
                    hideHeader={true}
                  />
                </GlassPanel>
              </div>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* 3. RIGHT COLUMN: CORRIDOR ADVISORY (Compact) STACKED ABOVE        */}
              {/*    ROUTE OPTIONS PANEL (Both Collapsible with Distinct Icons)     */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <div className="absolute top-[60px] right-4 z-10 w-[310px] xl:w-[335px] flex flex-col gap-2.5 pointer-events-none">
                {/* 3A. Compact Corridor Advisory Alert (Single/Two-line banner) */}
                {activeWarnings.length > 0 && (
                  <GlassPanel
                    title="Corridor Advisory"
                    subtitle="Active Advisory"
                    collapsedIcon={<TriangleAlert className="w-5 h-5 text-[#D97706]" />}
                    collapsedPosition="top-right"
                    hasWarningBadge={activeWarnings.length > 0}
                    isCollapsed={isAdvisoryCollapsed}
                    onToggleCollapse={setIsAdvisoryCollapsed}
                    className="w-full pointer-events-auto"
                  >
                    <WarningPanel warnings={activeWarnings} />
                  </GlassPanel>
                )}

                {/* 3B. Route Options Panel (Stacked Vertically A/B/C) */}
                <GlassPanel
                  title="Route Options"
                  subtitle="Routing Matrix"
                  badge={
                    <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">
                      {effectiveRoutes.length} Corridors
                    </span>
                  }
                  collapsedIcon={<Milestone className="w-5 h-5 text-[#F4611E]" />}
                  collapsedPosition="right"
                  isCollapsed={isRouteCollapsed}
                  onToggleCollapse={setIsRouteCollapsed}
                  className="w-full pointer-events-auto max-h-[calc(100vh-230px)] overflow-y-auto no-scrollbar"
                >
                  <RouteOptionsPanel
                    routes={effectiveRoutes}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={setSelectedRouteId}
                    hideHeader={true}
                  />
                </GlassPanel>
              </div>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* 4. COMPACT 2x2 KPI BLOCK + STEPPER (Floating Bottom-Left Corner)  */}
              {/*    Leaves Bottom-Right Corner completely open for Zoom Controls    */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <div className="absolute bottom-4 left-4 z-10 w-[300px] xl:w-[325px] pointer-events-auto">
                <GlassPanel
                  title="Corridor Metrics"
                  subtitle="Telemetry & Footprint"
                  collapsedIcon={<Activity className="w-5 h-5 text-[#F4611E]" />}
                  collapsedPosition="left"
                  isCollapsed={isKpiCollapsed}
                  onToggleCollapse={setIsKpiCollapsed}
                  className="w-full"
                >
                  <div className="flex flex-col gap-2.5">
                    {/* Compact 2x2 Grid */}
                    <BigStatReadouts route={activeRoute} shipment={currentShipment} />

                    {/* Small Horizontal Stepper Directly Beneath 2x2 KPI Block */}
                    <div className="pt-2 border-t border-gray-100">
                      <StatusStepper currentStatus={currentShipment.status} />
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. MOBILE & TABLET STACKED VIEW (< lg) — CLEAN VERTICAL SCROLLING         */}
          {/* ========================================================================= */}
          <div className="lg:hidden flex-1 w-full h-full overflow-y-auto p-3.5 space-y-3.5">
            {/* Mobile Top Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-gray-200 bg-white shadow-2xs">
              <div className="flex items-center gap-2">
                {onOpenMobileMenu && (
                  <button
                    onClick={onOpenMobileMenu}
                    className="p-1 -ml-0.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Open sidebar menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onBackToOrders || (() => window.history.back())}
                  className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Orders</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                {renderLiveStatusDot(currentShipment.status)}
                <span className="font-mono font-bold text-gray-900">{currentShipment.id}</span>
              </div>
            </div>

            {/* Contained Map */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <LogisticsMap
                shipment={currentShipment}
                activeRoute={activeRoute}
                allRoutes={effectiveRoutes}
                onSelectRoute={setSelectedRouteId}
                className="w-full h-full"
              />
            </div>

            {/* Corridor Advisory Alert */}
            {activeWarnings.length > 0 && (
              <WarningPanel warnings={activeWarnings} />
            )}

            {/* Transport Mode */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm">
              <ModeSelectorPanel
                modes={eligibleModes}
                selectedModeId={selectedModeId}
                onSelectMode={setSelectedModeId}
              />
            </div>

            {/* Route Options */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm">
              <RouteOptionsPanel
                routes={effectiveRoutes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
              />
            </div>

            {/* 2x2 KPI Block + Stepper */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm flex flex-col gap-3 pb-8">
              <BigStatReadouts route={activeRoute} shipment={currentShipment} />
              <div className="pt-2 border-t border-gray-100">
                <StatusStepper currentStatus={currentShipment.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
