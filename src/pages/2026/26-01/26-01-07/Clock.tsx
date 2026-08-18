import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

import spin from '@/assets/images/26_images/26-01/26-01-07/20206.gif';
import bubl from '@/assets/images/26_images/26-01/26-01-07/bubl.gif';
import fish from '@/assets/images/26_images/26-01/26-01-07/fish.gif';
import gfish from '@/assets/images/26_images/26-01/26-01-07/gfish.gif';
import aquarium from '@/assets/images/26_images/26-01/26-01-07/aquarium.gif';
import { useSecondClock } from '@/utils/hooks';
const AquariumClock =  () => {
  const hourHandRef = useRef<HTMLImageElement>(null);
  const minHandRef = useRef<HTMLImageElement>(null);
  const secondHandRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
      setDate();
    }, [time]);

  const handStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'left center',
    transition: 'transform 0.5s cubic-bezier(0.1, 2.7, 0.58, 1)',
    maxWidth: 'none',
    willChange: 'transform',
  };

  const handFilter =
    'drop-shadow(2px 1px 3px rgb(0, 3, 2)) ' +
    'drop-shadow(-1px 1px 1px rgb(6, 85, 31)) ' +
    'drop-shadow(1px -1px 1px rgb(10, 154, 109)) ' +
    'drop-shadow(-1px -1px 1px rgb(214, 227, 216))';

  // Adjust hand sizes based on viewport size
  const handSizes = {
    hour: 'min(30vw, 30vh)',
    minute: 'min(45vw, 45vh)',
    second: 'min(48vw, 48vh)',
  };

  return (
    <div className={styles.container}>
      {/* Background Layers */}
      <img
        decoding="async"
        loading="lazy"
        src={aquarium}
        className={styles.sharedImage}
        style={{ opacity: 0.5, zIndex: 0 }}
        alt=""
      />
      <img
        decoding="async"
        loading="lazy"
        src={aquarium}
        className={styles.sharedImage}
        style={{
          opacity: 0.9,
          transform: 'scaleX(-1)',
          zIndex: 1,
        }}
        alt=""
      />

      {/* Rotating Background GIFs */}
      <img
        decoding="async"
        loading="lazy"
        src={spin}
        className={styles.sharedImage}
        style={{
          height: '80%',
          width: 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.6,
          zIndex: 2,
          filter: 'sepia(100%) hue-rotate(-30deg) saturate(400%)',
          maxHeight: '80vh',
        }}
        alt=""
      />

      {/* Clock Hands Container */}
      <div className={styles.handsContainer}>
        {/* Hour Hand (Smallest/Thickest) */}
        <img
          decoding="async"
          loading="lazy"
          src={fish}
          ref={hourHandRef}
          style={{
            ...handStyle,
            width: handSizes.hour,
            height: 'auto',
            filter: handFilter,
          }}
          alt="hour"
        />
        {/* Minute Hand (Medium) */}
        <img
          decoding="async"
          loading="lazy"
          src={fish}
          ref={minHandRef}
          style={{
            ...handStyle,
            width: handSizes.minute,
            height: 'auto',
            filter: handFilter,
          }}
          alt="minute"
        />
        {/* Second Hand (Longest/Thinnest) */}
        <img
          decoding="async"
          loading="lazy"
          src={fish}
          ref={secondHandRef}
          style={{
            ...handStyle,
            width: handSizes.second,
            height: 'auto',
            filter: handFilter,
            opacity: 0.8,
          }}
          alt="second"
        />
      </div>

      {/* Foreground Bubbles & Fish */}
      <img
        decoding="async"
        loading="lazy"
        src={bubl}
        style={{
          position: 'absolute',
          top: 0,
          left: '-22%',
          width: '144%',
          height: '110%',
          zIndex: 4,
          maxWidth: 'none',
        }}
        alt=""
      />
      <img
        decoding="async"
        loading="lazy"
        src={gfish}
        className={styles.sharedImage}
        style={{
          width: '180%',
          opacity: 0.8,
          transform: 'scaleX(-1)',
          zIndex: 7,
          maxWidth: 'none',
        }}
        alt=""
      />
    </div>
  );
};

export default AquariumClock;
