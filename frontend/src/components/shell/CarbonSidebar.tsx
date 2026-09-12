import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Store, 
  FileText, 
  Sparkles, 
  FolderKanban, 
  Inbox, 
  Truck, 
  Factory, 
  Users, 
  Leaf, 
  Bell, 
  ShieldCheck, 
  Terminal, 
  Blocks, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  ChevronLeft, 
  Check, 
  X,
  Map
} from 'lucide-react';
import type { UserRole, TabId } from '../../types/dashboard';

export interface CarbonSidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export const CarbonSidebar: React.FC<CarbonSidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onChangeRole,
  isMobileOpen = false,
  onCloseMobile,
  className = '',
}) => {
  // Sidebar collapsed state (icon-only: ~72px vs expanded: ~250px)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable section groups state
  const [isImpactOpen, setIsImpactOpen] = useState(true);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(true);

  // Auto-collapse on tablet screens (<1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        // preserve user choice or expand
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Organization Info per Role
  const orgDetails = {
    buyer: {
      name: 'Tata Steel Cleantech',
      plan: 'Enterprise Offtake Pro',
      avatar: 'TS',
      color: 'bg-[var(--ink)] text-white'
    },
    supplier: {
      name: 'AeroCapture Synthetics',
      plan: 'Capture Node Verified',
      avatar: 'AC',
      color: 'bg-[var(--accent-primary)] text-white'
    },
    admin: {
      name: 'Gujarat Industrial Hub',
      plan: 'SCADA Regional Clearing',
      avatar: 'GI',
      color: 'bg-[var(--ink)] text-white'
    }
  }[userRole];

  // Role-Aware Main Navigation Items
  const mainNavItems = userRole === 'buyer' ? [
    { id: 'overview' as TabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace' as TabId, label: 'Marketplace', icon: Store, badge: 'Live' },
    { id: 'maps' as TabId, label: 'Maps', icon: Map },
    { id: 'requirements' as TabId, label: 'My Requirements', icon: FileText },
    { id: 'recommendations' as TabId, label: 'AI Recommendations', icon: Sparkles, badge: '98%' },
    { id: 'orders' as TabId, label: 'Procurement Plans', icon: FolderKanban },
    { id: 'orders' as TabId, label: 'Orders', icon: Inbox, badge: 3 },
    { id: 'logistics' as TabId, label: 'Logistics', icon: Truck },
  ] : [
    { id: 'overview' as TabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace' as TabId, label: 'My CO₂ Supply', icon: Factory },
    { id: 'marketplace' as TabId, label: 'Marketplace', icon: Store, badge: 'Live' },
    { id: 'maps' as TabId, label: 'Maps', icon: Map },
    { id: 'recommendations' as TabId, label: 'Buyer Requests', icon: Users, badge: 6 },
    { id: 'recommendations' as TabId, label: 'AI Recommendations', icon: Sparkles, badge: '94%' },
    { id: 'orders' as TabId, label: 'Orders', icon: Inbox, badge: 4 },
    { id: 'logistics' as TabId, label: 'Logistics', icon: Truck },
  ];

  const handleNavClick = (tabId: TabId) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between bg-[var(--surface-card)] border-r border-[var(--border-subtle)] transition-all duration-300 relative select-none ${
      isCollapsed ? 'w-[72px] px-2 py-3' : 'w-[250px] sm:w-[260px] p-3'
    }`}>
      
      {/* Edge Collapse Toggle Button (desktop only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-all z-30 focus-visible:outline-none"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Top Section: Org Switcher + Search + Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
        
        {/* ======================================================================= */}
        {/* 1. TOP: ORG SWITCHER ("Mob Shop ⌄" pattern) =========================== */}
        {/* ======================================================================= */}
        <div className="relative">
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-[var(--radius-chip)] hover:bg-[var(--surface-muted)] transition-colors text-left group ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Org Logo Icon */}
              <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center font-semibold text-[13px] shrink-0 shadow-xs ${orgDetails.color}`}>
                {orgDetails.avatar}
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold text-[var(--ink)] truncate leading-tight">
                    {orgDetails.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary-accessible)] truncate leading-tight mt-0.5">
                    {orgDetails.plan}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--ink)] transition-transform duration-150 shrink-0 ${
                isOrgDropdownOpen ? 'rotate-180' : ''
              }`} />
            )}
          </button>

          {/* Org & Role Switcher Dropdown */}
          {isOrgDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOrgDropdownOpen(false)} />
              <div className="absolute top-12 left-0 w-64 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Switch Organization
                </div>

                {[
                  { role: 'buyer' as UserRole, org: 'Tata Steel Cleantech', subtitle: 'Industrial Offtake Buyer' },
                  { role: 'supplier' as UserRole, org: 'AeroCapture Synthetics', subtitle: 'DAC & Biogenic Plant' },
                  { role: 'admin' as UserRole, org: 'Gujarat Industrial Hub', subtitle: 'Regional Clearing Authority' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      onChangeRole(item.role);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-[var(--radius-chip)] text-left text-[12px] transition-colors ${
                      userRole === item.role
                        ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-muted)]/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold leading-tight">{item.org}</div>
                      <div className="text-[11px] text-[var(--text-secondary-accessible)]">{item.subtitle}</div>
                    </div>
                    {userRole === item.role && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />}
                  </button>
                ))}

                <div className="border-t border-[var(--border-subtle)] pt-1.5 mt-1 px-2">
                  <button
                    onClick={() => {
                      alert('Create new organization workspace modal');
                      setIsOrgDropdownOpen(false);
                    }}
                    className="text-[12px] font-medium text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] flex items-center gap-1.5 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 2. COMPACT SEARCH INPUT WITH ⌘K SHORTCUT ============================== */}
        {/* ======================================================================= */}
        <div className="relative">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)]/70 hover:bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary-accessible)] transition-colors select-none ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Search projects, facilities, contracts (⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              {!isCollapsed && <span className="truncate">Search</span>}
            </div>
            {!isCollapsed && (
              <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-secondary)] bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded shadow-2xs">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* ======================================================================= */}
        {/* 3. MAIN NAVIGATION (Role-Aware, Filled --paper active pill) ============= */}
        {/* ======================================================================= */}
        <div className="flex flex-col gap-0.5 pt-1">
          {mainNavItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
                onClick={() => handleNavClick(item.id)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-[var(--radius-pill)] text-[13px] transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink)] font-medium'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[var(--ink)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--ink)]'
                  }`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-subtle)] shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================================= */}
        {/* 4. EXPANDABLE SECTION GROUPS (with chevron + "+" hover affordance) ====== */}
        {/* ======================================================================= */}
        {!isCollapsed && (
          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            
            {/* Group A: Impact & Reporting */}
            <div className="space-y-0.5">
              <div className="group flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <button
                  onClick={() => setIsImpactOpen(!isImpactOpen)}
                  className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors text-left"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isImpactOpen ? '' : '-rotate-90'}`} />
                  <span>Impact & Reporting</span>
                </button>

                {/* "+" Affordance on hover to jump to sub-action */}
                <button
                  onClick={() => alert('New Report Generator queued')}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-opacity"
                  title="Generate Carbon Report"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isImpactOpen && (
                <div className="flex flex-col gap-0.5 pl-3">
                  {[
                    { id: 'ui-gallery' as TabId, label: 'Carbon Impact', icon: Leaf },
                    { id: 'overview' as TabId, label: 'Alerts & SCADA', icon: Bell, badge: '2' },
                    { id: 'orders' as TabId, label: 'Audit Contracts', icon: ShieldCheck }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleNavClick(sub.id)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink)] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <sub.icon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group B: Integrations */}
            <div className="space-y-0.5">
              <div className="group flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <button
                  onClick={() => setIsIntegrationsOpen(!isIntegrationsOpen)}
                  className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors text-left"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isIntegrationsOpen ? '' : '-rotate-90'}`} />
                  <span>Integrations</span>
                </button>

                {/* "+" Affordance on hover to jump to sub-action */}
                <button
                  onClick={() => alert('Connect External SCADA Telemetry Node')}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-opacity"
                  title="Add Integration"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isIntegrationsOpen && (
                <div className="flex flex-col gap-0.5 pl-3">
                  {[
                    { id: 'overview' as TabId, label: 'AI Assistant', icon: Terminal },
                    { id: 'ui-gallery' as TabId, label: 'API & Telemetry', icon: Blocks }
                  ].map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleNavClick(sub.id)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink)] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <sub.icon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span>{sub.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PINNED SECTION: Profile + Settings + Log out =================== */}
      {/* ========================================================================= */}
      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 mt-2">
        
        {/* User profile row ("Jenny Wilson / email" pattern) */}
        <button
          onClick={() => alert('Opening Account Settings for Jenny Wilson')}
          className={`w-full flex items-center justify-between p-2 rounded-[var(--radius-chip)] hover:bg-[var(--surface-muted)] transition-colors text-left ${
            isCollapsed ? 'justify-center p-1.5' : ''
          }`}
          title="Jenny Wilson • Operations Lead"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center font-semibold text-[12px] text-[var(--ink)] shrink-0">
              JW
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[var(--ink)] truncate leading-tight">
                  Jenny Wilson
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] truncate leading-tight mt-0.5">
                  j.wilson@carbonflow.io
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          )}
        </button>

        {/* Settings & Log out links */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <button
            onClick={() => onSelectTab('ui-gallery')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] transition-colors text-left ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => alert('Logged out of CarbonFlow session')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)] hover:text-[var(--status-danger)] transition-colors text-left ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. SEARCH MODAL OVERLAY (Triggered via ⌘K or Search Input) ============== */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/40 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsSearchModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-2xl overflow-hidden z-10">
            <div className="flex items-center px-4 border-b border-[var(--border-subtle)]">
              <Search className="w-4 h-4 text-[var(--text-secondary)] mr-3 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facilities, assays, contracts, corridors..."
                className="w-full py-3.5 bg-transparent text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none"
              />
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 max-h-72 overflow-y-auto space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                Quick Navigation
              </div>
              {[
                { title: 'Marketplace — Spot Listings', action: () => handleNavClick('marketplace') },
                { title: 'Recommended Matches (98.4%)', action: () => handleNavClick('recommendations') },
                { title: 'Active Rail Orders (ORD-8921)', action: () => handleNavClick('orders') },
                { title: 'Switch to Supplier Persona', action: () => onChangeRole('supplier') },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    setIsSearchModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-[var(--radius-chip)] text-left text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <span>{item.title}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">Jump →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className={`hidden md:block shrink-0 h-screen sticky top-0 z-30 ${className}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer (<768px) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-[270px] h-full bg-[var(--surface-card)] shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[14px] text-[var(--ink)]">CARBONFLOW</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">Menu</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarbonSidebar;
