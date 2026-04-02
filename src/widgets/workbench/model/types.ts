import { type SVGProps, type FC } from 'react';

export interface EditorPanelParams {
  tabId: string;
  filePath?: string;
  language?: string;
  content?: string;
}

export interface EditorTab {
  id: string;
  title: string;
  params: EditorPanelParams;
  isActive: boolean;
}

export interface EditorGroup {
  id: string;
  tabs: EditorTab[];
  activeTabId: string | null;
}

export interface IconComponent {
  Component: FC<SVGProps<SVGSVGElement>>;
}