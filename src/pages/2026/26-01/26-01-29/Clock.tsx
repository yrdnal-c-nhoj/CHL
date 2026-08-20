import { memo, useState, useEffect } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import backgroundGif3 from '@/assets/images/26_images/26-01/26-01-29/ur.png';
import backgroundGif2 from '@/assets/images/26_images/26-01/26-01-29/ur.gif';
import backgroundGif from '@/assets/images/26_images/26-01/26-01-29/uranu.gif';
import tileOverlay from '@/assets/images/26_images/26-01/26-01-29/u.webp';
import styles from './Clock.module.css';

export const assets = [backgroundGif3, backgroundGif2, backgroundGif, tileOverlay];

const ClockUranus = memo(() => (
  <>
    {[...Array(12)].map((_, i) => (
      <div key={i} className={styles.hourMark} style={{ transform: `rotate(${i * 30}deg)` }}>
        <div className={styles.hourImage} style={{ backgroundImage: `url(${backgroundGif2})` }} />
      </div>
    ))}
  </>
));
ClockUranus.displayName = 'ClockUranus';

const AnalogUranusClock =  () => {
  const now = useMillisecondClock();
  const [bgRotation, setBgRotation] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setBgRotation((prev) => prev - 1 * deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;

  return (
    <main className={styles.container}>
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>

      <div className={styles.bgLayer}>
        <div className={styles.tileOverlay} style={{ backgroundImage: `url(${tileOverlay})` }} />
      </div>

      <div className={styles.bgLayer} style={{ backgroundImage: `url(${backgroundGif3})`, backgroundSize: '50vh 50vh', filter: 'contrast(1.8) brightness(0.5) saturate(2.0)', zIndex: 5, opacity: 0.5 }} />

      <div className={styles.clockFace}>
        <ClockUranus />

        <div className={styles.hand} style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)`, width: 'min(2vw, 3px)', height: '24%', backgroundColor: '#085557C4', borderRadius: '10px', boxShadow: '0 0 2px #C2C7E6', zIndex: 5 }} />
        <div className={styles.hand} style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)`, width: 'min(1.5vw, 2px)', height: '45%', backgroundColor: '#021D1EC4', borderRadius: '10px', boxShadow: '0 0 2px #C4C8EF', zIndex: 5 }} />
      </div>

      <div className={styles.bgLayer} style={{ backgroundImage: `url(${backgroundGif})`, backgroundSize: 'cover', zIndex: 1, opacity: 0.4, transform: `rotate(${bgRotation}deg)`, filter: 'contrast(0.8) brightness(1.8) saturate(0.0)' }} />
    </main>
  );
};

const MemoizedAnalogUranusClock = memo(AnalogUranusClock);
MemoizedAnalogUranusClock.displayName = 'Clock_26_01_29';
export default MemoizedAnalogUranusClock;
