import { FC } from 'react';
import { useTerminalStore } from '@/entities/terminal';
import { TerminalViewer } from '@/shared/ui';

export const TerminalPanel: FC = () => {
  const { instances, activeTerminalId, setActiveTerminal } = useTerminalStore();
  return (
    <div className="flex flex-col h-full bg-second-content">
      <div className="flex items-center h-9 border-b border-border px-2 gap-2 shrink-0">
        {instances.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTerminal(t.id)}
            className={`px-3 h-full text-[12px] transition-colors border-b-2 ${
              activeTerminalId === t.id ? 'border-accent-teal text-white' : 'border-transparent text-inactive-gray'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 relative">
        {instances.map(t => (
          <div 
            key={t.id} 
            className={`h-full w-full ${activeTerminalId === t.id ? 'block' : 'hidden'}`}
          >
            <TerminalViewer id={t.id} />
          </div>
        ))}
      </div>
    </div>
  );
};