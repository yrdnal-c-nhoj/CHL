import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Home from './Home';
import ClockPage from './ClockPage';
import Manifesto from './Manifesto';
import About from './About';
import Contact from './Contact';
import { Analytics } from "@vercel/analytics/next"

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:date" element={<ClockPage />} />
        <Route path="/about" element={<About />} />
          <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;