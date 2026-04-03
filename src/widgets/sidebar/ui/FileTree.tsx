import { FC } from 'react';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { ReactComponent as IconTrash } from "@/icons/trash.svg";
import { cn } from '@/shared/lib/utils';
import { useFileStore, getFileIcon } from '@/entities/file';
import { useLoadTree } from '@/features/file-explorer';
import { useLayoutStore } from '@/entities/layout'
import { useOpenFile } from '@/features/editor';
import { FileCreationInput, useDeleteFile } from '@/features/file-ops';

export const FileTree: FC<{ nodes: any[]; level?: number }> = ({ nodes, level = 0 }) => {
  const { expandFolder } = useLoadTree();
	const { openFile } = useOpenFile();
  const toggleFolder = useFileStore(s => s.toggleFolder);
  const { deleteItem } = useDeleteFile();

  const isCreating = useFileStore(s => s.isCreating);
	const detectedStack = useLayoutStore(s => s.detectedStack);

  return (
    <div className="flex flex-col w-full">
      {level === 0 && isCreating && (
        <FileCreationInput level={level} />
      )}
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

              <button 
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-shared rounded-sm ml-auto mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(node.path, node.name);
                }}
              >
                <IconTrash width={14} height={14} className="text-inactive-gray hover:text-error" />
              </button>
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