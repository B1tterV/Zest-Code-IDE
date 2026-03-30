import { type FC, useState, type KeyboardEvent } from 'react';
import { Workbench } from '@widgets/workbench';
import { ActivityBar } from '@widgets/activity-bar';
import { Sidebar } from '@widgets/sidebar';
import { MenuBar } from '@widgets/menu-bar';
import { StatusBar } from '@widgets/status-bar';

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
    <div className="app-container" onKeyDown={handleKeyDown}>
      <MenuBar />
      <div className="app-body">
        <ActivityBar
          activeItemId={activeActivity}
          onActivityClick={handleActivityClick}
        />
        <Sidebar isVisible={sidebarVisible} title="EXPLORER" />
        <Workbench />
      </div>
      <StatusBar />
    </div>
  );
};

export default App;