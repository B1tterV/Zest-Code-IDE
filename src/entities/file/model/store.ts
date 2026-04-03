import { create } from 'zustand';
import { FileNode } from './types';

interface FileState {
  tree: FileNode[];
  isCreating: 'file' | 'folder' | null;
  isRenaming: string | null;
  createPath: string | null;
  cutPath: string | null;

  setTree: (tree: FileNode[]) => void;
  toggleFolder: (path: string, children?: FileNode[]) => void;
  setCreating: (type: 'file' | 'folder' | null, path?: string | null) => void;
  removeNode: (path: string) => void;
  setRenaming: (path: string | null) => void;
  updateFolderChildren: (path: string, children: FileNode[]) => void;
  setCutPath: (path: string | null) => void;
}

export const useFileStore = create<FileState>((set) => ({
  tree: [],
  isCreating: null,
  isRenaming: null,
  createPath: null,
  cutPath: null,

  setTree: (tree) => set({ tree }),
  toggleFolder: (path, children) => set((state) => ({
    tree: updateRecursive(state.tree, path, children)
  })),
  setCreating: (type, path = null) => set({ isCreating: type, createPath: path }),
  removeNode: (path: string) => set((state) => ({
    tree: removeRecursive(state.tree, path)
  })),
  setRenaming: (path: string | null) => set({ isRenaming: path }),
  updateFolderChildren: (path, children) => set((state) => ({
    tree: patchRecursive(state.tree, path, children)
  })),
  setCutPath: (path) => set({ cutPath: path }),
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

function removeRecursive(nodes: FileNode[], targetPath: string): FileNode[] {
  return nodes
    .filter(node => node.path !== targetPath)
    .map(node => ({
      ...node,
      children: node.children ? removeRecursive(node.children, targetPath) : undefined
    }));
}

function patchRecursive(nodes: FileNode[], path: string, newChildren: FileNode[]): FileNode[] {
  return nodes.map(node => {
    if (node.path === path) {
      return { 
        ...node, 
        isOpen: node.isOpen,
        children: newChildren.map(newChild => {
          const existingChild = node.children?.find(c => c.path === newChild.path);
          return existingChild ? { ...newChild, isOpen: existingChild.isOpen, children: existingChild.children } : newChild;
        }) 
      };
    }
    if (node.children) {
      return { ...node, children: patchRecursive(node.children, path, newChildren) };
    }
    return node;
  });
}