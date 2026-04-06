import { useEditorStore } from '@/entities/editor';
import { useClipboardStore, useFileStore } from '@/entities/file';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';
import { useDeleteFile, useSystemActions } from '@/features/file-ops';
import { invoke } from '@tauri-apps/api/core';

export const useFileTreeActions = () => {
  const projectPath = useLayoutStore(s => s.projectPath);

  const { setRenaming, setCreating, updateFolderChildren, setCutPath, setTree } = useFileStore();
  const { renameTab } = useEditorStore.getState();
  const { copyPath, revealInExplorer } = useSystemActions();
  const { setCopy, setCut } = useClipboardStore();
  const { expandFolder } = useLoadTree();
  const { deleteItem } = useDeleteFile();

  const handleAction = async (id: string, node: any) => {
    if (!node) return;

    switch (id) {
      case 'rename': setRenaming(node.path); break;
      case 'delete': deleteItem(node.path, node.name); break;
      case 'new_file':
        if (!node.isOpen) expandFolder(node.path);
        setCreating('file', node.path);
        break;
      case 'new_folder':
        if (!node.isOpen) expandFolder(node.path);
        setCreating('folder', node.path);
        break;
      case 'copy_path': copyPath(node.path); break;
      case 'reveal_explorer': revealInExplorer(node.path); break;
      case 'copy':
        setCopy(node.path);
        setCutPath(null);
        break;
      case 'cut': 
        setCut(node.path); 
        setCutPath(node.path);
        break;
      case 'paste': {
        const { sourcePath, mode, clear: clearClipboard } = useClipboardStore.getState();
        const { updateFolderChildren, setCutPath } = useFileStore.getState();
        const projectPath = useLayoutStore.getState().projectPath;

        if (!sourcePath || !mode || !projectPath) break;

        const fileName = sourcePath.split(/[\\/]/).filter(Boolean).pop();
        const separator = node.path.includes('\\') ? '\\' : '/';
        const newPath = `${node.path.replace(/[\\/]$/, '')}${separator}${fileName}`;

        try {
          const command = mode === 'cut' ? 'rename_file_item' : 'copy_file_item';
          await invoke(command, { oldPath: sourcePath, newPath });

          const updatedTargetFiles = await invoke<any[]>('get_project_files', { path: node.path });
          updateFolderChildren(node.path, updatedTargetFiles);

          if (mode === 'cut') {
            const sourceParent = sourcePath.replace(/[\\/][^\\/]+$/, '') || projectPath;
            const updatedSourceFiles = await invoke<any[]>('get_project_files', { path: sourceParent });
            
            if (sourceParent === projectPath) {
              setTree(updatedSourceFiles.map(newN => {
                  const oldN = useFileStore.getState().tree.find(o => o.path === newN.path);
                  return oldN ? { ...newN, isOpen: oldN.isOpen, children: oldN.children } : newN;
              }));
            } else {
              updateFolderChildren(sourceParent, updatedSourceFiles);
            }
            
            setCutPath(null);
            clearClipboard();
          }
        } catch (e) { console.error(e); }
        break;
      }
      default: console.warn(`Unknown action: ${id}`);
    }
  };

  return { handleAction };
};