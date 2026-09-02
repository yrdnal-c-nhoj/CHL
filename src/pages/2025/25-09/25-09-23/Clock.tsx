import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// digits
import digit1 from '@/assets/images/25_images/25-09/25-09-23/z.gif';
import digit2 from '@/assets/images/25_images/25-09/25-09-23/z2.gif';
import digit10 from '@/assets/images/25_images/25-09/25-09-23/z3.gif';
import digit12 from '@/assets/images/25_images/25-09/25-09-23/z4.gif';
import digit5 from '@/assets/images/25_images/25-09/25-09-23/z5.gif';
import digit6 from '@/assets/images/25_images/25-09/25-09-23/z6.gif';
import digit7 from '@/assets/images/25_images/25-09/25-09-23/z7.gif';
import digit8 from '@/assets/images/25_images/25-09/25-09-23/z8.webp';
import digit9 from '@/assets/images/25_images/25-09/25-09-23/z9.webp';
import digit11 from '@/assets/images/25_images/25-09/25-09-23/z10.gif';
import digit3 from '@/assets/images/25_images/25-09/25-09-23/z11.gif';
import digit4 from '@/assets/images/25_images/25-09/25-09-23/z12.gif';

// hands
import hourHandImg from '@/assets/images/25_images/25-09/25-09-23/steth.png';
import minuteHandImg from '@/assets/images/25_images/25-09/25-09-23/sss.webp';
import secondHandImg from '@/assets/images/25_images/25-09/25-09-23/ste.gif';

export const assets = [];

function AnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [ready, setReady] = useState<boolean>(false);
  const time = useClock();

  // Digits array
  const digits = useMemo(
    () => [
      digit12,
      digit1,
      digit2,
      digit3,
      digit4,
      digit5,
      digit6,
      digit7,
      digit8,
      digit9,
      digit10,
      digit11,
    ],
    [],
  );

  // Preload images once
  useEffect(() => {
    const allImages = [...digits, hourHandImg, minuteHandImg, secondHandImg];
    Promise.all(
      allImages.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          }),
      ),
    ).then(() => setReady(true));
  }, [digits]);

  // Digit positions (static)
  const digitElements = useMemo(() => {
    return digits.map((src, i) => {
      const angle = (i / 12) * 2 * Math.PI;
      const radius = 42;
      const x = 50 + radius * Math.sin(angle);
      const y = 50 - radius * Math.cos(angle);

      return (
        <img
          decoding="async"
          loading="lazy"
          key={i}
          src={src}
          alt={`digit-${i}`}
          className={styles.clockDigit}
          style={{
            position: 'absolute',
            top: `${y}%`,
            left: `${x}%`,
            transform: 'translate(-50%, -50%)',
            width: 'auto',
          }}
        />
      );
    });
  }, [digits]);

  // Animate hands efficiently
  useEffect(() => {
    if (!ready) return;

    const update =  () => {
      const now = new Date();
      const ms = now.getMilliseconds() / 1000;
      const seconds = now.getSeconds() + ms;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      if (secondRef.current) {
        secondRef.current.style.transform = `translateX(-50%) rotate(${(seconds / 60) * 360}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `translateX(-50%) rotate(${(minutes / 60) * 360}deg)`;
      }
      if (hourRef.current) {
        hourRef.current.style.transform = `translateX(-50%) rotate(${(hours / 12) * 360}deg)`;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [ready]);

  if (!ready) return null;

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.clockFace}>
        {digitElements}

        <img
          decoding="async"
          loading="lazy"
          ref={hourRef}
          src={hourHandImg}
          alt="hour-hand"
          className={styles.hourHand}
        />
        <img
          decoding="async"
          loading="lazy"
          ref={minuteRef}
          src={minuteHandImg}
          alt="minute-hand"
          className={styles.minuteHand}
        />
        <img
          decoding="async"
          loading="lazy"
          ref={secondRef}
          src={secondHandImg}
          alt="second-hand"
          className={styles.secondHand}
        />
      </div>
    </main>
  );
}

const MemoizedAnalogClock = React.memo(AnalogClock);
MemoizedAnalogClock.displayName = 'Clock_25_09_23';
export default MemoizedAnalogClock;
