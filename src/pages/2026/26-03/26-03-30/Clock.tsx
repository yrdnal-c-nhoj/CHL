import React, { useMemo } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import origamiFont from '../../../../assets/fonts/2026/26-03-30-origami.ttf';
import craneImg from '../../../../assets/images/2026/26-03/26-03-30/1.webp';
import styles from './Clock.module.css';

const LETTERS = ['b', 'f', 'c', 'j', 'i', 'n', 'q', 's', 'u', 'w'];

// Sub-component memoized to prevent digit re-renders
const Digit = React.memo(({ char }: { char: string }) => (
  <div className={styles.digit}>
    <span>{char}</span>
  </div>
));

const Clock: React.FC = () => {
  const time = useSecondClock();

  const fontConfigs = useMemo(() => [{ fontFamily: 'OrigamiFont', fontUrl: origamiFont }], []);
  useSuspenseFontLoader(fontConfigs);

  const displayTime = useMemo(() => {
    const format = (val: number) => 
      val.toString().padStart(2, '0').split('').map(d => LETTERS[parseInt(d, 10)]);
    
    return [
      ...format(time.getHours()),
      ...format(time.getMinutes()),
      ...format(time.getSeconds())
    ];
  }, [time]);

  return (
    <div className={styles.container}>
      {/* Tiled crane background */}
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${craneImg})` }}
      />
      <div className={styles.clockGrid}>
        {displayTime.map((char, i) => (
          <Digit key={`${i}-${char}`} char={char} />
        ))}
      </div>
    </div>
  );
};

export default Clock;