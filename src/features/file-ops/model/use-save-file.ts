import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '@/entities/editor';

export const useSaveFile = () => {
  const { tabs, activeTabId, setSaved } = useEditorStore();

  const saveActiveFile = async () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeTab.isDirty) return;

    try {
      await invoke('save_file_content', { 
        path: activeTab.id, 
        content: activeTab.content 
      });
      setSaved(activeTab.id);
      console.log("File saved successfully");
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  return { saveActiveFile };
};