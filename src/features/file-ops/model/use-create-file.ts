import { useEditorStore } from '@/entities/editor';
import { save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { useFileStore } from '@/entities/file';

export const useCreateFile = () => {
  const { openTab, tabs } = useEditorStore();
  const { addNode } = useFileStore();

  const createNewTextFile = () => {
    const untitledCount = tabs.filter(t => t.title.startsWith('Untitled')).length;
    const id = `untitled-${Date.now()}`;
    
    openTab({
      id,
      title: `Untitled-${untitledCount + 1}.txt`,
      content: '',
      isDirty: false,
      isVirtual: true
    });
  };

  const createNewFileOnDisk = async () => {
    const path = await save({
      title: 'Create New File',
      filters: [{ name: 'All Files', extensions: ['*'] }]
    });

    if (path) {
      try {
        await invoke('save_file_content', { path, content: '' });
        
        const pathParts = path.split(/[\\/]/);
        const name = pathParts.pop() || 'file';
        const parentPath = pathParts.join('\\');

        openTab({
          id: path,
          title: name,
          content: '',
          isDirty: false,
          isVirtual: false
        });

        addNode(parentPath, {
          name,
          path,
          is_dir: false,
          is_ignored: false,
          isOpen: false,
        });
      } catch (e) {
        console.error("Failed to create file:", e);
      }
    }
  };

  return { createNewTextFile, createNewFileOnDisk };
};