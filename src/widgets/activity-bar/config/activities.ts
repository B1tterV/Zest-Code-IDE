import { ReactComponent as IconFiles } from '@icons/files.svg';
import { ReactComponent as IconSearch } from '@icons/search.svg';
import { ReactComponent as IconGit } from '@icons/git.svg';
import { ReactComponent as IconDebug } from '@icons/debug.svg';
import { ReactComponent as IconExtensions } from '@icons/extensions.svg';
import { ReactComponent as IconSettings } from '@icons/settings.svg';
import { type ActivityItemConfig } from '../model/types';

export const PRIMARY_ACTIVITIES: ActivityItemConfig[] = [
  { id: 'explorer', icon: IconFiles, tooltip: 'Explorer' },
  { id: 'search', icon: IconSearch, tooltip: 'Search' },
  { id: 'git', icon: IconGit, tooltip: 'Source Control' },
  { id: 'debug', icon: IconDebug, tooltip: 'Run and Debug' },
  { id: 'extensions', icon: IconExtensions, tooltip: 'Extensions' },
];

export const SECONDARY_ACTIVITIES: ActivityItemConfig[] = [
  { id: 'settings', icon: IconSettings, tooltip: 'Settings' },
];

export const ACTIVITY_BAR_WIDTH = 48;
export const ACTIVITY_ITEM_SIZE = 48;