export interface MenuItem {
  label: string;
  command?: string;
  shortcut?: string;
  submenu?: MenuItem[];
  separator?: boolean;
  enabled?: boolean;
}

export interface MenuAction {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  kind?: 'checkbox' | 'link' | 'submenu';
  checked?: boolean;
  submenuGroups?: MenuGroup[];
}

export interface MenuGroup {
  id: string;
  items: MenuAction[];
}