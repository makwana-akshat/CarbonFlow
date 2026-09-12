import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Table, type Column } from '../ui/DataDisplay';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState, Toast } from '../ui/Feedback';
import { PillTabNav, type PillTab } from '../ui/Navigation';
import { Modal, Dropdown, type DropdownItem } from '../ui/Overlays';
import { MoreVertical, Calendar, MapPin, Gauge } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getMyRequirements, createRequirement, updateRequirement, deleteRequirement } from '../../services/marketplaceApi';

export interface BuyerRequirementItem {
  id: string;
  title: string;
  volumeTonnes: number;
  minPurity: number;
  location: string;
  application: string;
  maxPricePerTon: number;
  status: 'draft' | 'awaiting_matches' | 'matched' | 'closed';
  matchesCount: number;
  postedDate: string;
  requiredByDate: string;
  deliveryMethod: string;
  notes?: string;
}

interface MyRequirementsViewProps {
  onNavigateToRecommendations: (requirementId?: string) => void;
  onOpenMarketplace?: () => void;
}

export const MyRequirementsView: React.FC<MyRequirementsViewProps> = ({
  onNavigateToRecommendations,
  onOpenMarketplace: _onOpenMarketplace,
}) => {
  const [requirements, setRequirements] = useState<BuyerRequirementItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { getToken } = useAuth();
  
  const [_isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;
      const reqs = await getMyRequirements(token);
      
      const mapped: BuyerRequirementItem[] = reqs.map((r: any) => ({
        id: r.id,
        title: r.title || `${r.application || 'Industrial'} Requirement`,
        volumeTonnes: r.volume_needed || 0,
        minPurity: r.min_purity_required || 99.0,
        location: r.location || 'Dynamic API Location',
        application: r.application || 'General Industrial',
        maxPricePerTon: r.target_price || 0,
        status: (r.status === 'active' || r.status === 'awaiting_matches' ? 'awaiting_matches' : 
                 r.status === 'cancelled' ? 'closed' : r.status) as any,
        matchesCount: Math.floor(Math.random() * 3), // Still mocked for now (Phase 8 handles matches)
        postedDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Today',
        requiredByDate: r.required_by_date || 'Next Month',
        deliveryMethod: r.delivery_method || 'API Delivery',
      })).filter(r => r.status !== 'closed'); // Hide closed for now, or keep them if you want
      
      setRequirements(mapped);
    } catch (err) {
      console.error(err);
      showToast('Error loading requirements.');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // New Requirement Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVolume, setNewVolume] = useState('');
  const [newPurity, setNewPurity] = useState('98.0');
  const [newLocation, setNewLocation] = useState('Ahmedabad, Gujarat');
  const [newApplication, setNewApplication] = useState('Building Materials');
  const [newPrice, setNewPrice] = useState('4800');
  const [newRequiredDate, setNewRequiredDate] = useState('Aug 15, 2026');
  const [newDelivery] = useState('Cryogenic Truck');

  // Detail Modal state
  const [selectedRequirement, setSelectedRequirement] = useState<BuyerRequirementItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Filter tabs with dynamic counts
  const statusTabs: PillTab[] = useMemo(() => {
    const counts = {
      all: requirements.length,
      draft: requirements.filter((r) => r.status === 'draft').length,
      awaiting_matches: requirements.filter((r) => r.status === 'awaiting_matches').length,
      matched: requirements.filter((r) => r.status === 'matched').length,
      closed: requirements.filter((r) => r.status === 'closed').length,
    };

    return [
      { id: 'all', label: `All (${counts.all})` },
      { id: 'draft', label: `Draft (${counts.draft})` },
      { id: 'awaiting_matches', label: `Awaiting matches (${counts.awaiting_matches})` },
      { id: 'matched', label: `Matched (${counts.matched})` },
      { id: 'closed', label: `Closed (${counts.closed})` },
    ];
  }, [requirements]);

  const filteredRequirements = useMemo(() => {
    if (statusFilter === 'all') return requirements;
    return requirements.filter((r) => r.status === statusFilter);
  }, [requirements, statusFilter]);

  // Actions handlers
  const handleActionSelect = async (req: BuyerRequirementItem, actionId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      switch (actionId) {
        case 'publish':
          await updateRequirement(token, req.id, { status: 'active' });
          await fetchData();
          showToast(`Published "${req.title}". Match engine active.`);
          break;
        case 'pause':
          await updateRequirement(token, req.id, { status: 'draft' });
          await fetchData();
          showToast(`Paused matching for "${req.title}".`);
          break;
        case 'close':
          await updateRequirement(token, req.id, { status: 'cancelled' });
          await fetchData();
          showToast(`Closed requirement "${req.title}".`);
          break;
        case 'reopen':
          await updateRequirement(token, req.id, { status: 'active' });
          await fetchData();
          showToast(`Reopened "${req.title}".`);
          break;
        case 'edit':
          setSelectedRequirement(req);
          break;
        case 'view_matches':
          onNavigateToRecommendations(req.id);
          break;
        case 'delete':
          await deleteRequirement(token, req.id);
          await fetchData();
          showToast(`Deleted "${req.title}".`);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
      showToast('Action failed.');
    }
  };

  const getDropdownItems = (req: BuyerRequirementItem): DropdownItem[] => {
    switch (req.status) {
      case 'draft':
        return [
          { id: 'publish', label: 'Publish' },
          { id: 'edit', label: 'Edit' },
          { id: 'delete', label: 'Delete', danger: true },
        ];
      case 'awaiting_matches':
        return [
          { id: 'edit', label: 'Edit' },
          { id: 'pause', label: 'Pause' },
          { id: 'close', label: 'Close' },
        ];
      case 'matched':
        return [
          { id: 'view_matches', label: 'View Matches' },
          { id: 'edit', label: 'Edit' },
          { id: 'pause', label: 'Pause' },
          { id: 'close', label: 'Close' },
        ];
      case 'closed':
        return [
          { id: 'reopen', label: 'Reopen' },
          { id: 'edit', label: 'Edit' },
          { id: 'delete', label: 'Delete', danger: true },
        ];
      default:
        return [];
    }
  };

  const handleCreateRequirement = async (targetStatus: 'draft' | 'awaiting_matches') => {
    if (!newTitle.trim()) {
      showToast('Please enter a requirement name.');
      return;
    }
    
    try {
      const token = await getToken();
      if (!token) return;

      const payload = {
        title: newTitle.trim(),
        volume_needed: Number(newVolume) || 500,
        min_purity_required: Number(newPurity) || 98.0,
        location: newLocation || 'Gujarat',
        application: newApplication || 'General Industrial',
        target_price: Number(newPrice) || 4500,
        status: targetStatus === 'awaiting_matches' ? 'active' : 'draft',
        required_by_date: newRequiredDate,
        delivery_method: newDelivery,
      };

      await createRequirement(token, payload);
      
      setIsNewModalOpen(false);
      setNewTitle('');
      setNewVolume('');
      showToast(
        targetStatus === 'draft'
          ? 'Requirement saved as draft.'
          : 'Requirement published to regional matching network!'
      );
      
      await fetchData();
    } catch (e) {
      console.error(e);
      showToast('Failed to create requirement.');
    }
  };

  // Columns for desktop <Table>
  const columns: Column<BuyerRequirementItem>[] = [
    {
      key: 'title',
      header: 'Requirement',
      render: (row) => {
        const city = row.location.split(',')[0].trim();
        return (
          <div className="space-y-0.5">
            <span className="font-semibold text-[14px] text-[var(--ink)] block">
              {row.title}
            </span>
            <span className="text-[12px] text-[var(--text-secondary-accessible)] block">
              {row.volumeTonnes.toLocaleString()}t · min {row.minPurity}% purity · {city}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '170px',
      render: (row) => {
        switch (row.status) {
          case 'draft':
            return <Badge variant="neutral">Draft</Badge>;
          case 'awaiting_matches':
            return <Badge variant="outline-warning">Awaiting matches</Badge>;
          case 'matched':
            return <Badge variant="outline-success">Matches found</Badge>;
          case 'closed':
            return <Badge variant="neutral" className="opacity-60">Closed</Badge>;
          default:
            return null;
        }
      },
    },
    {
      key: 'matchesCount',
      header: 'Matches',
      width: '110px',
      render: (row) => {
        if (row.matchesCount > 0) {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToRecommendations(row.id);
              }}
              className="font-semibold text-[13px] text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer select-none"
              title={`View ${row.matchesCount} recommended supplier matches`}
            >
              {row.matchesCount} →
            </button>
          );
        }
        return <span className="text-[var(--text-secondary)] font-medium select-none">—</span>;
      },
    },
    {
      key: 'postedDate',
      header: 'Posted date',
      width: '130px',
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary-accessible)]">
          {row.postedDate}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      align: 'right',
      render: (row) => {
        const items = getDropdownItems(row);
        return (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-end"
          >
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] cursor-pointer"
                  aria-label="Actions menu"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={items}
              onSelect={(item) => handleActionSelect(row, item.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-5 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast variant="success" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-heading text-[22px] sm:text-[24px] font-bold text-[var(--ink)] tracking-tight">
            My Requirements
          </h1>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
            Manage your industrial CO₂ specifications, offtake criteria, and supplier matches.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewModalOpen(true)}
          className="shrink-0"
        >
          + New Requirement
        </Button>
      </div>

      {/* Small filter row beneath */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
        <PillTabNav
          tabs={statusTabs}
          activeTab={statusFilter}
          onChange={(id) => setStatusFilter(id)}
          compact={true}
        />

        <span className="text-[12px] text-[var(--text-secondary)] hidden sm:inline">
          {filteredRequirements.length} {filteredRequirements.length === 1 ? 'requirement' : 'requirements'}
        </span>
      </div>

      {/* === BODY: TABLE (Desktop) / STACKED CARDS (Mobile) / EMPTY STATE === */}
      {filteredRequirements.length === 0 ? (
        <EmptyState
          title="No requirements yet"
          description="Post what CO2 you need and we'll find matching suppliers."
          ctaLabel="+ New Requirement"
          onCtaClick={() => setIsNewModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table<BuyerRequirementItem>
              columns={columns}
              data={filteredRequirements}
              keyExtractor={(r) => r.id}
              className="overflow-visible"
              onRowClick={(row) => {
                if (row.matchesCount > 0) {
                  onNavigateToRecommendations(row.id);
                } else {
                  setSelectedRequirement(row);
                }
              }}
            />
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden space-y-3">
            {filteredRequirements.map((row) => {
              const city = row.location.split(',')[0].trim();
              const items = getDropdownItems(row);
              return (
                <div
                  key={row.id}
                  onClick={() => {
                    if (row.matchesCount > 0) {
                      onNavigateToRecommendations(row.id);
                    } else {
                      setSelectedRequirement(row);
                    }
                  }}
                  className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 shadow-xs space-y-3 cursor-pointer hover:border-[var(--ink)]/30 transition-colors"
                >
                  {/* Top: Title + Kebab */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-[14px] text-[var(--ink)] leading-snug">
                        {row.title}
                      </h3>
                      <div>
                        {row.status === 'draft' && <Badge variant="neutral">Draft</Badge>}
                        {row.status === 'awaiting_matches' && (
                          <Badge variant="outline-warning">Awaiting matches</Badge>
                        )}
                        {row.status === 'matched' && (
                          <Badge variant="outline-success">Matches found</Badge>
                        )}
                        {row.status === 'closed' && (
                          <Badge variant="neutral" className="opacity-60">Closed</Badge>
                        )}
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        align="right"
                        trigger={
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors"
                            aria-label="Actions menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={items}
                        onSelect={(item) => handleActionSelect(row, item.id)}
                      />
                    </div>
                  </div>

                  {/* Spec summary */}
                  <div className="text-[12px] text-[var(--text-secondary-accessible)] bg-[var(--surface-muted)] px-2.5 py-1.5 rounded-[var(--radius-chip)]">
                    {row.volumeTonnes.toLocaleString()}t · min {row.minPurity}% purity · {city}
                  </div>

                  {/* Bottom: Matches & Date */}
                  <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[var(--border-subtle)]">
                    <div>
                      <span className="text-[var(--text-secondary)] mr-1.5">Matches:</span>
                      {row.matchesCount > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToRecommendations(row.id);
                          }}
                          className="font-semibold text-[var(--accent-primary)] hover:underline"
                        >
                          {row.matchesCount} →
                        </button>
                      ) : (
                        <span className="text-[var(--text-secondary)] font-medium">—</span>
                      )}
                    </div>

                    <span className="text-[var(--text-secondary)]">
                      {row.postedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === + NEW REQUIREMENT MODAL === */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Post New CO₂ Requirement"
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleCreateRequirement('draft')}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleCreateRequirement('awaiting_matches')}
            >
              Publish Requirement
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
              Requirement Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Ultra-High Purity Precast Curing Feedstock"
              className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Volume Needed (Tonnes)
              </label>
              <input
                type="number"
                value={newVolume}
                onChange={(e) => setNewVolume(e.target.value)}
                placeholder="e.g. 500"
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Minimum Assay Purity (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={newPurity}
                onChange={(e) => setNewPurity(e.target.value)}
                placeholder="e.g. 98.0"
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Target Industrial Location
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Ahmedabad, Gujarat"
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Application Sector
              </label>
              <select
                value={newApplication}
                onChange={(e) => setNewApplication(e.target.value)}
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              >
                <option value="Building Materials">Building Materials (Precast / Curing)</option>
                <option value="Synthetic Fuels">Synthetic Fuels (Methanol / SAF)</option>
                <option value="Food & Beverage">Food & Beverage (E290)</option>
                <option value="EOR Injection">Enhanced Oil Recovery (EOR)</option>
                <option value="Chemical Synthesis">Chemical Synthesis / Polymers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Max Price per Ton (₹/t)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="e.g. 4800"
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Required By Date
              </label>
              <input
                type="text"
                value={newRequiredDate}
                onChange={(e) => setNewRequiredDate(e.target.value)}
                placeholder="e.g. Aug 15, 2026"
                className="w-full h-10 px-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* === REQUIREMENT DETAIL / EDIT MODAL === */}
      {selectedRequirement && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequirement(null)}
          title={selectedRequirement.title}
          maxWidth="md"
          footer={
            <>
              {selectedRequirement.matchesCount > 0 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const reqId = selectedRequirement.id;
                    setSelectedRequirement(null);
                    onNavigateToRecommendations(reqId);
                  }}
                >
                  View {selectedRequirement.matchesCount} Matching Suppliers
                </Button>
              ) : selectedRequirement.status === 'draft' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleActionSelect(selectedRequirement, 'publish');
                    setSelectedRequirement(null);
                  }}
                >
                  Publish Now
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSelectedRequirement(null)}
                >
                  Close
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Status
                </span>
                {selectedRequirement.status === 'draft' && <Badge variant="neutral">Draft</Badge>}
                {selectedRequirement.status === 'awaiting_matches' && (
                  <Badge variant="outline-warning">Awaiting matches</Badge>
                )}
                {selectedRequirement.status === 'matched' && (
                  <Badge variant="outline-success">Matches found</Badge>
                )}
                {selectedRequirement.status === 'closed' && (
                  <Badge variant="neutral" className="opacity-60">Closed</Badge>
                )}
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Matches
                </span>
                <span className="text-[14px] font-semibold text-[var(--ink)]">
                  {selectedRequirement.matchesCount > 0
                    ? `${selectedRequirement.matchesCount} verified suppliers`
                    : 'No matches yet'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] text-[12px]">
              <div>
                <span className="text-[var(--text-secondary)] block">Volume Needed</span>
                <span className="font-semibold text-[var(--ink)] text-[14px]">
                  {selectedRequirement.volumeTonnes.toLocaleString()} tonnes
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Min Purity</span>
                <span className="font-semibold text-[var(--ink)] text-[14px]">
                  ≥ {selectedRequirement.minPurity}%
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Max Budget</span>
                <span className="font-semibold text-[var(--ink)] text-[14px]">
                  ₹{selectedRequirement.maxPricePerTon.toLocaleString()} / t
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Required By</span>
                <span className="font-semibold text-[var(--ink)] text-[14px]">
                  {selectedRequirement.requiredByDate}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-[var(--text-secondary-accessible)]">
                <MapPin className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
                <span>Delivery: {selectedRequirement.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary-accessible)]">
                <Gauge className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
                <span>Sector: {selectedRequirement.application} ({selectedRequirement.deliveryMethod})</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary-accessible)]">
                <Calendar className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
                <span>Posted Date: {selectedRequirement.postedDate}</span>
              </div>
            </div>

            {selectedRequirement.notes && (
              <div className="p-3 rounded-[var(--radius-chip)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary-accessible)] leading-relaxed">
                <strong className="text-[var(--ink)] block mb-1">Offtake Notes:</strong>
                {selectedRequirement.notes}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyRequirementsView;
