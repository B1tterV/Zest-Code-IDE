import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  activeActivityId: string;
  isSidebarVisible: boolean;
  projectPath: string | null;
  detectedStack: string[];
  
  // Actions
  setActivity: (id: string) => void;
  toggleSidebar: (force?: boolean) => void;
  setProject: (path: string, deps: string[]) => void;
  resetProject: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      activeActivityId: 'explorer',
      isSidebarVisible: true,
      projectPath: null,
      detectedStack: [],

      setActivity: (id) => set((state) => {
        if (state.activeActivityId === id) {
          return { isSidebarVisible: !state.isSidebarVisible };
        }
        return { activeActivityId: id, isSidebarVisible: true };
      }),

      toggleSidebar: (force) => set((state) => ({ 
        isSidebarVisible: force !== undefined ? force : !state.isSidebarVisible 
      })),

      setProject: (path, deps) => set({ 
        projectPath: path, 
        detectedStack: deps,
        activeActivityId: 'explorer',
        isSidebarVisible: true 
      }),

      resetProject: () => set({ 
        projectPath: null, 
        detectedStack: [], 
        isSidebarVisible: false 
      }),
    }),
    {
      name: 'zest-layout-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        projectPath: state.projectPath, 
        detectedStack: state.detectedStack 
      }),
    }
  )
);

export const getProjectName = (path: string | null) => {
  if (!path) return 'No Folder Opened';
  const cleanPath = path.replace(/[\\/]$/, '');
  return cleanPath.split(/[\\/]/).pop() || cleanPath;
};