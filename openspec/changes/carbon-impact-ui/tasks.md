## 1. Centralized Mock Data & State Management

- [x] 1.1 Create `frontend/src/data/carbonImpactMock.ts` with structured impact datasets, regional data, and reactive filter helpers
- [x] 1.2 Create `frontend/src/context/CarbonImpactContext.tsx` providing scoped state (`timeRange`, `regionFilter`, active modal inspection, export feedback)

## 2. Provenance Journey & KPI Components

- [x] 2.1 Create `frontend/src/components/impact/ImpactHeader.tsx` with title, subtitle, and compact filter pills
- [x] 2.2 Create `frontend/src/components/impact/ImpactKpiRow.tsx` rendering the 4 primary platform metrics with trend indicators
- [x] 2.3 Create `frontend/src/components/impact/CarbonJourney.tsx` rendering the 5-stage flow (Captured → Listed → Matched → Transported → Utilized) with responsive layout
- [x] 2.4 Create `frontend/src/components/impact/CarbonJourneyStageModal.tsx` for deep stage inspection (transactions, purity, distance, status)

## 3. Analytical & Regional Visualizations

- [x] 3.1 Create `frontend/src/components/impact/UtilizationTrendChart.tsx` using Recharts with quiet industrial styling and period toggle
- [x] 3.2 Create `frontend/src/components/impact/ApplicationBreakdown.tsx` rendering horizontal bar distribution of CO₂ by industry application
- [x] 3.3 Create `frontend/src/components/impact/RegionalImpactSection.tsx` with interactive hub selector and detail card

## 4. Contributors, Activity, and Transparency

- [x] 4.1 Create `frontend/src/components/impact/TopContributorsTable.tsx` for key facilities and organizations
- [x] 4.2 Create `frontend/src/components/impact/RecentActivityFeed.tsx` for completed custody transfer events
- [x] 4.3 Create `frontend/src/components/impact/ImpactSummaryBanner.tsx` and `frontend/src/components/impact/MethodologyFooter.tsx`

## 5. Page Assembly & Application Shell Integration

- [x] 5.1 Create `frontend/src/components/impact/CarbonImpactPage.tsx` combining all components inside `CarbonImpactProvider`
- [x] 5.2 Update `frontend/src/types/dashboard.ts` to include `'carbon-impact'` in `TabId`
- [x] 5.3 Update `frontend/src/components/shell/CarbonSidebar.tsx` to link and highlight Carbon Impact under Impact & Reporting
- [x] 5.4 Update `frontend/src/components/shell/CarbonFlowShell.tsx` and `frontend/src/App.tsx` to support the `/app/carbon-impact` route and tab
- [x] 5.5 Run TypeScript check and production build (`npm run build`) to verify zero errors
