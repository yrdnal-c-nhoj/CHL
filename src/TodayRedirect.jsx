import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider, DataContext } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import Log from './Log';
import ErrorPage from './ErrorPage';
import { pageview } from './analytics';

// --- Helper functions ---
const formatDate = (date) => {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const getEffectiveDate = (items) => {
  if (!items || items.length === 0) return null;

  const today = new Date();
  const todayDate = formatDate(today);

  // Check for today
  let selected = items.find(item => item.date === todayDate);
  if (selected) return selected.date;

  // Fall back to most recent
  const latestItem = items.reduce((latest, item) => {
    if (!item?.date) return latest;
    return !latest || item.date > latest.date ? item : latest;
  }, null);
  return latestItem ? latestItem.date : null;
};

// --- Analytics & SEO ---
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
    description: 'Discover today\'s unique clock from Cubist Heart Laboratories.',
  },
};

const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname;
  const { items, loading } = useContext(DataContext);

  const dynamicClockRoute = /^\/\d{2}-\d{2}-\d{2}$/;
  const isClockPage = dynamicClockRoute.test(path);

  // For /today, use effective date (today or most recent)
  const effectiveDate = path === '/today' && !loading ? getEffectiveDate(items) : null;

  const meta = isClockPage
    ? {
        title: `BorrowedTime Clock for ${path.slice(1)}`,
        description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
      }
    : path === '/today' && effectiveDate
    ? {
        title: `BorrowedTime Clock for ${effectiveDate}`,
        description: `A clock for ${effectiveDate} created by Cubist Heart Laboratories.`,
      }
    : metaMap[path] || {
        title: 'BorrowedTime',
        description: 'A project by Cubist Heart Laboratories.',
      };

  React.useEffect(() => {
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

// --- Today page ---
const TodayPage = () => {
  const { items, loading, error } = useContext(DataContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorPage />;

  const today = new Date();
  const todayDate = formatDate(today);

  // Try today's clock first
  let effectiveDate = items.find(item => item.date === todayDate)?.date;

  // Fallback to most recent if today's clock not available
  if (!effectiveDate) {
    effectiveDate = getEffectiveDate(items);
  }

  if (!effectiveDate) return <Home />;

  return <ClockPage date={effectiveDate} />;
};

// --- App component ---
const App = () => {
  return (
    <DataProvider>
      <Router>
        <AnalyticsAndSEO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/log" element={<Log />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
