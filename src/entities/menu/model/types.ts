export interface MenuItem {
  label: string;
  command?: string;
  shortcut?: string;
  submenu?: MenuItem[];
  separator?: boolean;
  enabled?: boolean;
}