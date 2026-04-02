import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useClockTime();

  const timeData = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const hourStr = h.toString();
    const minStr = m.toString().padStart(2, '0');

    return {
      hourDigits: hourStr.split(''),
      minDigits: minStr.split('')
    };
  }, [time]);

  return (
    <>
      <div className={styles['clock-bg-back']}></div>
      <div className={styles['clock-bg-middle']}></div>
      <div className={styles['clock-bg']}></div>
      <div className={styles.container}>
        <div className={styles['clock-wrapper']}>
          <div className={styles['hour-group']}>
            {timeData.hourDigits.map((digit, i) => (
              <span
                key={`h-${i}`}
                className={`${styles.digit} ${styles[`digit-glam-${i}`]}`}
              >
                {digit}
              </span>
            ))}
          </div>
          <div className={styles['minute-group']}>
            {timeData.minDigits.map((digit, i) => (
              <span
                key={`m-${i}`}
                className={`${styles.digit} ${styles[`digit-glam-${i + 2}`]}`}
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
