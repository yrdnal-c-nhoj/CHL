import { memo, useEffect, useState, useRef } from 'react';
import { useSecondClock } from '@/utils/hooks';
import one from '@/assets/images/26_images/26-01/26-01-03/1.webp';
import two from '@/assets/images/26_images/26-01/26-01-03/2.webp';
import three from '@/assets/images/26_images/26-01/26-01-03/3.webp';
import four from '@/assets/images/26_images/26-01/26-01-03/4.webp';
import five from '@/assets/images/26_images/26-01/26-01-03/5.webp';
import six from '@/assets/images/26_images/26-01/26-01-03/6.webp';
import seven from '@/assets/images/26_images/26-01/26-01-03/7.webp';
import eight from '@/assets/images/26_images/26-01/26-01-03/8.webp';
import nine from '@/assets/images/26_images/26-01/26-01-03/9.webp';
import ten from '@/assets/images/26_images/26-01/26-01-03/10.webp';
import eleven from '@/assets/images/26_images/26-01/26-01-03/11.webp';
import twelve from '@/assets/images/26_images/26-01/26-01-03/12.webp';
import pageBackground from '@/assets/images/26_images/26-01/26-01-03/swi.jpg';
import styles from './Clock.module.css';

export const assets = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, pageBackground];

const numbers = [
  { src: twelve, angle: 0 }, { src: one, angle: 30 }, { src: two, angle: 60 },
  { src: three, angle: 90 }, { src: four, angle: 120 }, { src: five, angle: 150 },
  { src: six, angle: 180 }, { src: seven, angle: 210 }, { src: eight, angle: 240 },
  { src: nine, angle: 270 }, { src: ten, angle: 300 }, { src: eleven, angle: 330 },
];

const Clock =  () => {
  const time = useSecondClock();
  const [lightsOff, setLightsOff] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLightsOff((prev) => !prev);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 150);
      const nextInterval = 800 + Math.random() * 1200;
      setTimeout(() => setLightsOff((prev) => !prev), nextInterval);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [time]);

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const handStyle = (width, height, color, deg, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: color,
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex,
    boxShadow: '0 0 15px rgba(0,0,0,0.4)',
  });

  return (
    <main
      className={`${styles.container} ${isShaking ? styles.cameraShake : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${pageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          filter: lightsOff ? 'brightness(0.4) contrast(0.8)' : 'brightness(1)',
          transition: 'filter 0.1s linear',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: '90dvh', height: '90dvh', position: 'relative' }}>
          <div style={handStyle('1.7vmin', '20vmin', '#43474B', hours * 30, 2)} />
          <div style={handStyle('1vmin', '35vmin', '#A6A4A9', minutes * 6, 3)} />
          <div style={handStyle('0.4vmin', '40vmin', '#696891', seconds * 6, 4)} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
          opacity: lightsOff ? 1 : 0,
          transition: 'opacity 0.08s linear',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4,
        }}
      >
        <div style={{ width: '90dvh', height: '90dvh', position: 'relative' }}>
          {numbers.map(({ src, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <img
                decoding="async"
                loading="lazy"
                key={i}
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  width: '12dvh',
                  height: '12dvh',
                  left: `calc(50% + 32vmin * ${Math.sin(rad)} - 12dvh / 2)`,
                  top: `calc(50% - 32vmin * ${Math.cos(rad)} - 12dvh / 2)`,
                  filter: lightsOff
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                    : 'drop-shadow(2px 2px 8px rgba(0,0,0,0.6))',
                  transition: 'filter 0.1s linear',
                }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_01_03';
export default MemoizedClock;
