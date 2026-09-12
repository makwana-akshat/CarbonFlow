import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DashboardState, FilterState, RecommendationItem } from '../../types/dashboard';
import { CarbonSidebar } from './CarbonSidebar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { RecommendedMatches } from '../dashboard/RecommendedMatches';
import { RecommendationDrawer } from './RecommendationDrawer';
import { ErrorState } from '../common/StateViews';
import { SettingsPage } from '../settings/SettingsPage';
import { MarketplaceView } from '../marketplace/MarketplaceView';
import { ProcurementPlansView } from '../procurement/ProcurementPlansView';
import { DashboardContent } from '../dashboard/DashboardContent';
import { MapsPage } from '../maps/MapsPage';
import { MyRequirementsView } from '../requirements/MyRequirementsView';
import { MySupplyView } from '../supply/MySupplyView';
import { LogisticsRoutePlanning } from '../logistics/LogisticsRoutePlanning';
import { Button } from '../ui/Button';
import { CheckCircle2, Menu, FolderKanban, Users, Inbox } from 'lucide-react';
import { UserMenu } from '../auth/UserMenu';
import { CarbonImpactPage } from '../impact/CarbonImpactPage';
import { AlertsPage } from '../alerts/AlertsPage';
import { AuditContractsPage } from '../contracts/AuditContractsPage';
import { AssistantWidget } from '../assistant/AssistantWidget';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../services/orderApi';
import { getRecommendations } from '../../services/recommendationsApi';
import { getSupplierInquiries, acceptInquiry } from '../../services/marketplaceApi';
import { useAppStore } from '../../store/useAppStore';

export interface CarbonFlowShellProps {
  appUser?: {
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
  } | null;
  isDemoMode?: boolean;
}

export const CarbonFlowShell: React.FC<CarbonFlowShellProps> = ({
  appUser,
  isDemoMode = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    userRole,
    setUserRole,
    setMobileSidebarOpen,
    toastMessage,
    showToast,
  } = useAppStore();

  const [dashboardState, setDashboardState] = useState<DashboardState>('success');
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  // Mutation to sync backend role when toggling top-right persona
  const { mutate: updateRole } = useMutation({
    mutationFn: async (role: string) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Failed to update role');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });

  // Fetch Supplier Inquiries
  const { data: supplierInquiries, isLoading: isLoadingInquiries } = useQuery({
    queryKey: ['supplier-inquiries'],
    queryFn: async () => {
      const token = await getToken();
      if (!token || userRole !== 'supplier') return [];
      return getSupplierInquiries(token);
    },
    enabled: userRole === 'supplier' && location.pathname === '/app/buyer-requests',
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return acceptInquiry(token, id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supplier-inquiries'] });
      showToast('Inquiry accepted! Contract drafted.');
      if (data?.contract?.id) {
        navigate(`/app/audit-contracts`);
      }
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || 'Failed to accept inquiry and draft contract.';
      showToast(msg);
      console.error(error);
    },
  });

  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  useEffect(() => {
    if (supplierInquiries) {
      setInquiriesList(supplierInquiries);
    }
  }, [supplierInquiries]);
  

  // Determine current active subpath
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath === '/app/orders' || currentPath === '/app/procurement-plans') {
      const fetchOrders = async () => {
        try {
          const token = await getToken();
          if (!token) return;
          const res = await getOrders(token);
          if (res && res.items && res.items.length > 0) {
            const mapped = res.items.map((o: any) => ({
              rawId: o.id,
              id: `ORD-${o.id.substring(0, 4).toUpperCase()}`,
              counterpartyName: (userRole === 'buyer' ? o.supplier : o.buyer)
                ? `${(userRole === 'buyer' ? o.supplier : o.buyer).first_name} ${(userRole === 'buyer' ? o.supplier : o.buyer).last_name || ''}`.trim()
                : 'Unknown Company',
              volume: `${o.volume.toLocaleString()} t`,
              mode: o.transport_mode,
              status: o.status,
              eta: o.eta ? new Date(o.eta).toLocaleDateString() : 'Active Telemetry',
              progress:
                o.status === 'delivered'
                  ? 100
                  : o.status === 'in-transit'
                  ? 70
                  : o.status === 'loading'
                  ? 40
                  : o.status === 'confirmed'
                  ? 20
                  : 0,
            }));
            setActiveOrders(mapped);
          } else {
            setActiveOrders([]);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchOrders();
    }
  }, [currentPath, getToken]);

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
      if (location.pathname !== '/app/recommendations') return;
      try {
        setDashboardState('loading');
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
            distance: r.distance || '',
            reliability: r.reliability || '',
            segment: r.segment || '',
            reasons: r.reasons || [],
            breakdown: r.breakdown,
            routeSteps: r.route_steps || [],
          }));
          setApiRecommendations(mapped);
        }
        setDashboardState('success');
      } catch (err) {
        console.error(err);
        setDashboardState('error');
      }
    };
    fetchRecs();
  }, [getToken, userRole, location.pathname]);

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

  const currentRecommendations = useMemo(() => {
    const rawList = apiRecommendations;

    return rawList
      .filter((item) => {
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
      })
      .sort((a, b) => {
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
  }, [userRole, filterState, apiRecommendations]);

  const handleOpenRecommendation = (item: RecommendationItem) => {
    setSelectedRecommendation(item);
    setIsDrawerOpen(true);
  };

  const handleConfirmOfftake = (item: RecommendationItem) => {
    setIsDrawerOpen(false);
    showToast(`Offtake agreement draft generated with ${item.companyName} for ${item.volume}`);
  };

  // Compute human-readable breadcrumb title
  const getPageTitle = () => {
    if (currentPath === '/app/my-supply') return 'My CO₂ Supply';
    if (currentPath === '/app/marketplace') return 'Marketplace';
    if (currentPath === '/app/maps') return 'Interactive Maps';
    if (currentPath === '/app/requirements') return 'My Requirements';
    if (currentPath === '/app/recommendations') return 'AI Recommendations';
    if (currentPath === '/app/procurement-plans') return 'Procurement Plans';
    if (currentPath === '/app/buyer-requests') return 'Buyer Requests';
    if (currentPath === '/app/orders') return 'Orders & Manifests';
    if (currentPath === '/app/logistics') return 'Logistics Planning';
    if (currentPath === '/app/carbon-impact') return 'Carbon Impact';
    if (currentPath === '/app/alerts') return 'Alerts & SCADA';
    if (currentPath === '/app/audit-contracts') return 'Audit Contracts';
    if (currentPath === '/app/settings') return 'Platform Settings';
    return 'Dashboard';
  };

  return (
    <div
      style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
      className="w-screen bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent-primary)] selection:text-white"
    >
      {/* Pinned Left Sidebar (Fixed 100% height, scrolls internally only if content exceeds viewport) */}
      <CarbonSidebar />

      {/* Independently Scrollable Main View Container */}
      <main
        style={{ flex: 1, overflowY: 'auto', height: '100vh' }}
        className="flex flex-col min-w-0 bg-[var(--paper)] relative"
      >
        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1 text-xs text-amber-800 flex items-center justify-between shrink-0">
            <span>
              ⚡ <strong>CarbonFlow Demo Mode:</strong> Running with local authorization. All operational routes active.
            </span>
            <span className="font-mono text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
              ACTIVE
            </span>
          </div>
        )}

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-white px-5 py-3 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border-strong)] flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Operations Header Bar (Sticky within main scroll container) */}
        <header className="sticky top-0 z-20 bg-[var(--surface-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
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
              <h1 className="text-[15px] font-semibold text-[var(--ink)]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Controls: Role Switcher & User Profile Menu */}
          <div className="flex items-center gap-4">
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-[var(--surface-elevated)] p-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={async () => {
                  setUserRole('buyer');
                  try {
                    const token = await getToken();
                    if (token) {
                      await fetch('http://localhost:8000/api/v1/users/me', {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ role: 'buyer' })
                      });
                    }
                  } catch (e) {
                    console.error('Failed to sync role to db', e);
                  }
                  showToast('Switched to Buyer Mode');
                }}
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
                onClick={async () => {
                  setUserRole('supplier');
                  try {
                    const token = await getToken();
                    if (token) {
                      await fetch('http://localhost:8000/api/v1/users/me', {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ role: 'supplier' })
                      });
                    }
                  } catch (e) {
                    console.error('Failed to sync role to db', e);
                  }
                  showToast('Switched to Supplier Mode');
                }}
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
                    {appUser.first_name
                      ? `${appUser.first_name} ${appUser.last_name || ''}`
                      : appUser.email?.split('@')[0]}
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

        {/* Routed Page Content based on currentPath */}
        {currentPath === '/app/logistics' ? (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <LogisticsRoutePlanning />
          </div>
        ) : currentPath === '/app/maps' ? (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <MapsPage
              onBack={() => navigate('/app/dashboard')}
              onOpenMarketplace={() => navigate('/app/marketplace')}
            />
          </div>
        ) : (
          <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* 1. Supplier's Own Listings */}
            {currentPath === '/app/my-supply' && <MySupplyView />}

            {/* 2. Public Marketplace */}
            {currentPath === '/app/marketplace' && (
              <MarketplaceView mode={userRole === 'supplier' ? 'demand' : 'supply'} />
            )}

            {/* 3. Buyer's Requirements */}
            {currentPath === '/app/requirements' && (
              <MyRequirementsView
                onNavigateToRecommendations={() => navigate('/app/recommendations')}
                onOpenMarketplace={() => navigate('/app/marketplace')}
              />
            )}

            {/* 4. AI Recommendations */}
            {currentPath === '/app/recommendations' && (
              <>
                <SearchAndFilterBar
                  filterState={filterState}
                  onChangeFilter={handleUpdateFilter}
                  onResetFilters={handleResetFilters}
                  totalResultsCount={currentRecommendations.length}
                />
                {dashboardState === 'error' ? (
                  <ErrorState onRetry={() => setDashboardState('success')} />
                ) : (
                  <div className="space-y-[var(--space-section)]">
                    <RecommendedMatches
                      items={currentRecommendations}
                      userRole={userRole}
                      onViewRecommendation={handleOpenRecommendation}
                      onResetFilters={handleResetFilters}
                      isLoading={dashboardState === 'loading'}
                    />
                  </div>
                )}
              </>
            )}

            {/* 5. Procurement Plans (Buyer Mode) */}
            {currentPath === '/app/procurement-plans' && (
              <ProcurementPlansView />
            )}

            {/* 6. Buyer Requests (Supplier Mode) */}
            {currentPath === '/app/buyer-requests' && (
              <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                      <h2 className="text-[18px] font-bold text-[var(--ink)]">
                        Incoming Buyer Offtake Inquiries
                      </h2>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
                      Direct inquiries and requisition matches from verified industrial consumers interested in your supply streams.
                    </p>
                  </div>
                </div>
                
                {isLoadingInquiries ? (
                  <div className="py-12 flex justify-center text-[var(--text-secondary)]">Loading buyer requests...</div>
                ) : inquiriesList.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Inbox className="w-8 h-8 text-[var(--text-secondary)] mb-3 opacity-50" />
                    <h3 className="text-[15px] font-semibold text-[var(--ink)] mb-1">No incoming buyer requests yet</h3>
                    <p className="text-[13px] text-[var(--text-secondary-accessible)]">When buyers inquire about your active listings, they will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {inquiriesList.map((inq: any) => (
                      <div key={inq.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[14px] text-[var(--ink)]">{inq.users?.company_name || 'Unknown Buyer'}</span>
                            <span className="font-mono text-[10px] text-[var(--text-secondary-accessible)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">
                              INQ-{inq.id.split('-')[0].toUpperCase()}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] ${inq.status === 'Accepted' ? 'bg-[var(--status-success)]/10 text-[var(--status-success)]' : 'bg-[#F5A623]/10 text-[var(--status-warning)]'}`}>
                              {inq.status || 'Pending Offer'}
                            </span>
                          </div>
                          <div className="text-[12px] text-[var(--text-secondary-accessible)] flex flex-wrap items-center gap-1.5">
                            <span>Target Stream: <strong className="text-[var(--ink)] font-semibold">{inq.listing_name || 'Unknown Stream'}</strong></span>
                            <span className="text-[var(--border-subtle)]">•</span>
                            <span>Volume: <strong className="text-[var(--ink)] font-semibold">{inq.volume_needed?.toLocaleString()} t</strong></span>
                            <span className="text-[var(--border-subtle)]">•</span>
                            <span>Offered: <strong className="text-[var(--accent-primary)] font-semibold">₹{inq.target_price?.toLocaleString()}/t</strong></span>
                            <span className="text-[var(--border-subtle)]">•</span>
                            <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button variant="secondary" size="sm" className="flex-1 sm:flex-none" onClick={() => showToast(`Opening chat with ${inq.users?.company_name || 'Buyer'}`)}>
                            Contact Buyer
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="flex-1 sm:flex-none" 
                            disabled={acceptMutation.isPending || inq.status === 'Accepted'} 
                            onClick={() => acceptMutation.mutate(inq.id)}
                          >
                            {acceptMutation.isPending ? 'Drafting...' : inq.status === 'Accepted' ? 'Contract Drafted' : 'Accept & Draft Contract'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 7. Active Offtake Orders */}
            {currentPath === '/app/orders' && (
              <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-[var(--accent-primary)]" />
                      <h2 className="text-[18px] font-bold text-[var(--ink)]">
                        Active Offtake Orders & Manifests
                      </h2>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
                      Continuous telemetry verification with regional pipeline trunks and logistics dispatch centers.
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-[var(--border-subtle)]">
                  {activeOrders.length > 0 ? (
                    activeOrders.map((order) => (
                      <div key={order.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[14px] text-[var(--ink)]">{order.id}</span>
                            <span className="text-[var(--text-secondary)]">•</span>
                            <span className="font-medium text-[14px] text-[var(--text-primary)]">{order.counterpartyName}</span>
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
                          onClick={() => navigate(`/app/logistics?orderId=${order.rawId}`)}
                        >
                          Track Manifest
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--surface-sunken)] flex items-center justify-center mb-4">
                        <Inbox className="w-6 h-6 text-[var(--text-secondary)]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[var(--ink)]">No Active Orders</h3>
                      <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-[300px]">
                        You don't have any active offtake orders or manifests to track right now.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. Impact & Reporting Pages */}
            {currentPath === '/app/carbon-impact' && <CarbonImpactPage />}
            {currentPath === '/app/alerts' && <AlertsPage />}
            {currentPath === '/app/audit-contracts' && <AuditContractsPage />}

            {/* 9. Platform Settings */}
            {currentPath === '/app/settings' && <SettingsPage />}

            {/* 10. Default Dashboard Overview */}
            {(currentPath === '/app/dashboard' || currentPath === '/app/overview' || currentPath === '/app' || currentPath === '/app/') && (
              <DashboardContent
                userRole={userRole}
                onOpenMarketplace={() => navigate(userRole === 'supplier' ? '/app/my-supply' : '/app/marketplace')}
                onOpenMaps={() => navigate('/app/maps')}
                dashboardState={dashboardState}
                onRetry={() => setDashboardState('success')}
              />
            )}
          </div>
        )}

        {/* AI Assistant Siri Orb Widget */}
        <AssistantWidget />

        {/* Recommendation Detail Drawer */}
        <RecommendationDrawer
          item={selectedRecommendation}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onConfirmOfftake={handleConfirmOfftake}
          topCandidates={currentRecommendations}
        />
      </main>
    </div>
  );
};

export default CarbonFlowShell;
