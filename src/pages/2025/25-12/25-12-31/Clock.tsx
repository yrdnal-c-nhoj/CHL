import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2025/25-12/25-12-31/shadow.jpg';
import d250916font from '@/assets/fonts/2025/25-12-31-shadow.otf';

// 1. LETTER MAPPING: Move outside to prevent recreation on every render
const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'Y',
  '1': 'I',
  '2': 'K',
  '3': 'F',
  '4': 'E',
  '5': 'F',
  '6': 'H',
  '7': 'E',
  '8': 'D',
  '9': 'C',
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(window.innerWidth > 768);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'MyD250916font', fontUrl: d250916font }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // 2. STYLES: Using fixed widths to prevent "jumping"
  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'MyD250916font', sans-serif",
    fontSize: '22vh',
    color: 'rgba(0, 0, 0, 0.4)',
    // Fixed width ensures 'I' takes as much space as 'W'
    width: '20vh',
    height: '20vh',
    textAlign: 'center',
    textShadow: `
      2px 2px 8px rgba(0, 0, 0, 0.1),
      4px 4px 16px rgba(0, 0, 0, 0.1),
      8px 8px 32px rgba(0, 0, 0, 0.1),
      16px 16px 64px rgba(0, 0, 0, 0.1)
    `,
    // filter: 'blur(0.5px)',
    // opacity: 0.8
  };

  const containerStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    filter: 'contrast(0.8) brightness(1.5)',
  };

  const layoutStyle = {
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    alignItems: 'center',
    gap: isLargeScreen ? '2vw' : '1vh',
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  // 3. RENDER HELPERS
  const renderUnit = (value: string) => (
    <div style={groupStyle}>
      {value.split('').map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {DIGIT_TO_LETTER[digit] || digit}
        </div>
      ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={layoutStyle}>
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
      </div>
    </div>
  );
};

export default Clock;
