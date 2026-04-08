import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export const useSystemActions = () => {
  const copyPath = async (path: string) => {
    try {
      await writeText(path);
    } catch (e) {
      console.error(e);
    }
  };

  const revealInExplorer = async (path: string) => {
    try {
      await invoke('reveal_item_in_explorer', { path });
    } catch (e) {
      console.error(e);
    }
  };

  return { copyPath, revealInExplorer };
};