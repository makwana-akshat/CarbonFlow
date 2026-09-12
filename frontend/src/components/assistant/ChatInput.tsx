import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, ArrowUp } from 'lucide-react';
import { useVoiceInput } from './useVoiceInput';
import type { OrbState } from './SiriOrb';

export interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  onOrbStateChange?: (state: OrbState) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  onOrbStateChange,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isSupported,
    isListening,
    error: voiceError,
    toggleListening,
  } = useVoiceInput({
    lang: 'en-IN',
    onTranscriptChange: (text: string) => {
      setInputText(text);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    },
    onStateChange: (listening: boolean) => {
      if (listening) {
        onOrbStateChange?.('listening');
      } else {
        onOrbStateChange?.('idle');
      }
    },
  });

  useEffect(() => {
    if (voiceError) {
      setVoiceNotice(voiceError);
      const timer = setTimeout(() => setVoiceNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (!isSupported) {
      setVoiceNotice("Voice input isn't supported in this browser — try Chrome or Edge.");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }
    toggleListening();
  };

  return (
    <div className="relative p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-card)] text-left">
      {/* Voice Warning Notice Popup */}
      {voiceNotice && (
        <div className="absolute -top-10 left-3 right-3 py-1.5 px-3 bg-[var(--ink)] text-white text-[11px] rounded-[var(--radius-md)] shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-1 z-30">
          <span className="truncate">{voiceNotice}</span>
          <button
            type="button"
            onClick={() => setVoiceNotice(null)}
            className="text-zinc-400 hover:text-white ml-2 text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Active Listening Indicator */}
      {isListening && (
        <div className="mb-2 flex items-center justify-between text-[11px] px-2 py-1 rounded bg-[#F4611E]/10 text-[#F4611E] font-medium animate-pulse">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F4611E]" />
            Listening (en-IN)... Speak now
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            Click mic to finish
          </span>
        </div>
      )}

      {/* Input container */}
      <div className="relative flex items-end gap-1.5 bg-[var(--paper)] border border-[var(--border-subtle)] focus-within:border-[var(--ink)] rounded-[var(--radius-card)] p-1.5 transition-colors">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask CarbonFlow..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent py-1.5 px-2 text-xs text-[var(--ink)] placeholder:text-[var(--text-secondary)] focus:outline-none max-h-28 leading-relaxed"
        />

        {/* Action icons: Microphone + Send */}
        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice dictation in en-IN'}
            title={
              !isSupported
                ? "Voice input isn't supported in this browser — try Chrome or Edge."
                : isListening
                  ? 'Stop listening'
                  : 'Dictate message (en-IN)'
            }
            className={`p-1.5 rounded-[var(--radius-md)] transition-all ${
              isListening
                ? 'bg-[#F4611E] text-white animate-pulse shadow-sm'
                : isSupported
                  ? 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)]'
                  : 'text-zinc-300 hover:text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isListening ? (
              <Mic className="w-3.5 h-3.5" />
            ) : !isSupported ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !inputText.trim()}
            aria-label="Send message to CarbonFlow AI"
            className={`p-1.5 rounded-[var(--radius-md)] transition-all ${
              inputText.trim() && !disabled
                ? 'bg-[var(--ink)] text-white hover:bg-[var(--accent-primary)] shadow-2xs'
                : 'text-[var(--text-secondary)]/50 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
