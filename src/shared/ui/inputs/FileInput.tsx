import { FC, KeyboardEvent, useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface FileInputProps {
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  onChange?: (value: string) => void;
  className?: string;
}

export const FileInput: FC<FileInputProps> = ({ 
  defaultValue = '', 
  onConfirm, 
  onCancel,
  onChange,
  className 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const lastDotIndex = defaultValue.lastIndexOf('.');
      if (lastDotIndex > 0) {
        inputRef.current.setSelectionRange(0, lastDotIndex);
      } else {
        inputRef.current.select();
      }
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') onConfirm(inputRef.current?.value || '');
    if (e.key === 'Escape') onCancel();
  };

  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={onCancel}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "bg-block border border-accent-teal outline-none text-[13px] w-full px-1 h-4.5 text-white shadow-xl",
        className
      )}
    />
  );
};