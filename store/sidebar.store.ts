import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isOpen: boolean;
  toggleCollapsed: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isOpen: false,
  toggleCollapsed: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  setOpen: (open) => set({ isOpen: open }),
}));
