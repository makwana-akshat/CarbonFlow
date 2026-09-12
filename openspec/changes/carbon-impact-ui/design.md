## Context

CarbonFlow is a B2B marketplace and operations clearinghouse for industrial carbon capture, transport, and utilization. The application runs a React 19 + Vite + TypeScript frontend. Users need an environmental provenance interface that tracks the progression of CO₂ through the network without defaulting to generic ESG tropes or disconnected analytics.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated `/app/carbon-impact` interface and sidebar entry.
- Implement the 5-stage CO₂ Journey (Captured → Listed → Matched → Transported → Utilized) with conversion metrics.
- Support deep inspection of stages and regions via modals/drawers.
- Render responsive data visualizations using Recharts (monthly volume trend) and custom horizontal bar distribution (utilization by application).
- Provide regional breakdown across key industrial corridors (Hazira, Dahej, Ahmedabad, etc.).
- Deliver a reactive state management layer using React Context (`CarbonImpactContext`).
- Keep existing global AI assistant orb visible and unhindered.

**Non-Goals:**
- No backend/FastAPI endpoints or Supabase migrations.
- No live SCADA, telemetry, or industrial IoT integration.
- No third-party carbon offset credit certification claims.
- No separate AI assistant workspace or chat replacement.

## Decisions

1. **State Architecture**: Scoped React Context (`CarbonImpactProvider` + `useCarbonImpact`).
   - *Rationale*: Eliminates prop drilling across the 8 visual components while avoiding new package dependencies like Redux/Zustand.
   - *Alternatives considered*: Props drilling (too brittle), Zustand (adds extra dependency).

2. **Centralized Mock Data**: Single structured file `src/data/carbonImpactMock.ts`.
   - *Rationale*: Prepares clean domain contracts for future backend API integration.

3. **Restrained Visual Language**:
   - Strict use of CarbonFlow CSS tokens (`--paper`, `--surface-card`, `--ink`, `--accent-primary`).
   - Minimalist Recharts styling with muted grid lines, zero neon gradients, and accessible tooltips.

4. **Navigation Integration**:
   - Sidebar tab `Carbon Impact` mapped to TabId `'carbon-impact'`.
   - Direct URL route `/app/carbon-impact` supported in React Router.

## Risks / Trade-offs

- **[Risk]** Large bundle from extra charting components.
  - *Mitigation*: Reuse installed `recharts` and tree-shake subcomponents.
- **[Risk]** Mobile overflow on horizontal process visualizations.
  - *Mitigation*: Responsive CSS switches journey flow to vertical timeline on `< 768px` screens.
- **[Risk]** Misinterpretation of platform metrics as verified carbon credits.
  - *Mitigation*: Prominent, low-emphasis methodology disclaimer at bottom explaining platform-reported status.
