import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  position?: { x: number; y: number } | null;
  children: ReactNode;
  className?: string;
}

export const Popover: FC<PopoverProps> = ({ isOpen, onClose, anchorRef, position, children, className }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedOutsidePopover = !popoverRef.current?.contains(target);
      const clickedOutsideAnchor = !anchorRef?.current?.contains(target);

      if (clickedOutsidePopover && clickedOutsideAnchor) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  let style: React.CSSProperties = { position: 'fixed', zIndex: 9999 };

  if (position) {
    style = { ...style, top: position.y, left: position.x };
  } else if (anchorRef?.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    style = { ...style, top: rect.bottom + 4, left: rect.left };
  }
  
  return createPortal(
    <div
      ref={popoverRef}
      className={cn("fixed", className)}
      style={style}
    >
      {children}
    </div>,
    document.body
  );
};