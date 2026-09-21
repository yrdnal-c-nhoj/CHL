import React, { memo, useEffect, useState } from 'react';
import { useSuspenseFontLoader } from '../utils/fontLoader';

interface ClockProps {
  // No props required for this component
}

const Clock: React.FC<ClockProps> = () => {
  useSuspenseFontLoader([
    { fontFamily: 'ClockFont', fontUrl: 'path/to/clock-font.woff2' },
  ]);

  const [time, setTime] = useState(() => new Date());
  const lastSecondRef = useRef<number>(-1);
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const tick = (_timestamp: number) => {
      const now = new Date();
      const currentSecond = now.getSeconds();
      if (currentSecond !== lastSecondRef.current) {
        setTime(now);
        lastSecondRef.current = currentSecond;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const formatTime = (time: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      hours: pad(time.getHours()),
      minutes: pad(time.getMinutes()),
      seconds: pad(time.getSeconds()),
    };
  };

  return (
    <div className="clock">
      <span className="digit">{formatTime(time).hours}</span>
      <span className="digit">{formatTime(time).minutes}</span>
      <span className="digit">{formatTime(time).seconds}</span>
    </div>
  );
};

export default memo(Clock);
