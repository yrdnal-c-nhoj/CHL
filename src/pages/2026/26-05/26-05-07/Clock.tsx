import React, { useMemo, useEffect, useState } from 'react';
// ERROR: This line contains invisible trailing whitespace (or violates strict import grouping rules).
// HOW IT GOT THERE: Such characters are frequently left behind during manual refactoring or copy-paste operations if the IDE isn't configured to auto-trim.
// EXPLANATION: Trailing whitespace is a common linting violation (e.g., ESLint's `no-trailing-spaces`). Furthermore, some strict style guides 
// forbid blank lines between imports that belong to the same logical group (External Libraries vs. Internal Aliases).
// ELIMINATION/IMPROVEMENT: Remove the invisible spaces or the entire blank line, and configure your editor to "Trim Trailing Whitespace on Save."

import { useClockTime } from '@/utils/clockUtils';
import backgroundImage from '@/assets/images/2026/26-05/26-05-07/1gallop.webp';

import styles from './Clock.module.css';

interface HandProps {
  angle: number;
  length: string;
  width: string;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const ClockHand: React.FC<HandProps> = ({ angle, length, width, color, type }) => {
  const zIndex = type === 'second' ? 30 : type === 'minute' ? 20 : 10;
  
  // Scale width relative to a base radius (e.g., 200px) to keep proportions consistent
  const scaledWidth = `calc(${width} * (var(--clock-radius) / 200))`;

  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: scaledWidth,
    height: length,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: type === 'second' ? '50% 50% 0 0' : '2px 2px 0 0',
    zIndex: zIndex,
    transition: 'none',
    boxShadow: `
      0 0 8px rgba(0, 0, 0, 0.4),
      inset 0 0 6px rgba(255, 255, 255, 0.3),
      0 3px 6px rgba(0, 0, 0, 0.5)
    `,
    // ERROR: The `boxShadow` property is currently static.
    // HOW IT GOT THERE: It was likely added for a visual effect.
    // EXPLANATION: For a truly dynamic clock, especially one with a rotating hand,
    // the shadow should ideally rotate with the hand to simulate a consistent light source.
    // ELIMINATION/IMPROVEMENT: To eliminate this, the `boxShadow` would need to be dynamically calculated based on the `angle` prop,
    // or a CSS filter property could be used with a pseudo-element that rotates independently.
  };

  const handTypeClass = (() => {
    if (type === 'hour') return styles.westernHourHand;
    if (type === 'minute') return styles.westernMinuteHand;
    return styles.westernSecondHand;
  })();

  // ERROR: `ClockHand` is a functional component that is not memoized.
  // HOW IT GOT THERE: By default, functional components re-render whenever their parent re-renders.
  // EXPLANATION: Since `AnalogClock` re-renders every millisecond (due to `useClockTime('ms')`),
  // `ClockHand` will also re-render every millisecond, even if its props (other than `angle`) haven't effectively changed.
  // While `angle` *does* change frequently, for components with more complex props or children,
  // this could lead to unnecessary re-renders of sub-components.
  // ELIMINATION/IMPROVEMENT: Wrap `ClockHand` with `React.memo` to prevent re-renders if props are shallowly equal.
  // However, given that `angle` changes constantly, the benefit here might be minimal for this specific component,
  // but it's a good practice for performance optimization in React.
  return (
    <div 
      style={handStyle} 
      className={`${styles.hand} ${handTypeClass}`} 
      data-hand-type={type}
    />
  );
};

const AnalogClock: React.FC = () => { // ERROR: `AnalogClock` is not memoized.
  // HOW IT GOT THERE: By default, React components are not memoized.
  // EXPLANATION: If this component is part of a larger application and its parent re-renders,
  // `AnalogClock` will also re-render even if its own props haven't changed.
  // ELIMINATION/IMPROVEMENT: Wrap `AnalogClock` with `React.memo` if it receives props and those props are stable.
  // In this specific case, it doesn't receive props, so `React.memo` would only be useful if its internal state/context
  // updates were causing unnecessary re-renders of its children, which is already handled by `useClockTime` and `useMemo`.

  // ERROR: `useClockTime('ms')` causes a re-render every millisecond.
  // HOW IT GOT THERE: The `useClockTime` hook was explicitly configured to update at a millisecond interval.
  // EXPLANATION: While this provides very smooth hand movement, most screens refresh at 60Hz (roughly every 16.6ms).
  // Re-rendering 1000 times per second when the display can only show 60 distinct frames per second is excessive.
  // It consumes unnecessary CPU cycles and battery power, which can be perceived as a performance "error" or inefficiency.
  // ELIMINATION/IMPROVEMENT: Change `'ms'` to a less frequent interval, such as `'frame'` (if supported by `useClockTime` and optimized for `requestAnimationFrame`),
  // or a custom interval like `16` or `30` milliseconds, to align with typical screen refresh rates.
  const time = useClockTime('ms');
  
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [dims, setDims] = useState({ w: 0, h: 0 }); // ERROR: Initial zero-state causes a "Layout Shift" (CLS).
  // HOW IT GOT THERE: The state is initialized to zero because `window` is not accessible during the initial variable declaration or on the server.
  // EXPLANATION: On the very first render, the clock will calculate a radius of 0, resulting in a blank or squashed UI until the `useEffect` 
  // triggers after mounting. This is detrimental to Core Web Vitals (Cumulative Layout Shift).
  // ELIMINATION/IMPROVEMENT: Check for `dims.w === 0` before rendering the clock content, or provide a sensible "default" estimate 
  // for the dimensions to minimize the visual jump.

  useEffect(() => {
    // Set initial dimensions only after mount to avoid SSR ReferenceErrors
    const updateDims = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    updateDims();
    
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  const radius = Math.min(dims.w, dims.h) * 0.95 / 2;

  const { hours, minutes, seconds, ms, isoTime } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const msVal = time.getMilliseconds();
    return {
      hours: h,
      minutes: m,
      seconds: s,
      ms: msVal,
      isoTime: time.toISOString(),
    };
  }, [time]);

  // Calculate smooth sweeping angles
  const secondAngle = (seconds + ms / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60 + ms / 60000) * 6;
  const hourAngle = ((hours % 12) + (minutes + seconds / 60) / 60) * 30;

  const tickMarks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6;
    // ERROR: Magic number `48` used for tick mark positioning.
    // HOW IT GOT THERE: Likely chosen during initial layout to visually place the tick marks.
    // EXPLANATION: This number represents a percentage or a scaled value relative to the clock's center.
    // Using a magic number makes the code less readable and harder to adjust if the design changes.
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      id: i,
      angle,
      isHour: i % 5 === 0,
      x: 50 + 48 * Math.cos(rad),
      y: 50 + 48 * Math.sin(rad),
    };
  }), []); // Tick marks position relative to the center (50%) don't need radius dependency

  const clockNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90; // 30 degrees per hour, starting from top
      // ERROR: Magic number `42` used for clock number positioning.
      // HOW IT GOT THERE: Similar to tick marks, chosen for visual placement.
      // EXPLANATION: This number, combined with `distance`, determines the exact position.
      // It lacks semantic meaning and makes future adjustments difficult without trial and error.
      const rad = angle * (Math.PI / 180);
      const distance = 0.85; // Position numbers at 85% of radius
      numbers.push({
        number: i,
        x: 50 + distance * 42 * Math.cos(rad),
        y: 50 + distance * 42 * Math.sin(rad),
      });
    }
    return numbers;
  }, []);

  return (
    <div 
      className={styles.container} 
      style={{ 
        '--bg-image': `url(${backgroundImage})`,
        '--clock-radius': `${radius}px`,
        // ERROR: The `--bg-image` CSS variable is set directly here.
        // HOW IT GOT THERE: This is a common way to pass dynamic styles to CSS.
        // EXPLANATION: If `backgroundImage` is a very large image, loading it directly like this might impact initial page load performance.
        // ELIMINATION/IMPROVEMENT: For large images, consider lazy loading techniques or using a CSS class that applies the background image,
        // allowing the browser to manage its loading more efficiently, or preloading the image if it's critical.
      } as React.CSSProperties}
    >
      <time dateTime={isoTime} aria-label={`Current time: ${hours}:${minutes}`} className={styles.timeWrapper}>
        <div className={styles.clockFace}>
          {/* Outer ring */}
          <div className={styles.outerRing} />

          {/* Inner decorative ring */}
          <div className={styles.innerRing} />

          {/* Tick marks */}
          {tickMarks.map((tick) => (
            <div
              key={tick.id}
              className={tick.isHour ? styles.hourTick : styles.minuteTick}
              style={{
                left: `${tick.x}%`,
                top: `${tick.y}%`,
                transform: `translate(-50%, -50%) rotate(${tick.angle}deg)`,
              }}
            />
          ))}

          {/* Clock numbers */}
          {clockNumbers.map((num) => (
            <div
              key={num.number}
              className={styles.clockNumber}
              style={{
                left: `${num.x}%`,
                top: `${num.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num.number}
            </div>
          ))}

          {/* Clock hands */}
          <ClockHand
            type="hour"
            angle={hourAngle}
            length={`${radius * 0.5}px`}
            width="12px"
            color="#4A2C17"
          />
          <ClockHand
            type="minute"
            angle={minuteAngle}
            length={`${radius * 0.7}px`}
            width="8px"
            color="#6B4423"
          />
          <ClockHand
            type="second"
            angle={secondAngle}
            length={`${radius * 0.85}px`}
            width="4px"
            color="#8B4513"
          />

         </div>
      </time>
    </div>
  );
};

export default AnalogClock;
