import { FC , useState, useRef } from 'react';
import { Popover, MoreButton } from '@/shared/ui';
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_HEADER_HEIGHT,
  DEFAULT_SIDEBAR_TITLE,
} from '../config/sidebar';

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
  if (!isVisible) return null
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <aside
      className={`
        sidebar w-64 rounded-xl h-full
        border border-border bg-second-content
        flex flex-col pt-2.5 px-1.25 pb-1.25
        ${className}`
      }
      style={{
        width,
        minWidth: SIDEBAR_MIN_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
      }}
    >
      <div className="flex items-center pl-5 pr-2.5" style={{ height: SIDEBAR_HEADER_HEIGHT }}>
        <span className="sidebar-title text-[12px] font-extralight w-full">{title}</span>
        <MoreButton 
          ref={moreBtnRef} 
          isActive={isMoreOpen} 
          onClick={() => setIsMoreOpen(!isMoreOpen)} 
        />
        <Popover 
          isOpen={isMoreOpen} 
          onClose={() => setIsMoreOpen(false)} 
          anchorRef={moreBtnRef}
          className="p-1"
        >
          None
        </Popover>
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  );
};

export default Sidebar;