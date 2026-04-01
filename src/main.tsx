import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Styles
import '@/styles/main.css'

// Features
import { commandRegistry } from '@/features/command-registry/model'

const rootElement: HTMLElement | null = document.getElementById('root');

if (rootElement === null) {
  throw new Error(
    'Root element not found. Ensure index.html contains <div id="root"></div>'
  );
}

commandRegistry.register({
  id: 'app.hello',
  label: 'Hello Zest',
  handler: () => {
    console.log('Welcome to Zest Code IDE v0.1.0!');
  },
});

commandRegistry.register({
  id: 'workbench.toggleSidebar',
  label: 'Toggle Sidebar',
  shortcut: 'Ctrl+B',
  handler: () => {
    console.log('Toggling sidebar...');
  },
});

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
