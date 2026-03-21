import React, { useEffect, useContext, useMemo, Suspense, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
// Temporarily comment out complex imports
// import Header from './components/Header';
// import ClockPageNav from './components/ClockPageNav';
// import { ClockLoadingFallback } from './utils/fontLoader';
// import { useClockPage } from './hooks/useClockPage';
// import styles from './ClockPage.module.css';

// Configuration constants
const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;
const HEADER_FADE_DELAY = 1500; // 1.5 seconds
const OVERLAY_FADE_DURATION = 300; // 0.3 seconds for a smoother fade

const ClockPage: React.FC = () => {
  const { date } = useParams();
  console.log('ClockPage component mounted with date:', date);
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontSize: '24px',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <div>
        <h1>ClockPage Test</h1>
        <p>Date: {date}</p>
        <p>If you can see this, the ClockPage component is working!</p>
      </div>
    </div>
  );
};

export default ClockPage;
