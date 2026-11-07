import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Clock from './Clock';
import AnalogClock from './26-11/26-11-06/Clock';

const ClockPage: React.FC = () => {
  const { page } = useParams();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Clock />} />
        <Route path="/26-11-06" element={<AnalogClock />} />
      </Routes>
    </Router>
  );
};

export default ClockPage;
