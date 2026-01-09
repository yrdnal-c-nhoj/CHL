import React, { useEffect, useRef } from 'react';

import spin from '../../assets/clocks/26-01-07/20206.gif';
import bubl from '../../assets/clocks/26-01-07/bubl.gif';
import fish from '../../assets/clocks/26-01-07/fish.gif';
import gfish from '../../assets/clocks/26-01-07/gfish.gif';
import aquarium from '../../assets/clocks/26-01-07/aquarium.gif';

const AquariumClock = () => {
  const hourHandRef = useRef(null);
  const minHandRef = useRef(null);
  const secondHandRef = useRef(null);

  useEffect(() => {
    const setDate = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const mins = now.getMinutes();
      const hour = now.getHours();

      // -90 degrees shifts the 0 position from 3 o'clock to 12 o'clock
      const secondsDeg = (seconds / 60) * 360 - 90;
      const minsDeg = (mins / 60) * 360 + (seconds / 60) * 6 - 90;
      const hourDeg = ((hour % 12) / 12) * 360 + (mins / 60) * 30 - 90;

      // Handle the 354° -> -90° jump to prevent the hand from spinning backwards
      if (secondHandRef.current) {
        secondHandRef.current.style.transition = seconds === 0 ? 'none' : 'all 0.5s cubic-bezier(0.1, 2.7, 0.58, 1)';
        secondHandRef.current.style.transform = `translateY(-50%) rotate(${secondsDeg}deg)`;
      }

      if (minHandRef.current) {
        minHandRef.current.style.transform = `translateY(-50%) rotate(${minsDeg}deg)`;
      }

      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `translateY(-50%) rotate(${hourDeg}deg)`;
      }
    };

    const interval = setInterval(setDate, 1000);
    setDate();
    return () => clearInterval(interval);
  }, []);

  const sharedImageStyle = {
    position: 'absolute',
    inset: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover'
  };

  const handStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'left center', // This pins the "tail" of the fish to the center
    transition: 'transform 0.5s cubic-bezier(0.1, 2.7, 0.58, 1)',
  };

  const handFilter =
    'drop-shadow(2px 1px 3px rgb(0, 3, 2)) ' +
    'drop-shadow(-1px 1px 1px rgb(6, 85, 31)) ' +
    'drop-shadow(1px -1px 1px rgb(10, 154, 109)) ' +
    'drop-shadow(-1px -1px 1px rgb(214, 227, 216))';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Background Layers */}
      <img src={aquarium} style={{ ...sharedImageStyle, opacity: 0.5, zIndex: 0 }} alt="" />
      <img src={aquarium} style={{ ...sharedImageStyle, opacity: 0.9, transform: 'scaleX(-1)', zIndex: 1 }} alt="" />

      {/* Rotating Background GIFs */}
      <img src={spin} style={{ ...sharedImageStyle, height: '80vh', opacity: 0.6, zIndex: 2, filter: 'sepia(100%) hue-rotate(-30deg) saturate(400%)' }} alt="" />

      {/* Clock Hands Container */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
        {/* Hour Hand (Smallest/Thickest) */}
        <img
          src={fish}
          ref={hourHandRef}
          style={{ ...handStyle, width: '30vh', height: 'auto', filter: handFilter }}
          alt="hour"
        />
        {/* Minute Hand (Medium) */}
        <img
          src={fish}
          ref={minHandRef}
          style={{ ...handStyle, width: '45vh', height: 'auto', filter: handFilter }}
          alt="minute"
        />
        {/* Second Hand (Longest/Thinnest) */}
        <img
          src={fish}
          ref={secondHandRef}
          style={{ ...handStyle, width: '48vh', height: 'auto', filter: handFilter, opacity: 0.8 }}
          alt="second"
        />
      </div>

      {/* Foreground Bubbles & Fish */}
      <img src={bubl} style={{ position: 'absolute', top: 0, left: '-22vw', width: '100%', height: '110%', zIndex: 4 }} alt="" />
      <img src={gfish} style={{ ...sharedImageStyle, width: '180vw', opacity: 0.8, transform: 'scaleX(-1)', zIndex: 7 }} alt="" />
    </div>
  );
};

export default AquariumClock;