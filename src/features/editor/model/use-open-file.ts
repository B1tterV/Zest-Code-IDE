import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '@/entities/editor';

export const useOpenFile = () => {
  const openTab = useEditorStore(s => s.openTab);

  const openFile = async (path: string, name: string) => {
    try {
      const content = await invoke<string>('read_file_content', { path });
      
      openTab({
        id: path,
        title: name,
        content,
        isDirty: false
      });
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  return { openFile };
};