import { type EditorPanelParams } from '../model/types';

export interface PanelConfig {
  id: string;
  title: string;
  params: EditorPanelParams;
}

export const INITIAL_PANELS: PanelConfig[] = [
  { id: 'editor-1', title: 'Editor 1', params: { tabId: 'editor-1', language: 'typescript' } },
  { id: 'editor-2', title: 'Editor 2', params: { tabId: 'editor-2', language: 'javascript' } },
  { id: 'editor-3', title: 'Editor 3', params: { tabId: 'editor-3', language: 'css' } },
  { id: 'editor-4', title: 'Editor 4', params: { tabId: 'editor-4', language: 'json' } },
];