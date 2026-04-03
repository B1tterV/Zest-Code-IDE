import { create } from 'zustand';

interface ClipboardState {
  sourcePath: string | null;
  mode: 'copy' | 'cut' | null;
  setCopy: (path: string) => void;
  setCut: (path: string) => void;
  clear: () => void;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  sourcePath: null,
  mode: null,
  setCopy: (path) => set({ sourcePath: path, mode: 'copy' }),
  setCut: (path) => set({ sourcePath: path, mode: 'cut' }),
  clear: () => set({ sourcePath: null, mode: null }),
}));