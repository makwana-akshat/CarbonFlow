import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export interface PillTab {
  id: string;
  label: string;
  hasDropdown?: boolean;
}

export interface PillTabNavProps {
  tabs: PillTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  compact?: boolean;
}

export const PillTabNav: React.FC<PillTabNavProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  compact = false,
}) => {
  return (
    <nav className={`flex items-center overflow-x-auto no-scrollbar py-1 ${className}`}>
      <div className={`inline-flex items-center ${compact ? 'p-0.5' : 'p-1'} rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs shrink-0`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative ${compact ? 'px-3 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]'} rounded-[var(--radius-pill)] font-medium transition-colors select-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                isActive
                  ? 'text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="ui-active-tab-pill"
                  className="absolute inset-0 rounded-[var(--radius-pill)] bg-[var(--surface-muted)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.hasDropdown && (
                <span className="relative z-10 text-[10px] font-semibold text-[var(--text-secondary)] opacity-70">
                  <Plus className="w-3 h-3 inline-block stroke-[2.5]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export interface UserAvatarChipProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  className?: string;
}

export const UserAvatarChip: React.FC<UserAvatarChipProps> = ({
  name,
  role,
  avatarUrl,
  className = '',
}) => {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-9 h-9 rounded-full object-cover border border-[var(--border-subtle)] shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] font-semibold text-xs shrink-0">
          {getInitials(name)}
        </div>
      )}

      {(name || role) && (
        <div className="text-left leading-tight">
          <div className="text-[13px] font-semibold text-[var(--text-primary)]">{name}</div>
          {role && <div className="text-[11px] text-[var(--text-secondary-accessible)]">{role}</div>}
        </div>
      )}
    </div>
  );
};
