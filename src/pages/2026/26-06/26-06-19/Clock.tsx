import { useClockTime } from '@/utils/hooks';
import React, { useMemo } from 'react';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const DigitalClock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(
    () => ({
      hours: formatTime(time.getHours()),
      minutes: formatTime(time.getMinutes()),
      seconds: formatTime(time.getSeconds()),
    }),
    [time],
  );

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        margin: 0,
        padding: 0,
      }}
    >
      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: 'monospace',
          fontSize: 'clamp(2rem, 10vw, 6rem)',
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {hours}:{minutes}:{seconds}
      </time>
    </main>
  );
};

export default DigitalClock;
