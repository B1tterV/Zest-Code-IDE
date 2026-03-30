import { type FC, useState } from 'react';
import { MENU_ITEMS, MENU_BAR_HEIGHT } from '../config/menus';
import { type MenuItem } from '../model/types';
import './MenuBar.css';

interface MenuBarProps {
  className?: string;
  onMenuClick?: (label: string) => void;
}

export const MenuBar: FC<MenuBarProps> = ({ className = '', onMenuClick }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);
    if (onMenuClick !== undefined) {
      onMenuClick(label);
    }
  };

  const handleBlur = () => {
    setActiveMenu(null);
  };

  return (
    <nav
      className={`menu-bar ${className}`}
      style={{ height: MENU_BAR_HEIGHT }}
      onBlur={handleBlur}
    >
      {MENU_ITEMS.map((item: MenuItem) => (
        <button
          key={item.label}
          className={`menu-item ${activeMenu === item.label ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuClick(item.label)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default MenuBar;