import { FC, useEffect } from 'react';
import { IDockviewPanelProps } from 'dockview-react';
import { CodeEditor } from '@/shared/ui';
import { useEditorStore } from '../model/store';
import { useSaveFile } from '@/features/file-ops';
import { LANGUAGE_MAP } from '../config/languages';
import { AUTO_SAVE_INTERVAL } from '../config/settings'

function getLanguageByExt(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  return (ext && LANGUAGE_MAP[ext]) || 'plaintext';
}

export const EditorPanel: FC<IDockviewPanelProps> = ({ api, params }) => {
  const tabId = params.id;
  const tab = useEditorStore(s => s.tabs.find(t => t.id === tabId));
  const { saveActiveFile } = useSaveFile();
  const { autoSaveEnabled } = useEditorStore();

  const updateTabContent = useEditorStore(s => s.updateTabContent);
  const setActiveTab = useEditorStore(s => s.setActiveTab);

  useEffect(() => {
    const disposable = api.onDidActiveChange((isActive) => {
      if (isActive) {
        setActiveTab(tabId);
      }
    });

    return () => disposable.dispose();
  }, [api, tabId, setActiveTab]);

  useEffect(() => {
    if (autoSaveEnabled && tab?.isDirty && !tab.id.startsWith('untitled-')) {
      const timer = setTimeout(() => {
        saveActiveFile();
      }, AUTO_SAVE_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [tab?.content]);

  if (!tab) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-inactive-gray italic text-[13px]">
        File not found or closed
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-content overflow-hidden rounded-b-xl border-l border-border/10">
      <CodeEditor
        path={tabId}
        value={tab.content} 
        language={getLanguageByExt(tab.title)} 
        onChange={(newContent) => updateTabContent(tabId, newContent)}
      />
    </div>
  );
};