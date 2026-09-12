import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Sparkles, CornerDownRight } from 'lucide-react';
import { SiriOrb, type OrbState } from './SiriOrb';
import { ChatMessage, type ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { TabId } from '../../types/dashboard';

export interface AssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: TabId;
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
}

export const AssistantDialog: React.FC<AssistantDialogProps> = ({
  isOpen,
  onClose,
  activeTab = 'overview',
  orbState,
  setOrbState,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I am CarbonFlow's operational AI assistant. Ask me about real-time SCADA telemetry, critical alerts, contract audit trails, or carbon utilization metrics.",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Context-aware suggested prompts based on activeTab
  const getContextualPrompts = () => {
    switch (activeTab) {
      case 'alerts':
        return [
          'Show critical alerts',
          'What is the biggest operational risk?',
          'Show delayed shipments',
        ];
      case 'audit-contracts':
        return [
          'Show pending contracts',
          'Which contracts were amended?',
          'Show recent approvals',
        ];
      case 'carbon-impact':
        return [
          'Show CO₂ utilization',
          'What changed this month?',
          'Top emitter contributors',
        ];
      case 'marketplace':
        return [
          'What is the current spot price?',
          'Show available DAC supply',
          'Find food-grade liquid CO₂',
        ];
      case 'logistics':
      case 'maps':
        return [
          'Show rail bottleneck locations',
          'Active shipments in Gujarat',
          'Estimate Hazira to Mumbai haul time',
        ];
      default:
        return [
          'Show critical alerts',
          'Show pending contracts',
          'Platform operations overview',
        ];
    }
  };

  const contextualPrompts = getContextualPrompts();

  // Isolated mock response service with context-aware responses
  const generateMockResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Alerts queries
    if (q.includes('critical alert') || q.includes('critical')) {
      return (
        'There are currently 2 CRITICAL alerts requiring attention:\n' +
        '• ALT-101 (Hazira Carbon Hub): CO₂ capture output is at 82% (expected 94%, -12% variance). Projected shortfall of ~180 t.\n' +
        '• ALT-106 (Mumbai Waste Recovery): Purity assay deviation measured at 96.2% (minimum standard ≥99.5%). Tanker loading has been quarantined.'
      );
    }

    if (q.includes('risk') || q.includes('operational risk')) {
      return (
        'The highest operational risk currently is the Ahmedabad Regional Shortage (ALT-102):\n' +
        '• Projected deficit of 1,600 t over the next 7 days due to concrete curing demand surge.\n' +
        '• Buffer tanks at Sabarmati terminal are at 18% capacity. Recommended action: Trigger spot procurement from Dahej rail corridor.'
      );
    }

    if (q.includes('delayed shipment') || q.includes('delayed') || q.includes('shipment')) {
      return (
        'Currently 2 shipments report delays:\n' +
        '• SHP-8924 (Mundra → Ahmedabad): Rail shunting delay near Viramgam (+3.5h, ETA 18:40, 320 t liquid CO₂).\n' +
        '• SHP-8931 (Hazira → Mumbai): Cryo truck delay on NH-48 (+2.0h, ETA 20:15, 54 t).'
      );
    }

    // Contracts queries
    if (q.includes('pending contract') || q.includes('pending')) {
      return (
        'There is 1 high-priority contract pending approval:\n' +
        '• CF-003 (Tata Steel Cleantech → CarbonChem Synthetics): 8,500 t committed volume (Value: ₹3.61 Cr, Rate: ₹4,250/t). Currently under buyer legal review for sulfur threshold tolerances.'
      );
    }

    if (q.includes('amend') || q.includes('version')) {
      return (
        '11 contracts currently have versioned amendments on record:\n' +
        '• CF-001 (ABC Cement → XYZ Fuels): Updated to v2 on 12 Sep 2026. Rate revised to ₹4,500/t for committed volume tier.\n' +
        '• CF-006 (Dahej ChemCorp → Mumbai BioFuels): Updated to v3 with marine monsoon demurrage terms capped at ₹25,000/day.'
      );
    }

    if (q.includes('approval') || q.includes('recent approval')) {
      return (
        'Recent contract approvals:\n' +
        '• CF-001 approved by XYZ Fuels Procurement Desk (12 Sep 2026, 10:42).\n' +
        '• CF-005 approved by Vadodara SynGas Management for 6,000 t rail unit train.\n' +
        '• Both have been cryptographically sealed under ISO 27913 custody standards.'
      );
    }

    // Carbon Impact queries
    if (q.includes('utilization') || q.includes('co2 utilization') || q.includes('impact')) {
      return (
        'CarbonFlow Cumulative Platform Impact:\n' +
        '• 52,400 t Captured across 127 industrial facilities\n' +
        '• 34,800 t Utilized (66.4% utilization rate)\n' +
        '• Top sectors: Concrete & Building Materials (38.5%), E-Fuels (24.2%), and Synthetic Chemicals (18.1%).'
      );
    }

    if (q.includes('what changed') || q.includes('month')) {
      return (
        'Month-over-month performance:\n' +
        '• Monthly utilized volume increased +14.2% (reaching 3,820 t in September).\n' +
        '• Custody transfer verification time dropped from 4.2h to 28 minutes via automated SCADA integration.'
      );
    }

    // Spot Price & Marketplace
    if (q.includes('price') || q.includes('spot') || q.includes('rate')) {
      return (
        'Western India CO₂ Spot Benchmark:\n' +
        '• Average spot price: ₹4,650/t (-₹350/t vs 30-day index)\n' +
        '• Food-grade liquid: ₹4,800 - ₹5,200/t\n' +
        '• Industrial point-source: ₹4,200 - ₹4,500/t\n' +
        '• DAC Net-Negative: ₹7,800/t.'
      );
    }

    // General fallback
    return (
      `I've analyzed your query regarding "${query}".\n` +
      'Currently, all 48 facilities and 22 logistics corridors are monitored under active SCADA telemetry. ' +
      'You can inspect detailed parameters in the Alerts & SCADA dashboard or audit counterparties in Audit Contracts.'
    );
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // 1. Orb transitions to "thinking" state
    setOrbState('thinking');

    // 2. Simulate AI processing time (700-1100ms)
    setTimeout(() => {
      const reply = generateMockResponse(text);
      const assistantMsg: ChatMessageItem = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // 3. Orb transitions to "speaking" state
      setOrbState('speaking');

      // 4. Return to "idle" state after speech interval
      setTimeout(() => {
        setOrbState('idle');
      }, 2200);
    }, 850);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help with your industrial CO₂ operations today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-left"
      role="dialog"
      aria-labelledby="assistant-title"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[var(--paper)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <SiriOrb size="sm" state={orbState} />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 id="assistant-title" className="text-xs font-bold text-[var(--ink)]">
                CarbonFlow AI
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-mono capitalize">
              {orbState === 'listening'
                ? 'Listening (en-IN)...'
                : orbState === 'thinking'
                  ? 'Analyzing SCADA Data...'
                  : orbState === 'speaking'
                    ? 'Transmitting Response...'
                    : `Context: ${activeTab.replace('-', ' ')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1 rounded hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
            title="Clear Chat History"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
            title="Close Assistant Panel"
            aria-label="Close assistant panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Suggested Quick Prompt Pills */}
        <div className="pt-2 space-y-1.5 border-t border-[var(--border-subtle)]/60">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-secondary)] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Suggested for {activeTab.replace('-', ' ')}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contextualPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--paper)] border border-[var(--border-subtle)] hover:border-[var(--ink)] text-[11px] text-[var(--ink)] transition-colors text-left flex items-center gap-1 shadow-2xs"
              >
                <CornerDownRight className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Text + Mic + Send */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={orbState === 'thinking'}
        onOrbStateChange={setOrbState}
      />
    </div>
  );
};
