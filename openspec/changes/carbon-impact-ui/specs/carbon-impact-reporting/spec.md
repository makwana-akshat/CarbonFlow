## ADDED Requirements

### Requirement: Carbon Impact Provenance Journey
The system SHALL display the end-to-end journey of carbon across 5 distinct stages (Captured, Listed, Matched, Transported, Utilized) with progression conversion percentages and inspectable details.

#### Scenario: Inspecting a journey stage
- **WHEN** user clicks on the "MATCHED" stage in the CO₂ Journey
- **THEN** an inspection detail modal or drawer opens displaying active transactions, average purity, average distance, and completed vs pending breakdowns.

### Requirement: Reactive Time and Regional Filtering
The system SHALL dynamically recalculate overview KPIs, trend volumes, and regional distribution when the user toggles date range or regional filters.

#### Scenario: Toggling regional filter to an industrial hub
- **WHEN** user selects "Hazira Corridor" from the region selector
- **THEN** all KPI totals, the journey volumes, and the top contributor list filter to reflect Hazira activity.

### Requirement: Dual Analytical Visualizations
The system SHALL present a monthly utilization trend chart over time with period selectors, and a horizontal breakdown chart by utilization application sector.

#### Scenario: Switching trend chart period
- **WHEN** user toggles from 1Y to 3M on the utilization trend chart
- **THEN** the chart recalculates and renders the last 3 months of utilization data.

### Requirement: Industrial Context and Methodology Transparency
The system SHALL present top contributors, recent physical movements, and a transparent methodology notice indicating platform-reported metrics.

#### Scenario: Viewing methodology note
- **WHEN** user navigates to the footer of the impact page
- **THEN** a clear, calm disclaimer indicates that metrics represent platform-reported transaction volumes for demonstration purposes.
