import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Badge,
  TagChip,
  TrendIndicator,
  LiveStatusDot,
  Card,
  KPICard,
  InsightCard,
  AlertRow,
  Table,
  Pagination,
  MiniLineChart,
  MiniBarChart,
  MatchScoreBar,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioButton,
  Toggle,
  DatePicker,
  SearchBar,
  FilterPill,
  SortPill,
  Skeleton,
  EmptyState,
  ErrorState,
  Toast,
  Tooltip,
  Modal,
  Dropdown,
  PillTabNav,
  UserAvatarChip
} from '../components/ui';
import {
  Sparkles,
  ArrowRight,
  RotateCw,
  Download,
  Settings,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Share2,
  Trash2,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export const ComponentGallery: React.FC = () => {
  // Interactive state for showcase
  const [toggleVal, setToggleVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('pipeline');
  const [searchVal, setSearchVal] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>('dac');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeToast, setActiveToast] = useState<'success' | 'error' | 'info' | null>(null);

  // Mock table data
  const sampleTableData = [
    { id: 'LOT-901', partner: 'Nordic Cryo Carbon', method: 'Direct Air Capture', purity: '99.98%', price: 39.20, volume: '8,500 t', status: 'Best Match' },
    { id: 'LOT-902', partner: 'AeroCapture Synthetics', method: 'Biogenic Fermenter', purity: '99.90%', price: 36.80, volume: '14,200 t', status: 'Verified' },
    { id: 'LOT-903', partner: 'Veritas Carbon Hub', method: 'Point-Source Cryo', purity: '99.82%', price: 41.50, volume: '22,000 t', status: 'Pending' },
  ];

  const tableColumns = [
    { key: 'id', header: 'Batch ID', sortable: true, width: '110px' },
    { key: 'partner', header: 'Supplier Plant', sortable: true },
    { key: 'method', header: 'Capture Source' },
    { key: 'purity', header: 'Assay Purity' },
    {
      key: 'price',
      header: 'Unit Price',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => <span className="font-semibold">${row.price.toFixed(2)}/t</span>,
    },
    { key: 'volume', header: 'Volume', align: 'right' as const },
    {
      key: 'status',
      header: 'Verification',
      render: (row: any) => (
        <Badge
          variant={
            row.status === 'Best Match'
              ? 'filled-accent'
              : row.status === 'Verified'
              ? 'outline-success'
              : 'neutral'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  const sampleLineData = [
    { label: 'Oct', value: 34.2 },
    { label: 'Nov', value: 35.8 },
    { label: 'Dec', value: 37.4 },
    { label: 'Jan', value: 39.0 },
    { label: 'Feb', value: 38.5 },
    { label: 'Mar', value: 40.2 },
    { label: 'Apr', value: 41.0 },
    { label: 'May', value: 41.8 },
  ];

  const sampleBarData = [
    { label: 'Oct', value: 38 },
    { label: 'Nov', value: 42 },
    { label: 'Dec', value: 45 },
    { label: 'Jan', value: 52 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 61 },
    { label: 'Apr', value: 67 },
    { label: 'May', value: 72 },
  ];

  const dropdownMenuItems = [
    { id: '1', label: 'Export Telemetry CSV', icon: <Download className="w-3.5 h-3.5" /> },
    { id: '2', label: 'Share Manifest', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: '3', label: 'Revoke Offtake Token', icon: <Trash2 className="w-3.5 h-3.5" />, danger: true },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-12 text-left">
      
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="filled-accent">UI Design System</Badge>
              <LiveStatusDot status="online" label="Production Tokens Locked" />
            </div>
            <h1 className="type-display text-[var(--text-primary)]">
              CarbonFlow Component Library
            </h1>
            <p className="type-body text-[var(--text-secondary-accessible)] max-w-2xl mt-1">
              Complete operations-grade UI kit built strictly on custom CSS tokens (<code className="text-xs bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">--bg</code>, <code className="text-xs bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">--accent-primary</code>, <code className="text-xs bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">--radius-card</code>).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leadingIcon={<Download className="w-3.5 h-3.5" />}>
              Download Tokens
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Test Modal Overlay
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 1: BUTTONS & ICON BUTTONS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">1. Buttons & Icon Buttons</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Default pill-dark (--ink), standout primary (--accent-primary), secondary, and ghost variants + icon slots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pill-Dark Buttons (NEW DEFAULT) */}
          <Card padding="sm" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="type-label text-[var(--text-secondary)] block">Pill-Dark (Filled --ink)</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--ink)] text-white">Default</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="pill-dark" size="sm">Small</Button>
              <Button variant="pill-dark" size="md">Medium</Button>
              <Button variant="pill-dark" size="lg">Large</Button>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button variant="pill-dark" size="sm" withArrow>
                With Arrow
              </Button>
              <Button variant="pill-dark" size="sm" isLoading>
                Loading
              </Button>
              <Button variant="pill-dark" size="sm" disabled>
                Disabled
              </Button>
            </div>
          </Card>

          {/* Primary Buttons (Standout CTA Only) */}
          <Card padding="sm" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="type-label text-[var(--text-secondary)] block">Primary (--accent-primary)</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] text-white">1 Per Screen</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button variant="primary" size="sm" leadingIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Standout
              </Button>
              <Button variant="primary" size="sm" isLoading>
                Loading
              </Button>
              <Button variant="primary" size="sm" disabled>
                Disabled
              </Button>
            </div>
          </Card>

          {/* Secondary Buttons */}
          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Secondary (1px --border-subtle)</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="md">Medium</Button>
              <Button variant="secondary" size="lg">Large</Button>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button variant="secondary" size="sm" trailingIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Next
              </Button>
              <Button variant="secondary" size="sm" isLoading>
                Loading
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Disabled
              </Button>
            </div>
          </Card>

          {/* Ghost & Icon Buttons */}
          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Ghost & Circular IconButtons</span>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Ghost Link</Button>
              <Button variant="ghost" size="sm" disabled>Disabled</Button>
            </div>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
              <IconButton icon={<RotateCw className="w-4 h-4" />} aria-label="Refresh" size="sm" />
              <IconButton icon={<Settings className="w-4 h-4" />} aria-label="Settings" size="md" />
              <IconButton icon={<Download className="w-4 h-4" />} variant="filled" aria-label="Download" size="md" />
              <IconButton icon={<SlidersHorizontal className="w-4 h-4" />} disabled aria-label="Disabled" size="sm" />
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 2: BADGES & STATUS INDICATORS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">2. Badges, TagChips & Status Indicators</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Full pill status badges, TagChip outline metadata pills, directional trend indicators, and live heartbeat dots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="sm" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="type-label text-[var(--text-secondary)] block">Status Badges</span>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">State Only</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="filled-accent" icon={<Sparkles className="w-3 h-3" />}>Best Match</Badge>
              <Badge variant="outline-success" icon={<CheckCircle2 className="w-3 h-3" />}>Verified</Badge>
              <Badge variant="outline-warning">Pending Audit</Badge>
              <Badge variant="outline-danger">Rejected</Badge>
            </div>
          </Card>

          <Card padding="sm" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="type-label text-[var(--text-secondary)] block">Tag Chips (NEW)</span>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Attributes</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TagChip label="Food Grade" />
              <TagChip label="Liquefied" />
              <TagChip label="99.9% Purity" />
              <TagChip label="120 km radius" />
            </div>
          </Card>

          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Trend Indicators</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <TrendIndicator direction="up" value="+18.4%" />
              <TrendIndicator direction="down" value="-4.2%" isPositiveMetric={false} />
              <TrendIndicator direction="down" value="-12.1%" isPositiveMetric={true} />
              <TrendIndicator direction="up" value="+6.8% tariff" isPositiveMetric={false} />
            </div>
          </Card>

          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Live Status Dots</span>
            <div className="space-y-2">
              <div><LiveStatusDot status="online" label="Pipeline SCADA Active" /></div>
              <div><LiveStatusDot status="offline" label="Antwerp Terminal Maintenance" /></div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 3: CARDS & ALERT ROWS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">3. Cards, KPI Cards, AI Insights, & Alert Rows</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Elevated white cards (20px radius), data-stat KPI blocks, AI insight callouts, and flush list-rows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Delivered Volume"
            value="24,500 t"
            trend={{ direction: 'up', value: '+8.2%' }}
            period="vs last month"
          />
          <KPICard
            label="Avg Unit Cost"
            value="$41.80/t"
            trend={{ direction: 'down', value: '-4.5%', isPositiveMetric: false }}
            period="vs index benchmark"
          />
          <KPICard
            label="Active Orders"
            value="6"
            period="2 in rail transit"
          />
          <KPICard
            label="Compliance Score"
            value="99.4%"
            trend={{ direction: 'up', value: '+0.3%' }}
            period="ISO-14064 verified"
          />
        </div>

        {/* AI Insight Card */}
        <InsightCard
          tag="CarbonFlow AI Optimizer"
          primaryAction={<Button size="sm">Apply Pipeline Shift</Button>}
          secondaryAction={<Button variant="secondary" size="sm">Audit Carbon</Button>}
        >
          Consolidating Midwest DAC batch #408 with existing rail tankers can reduce total Scope 3 freight emissions by 14.8% and save $3.20/t.
        </InsightCard>

        {/* Flush Alert Rows */}
        <Card padding="none" className="divide-y divide-[var(--border-subtle)] px-6 py-2">
          <AlertRow
            severity="warning"
            icon={<AlertTriangle className="w-4 h-4 stroke-[2.25]" />}
            headline="Price Spike Alert: Gulf Coast pipeline tariff increase"
            description="Regional power surcharge will add +$2.10/t across feeder line 4 effective Monday."
            timestamp="12m ago"
            action={<Button variant="secondary" size="sm">Review Rates</Button>}
          />
          <AlertRow
            severity="danger"
            icon={<AlertOctagon className="w-4 h-4 stroke-[2.25]" />}
            headline="Supply Shortage Risk: Rotterdam liquefaction chiller valve maintenance"
            description="Spot cryogenic deliveries curtailed by 12,000 t between May 18-22."
            timestamp="48m ago"
            action={<Button variant="secondary" size="sm">Re-route Rail</Button>}
          />
          <AlertRow
            severity="success"
            icon={<CheckCircle2 className="w-4 h-4 stroke-[2.25]" />}
            headline="Assay Certification Approved: DAC Facility Alpha direct audit complete"
            description="Registered 34,000 tonnes of net-negative direct air capture credits."
            timestamp="2h ago"
            action={<Button variant="secondary" size="sm">Download Cert</Button>}
          />
        </Card>
      </section>

      {/* SECTION 4: DATA DISPLAY & VISUALIZATIONS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">4. Data Display & Visualizations</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Sortable tables, pill pagination, restrained monochrome charts with accent highlights, and score bars.
          </p>
        </div>

        {/* Sortable Table */}
        <Table columns={tableColumns} data={sampleTableData} />

        <div className="flex items-center justify-between pt-2">
          <span className="type-label text-[var(--text-secondary)]">Showing 3 of 184 contracts</span>
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </div>

        {/* Charts & Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">Delivered Price Index</span>
              <span className="type-label text-[var(--accent-primary)] font-semibold">$41.80/t</span>
            </div>
            <p className="type-label text-[var(--text-secondary)]">Monochrome line with latest point highlighted</p>
            <MiniLineChart data={sampleLineData} valueFormatter={(v) => `$${v}`} />
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">Monthly Volume (k t)</span>
              <span className="type-label text-[var(--text-primary)] font-semibold">May 72k t</span>
            </div>
            <p className="type-label text-[var(--text-secondary)]">Monochrome neutral bars with single accent bar</p>
            <MiniBarChart data={sampleBarData} valueFormatter={(v) => `${v}k`} />
          </Card>

          <Card padding="md" className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">Match Breakdown</span>
              <Badge variant="filled-accent">96.8% Overall</Badge>
            </div>
            <div className="space-y-2.5 pt-1">
              <MatchScoreBar label="Purity Assay (99.98%)" value={99} />
              <MatchScoreBar label="Transport Latency (<24h)" value={94} />
              <MatchScoreBar label="Price Efficiency ($39.20/t)" value={92} />
              <MatchScoreBar label="Buffer Reliability Index" value={98} />
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 5: FORM CONTROLS & SEARCH */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">5. Form Controls & Search Inputs</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Inputs, textareas, selects, checkboxes, toggles, date pickers, and pill-shaped search with category chips.
          </p>
        </div>

        {/* Pill Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchVal}
              onChange={setSearchVal}
              placeholder="Search by facility, hub, offtake route..."
              tags={[
                { id: 'all', label: 'All' },
                { id: 'dac', label: 'DAC (Direct Air Capture)' },
                { id: 'biogenic', label: 'Biogenic CO₂' },
                { id: 'food-grade', label: 'Food-Grade (E290)' },
              ]}
              selectedTagId={selectedTag}
              onSelectTag={setSelectedTag}
              onClear={() => {
                setSearchVal('');
                setSelectedTag(null);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterPill label="Filters" count={2} isActive />
            <SortPill label="Match %" />
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <Input
            label="Contract Reference ID"
            placeholder="e.g. CF-2026-99"
            helperText="Internal alphanumeric tracking number"
          />
          <Input
            label="Volume Request (t)"
            placeholder="25,000"
            error="Volume exceeds available terminal buffer"
          />
          <Select
            label="CO₂ Purity Specification"
            options={[
              { label: 'Food Grade E290 (99.98%)', value: 'food' },
              { label: 'Industrial Tech Grade (99.9%)', value: 'tech' },
              { label: 'Mineral Sequestration Grade (98.5%)', value: 'sequestration' },
            ]}
          />
          <DatePicker label="Scheduled Offtake Date" />
          <div className="space-y-4 pt-2">
            <Checkbox
              label="Verified ISO-14064 direct injection"
              description="Requires third-party auditor ledger sign-off"
              checked={checkboxVal}
              onChange={(e) => setCheckboxVal(e.target.checked)}
            />
            <div className="flex items-center gap-4">
              <RadioButton
                name="transport"
                label="Pipeline"
                checked={radioVal === 'pipeline'}
                onChange={() => setRadioVal('pipeline')}
              />
              <RadioButton
                name="transport"
                label="ISO Rail"
                checked={radioVal === 'rail'}
                onChange={() => setRadioVal('rail')}
              />
            </div>
          </div>
          <div className="pt-2">
            <Toggle
              label="Automated SCADA Dispatch"
              description="Permits dynamic off-peak compression flow"
              checked={toggleVal}
              onChange={setToggleVal}
            />
          </div>
        </div>

        <Textarea
          label="Offtake Terms & Special Logistics Notes"
          placeholder="Provide cryogenic tank specifications, unloading pressure requirements, or seasonal batch buffers..."
        />
      </section>

      {/* SECTION 6: FEEDBACK & NOTIFICATIONS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">6. Feedback, Skeletons, & Floating Toasts</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Skeleton pulse loaders, centered empty/error states, hover tooltips, and floating toast notifications.
          </p>
        </div>

        {/* Skeleton row */}
        <Card padding="sm" className="space-y-3">
          <span className="type-label text-[var(--text-secondary)] block">Skeleton Pulse Loaders</span>
          <div className="flex items-center gap-3">
            <Skeleton width={44} height={44} circle />
            <div className="space-y-2 flex-1">
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={10} />
            </div>
            <Skeleton width={120} height={36} />
          </div>
        </Card>

        {/* Toasts and Tooltips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Floating Toasts & Triggers</span>
            <div className="space-y-2">
              <Toast variant="success" message="Offtake contract verified & signed." />
              <Toast variant="error" message="Pipeline pressure below required 40 bar." />
              <Toast variant="info" message="Telemetry sync scheduled in 5 minutes." />
            </div>
            <div className="pt-2 flex flex-wrap gap-2 border-t border-[var(--border-subtle)]">
              <Button size="sm" variant="secondary" onClick={() => setActiveToast('success')}>Test Success</Button>
              <Button size="sm" variant="secondary" onClick={() => setActiveToast('error')}>Test Error</Button>
              <Button size="sm" variant="secondary" onClick={() => setActiveToast('info')}>Test Info</Button>
            </div>
            {activeToast && (
              <div className="fixed bottom-6 right-6 z-50">
                <Toast
                  variant={activeToast}
                  message={`Interactive ${activeToast.toUpperCase()} notification fired!`}
                  onClose={() => setActiveToast(null)}
                />
              </div>
            )}
          </Card>

          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Tooltips</span>
            <p className="text-[13px] text-[var(--text-secondary-accessible)]">
              Hover over the triggers below to preview dark tooltip bubble overlays:
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Tooltip content="ISO 14064-2 Cryptographic audit hash">
                <Button variant="secondary" size="sm">Audit Verification</Button>
              </Tooltip>
              <Tooltip content="Direct Air Capture with net-negative life cycle">
                <Badge variant="filled-accent">DAC Grade</Badge>
              </Tooltip>
            </div>
          </Card>

          <Card padding="sm" className="space-y-3">
            <span className="type-label text-[var(--text-secondary)] block">Dropdown Menus</span>
            <p className="text-[13px] text-[var(--text-secondary-accessible)]">
              Keyboard navigable dropdown menu with arrow keys:
            </p>
            <div className="pt-2">
              <Dropdown
                trigger={<Button variant="secondary" size="sm" trailingIcon={<Plus className="w-3 h-3" />}>Contract Actions</Button>}
                items={dropdownMenuItems}
                onSelect={(item) => alert(`Selected action: ${item.label}`)}
              />
            </div>
          </Card>
        </div>

        {/* Empty & Error States */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <EmptyState
            title="No Active Capture Lots"
            description="Adjust your search filters or clear the active category chip to locate available CO2 volumes."
            ctaLabel="Clear Active Filters"
            onCtaClick={() => setSelectedTag(null)}
          />
          <ErrorState
            title="SCADA Grid Disconnect"
            description="Connection to the Rotterdam terminal telemetry hub timed out. Please retry."
            onRetry={() => alert('Retrying grid SCADA handshake...')}
          />
        </div>
      </section>

      {/* SECTION 7: NAVIGATION & IDENTITY */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h2 className="type-heading text-[var(--text-primary)]">7. Navigation & User Avatar Chips</h2>
          <p className="type-label text-[var(--text-secondary)]">
            Segmented pill tab nav with animated indicator and circular user avatar lockups.
          </p>
        </div>

        <Card padding="md" className="space-y-4">
          <span className="type-label text-[var(--text-secondary)] block">Pill Segmented Navigation</span>
          <PillTabNav
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'marketplace', label: 'Marketplace', hasDropdown: true },
              { id: 'recommendations', label: 'Recommendations' },
              { id: 'orders', label: 'Orders', hasDropdown: true },
              { id: 'logistics', label: 'Logistics' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-6">
            <span className="type-label text-[var(--text-secondary)]">Avatar Chips:</span>
            <UserAvatarChip name="Elena Rostova" role="Procurement VP" />
            <UserAvatarChip name="Marcus Vance" role="Capture Operations" />
            <UserAvatarChip name="Admin Terminal" />
          </div>
        </Card>
      </section>

      {/* Modal Dialog Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Carbon Offtake Agreement"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsModalOpen(false);
                alert('Offtake contract confirmed and committed to registry.');
              }}
            >
              Confirm Agreement
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-[14px] text-[var(--text-secondary-accessible)] leading-relaxed">
            You are drafting a binding commercial dispatch contract for <strong>8,500 tonnes</strong> of food-grade liquid CO₂ from <strong>Nordic Cryo Carbon A/S</strong> at <strong>$39.20/t</strong>.
          </p>
          <div className="p-3 bg-[var(--surface-muted)] rounded-[var(--radius-chip)] text-[12px] text-[var(--text-primary)]">
            Logistics: Dedicated ISO Rail Tanker • Delivery ETA: 18 hours dispatch
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ComponentGallery;
