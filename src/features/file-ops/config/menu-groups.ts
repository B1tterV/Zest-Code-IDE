import { MenuGroup } from "@/entities/menu";

export const getFileContextMenu = (isDir: boolean): MenuGroup[] => {
  const groups: (MenuGroup | null)[] = [
    {
      id: 'modification',
      items: [
        { id: 'rename', label: 'Rename', shortcut: 'Enter' },
        { id: 'delete', label: 'Delete', shortcut: 'Del' },
      ]
    },
    // Показываем создание только если это директория
    isDir ? {
      id: 'creation',
      items: [
        { id: 'new_file', label: 'New File' },
        { id: 'new_folder', label: 'New Folder' },
      ]
    } : null,
    {
      id: 'system',
      items: [
        { id: 'copy_path', label: 'Copy Path', shortcut: 'Ctrl+Shift+C' },
        { id: 'reveal_explorer', label: 'Reveal in File Explorer' },
      ]
    }
  ];

  return groups.filter((group): group is MenuGroup => group !== null);
};