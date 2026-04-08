import { FC, useEffect } from 'react';
import { IDockviewPanelProps } from 'dockview-react';
import { CodeEditor } from '@/shared/ui';
import { useEditorStore } from '../model/store';

const LANGUAGE_MAP: Record<string, string> = {
  // Frontend
  'tsx': 'typescript',
  'ts': 'typescript',
  'jsx': 'javascript',
  'js': 'javascript',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'less': 'less',
  'vue': 'html',
  
  // Backend & Systems
  'rs': 'rust',
  'py': 'python',
  'cpp': 'cpp',
  'cc': 'cpp',
  'h': 'cpp',
  'hpp': 'cpp',
  'cs': 'csharp',
  'go': 'go',
  'java': 'java',
  'php': 'php',
  'sql': 'sql',

  // Configs & Data
  'json': 'json',
  'md': 'markdown',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'toml',
  'xml': 'xml',
  'bat': 'bat',
  'sh': 'shell',
  'dockerfile': 'dockerfile',
};

function getLanguageByExt(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  return (ext && LANGUAGE_MAP[ext]) || 'plaintext';
}

export const EditorPanel: FC<IDockviewPanelProps> = ({ api, params }) => {
  const tabId = params.id;
  const tab = useEditorStore(s => s.tabs.find(t => t.id === tabId));

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