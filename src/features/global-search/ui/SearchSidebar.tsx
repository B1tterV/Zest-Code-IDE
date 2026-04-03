import { FC, ChangeEvent, useMemo } from 'react';
import { useSearchStore } from '@/entities/search';
import { useSearch } from '../model/use-search';
import { useOpenFile } from '@/features/editor';
import { SearchResultItem } from './SearchResultItem';

export const SearchSidebar: FC = () => {
  const { query, setQuery, results, isSearching } = useSearchStore();
  const { executeSearch } = useSearch();
  const { openFile } = useOpenFile();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    executeSearch(val);
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, any[]> = {};
    results.forEach(res => {
      if (!groups[res.file_path]) groups[res.file_path] = [];
      groups[res.file_path].push(res);
    });
    return groups;
  }, [results]);

  return (
    <div className="flex flex-col h-full bg-second-content select-none overflow-hidden">
      <div className="p-4 flex flex-col gap-2 shrink-0">
        <div className="relative">
          <input
            autoFocus
            value={query}
            onChange={handleInputChange}
            placeholder="Search in project..."
            className="w-full bg-block/50 border border-border/60 hover:border-border focus:border-accent-teal/60 text-[12px] pl-2 pr-8 py-1.5 rounded-sm outline-none text-white/90"
          />
          {isSearching && (
            <div className="absolute right-2.5 top-2.5 w-2 h-2 bg-accent-teal rounded-full animate-pulse shadow-[0_0_8px_#256C68]" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-auto px-1 pb-2">
        {!isSearching && query.length > 0 && results.length === 0 && (
          <div className="p-8 text-[13px] text-inactive-gray italic text-center opacity-50">
            No results found.
          </div>
        )}

        {Object.entries(groupedResults).map(([filePath, matches]) => (
          <SearchResultItem 
            key={filePath} 
            filePath={filePath} 
            matches={matches} 
            onFileClick={openFile} 
          />
        ))}
      </div>
    </div>
  );
};