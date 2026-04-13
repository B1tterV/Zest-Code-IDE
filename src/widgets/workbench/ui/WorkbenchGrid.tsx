import { FC, useCallback, useRef, useEffect, useState } from 'react';
import { DockviewReact, type DockviewReadyEvent, type DockviewApi } from 'dockview-react';
import { EditorPanel, EditorTab, useEditorStore } from '@/entities/editor';

const components = {
  editor: EditorPanel,
};

const tabComponents = {
  default: EditorTab,
};

export const WorkbenchGrid: FC = () => {
  // const dockviewApi = useRef<DockviewApi | null>(null);
  const [dockviewApi, setApi] = useState<DockviewApi>();
  const isRestoring = useRef(false);

  const openedIds = useEditorStore(s => s.openedIds);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const tabs = useEditorStore(s => s.tabs);
  const { setDockviewApi } = useEditorStore()

  const handleReady = useCallback((event: DockviewReadyEvent) => {
    setApi(event.api);
    setDockviewApi(event.api);

    event.api.onWillDragPanel((e) => {
      console.log("onWillDragPanel", e)
    })

    event.api.onWillDragGroup((e) => {
      console.log("onWillDragGroup", e)
    })

    event.api.onWillShowOverlay((e) => {
      if (e.kind === 'header_space' || e.kind === 'tab') {
        e.preventDefault();
      }
    })

    event.api.onWillDrop((e) => {
      console.log("onWillDrop", e)
    })

    event.api.onDidDrop((e) => {
      console.log("onDidDrop", e)
    })

    const savedLayout = localStorage.getItem('zest-workbench-layout');
    if (savedLayout) {
      isRestoring.current = true;
      try {
        event.api.fromJSON(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to restore layout", e);
      } finally {
        isRestoring.current = false;
      }
    }

    event.api.onDidLayoutChange(() => {
      if (!isRestoring.current) {
        const layout = event.api.toJSON();
        localStorage.setItem('zest-workbench-layout', JSON.stringify(layout));
      }
    });
  }, []);

  useEffect(() => {
    if (!dockviewApi || isRestoring.current) return;

    openedIds.forEach((id) => {
      const existingPanel = dockviewApi?.getPanel(id);
      if (!existingPanel) {
        const tabData = tabs.find(t => t.id === id);
        if (tabData) {
          dockviewApi?.addPanel({
            id,
            title: tabData.title,
            component: 'editor',
            tabComponent: 'default',
            params: { id },
          });
        }
      }
    });

    dockviewApi.panels.forEach((panel) => {
      if (!openedIds.includes(panel.id)) {
        panel.api.close();
      }
    });

    if (activeTabId) {
      const panel = dockviewApi.getPanel(activeTabId);
      if (panel && !panel.api.isActive) {
        panel.api.setActive();
      }
    }
  }, [openedIds, activeTabId, tabs]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-second-content">
      <DockviewReact
        components={components}
        tabComponents={tabComponents}
        onReady={handleReady}
        tabAnimation="smooth"
        disableTabsOverflowList
        className="dockview dockview-theme-dark h-full w-full"
        hideBorders
        dndEdges={{
          size: { type: "pixels", value: 100 },
          activationSize: { type: "percentage", value: 0 },

        }}
      />
    </div>
  );
};