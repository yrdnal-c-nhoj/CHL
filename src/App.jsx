import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import Log from './Log';
import ErrorPage from './ErrorPage';
import { pageview } from './analytics';

// 🧠 Route-based SEO title + description map
const metaMap = {
  '/': {
    title: 'BorrowedTime @ Cubist Heart Laboratories 🧊🫀🔭',
    description: 'A new clock every day.',
  },
  '/about': {
    title: 'About | BorrowedTime',
    description: 'About BorrowedTime and Cubist Heart Laboratories.',
  },
  '/log': {
    title: 'Change Log | BorrowedTime',
    description: 'A record of iterative growth and time experiments.',
  },
  '/manifesto': {
    title: 'Manifesto | BorrowedTime',
    description: 'Nature is too green, and badly lit.',
  },
  '/contact': {
    title: 'Contact | BorrowedTime',
    description: 'Get in touch with the team.',
  }
};

// 📊 Combined analytics and SEO effect
const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname;

  // Match dynamic clock routes like "/25-08-12"
  const dynamicClockRoute = /^\/\d{2}-\d{2}-\d{2}$/;
  const isClockPage = dynamicClockRoute.test(path);

  const meta = isClockPage
    ? {
        title: `BorrowedTime Clock for ${path.slice(1)}`,
        description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
      }
    : metaMap[path] || {
        title: 'BorrowedTime',
        description: 'A project by Cubist Heart Laboratories.',
      };

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={`https://yourdomain.com${path}`} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

// Helper to format as YY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  const yy = String(today.getFullYear()).slice(2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <AnalyticsAndSEO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Navigate to={`/${getTodayDateString()}`} replace />} />
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/log" element={<Log />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
