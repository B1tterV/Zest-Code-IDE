import { create } from 'zustand';
import type { EditorTab } from './types'
import { persist } from 'zustand/middleware';

interface EditorState {
  tabs: EditorTab[];
  openedIds: string[];
  activeTabId: string | null;
  scrollTarget: { path: string; line: number } | null;
  
  openTab: (tab: EditorTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, newContent: string) => void;
  setSaved: (id: string) => void;
  renameTab: (oldId: string, newId: string, newTitle: string) => void;
  setScrollTarget: (target: { path: string; line: number } | null) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      tabs: [],
      openedIds: [],
      activeTabId: null,
      scrollTarget: null,

      openTab: (tab) => set((state) => {
        const exists = state.tabs.find(t => t.id === tab.id);
        if (exists) return { activeTabId: tab.id };
        
        return { 
          tabs: [...state.tabs, tab],
          openedIds: [...state.openedIds, tab.id],
          activeTabId: tab.id 
        };
      }),

      setActiveTab: (id) => set({ activeTabId: id }),

      closeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter(t => t.id !== id);
        return {
          tabs: newTabs,
          openedIds: state.openedIds.filter(oid => oid !== id),
          activeTabId: state.activeTabId === id ? (newTabs[0]?.id || null) : state.activeTabId
        }
      }),

      updateTabContent: (id, content) => set((state) => ({
        tabs: state.tabs.map(t => t.id === id ? { ...t, content, isDirty: true } : t)
      })),

      setSaved: (id: string) => set((state) => ({
        tabs: state.tabs.map(t => 
          t.id === id ? { ...t, isDirty: false } : t
        )
      })),

      renameTab: (oldId: string, newId: string, newTitle: string) => set((state) => ({
        tabs: state.tabs.map(t => 
          t.id === oldId ? { ...t, id: newId, title: newTitle } : t
        ),
        openedIds: state.openedIds.map(id => id === oldId ? newId : id),
        activeTabId: state.activeTabId === oldId ? newId : state.activeTabId
      })),

      setScrollTarget: (scrollTarget) => set({ scrollTarget }),
    }),
    {
      name: 'zest-editor-storage',
    }
  )
);
