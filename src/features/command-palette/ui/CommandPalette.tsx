import { useEffect, useRef, type FC } from 'react';
import { createPortal } from 'react-dom';
import { useCommandPalette } from '../model/store';
import { ReactComponent as IconSearch } from "@/icons/search.svg";

export const CommandPalette: FC = () => {
  const { isOpen, close, query, setQuery } = useCommandPalette();
  const inputRef = useRef<HTMLInputElement>(null);

  // Автофокус при открытии
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Закрытие на Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [close]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex justify-center pt-2 px-4 bg-black/20 backdrop-blur-[1px]" onClick={close}>
      <div 
        className="w-full max-w-150 bg-block border border-gray-stroke rounded-lg shadow-2xl overflow-hidden h-fit mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Area */}
        <div className="flex items-center p-2 gap-2 border-b border-border">
          <IconSearch className="w-4 h-4 text-white-gray" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name (append : to go to line or @ to go to symbol)"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white-gray placeholder:text-inactive-gray"
          />
        </div>

        {/* Results List */}
        <div className="max-h-112.5 overflow-y-auto py-1 scrollbar-hide">
        </div>
        
        {/* Footer */}
        <div className="p-2 border-t border-border bg-color-second-content/50 text-[10px] text-inactive-gray flex justify-between">
           <span>Select an item to open</span>
           <span>More ?</span>
        </div>
      </div>
    </div>,
    document.body
  );
};