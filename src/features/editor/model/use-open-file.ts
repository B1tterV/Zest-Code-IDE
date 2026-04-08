import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '@/entities/editor';
import { open } from '@tauri-apps/plugin-dialog';

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

  const pickAndOpenFile = async () => {
    const selected = await open({
      multiple: false,
      directory: false,
    });

    if (selected && typeof selected === 'string') {
      const name = selected.split(/[\\/]/).pop() || 'Untitled';
      await openFile(selected, name);
    }
  };

  return { openFile, pickAndOpenFile };
};