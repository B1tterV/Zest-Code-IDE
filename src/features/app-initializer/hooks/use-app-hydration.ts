import { useEffect } from 'react';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';

export const useAppHydration = () => {
  const projectPath = useLayoutStore(s => s.projectPath);
  const { loadInitial } = useLoadTree();

  useEffect(() => {
    if (projectPath) {
      console.log("Restoring workspace for:", projectPath);
      loadInitial(projectPath);
    }
  }, []);
};