import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
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
  const { getToken } = useAuth();
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



  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // 1. Orb transitions to "thinking" state
    setOrbState('thinking');

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not available.");

      const { chatWithAi } = await import('../../services/aiApi');
      const response = await chatWithAi(text, token);

      const assistantMsg: ChatMessageItem = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply || "I'm sorry, I couldn't understand that.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // 3. Orb transitions to "speaking" state
      setOrbState('speaking');

      // 4. Return to "idle" state after speech interval
      setTimeout(() => {
        setOrbState('idle');
      }, 2200);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMsg: ChatMessageItem = { 
        id: `ast-${Date.now()}`,
        text: "I encountered an error connecting to the AI service.", 
        sender: 'assistant', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, errorMsg]);
      setOrbState('idle');
    }
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
