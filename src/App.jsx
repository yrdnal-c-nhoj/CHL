import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider, DataContext } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import { pageview } from './analytics';

// Analytics & SEO component
const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname === '/index.html' ? '/' : location.pathname;
  const dynamicClockRoute = /^\/\d{2}-\d{2}-\d{2}$/;

  const meta = dynamicClockRoute.test(path)
    ? {
        title: `BorrowedTime Clock for ${path.slice(1)}`,
        description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
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
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;