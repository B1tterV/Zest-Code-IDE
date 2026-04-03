import { create } from 'zustand';
import { FileNode } from './types';

interface FileState {
  tree: FileNode[];
  isCreating: 'file' | 'folder' | null;

  setTree: (tree: FileNode[]) => void;
  toggleFolder: (path: string, children?: FileNode[]) => void;
  setCreating: (type: 'file' | 'folder' | null) => void;
}

export const useFileStore = create<FileState>((set) => ({
  tree: [],
  isCreating: null,

  setTree: (tree) => set({ tree }),
  toggleFolder: (path, children) => set((state) => ({
    tree: updateRecursive(state.tree, path, children)
  })),
  setCreating: (type) => set({ isCreating: type }),
}));

function updateRecursive(nodes: FileNode[], path: string, children?: FileNode[]): FileNode[] {
  return nodes.map(node => {
    if (node.path === path) {
      return { ...node, isOpen: !node.isOpen, children: children || node.children };
    }
    if (node.children) {
      return { ...node, children: updateRecursive(node.children, path, children) };
    }
    return node;
  });
}