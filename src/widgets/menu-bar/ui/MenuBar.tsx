import { FC , useState, useRef } from 'react';
import { MenuButton, MoreButton } from '@/shared/ui';
import { WindowControls } from '@/features/window-controls';
import { CommandPaletteTrigger } from '@/features/command-palette';
import { useAdaptiveMenu } from '@/features/adaptive-menu';
import { MENU_ITEMS, DropdownMenu, MenuGroup } from '@/entities/menu';
import { FILE_MENU_GROUPS, TERMINAL_MENU_GROUPS } from '../config/menu';
import { useOpenProject } from '@/features/open-project'
import { useTerminalStore } from '@/entities/terminal';

export const MenuBar: FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const menuButtonsRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { visibleItems, overflowItems } = useAdaptiveMenu(headerRef, MENU_ITEMS);
  const { openProject } = useOpenProject();
  const { addTerminal } = useTerminalStore();

  const getMenuGroups = (label: string) => {
    if (label === 'File') return FILE_MENU_GROUPS;
    if (label === 'Terminal') return TERMINAL_MENU_GROUPS;
    return [];
  };

  const handleAction = (id: string) => {
    if (id === 'open_folder') openProject();
    if (id === 'new_terminal') {
      addTerminal({ 
        id: Date.now().toString(), 
        title: 'Terminal' 
      });
    }
    setActiveMenu(null);
  };

  const overflowMenuGroups: MenuGroup[] = [
    {
      id: 'overflow-group',
      items: overflowItems.map((item) => ({
        id: `overflow-${item.label}`,
        label: item.label,
        submenuGroups: getMenuGroups(item.label),
      })),
    },
  ];

  return (
    <header
      ref={headerRef}
      className="
        h-9 w-full flex items-center justify-between
        bg-color-second-content select-none overflow-hidden
        gap-5
      "
      data-tauri-drag-region
    >
      <nav className="flex items-center h-full flex-none">
        {visibleItems.map((item) => (
          <div key={item.label} className="relative h-full flex items-center">
            <MenuButton
              ref={(el) => { menuButtonsRefs.current[item.label] = el; }}
              label={item.label}
              isActive={activeMenu === item.label}
              onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
            />

            <DropdownMenu
              isOpen={activeMenu === item.label}
              onClose={() => setActiveMenu(null)}
              anchorRef={{ current: menuButtonsRefs.current[item.label] }}
              groups={getMenuGroups(item.label)}
              onAction={handleAction}
            />
          </div>
        ))}

        {overflowItems.length > 0 && (
          <div className="relative h-full flex items-center">
            <MoreButton 
              ref={moreBtnRef} 
              isActive={isMoreOpen} 
              onClick={() => setIsMoreOpen(!isMoreOpen)} 
            />

            <DropdownMenu
              isOpen={isMoreOpen}
              onClose={() => setIsMoreOpen(false)}
              anchorRef={moreBtnRef}
              groups={overflowMenuGroups}
              onAction={(id) => {
                handleAction(id);
                setIsMoreOpen(false);
              }}
            />
          </div>
        )}
      </nav>

      <div
        className="flex-1 flex justify-center min-w-0"
        data-tauri-drag-region 
      >
        <CommandPaletteTrigger />
      </div>

      <WindowControls />
    </header>
  );
};