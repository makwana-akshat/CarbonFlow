import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  getImpactOverview,
  getImpactJourney,
  getImpactPlatformSummary,
  getImpactMonthlyUtilization,
  getImpactApplications,
  getImpactRegional,
  getImpactContributors,
  getImpactRecentActivity
} from '../services/impactApi';
import type {
  ImpactOverviewMetric,
  JourneyStage,
  MonthlyUtilizationData,
  ApplicationShare,
  RegionalImpactItem,
  ContributorItem,
  RecentActivityItem,
  PlatformSummaryStats,
} from '../data/carbonImpactMock'; // Keeping the types from the mock file

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
  isLoading: boolean;
  error: string | null;

  // Reactive Computed Data
  overviewMetrics: ImpactOverviewMetric[];
  journeyStages: JourneyStage[];
  monthlyTrend: MonthlyUtilizationData[];
  applicationShares: ApplicationShare[];
  regionalData: RegionalImpactItem[];
  topContributors: ContributorItem[];
  recentActivity: RecentActivityItem[];
  summaryStats: PlatformSummaryStats | null;

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
  fetchData: () => Promise<void>;
}

const CarbonImpactContext = createContext<CarbonImpactContextValue | undefined>(undefined);

export interface CarbonImpactProviderProps {
  children: ReactNode;
}

export const CarbonImpactProvider: React.FC<CarbonImpactProviderProps> = ({ children }) => {
  const { getToken } = useAuth();
  
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('1y');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [trendMetric, setTrendMetric] = useState<'utilized' | 'target'>('utilized');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [overviewMetrics, setOverviewMetrics] = useState<ImpactOverviewMetric[]>([]);
  const [journeyStages, setJourneyStages] = useState<JourneyStage[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyUtilizationData[]>([]);
  const [applicationShares, setApplicationShares] = useState<ApplicationShare[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalImpactItem[]>([]);
  const [topContributors, setTopContributors] = useState<ContributorItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [summaryStats, setSummaryStats] = useState<PlatformSummaryStats | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      
      const [
        overviewRes,
        journeyRes,
        summaryRes,
        monthlyRes,
        appsRes,
        regionalRes,
        contribsRes,
        activityRes
      ] = await Promise.all([
        getImpactOverview(token),
        getImpactJourney(token),
        getImpactPlatformSummary(token),
        getImpactMonthlyUtilization(token),
        getImpactApplications(token),
        getImpactRegional(token),
        getImpactContributors(token),
        getImpactRecentActivity(token)
      ]);

      setOverviewMetrics(overviewRes || []);
      setJourneyStages(journeyRes || []);
      setSummaryStats(summaryRes || null);
      setMonthlyTrend(monthlyRes || []);
      setApplicationShares(appsRes || []);
      setRegionalData(regionalRes || []);
      setTopContributors(contribsRes || []);
      setRecentActivity(activityRes || []);
      
    } catch (err: any) {
      console.error('Failed to load Carbon Impact data:', err);
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, regionFilter]); // Refetch if filters change (API currently returns all-time but could be updated)

  // Active Stage Detail
  const activeStageDetail = useMemo(() => {
    if (!selectedStageId) return null;
    return journeyStages.find((s) => s.id === selectedStageId) || null;
  }, [selectedStageId, journeyStages]);

  // Active Region Detail
  const activeRegionDetail = useMemo(() => {
    if (!selectedRegionId) return null;
    return regionalData.find((r) => r.id === selectedRegionId) || null;
  }, [selectedRegionId, regionalData]);

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
    isLoading,
    error,

    overviewMetrics,
    journeyStages,
    monthlyTrend,
    applicationShares,
    regionalData,
    topContributors,
    recentActivity,
    summaryStats,

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
    fetchData,
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
