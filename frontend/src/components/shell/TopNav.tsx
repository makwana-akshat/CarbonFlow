import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  RotateCw,
  Settings,
  Download,
  ChevronDown,
  Plus,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import type { UserRole, DashboardState, TabId, TabItem } from '../../types/dashboard';
import { NAVIGATION_TABS } from '../../constants/ui';

interface TopNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  dashboardState: DashboardState;
  onChangeState: (state: DashboardState) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onChangeRole,
  dashboardState,
  onChangeState,
  onRefresh,
  isRefreshing = false
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: React.ReactNode }> = {
    buyer: { title: 'Procurement Buyer', subtitle: 'Industrial Offtake', icon: <Building2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> },
    supplier: { title: 'Capture Supplier', subtitle: 'DAC & Biogenic Plant', icon: <ShieldCheck className="w-3.5 h-3.5 text-[var(--status-success)]" /> },
    admin: { title: 'Market Administrator', subtitle: 'Grid & Clearing House', icon: <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-primary)]" /> },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Brand Lockup (Terminal Inc style) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('overview')}
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-lg"
              title="CarbonFlow Operations"
            >
              {/* Black rounded-square icon-mark logo */}
              <div className="w-8 h-8 rounded-[8px] bg-[var(--text-primary)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="#FFFFFF" strokeWidth="2.75" strokeLinecap="round" />
                  <path d="M12 2C17.52 2 22 6.48 22 12C22 15.5 20.2 18.6 17.5 20.4" stroke="#F4611E" strokeWidth="2.75" strokeLinecap="round" strokeDasharray="3 3" />
                  <circle cx="12" cy="12" r="3.5" fill="#F4611E" />
                </svg>
              </div>
              
              {/* Wordmark */}
              <span className="font-semibold text-[15px] tracking-[0.12em] text-[var(--text-primary)] select-none">
                CARBONFLOW
              </span>
            </button>
            
          </div>

          {/* Center: Horizontal pill-shaped segmented tabs */}
          <nav className="flex-1 flex justify-center overflow-x-auto no-scrollbar py-1">
            <div className="inline-flex items-center p-1 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs shrink-0">
              {NAVIGATION_TABS.map((tab: TabItem) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`relative px-3.5 py-1.5 rounded-[var(--radius-pill)] text-[14px] font-medium transition-colors select-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                      isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {/* Active Tab Filled Light-Gray Pill Background with spring layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 rounded-[var(--radius-pill)] bg-[var(--surface-muted)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    <span className="relative z-10">{tab.label}</span>
                    
                    {/* Reference "+" dropdown indicator */}
                    {tab.hasDropdown && (
                      <span className="relative z-10 text-[11px] font-semibold text-[var(--text-secondary)] opacity-70 group-hover:opacity-100">
                        <Plus className="w-3 h-3 inline-block stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Dev Mode: Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setStateMenuOpen(false);
                }}
                className="h-9 px-3 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                title="Switch Active Role"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="capitalize">{userRole}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-150 ${roleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
                    Active System Persona
                  </div>
                  {(['buyer', 'supplier', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onChangeRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-[var(--radius-chip)] text-[13px] transition-colors ${
                        userRole === role
                          ? 'bg-[var(--surface-muted)] text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {roleLabels[role].icon}
                        <div>
                          <div className="capitalize">{role}</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">{roleLabels[role].subtitle}</div>
                        </div>
                      </div>
                      {userRole === role && <Check className="w-4 h-4 text-[var(--accent-primary)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dev Mode: State Switcher (Success, Loading, Empty, Error) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setStateMenuOpen(!stateMenuOpen);
                  setRoleMenuOpen(false);
                }}
                className={`h-9 px-2.5 rounded-[var(--radius-pill)] border text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-xs ${
                  dashboardState === 'success'
                    ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary-accessible)]'
                    : dashboardState === 'loading'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : dashboardState === 'empty'
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                    : 'bg-rose-50 border-rose-200 text-[var(--status-danger)]'
                }`}
                title="Preview View States"
              >
                <span className="text-[11px] opacity-60">State:</span>
                <span className="capitalize font-semibold">{dashboardState}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>

              {stateMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
                    UI States
                  </div>
                  {(['success', 'loading', 'empty', 'error'] as DashboardState[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onChangeState(st);
                        setStateMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-left rounded-[var(--radius-chip)] text-[12px] transition-colors ${
                        dashboardState === st
                          ? 'bg-[var(--surface-muted)] text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="capitalize">{st} View</span>
                      {dashboardState === st && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Circular icon buttons on --surface-muted */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-9 h-9 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              title="Refresh Operational Telemetry"
              aria-label="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
            </button>

            <button
              onClick={() => alert('Exporting active CO2 ledger and audit certificate...')}
              className="w-9 h-9 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              title="Export CO₂ Ledger & Manifests"
              aria-label="Export Data"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert('Opening Operations System Configuration...')}
              className="w-9 h-9 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              title="Platform Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Avatar + Name Chip */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[var(--border-subtle)]">
              <div className="w-9 h-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] font-semibold text-xs shrink-0">
                ER
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Elena Rostova</div>
                <div className="text-[11px] text-[var(--text-secondary-accessible)]">Terminal Lead</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
