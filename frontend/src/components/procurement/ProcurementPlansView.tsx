import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@clerk/clerk-react';
import { getMyRequirements } from '../../services/marketplaceApi';

export const ProcurementPlansView: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;
      
      const reqs = await getMyRequirements(token);
      setPlans(reqs || []);
    } catch (err) {
      console.error('Failed to fetch procurement plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-[18px] font-bold text-[var(--ink)]">
              Strategic Procurement Plans
            </h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
            Quarterly and annual industrial CO₂ feedstock allocation targets, corridor schedules, and multi-supplier quotas.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/app/requirements')}>
          + New Allocation Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[var(--text-secondary)]">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <FolderKanban className="w-8 h-8 text-[var(--text-secondary)] mb-3 opacity-50" />
          <h3 className="text-[15px] font-semibold text-[var(--ink)] mb-1">No Procurement Plans</h3>
          <p className="text-[13px] text-[var(--text-secondary-accessible)]">Click '+ New Allocation Plan' to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {plans.map((plan) => {
            const plannedVolume = plan.volume_needed || 0;
            const securedVolume = plan.secured_volume || 0;
            const percentage = plannedVolume > 0 ? Math.min(100, Math.round((securedVolume / plannedVolume) * 100)) : 0;
            const corridors = plan.contracted_corridors && plan.contracted_corridors.length > 0 
              ? `${plan.contracted_corridors.length} Contracted Corridors (${plan.contracted_corridors.join(', ')})`
              : 'No Contracted Corridors';
            
            // Map statuses appropriately
            let statusBadge = '';
            if (plan.status === 'active') {
              statusBadge = <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#34C77B]/10 text-[var(--status-success)]">Active</span>;
            } else if (plan.status === 'fulfilled') {
              statusBadge = <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#34C77B]/10 text-[var(--status-success)]">Fulfilled</span>;
            } else if (plan.status === 'cancelled') {
              statusBadge = <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--status-danger)]/10 text-[var(--status-danger)]">Cancelled</span>;
            } else {
              statusBadge = <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#F5A623]/10 text-[var(--status-warning)]">Under Review</span>;
            }
            
            const targetDate = plan.required_by_date 
              ? new Date(plan.required_by_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A';

            return (
              <div key={plan.id} className="p-4 rounded-[var(--radius-chip)] bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-2 hover:border-[var(--border-strong)] transition-colors">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[14px] text-[var(--ink)] truncate pr-2">{plan.title || 'Untitled Plan'}</span>
                  {statusBadge}
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] truncate">
                  Planned Volume: {plannedVolume.toLocaleString()} t · {corridors}
                </p>
                <div className="w-full bg-[var(--surface-muted)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--accent-primary)] h-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary-accessible)]">
                  <span>{securedVolume.toLocaleString()} t Secured ({percentage}%)</span>
                  <span>Target: {targetDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
