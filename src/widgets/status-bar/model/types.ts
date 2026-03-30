export interface StatusBarInfo {
  branch?: string;
  errors: number;
  warnings: number;
  lineNumber: number;
  columnNumber: number;
  encoding: string;
  language?: string;
}

export interface StatusBarState {
  info: StatusBarInfo;
  isVisible: boolean;
}