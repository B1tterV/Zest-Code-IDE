import { useEffect } from 'react';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';
import { loadLocalTypes, createATA } from '@/features/language-intelligence';
import { invoke } from '@tauri-apps/api/core';

export const useAppHydration = () => {
  const projectPath = useLayoutStore(s => s.projectPath);
  const { loadInitial } = useLoadTree();

  useEffect(() => {
    const initWorkspace = async () => {
      if (!projectPath) return;
      await loadInitial(projectPath);
      await loadLocalTypes(projectPath);
    try {
      const separator = projectPath.includes('\\') ? '\\' : '/';
      const pkgPath = `${projectPath}${separator}package.json`;

      const pkgContent = await invoke<string>('read_file_content', { path: pkgPath });
      const runATA = createATA();
      await runATA(pkgContent); 
      
      console.log("🚀 ATA sync started");
    } catch (e) {
      console.warn("⚠️ No package.json or ATA error", e);
    }
    };

    initWorkspace();
  }, [projectPath]);
};