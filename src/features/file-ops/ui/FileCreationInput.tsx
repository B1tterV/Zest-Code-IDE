import { FC, useState, KeyboardEvent } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useFileStore } from '@/entities/file';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';
import { getFileIcon } from '@/entities/file';
import { FileInput } from '@/shared/ui';

export const FileCreationInput: FC<{ level: number }> = ({ level }) => {
  const [name, setName] = useState('');
  const isCreating = useFileStore(s => s.isCreating);
  const setCreating = useFileStore(s => s.setCreating);
  const projectPath = useLayoutStore(s => s.projectPath);
  const { loadInitial } = useLoadTree();

  const Icon = getFileIcon(name || (isCreating === 'file' ? 'f.txt' : 'folder'), isCreating === 'folder');

  const handleConfirm = async () => {
    if (!name || !projectPath) {
      setCreating(null);
      return;
    }

    const command = isCreating === 'file' ? 'create_new_file' : 'create_new_directory';
    const separator = projectPath.includes('\\') ? '\\' : '/';
    
    try {
      await invoke(command, { path: `${projectPath}${separator}${name}` });
      await loadInitial(projectPath);
    } catch (err) {
      console.error("Creation failed:", err);
    } finally {
      setCreating(null);
    }
  };

  return (
    <div 
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      className="flex items-center h-5.5 w-full gap-1.5 bg-shared/10"
    >
      <div className="w-4 flex-none" />
      <Icon className="w-4 h-4 flex-none" />
      <FileInput
        onChange={setName}
        onConfirm={handleConfirm}
        onCancel={() => setCreating(null)}
      />
    </div>
  );
};