import { type FC, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  label: string;
}

export const MenuButton: FC<MenuButtonProps> = ({ isActive, label, className, ...props }) => (
  <button
    className={cn(
      "px-2 py-0.5 h-fit text-[13px] rounded-sm transition-colors cursor-pointer",
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