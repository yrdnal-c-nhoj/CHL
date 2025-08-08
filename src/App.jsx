import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataContext, DataProvider } from './context/DataContext';
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
  },
  '/today': {
    title: 'Today\'s Clock | BorrowedTime',
    description: 'The most recent clock created by Cubist Heart Laboratories.',
  },
};

// 📊 Combined analytics and SEO effect
const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname;

  // Match dynamic clock routes like "/2025-08-05"
  const dynamicClockRoute = /^\/\d{4}-\d{2}-\d{2}$/;
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

// Component to handle redirect to the most recent clock
const TodayRedirect = () => {
  const { items, loading } = useContext(DataContext);

  // Convert MM-DD-YY to YYYY-MM-DD for routing
  const convertDateFormat = (dateStr) => {
    if (!dateStr || !dateStr.match(/^\d{2}-\d{2}-\d{2}$/)) return null;
    const [month, day, year] = dateStr.split('-');
    return `20${year}-${month}-${day}`; // Assumes 20XX for YY
  };

  // Get the most recent date
  let latestDate = new Date().toISOString().split('T')[0]; // Fallback to today (YYYY-MM-DD)
  if (!loading && items.length > 0) {
    const sortedDates = items
      .map((item) => item.date)
      .filter((date) => date && date.match(/^\d{2}-\d{2}-\d{2}$/))
      .map((date) => {
        const [month, day, year] = date.split('-');
        return new Date(`20${year}-${month}-${day}`);
      })
      .sort((a, b) => b - a); // Sort descending
    if (sortedDates.length > 0) {
      const latest = sortedDates[0];
      latestDate = `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, '0')}-${String(latest.getDate()).padStart(2, '0')}`;
    }
  }

  return <Navigate to={`/${latestDate}`} replace />;
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <AnalyticsAndSEO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/today" element={<TodayRedirect />} />
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