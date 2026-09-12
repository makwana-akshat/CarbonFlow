## Why

CarbonFlow connects CO₂ emitters, carriers, and utilization offtakers across regional industrial hubs. However, the application previously lacked a dedicated impact and reporting view that answers what environmental and physical volume impact CarbonFlow creates through captured, listed, matched, transported, and utilized CO₂. The new Carbon Impact page provides an industrial-grade provenance story for molecule mass balance and utilization tracking without vanity ESG metrics or AI-slop.

## What Changes

- Add complete `/app/carbon-impact` page and view within the CarbonFlow operations console.
- Wire the existing sidebar's "Impact & Reporting" -> "Carbon Impact" tab (`Leaf` icon) to activate this view.
- Introduce 4 primary platform metrics (CO₂ Captured, Listed, Matched, Utilized).
- Implement a 5-stage horizontal/vertical CO₂ Journey visualization with interactive deep-dive modals/drawers.
- Build two analytical visualizers: Recharts utilization trend over time (30D, 3M, 6M, 1Y) and a horizontal application breakdown bar chart.
- Create regional impact breakdown for Gujarat and surrounding industrial corridors (Ahmedabad, Hazira, Dahej, Jamnagar, Mundra, Surat).
- Display top contributors and recent verified impact movements feed.
- Embed platform impact summary and transparent methodology disclaimer.
- Introduce scoped React Context (`CarbonImpactContext`) with dynamic reactive filtering across dates and regions.

## Capabilities

### New Capabilities
- `carbon-impact-reporting`: Front-end reporting, state management, provenance journey visualization, and regional distribution for utilized industrial CO₂.

### Modified Capabilities
- None.

## Impact

- Frontend-only implementation in `frontend/src/components/impact/`, `frontend/src/context/`, and `frontend/src/data/carbonImpactMock.ts`.
- Navigation updates in `CarbonSidebar.tsx`, `CarbonFlowShell.tsx`, and `App.tsx`.
- Zero backend, SCADA, telemetry, or authentication modifications.
- Existing persistent global AI assistant orb preserved intact.
