import { FC } from 'react';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { cn } from '@/shared/lib/utils';
import { useFileStore, getFileIcon } from '@/entities/file';
import { useLoadTree } from '@/features/file-explorer';
import { useLayoutStore } from '@/entities/layout'
import { useOpenFile } from '@/features/editor';

export const FileTree: FC<{ nodes: any[]; level?: number }> = ({ nodes, level = 0 }) => {
  const { expandFolder } = useLoadTree();
	const { openFile } = useOpenFile();
  const toggleFolder = useFileStore(s => s.toggleFolder);

	const detectedStack = useLayoutStore(s => s.detectedStack);

  return (
    <div className="flex flex-col w-full">
      {nodes.map((node) => {
        const Icon = getFileIcon(node.name, node.is_dir, node.isOpen, detectedStack);
        
        return (
          <div key={node.path} className="flex flex-col">
            <div 
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              className={cn(
                "group flex items-center h-5.5 w-full gap-1.5 cursor-pointer transition-colors",
                "hover:bg-[#2a2d2e] text-[#cccccc] hover:text-white"
              )}
              onClick={() => {
                if (node.is_dir) {
                  node.isOpen ? toggleFolder(node.path) : expandFolder(node.path);
                } else {
                  openFile(node.path, node.name);
                }
              }}
            >

              <div className="w-4 flex items-center justify-center flex-none">
                {node.is_dir && (
                  node.isOpen ? <IconChevron width={16} /> : <IconChevron className='-rotate-90' width={16}/>
                )}
              </div>

              <Icon className="w-4 h-4 flex-none" /> 

							<span className={cn(
                "text-[13px] truncate transition-opacity",
                node.is_ignored ? "opacity-40" : "opacity-100",
							)}>
                {node.name}
							</span>
            </div>



            {node.isOpen && node.children && (
              <FileTree nodes={node.children} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
};