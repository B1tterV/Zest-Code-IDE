import { FC, useState } from 'react';
import { useFileStore } from '@/entities/file';
import { useLoadTree } from '@/features/file-explorer';
import { useLayoutStore } from '@/entities/layout'
import { useOpenFile } from '@/features/editor';
import { FileCreationInput, getFileContextMenu, useDeleteFile, useRenameFile } from '@/features/file-ops';
import { DropdownMenu } from '@/entities/menu';
import { useFileTreeActions } from '../lib/use-file-tree-actions';
import { FileTreeNode } from './FileTreeNode';

export const FileTree: FC<{ nodes: any[]; level?: number }> = ({ nodes, level = 0 }) => {
  const isRenaming = useFileStore(s => s.isRenaming);
  const isCreating = useFileStore(s => s.isCreating);
	const detectedStack = useLayoutStore(s => s.detectedStack);
  const projectPath = useLayoutStore(s => s.projectPath);
  const createPath = useFileStore(s => s.createPath);

  const { expandFolder } = useLoadTree();
	const { openFile } = useOpenFile();
  const { deleteItem } = useDeleteFile();
  const toggleFolder = useFileStore(s => s.toggleFolder);
  const setRenaming = useFileStore(s => s.setRenaming);
  const { renameItem } = useRenameFile();
  const { handleAction } = useFileTreeActions();

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: any } | null>(null);

  const onMenuAction = (id: string) => {
    if (contextMenu) {
      handleAction(id, contextMenu.node);
      setContextMenu(null);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {level === 0 && isCreating && createPath === projectPath && (
        <FileCreationInput level={level} parentPath={projectPath} />
      )}

      {nodes.map((node) => (
        <div key={node.path} className="flex flex-col">
          <FileTreeNode 
            node={node}
            level={level}
            detectedStack={detectedStack}
            isRenaming={isRenaming}
            onOpen={() => {
              if (node.is_dir) node.isOpen ? toggleFolder(node.path) : expandFolder(node.path);
              else openFile(node.path, node.name);
            }}
            onContextMenu={(e) => {
              e.preventDefault(); e.stopPropagation();
              setContextMenu({ x: e.clientX, y: e.clientY, node });
            }}
            onRename={(newName) => {
              if (newName && newName !== node.name) renameItem(node.path, newName, projectPath!);
              setRenaming(null);
            }}
            onCancelRename={() => setRenaming(null)}
            onDelete={() => deleteItem(node.path, node.name)}
          />

          {node.isOpen && (
            <>
              {isCreating && createPath === node.path && (
                <FileCreationInput level={level + 1} parentPath={node.path} />
              )}
              {node.children && <FileTree nodes={node.children} level={level + 1} />}
            </>
          )}
        </div>
      ))}

      {contextMenu && (
        <DropdownMenu
          isOpen={true}
          onClose={() => setContextMenu(null)}
          groups={getFileContextMenu(contextMenu.node.is_dir)}
          onAction={onMenuAction}
          position={{ x: contextMenu.x, y: contextMenu.y }}
        />
      )}
    </div>
  );
};