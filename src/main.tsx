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
import './index.css';
import App from './App.tsx';

/**
 * Performance monitoring and error reporting
 * Only enabled in development for debugging
 */
const enablePerformanceMonitoring = import.meta.env.DEV;

if (enablePerformanceMonitoring) {
  // Performance monitoring setup
  if ('performance' in window) {
    window.addEventListener('load', (event: Event) => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page Load Performance:', {
        domContentLoaded: perfData &&
          perfData.domContentLoadedEventEnd -
          perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.navigationStart,
      });
    });
  }
}

/**
 * Error handling for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // In production, you might want to send this to an error reporting service
  if (import.meta.env.PROD) {
    // Example: sendToErrorReporting(event.reason);
  }
});

/**
 * Initialize the application
 */
const initializeApp = () => {
  try {
    // Find the root element
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      throw new Error(
        'Root element not found. Make sure there is a div with id="root" in your HTML.',
      );
    }

    // Mark React as hydrated to prevent FOUC (Flash of Unstyled Content)
    document.documentElement.classList.add('react-hydrated');

    // Create and render the React application
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>,
    );

    // Log successful initialization in development
    if (enablePerformanceMonitoring) {
      console.log('🚀 React application initialized successfully');
      console.log('📊 Environment:', import.meta.env.MODE);
      console.log('🔧 Vite HMR enabled:', import.meta.hot?.status);
    }
  } catch (error) {
    console.error('Failed to initialize application:', error);

    // Fallback UI for critical initialization errors
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: monospace;
        text-align: center;
        background: #f5f5f5;
        margin: 0;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #e74c3c;">Application Error</h1>
          <p>Failed to load the application. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          ">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
};

/**
 * Wait for DOM to be ready before initializing
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/**
 * Hot Module Replacement (HMR) acceptance for development
 */
if (import.meta.hot) {
  import.meta.hot.accept('./App.tsx', () => {
    console.log('🔄 HMR: App component updated');
  });

  import.meta.hot.accept();
}
