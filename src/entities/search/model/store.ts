import { create } from 'zustand';

export interface SearchMatch {
  file_path: string;
  line_number: number;
  line_content: string;
}

interface SearchState {
  query: string;
  results: SearchMatch[];
  isSearching: boolean;
  
  setQuery: (q: string) => void;
  setResults: (r: SearchMatch[]) => void;
  setSearching: (v: boolean) => void;
  clearSearch: () => void;
  removeResultGroup: (filePath: string) => void;
  removeSingleMatch: (filePath: string, lineNumber: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isSearching: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setSearching: (isSearching) => set({ isSearching }),
  clearSearch: () => set({ query: '', results: [], isSearching: false }),
  removeResultGroup: (filePath) => set((state) => ({
    results: state.results.filter(r => r.file_path !== filePath)
  })),
  removeSingleMatch: (filePath, lineNumber) => set((state) => ({
    results: state.results.filter(r => !(r.file_path === filePath && r.line_number === lineNumber))
  })),
}));