import { memo, useEffect, useRef, useMemo, useCallback } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import beat4 from '@/assets/images/25_images/25-04/25-04-04/beat4.webp';
import tumblrImg from '@/assets/images/25_images/25-04/25-04-04/heart.webp';
import styles from './Clock.module.css';

export const assets = [beat4, tumblrImg];

const HeartbeatClock = () => {
  const clockRefs = {
    hour: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    second: useRef<HTMLDivElement>(null),
  };

  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useClock();

  const updateClock = useCallback((): void => {
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();
    const secDeg = seconds * 6;
    const minDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    if (clockRefs.second.current) clockRefs.second.current.style.transform = `rotate(${secDeg}deg)`;
    if (clockRefs.minute.current) clockRefs.minute.current.style.transform = `rotate(${minDeg}deg)`;
    if (clockRefs.hour.current) clockRefs.hour.current.style.transform = `rotate(${hourDeg}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  const bodyStyle = {
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${beat4})`,
    filter: 'saturate(300%)',
    backgroundRepeat: 'repeat',
    backgroundSize: '6%',
    zIndex: 0,
  };

  const clockStyle = {
    position: 'relative',
    width: '50dvh',
    height: '50dvh',
    backgroundImage: `url(${tumblrImg})`,
    filter: 'hue-rotate(200deg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: '2px solid #eb0808',
    borderRadius: '50%',
    boxShadow: '0 0 400px #8e4dff',
    transformOrigin: 'center',
    zIndex: 10,
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: 'rotate(0deg)',
  };

  const hourStyle = { ...handBaseStyle, width: '7px', height: '70px', background: 'transparent', borderRadius: '10px', boxShadow: '0 0 3px #F80D3CFF', zIndex: 3 };
  const minuteStyle = { ...handBaseStyle, width: '6px', height: '140px', background: 'transparent', borderRadius: '6px', boxShadow: '0 0 3px #F80D3CFF', zIndex: 2 };
  const secondStyle = { ...handBaseStyle, width: '4px', height: '150px', background: '#588944FF', borderRadius: '4px', zIndex: 1 };
  const centerDotStyle = { width: '30px', height: '30px', background: '#ff333f', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, boxShadow: '0 0 5px #fff' };

  return (
    <main className={styles.container} style={bodyStyle}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <div style={backgroundStyle} />
      <div style={clockStyle} className={styles.heartbeat}>
        <div ref={clockRefs.hour} style={hourStyle} />
        <div ref={clockRefs.minute} style={minuteStyle} />
        <div ref={clockRefs.second} style={secondStyle} />
        <div style={centerDotStyle} />
      </div>
    </main>
  );
}

const MemoizedHeartbeatClock = memo(HeartbeatClock);
MemoizedHeartbeatClock.displayName = 'Clock_25_04_04';
export default MemoizedHeartbeatClock;
