import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import type { MarketPricePoint, SupplyDemandPoint } from '../../types/dashboard';

interface MarketOverviewProps {
  priceData: MarketPricePoint[];
  supplyDemandData: SupplyDemandPoint[];
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  priceData,
  supplyDemandData
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('May');

  // Custom minimalist tooltip conforming to design tokens
  const CustomPriceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] p-2.5 rounded-[var(--radius-chip)] shadow-[var(--shadow-card)] text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
            {label} 2026
          </div>
          <div className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">
            ${payload[0].value.toFixed(2)}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]"> / ton</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            Index benchmark: ${payload[0].payload.benchmark.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] p-2.5 rounded-[var(--radius-chip)] shadow-[var(--shadow-card)] text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
            {label} 2026 Volume
          </div>
          <div className="flex items-center gap-3 mt-1 text-[12px]">
            <div>
              <span className="text-[var(--text-secondary)]">Supply: </span>
              <span className="font-semibold text-[var(--text-primary)]">{payload[0]?.value}k t</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)]">Demand: </span>
              <span className="font-semibold text-[var(--accent-primary)]">{payload[1]?.value}k t</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section aria-labelledby="market-overview-heading" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="market-overview-heading" className="type-heading text-[var(--text-primary)]">
            Market Overview
          </h2>
          <p className="type-body text-[13px] text-[var(--text-secondary-accessible)]">
            Live European CO₂ Liquefaction Index & Regional Supply-Demand Volumes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Line Chart for Price Trend ($/ton) */}
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  Delivered CO₂ Index
                </h3>
              </div>
              <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
                Spot weighted avg (Rotterdam/Antwerp Hub)
              </p>
            </div>
            <div className="text-right">
              <span className="type-data-stat text-[22px] text-[var(--text-primary)]">
                $41.80
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] block">
                May 2026 close
              </span>
            </div>
          </div>

          <div className="h-[200px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activeLabel) setSelectedMonth(String(e.activeLabel));
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E3DF" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#E5E3DF' }}
                  tick={{ fill: '#8A8A85', fontSize: 12 }}
                />
                <YAxis
                  domain={[30, 46]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#8A8A85', fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomPriceTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#16171A"
                  strokeWidth={2.25}
                  dot={(props: any) => {
                    const isSelected = props.payload.month === selectedMonth;
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={isSelected ? 5 : 3}
                        fill={isSelected ? '#F4611E' : '#FFFFFF'}
                        stroke={isSelected ? '#F4611E' : '#16171A'}
                        strokeWidth={isSelected ? 3 : 1.75}
                      />
                    );
                  }}
                  activeDot={{ r: 6, fill: '#F4611E', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
            <span>Historical range: $34.20 - $41.80/t</span>
            <span className="font-medium text-[var(--accent-primary)]">+22.2% 8-mo trend</span>
          </div>
        </div>

        {/* Chart 2: Bar Chart for Supply & Demand (Monochrome with --accent-primary on selected point) */}
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  Supply vs Demand Balance
                </h3>
              </div>
              <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
                Total monthly contracted & requested capacity (k tonnes)
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary-accessible)]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D1D0CB]" />
                Supply
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent-primary)]" />
                Selected ({selectedMonth})
              </span>
            </div>
          </div>

          <div className="h-[200px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supplyDemandData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activeLabel) setSelectedMonth(String(e.activeLabel));
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E3DF" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#E5E3DF' }}
                  tick={{ fill: '#8A8A85', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#8A8A85', fontSize: 11 }}
                  tickFormatter={(val) => `${val}k`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                
                {/* Supply Bar: Monochrome neutral with --accent-primary on selected point */}
                <Bar dataKey="supply" radius={[4, 4, 0, 0]}>
                  {supplyDemandData.map((entry) => {
                    const isSelected = entry.month === selectedMonth;
                    return (
                      <Cell
                        key={`cell-supply-${entry.month}`}
                        fill={isSelected ? '#F4611E' : '#D1D0CB'}
                        opacity={isSelected ? 1 : 0.65}
                      />
                    );
                  })}
                </Bar>

                {/* Demand Bar: Monochrome darker tone */}
                <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                  {supplyDemandData.map((entry) => {
                    const isSelected = entry.month === selectedMonth;
                    return (
                      <Cell
                        key={`cell-demand-${entry.month}`}
                        fill={isSelected ? '#16171A' : '#A4A39F'}
                        opacity={isSelected ? 1 : 0.5}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
            <span>Selected month: <strong className="text-[var(--text-primary)]">{selectedMonth} 2026</strong></span>
            <span>Net Deficit: <strong className="text-[var(--status-danger)]">7,000 t</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};
