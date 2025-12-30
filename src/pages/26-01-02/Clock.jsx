// DigitalClock.jsx
import { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'manipulation', // better mobile feel
      }}
    >
      {/* Mobile / narrow layout: hours on top, minutes below */}
      <div
        style={{
          width: '100%',
          height: '50dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'min(45dvh, 45vw)',
          fontWeight: 'bold',
          letterSpacing: '-0.04em',
          // hide on wide screens
          '@media (min-aspect-ratio: 1 / 1)': { display: 'none' },
        }}
      >
        {time.hours}
      </div>

      <div
        style={{
          width: '100%',
          height: '50dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'min(45dvh, 45vw)',
          fontWeight: 'bold',
          letterSpacing: '-0.04em',
          // hide on wide screens
          '@media (min-aspect-ratio: 1 / 1)': { display: 'none' },
        }}
      >
        {time.minutes}
      </div>

      {/* Wide / landscape / desktop layout: hours left | minutes right */}
      <div
        style={{
          width: '100%',
          height: '100dvh',
          display: 'none',
          flexDirection: 'row',
          // show only on wider screens
          '@media (min-aspect-ratio: 1 / 1)': {
            display: 'flex',
          },
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'min(90dvh, 45vw)',
            fontWeight: 'bold',
            letterSpacing: '-0.04em',
          }}
        >
          {time.hours}
        </div>

        <div
          style={{
            width: '50%',
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'min(90dvh, 45vw)',
            fontWeight: 'bold',
            letterSpacing: '-0.04em',
          }}
        >
          {time.minutes}
        </div>
      </div>
    </div>
  );
}