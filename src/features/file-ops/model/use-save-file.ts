import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { useEditorStore } from '@/entities/editor';

export const useSaveFile = () => {
  const { tabs, activeTabId, setSaved, updateTabContent } = useEditorStore();

  const saveActiveFile = async () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeTab.isDirty) return;

    try {
      await invoke('save_file_content', { 
        path: activeTab.id, 
        content: activeTab.content 
      });
      setSaved(activeTab.id);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  const saveAs = async () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    const newPath = await save({
      defaultPath: activeTab.id,
      filters: [{ name: 'All Files', extensions: ['*'] }]
    });

    if (newPath) {
      await invoke('save_file_content', { path: newPath, content: activeTab.content });
      setSaved(activeTab.id); 
    }
  };

  const saveAll = async () => {
    const dirtyTabs = tabs.filter(t => t.isDirty);
    await Promise.all(dirtyTabs.map(tab => 
      invoke('save_file_content', { path: tab.id, content: tab.content })
        .then(() => setSaved(tab.id))
    ));
  };

  const revertFile = async () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;
    
    const freshContent = await invoke<string>('read_file_content', { path: activeTab.id });
    updateTabContent(activeTab.id, freshContent);
    setSaved(activeTab.id);
  };

  return { saveActiveFile, saveAs, saveAll, revertFile };
};