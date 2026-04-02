import { type FC, type SVGProps, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: FC<SVGProps<SVGSVGElement>>;
  tooltip: string;
  active?: boolean;
  variant?: 'activity' | 'toolbar' | 'ghost';
}

export const IconButton: FC<IconButtonProps> = ({
  icon: Icon,
  tooltip,
  active = false,
  variant = 'activity',
  className,
  ...props
}) => {
  const variants = {
    activity: cn(
      "w-8 h-8 flex items-center justify-center transition-all duration-150",
      "bg-transparent border border-transparent",
      !active && "hover:bg-gray-block-hover hover:border-gray-stroke hover:rounded-[4px]"
    ),
    toolbar: 'p-1.5 hover:bg-muted rounded-md text-muted-foreground',
    ghost: 'p-1 opacity-70 hover:opacity-100 hover:bg-accent',
  };

  const activeStyles = {
    activity: 'bg-gray-block border-gray-stroke rounded-[4px] opacity-100',
    toolbar: 'bg-accent text-accent-foreground',
    ghost: 'opacity-100 bg-accent',
  };

  return (
    <button
      className={cn(
        variants[variant], 
        active && activeStyles[variant], 
        className,
        "cursor-pointer"
      )}
      title={tooltip}
      type="button"
      {...props}
    >
      <Icon 
        className={cn(
          "w-5.5 h-5.5",
          "text-white-gray transition-colors"
        )} 
      />
    </button>
  );
};