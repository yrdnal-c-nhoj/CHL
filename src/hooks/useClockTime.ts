import { useState, useEffect } from 'react';

/**
 * Custom hook that provides the current time, updating every second.
 * @returns The current Date object.
 */
export const useClockTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};