import React, { Fragment } from 'react';
import type { ShipmentStatus } from './types';
import { Check } from 'lucide-react';

interface StatusStepperProps {
  currentStatus: ShipmentStatus;
  className?: string;
}

const STEPS: { id: ShipmentStatus; label: string }[] = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'in-transit', label: 'In Transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'utilized', label: 'Utilized' },
];

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, className = '' }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className={`flex items-center justify-between w-full select-none ${className}`}>
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <Fragment key={step.id}>
            {/* Compact Step Node */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                  isCompleted
                    ? 'bg-[#34C77B] text-white'
                    : isCurrent
                    ? 'bg-[#F4611E] text-white ring-2 ring-[#F4611E]/20 shadow-xs'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight whitespace-nowrap ${
                  isCurrent
                    ? 'text-gray-900 font-bold'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Compact Connector Bar */}
            {idx < STEPS.length - 1 && (
              <div
                className={`h-[1.5px] flex-1 mx-1.5 rounded-full transition-all ${
                  idx < currentIndex ? 'bg-[#34C77B]' : 'bg-gray-200'
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
