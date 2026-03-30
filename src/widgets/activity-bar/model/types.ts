import { type FC, type SVGProps } from 'react';

export type IconComponent = FC<SVGProps<SVGSVGElement>>;

export interface ActivityItemConfig {
  id: string;
  icon: IconComponent;
  tooltip: string;
}

export interface ActivityBarState {
  activeItemId: string;
  isCollapsed: boolean;
}