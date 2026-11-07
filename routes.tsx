import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClockPage from '../pages/ClockPage';
import AnalogClock from '../pages/26-11/26-11-06/Clock';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClockPage />} />
        <Route path="/26-11-06" element={<AnalogClock />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
