import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '@/entities/editor';
import { useLoadTree } from '@/features/file-explorer';

export const useRenameFile = () => {
  const renameTab = useEditorStore(s => s.renameTab);
  const { loadInitial } = useLoadTree();

  const renameItem = async (oldPath: string, newName: string, projectPath: string) => {
    const pathParts = oldPath.split(/[\\/]/);
    pathParts.pop();
    const newPath = [...pathParts, newName].join(oldPath.includes('\\') ? '\\' : '/');

    try {
      await invoke('rename_file_item', { oldPath, newPath });
      renameTab(oldPath, newPath, newName);
      await loadInitial(projectPath);
    } catch (e) {
      console.error("Rename failed:", e);
    }
  };

  return { renameItem };
};