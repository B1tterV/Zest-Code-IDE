import { useState, useEffect, type FC } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { ReactComponent as IconMinimize } from "@/icons/minimize.svg";
import { ReactComponent as IconMaximize } from "@/icons/maximize.svg";
import { ReactComponent as IconRestore } from "@/icons/restore.svg";
import { ReactComponent as IconClose } from "@/icons/close.svg";
import { cn } from '@/shared/lib/utils';

export const WindowControls: FC = () => {
  const appWindow = getCurrentWindow();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Инициализация при первом рендере
    appWindow.isMaximized().then(setIsMaximized);

    return () => {
      unlisten.then((f) => f());
    };
  }, [appWindow]);

  const handleMinimize = async () => await appWindow.minimize();
  const handleMaximize = async () => await appWindow.toggleMaximize();
  const handleClose = async () => await appWindow.close();

  const btnClass = cn(
    "w-[45px] h-full flex items-center justify-center transition-colors",
    "hover:bg-white/10 active:bg-white/5 rounded-sm cursor-pointer"
  );

  return (
    <div className="flex h-full flex-none items-end" data-tauri-drag-region >
      <button 
        onClick={handleMinimize} 
        className={btnClass} 
        title="Minimize"
      >
        <IconMinimize className="w-3.5 h-3.5 text-white-gray" />
      </button>
      
      <button onClick={handleMaximize} className={btnClass} title={isMaximized ? "Restore" : "Maximize"}>
        {isMaximized ? (
          <IconRestore className="w-3.5 h-3.5 text-white-gray" />
        ) : (
          <IconMaximize className="w-3.5 h-3.5 text-white-gray" />
        )}
      </button>
      
      <button 
        onClick={handleClose} 
        className={cn(btnClass, "hover:bg-red/80 hover:text-white")} 
        title="Close"
      >
        <IconClose className="w-3.5 h-3.5 text-white-gray" />
      </button>
    </div>
  );
};