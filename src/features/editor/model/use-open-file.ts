import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '@/entities/editor';

export const useOpenFile = () => {
  const openTab = useEditorStore(s => s.openTab);
  const setScrollTarget = useEditorStore(s => s.setScrollTarget);

  const openFile = async (path: string, name: string, line?: number) => {
    try {
      const content = await invoke<string>('read_file_content', { path });
      
      openTab({
        id: path,
        title: name,
        content,
        isDirty: false
      });

      if (line) setScrollTarget({ path, line });
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  return { openFile };
};