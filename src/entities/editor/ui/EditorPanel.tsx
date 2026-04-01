import { FC } from 'react';
import { IDockviewPanelProps } from 'dockview-react';

export const EditorPanel: FC<IDockviewPanelProps> = (props) => {
  const { tabId, filePath, language } = props.params;

  return (
    <div className="editor-panel h-full w-full bg-background border-t border-l border-border/10">
      <div className="p-4 text-foreground/70 text-sm">
        <span className="font-semibold text-foreground">Editor:</span> {tabId}
        {filePath && (
          <span className="ml-2 text-muted-foreground italic">{filePath}</span>
        )}
        {language && (
          <span className="ml-2 text-[10px] bg-secondary px-1.5 py-0.5 rounded uppercase tracking-wider">
            {language}
          </span>
        )}
      </div>
    </div>
  );
};