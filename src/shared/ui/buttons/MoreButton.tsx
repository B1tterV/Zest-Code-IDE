import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { ReactComponent as IconMoreHorizontal } from "@/icons/more-horizontal.svg";
import { cn } from '@/shared/lib/utils';

interface MoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  iconClassName?: string;
}

// Используем forwardRef, чтобы передать ссылку на DOM-элемент родителю (MenuBar)
export const MoreButton = forwardRef<HTMLButtonElement, MoreButtonProps>(
  ({ isActive, className, iconClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "px-2 py-1 flex items-center justify-center rounded-sm transition-colors cursor-pointer",
          "text-white-gray hover:bg-shared",
          isActive && "bg-shared text-white",
          className
        )}
        {...props}
      >
        <IconMoreHorizontal className={cn("w-4 h-4", iconClassName)} />
      </button>
    );
  }
);

MoreButton.displayName = 'MoreButton';