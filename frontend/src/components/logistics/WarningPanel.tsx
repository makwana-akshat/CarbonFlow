import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export interface WarningItem {
  id: string;
  type: 'warning' | 'danger';
  headline: string;
  detail: string;
}

interface WarningPanelProps {
  warnings: WarningItem[];
  className?: string;
}

export const WarningPanel: React.FC<WarningPanelProps> = ({
  warnings,
  className = '',
}) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-1.5 w-full ${className}`}
      role="region"
      aria-label="Active corridor advisories"
    >
      {warnings.map((warning) => {
        const isDanger = warning.type === 'danger';
        const borderColor = isDanger ? 'border-l-[#E5484D] border-red-200' : 'border-l-[#F5A623] border-amber-200';
        const iconColor = isDanger ? 'text-[#E5484D]' : 'text-[#D97706]';
        const bgColor = isDanger ? 'bg-red-50/70' : 'bg-amber-50/70';

        return (
          <div
            key={warning.id}
            className={`rounded-xl border border-l-3 ${borderColor} ${bgColor} px-2.5 py-2 shadow-2xs transition-all flex items-center gap-2 cursor-help`}
            title={`${warning.headline}: ${warning.detail}`}
          >
            <div className={`shrink-0 ${iconColor}`}>
              {isDanger ? (
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-gray-900 tracking-tight truncate block">
                {warning.headline}
              </span>
              <span className="text-[10px] text-gray-600 truncate block mt-0.2">
                {warning.detail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
