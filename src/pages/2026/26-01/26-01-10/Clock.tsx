import React, { useEffect, useState } from 'react';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgImage from '@/assets/images/2026/26-01/26-01-10/moo.gif';
import d25090116font from '@/assets/fonts/2026/26-01-10-bit.ttf';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<any>(window.innerWidth > 700);
  const [bgReady, setBgReady] = useState<boolean>(false);

  // 1. LETTER MAPPING: Change these letters to your preference
  const digitToLetter = {
    0: ' ',
    1: 'd',
    2: 'a',
    3: 'M',
    4: 'x',
    5: 'k',
    6: 'm',
    7: 'n',
    8: 'o',
    9: 't',
  };

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'MyD25090116font';
        src: url(${d25090116font}) format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);
    const fontPromise = document.fonts.load('22vh MyD25090116font');
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = bgImage;
      img.onload = resolve;
      img.onerror = reject;
    });

    Promise.all([fontPromise, imagePromise])
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true));

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Separate background readiness
  useEffect(() => {
    const img = new Image();
    const done = () => setBgReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = bgImage;
    const timeout = setTimeout(done, 1200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // 3. RENDER HELPERS
  const renderUnit = (value) => (
    <div className={styles.unitGroup}>
      {value.split('').map((digit, i) => (
        <div key={i} className={styles.digitBox}>
          {digitToLetter[digit] || digit}
        </div>
      ))}
    </div>
  );

  const ready = isLoaded && bgReady;

  return (
    <>
      {/* Mirror background effect */}
      <div
        className={styles.background}
        style={{ opacity: ready ? 1 : 0 }}
      >
        <div 
          className={styles.leftBackground} 
          style={{ backgroundImage: `url(${bgImage})` }} 
        />
        <div 
          className={styles.rightBackground} 
          style={{ backgroundImage: `url(${bgImage})` }} 
        />
      </div>

      {/* Clock content layer */}
      <div className={styles.container} style={{ opacity: ready ? 1 : 0 }}>
        <div className={`${styles.layout} ${isLargeScreen ? styles.row : styles.column}`}>
          {renderUnit(hours)}
          {renderUnit(minutes)}
          {renderUnit(seconds)}
        </div>
      </div>
    </>
  );
};

export default Clock;
