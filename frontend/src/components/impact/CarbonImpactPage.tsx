import React from 'react';
import { CarbonImpactProvider, useCarbonImpact } from '../../context/CarbonImpactContext';
import { ImpactHeader } from './ImpactHeader';
import { ImpactKpiRow } from './ImpactKpiRow';
import { CarbonJourney } from './CarbonJourney';
import { UtilizationTrendChart } from './UtilizationTrendChart';
import { ApplicationBreakdown } from './ApplicationBreakdown';
import { RegionalImpactSection } from './RegionalImpactSection';
import { TopContributorsTable } from './TopContributorsTable';
import { RecentActivityFeed } from './RecentActivityFeed';
import { ImpactSummaryBanner } from './ImpactSummaryBanner';
import { MethodologyFooter } from './MethodologyFooter';
import { CarbonJourneyStageModal } from './CarbonJourneyStageModal';
import { CheckCircle2, X } from 'lucide-react';

const CarbonImpactContent: React.FC = () => {
  const { toastMessage, dismissToast } = useCarbonImpact();

  return (
    <div className="space-y-8 relative">
      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-white px-4 py-3 rounded-[var(--radius-card)] shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <ImpactHeader />

      {/* 2. Primary 4-Metric Overview */}
      <ImpactKpiRow />

      {/* 3. CO₂ Provenance Journey */}
      <CarbonJourney />

      {/* 4. Dual Analytical Section: Utilization Trend & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <UtilizationTrendChart />
        <ApplicationBreakdown />
      </div>

      {/* 5. Regional Impact Distribution across Industrial Hubs */}
      <RegionalImpactSection />

      {/* 6. Dual Stakeholder Section: Top Contributors & Recent Physical Custody Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <TopContributorsTable />
        <RecentActivityFeed />
      </div>

      {/* 7. Platform Level Headline Summary */}
      <ImpactSummaryBanner />

      {/* 8. Methodology and Transparency Notice */}
      <MethodologyFooter />

      {/* Inspectable Stage Modal */}
      <CarbonJourneyStageModal />
    </div>
  );
};

export const CarbonImpactPage: React.FC = () => {
  return (
    <CarbonImpactProvider>
      <CarbonImpactContent />
    </CarbonImpactProvider>
  );
};

export default CarbonImpactPage;
