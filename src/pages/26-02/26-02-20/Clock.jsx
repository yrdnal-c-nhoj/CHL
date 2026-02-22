/** @jsxImportSource react */
import React, { useState, useEffect, useMemo } from 'react';

/* =========================
   CONFIGURATION
========================= */
const UPDATE_INTERVAL = 1000; // ms
const MOBILE_BREAKPOINT = 768;
const FONT_NAME = 'Forum';

/* =========================
   ASSETS
========================= */
import backgroundImage from '../../../assets/images/26-02/26-02-20/forum2.webp';
import topImage from '../../../assets/images/26-02/26-02-20/forum.webp';
import forumFont from '../../../assets/fonts/26-02-20-forum.otf';

/* =========================
   UTILITY FUNCTIONS
========================= */
const formatTime = (num) => num.toString().padStart(2, '0');

const getTimeDigits = (date) => {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes().toString(); // No leading zeros for minutes
  const seconds = formatTime(date.getSeconds());
  const isPM = hours24 >= 12;
  return {
    hours: hours12.toString(), // No leading zeros for hours
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
    
    // Load Forum font using FontFace API
    const font = new FontFace(FONT_NAME, `url(${forumFont})`);
    font.load().then(() => {
      document.fonts.add(font);
    }).catch(err => {
      console.error("Forum font load failed", err);
    });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
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
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    // Superior FOUC prevention from 26-02-18 - Simple & Effective
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    visibility: isReady ? 'visible' : 'hidden',
  };

  const topImageStyle = {
    width: '100%',
    height: '20vh',
    objectFit: '100% auto',
    flexShrink: 0,
  };

  const combinedStripeStyle = {
    width: '100%',
    height: isMobile ? 'auto' : '50px', // Full height for combined stripe
    // padding: isMobile ? '1.5rem 0' : '0',
    background: `linear-gradient(to bottom, #18368E 50%, #66023C 50%)`, // Blue union on top, red on bottom
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'height 0.3s ease',
  };




const clockRowStyle = {
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: isMobile ? '0.5rem' : '0.9rem',
  fontFamily: `'${FONT_NAME}', serif`,
  
  // ─── Brass metallic look ───────────────────────────────────────
  background: 'linear-gradient(135deg, #3a2c0f 0%, #8b6914 20%, #d4a017 40%, #f0d08a 50%, #d4a017 60%, #b8860b 80%, #3a2c0f 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',                    // required for gradient text
  
  // Thick / raised / embossed 3D effect
  textShadow: `
    0 1px 0 #f0e68c,
    0 2px 0 #deb887,
    0 3px 0 #cd853f,
    0 4px 0 #b8860b,
    0 5px 6px rgba(0,0,0,0.7),
    0 8px 12px rgba(0,0,0,0.5)
  `,
  
  // Extra definition & slight glow (brass often has subtle shine)
  WebkitTextStroke: '0.5px #4a2c0a',       // thin dark outline → makes it pop & look thicker
  textStroke: '0.5px #4a2c0a',
  
  letterSpacing: '0.18em',
  fontSize: isMobile ? 'clamp(18px, 5.5vw, 28px)' : 'clamp(16px, 2.4vw, 26px)',
  fontWeight: '600',                        // slightly bolder if Forum supports it
  whiteSpace: 'nowrap',
  textAlign: 'center',
  
  // Optional: subtle shine animation (uncomment if you like movement)
  // backgroundSize: '200% 200%',
  // animation: 'brassShine 8s ease-in-out infinite',
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

      {/* Combined blue union + red stripe with clock on top */}
      <div style={combinedStripeStyle}>
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