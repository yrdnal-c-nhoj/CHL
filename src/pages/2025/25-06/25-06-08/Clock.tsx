import { memo, useEffect, useRef } from 'react';
import { useSecondClock } from '@/utils/hooks';
import bgImage from '@/assets/images/25_images/25-06/25-06-08/bg.webp';
import styles from './Clock.module.css';

import img12 from '@/assets/images/25_images/25-06/25-06-08/qspades.jpg';
import img1 from '@/assets/images/25_images/25-06/25-06-08/JSpades.png';
import img2 from '@/assets/images/25_images/25-06/25-06-08/Jclu.gif';
import img3 from '@/assets/images/25_images/25-06/25-06-08/Jdi.gif';
import img4 from '@/assets/images/25_images/25-06/25-06-08/Jheart.jpeg';
import img5 from '@/assets/images/25_images/25-06/25-06-08/Kclubs.webp';
import img6 from '@/assets/images/25_images/25-06/25-06-08/Kdi.gif';
import img7 from '@/assets/images/25_images/25-06/25-06-08/Khea.gif';
import img8 from '@/assets/images/25_images/25-06/25-06-08/Kspa.gif';
import img9 from '@/assets/images/25_images/25-06/25-06-08/Qclu.gif';
import img10 from '@/assets/images/25_images/25-06/25-06-08/Qdi.gif';
import img11 from '@/assets/images/25_images/25-06/25-06-08/Qhea.gif';

export const assets = [bgImage, img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

const images = [img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

const FaceCardClock =  () => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const time = useSecondClock();

  useEffect(() => {
    const updateClock =  () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;
      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360;
      const hourDeg = (hours / 12) * 360;
      if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      requestAnimationFrame(updateClock);
    };
    requestAnimationFrame(updateClock);
  }, []);

  const bgStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '150dvw',
    height: '150dvh',
    objectFit: 'cover',
    filter: 'contrast(2.7) brightness(0.3)',
    zIndex: 0,
    transform: 'translate(-50%, -50%)',
    transformOrigin: 'center center',
  };

  const clockContainer = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  };

  const numberBase = {
    position: 'absolute',
    width: '23vmin',
    height: '23vmin',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handBase = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    borderRadius: '5px',
    boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.8), -1px -1px 0px rgba(205, 201, 201)',
  };

  const centerDot = {
    position: 'absolute',
    width: '2vmin',
    height: '2vmin',
    backgroundColor: '#979b99',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <main className={styles.container} style={{
      margin: 0,
      padding: 0,
      height: '100dvh',
      width: '100dvw',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <img
        decoding="async"
        loading="lazy"
        src={bgImage}
        alt="Background"
        className={styles.slowRotate}
        style={bgStyle}
      />

      <div style={clockContainer}>
        {images.map((src, i) => {
          const angle = i * 30;
          return (
            <div
              key={i}
              style={{
                ...numberBase,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-39vmin)`,
              }}
            >
              <img
                decoding="async"
                loading="lazy"
                src={src}
                alt={`card-${i}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          );
        })}

        <div
          ref={hourRef}
          style={{
            ...handBase,
            width: '5vmin',
            height: '17vmin',
            backgroundColor: '#575a59',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          ref={minuteRef}
          style={{
            ...handBase,
            width: '3vmin',
            height: '27vmin',
            backgroundColor: '#72878b',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          ref={secondRef}
          style={{
            ...handBase,
            width: '0.5vmin',
            height: '50vmin',
            backgroundColor: 'rgb(254, 254, 254)',
            transform: 'translateX(-50%)',
          }}
        />
        <div style={centerDot} />
      </div>
    </main>
  );
};

const MemoizedFaceCardClock = memo(FaceCardClock);
MemoizedFaceCardClock.displayName = 'Clock_25_06_08';
export default MemoizedFaceCardClock;
