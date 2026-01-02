// FullScreenTallyClock.jsx
import { useState, useEffect } from 'react';

const FullScreenTallyClock = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Prevent mobile bounce/overscroll
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';

    return () => {
      clearInterval(timer);
      // Minimal cleanup — most style resets not strictly needed in SPA
      document.body.style.overflow = '';
    };
  }, []);

  // Extract time parts with leading zeros
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const tallyGroup = (digit) => {
    const num = parseInt(digit, 10);
    const groupsOf5 = Math.floor(num / 5);
    const remainder = num % 5;

    return (
      <>
        {'𝍩'.repeat(groupsOf5)}
        {'𝍪𝍫𝍬𝍭'[remainder] || ''}
      </>
    );
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'min(6vw, 40px)',
          fontSize: 'min(22vmin, 180px)',
          lineHeight: 1,
          fontWeight: 'normal',
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}
      >
        {/* Hours */}
        <div style={{ display: 'flex' }}>
          {tallyGroup(hours[0])}
          {tallyGroup(hours[1])}
        </div>

        {/* Minutes */}
        <div style={{ display: 'flex' }}>
          {tallyGroup(minutes[0])}
          {tallyGroup(minutes[1])}
        </div>

        {/* Seconds */}
        <div style={{ display: 'flex' }}>
          {tallyGroup(seconds[0])}
          {tallyGroup(seconds[1])}
        </div>
      </div>

      {/* Very small debug/current time (optional – remove if not wanted) */}
      <div
        style={{
          position: 'absolute',
          bottom: '2vh',
          right: '2vw',
          fontSize: 'min(3vmin, 14px)',
          color: '#444',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        {hours}:{minutes}:{seconds}
      </div>
    </div>
  );
};

export default FullScreenTallyClock;