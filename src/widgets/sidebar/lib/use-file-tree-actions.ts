import { useFileStore } from '@/entities/file';
import { useLoadTree } from '@/features/file-explorer';
import { useDeleteFile } from '@/features/file-ops';

export const useFileTreeActions = () => {
  const { setRenaming, setCreating } = useFileStore();
  const { expandFolder } = useLoadTree();
  const { deleteItem } = useDeleteFile();

  const handleAction = (id: string, node: any) => {
    if (!node) return;

    switch (id) {
      case 'rename':
        setRenaming(node.path);
        break;
      case 'delete':
        deleteItem(node.path, node.name);
        break;
      case 'new_file':
        if (!node.isOpen) expandFolder(node.path);
        setCreating('file', node.path);
        break;
      case 'new_folder':
        if (!node.isOpen) expandFolder(node.path);
        setCreating('folder', node.path);
        break;
      default:
        console.warn(`Unknown action: ${id}`);
    }
  };

  return { handleAction };
};