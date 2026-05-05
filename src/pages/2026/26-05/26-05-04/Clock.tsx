import React, { useMemo } from 'react';

import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

const Cube: React.FC<{ size: number; x: number; y: number; color: string; delay: number }> = ({ 
  size, x, y, color, delay 
}) => {
  return (
    <div 
      className={styles.cube}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x}px, ${y}px) rotateX(45deg) rotateY(45deg)`,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  );
};

const CubesClock: React.FC = () => {
  const time = useClockTime();
  
  const { hours, minutes, seconds, digits } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    
    return {
      hours: h,
      minutes: m,
      seconds: s,
      digits: [
        Math.floor(h / 10),
        h % 10,
        Math.floor(m / 10),
        m % 10,
        Math.floor(s / 10),
        s % 10
      ]
    };
  }, [time]);

  const getCubeColor = (digit: number, position: number) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[(digit + position) % colors.length];
  };

  return (
    <div className={styles.container}>
      <div className={styles.cubeGrid}>
        {digits.map((digit, digitIndex) => (
          <div key={digitIndex} className={styles.digitGroup}>
            {Array.from({ length: 8 }, (_, i) => (
              <Cube
                key={i}
                size={15}
                x={i * 20}
                y={0}
                color={getCubeColor(digit, i)}
                delay={i * 0.1}
              />
            ))}
            <div className={styles.digitLabel}>{digit}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.timeDisplay}>
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default CubesClock;
