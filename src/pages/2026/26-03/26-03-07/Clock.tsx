import React, { useState, useCallback, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import type { FontConfig } from '@/types/clock';

export const fontConfigs: FontConfig[] = [];

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  
  useSuspenseFontLoader(fontConfigs);

  const timeDigits = useMemo(() => {
    const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

    const hours = formatTimeUnit(time.getHours());
    const minutes = formatTimeUnit(time.getMinutes());
    const seconds = formatTimeUnit(time.getSeconds());

    return {
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split(''),
    };
  }, [time]);

  const Digit = useCallback(
    ({ digit, type, index }) => <span style={digitBoxStyles}>{digit}</span>,
    [],
  );

  const TimeUnit = useCallback(
    ({ digits, label }) => (
      <div style={digitalDigitStyles}>
        {digits.map((digit, index) => (
          <Digit
            key={`${label}-${index}`}
            digit={digit}
            type={label}
            index={index}
          />
        ))}
      </div>
    ),
    [Digit],
  );

  const containerStyles = {
    '--pixel-size': '130px',
    background:
      'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    margin: 0,
    display: 'grid',
    minHeight: '100dvh',
    placeItems: 'center',
    overflow: 'hidden',
    width: '100vw',
    height: '100dvh',
  };

  const clockWrapperStyles: any = {
    display: 'flex',
    flexDirection: 'column',
    // gap: '10px',
    alignItems: 'center',
  };

  const digitalDigitStyles = {
    fontSize: 'clamp(4rem, 20vw, 15rem)',
    fontFamily: "'Press Start 2P', monospace",
    // fontWeight: 'bold',
    lineHeight: 1,
    display: 'flex',
    // gap: '0.05em',
    background:
      'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(1px 0px 5px #39A94F5C)',
  };

  const digitBoxStyles = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '0.6em',
    height: '1em',
    background:
      'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(1px 0px 5px #AA11118A)',
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  if (isMobile) {
    clockWrapperStyles.flexDirection = 'column';
    clockWrapperStyles.gap = '10px';
  } else {
    clockWrapperStyles.flexDirection = 'row';
    clockWrapperStyles.gap = '30px';
  }

  return (
    <div style={containerStyles}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
      <div style={clockWrapperStyles}>
        <TimeUnit digits={timeDigits.hours} label="hours" />
        <TimeUnit digits={timeDigits.minutes} label="minutes" />
        <TimeUnit digits={timeDigits.seconds} label="seconds" />
      </div>
    </div>
  );
};

export default Clock;
