import { create } from "zustand";
import type { EditorTab } from "./types";
import { persist } from "zustand/middleware";
import { DockviewApi } from "dockview";

interface EditorState {
  tabs: EditorTab[];
  openedIds: string[];
  activeTabId: string | null;
  scrollTarget: { path: string; line: number } | null;
  autoSaveEnabled: boolean;
  dockviewApi: DockviewApi | null;

  openTab: (tab: EditorTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, newContent: string) => void;
  setSaved: (id: string) => void;
  renameTab: (oldId: string, newId: string, newTitle: string) => void;
  setScrollTarget: (target: { path: string; line: number } | null) => void;
  setAutoSave: (enabled: boolean) => void;
  setDockviewApi: (api: DockviewApi) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      tabs: [],
      openedIds: [],
      activeTabId: null,
      scrollTarget: null,
      autoSaveEnabled: true,
      dockviewApi: null,

      openTab: (tab) =>
        set((state) => {
          const exists = state.tabs.find((t) => t.id === tab.id);
          if (exists) return { activeTabId: tab.id };

          return {
            tabs: [...state.tabs, tab],
            openedIds: [...state.openedIds, tab.id],
            activeTabId: tab.id,
          };
        }),

      setActiveTab: (id) => set({ activeTabId: id }),

      closeTab: (id: string) =>
        set((state) => {
          console.log('🔹 closeTab called with id:', id);
          console.log('🔹 Current tabs:', state.tabs.map(t => t.id));
          console.log('🔹 Current openedIds:', state.openedIds);
          
          const newTabs = state.tabs.filter((t) => t.id !== id);
          const newOpenedIds = state.openedIds.filter((oid) => oid !== id);
          
          console.log('🔹 New tabs:', newTabs.map(t => t.id));
          console.log('🔹 New openedIds:', newOpenedIds);
          
          // ✅ Проверка: действительно ли что-то изменилось?
          if (newTabs.length === state.tabs.length) {
            console.warn('⚠️ Tab NOT removed - ID mismatch?');
          }
          
          return {
            tabs: newTabs,
            openedIds: newOpenedIds,
            activeTabId:
              state.activeTabId === id
                ? newTabs[0]?.id || null
                : state.activeTabId,
          };
        }),

      updateTabContent: (id, content) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, content, isDirty: true } : t,
          ),
        })),

      setSaved: (id: string) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, isDirty: false } : t,
          ),
        })),

      renameTab: (oldId: string, newId: string, newTitle: string) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === oldId ? { ...t, id: newId, title: newTitle, isVirtual: false } : t,
          ),
          openedIds: state.openedIds.map((id) => (id === oldId ? newId : id)),
          activeTabId: state.activeTabId === oldId ? newId : state.activeTabId,
        })),

      setScrollTarget: (scrollTarget) => set({ scrollTarget }),
      
      setAutoSave: (autoSaveEnabled) => set({ autoSaveEnabled }),

      setDockviewApi: (api) => set({ dockviewApi: api })
    }),
    {
      name: "zest-editor-storage",
    },
  ),
);
