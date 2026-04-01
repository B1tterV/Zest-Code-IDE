import { invoke } from '@tauri-apps/api/core';
import { useLayoutStore } from '@/entities/layout';

export const useOpenProject = () => {
  const setProjectPath = useLayoutStore((s) => s.setProjectPath);

  const openProject = async () => {
    try {
      const path = await invoke<string | null>('open_project_picker');
      
      if (path) {
        setProjectPath(path);
        console.log("Opened project at:", path);
      }
    } catch (error) {
      console.error("Failed to open folder:", error);
    }
  };

  return { openProject };
};