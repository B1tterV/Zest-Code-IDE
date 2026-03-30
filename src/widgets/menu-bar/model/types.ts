export interface MenuItem {
  label: string;
  command?: string;
  shortcut?: string;
  submenu?: MenuItem[];
  separator?: boolean;
  enabled?: boolean;
}

export interface MenuBarState {
  activeMenu: string | null;
  items: MenuItem[];
}