import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileStore } from '@/entities/file';
import { useLayoutStore, getProjectName } from '@/entities/layout';
import { FileTree } from './FileTree';
import { FileTreeHeader } from './FileTreeHeader';

export const ExplorerSidebar: FC = () => {
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const projectPath = useLayoutStore(s => s.projectPath);
  const tree = useFileStore(s => s.tree);

  if (!projectPath) return null;

  return (
    <>
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
    </>
  );
};