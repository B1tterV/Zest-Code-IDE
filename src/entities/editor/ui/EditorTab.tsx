import { FC } from 'react';
import { IDockviewPanelHeaderProps } from 'dockview-react';
import { getFileIcon } from '@/entities/file';
import { useLayoutStore } from '@/entities/layout';
import { useEditorStore } from '../model/store';
import { ReactComponent as IconClose } from '@/icons/close.svg';
import { cn } from '@/shared/lib/utils';

export const EditorTab: FC<IDockviewPanelHeaderProps> = (props) => {
  const { api } = props;

  const id = api.id;
  const title = api.title ?? 'Untitled';
  
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const closeTab = useEditorStore((s) => s.closeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const detectedStack = useLayoutStore((s) => s.detectedStack);
  
  const isActive = activeTabId === id;
  
  // Теперь TS спокоен, так как title гарантированно string
  const Icon = getFileIcon(title, false, false, detectedStack);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    api.close();
    closeTab(id);
  };

  const handleSelect = () => {
    if ((api as any).setActive) (api as any).setActive();
    setActiveTab(id);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      api.close();
      closeTab(id);
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-center h-full px-2.5 gap-1.5 cursor-pointer select-none border bg-block rounded-sm",
        isActive 
          ? "bg-background border-accent-teal text-white" 
          : "bg-second-content border-transparent text-inactive-gray hover:bg-block"
      )}
      onClick={handleSelect}
      onAuxClick={handleAuxClick}
    >
      <Icon className="w-4 h-4 flex-none" />
      <span className="text-[13px] truncate max-w-37.5">{title}</span>
      
      <button 
        onClick={handleClose}
        className={cn(
          "ml-1 p-0.5 rounded-sm hover:bg-shared transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <IconClose width={14} height={14} />
      </button>
    </div>
  );
};