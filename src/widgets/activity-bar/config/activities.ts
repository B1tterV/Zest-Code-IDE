import { ReactComponent as IconFiles } from "@/icons/files-stack.svg";
import { ReactComponent as IconSearch } from "@/icons/search.svg";
import { ReactComponent as IconBranch } from "@/icons/branch.svg";
import { ReactComponent as IconDebug } from "@/icons/debug.svg";
import { ReactComponent as IconSettings } from "@/icons/settings.svg";
import { type ActivityItemConfig } from "../model/types";

export const PRIMARY_ACTIVITIES: ActivityItemConfig[] = [
  { id: "explorer", icon: IconFiles, tooltip: "Explorer" },
  { id: "search", icon: IconSearch, tooltip: "Search" },
  { id: "git", icon: IconBranch, tooltip: "Source Control" },
  { id: "debug", icon: IconDebug, tooltip: "Run and Debug" },
];

export const SECONDARY_ACTIVITIES: ActivityItemConfig[] = [
  { id: "settings", icon: IconSettings, tooltip: "Settings" },
];

export const ACTIVITY_BAR_WIDTH = 50;
export const ACTIVITY_ITEM_SIZE = 40;
