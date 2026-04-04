import { FC, useState, memo } from 'react';
import { ReactComponent as IconChevron } from "@/icons/chevron.svg";
import { ReactComponent as IconClose } from "@/icons/close.svg";
import { getFileIcon } from '@/entities/file';
import { cn } from '@/shared/lib/utils';
import { SearchMatch, useSearchStore } from '@/entities/search';
import { setTimeout } from 'node:timers/promises';

interface SearchResultItemProps {
  filePath: string;
  matches: SearchMatch[];
  onFileClick: (path: string, name: string, line?: number) => void;
}

export const SearchResultItem: FC<SearchResultItemProps> = memo(({ filePath, matches, onFileClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fileName = filePath.split(/[\\/]/).pop() || '';
  const Icon = getFileIcon(fileName, false);

  const removeResultGroup = useSearchStore(s => s.removeResultGroup);
  const removeSingleMatch = useSearchStore(s => s.removeSingleMatch);

  const handleRemove = (e: React.MouseEvent, line_number: number | null = null) => {
    e.stopPropagation();
    !!!line_number ? removeResultGroup(filePath) : removeSingleMatch(filePath, line_number);
  };

  return (
    <div className="flex flex-col mb-1">
      <div 
        className="group/item flex items-center h-6 px-2 gap-1.5 hover:bg-white/5 cursor-pointer rounded-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconChevron 
          width={14} 
          className={cn("transition-transform opacity-60 flex-none", !isExpanded && "-rotate-90")} 
        />
        <Icon className="w-4 h-4 flex-none" />
        <span className="text-[13px] text-white-gray truncate flex-1">
          {fileName}
        </span>
        <div className="flex items-center justify-center min-w-5 h-4 ml-1">
          <span className="bg-shared/40 px-1.5 rounded-full text-[10px] text-inactive-gray group-hover/item:hidden">
            {matches.length}
          </span>
          
          <button 
            onClick={handleRemove}
            className="hidden group-hover/item:flex items-center justify-center p-0.5 hover:bg-shared rounded-sm transition-colors"
          >
            <IconClose width={12} height={12} className="text-inactive-gray hover:text-white" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col mt-0.5 ml-3.5 border-l border-border/40 pl-1">
          {matches.map((match, i) => (
            <div 
              key={`${match.line_number}-${i}`}
              className="
                flex items-center h-6 pr-2 gap-2 rounded-sm
                hover:bg-accent-teal/20 cursor-pointer text-[12px] group/item
              "
              onClick={() => onFileClick(match.file_path, fileName, match.line_number)}
            >
              <span className="text-inactive-gray font-mono text-[10px] min-w-6 text-right">
                {match.line_number}
              </span>
              <span className="text-white-gray group-hover:text-white-gray truncate w-full">
                {match.line_content}
              </span>
              <button 
                className="hidden group-hover/item:flex items-center justify-center p-0.5 hover:bg-shared rounded-sm"
                onClick={(e) => handleRemove(e, match.line_number)}
              >
                <IconClose width={10} height={10} className="text-inactive-gray hover:text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});