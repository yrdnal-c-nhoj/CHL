import { memo, useEffect, useState } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import overlayBg from '@/assets/images/26_images/26-01/26-01-15/red.gif';
import baseBg from '@/assets/images/26_images/26-01/26-01-15/sph.gif';
import styles from './Clock.module.css';

export const assets = [overlayBg, baseBg];

const handColors = {
  hour: '#F39191B3',
  minute: '#F39191B3',
  second: '#F39191B3',
  center: '#F39191B3',
  centerBorder: '#F39191B3',
}

const Clock =  () => {
  const time = useSmoothClock(100);
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const imgs = [overlayBg, baseBg];
    let loaded = 0;
    const done =  () => {
      loaded += 1;
      if (loaded >= imgs.length) setBgReady(true);
    };
    imgs.forEach((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    const timeout = setTimeout(() => setBgReady(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  const ms = time.getMilliseconds();
  const sec = time.getSeconds() + ms / 1000;
  const min = time.getMinutes() + sec / 60;
  const hrs = (time.getHours() % 12) + min / 60;

  const rotations = {
    hour: (360 / 12) * hrs,
    minute: (360 / 60) * min,
    second: (360 / 60) * sec,
  };

  const overlayLayers = [
    { size: '32dvh', color: '#F8062275', z: 2 },
    { size: '31.5dvh', color: 'transparent', z: 3 },
    { size: '31dvh', color: 'transparent', z: 3 },
    { size: '29.5dvh', color: 'transparent', z: 3 },
    { size: '28dvh', color: 'transparent', z: 3 },
    { size: '25.5dvh', color: 'transparent', z: 3 },
    { size: '23dvh', color: 'transparent', z: 3 },
    { size: '20.5dvh', color: 'transparent', z: 3 },
    { size: '18dvh', color: 'transparent', z: 3 },
    { size: '15dvh', color: 'transparent', z: 3 },
    { size: '11dvh', color: 'transparent', z: 3 },
    { size: '8dvh', color: 'transparent', z: 3 },
    { size: '5dvh', color: 'transparent', z: 3 },
  ];

  return (
    <main className={styles.container} style={{ ...styles.wrapper, opacity: bgReady ? 1 : 0, visibility: bgReady ? 'visible' : 'hidden', transition: 'opacity 0.3s ease' }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div style={styles.baseBackground} />
      {overlayLayers.map((layer, index) => (
        <div
          key={index}
          style={{
            ...styles.overlayBase,
            backgroundColor: layer.color,
            backgroundImage: `url(${overlayBg})`,
            backgroundSize: layer.size,
            zIndex: layer.z,
          }}
        />
      ))}

      <div style={styles.clockContainer}>
        <Hand type="hour" rotation={rotations.hour} />
        <Hand type="minute" rotation={rotations.minute} />
        <Hand type="second" rotation={rotations.second} />
        <div style={styles.centerPin} />
      </div>
    </main>
  );
}

const Hand = memo(({ type, rotation }) => {
  const isSecond = type === 'second';

  const config = {
    hour: { width: '0.4dvh', height: '4.5dvh', z: 5, tail: '0dvh' },
    minute: { width: '0.25dvh', height: '7.5dvh', z: 4, tail: '0dvh' },
    second: { width: '0.15dvh', height: '10dvh', z: 6, tail: '2.5dvh' },
  };

  const { width, height, z, tail } = config[type];
  const color = handColors[type];

  const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width,
    height: `calc(${height} + ${tail})`,
    backgroundColor: color,
    zIndex: z,
    transformOrigin: `50% calc(100% - ${tail})`,
    transform: `translate(-50%, -100%) translateY(${tail}) rotate(${rotation}deg)`,
    willChange: 'transform',
    borderRadius: '1px',
  };

  return <div style={containerStyle} />;
});

const styles = {
  wrapper: {
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  overlayBase: {
    position: 'absolute',
    inset: 0,
    backgroundPosition: 'center center',
    backgroundBlendMode: 'overlay',
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
  },
  baseBackground: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#FF000035',
    backgroundImage: `url(${baseBg})`,
    backgroundSize: '50dvh',
    backgroundPosition: 'center center',
    backgroundBlendMode: 'overlay',
    backgroundRepeat: 'repeat',
    zIndex: 1,
  },
  clockContainer: {
    position: 'relative',
    width: '60vmin',
    height: '60vmin',
    zIndex: 10,
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0.8dvh',
    height: '0.8dvh',
    backgroundColor: handColors.center,
    border: `0.15dvh solid ${handColors.centerBorder}`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  },
}

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_01_15';
export default MemoizedClock;
