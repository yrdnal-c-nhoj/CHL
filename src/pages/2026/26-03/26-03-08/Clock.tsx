import { memo, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

import hand1Img from '@/assets/images/26_images/26-03/26-03-08/hand2.png';
import hand2Img from '@/assets/images/26_images/26-03/26-03-08/hand1.webp';
import handImg from '@/assets/images/26_images/26-03/26-03-08/hand.webp';
import dragonFont from '@/assets/fonts/26fonts/26-03-08-dragon.ttf?url';
import dragonVideo from '@/assets/images/26_images/26-03/26-03-08/dragon1.mp4';

export const assets = [hand1Img, hand2Img, handImg, dragonFont, dragonVideo];

const fontConfigs = [
  {
    fontFamily: 'Dragon',
    fontUrl: dragonFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const Clock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

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
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
        }}
      >
        {i}
      </div>,
    );
  }

  const getHandStyle = (angle, width, height, zIndex, shadow) => ({
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    filter: `drop-shadow(${shadow}) saturate(0.2)`,
    zIndex,
    transition:
      seconds === 0
        ? 'none'
        : 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
  });

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString().split('.')[0] + 'Z'} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <video autoPlay loop muted playsInline className={styles.videoBackground}>
        <source src={dragonVideo} type="video/mp4" />
      </video>

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
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_03_08';
export default MemoizedClock;