import React, { useEffect } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useGlobalStyles } from '@/utils/enhancedFontLoader';
import { useEnhancedFontLoader } from '@/utils/enhancedFontLoader';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import hand1Img from '/src/assets/images/2026/26-03/26-03-08/hand2.png';
import hand2Img from '/src/assets/images/2026/26-03/26-03-08/hand1.webp';
import handImg from '/src/assets/images/2026/26-03/26-03-08/hand.webp';
import dragonFont from '/src/assets/fonts/2026/26-03-08-dragon.ttf';
import dragonVideo from '/src/assets/images/2026/26-03/26-03-08/dragon1.mp4';
import React from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';

// Asset names should be standardized to YY-MM-DD-name format
import hand1Img from '@/assets/images/2026/26-03/26-03-08/26-03-08-hand2.webp';
import hand2Img from '@/assets/images/2026/26-03/26-03-08/26-03-08-hand1.webp';
import handImg from '@/assets/images/2026/26-03/26-03-08/26-03-08-hand.webp';
import dragonFont from '@/assets/fonts/2026/26-03-08-dragon.ttf';
import dragonVideo from '@/assets/images/2026/26-03/26-03-08/26-03-08-dragon1.mp4';

const Clock: React.FC = () => {
  const fontConfigs = [
    {
      fontFamily: 'Dragon',
      fontUrl: dragonFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const clockNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = i * 30 - 90;
    const radian = (angle * Math.PI) / 180;
    const x = 50 + 40 * Math.cos(radian);
    const y = 50 + 40 * Math.sin(radian);

    clockNumbers.push(
      <div
        key={i}
        className={styles.number}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
          fontFamily: `'Dragon', serif`,
          fontSize: '5rem',
          color: '#83EF907F',
          // textShadow: '0 0 12px rgba(131,239,144,0.7)',
          userSelect: 'none',
        }}
      >
        {i}
      </div>,
    );
  }

  const getHandStyle = (angle, width, height, zIndex, shadow) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${height}px`,
    transformOrigin: 'bottom center',
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    filter: `drop-shadow(${shadow}) saturate(0.2)`,
    zIndex,
    transition:
      seconds === 0
        ? 'none'
        : 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
  });

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
      }}
    >
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>
      
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 0,
          transform: 'scaleX(-1)',
          filter:
            'hue-rotate(-30deg) saturate(1.5) contrast(1.4) brightness(1.2)',
        }}
        className={styles.videoBackground}
      >
        <source src={dragonVideo} type="video/mp4" />
      </video>

      <div
        style={{
          position: 'relative',
          width: '520px',
          height: '520px',
          zIndex: 1,
          opacity: 0.9,
        }}
      >
      <div className={styles.clockWrapper}>
        {clockNumbers}

        <img
          src={hand2Img}
          alt="Hour"
          className={styles.hand}
          style={getHandStyle(
            hourAngle,
            70,
            160,
            5,
            '0 0 8px rgba(200,180,100,0.8)',
          )}
        />
        <img
          src={hand1Img}
          alt="Minute"
          className={styles.hand}
          style={getHandStyle(
            minuteAngle,
            60,
            190,
            4,
            '0 0 6px rgba(180,200,255,0.7)',
          )}
        />
        <img
          src={handImg}
          alt="Second"
          className={styles.hand}
          style={getHandStyle(
            secondAngle,
            50,
            200,
            3,
            '0 0 5px rgba(255,50,50,0.9)',
          )}
        />
      </div>
    </div>
    </main>
  );
};

export default Clock;
