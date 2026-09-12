import React, { useState, useMemo } from 'react';
import { SearchBar, SortPill } from '../ui/SearchBar';
import { Pagination } from '../ui/DataDisplay';
import { EmptyState, ErrorState, Skeleton, Toast } from '../ui/Feedback';
import { FilterSidebar } from './FilterSidebar';
import { CO2ListingCard } from '../ui/CO2ListingCard';
import { RequirementCard } from './RequirementCard';
import { RequestModal } from './RequestModal';
import { useAuth } from '@clerk/clerk-react';
import { getListings, getAllRequirements } from '../../services/marketplaceApi';
import { createOrder } from '../../services/orderApi';
import type {
  MarketplaceMode,
  MarketplaceFilterState,
  SupplyListing,
  DemandRequirement
} from '../../types/marketplace';
import { X } from 'lucide-react';

interface MarketplaceViewProps {
  /** Mode: "supply" for buyers looking for CO2 supply; "demand" for suppliers looking for buyer requirements */
  mode?: MarketplaceMode;
  onModeChange?: (mode: MarketplaceMode) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  mode = 'supply',
}) => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { getToken } = useAuth();
  const [apiListings, setApiListings] = useState<SupplyListing[]>([]);
  const [apiRequirements, setApiRequirements] = useState<DemandRequirement[]>([]);

  // View state simulation
  const [viewState, setViewState] = useState<'success' | 'loading' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Removed useEffect from here, moving down

  // Selected item for RequestModal
  const [selectedSupplyListing, setSelectedSupplyListing] = useState<SupplyListing | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<DemandRequirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter State
  const initialFilters: MarketplaceFilterState = {
    searchQuery: '',
    minQuantity: 0,
    maxQuantity: 100000,
    minPurity: 90,
    minPrice: 0,
    maxPrice: 10000,
    maxDistance: 500,
    selectedApplications: [],
    availability: [],
    physicalState: 'All',
    verifiedOnly: false,
    sortBy: 'purityDesc',
  };

  const [filterState, setFilterState] = useState<MarketplaceFilterState>(initialFilters);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setViewState('loading');
        const token = await getToken();
        if (!token) return;

        // Build query params for supply listings
        const params = new URLSearchParams();
        if (filterState.minPurity > 90) params.append('min_purity', filterState.minPurity.toString());
        if (filterState.maxPrice < 10000) params.append('max_price', filterState.maxPrice.toString());
        if (filterState.minQuantity > 0) params.append('min_quantity', filterState.minQuantity.toString());
        if (filterState.maxQuantity < 100000) params.append('max_quantity', filterState.maxQuantity.toString());
        if (filterState.searchQuery) params.append('search_query', filterState.searchQuery);
        if (filterState.verifiedOnly) params.append('verified_only', 'true');
        if (filterState.sortBy) params.append('sort_by', filterState.sortBy);
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());

        const [listingsRes, reqsRes] = await Promise.all([
          getListings(token, params),
          getAllRequirements(token, params)
        ]);

        // Backend now returns { items, total, page, limit }
        const listingsItems = listingsRes.items || [];
        setTotalSupplyCount(listingsRes.total || 0);
        
        const reqsItems = reqsRes.items || [];
        setTotalDemandCount(reqsRes.total || 0);

        // Map listings to frontend model
        const mappedListings: SupplyListing[] = listingsItems.map((l: any) => ({
          id: l.id,
          companyName: (l.users?.first_name ? `${l.users.first_name} ${l.users.last_name || ''}`.trim() : 'Unknown Supplier'),
          facilityType: l.facility_name,
          location: 'Dynamic API Location',
          sourceType: 'Mixed',
          purity: l.purity_percentage,
          physicalState: l.transport_modes.includes('Pipeline') ? 'Gas' : 'Liquefied',
          availableQuantity: l.volume_tpa,
          pricePerTon: l.price_per_ton,
          distanceKm: Math.floor(Math.random() * 200),
          availabilityWindow: 'Immediate',
          isVerified: true,
        }));
        setApiListings(mappedListings);

        // Map requirements to frontend model
        const mappedReqs: DemandRequirement[] = reqsItems.map((r: any) => ({
          id: r.id,
          buyerCompanyName: (r.users?.first_name ? `${r.users.first_name} ${r.users.last_name || ''}`.trim() : 'Unknown Buyer'),
          industry: 'General Industrial',
          application: r.required_grade || r.application || 'Unknown',
          location: r.location || 'Dynamic API Location',
          minPurityRequired: r.min_purity_required || 99.0,
          quantityNeeded: r.volume_needed,
          maxPricePerTon: r.target_price,
          maxDistanceKm: 1000,
        }));
        setApiRequirements(mappedReqs);
        
        setViewState('success');
      } catch (err) {
        console.error(err);
        setViewState('error');
      }
    };
    fetchData();
  }, [getToken, filterState, currentPage]);
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.minPurity > 90) count++;
    if (filterState.minQuantity > 0 || filterState.maxQuantity < 100000) count++;
    if (filterState.minPrice > 0 || filterState.maxPrice < 10000) count++;
    if (filterState.maxDistance < 500) count++;
    if (filterState.selectedApplications.length > 0) count++;
    if (filterState.physicalState !== 'All') count++;
    if (filterState.verifiedOnly) count++;
    return count;
  }, [filterState]);

  const handleUpdateFilter = (updates: Partial<MarketplaceFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterState(initialFilters);
    setCurrentPage(1);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Supply Listings (Now handled by backend)
  const filteredSupply = useMemo(() => {
    return apiListings;
  }, [apiListings]);

  // Filtered Demand Requirements (Now handled by backend)
  const filteredDemand = useMemo(() => {
    return apiRequirements;
  }, [apiRequirements]);

  const [totalSupplyCount, setTotalSupplyCount] = useState(0);
  const [totalDemandCount, setTotalDemandCount] = useState(0);
  
  const totalResults = mode === 'supply' ? totalSupplyCount : totalDemandCount;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  // Current page slices
  const pagedSupply = useMemo(() => {
    return filteredSupply; // Already paginated from backend
  }, [filteredSupply]);

  const pagedDemand = useMemo(() => {
    return filteredDemand; // Already paginated from backend
  }, [filteredDemand]);

  const handleOpenSupplyRequest = (item: SupplyListing) => {
    setSelectedSupplyListing(item);
    setSelectedRequirement(null);
    setIsModalOpen(true);
  };

  const handleOpenDemandOffer = (item: DemandRequirement) => {
    setSelectedRequirement(item);
    setSelectedSupplyListing(null);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async (data: any) => {
    try {
      const token = await getToken();
      if (!token) return;

      if (selectedSupplyListing) {
        // Create an order for a supply listing
        const payload = {
          listing_id: selectedSupplyListing.id,
          volume: Number(data.volume),
          transport_mode: data.transportMode
        };
        await createOrder(token, payload);
        showToast(`CO₂ offtake request of ${data.volume} t dispatched to ${selectedSupplyListing.companyName}.`);
      } else if (selectedRequirement) {
        // Supply an offer to a demand requirement (Phase 6 specifies orders usually against listings, but UI allows both)
        // Note: For now we'll just mock this toast or if backend supports it, do the same.
        showToast(`Binding supply offer sent to ${selectedRequirement.buyerCompanyName}.`);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Error creating order: ' + (e.message || 'Unknown error'));
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      
      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast variant="success" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT: Sticky Filter Sidebar (Left) + Results List/Grid (Right) */}
      <div className="flex items-start gap-6 relative">
        
        {/* Desktop Collapsible & Sticky Filter Sidebar (~280px) */}
        {isFilterSidebarOpen && (
          <div className="hidden lg:block shrink-0 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar z-10 transition-all duration-300">
            <FilterSidebar
              filterState={filterState}
              onChangeFilter={handleUpdateFilter}
              onApply={() => showToast('Filters applied.')}
              onClear={handleClearFilters}
              onToggleCollapse={() => setIsFilterSidebarOpen(false)}
            />
          </div>
        )}

        {/* Mobile Slide-Out Filter Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-[var(--surface-card)] h-full p-4 overflow-y-auto shadow-2xl z-10 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span className="font-semibold text-[15px] text-[var(--text-primary)]">Filter Listings</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterSidebar
                filterState={filterState}
                onChangeFilter={handleUpdateFilter}
                onApply={() => {
                  setIsMobileDrawerOpen(false);
                  showToast('Filters applied.');
                }}
                onClear={handleClearFilters}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
                className="w-full border-0 p-0 shadow-none"
              />
            </div>
          </div>
        )}

        {/* Right Side: Results Column */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          
          {/* Top of Results: Filter Toggle + SearchBar + Sort */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Desktop Toggle Sidebar Button */}
                <button
                  type="button"
                  onClick={() => setIsFilterSidebarOpen((prev) => !prev)}
                  className={`hidden lg:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-chip)] border text-[13px] font-semibold transition-all shadow-xs shrink-0 cursor-pointer ${
                    isFilterSidebarOpen
                      ? 'border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[var(--surface-muted)]'
                      : 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white hover:opacity-90 shadow-sm'
                  }`}
                  title={isFilterSidebarOpen ? 'Collapse filter sidebar' : 'Show filter sidebar'}
                  aria-label={isFilterSidebarOpen ? 'Collapse filter sidebar' : 'Show filter sidebar'}
                >
                  <span>{isFilterSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
                  {activeFiltersCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                        isFilterSidebarOpen
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-white text-[var(--accent-primary)]'
                      }`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Mobile Drawer Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-chip)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink)] text-[13px] font-medium shrink-0 cursor-pointer"
                >
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent-primary)] text-white text-[11px] font-semibold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* SearchBar */}
                <div className="flex-1 min-w-0">
                  <SearchBar
                    value={filterState.searchQuery}
                    onChange={(val) => handleUpdateFilter({ searchQuery: val })}
                    placeholder={
                      mode === 'supply'
                        ? 'Search CO₂ suppliers, chemical plants, hubs...'
                        : 'Search buyer requirements, applications, precast yards...'
                    }
                    onClear={() => handleUpdateFilter({ searchQuery: '' })}
                  />
                </div>
              </div>

              {/* Sort Pill */}
              <div className="shrink-0 self-end sm:self-auto">
                <SortPill
                  label={
                    filterState.sortBy === 'purityDesc'
                      ? 'Purity: High to Low'
                      : filterState.sortBy === 'priceAsc'
                      ? 'Price: Low to High'
                      : filterState.sortBy === 'priceDesc'
                      ? 'Price: High to Low'
                      : filterState.sortBy === 'distanceAsc'
                      ? 'Distance: Nearest'
                      : 'Volume: Highest'
                  }
                  onClick={() => {
                    const nextSort: MarketplaceFilterState['sortBy'] =
                      filterState.sortBy === 'purityDesc'
                        ? 'priceAsc'
                        : filterState.sortBy === 'priceAsc'
                        ? 'priceDesc'
                        : filterState.sortBy === 'priceDesc'
                        ? 'distanceAsc'
                        : filterState.sortBy === 'distanceAsc'
                        ? 'quantityDesc'
                        : 'purityDesc';
                    handleUpdateFilter({ sortBy: nextSort });
                  }}
                />
              </div>
            </div>

            {/* Result count & active chips row */}
            <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary-accessible)] pt-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)] text-[13px]">
                  {totalResults} {mode === 'supply' ? 'listings' : 'buyer requirements'} found
                </span>
                {filterState.minPurity > 90 && (
                  <span className="px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] text-[11px] font-medium border border-[var(--border-subtle)]">
                    Purity ≥ {filterState.minPurity}%
                  </span>
                )}
                {filterState.verifiedOnly && (
                  <span className="px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#34C77B]/10 text-[var(--status-success)] text-[11px] font-medium border border-[var(--status-success)]/30">
                    Verified Only
                  </span>
                )}
              </div>

              <span className="type-label text-[var(--text-secondary)] hidden md:inline">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {/* Results State Rendering: Loading, Error, Empty, or Results Grid */}
          {viewState === 'loading' ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterSidebarOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-5`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] space-y-4"
                >
                  <Skeleton width="70%" height={22} />
                  <Skeleton width="45%" height={14} />
                  <Skeleton width="100%" height={56} />
                  <Skeleton width="100%" height={40} />
                  <div className="flex justify-between pt-2">
                    <Skeleton width="30%" height={32} />
                    <Skeleton width="50%" height={36} />
                  </div>
                </div>
              ))}
            </div>
          ) : viewState === 'error' ? (
            <ErrorState
              title="Unable to load marketplace data"
              description="Failed to synchronize with the regional CO2 dispatch clearing house. Please retry."
              onRetry={() => {
                setViewState('loading');
                setTimeout(() => setViewState('success'), 400);
              }}
            />
          ) : totalResults === 0 ? (
            <EmptyState
              title="No listings match your filters"
              description="Try widening your purity range or distance radius to locate available CO2 suppliers."
              ctaLabel="Clear filters"
              onCtaClick={handleClearFilters}
            />
          ) : (
            <>
              {/* Results Grid: 3-column when sidebar open, 4-column when sidebar collapsed */}
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterSidebarOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-5 transition-all duration-300`}>
                {mode === 'supply'
                  ? pagedSupply.map((listing) => (
                      <CO2ListingCard
                        key={listing.id}
                        name={listing.companyName}
                        verified={listing.isVerified}
                        sourceDescription={listing.facilityType}
                        sourceType={listing.sourceType}
                        purity={listing.purity}
                        physicalState={listing.physicalState as "Liquefied" | "Compressed" | "Gas"}
                        purityTier={
                          listing.purity >= 99 ? "Liquefaction-ready" :
                          listing.purity >= 95 ? "Pipeline-ready" :
                          listing.purity >= 90 ? "EOR-ready" : "Needs upgrade"
                        }
                        availableVolume={listing.availableQuantity}
                        spotPrice={listing.pricePerTon}
                        location={listing.location}
                        distanceKm={listing.distanceKm}
                        dispatchWindow={listing.availabilityWindow}
                        onRequest={() => handleOpenSupplyRequest(listing)}
                        onViewMap={() =>
                          alert(`Locating ${listing.companyName} at ${listing.location} on regional pipeline GIS network.`)
                        }
                      />
                    ))
                  : pagedDemand.map((req) => (
                      <RequirementCard
                        key={req.id}
                        requirement={req}
                        onSubmitOffer={handleOpenDemandOffer}
                      />
                    ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center pt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Interactive Request & Offer Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedSupplyListing}
        requirement={selectedRequirement}
        onConfirm={handleConfirmAction}
      />

    </div>
  );
};

export default MarketplaceView;
