import { create } from "zustand";

export interface TerminalInstance {
  id: string;
  title: string;
  pid?: number;
}

interface TerminalState {
  instances: TerminalInstance[];
  activeTerminalId: string | null;

  addTerminal: (instance: TerminalInstance) => void;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string | null) => void;
  updateTerminalPid: (id: string, pid: number) => void;
  clearAll: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  instances: [],
  activeTerminalId: null,

  addTerminal: (instance) =>
    set((state) => {
      if (state.instances.some((t) => t.id === instance.id)) return state;

      return {
        instances: [...state.instances, instance],
        activeTerminalId: instance.id,
      };
    }),

  removeTerminal: (id) =>
    set((state) => {
      const newInstances = state.instances.filter((t) => t.id !== id);

      let nextActiveId = state.activeTerminalId;
      if (state.activeTerminalId === id) {
        nextActiveId =
          newInstances.length > 0
            ? newInstances[newInstances.length - 1].id
            : null;
      }

      return {
        instances: newInstances,
        activeTerminalId: nextActiveId,
      };
    }),

  setActiveTerminal: (id) => set({ activeTerminalId: id }),

  updateTerminalPid: (id, pid) =>
    set((state) => ({
      instances: state.instances.map((t) => (t.id === id ? { ...t, pid } : t)),
    })),

  clearAll: () => set({ instances: [], activeTerminalId: null }),
}));
