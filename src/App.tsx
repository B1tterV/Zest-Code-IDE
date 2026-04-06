import { FC } from 'react';
import { Workbench } from '@/widgets/workbench';
import { ActivityBar } from '@/widgets/activity-bar';
import { Sidebar } from '@/widgets/sidebar';
import { MenuBar } from '@/widgets/menu-bar';
import { StatusBar } from '@/widgets/status-bar';
import { useLayoutStore } from '@/entities/layout';
import { useGlobalHotkeys } from '@/features/hotkeys';
import { useAppHydration } from '@/features/app-initializer';
import { TerminalPanel } from '@/widgets/terminal-panel';
import { useTerminalStore } from '@/entities/terminal'

const App: FC = () => {
  const activeActivityId = useLayoutStore((s) => s.activeActivityId);
  const isSidebarVisible = useLayoutStore((s) => s.isSidebarVisible);
  const isTerminalVisible = useTerminalStore(s => s.instances.length > 0);

  useGlobalHotkeys();
  useAppHydration();

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
        <div className="flex flex-1 flex-col w-full overflow-hidden">
          <MenuBar />
          <div className="flex flex-1 overflow-hidden gap-1 pr-1">
            {isSidebarVisible && (
              <Sidebar title={activeActivityId.toUpperCase()} />
            )}
            <div className="flex flex-col flex-1 gap-1 overflow-hidden">
               <Workbench />
               { isTerminalVisible && (
                <div className="h-64 border border-border rounded-xl overflow-hidden">
                  <TerminalPanel />
                </div>
               )}
            </div>
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default App;