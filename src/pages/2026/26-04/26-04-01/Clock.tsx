import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';

interface DigitProps {
  digit: string;
  index: number;
  offset?: number;
}

const Digit: React.FC<DigitProps> = ({ digit, index, offset = 0 }) => (
  <span className={`${styles.digit} ${styles[`digit-glam-${index + offset}`]}`}>
    {digit}
  </span>
);

const BackgroundLayers: React.FC = () => (
  <>
    <div className={styles['clock-bg-back']} />
    <div className={styles['clock-bg-middle']} />
    <div className={styles['clock-bg']} />
  </>
);

const formatTimeDigits = (time: Date) => {
  const hours = time.getHours().toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return {
    hourDigits: hours.split(''),
    minDigits: minutes.split(''),
  };
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const { hourDigits, minDigits } = useMemo(() => formatTimeDigits(time), [time]);

  return (
    <>
      <BackgroundLayers />
      <div className={styles.container}>
        <div className={styles['clock-wrapper']}>
          <div className={styles['hour-group']}>
            {hourDigits.map((digit, i) => (
              <Digit key={`h-${i}`} digit={digit} index={i} />
            ))}
          </div>
          <div className={styles['minute-group']}>
            {minDigits.map((digit, i) => (
              <Digit key={`m-${i}`} digit={digit} index={i} offset={2} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
