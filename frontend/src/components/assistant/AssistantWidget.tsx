import React, { useState } from 'react';
import { SiriOrb, type OrbState } from './SiriOrb';
import { AssistantDialog } from './AssistantDialog';
import type { TabId } from '../../types/dashboard';

export interface AssistantWidgetProps {
  activeTab?: TabId;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({ activeTab = 'overview' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');

  return (
    <>
      {/* Floating Dialog */}
      <AssistantDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeTab={activeTab}
        orbState={orbState}
        setOrbState={setOrbState}
      />

      {/* Global Siri Orb Trigger (Fixed Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pointer-events-auto">
        {/* Subtle tooltip label shown on desktop hover if dialog closed */}
        {!isOpen && (
          <div className="hidden md:flex items-center px-2.5 py-1 bg-[var(--ink)] text-white text-[11px] font-medium rounded-full shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            CarbonFlow AI
          </div>
        )}

        <SiriOrb
          state={orbState}
          size="md"
          onClick={() => setIsOpen((prev) => !prev)}
          ariaLabel={isOpen ? 'Close CarbonFlow AI Assistant' : 'Open CarbonFlow AI Assistant'}
          className="shadow-xl"
        />
      </div>
    </>
  );
};
