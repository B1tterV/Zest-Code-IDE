import { FC , useState, useRef } from 'react';
import { MenuButton, Popover, MoreButton } from '@/shared/ui';
import { WindowControls } from '@/features/window-controls';
import { CommandPaletteTrigger } from '@/features/command-palette';
import { useAdaptiveMenu } from '@/features/adaptive-menu';
import { MENU_ITEMS } from '@/entities/menu';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { useOpenProject } from '@/features/open-project'

export const MenuBar: FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { visibleItems, overflowItems } = useAdaptiveMenu(headerRef, MENU_ITEMS);
  const { openProject } = useOpenProject();

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
          <MenuButton
            key={item.label}
            label={item.label}
            onClick={() => {
              if (item.label === 'File') openProject();
              setActiveMenu(item.label);
            }}
          />
        ))}

        {overflowItems.length > 0 && (
          <div className="relative h-full flex items-center">
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
              {overflowItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between pl-2 pr-1 py-0.5 text-[13px] text-white-gray hover:bg-shared hover:text-white rounded-sm group transition-all cursor-pointer"
                >
                  <span>{item.label}</span>
                  <IconChevron className="w-4 h-4 opacity-50 group-hover:opacity-100 -rotate-90" />
                </button>
              ))}
            </Popover>
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