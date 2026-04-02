import { useEffect } from 'react';
import { useLayoutStore } from '@/entities/layout';
import { useSaveFile } from '@/features/file-ops';
import { useCommandPalette } from '@/features/command-palette';

export const useGlobalHotkeys = () => {
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const { saveActiveFile } = useSaveFile();
  const openPalette = useCommandPalette((s) => s.open);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const isMod = event.ctrlKey || event.metaKey;

      // Ctrl + B: Toggle Sidebar
      if (isMod && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }

      // Ctrl + S: Save File
      if (isMod && event.key === 's') {
        event.preventDefault();
        saveActiveFile();
      }

      // Ctrl + P: Command Palette (Search Files)
      if (isMod && event.key === 'p') {
        event.preventDefault();
        openPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, saveActiveFile, openPalette]);
};