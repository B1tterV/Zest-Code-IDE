import { type FC, type ReactNode, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const BaseInput: FC<BaseInputProps> = ({
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "relative flex items-center h-7 rounded-sm bg-block border border-gray-stroke px-2 gap-1.25 transition-all",
        "focus-within:border-white-gray/50",
        containerClassName
      )}
      style={{ width: props.style?.width || '450px' }}
    >
      {leftIcon && <div className="flex-none flex items-center justify-center">{leftIcon}</div>}
      
      <input
        className={cn(
          "flex-1 bg-transparent border-none outline-none text-[14px] text-white-gray placeholder:text-inactive-gray min-w-0 truncate",
          className
        )}
        {...props}
      />

      {rightIcon && <div className="flex-none flex items-center justify-center">{rightIcon}</div>}
    </div>
  );
};