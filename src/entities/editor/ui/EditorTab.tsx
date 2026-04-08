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
  const tab = useEditorStore(s => s.tabs.find(t => t.id === id));
  const isDirty = tab?.isDirty;
  
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const closeTab = useEditorStore((s) => s.closeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const detectedStack = useLayoutStore((s) => s.detectedStack);
  
  const isActive = activeTabId === id;
  
  const Icon = getFileIcon(title, false, false, detectedStack);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    api.close();
    closeTab(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    if ((props as any).onMouseDown) {
      (props as any).onMouseDown(e);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    api.setActive();
    setActiveTab(id);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      api.close();
      closeTab(id);
    }
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Open context menu for:', id);
  };

  return (
    <div
      className={cn(
        "group flex items-center h-full px-2.5 gap-1.5 cursor-pointer select-none border bg-block rounded-sm",
        isActive 
          ? "bg-background border-accent-teal text-white" 
          : "bg-second-content border-transparent text-inactive-gray hover:bg-background"
      )}
      onClick={handleSelect}
      onAuxClick={handleAuxClick}
      onContextMenu={onContextMenu}
      onMouseDown={handleMouseDown}
    >
      <Icon className="w-4 h-4 flex-none" />
      <span className="text-[13px] truncate max-w-37.5">{title}</span>
      
      <div className="w-4 h-4 flex items-center justify-center relative ml-1">
        {isDirty && (
          <div className="w-1.5 h-1.5 rounded-full bg-white-gray group-hover:hidden" />
        )}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleClose}
          className={cn(
            "p-0.5 rounded-sm hover:bg-shared transition-all",
            "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
            (isActive && !isDirty) && "opacity-100 scale-100",
            "absolute inset-0 flex items-center justify-center"
          )}
        >
          <IconClose width={14} height={14} className="text-white-gray" />
        </button>
      </div>
    </div>
  );
};