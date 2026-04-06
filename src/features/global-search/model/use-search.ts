import { invoke } from '@tauri-apps/api/core';
import { useSearchStore } from '@/entities/search';
import { useLayoutStore } from '@/entities/layout';
import { useRef } from 'react';

export const useSearch = () => {
  const { setResults, setSearching } = useSearchStore();
  const projectPath = useLayoutStore(s => s.projectPath);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeSearch = (val: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!val || val.length < 2) {
      setResults([]);
      return;
    }

    // Дебаунс 300мс — золотой стандарт для поиска
    timeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await invoke<any[]>('search_in_files', { 
          projectPath, 
          query: val 
        });
        setResults(data);
      } catch (e) {
        console.error("Search failed:", e);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  return { executeSearch };
};