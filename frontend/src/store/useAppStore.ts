import { create } from 'zustand';
import type { UserRole } from '../types/dashboard';

interface AppState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set) => ({
  userRole: 'buyer',
  setUserRole: (role) => set({ userRole: role }),
  
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  
  isMobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  
  toastMessage: null,
  showToast: (msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: msg });
    toastTimer = setTimeout(() => {
      set({ toastMessage: null });
      toastTimer = null;
    }, 3500);
  },
  clearToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: null });
  },
}));
