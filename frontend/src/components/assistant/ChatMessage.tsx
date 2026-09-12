import React from 'react';
import { SiriOrb } from './SiriOrb';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatMessageProps {
  message: ChatMessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-2.5 text-left ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Sender Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          <SiriOrb size="sm" state="idle" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2.5 rounded-[var(--radius-card)] text-xs leading-relaxed ${
            isUser
              ? 'bg-[var(--ink)] text-white rounded-br-xs'
              : 'bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border-subtle)] rounded-bl-xs'
          }`}
        >
          {/* Format bullet points or line breaks */}
          <div className="space-y-1.5 whitespace-pre-wrap">
            {message.text.split('\n').map((line, idx) => (
              <p key={idx} className={line.startsWith('•') ? 'pl-2 text-[11px]' : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        <div
          className={`text-[10px] font-mono text-[var(--text-secondary)] px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
