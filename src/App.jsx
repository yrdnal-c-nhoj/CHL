/**
 * Main Application Component
 * 
 * This is the root component of the BorrowedTime application that handles:
 * - Routing configuration with React Router v6
 * - SEO and analytics integration
 * - Error boundaries and fallbacks
 * - Dynamic route handling for clock pages
 * 
 * Features:
 * - Modern React patterns with hooks
 * - SEO optimization with dynamic meta tags
 * - Google Analytics integration
 * - Clean routing structure
 * - Future-proof React Router v7 compatibility
 */

import React, { useEffect, useCallback } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider } from './context/DataContext';

// Lazy loaded components for better performance
const Home = React.lazy(() => import('./Home'));
const ClockPage = React.lazy(() => import('./ClockPage'));
const Manifesto = React.lazy(() => import('./Manifesto'));
const About = React.lazy(() => import('./About'));
const Today = React.lazy(() => import('./Today'));
const Contact = React.lazy(() => import('./Contact'));

import { pageview } from './analytics';

// Configuration constants
const BASE_URL = 'https://www.cubistheart.com';
const DYNAMIC_CLOCK_REGEX = /^\/\d{2}-\d{2}-\d{2}$/;

/**
 * Analytics and SEO Component
 * 
 * Handles dynamic meta tag generation and analytics tracking
 * based on the current route
 */
const AnalyticsAndSEO = React.memo(() => {
  const location = useLocation();

  // Memoize path processing to prevent unnecessary recalculations
  const processedPath = React.useMemo(() => {
    const path = location.pathname === '/index.html' ? '/' : location.pathname;
    return { path, isDynamicClock: DYNAMIC_CLOCK_REGEX.test(path) };
  }, [location.pathname]);

  // Memoize meta data generation
  const metaData = React.useMemo(() => {
    const { path, isDynamicClock } = processedPath;
    
    return isDynamicClock
      ? {
          title: `BorrowedTime Clock for ${path.slice(1)}`,
          description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
        }
      : {
          title: 'BorrowedTime @ Cubist Heart Laboratories 🧊🫀🔭',
          description: 'A new clock every day.',
        };
  }, [processedPath]);

  // Analytics tracking with useCallback to prevent unnecessary re-renders
  const trackPageView = useCallback(() => {
    try {
      pageview(processedPath.path + location.search);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, [processedPath.path, location.search]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <Helmet>
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:url" content={`${BASE_URL}${processedPath.path}`} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={`${BASE_URL}${processedPath.path}`} />
    </Helmet>
  );
});

AnalyticsAndSEO.displayName = 'AnalyticsAndSEO';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          fontFamily: 'monospace'
        }}>
          <h1>Something went wrong</h1>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main App Component
 * 
 * The root component that sets up routing, error boundaries,
 * and global providers for the entire application
 */
const App = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}>
          <AnalyticsAndSEO />
          
          <React.Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontSize: '1.5rem',
              fontFamily: 'monospace'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:date" element={<ClockPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/manifesto" element={<Manifesto />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/today" element={<Today />} />
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;
