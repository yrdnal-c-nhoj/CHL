import React from 'react';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  return (
    <div className={styles.container}>
      <time dateTime={currentTime.toISOString()} className={styles.digitalTime}>
        {currentTime.toLocaleTimeString()}
      </time>
    </div>
  );
};

export default DigitalClock;
