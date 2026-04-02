import { create } from 'zustand';
import type { EditorTab } from './types'

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  
  openTab: (tab: EditorTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, newContent: string) => void;
  setSaved: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  tabs: [],
  activeTabId: null,

  openTab: (tab) => set((state) => {
    const exists = state.tabs.find(t => t.id === tab.id);
    if (exists) return { activeTabId: tab.id };
    
    return { 
      tabs: [...state.tabs, tab],
      activeTabId: tab.id 
    };
  }),

  setActiveTab: (id) => set({ activeTabId: id }),

  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== id);
    let nextActive = state.activeTabId;
    
    if (state.activeTabId === id) {
      nextActive = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }
    
    return { tabs: newTabs, activeTabId: nextActive };
  }),

  updateTabContent: (id: string, newContent: string) => set((state) => ({
    tabs: state.tabs.map(t => 
      t.id === id ? { ...t, content: newContent, isDirty: true } : t
    )
  })),

  setSaved: (id: string) => set((state) => ({
    tabs: state.tabs.map(t => 
      t.id === id ? { ...t, isDirty: false } : t
    )
  })),
}));