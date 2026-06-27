import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo } from 'react';

// Digit style interface
interface DigitStyle {
  bg: string;
  color: string;
}

// Component Props interface
interface StripeClockProps {
  // No props required for this component
}

// Digit color mapping
const digitStyles: Record<string, DigitStyle> = {
  0: { bg: '#0E51FAFF', color: '#F87E04FF' },
  1: { bg: '#FA0820FF', color: '#2F9B04FF' },
  2: { bg: '#F7FF06FF', color: '#A205C2FF' },
  3: { bg: '#2F9B04FF', color: '#FA0820FF' },
  4: { bg: '#FC8004FF', color: '#0E51FAFF' },
  5: { bg: '#A205C2FF', color: '#F7FF06FF' },
  6: { bg: '#141313FF', color: '#F4F2F2FF' },
  7: { bg: '#F4F2F2FF', color: '#141313FF' },
  8: { bg: '#966105FF', color: '#F92FB9FF' },
  9: { bg: '#F92FB9FF', color: '#966105FF' },
};

// Load Google Font dynamically
const loadFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Asset&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export default function StripeClock() {
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();
  
  useEffect(() => {
    loadFont();
  }, []);

  const timeStr = time
    .toLocaleTimeString('en-GB', { hour12: false })
    .replace(/:/g, '');

  // Container style
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // stack stripes vertically
    width: '100vw',
    height: '100dvh',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    fontFamily: "'Asset', monospace",
    fontWeight: 'bold',
  };

  // Stripe style function
  const getStripeStyle = (char: string): React.CSSProperties => ({
    flex: 1, // each stripe takes equal vertical space
    width: '100vw', // full viewport width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10vh',
    fontWeight: 'bold',
    backgroundColor: digitStyles[char].bg,
    color: digitStyles[char].color,
    transition: 'all 0.5s ease',
  });

  return (
    <div style={containerStyle}>
      {timeStr.split('').map((char, idx) => (
        <div key={idx} style={getStripeStyle(char)}>
          {char}
        </div>
      ))}
    </div>
  );
}
