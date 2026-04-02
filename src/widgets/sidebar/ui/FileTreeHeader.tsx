import { FC } from 'react';
import { ReactComponent as IconFileNew } from '@/icons/file-new.svg'
import { ReactComponent as IconFolderAdd } from '@/icons/folder-add.svg'
import { ReactComponent as IconRefresh } from '@/icons/refresh.svg'
import { ReactComponent as IconCollapseAll } from '@/icons/collapse-all.svg'
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { cn } from '@/shared/lib/utils';

interface FileTreeHeaderProps {
  title: string;
  isOpen: boolean; // Обязательный проп для состояния
  onToggle: () => void; // Функция переключения
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onRefresh?: () => void;
  onCollapse?: () => void;
}

export const FileTreeHeader: FC<FileTreeHeaderProps> = ({ 
  title, 
  isOpen,
  onToggle,
  onNewFile, 
  onNewFolder, 
  onRefresh, 
  onCollapse 
}) => {
  // Базовый стиль для кнопок действий
  const actionBtnClass = "p-1 hover:bg-shared rounded-sm text-inactive-gray hover:text-white-gray transition-colors cursor-pointer";

  return (
    <div 
      className="
        group/header flex items-center justify-between h-7 pt-2 select-none cursor-pointer
      "
      onClick={onToggle}
    >
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <IconChevron 
          width={16} 
          className={cn("transition-transform flex-none", !isOpen && "-rotate-90")} 
        />
        
        <span className="text-[12px] font-bold opacity-80 uppercase tracking-wider truncate">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
        <button className={actionBtnClass} onClick={onNewFile} title="New File">
          <IconFileNew width={16} height={16} />
        </button>
        <button className={actionBtnClass} onClick={onNewFolder} title="New Folder">
          <IconFolderAdd width={16} height={16} />
        </button>
        <button className={actionBtnClass} onClick={onRefresh} title="Refresh Explorer">
          <IconRefresh width={16} height={16} />
        </button>
        <button className={actionBtnClass} onClick={onCollapse} title="Collapse Folders">
          <IconCollapseAll width={16} height={16} />
        </button>
      </div>
    </div>
  );
};