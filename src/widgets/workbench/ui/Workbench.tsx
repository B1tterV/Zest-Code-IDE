import { type FC, useCallback, useState } from 'react';
import {
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
  type DockviewApi,
} from 'dockview-react';
import { type EditorPanelParams } from '../model/types';
import { INITIAL_PANELS } from '../config/layout';
import './Workbench.css';

interface EditorPanelContentProps extends IDockviewPanelProps {
  params: EditorPanelParams;
}

const EditorPanelContent: FC<EditorPanelContentProps> = (props) => {
  return (
    <div className="editor-panel h-full w-full bg-background">
      <div className="p-4 text-foreground/70 text-sm">
        <span className="font-semibold">Editor:</span> {props.params.tabId}
        {props.params.filePath !== undefined && (
          <span className="ml-2 text-muted-foreground">{props.params.filePath}</span>
        )}
        {props.params.language !== undefined && (
          <span className="ml-2 text-muted-foreground">[{props.params.language}]</span>
        )}
      </div>
    </div>
  );
};

interface WorkbenchProps {
  className?: string;
}

export const Workbench: FC<WorkbenchProps> = ({ className = '' }) => {
  const [_, setApi] = useState<DockviewApi | null>(null);

  const handleReady = useCallback((event: DockviewReadyEvent) => {
    const dockviewApi: DockviewApi = event.api;
    setApi(dockviewApi);

    // Create 4-panel grid layout using addPanel with position
    const panelConfigs = INITIAL_PANELS.map((panel) => ({
      id: panel.id,
      component: 'editor' as const,
      params: panel.params,
      title: panel.title,
    }));

    // Add first panel
    if (panelConfigs.length > 0) {
      dockviewApi.addPanel(panelConfigs[0]);
    }

    // Add remaining panels with split positions
    panelConfigs.slice(1).forEach((config, index) => {
      const referencePanel = panelConfigs[index].id;
      const direction = index % 2 === 0 ? 'right' : 'below';
      
      dockviewApi.addPanel({
        ...config,
        position: {
          referencePanel,
          direction,
        },
      });
    });
  }, []);

  return (
    <div className={`workbench-container flex-1 overflow-hidden ${className}`}>
      <DockviewReact
        components={{ editor: EditorPanelContent }}
        onReady={handleReady}
        className="dockview-theme-vs h-full w-full"
      />
    </div>
  );
};

export default Workbench;