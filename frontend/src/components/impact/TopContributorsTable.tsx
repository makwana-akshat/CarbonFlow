import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { Award } from 'lucide-react';
import type { ContributorItem } from '../../types/impact';

export const TopContributorsTable: React.FC = () => {
  const { topContributors } = useCarbonImpact();

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[var(--ink)] tracking-tight">
            Top CarbonFlow Contributors
          </h3>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
            Volume Leaders
          </span>
        </div>
        <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
          Organizations and capture nodes clearing the highest verified offtake throughput.
        </p>
      </div>

      {/* Dense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
              <th className="pb-2 pl-1 font-mono">Rank</th>
              <th className="pb-2">Organization / Node</th>
              <th className="pb-2">Role</th>
              <th className="pb-2 text-right">Transactions</th>
              <th className="pb-2 pr-1 text-right">Utilized Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {topContributors.map((c: ContributorItem, idx: number) => {
              const rank = idx + 1;
              return (
                <tr key={c.id} className="hover:bg-[var(--surface-muted)]/40 transition-colors group">
                  {/* Rank */}
                  <td className="py-2.5 pl-1 font-mono font-bold text-[var(--text-secondary-accessible)]">
                    {rank <= 3 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--surface-muted)] text-[var(--ink)] text-[10px]">
                        {rank}
                      </span>
                    ) : (
                      <span className="pl-1 text-[11px]">{rank}</span>
                    )}
                  </td>

                  {/* Name & Location */}
                  <td className="py-2.5 pr-2">
                    <div className="font-semibold text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary-accessible)]">
                      {c.location}
                    </div>
                  </td>

                  {/* Role Tag */}
                  <td className="py-2.5 pr-2">
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      {c.roleType}
                    </span>
                  </td>

                  {/* Tx Count */}
                  <td className="py-2.5 text-right font-mono text-[var(--text-secondary-accessible)]">
                    {c.transactionsCount} tx
                  </td>

                  {/* Volume */}
                  <td className="py-2.5 pr-1 text-right font-mono font-bold text-[var(--ink)]">
                    {c.formattedTonnes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          Ranked by physical mass cleared through master offtake contracts
        </span>
      </div>
    </div>
  );
};
