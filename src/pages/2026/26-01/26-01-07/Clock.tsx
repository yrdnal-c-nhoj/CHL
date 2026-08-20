import { memo, useEffect, useRef } from 'react';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

import spin from '@/assets/images/26_images/26-01/26-01-07/20206.gif';
import bubl from '@/assets/images/26_images/26-01/26-01-07/bubl.gif';
import fish from '@/assets/images/26_images/26-01/26-01-07/fish.gif';
import gfish from '@/assets/images/26_images/26-01/26-01-07/gfish.gif';
import aquarium from '@/assets/images/26_images/26-01/26-01-07/aquarium.gif';

export const assets = [spin, bubl, fish, gfish, aquarium];

const AquariumClock =  () => {
  const hourHandRef = useRef<HTMLImageElement>(null);
  const minHandRef = useRef<HTMLImageElement>(null);
  const secondHandRef = useRef<HTMLImageElement>(null);
  const time = useSecondClock();

  const handFilter = 'drop-shadow(2px 1px 3px rgb(0, 3, 2)) drop-shadow(-1px 1px 1px rgb(6, 85, 31)) drop-shadow(1px -1px 1px rgb(10, 154, 109)) drop-shadow(-1px -1px 1px rgb(214, 227, 216))';

  const handSizes = {
    hour: 'min(30vw, 30vh)',
    minute: 'min(45vw, 45vh)',
    second: 'min(48vw, 48vh)',
  };

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <img src={aquarium} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, zIndex: 0 }} />
      <img src={aquarium} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transform: 'scaleX(-1)', zIndex: 1 }} />

      <img src={spin} alt="" style={{ position: 'absolute', height: '80%', width: 'auto', left: '50%', transform: 'translateX(-50%)', opacity: 0.6, zIndex: 2, filter: 'sepia(100%) hue-rotate(-30deg) saturate(400%)', maxHeight: '80vh' }} />

      <div className={styles.handsContainer}>
        <img ref={hourHandRef} src={fish} alt="hour" style={{ width: handSizes.hour, height: 'auto', filter: handFilter }} />
        <img ref={minHandRef} src={fish} alt="minute" style={{ width: handSizes.minute, height: 'auto', filter: handFilter }} />
        <img ref={secondHandRef} src={fish} alt="second" style={{ width: handSizes.second, height: 'auto', filter: handFilter, opacity: 0.8 }} />
      </div>

      <img src={bubl} alt="" style={{ position: 'absolute', top: 0, left: '-22%', width: '144%', height: '110%', zIndex: 4, maxWidth: 'none' }} />
      <img src={gfish} alt="" style={{ position: 'absolute', inset: 0, width: '180%', opacity: 0.8, transform: 'scaleX(-1)', zIndex: 7, maxWidth: 'none' }} />
    </main>
  );
};

const MemoizedAquariumClock = memo(AquariumClock);
MemoizedAquariumClock.displayName = 'Clock_26_01_07';
export default MemoizedAquariumClock;
