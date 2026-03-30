export interface SidebarState {
  isVisible: boolean;
  width: number;
  title: string;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
  depth: number;
}