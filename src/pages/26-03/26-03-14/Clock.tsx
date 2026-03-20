import React, { useState, useEffect, useMemo } from 'react';
import backgroundImage from '../../../assets/images/26-03/26-03-14/mother.webp';

// Move static sub-components outside to prevent re-creation on every tick
const ImageLayout = React.memo(() => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000' }}>
    <img
      src={backgroundImage}
      alt="Background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'none',
        objectPosition: 'top left',
      }}
    />
  </div>
));

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // Memoize formatting to keep the render function clean
  const formattedTime = useMemo(() => {
    const hours = time.getHours();
    const h = hours % 12 || 12;
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    const ms = String(time.getMilliseconds()).padStart(3, '0');
    const ampm = hours >= 12 ? 'P.M.' : 'A.M.';

    return `${h}:${m}:${s}.${ms} ${ampm}`;
  }, [time]);

  return (
    <div style={styles.container}>
      <ImageLayout />

      <div style={styles.clockOverlay}>{formattedTime}</div>
    </div>
  );
};

// Styles object to keep JSX clean and readable
const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    position: 'relative',
    background: '#000',
  },
  clockOverlay: {
    position: 'absolute',
    top: '1px',
    left: '20px',
    color: '#DFECD7',
    fontSize: '2vh',
    fontFamily: 'monospace',
    textShadow: '0 0 10px rgba(255,255,255,0.5)',
    zIndex: 10,
    pointerEvents: 'none',
    opacity: 0.8,
    filter: 'blur(0.6px)',
  },
};

export default Clock;
