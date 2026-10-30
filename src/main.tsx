import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; color: white; background: #0a0a0a; font-family: monospace;">
        <h1 style="color: #ef4444;">Runtime Error</h1>
        <pre style="color: #fbbf24; white-space: pre-wrap;">${event.error?.toString()}</pre>
        <pre style="color: #737373; white-space: pre-wrap; margin-top: 20px;">${event.error?.stack}</pre>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('LightOS initializing...');

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('LightOS mounted successfully');
} catch (error) {
  console.error('Failed to mount app:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; color: white; background: #0a0a0a; font-family: monospace;">
        <h1 style="color: #ef4444;">Failed to initialize</h1>
        <pre style="color: #fbbf24;">${error instanceof Error ? error.message : String(error)}</pre>
        <pre style="color: #737373; white-space: pre-wrap; margin-top: 20px;">${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `;
  }
}
