import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
}

export const Popover: FC<PopoverProps> = ({ isOpen, onClose, anchorRef, children, className }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node) && !anchorRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  // Рассчитываем позицию под кнопкой
  const rect = anchorRef.current?.getBoundingClientRect();
  
  return createPortal(
    <div
      ref={popoverRef}
      className={cn(
        "fixed z-9999 bg-block border border-border shadow-2xl rounded-md py-1 min-w-40",
        className
      )}
      style={{ top: rect ? rect.bottom + 4 : 0, left: rect ? rect.left : 0 }}
    >
      {children}
    </div>,
    document.body
  );
};