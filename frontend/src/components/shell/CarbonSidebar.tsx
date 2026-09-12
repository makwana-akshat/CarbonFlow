import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Settings, 
  LogOut,
  ChevronDown, 
  ChevronLeft, 
  Plus, 
  X,
  Map
} from 'lucide-react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getSupplierInquiries } from '../../services/api';
import { getOrders } from '../../services/orderApi';
import type { UserRole } from '../../types/dashboard';
import { useAppStore } from '../../store/useAppStore';

export interface CarbonSidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const CarbonSidebar: React.FC<CarbonSidebarProps> = ({
  className = '',
  onCloseMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  const {
    userRole,
    setUserRole,
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    showToast,
  } = useAppStore();

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut(() => navigate('/'));
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
    }
  };

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImpactOpen, setIsImpactOpen] = useState(true);

  // Auto-collapse on tablet screens (<1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

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
      color: 'bg-[var(--ink)] text-white',
    },
    supplier: {
      name: 'AeroCapture Synthetics',
      plan: 'Capture Node Verified',
      avatar: 'AC',
      color: 'bg-[var(--accent-primary)] text-white',
    },
    admin: {
      name: 'Gujarat Industrial Hub',
      plan: 'SCADA Regional Clearing',
      avatar: 'GI',
      color: 'bg-[var(--ink)] text-white',
    },
  }[userRole];

  const { data: supplierInquiries } = useQuery({
    queryKey: ['supplier-inquiries'],
    queryFn: async () => {
      const token = await getToken();
      if (!token || userRole !== 'supplier') return [];
      return getSupplierInquiries(token);
    },
    enabled: userRole === 'supplier',
  });

  // Fetch active orders for badge count
  const { data: activeOrdersData } = useQuery({
    queryKey: ['activeOrdersCount'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const res = await getOrders(token);
      return res.items || [];
    }
  });
  const activeOrdersCount = activeOrdersData 
    ? activeOrdersData.filter((o: any) => o.status !== 'cancelled' && o.status !== 'delivered').length 
    : 0;

  // Role-Aware Main Navigation Items with strictly unique paths
  const mainNavItems: NavItemConfig[] = userRole === 'buyer' ? [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/marketplace', label: 'Marketplace', icon: Store, badge: 'Live' },
    { path: '/app/maps', label: 'Maps', icon: Map },
    { path: '/app/requirements', label: 'My Requirements', icon: FileText },
    { path: '/app/recommendations', label: 'AI Recommendations', icon: Sparkles, badge: '98%' },
    { path: '/app/procurement-plans', label: 'Procurement Plans', icon: FolderKanban },
    { path: '/app/orders', label: 'Orders', icon: Inbox, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { path: '/app/logistics', label: 'Logistics', icon: Truck },
  ] : [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/my-supply', label: 'My CO₂ Supply', icon: Factory },
    { path: '/app/marketplace', label: 'Marketplace', icon: Store, badge: 'Live' },
    { path: '/app/maps', label: 'Maps', icon: Map },
    { path: '/app/buyer-requests', label: 'Buyer Requests', icon: Users, badge: supplierInquiries ? supplierInquiries.length : 0 },
    { path: '/app/recommendations', label: 'AI Recommendations', icon: Sparkles, badge: '94%' },
    { path: '/app/orders', label: 'Orders', icon: Inbox, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { path: '/app/logistics', label: 'Logistics', icon: Truck },
  ];

  // Impact & Reporting items with unique paths
  const impactNavItems: NavItemConfig[] = [
    { path: '/app/carbon-impact', label: 'Carbon Impact', icon: Leaf },
    { path: '/app/alerts', label: 'Alerts & SCADA', icon: Bell, badge: '2' },
    { path: '/app/audit-contracts', label: 'Audit Contracts', icon: ShieldCheck },
  ];

  // Single source of truth active state derived strictly from useLocation()
  const isActive = (path: string) => {
    if (path === '/app/dashboard') {
      return (
        location.pathname === '/app' ||
        location.pathname === '/app/' ||
        location.pathname === '/app/dashboard' ||
        location.pathname === '/app/overview'
      );
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div
      className={`h-full flex flex-col justify-between bg-[var(--surface-card)] border-r border-[var(--border-subtle)] transition-all duration-300 relative select-none ${
        isSidebarCollapsed ? 'w-[72px] px-2 py-3' : 'w-[250px] sm:w-[260px] p-3'
      }`}
    >
      {/* Edge Collapse Toggle Button (desktop only) */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xs items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-all z-30 focus-visible:outline-none"
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isSidebarCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Top Section: Org Switcher + Search + Nav (scrolls internally ONLY if overflowing) */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-0">
        {/* 1. TOP: ORG SWITCHER */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-[var(--radius-chip)] hover:bg-[var(--surface-muted)] transition-colors text-left group ${
              isSidebarCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center font-semibold text-[13px] shrink-0 shadow-xs ${orgDetails.color}`}
              >
                {orgDetails.avatar}
              </div>

              {!isSidebarCollapsed && (
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

            {!isSidebarCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--ink)] transition-transform duration-150 shrink-0 ${
                  isOrgDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {/* Org & Role Switcher Dropdown */}
          {isOrgDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOrgDropdownOpen(false)}
              />
              <div className="absolute top-12 left-0 w-64 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Switch Persona / Org
                </div>

                {[
                  {
                    role: 'buyer' as UserRole,
                    org: 'Tata Steel Cleantech',
                    subtitle: 'Industrial Offtake Buyer',
                  },
                  {
                    role: 'supplier' as UserRole,
                    org: 'AeroCapture Synthetics',
                    subtitle: 'DAC & Biogenic Plant',
                  },
                  {
                    role: 'admin' as UserRole,
                    org: 'Gujarat Industrial Hub',
                    subtitle: 'Regional Clearing Authority',
                  },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setUserRole(item.role);
                      setIsOrgDropdownOpen(false);
                      showToast(`Switched persona to ${item.org} (${item.role} mode)`);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-[var(--radius-chip)] text-left transition-colors ${
                      userRole === item.role
                        ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                        : 'hover:bg-[var(--surface-muted)]/50 text-[var(--text-secondary-accessible)]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-[var(--ink)] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {item.role.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] leading-snug">{item.org}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{item.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 2. SEARCH / QUICK JUMP (⌘K) */}
        <div>
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)]/70 hover:bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary-accessible)] transition-colors select-none ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Search projects, facilities, contracts (⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Search</span>}
            </div>
            {!isSidebarCollapsed && (
              <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-secondary)] bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded shadow-2xs">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* 3. MAIN NAVIGATION */}
        <div className="flex flex-col gap-0.5 pt-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-[var(--radius-pill)] text-[13px] transition-all duration-150 text-left ${
                  active
                    ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink)] font-medium'
                } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--text-secondary)] group-hover:text-[var(--ink)]'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-subtle)] shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. EXPANDABLE SECTION GROUPS: Impact & Reporting */}
        {!isSidebarCollapsed && (
          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="space-y-0.5">
              <div className="group flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <button
                  type="button"
                  onClick={() => setIsImpactOpen(!isImpactOpen)}
                  className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors text-left"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      isImpactOpen ? '' : '-rotate-90'
                    }`}
                  />
                  <span>Impact & Reporting</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('New Carbon Report generator queued')}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-opacity"
                  title="Generate Carbon Report"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isImpactOpen && (
                <div className="flex flex-col gap-0.5 pl-3">
                  {impactNavItems.map((sub) => {
                    const active = isActive(sub.path);
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.path}
                        type="button"
                        onClick={() => handleNavClick(sub.path)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors text-left ${
                          active
                            ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold shadow-2xs'
                            : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <SubIcon
                            className={`w-3.5 h-3.5 transition-colors ${
                              active
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-secondary)]'
                            }`}
                          />
                          <span className="truncate">{sub.label}</span>
                        </div>

                        {sub.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--status-danger)]/10 text-[var(--status-danger)]">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM PINNED SECTION: Settings & Logout */}
      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 mt-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => handleNavClick('/app/settings')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors text-left ${
              isActive('/app/settings')
                ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]'
            } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            title="Settings"
          >
            <Settings className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors text-left text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)] hover:text-[var(--status-danger)] group ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--status-danger)] shrink-0 transition-colors" />
            {!isSidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* 6. SEARCH MODAL OVERLAY (⌘K) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/40 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsSearchModalOpen(false)}
          />
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
                type="button"
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
                {
                  title: 'My CO₂ Supply (Supplier Streams)',
                  action: () => handleNavClick('/app/my-supply'),
                },
                {
                  title: 'Marketplace — Spot Listings',
                  action: () => handleNavClick('/app/marketplace'),
                },
                {
                  title: 'Logistics Route Planning',
                  action: () => handleNavClick('/app/logistics'),
                },
                {
                  title: 'Alerts & SCADA Monitoring',
                  action: () => handleNavClick('/app/alerts'),
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
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
      {/* Desktop Fixed Height Sidebar */}
      <aside className={`hidden md:flex shrink-0 h-full select-none ${className}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer (<768px) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-[270px] h-full bg-[var(--surface-card)] shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[14px] text-[var(--ink)]">CARBONFLOW</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
                  Menu
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
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
