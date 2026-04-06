import { FC, useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { useTerminal } from '@/features/terminal';
import '@xterm/xterm/css/xterm.css';
import { invoke } from '@tauri-apps/api/core';

interface Props {
  id: string;
}

export const TerminalViewer: FC<Props> = ({ id }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { sendData } = useTerminal(id, isReady ? xtermRef.current : null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#151515',
        foreground: '#CFCFCF',
        cursor: '#256C68',
        selectionBackground: '#256C6844',
      },
      fontFamily: 'Geist Mono',
      fontSize: 13,
      cursorBlink: true,
      allowProposedApi: true,
      convertEol: true,
      macOptionIsMeta: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    try {
      const webglAddon = new WebglAddon();
      term.loadAddon(webglAddon);
    } catch (e) {
      console.warn("WebGL addon failed to load, falling back to DOM renderer", e);
    }

    if (terminalRef.current) {
      terminalRef.current.innerHTML = '';
    }

    term.open(terminalRef.current);

    const handleResize = () => {
        if (fitAddonRef.current && xtermRef.current) {
          try {
            fitAddonRef.current.fit();
            const dims = xtermRef.current;
            invoke('resize_terminal', { 
              id, 
              cols: dims.cols, 
              rows: dims.rows 
            }).catch(console.error);
          } catch (e) {}
        }
    };

    requestAnimationFrame(() => {
      try {
          fitAddon.fit();
          handleResize()
      } catch (e) {}
    });

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    setIsReady(true);

    term.onData((data) => sendData(data));

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
      setIsReady(false);
      if (terminalRef.current) {
        terminalRef.current.innerHTML = '';
      }
    };
  }, [id]);

  return (
    <div 
      ref={terminalRef} 
      className="h-full w-full bg-second-content p-2" 
      style={{ minHeight: '100px' }}
    />
  );
};