import { invoke } from '@tauri-apps/api/core';
import * as monaco from 'monaco-editor';

export const loadLocalTypes = async (projectPath: string) => {
  try {
    const types = await invoke<{ path: string; content: string }[]>('get_project_types', { projectPath });
    
    const languages = (monaco.languages as any);
    if (!languages.typescript) return;

    // Очищаем старые либы перед загрузкой новых (опционально)
    // languages.typescript.typescriptDefaults.setExtraLibs([]);

    // Массовая регистрация
    languages.typescript.typescriptDefaults.setExtraLibs(
      types.map(t => ({
        content: t.content,
        filePath: t.path
      }))
    );

    console.log(`🧠 Intelligence: Loaded ${types.length} type definitions from node_modules`);
  } catch (e) {
    console.error("LSP Error:", e);
  }
};