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
import { FileTree } from './FileTree'
import { FileTreeHeader } from './FileTreeHeader'
import { SearchSidebar } from '@/features/global-search';

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
  const projectPath = useLayoutStore(s => s.projectPath);
  const isVisible = useLayoutStore(s => s.isSidebarVisible);
  const tree = useFileStore(s => s.tree);

  if (!isVisible || !projectPath) return null;

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

      <FileTreeHeader 
        title={getProjectName(projectPath)} 
        isOpen={isTreeExpanded}
        onToggle={() => setIsTreeExpanded(!isTreeExpanded)}
      />

      <AnimatePresence initial={false}>
        {isTreeExpanded && (
          <motion.div
            key="file-tree-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: { height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.15 } } 
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.1 } } 
            }}
            className="overflow-hidden flex-1"
          >
            <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
              {tree.length > 0 ? (
                <FileTree nodes={tree} />
              ) : (
                <div className="p-4 text-xs text-inactive-gray italic">No folder opened</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Sidebar;