import { FC, useCallback, useRef, useEffect } from 'react';
import { DockviewReact, type DockviewReadyEvent, type DockviewApi } from 'dockview-react';
import { EditorPanel, EditorTab, useEditorStore } from '@/entities/editor';

const tabComponents = {
  default: EditorTab,
};

export const WorkbenchGrid: FC = () => {
  const dockviewApi = useRef<DockviewApi | null>(null);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const tabs = useEditorStore((s) => s.tabs);

  const handleReady = useCallback((event: DockviewReadyEvent) => {
    dockviewApi.current = event.api;
  }, []);

  useEffect(() => {
    if (!dockviewApi.current || tabs.length === 0) return;

    tabs.forEach((tab) => {
      const panel = dockviewApi.current?.getPanel(tab.id);
      if (!panel) {
        dockviewApi.current?.addPanel({
          id: tab.id,
          title: tab.title,
          component: 'editor',
          tabComponent: 'default', 
          params: { id: tab.id, content: tab.content },
        });
      }
    });

    if (activeTabId) {
      const panel = dockviewApi.current.getPanel(activeTabId);
      if (panel) {
        panel.api.setActive(); 
      }
    }
  }, [tabs, activeTabId]);

  return (
    <div className="h-full w-full rounded-xl">
      <DockviewReact
        components={{ editor: EditorPanel }}
        tabComponents={tabComponents}
        onReady={handleReady}
        className="dockview dockview-theme-dark h-full w-full rounded-xl"
      />
    </div>
  );
};