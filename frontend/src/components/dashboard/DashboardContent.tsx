import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Factory, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Building2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton, EmptyState, ErrorState } from '../ui/Feedback';
import type { UserRole, DashboardState } from '../../types/dashboard';
import { useAuth } from '@clerk/clerk-react';
import { 
  getDashboardKPIs,
  getMarketPrices,
  getSupplyDemand,
  getDashboardAlerts,
  getDashboardInsight
} from '../../services/dashboardApi';

interface DashboardContentProps {
  userRole: UserRole;
  onOpenMarketplace: () => void;
  onOpenMaps?: () => void;
  dashboardState?: DashboardState;
  onRetry?: () => void;
  orgName?: string;
}

type Period = 'day' | 'week' | 'month' | 'year';

interface ChartPoint {
  date: string;
  label: string;
  value: number;
  formattedValue: string;
  delta: string;
  isPositive: boolean;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  userRole,
  onOpenMarketplace,
  onOpenMaps,
  dashboardState = 'success',
  onRetry,
  orgName
}) => {
  // Session states for dismissible elements
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [chartPeriod, setChartPeriod] = useState<'Last 30 Days' | 'Last 90 Days' | 'Last Year'>('Last Year');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(6); // default to a recent point
  
  const { getToken } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  const [chartDataState, setChartDataState] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await getToken();
        if (token) {
          const [kpisRes, supplyDemandRes, alertsRes, insightRes] = await Promise.all([
            getDashboardKPIs(token),
            getSupplyDemand(token),
            getDashboardAlerts(token),
            getDashboardInsight(token)
          ]);
          setKpis(kpisRes);
          setChartDataState(supplyDemandRes?.items || []);
          setAlerts(alertsRes?.items || []);
          setInsight(insightRes);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [getToken, userRole]);

  // Dynamic organization name based on active persona
  const activeOrgName = orgName || {
    buyer: 'Tata Steel Cleantech',
    supplier: 'AeroCapture Synthetics',
    admin: 'Gujarat Industrial Corridor Clearing Authority'
  }[userRole];

  // 2x2 Performance Metrics depending on Role and Period
  const performanceMetrics = useMemo(() => {
    if (kpis?.kpis) {
      return kpis.kpis.map((kpi: any) => ({
        id: kpi.id,
        label: kpi.label,
        value: kpi.value,
        trend: kpi.trend,
        caption: kpi.period
      }));
    }
    return []; // Return empty array until loaded
  }, [kpis]);

  // Chart Data: CO2 Volume Traded (Supplier) or Procurement Spend (Buyer)
  const chartData: ChartPoint[] = useMemo(() => {
    return chartDataState || [];
  }, [chartDataState]);

  // SVG Chart path calculation
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 30;
  const paddingY = 25;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(...chartData.map((d) => d.value));
  const minVal = Math.min(...chartData.map((d) => d.value)) * 0.8;
  const range = maxVal - minVal || 1; // Prevent division by zero if all values are identical

  const points = chartData.map((pt, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * innerWidth;
    const y = svgHeight - paddingY - ((pt.value - minVal) / range) * innerHeight;
    return { x, y, pt, index: i };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z` : '';

  const activePoint = points.length > 0 ? (hoveredPointIndex !== null && points[hoveredPointIndex] ? points[hoveredPointIndex] : points[Math.min(8, points.length - 1)]) : null;

  // Right Column 2: Listings / Matches breakdown
  const summaryBreakdown = useMemo(() => {
    return kpis?.summaryBreakdown || [];
  }, [kpis]);

  // Right Column 3: Recent Activity items
  const recentActivities = useMemo(() => {
    return alerts || [];
  }, [alerts]);

  if (dashboardState === 'loading') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton width="260px" height={32} />
          <Skeleton width="160px" height={40} />
        </div>
        <Skeleton width="100%" height={56} />
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton width="100%" height={220} />
            <Skeleton width="100%" height={320} />
          </div>
          <div className="lg:col-span-3 space-y-5">
            <Skeleton width="100%" height={140} />
            <Skeleton width="100%" height={180} />
            <Skeleton width="100%" height={260} />
          </div>
        </div>
      </div>
    );
  }

  if (dashboardState === 'error') {
    return (
      <ErrorState 
        title="Unable to load dashboard" 
        message="There was a problem loading your performance metrics."
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ========================================================================= */}
      {/* === 1. HEADER ROW ======================================================= */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-[var(--ink)] leading-tight">
            Hello, {activeOrgName}!
          </h1>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-0.5">
            Operations clearing overview • {userRole === 'buyer' ? 'Procurement Buyer Dashboard' : 'Carbon Capture Supplier Dashboard'}
          </p>
        </div>

        {/* Top-right: [Maps] [Open Marketplace] */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenMaps && (
            <Button
              variant="secondary"
              size="md"
              onClick={onOpenMaps}
              className="shadow-xs"
            >
              Maps
            </Button>
          )}
          <Button
            variant="pill-dark"
            size="md"
            onClick={onOpenMarketplace}
            className="shadow-xs"
          >
            Open Marketplace
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* === 2. DISMISSIBLE BANNER (Conditional, Session State) =================== */}
      {/* ========================================================================= */}
      {!isBannerDismissed && (
        <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 shadow-xs flex items-center justify-between gap-4 transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5A623]/15 text-[var(--status-warning)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="text-[13px] text-[var(--text-primary)]">
              <span className="font-semibold text-[var(--ink)]">Complete verification to unlock advanced features</span>
              <span className="hidden sm:inline text-[var(--text-secondary-accessible)]"> — Direct custody pipeline injection and zero-fee escrow settlement.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => alert('Initiating third-party ISO-14064 verification workflow...')}
              className="text-[13px] font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 focus-visible:outline-none"
            >
              <span>Verify Now</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => setIsBannerDismissed(true)}
              className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* === 3. ONBOARDING CHECKLIST (New Users Only, Conditional) ================ */}
      {/* ========================================================================= */}
      {!isOnboardingDismissed && (
        <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-[var(--ink)]">
                  Welcome to CarbonLoop 👋
                </h2>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
                  Quick Start
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-0.5">
                A quick guide to getting your first algorithmic CO₂ match
              </p>
            </div>
            <button
              onClick={() => setIsOnboardingDismissed(true)}
              className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Dismiss
            </button>
          </div>

          {/* Two Setup Rows */}
          <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-1">
            {/* Setup Row 1: List your CO2 */}
            <div className="py-3.5 flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)] shrink-0 group-hover:bg-[var(--border-subtle)] transition-colors">
                  <Factory className="w-4 h-4 text-[var(--ink)]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--ink)]">
                    List your CO₂
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary-accessible)]">
                    Tell us what you're capturing and how much volume is available
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenMarketplace}
                className="text-[12px] font-semibold text-[var(--ink)] hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Set Up</span>
                <span className="text-[14px]">↗</span>
              </button>
            </div>

            {/* Setup Row 2: Set your requirements (buyer role only) */}
            {userRole === 'buyer' && (
              <div className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)] shrink-0 group-hover:bg-[var(--border-subtle)] transition-colors">
                    <FileText className="w-4 h-4 text-[var(--ink)]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[var(--ink)]">
                      Set your requirements
                    </div>
                    <div className="text-[12px] text-[var(--text-secondary-accessible)]">
                      Tell us what CO₂ spec, purity threshold, and delivery window you need
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenMarketplace}
                  className="text-[12px] font-semibold text-[var(--ink)] hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Set Up</span>
                  <span className="text-[14px]">↗</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* === MAIN TWO-COLUMN GRID: ~70% Main Content / ~30% Right Column ========== */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-7 lg:gap-8 items-start">
        
        {/* ======================================================================= */}
        {/* === LEFT COLUMN (~70% Width, lg:col-span-7) =========================== */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* --------------------------------------------------------------------- */}
          {/* --- SECTION: OVERVIEW PERFORMANCE ----------------------------------- */}
          {/* --------------------------------------------------------------------- */}
          <Card padding="md" className="space-y-5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--ink)] tracking-tight">
                  Overview performance
                </h2>
                <p className="text-[12px] text-[var(--text-secondary-accessible)]">
                  Clearing velocity and counterparty engagement metrics
                </p>
              </div>

              {/* Segmented Day / Week / Month / Year Pill-Tab Control */}
              <div className="inline-flex p-1 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] shrink-0">
                {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-1 rounded-[var(--radius-pill)] text-[12px] font-semibold capitalize transition-all select-none ${
                      selectedPeriod === p
                        ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 2x2 Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {performanceMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 rounded-[var(--radius-chip)] bg-[var(--surface-muted)]/50 border border-[var(--border-subtle)] space-y-1.5 transition-all hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--ink)]">
                      {metric.value}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-[var(--radius-pill)] text-[11px] font-semibold ${
                        metric.trend.isPositive
                          ? 'bg-[#34C77B]/10 text-[var(--status-success)]'
                          : 'bg-[#E5484D]/10 text-[var(--status-danger)]'
                      }`}
                    >
                      {metric.trend.isPositive ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      )}
                      <span>{metric.trend.value}</span>
                    </span>
                  </div>

                  <div className="text-[13px] font-medium text-[var(--text-secondary-accessible)]">
                    {metric.label}
                  </div>

                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {metric.caption}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* --------------------------------------------------------------------- */}
          {/* --- SECTION: REVENUE-STYLE CHART SECTION ---------------------------- */}
          {/* --------------------------------------------------------------------- */}
          <Card padding="md" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--ink)] tracking-tight">
                  {userRole === 'buyer' ? 'Procurement Spend' : 'CO₂ Volume Traded'}
                </h2>
                <div className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-[var(--ink)] mt-0.5">
                  {chartData.length > 0 && chartData[chartData.length - 1]?.formattedValue ? chartData[chartData.length - 1].formattedValue : '0'}
                </div>
              </div>

              {/* Time period dropdown */}
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => {
                    const next = chartPeriod === 'Last Year' ? 'Last 90 Days' : chartPeriod === 'Last 90 Days' ? 'Last 30 Days' : 'Last Year';
                    setChartPeriod(next);
                  }}
                  className="h-8 px-3 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{chartPeriod}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Area Chart */}
            <div className="relative pt-2">
              
              {/* Floating Tooltip Callout mirroring "24 Sep 2024 · $367.54 · +2.4%" */}
              {activePoint && (
                <div 
                  className="absolute z-20 pointer-events-none transition-all duration-150 ease-out transform -translate-x-1/2"
                  style={{
                    left: `${(activePoint.x / svgWidth) * 100}%`,
                    top: `${Math.max(10, (activePoint.y / svgHeight) * 100 - 32)}%`
                  }}
                >
                  <div className="bg-[var(--ink)] text-white text-[11px] font-medium px-2.5 py-1 rounded-[var(--radius-pill)] shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <span>{activePoint.pt.date}</span>
                    <span className="opacity-40">•</span>
                    <span className="font-semibold">{activePoint.pt.formattedValue}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      activePoint.pt.isPositive ? 'bg-[#34C77B]/25 text-[#34C77B]' : 'bg-[#E5484D]/25 text-[#E5484D]'
                    }`}>
                      {activePoint.pt.delta}
                    </span>
                  </div>
                </div>
              )}

              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-52 sm:h-60 overflow-visible select-none"
              >
                <defs>
                  {/* Subtle area gradient under line */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((factor) => {
                  const y = paddingY + innerHeight * (1 - factor);
                  return (
                    <line
                      key={factor}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="var(--border-subtle)"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area fill */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Dark line (--ink) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Vertical guide line on active point */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={paddingY}
                    x2={activePoint.x}
                    y2={svgHeight - paddingY}
                    stroke="var(--ink)"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    className="opacity-40"
                  />
                )}

                {/* Highlighted point dot using --accent-primary */}
                {activePoint && (
                  <g>
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="6"
                      fill="var(--accent-primary)"
                      className="transition-all duration-150 shadow-sm"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="2.5"
                      fill="#FFFFFF"
                    />
                  </g>
                )}

                {/* Transparent overlay hit areas for hover interaction */}
                {points.map((p, idx) => (
                  <rect
                    key={idx}
                    x={p.x - 20}
                    y={0}
                    width={40}
                    height={svgHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                ))}

                {/* X-axis time labels */}
                {points.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-[var(--text-secondary)] font-medium"
                  >
                    {p.pt.label}
                  </text>
                ))}
              </svg>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
                <span>Direct Telemetry Scada v4.18</span>
                <span className="inline-flex items-center gap-1 text-[var(--status-success)] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                  Live Metrology Feed
                </span>
              </div>
            </div>
          </Card>

        </div>

        {/* ======================================================================= */}
        {/* === RIGHT COLUMN (~30% Width, lg:col-span-3, Stack of 3 Cards) ======= */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* --- CARD 1: AI INSIGHT CARD (Shop Advisor equivalent) --------------- */}
          <Card padding="md" className="space-y-3 relative overflow-hidden group">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  CarbonFlow Advisor
                </div>
                <h3 className="text-[14px] font-semibold text-[var(--ink)] leading-snug">
                  {insight?.title || (userRole === 'buyer' ? 'Requirement Match Analysis' : 'Listing Performance Analysis')}
                </h3>
              </div>
            </div>

            <p className="text-[12px] text-[var(--text-secondary-accessible)] leading-relaxed">
              {insight?.insight || 'Sufficient data is not yet available to generate insights.'}
            </p>

            <div className="pt-1">
              <button
                onClick={() => alert('Opening algorithmic optimization recommendation details...')}
                className="text-[12px] font-semibold text-[var(--ink)] hover:text-[var(--accent-primary)] flex items-center justify-between w-full transition-colors pt-1 border-t border-[var(--border-subtle)]"
              >
                <span>Learn More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>

          {/* --- CARD 2: LISTINGS / MATCHES SUMMARY CARD (Products card mirror) -- */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                {userRole === 'buyer' ? 'Requirement Matches' : 'Supply Listings'}
              </h3>
              <button
                onClick={onOpenMarketplace}
                className="text-[11px] font-semibold text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
              >
                <span>See All</span>
                <span>→</span>
              </button>
            </div>

            {/* 3 Simple Rows: Label left, Count right */}
            <div className="space-y-2.5 pt-1">
              {summaryBreakdown.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1 text-[13px] transition-colors"
                >
                  <span className="text-[var(--text-secondary-accessible)] font-medium">
                    {row.label}
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--ink)] bg-[var(--surface-muted)] px-2.5 py-0.5 rounded-[var(--radius-pill)]">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* --- CARD 3: RECENT ACTIVITY FEED CARD (Recent Activities mirror) ----- */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                Recent Activity
              </h3>
              <button
                onClick={() => alert('Viewing all recent clearing activity logs...')}
                className="text-[11px] font-semibold text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
              >
                <span>See All</span>
                <span>→</span>
              </button>
            </div>

            {/* Activity Rows with small avatar-left layout */}
            {recentActivities.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Activity updates will appear once counterparty inquiries begin."
              />
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {recentActivities.map((act) => (
                  <div key={act.id} className="py-2.5 flex items-start gap-2.5 first:pt-0 last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-semibold text-[var(--ink)] shrink-0 mt-0.5">
                      {act.avatar}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[12px] text-[var(--text-primary)] leading-snug">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-[var(--text-secondary)] block">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>

    </div>
  );
};

export default DashboardContent;
