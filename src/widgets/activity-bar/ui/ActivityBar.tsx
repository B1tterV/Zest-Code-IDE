import { type FC } from 'react';
import { IconButton } from '@/shared/ui';
import LogoImage from '@/images/logo.png';
import { cn } from '@/shared/lib/utils';
import { useLayoutStore } from '@/entities/layout';
import { PRIMARY_ACTIVITIES, SECONDARY_ACTIVITIES, ACTIVITY_BAR_WIDTH } from '../config/activities';

export const ActivityBar: FC = () => {
  const activeActivityId = useLayoutStore((s) => s.activeActivityId);
  const setActivity = useLayoutStore((s) => s.setActivity);

  return (
    <aside 
      className={cn(
        "flex flex-col items-center bg-color-second-content border-b border-border h-full flex-none ",
        "pt-2.5 px-1.25 pb-1.25",
        "overflow-x-hidden overflow-y-auto",
        "scrollbar-hide",
      )} 
      style={{ width: ACTIVITY_BAR_WIDTH }}
    >
      <div className="w-10 h-10 bg-transparent flex items-center justify-center flex-none">
        <img 
          src={LogoImage} 
          alt="Zest Code" 
          className="w-7.5 h-7.5 object-contain"
        />
      </div>

      {/* Верхняя навигация */}
      <nav className="flex flex-col items-center w-full pt-4 gap-4" aria-label="Primary">
        {PRIMARY_ACTIVITIES.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            tooltip={item.tooltip}
            active={item.id === activeActivityId}
            onClick={() => setActivity(item.id)}
            variant="activity" 
          />
        ))}
      </nav>

      {/* Нижняя навигация */}
      <nav className="flex flex-col items-center w-full mt-auto pt-4 gap-1" aria-label="Secondary">
        {SECONDARY_ACTIVITIES.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            tooltip={item.tooltip}
            active={item.id === activeActivityId}
            onClick={() => setActivity(item.id)}
            variant="activity"
          />
        ))}
      </nav>
    </aside>
  );
};