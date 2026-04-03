import { FC, memo } from 'react';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { cn } from '@/shared/lib/utils';
import { getFileIcon, useFileStore } from '@/entities/file';
import { FileInput } from '@/shared/ui';

interface FileTreeNodeProps {
  node: any;
  level: number;
  detectedStack: string[];
  isRenaming: string | null;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onRename: (newName: string) => void;
  onCancelRename: () => void;
  onDelete: () => void;
}

export const FileTreeNode: FC<FileTreeNodeProps> = memo(({ 
  node, 
  level, 
  detectedStack, 
  isRenaming, 
  onOpen, 
  onContextMenu, 
  onRename,
  onCancelRename,
}) => {
  const Icon = getFileIcon(node.name, node.is_dir, node.isOpen, detectedStack);
  const cutPath = useFileStore(s => s.cutPath);

  return (
    <div 
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      className={cn(
        "group flex items-center h-5.5 w-full gap-1.5 cursor-pointer transition-colors",
        "hover:bg-[#2a2d2e] text-[#cccccc] hover:text-white",
        node.path === cutPath ? "opacity-50 grayscale-[0.5]" : "opacity-100",
      )}
      onClick={onOpen}
      onContextMenu={onContextMenu}
    >
      {/* Chevron */}
      <div className="w-4 flex items-center justify-center flex-none">
        {node.is_dir && (
          <IconChevron 
            width={16} 
            className={cn("transition-transform", !node.isOpen && "-rotate-90")} 
          />
        )}
      </div>

      <Icon className="w-4 h-4 flex-none" /> 

      <div className="flex-1 min-w-0 overflow-hidden">
        {isRenaming === node.path ? (
          <FileInput
            defaultValue={node.name}
            onConfirm={onRename}
            onCancel={onCancelRename}
          />
        ) : (
          <span className={cn(
            "text-[13px] truncate block transition-opacity",
            node.is_ignored ? "opacity-40" : "opacity-100",
          )}>
            {node.name}
          </span>
        )}
      </div>
    </div>
  );
});