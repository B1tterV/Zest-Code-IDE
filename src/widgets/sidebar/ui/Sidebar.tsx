import { type FC } from 'react';
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_HEADER_HEIGHT,
  DEFAULT_SIDEBAR_TITLE,
} from '../config/sidebar';
import './Sidebar.css';

interface SidebarProps {
  className?: string;
  isVisible?: boolean;
  width?: number;
  title?: string;
  children?: React.ReactNode;
}

export const Sidebar: FC<SidebarProps> = ({
  className = '',
  isVisible = true,
  width = SIDEBAR_DEFAULT_WIDTH,
  title = DEFAULT_SIDEBAR_TITLE,
  children,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={`sidebar ${className}`}
      style={{
        width,
        minWidth: SIDEBAR_MIN_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
      }}
    >
      <div className="sidebar-header" style={{ height: SIDEBAR_HEADER_HEIGHT }}>
        <span className="sidebar-title">{title}</span>
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  );
};

export default Sidebar;