import { MenuGroup } from "@/entities/menu";

export const FILE_MENU_GROUPS: (autoSave: boolean) => MenuGroup[] = (autoSave) => [
  {
    id: 'new',
    items: [
      { id: 'new_text_file', label: 'New Text File', shortcut: 'Ctrl+N' },
      { id: 'new_file', label: 'New File...', shortcut: 'Ctrl+Alt+Win+N' },
      { id: 'new_window', label: 'New Window', shortcut: 'Ctrl+Shift+N' },
    ]
  },
  {
    id: 'open',
    items: [
      { id: 'open_file', label: 'Open File...', shortcut: 'Ctrl+O' },
      { id: 'open_folder', label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O' },
      { id: 'open_recent', label: 'Open Recent', kind: 'submenu', submenuGroups: [] },
    ]
  },
  {
    id: 'save_group',
    items: [
      { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
      { id: 'save_as', label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
      { id: 'save_all', label: 'Save All' },
    ]
  },
  {
    id: 'preferences',
    items: [
      { 
        id: 'auto_save', 
        label: 'Auto Save', 
        kind: 'checkbox', 
        checked: autoSave 
      },
      { id: 'revert_file', label: 'Revert File' },
    ]
  },
  {
    id: 'close',
    items: [
      { id: 'close_editor', label: 'Close Editor', shortcut: 'Ctrl+F4' },
      { id: 'close_folder', label: 'Close Folder' },
      { id: 'close_window', label: 'Close Window', shortcut: 'Alt+F4' },
    ]
  },
  {
    id: 'exit',
    items: [
      { id: 'exit', label: 'Exit' },
    ]
  }
];

export const TERMINAL_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'new-terminal',
    items: [
      { id: 'new_terminal', label: 'New Terminal' },
    ]
  }
]