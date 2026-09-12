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
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (_, idx) => idx,
  emptyMessage = 'No matching data available',
  className = '',
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortOrder]);

  return (
    <div className={`w-full overflow-x-auto border border-[var(--border-subtle)] rounded-[var(--radius-card)] bg-[var(--surface-card)] shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-card)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3.5 px-4 type-label text-[var(--text-secondary-accessible)] font-semibold select-none ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)] rounded"
                  >
                    <span>{col.header}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ) : (
                  <span>{col.header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-[var(--text-secondary)] text-[14px]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                onClick={() => onRowClick && onRowClick(row, idx)}
                className={`hover:bg-[var(--surface-muted)]/50 transition-colors text-[14px] text-[var(--text-primary)] ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3.5 px-4 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row, idx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1.5 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 px-3 rounded-[var(--radius-pill)] text-[12px] font-medium transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
              isActive
                ? 'bg-[var(--accent-primary)] text-white font-semibold'
                : 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export interface MiniLineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export const MiniLineChart: React.FC<MiniLineChartProps> = ({
  data,
  height = 160,
  valueFormatter = (v) => `${v}`,
  className = '',
}) => {
  const lastIndex = data.length - 1;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--border-subtle)' }} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickFormatter={valueFormatter} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] p-2 rounded-[var(--radius-chip)] shadow-[var(--shadow-card)] text-xs">
                    <span className="text-[var(--text-secondary)] block">{label}</span>
                    <strong className="text-[var(--text-primary)]">{valueFormatter(Number(payload[0].value))}</strong>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--text-primary)"
            strokeWidth={2}
            dot={(props: any) => {
              const isLast = props.index === lastIndex;
              return (
                <circle
                  key={props.key}
                  cx={props.cx}
                  cy={props.cy}
                  r={isLast ? 4.5 : 2.5}
                  fill={isLast ? 'var(--accent-primary)' : 'var(--surface-card)'}
                  stroke={isLast ? 'var(--accent-primary)' : 'var(--text-primary)'}
                  strokeWidth={isLast ? 2.5 : 1.5}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface MiniBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  height = 160,
  valueFormatter = (v) => `${v}`,
  className = '',
}) => {
  const lastIndex = data.length - 1;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--border-subtle)' }} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickFormatter={valueFormatter} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] p-2 rounded-[var(--radius-chip)] shadow-[var(--shadow-card)] text-xs">
                    <span className="text-[var(--text-secondary)] block">{label}</span>
                    <strong className="text-[var(--text-primary)]">{valueFormatter(Number(payload[0].value))}</strong>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((_, idx) => (
              <Cell
                key={`bar-cell-${idx}`}
                fill={idx === lastIndex ? 'var(--accent-primary)' : '#D1D0CB'}
                opacity={idx === lastIndex ? 1 : 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface MatchScoreBarProps {
  /** Metric category label, e.g. "Purity Assay" or "Route Latency" */
  label: string;
  /** Percentage value from 0 to 100 */
  value: number;
  className?: string;
}

export const MatchScoreBar: React.FC<MatchScoreBarProps> = ({
  label,
  value,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-medium text-[var(--text-secondary-accessible)]">{label}</span>
        <span className="font-semibold text-[var(--text-primary)]">{clampedValue}%</span>
      </div>
      <div className="h-2 w-full bg-[var(--surface-muted)] rounded-full overflow-hidden border border-[var(--border-subtle)]/60">
        <div
          className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
