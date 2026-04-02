import { FC, useMemo } from 'react';
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

export const EditorPanel: FC<IDockviewPanelProps> = ({ params }) => {
  const tabId = params.id;
  const initialData = useMemo(() => {
    const t = useEditorStore.getState().tabs.find(it => it.id === tabId);
    return { title: t?.title, content: t?.content };
  }, [tabId]);

  const updateTabContent = useEditorStore(s => s.updateTabContent);

  if (!initialData.title) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-inactive-gray italic text-[13px]">
        Loading file...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-content overflow-hidden rounded-b-xl">
      <CodeEditor 
        value={initialData.content || ''} 
        language={getLanguageByExt(initialData.title)} 
        onChange={(newContent) => updateTabContent(tabId, newContent)}
      />
    </div>
  );
};