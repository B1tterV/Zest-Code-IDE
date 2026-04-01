import { FC, useCallback } from 'react';
import { DockviewReact, type DockviewReadyEvent } from 'dockview-react';
import { EditorPanel } from '@/entities/editor';
import { INITIAL_PANELS } from '../config/layout';

export const WorkbenchGrid: FC = () => {
  const handleReady = useCallback((event: DockviewReadyEvent) => {
    const { api } = event;

    const panelConfigs = INITIAL_PANELS.map((panel) => ({
      id: panel.id,
      component: 'editor' as const,
      params: panel.params,
      title: panel.title,
    }));

    if (panelConfigs.length > 0) {
      api.addPanel(panelConfigs[0]);
    }

    panelConfigs.slice(1).forEach((config, index) => {
      const referencePanel = panelConfigs[index].id;
      const direction = index % 2 === 0 ? 'right' : 'below';
      
      api.addPanel({
        ...config,
        position: { referencePanel, direction },
      });
    });
  }, []);

  return (
    <DockviewReact
      components={{ editor: EditorPanel }}
      onReady={handleReady}
      className="dockview-theme-vs h-full w-full"
    />
  );
};