import React, { useEffect, useState, useRef, memo } from 'react';
import overlayBg from "../../../assets/images/26-01-15/red.gif";
import baseBg from "../../../assets/images/26-01-15/sph.gif";

// Centralized color control for all clock hands
const handColors = {
  hour: '#F39191B3',
  minute: '#F39191B3',
  second: '#F39191B3',
  center: '#F39191B3',
  centerBorder: '#F39191B3',
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();
  const [bgReady, setBgReady] = useState(false);

  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Preload backgrounds to avoid FOUC
  useEffect(() => {
    const imgs = [overlayBg, baseBg];
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= imgs.length) setBgReady(true);
    };
    imgs.forEach(src => {
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
    { size: '32vh', color: '#F8062275', z: 2 },
    { size: '31.5vh', color: 'transparent', z: 3 },
    { size: '31vh', color: 'transparent', z: 3 },
    { size: '29.5vh', color: 'transparent', z: 3 },
    { size: '28vh', color: 'transparent', z: 3 },
    { size: '25.5vh', color: 'transparent', z: 3 },
    { size: '23vh', color: 'transparent', z: 3 },
    { size: '20.5vh', color: 'transparent', z: 3 },
    { size: '18vh', color: 'transparent', z: 3 },
    { size: '15vh', color: 'transparent', z: 3 },
    { size: '11vh', color: 'transparent', z: 3 },
    { size: '8vh', color: 'transparent', z: 3 },
    { size: '5vh', color: 'transparent', z: 3 },
  ];

  return (
    <main style={{ ...styles.wrapper, opacity: bgReady ? 1 : 0, visibility: bgReady ? 'visible' : 'hidden', transition: 'opacity 0.3s ease' }}>
      <div style={styles.baseBackground} />
      {overlayLayers.map((layer, index) => (
        <div 
          key={index} 
          style={{
            ...styles.overlayBase,
            backgroundColor: layer.color,
            backgroundImage: `url(${overlayBg})`,
            backgroundSize: layer.size,
            zIndex: layer.z
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
};

const Hand = memo(({ type, rotation }) => {
  const isSecond = type === 'second';
  
  const config = {
    hour:   { width: '0.4vh', height: '4.5vh', z: 5, tail: '0vh' },
    minute: { width: '0.25vh', height: '7.5vh', z: 4, tail: '0vh' },
    second: { width: '0.15vh', height: '10vh', z: 6, tail: '2.5vh' },
  };

  const { width, height, z, tail } = config[type];
  const color = handColors[type];

  const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width,
    height: `calc(${height} + ${tail})`,
    backgroundColor: color,
    zIndex: z,
    transformOrigin: `50% calc(100% - ${tail})`, 
    transform: `translate(-50%, -100%) translateY(${tail}) rotate(${rotation}deg)`,
    willChange: 'transform',
    borderRadius: '1px',
  };


  return (
    <div style={containerStyle}>
    </div>
  );
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
    backgroundSize: '60vh',
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
    width: '0.8vh',
    height: '0.8vh',
    backgroundColor: handColors.center,
    border: `0.15vh solid ${handColors.centerBorder}`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  }
};

export default Clock;