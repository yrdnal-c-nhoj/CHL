import React, { useEffect, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import castelImage from '@/assets/images/25_images/25-08/25-08-24/castel.jpg';
import viaFont from '@/assets/fonts/25fonts/25-08-24-via.ttf';
import { useSecondClock } from '@/utils/hooks';
const { time } = useSecondClock();

const toRoman = (num: number) => {
  const romanMap = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let result = '';
  for (const [value, numeral] of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result || 'N';
};

const RomanClock = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'Via',
      fontUrl: viaFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  const [time, setTime] = useState('');
  const [fade, setFade] = useState(false);
  const timeoutRef = useRef<any | null>(null);

  useEffect(() => {
      updateClock();
    }, [time]);

  const containerStyle = {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    fontFamily: fontsLoaded ? "'Via', serif" : 'serif',
    backgroundColor: '#1a1a1a',
    backgroundImage: `url(${castelImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
  };

  const timeStyle = {
    color: 'rgb(203, 227, 197)',
    fontSize: '1.7rem',
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
    opacity: fade ? 0 : 1,
    transition: 'opacity 0.5s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <div style={timeStyle}>{time}</div>
    </div>
  );
};

export default RomanClock;
