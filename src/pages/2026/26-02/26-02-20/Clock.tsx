import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { spellTwoDigitNumber } from '../../../../utils/latinNumberSpelling';

const UPDATE_INTERVAL = 1000;
const MOBILE_BREAKPOINT = 768;
const FONT_NAME = 'Forum';

import backgroundImage from '../../../../assets/images/2026/26-02/26-02-20/forum2.webp';
import topImage from '../../../../assets/images/2026/26-02/26-02-20/forum.webp';
import forumFont from '../../../../assets/fonts/2026/26-02-20-forum.otf';

export { backgroundImage, topImage };

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

export const fontConfigs = [
  {
    fontFamily: FONT_NAME,
    fontUrl: forumFont,
    options: {
      weight: 'normal',
      style: 'normal'
    }
  }
];

export default function ClockTemplate() {
  const time = useSecondClock();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useSuspenseFontLoader(fontConfigs);

  // Handle Responsiveness
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile(); // Initial check

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const { hours, minutes, isPM } = useMemo(() => getTimeDigits(time), [time]);

  const spelledHours = spellTwoDigitNumber(hours);
  const spelledMinutes = spellTwoDigitNumber(minutes);
  const ampm = isPM ? 'POST MERIDIEM' : 'ANTE MERIDIAN';

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
    // Show immediately - no FOUC prevention needed
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

    background:
      'linear-gradient(135deg, #3a2c0f 0%, #8b6914 20%, #d4a017 40%, #f0d08a 50%, #d4a017 60%, #b8860b 80%, #3a2c0f 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',

    textShadow: `
    0 1px 0 #f0e68c,
    0 2px 0 #deb887,
    0 3px 0 #cd853f,
    0 4px 0 #b8860b,
    0 5px 6px rgba(0,0,0,0.7),
    0 8px 12px rgba(0,0,0,0.5)
  `,

    WebkitTextStroke: '0.5px #4a2c0a',
    textStroke: '0.5px #4a2c0a',

    letterSpacing: '0.18em',
    fontSize: isMobile
      ? 'clamp(18px, 5.5vw, 28px)'
      : 'clamp(16px, 2.4vw, 26px)',
    fontWeight: '600', // slightly bolder if Forum supports it
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

  return (
    <div style={containerStyle}>
      <img src={topImage} alt="" style={topImageStyle} />

      <div style={combinedStripeStyle}>
        <div style={clockRowStyle}>
          <span>{spelledHours} HORAE</span>
          <span>{spelledMinutes} MINUTA</span>
          <span>{ampm}</span>
        </div>
      </div>

      <div style={bottomStyle} />
    </div>
  );
}
