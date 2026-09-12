import { useState, useMemo } from 'react';
import type { UserRole, DashboardState, TabId, FilterState, RecommendationItem } from './types/dashboard';
import { RECOMMENDATIONS_DATA } from './data/mockData';
import { CarbonSidebar } from './components/shell/CarbonSidebar';
import { SearchAndFilterBar } from './components/shell/SearchAndFilterBar';
import { RecommendedMatches } from './components/dashboard/RecommendedMatches';
import { RecommendationDrawer } from './components/shell/RecommendationDrawer';
import { LoadingSkeleton, ErrorState } from './components/common/StateViews';
import { ComponentGallery } from './pages/ComponentGallery';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { DashboardContent } from './components/dashboard/DashboardContent';
import { MapsPage } from './components/maps/MapsPage';
import { MyRequirementsView } from './components/requirements/MyRequirementsView';
import { LogisticsRoutePlanning } from './components/logistics/LogisticsRoutePlanning';
import { Button } from './components/ui/Button';
import { CheckCircle2, Truck, Menu } from 'lucide-react';

export function App() {
  // Application State
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [dashboardState, setDashboardState] = useState<DashboardState>('success');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected item for slide-over drawer
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search and Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    activeChip: null,
    grade: 'all',
    source: 'all',
    verifiedOnly: false,
    sortBy: 'match',
  });

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
    const rawList = RECOMMENDATIONS_DATA[userRole] || [];

    return rawList.filter((item) => {
      // Search query filter
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

      // Active category chip filter
      if (filterState.activeChip) {
        if (filterState.activeChip === 'dac' && item.co2Source !== 'DAC') return false;
        if (filterState.activeChip === 'biogenic' && item.co2Source !== 'Biogenic') return false;
        if (filterState.activeChip === 'food-grade' && !item.co2Grade.toLowerCase().includes('food')) return false;
        if (filterState.activeChip === 'pipeline' && item.transportMode !== 'Pipeline') return false;
        if (filterState.activeChip === 'rail-tanker' && item.transportMode !== 'ISO Rail Tanker') return false;
      }

      // Dropdown grade filter
      if (filterState.grade !== 'all') {
        if (!item.co2Grade.toLowerCase().includes(filterState.grade.toLowerCase())) return false;
      }

      // Dropdown source filter
      if (filterState.source !== 'all') {
        if (item.co2Source !== filterState.source) return false;
      }

      // Verified only
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
    showToast(`Offtake agreement draft generated with ${item.companyName}. Dispatch queued.`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[var(--paper)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-white px-4 py-3 rounded-[var(--radius-chip)] shadow-xl flex items-center gap-2.5 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role-Aware Left Sidebar (Desktop Sticky + Mobile Off-Canvas Drawer) */}
      <CarbonSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={userRole}
        onChangeRole={setUserRole}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Maps Tab & Logistics Tab (Full-Bleed Viewports) vs Standard Tab Views */}
      {activeTab === 'maps' ? (
        <div className="flex-1 h-screen overflow-hidden flex flex-col min-w-0">
          <MapsPage
            onBack={() => setActiveTab('overview')}
            onOpenMarketplace={() => setActiveTab('marketplace')}
          />
        </div>
      ) : activeTab === 'logistics' ? (
        <div className="flex-1 h-screen overflow-hidden flex flex-col min-w-0 relative bg-[var(--paper)]">
          <LogisticsRoutePlanning
            onBackToOrders={() => setActiveTab('orders')}
            onRequestUpgrade={() => setActiveTab('marketplace')}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          />
        </div>
      ) : (
        <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0">
          
          {/* Mobile Top Bar (<768px only) */}
          <header className="md:hidden shrink-0 flex items-center justify-between px-4 py-3 bg-[var(--surface-card)] border-b border-[var(--border-subtle)] sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 -ml-1.5 rounded-lg text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[var(--ink)] text-white text-[11px] font-semibold flex items-center justify-center">
                  CF
                </div>
                <span className="font-semibold text-[14px] tracking-tight text-[var(--ink)]">CARBONFLOW</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] capitalize">
                {userRole}
              </span>
            </div>
          </header>

          {/* Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
            
            {/* Global Search & Filter Bar (shown on Recommendations Tab) */}
            {activeTab === 'recommendations' && (
              <SearchAndFilterBar
                filterState={filterState}
                onChangeFilter={handleUpdateFilter}
                onResetFilters={handleResetFilters}
                totalResultsCount={currentRecommendations.length}
              />
            )}

            {/* View State Rendering: Loading, Empty, Error, or Main Success View */}
            {dashboardState === 'loading' && activeTab === 'recommendations' ? (
              <LoadingSkeleton />
            ) : dashboardState === 'error' && activeTab === 'recommendations' ? (
              <ErrorState onRetry={() => setDashboardState('success')} />
            ) : (
              <>
                {/* Primary Tab Content: Refactored Dashboard Content Area */}
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

              {/* My Requirements Tab */}
              {activeTab === 'requirements' && (
                <MyRequirementsView
                  onNavigateToRecommendations={(requirementId) => {
                    setActiveTab('recommendations');
                  }}
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
                    {[
                      { id: 'ORD-8921', supplier: 'Nordic Cryo Carbon', volume: '8,500 t', mode: 'ISO Rail', status: 'In Transit', eta: 'Tomorrow 08:30', progress: 75 },
                      { id: 'ORD-8919', supplier: 'AeroCapture Synthetics', volume: '14,200 t', mode: 'Pipeline Trunk', status: 'Continuous Flow', eta: 'Active Telemetry', progress: 100 },
                      { id: 'ORD-8914', supplier: 'Veritas Carbon Terminals', volume: '22,000 t', mode: 'Marine Barge', status: 'Loading at Hub', eta: '3 days', progress: 30 }
                    ].map((order) => (
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
            </>
          )}
        </main>

        {/* Minimalist Operations Footer */}
        <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--paper)] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--text-secondary-accessible)]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--ink)]">CARBONFLOW</span>
              <span>•</span>
              <span>B2B Industrial CO₂ Infrastructure & Clearing House</span>
            </div>
            <div className="flex items-center gap-4">
              {/* State simulation triggers for testing */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[var(--text-secondary)]">State:</span>
                <button
                  onClick={() => setDashboardState('success')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${dashboardState === 'success' ? 'bg-[var(--ink)] text-white font-medium' : 'hover:text-[var(--ink)]'}`}
                >
                  Success
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

      </div>
      )}

      {/* Slide-Over Drawer for Selected Recommendation */}
      <RecommendationDrawer
        item={selectedRecommendation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onConfirmOfftake={handleConfirmOfftake}
      />

    </div>
  );
}

export default App;
