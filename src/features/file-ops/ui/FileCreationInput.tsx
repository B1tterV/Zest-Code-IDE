import { FC, useState, KeyboardEvent } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useFileStore } from '@/entities/file';
import { useLayoutStore } from '@/entities/layout';
import { useLoadTree } from '@/features/file-explorer';
import { getFileIcon } from '@/entities/file';

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') setCreating(null);
  };

  return (
    <div 
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      className="flex items-center h-5.5 w-full gap-1.5 bg-shared/10"
    >
      <div className="w-4 flex-none" />
      <Icon className="w-4 h-4 flex-none" />
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setCreating(null)}
        className="
            bg-transparent
            border border-accent-teal
            outline-none text-[13px]
            w-full px-1 text-white h-4.5
            rounded-sm
        "
      />
    </div>
  );
};