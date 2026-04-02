import { MenuGroup } from "@/entities/menu";

export const FILE_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'new',
    items: [
      { id: 'new_text_file', label: 'New Text File', shortcut: 'Ctrl+N' },
      { id: 'new_file', label: 'New File...', shortcut: 'Ctrl+Alt+Windows+N' },
      { id: 'new_window', label: 'New Window', shortcut: 'Ctrl+Shift+N' },
      {
        id: 'new_window_with_profile',
        label: 'New Window With Profile',
        submenuGroups: [{
          id: 'profiles',
          items: [{ id: 'new_profile', label: 'New Profile' }]
        }]
      },
    ]
  },
  {
    id: 'open',
    items: [
      { id: 'open_file', label: 'Open File...', shortcut: 'Ctrl+O' },
      { id: 'open_folder', label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O' },
    ]
  }
]