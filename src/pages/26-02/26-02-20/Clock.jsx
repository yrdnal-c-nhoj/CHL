/** @jsxImportSource react */
import React, { useState, useEffect, useMemo } from 'react';

/* =========================
   CONFIGURATION
========================= */
const UPDATE_INTERVAL = 1000; // ms
const MOBILE_BREAKPOINT = 768;

/* =========================
   ASSETS
========================= */
import backgroundImage from '../../../assets/images/26-02/26-02-20/forum2.webp';
import topImage from '../../../assets/images/26-02/26-02-20/forum.webp';

/* =========================
   UTILITY FUNCTIONS
========================= */
const formatTime = (num) => num.toString().padStart(2, '0');

const getTimeDigits = (date) => {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = formatTime(date.getMinutes());
  const seconds = formatTime(date.getSeconds());
  const isPM = hours24 >= 12;
  return {
    hours: formatTime(hours12),
    minutes,
    seconds,
    isPM,
  };
};

const spellNumber = (num) => {
  const ones = ['', 'UNUS', 'DUO', 'TRES', 'QUATTUOR', 'QUINQUE', 'SEX', 'SEPTEM', 'OCTO', 'NOVEM'];
  const teens = ['DECEM', 'UNDECIM', 'DUODECIM', 'TREDECIM', 'QUATTUORDECIM', 'QUINDECIM', 'SEDECIM', 'SEPTEDECIM', 'DUODEVIGINTI', 'UNDEVIGINTI'];
  const tens = ['', '', 'VIGINTI', 'TRIGINTA', 'QUADRAGINTA', 'QUINQUAGINTA', 'SEXAGINTA', 'SEPTUAGINTA', 'OCTOGINTA', 'NONAGINTA'];

  if (num === 0) return 'NULLUS';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
  }
  return num.toString();
};

const spellTwoDigitNumber = (twoDigitStr) => {
  const num = parseInt(twoDigitStr, 10);
  if (twoDigitStr.startsWith('0') && num !== 0) {
    return 'NULLA ' + spellNumber(num);
  }
  return spellNumber(num);
};

/* =========================
   CUSTOM HOOKS
========================= */
function useClock(updateInterval = UPDATE_INTERVAL) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);
  return time;
}

function useImagePreload(imageUrl) {
  const [isReady, setIsReady] = useState(!imageUrl);
  useEffect(() => {
    if (!imageUrl) return;
    let mounted = true;
    const img = new Image();
    img.onload = () => mounted && setIsReady(true);
    img.onerror = () => mounted && setIsReady(true);
    img.src = imageUrl;
    return () => { mounted = false; };
  }, [imageUrl]);
  return isReady;
}

/* =========================
   MAIN COMPONENT
========================= */
export default function ClockTemplate() {
  const time = useClock();
  const [isMobile, setIsMobile] = useState(false);

  // Handle Responsiveness & Font
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile(); // Initial check
    
    window.addEventListener('resize', checkMobile);
    
    // Preload font to prevent FOUC
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Vast+Shadow&display=swap';
    link.rel = 'stylesheet';
    link.media = 'print'; // Initially hide to prevent FOUC
    document.head.appendChild(link);
    
    // Trigger font loading after a short delay
    setTimeout(() => {
      link.media = 'all';
    }, 0);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const isBgReady    = useImagePreload(backgroundImage);
  const isTopReady   = useImagePreload(topImage);
  const isReady      = isBgReady && isTopReady;

  const { hours, minutes, isPM } = useMemo(() => getTimeDigits(time), [time]);

  const spelledHours   = spellTwoDigitNumber(hours);
  const spelledMinutes = spellTwoDigitNumber(minutes);
  const ampm           = isPM ? 'POST MERIDIEM' : 'ANTE MERIDIAN';

  /* =========================
      STYLES
  ========================= */
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.4s ease',
    // Prevent FOUC
    visibility: isReady ? 'visible' : 'hidden',
  };

  const topImageStyle = {
    width: '100%',
    height: '20vh',
    objectFit: '100% auto',
    flexShrink: 0,
  };

  const redLineStyle = {
    width: '100%',
    // Expand stripe height on mobile, keep 60px on laptop
    height: isMobile ? 'auto' : '60px',
    padding: isMobile ? '1.5rem 0' : '0',
    backgroundColor: '#66023C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'height 0.3s ease',
  };

  const clockRowStyle = {
    display: 'flex',
    // Vertical stack on mobile, horizontal row on laptop
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '0.5rem' : '0.9rem',
    fontFamily: '"Vast Shadow", cursive, sans-serif',
    color: '#fff',
    textShadow: '0 0 12px rgba(0,0,0,0.9)',
    fontSize: isMobile ? 'clamp(16px, 5vw, 24px)' : 'clamp(14px, 2.1vw, 22px)',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  };

  const bottomStyle = {
    flex: 1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  /* =========================
      LOADING / RENDER
  ========================= */
  if (!isReady) {
    return (
      <div style={{ 
        ...containerStyle, 
        opacity: 1, 
        visibility: 'visible',
        backgroundColor: '#000', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ color: '#444', fontSize: '3rem', fontFamily: 'monospace' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Top decorative image */}
      <img src={topImage} alt="" style={topImageStyle} />

      {/* Red bar + clock */}
      <div style={redLineStyle}>
        <div style={clockRowStyle}>
          {/* Text broken into three parts for column stacking */}
          <span>{spelledHours} HORAE</span>
          <span>{spelledMinutes} MINUTA</span>
          <span>{ampm}</span>
        </div>
      </div>

      {/* Bottom background image */}
      <div style={bottomStyle} />
    </div>
  );
}