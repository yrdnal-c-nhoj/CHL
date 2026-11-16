import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

const Clock_25_08_22 = () => {
  const time = useClock();
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const dotContainerRef = useRef<HTMLDivElement>(null);
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clockRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState('#f7050d');

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;

  const updateClock = useCallback(() => {
    const now = time;
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = seconds * 6;

    if (hourRef.current) {
      hourRef.current.style.setProperty('--deg', `${hourDeg}deg`);
      hourRef.current.style.backgroundColor = getRandomColor();
    }
    if (minuteRef.current) {
      minuteRef.current.style.setProperty('--deg', `${minuteDeg}deg`);
      minuteRef.current.style.backgroundColor = getRandomColor();
    }
    if (secondRef.current) {
      secondRef.current.style.setProperty('--deg', `${secondDeg}deg`);
      secondRef.current.style.backgroundColor = getRandomColor();
    }

    if (dotContainerRef.current) {
      Array.from(dotContainerRef.current.children).forEach((dot) => {
        (dot as HTMLElement).style.backgroundColor = getRandomColor();
      });
    }

    squareRefs.current.forEach((square) => {
      if (square) {
        square.style.backgroundColor = getRandomColor();
      }
    });

    setBgColor(getRandomColor());
  }, [time]);

  const createDots = useCallback(() => {
    const container = dotContainerRef.current;
    const clock = clockRef.current;
    if (!container || !clock) return;

    container.innerHTML = '';
    const size = clock.offsetWidth;
    const radius = size * 0.3;
    const center = size / 2;

    for (let i = 0; i < 12; i++) {
      const angle = i * 30 * (Math.PI / 180);
      const x = center + radius * Math.cos(angle) - size * 0.04;
      const y = center + radius * Math.sin(angle) - size * 0.04;

      const dot = document.createElement('div');
      dot.className = styles.dot;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      container.appendChild(dot);
    }
  }, []);

  const positionSquares = useCallback(() => {
    const clock = clockRef.current;
    if (!clock) return;
    const size = clock.offsetWidth;
    const radius = size * 0.6;
    const center = size / 2;

    squareRefs.current.forEach((square, i) => {
      if (!square) return;
      const angleDeg = i * 30;
      const angleRad = angleDeg * (Math.PI / 180);
      const x = center + radius * Math.sin(angleRad);
      const y = center - radius * Math.cos(angleRad);
      square.style.left = `${x}px`;
      square.style.top = `${y}px`;
    });
  }, []);

  useEffect(() => {
    createDots();
    positionSquares();
    updateClock();
  }, [createDots, positionSquares, updateClock]);

  return (
    <div
      className={styles.container}
      style={{ '--bg-color': bgColor } as React.CSSProperties}
    >
      <SRTime time={time} />
      <div className={styles.clock} ref={clockRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (squareRefs.current[i] = el)}
            className={styles.square}
          />
        ))}

        <div className={styles.dotContainer} ref={dotContainerRef} />

        <div
          ref={hourRef}
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--deg': '0deg' } as React.CSSProperties}
        />

        <div
          ref={minuteRef}
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--deg': '0deg' } as React.CSSProperties}
        />

        <div
          ref={secondRef}
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ '--deg': '0deg' } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

Clock_25_08_22.displayName = 'Clock_25_08_22';
export default Clock_25_08_22;
