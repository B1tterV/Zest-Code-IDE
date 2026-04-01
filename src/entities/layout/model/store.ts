import { create } from 'zustand';

interface LayoutState {
  activeActivityId: string;
  isSidebarVisible: boolean;
  projectPath: string | null;
  
  // Actions
  setActivity: (id: string) => void;
  toggleSidebar: (force?: boolean) => void;
  setProjectPath: (path: string | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeActivityId: 'explorer',
  isSidebarVisible: true,
  projectPath: null,

  setActivity: (id) => set((state) => {
    if (state.activeActivityId === id) {
      return { isSidebarVisible: !state.isSidebarVisible };
    }
    return { activeActivityId: id, isSidebarVisible: true };
  }),

  toggleSidebar: (force) => set((state) => ({ 
    isSidebarVisible: force !== undefined ? force : !state.isSidebarVisible 
  })),

  setProjectPath: (path) => set({ projectPath: path }),
}));