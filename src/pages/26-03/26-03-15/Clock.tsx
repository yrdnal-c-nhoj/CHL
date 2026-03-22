import React, { useMemo, useEffect, useState } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import fontUrl from '../../../assets/fonts/26-03-15-shadow.otf?url';
import styles from './Clock.module.css';

const MS_PER_ROTATION = 30000;

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  const [rotation, setRotation] = useState(0);

  const fontConfigs = useMemo(() => [
    { fontFamily: '26-03-15-shadow', fontUrl, options: { weight: 'normal', style: 'normal' } }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setRotation(-((time.getTime() / MS_PER_ROTATION) * 360) % 360);
  }, [time]);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const digits = [h[0], h[1], m[0], m[1]];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {digits.map((digit, i) => (
          <div key={i} className={styles.digitBox}>
            <div 
              className={styles.digit}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {digit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;