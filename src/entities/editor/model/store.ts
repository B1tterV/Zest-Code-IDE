import { create } from 'zustand';
import type { EditorTab } from './types'

interface EditorState {
  tabs: EditorTab[];
  openedIds: string[];
  activeTabId: string | null;
  
  openTab: (tab: EditorTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, newContent: string) => void;
  setSaved: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  tabs: [],
  openedIds: [],
  activeTabId: null,

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
}));