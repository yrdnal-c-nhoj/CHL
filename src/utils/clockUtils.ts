/**
 * clockUtils.ts
 *
 * Provides utility functions and standardized clock hooks/formatters
 * to support all clock pages.
 */

import { useEffect, useState } from 'react';

/**
 * Pads a number with a leading zero if it's a single digit.
 */
const pad = (num: number): string => num.toString().padStart(2, '0');

/**
 * useClockTime
 * Canonical hook expected by some clock pages.
 * Provides the current time and updates every second.
 */
export function useClockTime(_precision?: 'ms' | 's'): Date {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

/**
 * Formats a Date object into a string based on the specified format.
 */
export const formatTime = (
  date: Date,
  format: '24h' | '12h' | '12h-stylized' = '24h',
): string => {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  switch (format) {
    case '24h':
      return `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
    case '12h': {
      const hours12 = hours24 % 12 || 12;
      const ampm = hours24 >= 12 ? 'PM' : 'AM';
      return `${hours12}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    }
    case '12h-stylized': {
      let stylizedHours = hours24;
      const stylizedMinutes = minutes;
      const stylizedAmpm = stylizedHours >= 12 ? 'pm' : 'am';
      stylizedHours = stylizedHours % 12 || 12;
      return `${stylizedHours}${stylizedMinutes.toString().padStart(2, '0')} ${stylizedAmpm}`
        .split('')
        .join(' ');
    }
    default:
      return date.toLocaleTimeString();
  }
};

/**
 * Calculates clock hand angles based on a Date object.
 */
export const calculateAngles = (date: Date) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  return {
    second: seconds * 6,
    minute: minutes * 6 + seconds * 0.1,
    hour: (hours % 12) * 30 + minutes * 0.5,
  };
};

