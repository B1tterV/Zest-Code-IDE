import { FC, useEffect } from 'react';
import { Workbench } from '@/widgets/workbench';
import { ActivityBar } from '@/widgets/activity-bar';
import { Sidebar } from '@/widgets/sidebar';
import { MenuBar } from '@/widgets/menu-bar';
import { StatusBar } from '@/widgets/status-bar';
import { useLayoutStore } from '@/entities/layout';

const App: FC = () => {
  const activeActivityId = useLayoutStore((s) => s.activeActivityId);
  const isSidebarVisible = useLayoutStore((s) => s.isSidebarVisible);
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

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
        <ActivityBar />
        <div className="flex flex-1 flex-col">
          <MenuBar />
          <div className="flex flex-1 overflow-hidden gap-1 pr-1">
            {isSidebarVisible && (
              <Sidebar title={activeActivityId.toUpperCase()} />
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