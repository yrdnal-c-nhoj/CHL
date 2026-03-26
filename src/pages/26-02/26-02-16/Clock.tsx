import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import styles from './Clock.module.css';

import mazeImage from '../../../assets/images/26-02/26-02-16/puzzle.gif';
import loopImage from '../../../assets/images/26-02/26-02-16/loop.webp';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

export { mazeImage };

const getBackgroundStyle = (isFlipped) => ({
  position: 'absolute' as const,
  inset: 0,
  backgroundImage: `url(${mazeImage})`,
  backgroundSize: '200px auto',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  filter: `contrast(6.4) brightness(2.0)`,
  opacity: isFlipped ? 0.3 : 0.6,
  transform: isFlipped ? 'scale(-1, -1)' : 'none',
  zIndex: isFlipped ? 2 : 1,
});

const BackgroundLayers = React.memo(() => (
  <>
    {/* Full-cover background - no tiling */}
    <div
      style={{
        position: 'absolute' as const,
        inset: 0,
        backgroundImage: `url(${loopImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'saturate(5.8)',
        // opacity: 0.5,
        zIndex: 0,
      }}
    />
    {/* First image - original background */}
    <div style={getBackgroundStyle(false)} />
    {/* Second image - flipped background */}
    <div style={getBackgroundStyle(true)} />
  </>
));
BackgroundLayers.displayName = 'BackgroundLayers';

const Digit = React.memo(({ char }: { char: string }) => {
  const isColon = char === ':';
  return (
    <div className={styles.digitBox}>
      <span className={`${styles.digit} ${isColon ? styles.colon : ''}`}>
        {char}
      </span>
    </div>
  );
});
Digit.displayName = 'Digit';

export const fontConfigs = [{
  fontFamily: 'MazeFont',
  fontUrl: mazeFont,
  options: {
    weight: 'normal',
    style: 'normal'
  }
}];

const DigitalClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeParts = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`.split('');
  }, [time]);

  return (
    <main className={styles.container}>
      <BackgroundLayers />
      <div className={styles.digitalContainer}>
        <div className={styles.timeWrapper}>
          {timeParts.map((char, idx) => (
            <Digit key={`${idx}-${char}`} char={char} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DigitalClock;
