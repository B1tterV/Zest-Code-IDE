import { type FC } from 'react';
import { useCommandPalette } from '../model/store';
import { ReactComponent as IconSearch } from "@/icons/search.svg";
import { cn } from '@/shared/lib/utils';

interface CommandPaletteTriggerProps {
  className?: string;
}

export const CommandPaletteTrigger: FC<CommandPaletteTriggerProps> = ({ className }) => {
  const open = useCommandPalette((s) => s.open);
  // TODO: useProjectStore(s => s.name)
  const projectName = "ZestCode_v1.0.0";

  return (
    <button 
      onClick={open}
      className={cn(
        "max-w-145 min-w-20 w-full h-6 bg-block border border-gray-stroke rounded-sm px-2",
        "flex items-center justify-center gap-1.25 transition-all cursor-pointer",
        "hover:bg-gray-block-hover text-white-gray",
        className
      )}
    >
      <IconSearch className="w-3.5 h-3.5" />
      <span className="text-[12px] truncate max-w-[100] font-normal">
        {projectName}
      </span>
    </button>
  );
};