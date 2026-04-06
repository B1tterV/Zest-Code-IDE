import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Terminal } from "@xterm/xterm";

export const useTerminal = (id: string, xterm: Terminal | null) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!xterm || isInitialized.current) return;

    let unlistenFn: (() => void) | undefined;

    const setup = async () => {
      unlistenFn = await listen<string>(`terminal-data-${id}`, (event) => {
        const data = event.payload;

        if (data.includes('\x0c') || data.includes('\x1b[2J')) {
          xterm.clear();
        }

        xterm.write(event.payload);
      });

      try {
        const cols = xterm.cols || 80;
        const rows = xterm.rows || 24;
        await invoke("create_terminal", { id, cols, rows });

        isInitialized.current = true;

        setTimeout(async () => {
          await invoke("write_terminal", { id, data: "" });
        }, 500);
      } catch (e) {
        console.error("Terminal spawn error:", e);
      }
    };

    setup();

    return () => {
      if (unlistenFn) unlistenFn();
      isInitialized.current = false;
    };
  }, [id, xterm]);

  const sendData = async (data: string) => {
    if (isInitialized.current) {
      await invoke("write_terminal", { id, data });
    }
  };

  const clearTerminal = () => {
    if (xterm) {
      xterm.clear();
      invoke("write_terminal", { id, data: "\x0c" }); 
    }
  };

  return { sendData, clearTerminal };
};
