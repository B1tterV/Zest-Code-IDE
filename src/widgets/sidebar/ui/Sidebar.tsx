import { FC , useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, MoreButton } from '@/shared/ui';
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_HEADER_HEIGHT,
  DEFAULT_SIDEBAR_TITLE,
} from '../config/sidebar';
import { useLayoutStore, getProjectName } from '@/entities/layout';
import { useFileStore } from '@/entities/file';
import { FileTree } from '../../../features/file-explorer/ui/FileTree'
import { FileTreeHeader } from '../../../features/file-explorer/ui/FileTreeHeader'
import { SearchSidebar } from '@/features/global-search';
import { ExplorerSidebar } from '@/features/file-explorer';

interface SidebarProps {
  className?: string;
  isVisible?: boolean;
  width?: number;
  title?: string;
  children?: React.ReactNode;
}

export const Sidebar: FC<SidebarProps> = ({
  className = '',
  width = SIDEBAR_DEFAULT_WIDTH,
  title = DEFAULT_SIDEBAR_TITLE,
}) => {
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const isVisible = useLayoutStore(s => s.isSidebarVisible);
  const tree = useFileStore(s => s.tree);
  const activeActivityId = useLayoutStore(s => s.activeActivityId);

  if (!isVisible) return null;

  const renderContent = () => {
    switch (activeActivityId) {
      case 'explorer': return <ExplorerSidebar />;
      case 'search':   return <SearchSidebar />;
      default:         return <div className="p-4 text-xs opacity-50 italic">Coming soon...</div>;
    }
  };

  return (
    <aside
      className={`
        sidebar w-64 rounded-xl h-full
        border border-border bg-second-content
        flex flex-col pt-2.5 px-1.25 pb-1.25
        ${className}`
      }
      style={{
        width: SIDEBAR_DEFAULT_WIDTH,
        minWidth: SIDEBAR_MIN_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
      }}
    >
      <div className="flex items-center pl-5 pr-2.5" style={{ height: SIDEBAR_HEADER_HEIGHT }}>
        <span className="sidebar-title text-[12px] font-extralight w-full uppercase tracking-widest opacity-60">
          {activeActivityId}
        </span>
        <MoreButton 
          ref={moreBtnRef} 
          isActive={isMoreOpen} 
          onClick={() => setIsMoreOpen(!isMoreOpen)} 
        />
        <Popover isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} anchorRef={moreBtnRef}>
           <div className="p-2 text-[11px]">Sidebar Actions</div>
        </Popover>
      </div>
      
      <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden hover:scrollbar-show scrollbar-hide py-1">
        {renderContent()}
      </div>
    </aside>
  );
};

export default Sidebar;