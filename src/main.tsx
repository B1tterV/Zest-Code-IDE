import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Styles
import '@shared/assets/styles/main.css'

// Features
import { commandRegistry } from '@features/command-registry/model'

commandRegistry.register({
  id: 'app.hello',
  label: 'Hello Zest',
  handler: () => alert('Welcome to Zest Code IDE v0.1.0!')
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
