/**
 * Application Entry Point
 *
 * This file initializes the React application and sets up:
 * - React 18's concurrent rendering with StrictMode
 * - Helmet provider for SEO meta tag management
 * - Error handling for the root element
 * - Performance optimizations
 *
 * Features:
 * - Modern React 18 createRoot API
 * - Concurrent rendering capabilities
 * - SEO support with react-helmet-async
 * - Development and production optimizations
 * - Error boundary integration
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './styles/globals.css';
import App from './App.tsx';
import { installConsoleFilters } from './utils/consoleFilters';

// Reduce known third-party / browser-internal console noise in production.
if (import.meta.env.PROD) {
  try {
    installConsoleFilters();
  } catch {
    // no-op
  }
}

window.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    if (import.meta.env.DEV) {
      console.error('Unhandled Promise Rejection:', event.reason);
    }
  },
);

const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      throw new Error(
        'Root element not found. Make sure there is a div with id="root" in your HTML.',
      );
    }

    document.documentElement.classList.add('react-hydrated');
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>,
    );
  } catch (error) {
    // Log to console for debugging
    console.error('Critical initialization failure:', error);

    // Show error on screen in production to diagnose the "blank page"
    const errorMessage = error instanceof Error ? error.message : String(error);
    document.body.innerHTML = `
      <div style="padding: 2rem; font-family: monospace; background: white; color: black; line-height: 1.5;">
        <h1 style="color: red;">Critical Initialization Error</h1>
        <pre style="background: #eee; padding: 1rem; overflow: auto;">${errorMessage}</pre>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>`;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
