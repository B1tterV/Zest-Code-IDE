import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  label: string;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isActive, label, className, ...props }, ref) => {
    return (
      <button
        ref={ref} // Привязываем переданный ref к нативной кнопке
        className={cn(
          "px-2 py-0.5 h-fit text-[13px] rounded-sm transition-colors cursor-pointer whitespace-nowrap",
          "text-white-gray hover:bg-shared",
          isActive && "bg-shared text-white",
          className
        )}
        type="button"
        {...props}
      >
        {label}
      </button>
    );
  }
);

MenuButton.displayName = 'MenuButton';