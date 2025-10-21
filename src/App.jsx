// App.jsx
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider, DataContext } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Today from './Today';
import Contact from './Contact';
import { pageview } from './analytics';

console.log('📦 [App.jsx] File loaded.');

const AnalyticsAndSEO = () => {
  const location = useLocation();
  console.log('🧭 [AnalyticsAndSEO] useLocation called:', location.pathname);

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
    console.log('📊 [AnalyticsAndSEO] pageview() triggered for path:', path + location.search);
    pageview(path + location.search);
  }, [path, location.search]);

  console.log('🧠 [AnalyticsAndSEO] Meta prepared:', meta);

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
  console.log('🧩 [App] Component rendering...');

  useEffect(() => {
    console.log('✅ [App] Mounted successfully.');
    return () => console.log('🧹 [App] Unmounted.');
  }, []);

  return (
    <DataProvider>
      {console.log('🌐 [App] Router starting...')}
      <Router>
        <AnalyticsAndSEO />
        <Routes>
          {console.log('🗺️ [App] Defining routes...')}
          <Route path="/" element={<Home />} />
          <Route path="/:date" element={<ClockPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/today" element={<Today />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
