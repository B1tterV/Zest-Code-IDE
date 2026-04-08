import { useEditorStore } from '@/entities/editor';

export const useCreateFile = () => {
  const { openTab, tabs } = useEditorStore();

  const createNewTextFile = () => {
    const untitledCount = tabs.filter(t => t.title.startsWith('Untitled')).length;
    const id = `untitled-${Date.now()}`;
    
    openTab({
      id,
      title: `Untitled-${untitledCount + 1}`,
      content: '',
      isDirty: false
    });
  };

  return { createNewTextFile };
};