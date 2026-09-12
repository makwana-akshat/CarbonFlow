import { useState, useMemo, useEffect } from 'react';
import type { UserRole, DashboardState, TabId, FilterState, RecommendationItem } from '../../types/dashboard';
import { RECOMMENDATIONS_DATA } from '../../data/mockData';
import { CarbonSidebar } from './CarbonSidebar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { RecommendedMatches } from '../dashboard/RecommendedMatches';
import { RecommendationDrawer } from './RecommendationDrawer';
import { LoadingSkeleton, ErrorState } from '../common/StateViews';
import { ComponentGallery } from '../../pages/ComponentGallery';
import { MarketplaceView } from '../marketplace/MarketplaceView';
import { DashboardContent } from '../dashboard/DashboardContent';
import { MapsPage } from '../maps/MapsPage';
import { MyRequirementsView } from '../requirements/MyRequirementsView';
import { LogisticsRoutePlanning } from '../logistics/LogisticsRoutePlanning';
import { Button } from '../ui/Button';
import { CheckCircle2, Menu } from 'lucide-react';
import { UserMenu } from '../auth/UserMenu';
import { CarbonImpactPage } from '../impact/CarbonImpactPage';
import { AlertsPage } from '../alerts/AlertsPage';
import { AuditContractsPage } from '../contracts/AuditContractsPage';
import { AssistantWidget } from '../assistant/AssistantWidget';
import { useAuth } from '@clerk/clerk-react';
import { getActiveOrders } from '../../services/dashboardApi';
import { getRecommendations } from '../../services/recommendationsApi';

export interface CarbonFlowShellProps {
  appUser?: {
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
  } | null;
  isDemoMode?: boolean;
  initialTab?: TabId;
}

export const CarbonFlowShell: React.FC<CarbonFlowShellProps> = ({
  appUser,
  isDemoMode = false,
  initialTab = 'overview',
}) => {
  // Application State
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [dashboardState, setDashboardState] = useState<DashboardState>('success');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { getToken } = useAuth();
  const [activeOrders, setActiveOrders] = useState<any[]>([
    { id: 'ORD-8921', supplier: 'Nordic Cryo Carbon', volume: '8,500 t', mode: 'ISO Rail', status: 'In Transit', eta: 'Tomorrow 08:30', progress: 75 },
    { id: 'ORD-8919', supplier: 'AeroCapture Synthetics', volume: '14,200 t', mode: 'Pipeline Trunk', status: 'Continuous Flow', eta: 'Active Telemetry', progress: 100 },
    { id: 'ORD-8914', supplier: 'Veritas Carbon Terminals', volume: '22,000 t', mode: 'Marine Barge', status: 'Loading at Hub', eta: '3 days', progress: 30 }
  ]);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          const token = await getToken();
          if (!token) return;
          const res = await getActiveOrders(token);
          if (res && res.length > 0) {
            const mapped = res.map(o => ({
              id: `ORD-${o.id.substring(0,4).toUpperCase()}`,
              supplier: o.supplier ? `${o.supplier.first_name} ${o.supplier.last_name || ''}`.trim() : (o.buyer ? `${o.buyer.first_name} ${o.buyer.last_name || ''}`.trim() : 'Unknown'),
              volume: `${o.volume.toLocaleString()} t`,
              mode: o.transport_mode,
              status: o.status,
              eta: o.eta ? new Date(o.eta).toLocaleDateString() : 'Active Telemetry',
              progress: 50
            }));
            setActiveOrders(mapped);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchOrders();
    }
  }, [activeTab, getToken]);

  const [apiRecommendations, setApiRecommendations] = useState<RecommendationItem[]>([]);

  // Search and Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    activeChip: null,
    grade: 'all',
    source: 'all',
    verifiedOnly: false,
    sortBy: 'match',
  });

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await getRecommendations(token, userRole);
        if (data) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            companyName: r.company_name,
            facilityType: r.facility_type || '',
            location: r.location || '',
            matchScore: Number(r.match_score),
            isBestMatch: r.is_best_match,
            isVerified: r.is_verified,
            tags: r.tags || [],
            co2Grade: r.co2_grade || '',
            volume: r.volume || '',
            pricePerTon: r.price_per_ton || '',
            co2Source: r.co2_source || '',
            transportMode: r.transport_mode || '',
            purity: r.purity || '',
            deliveryTimeline: r.delivery_timeline || '',
            certification: r.certification || '',
            routeSteps: r.route_steps || []
          }));
          setApiRecommendations(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecs();
  }, [getToken, userRole]);

  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      activeChip: null,
      grade: 'all',
      source: 'all',
      verifiedOnly: false,
      sortBy: 'match',
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered & Sorted Recommendations
  const currentRecommendations = useMemo(() => {
    const rawList = apiRecommendations.length > 0 ? apiRecommendations : (RECOMMENDATIONS_DATA[userRole] || []);

    return rawList.filter((item) => {
      if (filterState.searchQuery) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesQuery =
          item.companyName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.facilityType.toLowerCase().includes(q) ||
          item.co2Grade.toLowerCase().includes(q) ||
          item.transportMode.toLowerCase().includes(q) ||
          item.purity.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filterState.activeChip) {
        if (filterState.activeChip === 'dac' && item.co2Source !== 'DAC') return false;
        if (filterState.activeChip === 'biogenic' && item.co2Source !== 'Biogenic') return false;
        if (filterState.activeChip === 'food-grade' && !item.co2Grade.toLowerCase().includes('food')) return false;
        if (filterState.activeChip === 'pipeline' && item.transportMode !== 'Pipeline') return false;
        if (filterState.activeChip === 'rail-tanker' && item.transportMode !== 'ISO Rail Tanker') return false;
      }

      if (filterState.grade !== 'all') {
        if (!item.co2Grade.toLowerCase().includes(filterState.grade.toLowerCase())) return false;
      }

      if (filterState.source !== 'all') {
        if (item.co2Source !== filterState.source) return false;
      }

      if (filterState.verifiedOnly && !item.isVerified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'match') return b.matchScore - a.matchScore;
      if (filterState.sortBy === 'priceAsc') {
        const priceA = parseFloat(a.pricePerTon.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.pricePerTon.replace(/[^0-9.]/g, ''));
        return priceA - priceB;
      }
      if (filterState.sortBy === 'priceDesc') {
        const priceA = parseFloat(a.pricePerTon.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.pricePerTon.replace(/[^0-9.]/g, ''));
        return priceB - priceA;
      }
      return 0;
    });
  }, [userRole, filterState]);

  const handleOpenRecommendation = (item: RecommendationItem) => {
    setSelectedRecommendation(item);
    setIsDrawerOpen(true);
  };

  const handleConfirmOfftake = (item: RecommendationItem) => {
    setIsDrawerOpen(false);
    showToast(`Offtake agreement draft generated with ${item.companyName} for ${item.volume}`);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col font-sans selection:bg-[var(--accent-primary)] selection:text-white">
      {/* Demo Mode Notice Banner if running without active Clerk key */}
      {isDemoMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between">
          <span>⚡ <strong>CarbonFlow Demo Mode:</strong> Running with local mock authorization. All operational tabs are interactive.</span>
          <span className="font-mono text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">DEMO ACTIVE</span>
        </div>
      )}

      {/* Floating Global Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-white px-5 py-3 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border-strong)] flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Operational Sidebar */}
        <CarbonSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          userRole={userRole}
          onChangeRole={setUserRole}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary Content Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[var(--paper)]">
          {/* Top Operations Header Bar */}
          <header className="sticky top-0 z-20 bg-[var(--surface-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb / Title Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono tracking-widest text-[var(--accent-primary)] uppercase font-semibold">
                  OPERATIONS
                </span>
                <span className="text-[var(--text-secondary)]">/</span>
                <h1 className="text-[15px] font-semibold text-[var(--ink)] capitalize">
                  {activeTab === 'ui-gallery' 
                    ? 'UI Kit Gallery' 
                    : activeTab === 'carbon-impact' 
                      ? 'Carbon Impact' 
                      : activeTab === 'alerts' 
                        ? 'Alerts & SCADA' 
                        : activeTab === 'audit-contracts' 
                          ? 'Audit Contracts' 
                          : activeTab}
                </h1>
              </div>
            </div>

            {/* Right Controls: Role Switcher & User Profile Menu */}
            <div className="flex items-center gap-4">
              {/* Role Switcher Pill */}
              <div className="flex items-center bg-[var(--surface-elevated)] p-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setUserRole('buyer')}
                  className={`px-3 py-1 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors ${
                    userRole === 'buyer'
                      ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm font-semibold'
                      : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                  }`}
                >
                  Buyer Mode
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('supplier')}
                  className={`px-3 py-1 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors ${
                    userRole === 'supplier'
                      ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm font-semibold'
                      : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                  }`}
                >
                  Supplier Mode
                </button>
              </div>

              {/* User Profile / Clerk Menu */}
              <div className="flex items-center gap-3 pl-2 border-l border-[var(--border-subtle)]">
                {appUser && (
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-[var(--ink)]">
                      {appUser.first_name ? `${appUser.first_name} ${appUser.last_name || ''}` : appUser.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary-accessible)] font-mono">
                      {appUser.role || userRole}
                    </span>
                  </div>
                )}
                {!isDemoMode && <UserMenu />}
              </div>
            </div>
          </header>

          {/* Full-bleed views (Maps & Logistics) vs Boxed document views */}
          {activeTab === 'logistics' ? (
            <main className="flex-1 flex flex-col min-h-0 relative">
              <LogisticsRoutePlanning />
            </main>
          ) : activeTab === 'maps' ? (
            <main className="flex-1 flex flex-col min-h-0 relative">
              <MapsPage
                onBack={() => setActiveTab('overview')}
                onOpenMarketplace={() => setActiveTab('marketplace')}
              />
            </main>
          ) : (
            <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Recommendations Search & Filter Bar */}
              {activeTab === 'recommendations' && (
                <SearchAndFilterBar
                  filterState={filterState}
                  onChangeFilter={handleUpdateFilter}
                  onResetFilters={handleResetFilters}
                  totalResultsCount={currentRecommendations.length}
                />
              )}

              {/* Loading & Error States */}
              {dashboardState === 'loading' && activeTab === 'recommendations' ? (
                <LoadingSkeleton />
              ) : dashboardState === 'error' && activeTab === 'recommendations' ? (
                <ErrorState onRetry={() => setDashboardState('success')} />
              ) : (
                <>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <DashboardContent
                      userRole={userRole}
                      onOpenMarketplace={() => setActiveTab('marketplace')}
                      onOpenMaps={() => setActiveTab('maps')}
                      dashboardState={dashboardState}
                      onRetry={() => setDashboardState('success')}
                    />
                  )}

                  {/* Marketplace Tab */}
                  {activeTab === 'marketplace' && (
                    <MarketplaceView mode={userRole === 'supplier' ? 'demand' : 'supply'} />
                  )}

                  {/* Requirements Tab */}
                  {activeTab === 'requirements' && (
                    <MyRequirementsView
                      onNavigateToRecommendations={() => setActiveTab('recommendations')}
                      onOpenMarketplace={() => setActiveTab('marketplace')}
                    />
                  )}

                  {/* Recommendations Tab */}
                  {activeTab === 'recommendations' && (
                    <div className="space-y-[var(--space-section)]">
                      <RecommendedMatches
                        items={currentRecommendations}
                        userRole={userRole}
                        onViewRecommendation={handleOpenRecommendation}
                      />
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="type-heading text-[var(--ink)]">
                            Active Offtake Orders & Manifests
                          </h2>
                          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
                            Continuous telemetry verification with regional pipeline trunks and logistics hubs.
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-[var(--border-subtle)]">
                        {activeOrders.map((order) => (
                          <div key={order.id} className="py-[var(--space-row)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[14px] text-[var(--ink)]">{order.id}</span>
                                <span className="text-[var(--text-secondary)]">•</span>
                                <span className="font-medium text-[14px] text-[var(--text-primary)]">{order.supplier}</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#34C77B]/10 text-[var(--status-success)]">
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-[12px] text-[var(--text-secondary-accessible)]">
                                Volume: <strong>{order.volume}</strong> | Method: {order.mode} | Expected: {order.eta}
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setActiveTab('logistics')}
                            >
                              Track Manifest
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UI Kit Gallery Tab */}
                  {activeTab === 'ui-gallery' && (
                    <ComponentGallery />
                  )}

                  {/* Carbon Impact Tab */}
                  {activeTab === 'carbon-impact' && (
                    <CarbonImpactPage />
                  )}

                  {/* Alerts & SCADA Tab */}
                  {activeTab === 'alerts' && (
                    <AlertsPage />
                  )}

                  {/* Audit Contracts Tab */}
                  {activeTab === 'audit-contracts' && (
                    <AuditContractsPage />
                  )}
                </>
              )}
            </main>
          )}

          {/* Minimalist Operations Footer (on non-fullbleed tabs) */}
          {activeTab !== 'logistics' && activeTab !== 'maps' && (
            <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--paper)] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
              <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--text-secondary-accessible)]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--ink)]">CARBONFLOW</span>
                  <span>•</span>
                  <span>B2B Industrial CO₂ Infrastructure & Clearing House</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[var(--text-secondary)]">Simulate:</span>
                    <button
                      onClick={() => setDashboardState('success')}
                      className={`px-1.5 py-0.5 rounded transition-colors ${dashboardState === 'success' ? 'bg-[var(--ink)] text-white font-medium' : 'hover:text-[var(--ink)]'}`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setDashboardState('loading')}
                      className={`px-1.5 py-0.5 rounded transition-colors ${dashboardState === 'loading' ? 'bg-[var(--ink)] text-white font-medium' : 'hover:text-[var(--ink)]'}`}
                    >
                      Loading
                    </button>
                    <button
                      onClick={() => setDashboardState('error')}
                      className={`px-1.5 py-0.5 rounded transition-colors ${dashboardState === 'error' ? 'bg-[var(--ink)] text-white font-medium' : 'hover:text-[var(--ink)]'}`}
                    >
                      Error
                    </button>
                  </div>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[var(--status-success)] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                    All Hubs Operational
                  </span>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Slide-Over Drawer for Selected Recommendation */}
      <RecommendationDrawer
        item={selectedRecommendation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onConfirmOfftake={handleConfirmOfftake}
      />

      {/* Global AI Assistant Siri Orb & Voice-Enabled Chat Widget */}
      <AssistantWidget activeTab={activeTab} />
    </div>
  );
};
