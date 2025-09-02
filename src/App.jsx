import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider, DataContext } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import Log from './Log';
import { pageview } from './analytics';

// Format date as YY-MM-DD
const formatDate = (date) => {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

// Get today's effective date
const getEffectiveDate = (items) => {
  if (!items || items.length === 0) return null;
  const todayDate = formatDate(new Date());
  return (
    items.find((item) => item.date === todayDate) ||
    items.reduce((latest, item) => (!latest || item.date > latest.date ? item : latest), null)
  );
};

// Analytics & SEO component
const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname === '/index.html' ? '/' : location.pathname;
  const { items, loading } = useContext(DataContext);
  const dynamicClockRoute = /^\/\d{2}-\d{2}-\d{2}$/;
  const isClockPage = dynamicClockRoute.test(path);
  const effectiveClock = path === '/today' && !loading ? getEffectiveDate(items) : null;

  const meta = isClockPage
    ? {
        title: `BorrowedTime Clock for ${path.slice(1)}`,
        description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
      }
    : path === '/today' && effectiveClock
    ? {
        title: `BorrowedTime Clock for ${effectiveClock.date}`,
        description: `A clock for ${effectiveClock.date} created by Cubist Heart Laboratories.`,
      }
    : {
        title: 'BorrowedTime @ Cubist Heart Laboratories 🧊🫀🔭',
        description: 'A new clock every day.',
      };

  useEffect(() => {
    pageview(path + location.search);
  }, [path, location.search]);

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

const App = () => {
  return (
    <DataProvider>
      <Router>
        <AnalyticsAndSEO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<ClockPage />} />
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/log" element={<Log />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />

          {/* Redirect /index.html to homepage */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />

          {/* Catch-all: redirect any unmatched path to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
