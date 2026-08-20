import { memo, useEffect, useRef, useState } from 'react';
import { useSecondClock } from '@/utils/hooks';
import analogBgImage from '@/assets/images/26_images/26-01/26-01-25/mirage.webp';
import styles from './Clock.module.css';

export const assets = [analogBgImage];

const AnalogClockTemplate =  () => {
  const clockTime = useSecondClock();
  const [opacity, setOpacity] = useState(0.06);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const noiseSeedRef = useRef(Math.random() * 10000);

  const seconds = clockTime.getSeconds();
  const minutes = clockTime.getMinutes() + seconds / 60;
  const hours = (clockTime.getHours() % 12) + minutes / 60;

  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  useEffect(() => {
    let mounted = true;
    const animate = (now) => {
      if (!mounted) return;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const t = now * 0.0003 + noiseSeedRef.current;
      const base = Math.sin(t * 1.1) * 0.5 + Math.sin(t * 0.7) * 0.5;
      const flutter = Math.sin(t * 8.4 + 13.7) * 0.3 + Math.sin(t * 12.2 + 41.9) * 0.2;
      const noise = (Math.sin(t * 47.1 + 19.3) * 0.5 + Math.sin(t * 73.8 + 88.2) * 0.5) * 0.18;
      let targetOpacity = base + flutter + noise;
      targetOpacity = Math.max(0.1, Math.min(0.28, targetOpacity * 0.45 + 0.04));
      setOpacity((prev) => prev + (targetOpacity - prev) * 28 * dt);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${analogBgImage})` }}>
      <time dateTime={clockTime.toISOString()} className={styles.srOnly}>{clockTime.toLocaleTimeString()}</time>

      <div className={styles.faceContainer} style={{ opacity, willChange: 'opacity' }}>
        <div className={styles.hand} style={{ width: '1.4vmin', height: '20vmin', background: 'linear-gradient(to top, #D4CECE, #F2D38F7E, #F5D67F)', transform: `translate(-50%, 0) rotate(${hourDeg}deg)`, zIndex: 2 }} />
        <div className={styles.hand} style={{ width: '0.9vmin', height: '35vmin', background: 'linear-gradient(to top, #C4C0C0, #F3DD9B69, #F0CF7D)', transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`, zIndex: 3 }} />
      </div>
    </main>
  );
};

const MemoizedAnalogClockTemplate = memo(AnalogClockTemplate);
MemoizedAnalogClockTemplate.displayName = 'Clock_26_01_25';
export default MemoizedAnalogClockTemplate;
