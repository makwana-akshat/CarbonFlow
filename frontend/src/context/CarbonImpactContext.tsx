import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import {
  filterImpactData,
  type FilterOptions,
  type ImpactOverviewMetric,
  type JourneyStage,
  type MonthlyUtilizationData,
  type ApplicationShare,
  type RegionalImpactItem,
  type ContributorItem,
  type RecentActivityItem,
  type PlatformSummaryStats,
} from '../data/carbonImpactMock';

export type TimeRangeOption = '30d' | '3m' | '6m' | '1y' | 'all';

export interface CarbonImpactContextValue {
  // Current Filter State
  timeRange: TimeRangeOption;
  regionFilter: string;
  selectedStageId: string | null;
  selectedRegionId: string | null;
  trendMetric: 'utilized' | 'target';
  isExporting: boolean;
  toastMessage: string | null;

  // Reactive Computed Data
  overviewMetrics: ImpactOverviewMetric[];
  journeyStages: JourneyStage[];
  monthlyTrend: MonthlyUtilizationData[];
  applicationShares: ApplicationShare[];
  regionalData: RegionalImpactItem[];
  topContributors: ContributorItem[];
  recentActivity: RecentActivityItem[];
  summaryStats: PlatformSummaryStats;

  // Currently Inspected Entities
  activeStageDetail: JourneyStage | null;
  activeRegionDetail: RegionalImpactItem | null;

  // Actions
  setTimeRange: (range: TimeRangeOption) => void;
  setRegionFilter: (region: string) => void;
  selectStage: (stageId: string | null) => void;
  selectRegion: (regionId: string | null) => void;
  setTrendMetric: (metric: 'utilized' | 'target') => void;
  exportReport: (format: 'pdf' | 'csv') => Promise<void>;
  resetFilters: () => void;
  dismissToast: () => void;
}

const CarbonImpactContext = createContext<CarbonImpactContextValue | undefined>(undefined);

export interface CarbonImpactProviderProps {
  children: ReactNode;
}

export const CarbonImpactProvider: React.FC<CarbonImpactProviderProps> = ({ children }) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('1y');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [trendMetric, setTrendMetric] = useState<'utilized' | 'target'>('utilized');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Filtering: recomputes reactive datasets when filters change
  const computedData = useMemo(() => {
    const options: FilterOptions = {
      timeRange,
      regionFilter,
    };
    return filterImpactData(options);
  }, [timeRange, regionFilter]);

  // Active Stage Detail
  const activeStageDetail = useMemo(() => {
    if (!selectedStageId) return null;
    return computedData.journeyStages.find((s) => s.id === selectedStageId) || null;
  }, [selectedStageId, computedData.journeyStages]);

  // Active Region Detail
  const activeRegionDetail = useMemo(() => {
    if (!selectedRegionId) return null;
    return computedData.regionalData.find((r) => r.id === selectedRegionId) || null;
  }, [selectedRegionId, computedData.regionalData]);

  // Export Simulation
  const exportReport = async (format: 'pdf' | 'csv') => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsExporting(false);
    setToastMessage(`CarbonFlow Impact Audit Report (${format.toUpperCase()}) compiled and downloaded.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const resetFilters = () => {
    setTimeRange('1y');
    setRegionFilter('all');
    setSelectedStageId(null);
    setSelectedRegionId(null);
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  const value: CarbonImpactContextValue = {
    timeRange,
    regionFilter,
    selectedStageId,
    selectedRegionId,
    trendMetric,
    isExporting,
    toastMessage,

    overviewMetrics: computedData.overviewMetrics,
    journeyStages: computedData.journeyStages,
    monthlyTrend: computedData.monthlyTrend,
    applicationShares: computedData.applicationShares,
    regionalData: computedData.regionalData,
    topContributors: computedData.topContributors,
    recentActivity: computedData.recentActivity,
    summaryStats: computedData.summaryStats,

    activeStageDetail,
    activeRegionDetail,

    setTimeRange,
    setRegionFilter,
    selectStage: setSelectedStageId,
    selectRegion: setSelectedRegionId,
    setTrendMetric,
    exportReport,
    resetFilters,
    dismissToast,
  };

  return (
    <CarbonImpactContext.Provider value={value}>
      {children}
    </CarbonImpactContext.Provider>
  );
};

export function useCarbonImpact(): CarbonImpactContextValue {
  const context = useContext(CarbonImpactContext);
  if (!context) {
    throw new Error('useCarbonImpact must be used within a CarbonImpactProvider');
  }
  return context;
}
