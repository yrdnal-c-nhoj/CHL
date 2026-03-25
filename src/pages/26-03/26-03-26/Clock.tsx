import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useNtpOffset } from '../../../hooks/useNtpOffset'; // Assuming extracted
import type { FontConfig } from '../../../types/clock';

// 1. ASSET STRATEGY: Export assets for the pipeline to preload
import bgImg from './background.webp';
export { bgImg };

// 2. STYLE STRATEGY: Use CSS Modules for isolation
import styles from './Clock.module.css';

// 3. FONT STRATEGY: Define configurations outside the component
const FONT_CONFIGS: FontConfig[] = [
  { fontFamily: 'CustomClockFont', fontUrl: '/fonts/my-font.woff2' }
];

const MasterClockTemplate: React.FC = () => {
  // 4. SYNC STRATEGY: (Optional) Get NTP offset
  const { offset } = useNtpOffset();
  
  // 5. STATE STRATEGY: Split time into 'coarse' (seconds) and 'smooth' (ms)
  const [time, setTime] = useState(new Date());
  const requestRef = useRef<number>();
  const rotationRef = useRef<number>(0);

  // Load fonts
  useSuspenseFontLoader(FONT_CONFIGS);

  const animate = (timestamp: number) => {
    const now = new Date(Date.now() + offset);
    
    // Coarse update (once per second)
    if (now.getSeconds() !== time.getSeconds()) {
      setTime(now);
    }

    // Smooth update (60fps) - e.g., for a rotating hand
    const ms = now.getMilliseconds();
    const sec = now.getSeconds();
    rotationRef.current = ((sec + ms / 1000) / 60) * 360;

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [offset]);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bgImg})` }}>
      <div className={styles.timeWrapper}>
        {/* TABULAR NUMS: Keeps digits from jumping */}
        <span className={styles.digits}>
          {time.toLocaleTimeString()}
        </span>
      </div>
      
      {/* SVG STRATEGY: Hardware accelerated transforms */}
      <svg className={styles.overlay}>
        <g transform={`rotate(${rotationRef.current}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="20" stroke="white" />
        </g>
      </svg>
    </div>
  );
};

export default MasterClockTemplate;
