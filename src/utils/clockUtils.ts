import { useState, useEffect, useRef } from 'react';
import type { ClockTime, TimeFormat } from '@/types/clock';

/**
 * Hook that provides current time with automatic updates
 * @param {('ms'|'seconds')} precision - How often the clock should update
 * @returns {Date} Current time
 */
export function useClockTime(precision: 'ms' | 'seconds' = 'seconds'): Date {
  const [time, setTime] = useState<Date>(new Date());
  const lastSecondRef = useRef<number>(-1);

  useEffect(() => {
    let frameId: number;
    
    const tick = () => {
      const now = new Date();
      
      if (precision === 'seconds') {
        const currentSecond = now.getSeconds();
        if (currentSecond !== lastSecondRef.current) {
          lastSecondRef.current = currentSecond;
          setTime(now);
        }
      } else {
        setTime(now);
      }
      
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [precision]);

  return time;
}

/**
 * Formats a date into time components
 * @param {Date} date - Date to format
 * @param {TimeFormat} format - 12h or 24h format
 * @returns {ClockTime} Formatted time components
 */
export function formatTime(date: Date, format: TimeFormat = '12h'): ClockTime {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ms = date.getMilliseconds();

  if (format === '12h') {
    hours = hours % 12 || 12;
  }

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: ms.toString().padStart(3, '0').slice(0, 2)
  };
}

/**
 * Calculates clock hand angles for analog clocks
 * @param {Date} time - Current time
 * @returns {Object} Angles for hour, minute, and second hands
 */
export function calculateAngles(time: Date): {
  hour: number;
  minute: number;
  second: number;
} {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  return {
    hour: (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60), 
    minute: minutes * 6 + seconds * 0.1 + ms * (0.1 / 1000),
    second: seconds * 6 + ms * 0.006 // 6 degrees per second + fractional ms sweep
  };
}

/**
 * Generates tick marks for analog clocks
 * @param {number} radius - Clock radius
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @returns {Array} Array of tick mark coordinates
 */
export function generateTickMarks(
  radius: number,
  centerX: number,
  centerY: number,
): Array<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  isHour: boolean;
}> {
  const tickMarks = [];

  // Hour marks
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start from top
    const x1 = centerX + Math.cos(angle) * (radius - 15);
    const y1 = centerY + Math.sin(angle) * (radius - 15);
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius;

    tickMarks.push({
      x1,
      y1,
      x2,
      y2,
      thickness: 3,
      isHour: true,
    });
  }

  // Minute marks
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue; // Skip hour positions

    const angle = (i * 6 - 90) * (Math.PI / 180);
    const x1 = centerX + Math.cos(angle) * (radius - 5);
    const y1 = centerY + Math.sin(angle) * (radius - 5);
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius;

    tickMarks.push({
      x1,
      y1,
      x2,
      y2,
      thickness: 1,
      isHour: false,
    });
  }

  return tickMarks;
}

/**
 * Checks if a time is valid
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid time format
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(time);
}

/**
 * Converts time string to Date object
 * @param {string} timeString - Time string in HH:MM format
 * @returns {Date} Date object
 */
export function timeStringToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}
