import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { css } from '@emotion/react';

/**
 * Digital Clock Component with Optical Illusion Pattern
 * 
 * Features:
 * - Real-time digital clock with hours, minutes, seconds
 * - Optical illusion pattern using repeating conic gradients
 * - Responsive design: stacked on mobile, horizontal on desktop
 * - Individual digit boxes to prevent layout jumping
 * - Red text shadow outline for visual enhancement
 * - Clean, modern React architecture with performance optimizations
 */
const Clock = () => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoize time formatting to prevent unnecessary recalculations
  const timeDigits = useMemo(() => {
    const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');
    
    const hours = formatTimeUnit(time.getHours());
    const minutes = formatTimeUnit(time.getMinutes());
    const seconds = formatTimeUnit(time.getSeconds());

    return {
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split('')
    };
  }, [time]);

  // Render individual digit with consistent styling
  const Digit = useCallback(({ digit, type, index }) => (
    <span css={digitBoxStyles}>
      {digit}
    </span>
  ), []);

  // Render time unit (hours, minutes, or seconds)
  const TimeUnit = useCallback(({ digits, label }) => (
    <div css={digitalDigitStyles}>
      {digits.map((digit, index) => (
        <Digit 
          key={`${label}-${index}`} 
          digit={digit} 
          type={label} 
          index={index} 
        />
      ))}
    </div>
  ), [Digit]);

  return (
    <div css={containerStyles}>
      <div css={clockWrapperStyles}>
        <TimeUnit digits={timeDigits.hours} label="hours" />
        <TimeUnit digits={timeDigits.minutes} label="minutes" />
        <TimeUnit digits={timeDigits.seconds} label="seconds" />
      </div>
    </div>
  );
};

// CSS-in-JS styles using emotion for better maintainability
const containerStyles = css`
  --pixel-size: 130px;
  background: repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / var(--pixel-size) calc(var(--pixel-size) / 4);
  margin: 0;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  width: 100vw;
  height: 100dvh;

  @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
`;

const clockWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (min-width: 769px) {
    flex-direction: row;
    gap: 30px;
  }
`;

const digitalDigitStyles = css`
  font-size: clamp(4rem, 25vw, 15rem);
  font-family: 'Silkscreen', monospace;
  font-weight: bold;
  line-height: 1;
  display: flex;
  gap: 0.05em;
  
  /* Optical illusion pattern */
  background: repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 130px 32.5px;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* Red text shadow outline */
  filter: drop-shadow(1px 0px 0px red) 
          drop-shadow(-1px 0px 0px red) 
          drop-shadow(0px 1px 0px red) 
          drop-shadow(0px -1px 0px red);
`;

const digitBoxStyles = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 0.6em;
  height: 1em;
  
  /* Apply pattern and shadow to individual digits */
  background: repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 130px 32.5px;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(1px 0px 0px red) 
          drop-shadow(-1px 0px 0px red) 
          drop-shadow(0px 1px 0px red) 
          drop-shadow(0px -1px 0px red);
`;

export default Clock;