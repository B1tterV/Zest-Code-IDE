import { MenuGroup } from "@/entities/menu";

export const getFileContextMenu = (isDir: boolean): MenuGroup[] => {
  const groups: (MenuGroup | null)[] = [
    isDir ? {
      id: 'creation',
      items: [
        { id: 'new_file', label: 'New File' },
        { id: 'new_folder', label: 'New Folder' },
      ]
    } : null,
    {
      id: 'clipboard_basic',
      items: [
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        ...(isDir ? [{ id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' }] : []),
      ]
    },
    {
      id: 'system',
      items: [
        { id: 'copy_path', label: 'Copy Path', shortcut: 'Ctrl+Shift+C' },
        { id: 'reveal_explorer', label: 'Reveal in File Explorer' },
      ]
    },
    {
      id: 'modification',
      items: [
        { id: 'rename', label: 'Rename', shortcut: 'Enter' },
        { id: 'delete', label: 'Delete', shortcut: 'Del' },
      ]
    },
  ];

  return groups.filter((group): group is MenuGroup => group !== null);
};