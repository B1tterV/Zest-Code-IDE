import { type FC, useState, type KeyboardEvent } from 'react';
import { cn } from '@/shared/lib/utils';
import { Workbench } from '@/widgets/workbench';
import { ActivityBar } from '@/widgets/activity-bar';
import { Sidebar } from '@/widgets/sidebar';
import { MenuBar } from '@/widgets/menu-bar';
import { StatusBar } from '@/widgets/status-bar';

const App: FC = () => {
  const [activeActivity, setActiveActivity] = useState<string>('explorer');
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const handleActivityClick = (id: string) => {
    if (id === activeActivity && sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setActiveActivity(id);
      setSidebarVisible(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      setSidebarVisible((prev: boolean) => !prev);
    }
  };

  return (
    <div className="
      flex h-screen w-screen
      flex-col
      overflow-hidden 
      bg-background 
      text-foreground 
      select-none
      pl-1 pb-1 gap-1"
    >
      <div className="
        flex flex-1 min-w-0 overflow-hidden gap-1"
      >
        <ActivityBar
          activeItemId={activeActivity}
          onActivityClick={handleActivityClick}
        />
        <div className="flex flex-1 flex-col">
          <MenuBar />
          <div className="flex flex-1 overflow-hidden gap-1 pr-1">
            {sidebarVisible && (
              <Sidebar title={activeActivity.toUpperCase()} />
            )}
            <Workbench isEmpty />
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default App;