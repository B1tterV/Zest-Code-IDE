import { FC, useCallback, useRef, useEffect } from 'react';
import { DockviewReact, type DockviewReadyEvent, type DockviewApi } from 'dockview-react';
import { EditorPanel, EditorTab, useEditorStore } from '@/entities/editor';

const tabComponents = {
  default: EditorTab,
};

export const WorkbenchGrid: FC = () => {
  const dockviewApi = useRef<DockviewApi | null>(null);

  const openedIds = useEditorStore(s => s.openedIds);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const tabs = useEditorStore(s => s.tabs);

  const handleReady = useCallback((event: DockviewReadyEvent) => {
    dockviewApi.current = event.api;
  }, []);

  useEffect(() => {
    if (!dockviewApi.current) return;

    openedIds.forEach((id) => {
      if (!dockviewApi.current?.getPanel(id)) {
        const tabData = tabs.find(t => t.id === id);
        dockviewApi.current?.addPanel({
          id,
          title: tabData?.title || 'Untitled',
          component: 'editor',
          tabComponent: 'default',
          params: { id }
        });
      }
    });

    if (activeTabId) {
      dockviewApi.current.getPanel(activeTabId)?.api.setActive();
    }
  }, [openedIds, activeTabId]);

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