import { invoke } from '@tauri-apps/api/core';
import { useFileStore } from '@/entities/file';

export const useLoadTree = () => {
  const { setTree, toggleFolder } = useFileStore();

  const loadInitial = async (path: string) => {
    const files = await invoke<any[]>('get_project_files', { path });
    setTree(files);
  };

  const expandFolder = async (path: string) => {
    const children = await invoke<any[]>('get_project_files', { path });
    toggleFolder(path, children);
  };

  return { loadInitial, expandFolder, collapseFolder: toggleFolder };
};