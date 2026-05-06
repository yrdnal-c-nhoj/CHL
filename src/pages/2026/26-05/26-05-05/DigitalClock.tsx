import React, { useMemo } from 'react';

import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';

import styles from './DigitalClock.module.css';

// ---------------- INTERFACES ----------------
interface DigitalTimeDisplay {
  hours: string;
  minutes: string;
  seconds: string;
  period: string;
}

// ---------------- FONT CONFIGURATION ----------------
const fontConfigs = [
  {
    fontFamily: 'DigitalFont',
    fontUrl: '@/assets/fonts/2026/26-05-05-mono.ttf',
  },
];

// ---------------- UTILITIES ----------------
const formatDigitalTime = (date: Date): DigitalTimeDisplay => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const period = hours >= 12 ? 'PM' : 'AM';
  let displayHours: string;
  
  if (hours === 0) {
    displayHours = '12';
  } else if (hours > 12) {
    displayHours = String(hours - 12).padStart(2, '0');
  } else {
    displayHours = String(hours).padStart(2, '0');
  }
  
  return {
    hours: displayHours,
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    period,
  };
};

// ---------------- COMPONENTS ----------------
const BackgroundLayer: React.FC = () => (
  <div className={styles.background} />
);

const TimeDisplay: React.FC<{ time: DigitalTimeDisplay }> = ({ time }) => (
  <div className={styles.timeDisplay}>
    <div className={styles.timeGroup}>
      <span className={styles.timeDigit}>{time.hours}</span>
      <span className={styles.timeSeparator}>:</span>
      <span className={styles.timeDigit}>{time.minutes}</span>
      <span className={styles.timeSeparator}>:</span>
      <span className={styles.timeDigit}>{time.seconds}</span>
    </div>
    <span className={styles.period}>{time.period}</span>
  </div>
);

const DateDisplay: React.FC<{ date: Date }> = ({ date }) => {
  const formattedDate = useMemo(() => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [date]);

  return (
    <div className={styles.dateDisplay}>
      {formattedDate}
    </div>
  );
};

// ---------------- MAIN DIGITAL CLOCK COMPONENT ----------------
const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();
  
  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const timeDisplay = useMemo(() => formatDigitalTime(currentTime), [currentTime]);

  return (
    <div className={styles.container}>
      <BackgroundLayer />
      
      <time dateTime={currentTime.toISOString()} className={styles.clockDisplay}>
        <TimeDisplay time={timeDisplay} />
        <DateDisplay date={currentTime} />
      </time>
    </div>
  );
};

export default DigitalClock;
