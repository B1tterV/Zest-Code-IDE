import { useOpenProject } from '@/features/open-project';
import { useTerminalStore } from '@/entities/terminal';
import { useEditorStore } from '@/entities/editor';
import { useCreateFile, useSaveFile } from '@/features/file-ops';
import { useOpenFile } from '@/features/editor';

export const useMenuActions = () => {
  const { openProject } = useOpenProject();
  const { pickAndOpenFile } = useOpenFile()
  const { addTerminal } = useTerminalStore();
  const { autoSaveEnabled, activeTabId, setAutoSave, closeTab } = useEditorStore();
  const { saveActiveFile, saveAs, saveAll, revertFile } = useSaveFile();
  const { createNewTextFile, createNewFileOnDisk } = useCreateFile();

  const handleFileAction = (id: string) => {
    switch (id) {
      case 'open_folder': openProject(); break;
      case 'open_file': pickAndOpenFile(); break;
      case 'save': saveActiveFile(); break;
      case 'save_as': saveAs(); break;
      case 'save_all': saveAll(); break;
      case 'auto_save': setAutoSave(!autoSaveEnabled); break;
      case 'revert_file': revertFile(); break;
      case 'new_text_file': createNewTextFile(); break;
      case 'new_file': createNewFileOnDisk(); break;
      case 'close_editor': if (activeTabId) closeTab(activeTabId); break;
      case 'exit': window.close(); break;
    }
  };

  const handleTerminalAction = (id: string) => {
    switch (id) {
      case 'new_terminal':
        addTerminal({ id: Date.now().toString(), title: 'Terminal' });
        break;
    }
  };

  const dispatchAction = (id: string) => {
    handleFileAction(id);
    handleTerminalAction(id);
  };

  return { dispatchAction };
};