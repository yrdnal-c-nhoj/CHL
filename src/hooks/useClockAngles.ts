import { useMemo } from 'react';

/**
 * A custom hook that calculates the rotation angles for the hands of an analog clock.
 *
 * @param time - The Date object representing the current time.
 * @param options - Configuration for the angle calculation.
 * @param options.isTimezoneSpecific - If true, performs calculations based on parts from Intl.DateTimeFormat.
 * @param options.zone - The IANA timezone string (e.g., 'America/New_York'), required if isTimezoneSpecific is true.
 * @returns An object containing the rotation angles for the hour, minute, and second hands in degrees.
 */
export function useClockAngles(time: Date) {
  const angles = useMemo(() => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() + minutes / 60;

    return {
      // 360 degrees / 60 seconds = 6 deg/sec
      secAngle: seconds * 6,
      // 360 degrees / 60 minutes = 6 deg/min
      minAngle: minutes * 6,
      // 360 degrees / 12 hours = 30 deg/hr
      hourAngle: hours * 30,
    };
  }, [time]);

  return angles;
}