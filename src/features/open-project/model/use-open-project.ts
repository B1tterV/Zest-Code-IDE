import { invoke } from '@tauri-apps/api/core';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';

export const useOpenProject = () => {
  const setProject = useLayoutStore((s) => s.setProject);
  const { loadInitial } = useLoadTree();

  const openProject = async () => {
    try {
      const path = await invoke<string | null>('open_project_picker');
      
      if (path) {
        const dependencies = await invoke<string[]>('get_project_stack', { path });
        
        setProject(path, dependencies);
        
        await loadInitial(path);
        
        console.log(`Project initialized at: ${path}. Stack: ${dependencies.join(', ')}`);
      }
    } catch (error) {
      console.error("Failed to open folder:", error);
    }
  };

  return { openProject };
};