import { FC } from 'react';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg?skip-colors";
import { ReactComponent as IconCheckmarkSmall } from "@/icons/checkmark-small.svg?skip-colors";
import { MenuGroup } from '../model/types'
import { Popover } from '@/shared/ui';

interface Props {
  groups: MenuGroup[];
  isOpen?: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
  position?: { x: number; y: number } | null;

  onAction: (id: string) => void;
  onClose?: () => void;
}

export const DropdownMenu: FC<Props> = ({ 
  groups, 
  isOpen, 
  anchorRef,
  position,

  onAction, 
  onClose
}) => {
  const content = (
    <div className="min-w-70 bg-block border border-border shadow-lg rounded-md py-1 animate-in fade-in zoom-in-95 duration-100">
      {groups.map((group, index) => (
        <div key={group.id}>
          {index > 0 && <div className="h-px bg-border my-1 mx-2" />}
          {group.items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center px-3 py-1 text-[13px] text-white-gray hover:bg-shared hover:text-white cursor-pointer relative"
              onClick={() => !item.submenuGroups && onAction(item.id)}
            >
              <div className="w-5 flex-none">
                {item.checked && <IconCheckmarkSmall className="w-3.5 h-3.5 text-white"/>}
              </div>
              
              <span className="flex-1 truncate">{item.label}</span>
              
              {item.shortcut && (
                <span className="ml-4 text-inactive-gray text-[11px] group-hover:text-white/60">
                  {item.shortcut}
                </span>
              )}

              {item.submenuGroups && (
								<>
									<IconChevron className="ml-2 w-3.5 h-3.5 opacity-50 -rotate-90 text-white"/>
									<div className="hidden group-hover:block absolute left-[calc(100%-4px)] -top-1.5 pl-1">
										<DropdownMenu
											groups={item.submenuGroups}
											onAction={onAction}
										/>
									</div>
								</>
							)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

	if ((anchorRef || position) && onClose && isOpen !== undefined) {
    return (
      <Popover isOpen={isOpen} onClose={onClose} anchorRef={anchorRef} position={position}>
        {content}
      </Popover>
    );
  }

	return content;
};