import React from 'react';
import type { TransportModeId, ModeEligibility } from './types';
import { Truck, GitCommit, Factory, Info, Check } from 'lucide-react';

interface ModeSelectorPanelProps {
  modes: ModeEligibility[];
  selectedModeId: TransportModeId;
  onSelectMode: (modeId: TransportModeId) => void;
  className?: string;
  hideHeader?: boolean;
}

export const ModeSelectorPanel: React.FC<ModeSelectorPanelProps> = ({
  modes,
  selectedModeId,
  onSelectMode,
  className = '',
  hideHeader = false,
}) => {
  const getModeIcon = (type: ModeEligibility['iconType']) => {
    switch (type) {
      case 'pipeline':
        return <GitCommit className="w-4 h-4 text-[#F4611E] rotate-90" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-[#F4611E]" />;
      case 'onsite':
        return <Factory className="w-4 h-4 text-[#F4611E]" />;
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      {!hideHeader && (
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">
              Transport Mode
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Routing Engine • Auto-Assay
            </p>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            Specification Gating
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2.5 w-full">
        {modes.map((mode) => {
          const isSelected = selectedModeId === mode.modeId;
          const isEligible = mode.isEligible;

          return (
            <button
              key={mode.modeId}
              disabled={!isEligible}
              onClick={() => isEligible && onSelectMode(mode.modeId)}
              className={`w-full text-left rounded-xl p-3 border transition-all relative overflow-hidden group ${
                !isEligible
                  ? 'border-gray-200/60 bg-gray-50/50 opacity-60 cursor-not-allowed text-gray-400'
                  : isSelected
                  ? 'border-[#F4611E] bg-[#FFF7ED] shadow-sm ring-1 ring-[#F4611E]/30'
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-900 cursor-pointer shadow-2xs'
              }`}
            >
              {/* Active / Selected Indicator Bar */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F4611E]" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#F4611E]/15 border-[#F4611E]/30 text-[#F4611E]'
                        : isEligible
                        ? 'bg-gray-50 border-gray-200 group-hover:border-gray-300 text-gray-700'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}
                  >
                    {getModeIcon(mode.iconType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13px] font-semibold tracking-tight ${
                          isSelected ? 'text-gray-900 font-bold' : isEligible ? 'text-gray-800' : 'text-gray-400'
                        }`}
                      >
                        {mode.name}
                      </span>
                      {mode.isRecommended && isEligible && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F4611E] text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-tight ${isEligible ? 'text-gray-500' : 'text-gray-400'}`}>
                      {mode.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#F4611E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Ineligibility Reason Callout */}
              {!isEligible && mode.ineligibilityReason && (
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-start gap-1.5 text-[11px] text-amber-700">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span className="leading-snug font-medium">
                    {mode.ineligibilityReason}
                  </span>
                </div>
              )}

              {/* Eligible Cost Baseline */}
              {isEligible && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Avg. Carrier Benchmark</span>
                  <span className="font-semibold text-gray-900">
                    ₹{mode.estimatedBaseCostPerTon}/t
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
