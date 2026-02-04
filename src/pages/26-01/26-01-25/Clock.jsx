import React, { useEffect, useState, useRef } from 'react';
import analogBgImage from '../../../assets/clocks/26-01-25/mirage.webp';

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [opacity, setOpacity] = useState(0.06);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const noiseSeedRef = useRef(Math.random() * 10000);

  // Clock update every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Organic, random-like opacity animation
  useEffect(() => {
    let mounted = true;

    const animate = (now) => {
      if (!mounted) return;

      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const t = now * 0.0003 + noiseSeedRef.current;

      // Low frequency base wave
      const base = Math.sin(t * 1.1) * 0.5 + Math.sin(t * 0.7) * 0.5;
      // Medium frequency flutter
      const flutter = Math.sin(t * 8.4 + 13.7) * 0.3 + Math.sin(t * 12.2 + 41.9) * 0.2;
      // Fast noise / sparkle
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

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundImage: `url(${analogBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#000',
  };

  const faceContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '110vmin',
    height: '110vmin',
    borderRadius: '50%',
    opacity: opacity,
    willChange: 'opacity',
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '999px',
  };

  return (
    <div style={containerStyle}>
      <div style={faceContainerStyle}>
        {/* Hour Hand */}
        <div
          style={{
            ...handBaseStyle,
            width: '1.4vmin',
            height: '20vmin',
            background: 'linear-gradient(to top, #D4CECE, #F2D38F7E, #F5D67F)',
            transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
            zIndex: 2,
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            ...handBaseStyle,
            width: '0.9vmin',
            height: '35vmin',
            background: 'linear-gradient(to top, #C4C0C0, #F3DD9B69, #F0CF7D)',
            transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;