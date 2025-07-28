import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import Log from './Log';
import ErrorPage from './ErrorPage';
import { pageview } from './analytics';

// Create a component to track page views on route change
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return null; // doesn't render anything
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        {/* Track analytics */}
        <AnalyticsTracker />

        <Routes>
          <Route path="/" element={<Home />} />
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