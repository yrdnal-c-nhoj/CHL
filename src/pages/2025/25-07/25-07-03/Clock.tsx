import { useEffect, useRef, useState } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import rocketGif from '../../../../assets/images/2025/25-07/25-07-03/rocket.gif';
import rockFont from '../../../../assets/fonts/25-07-03-rock.ttf';

const Clock: React.FC = () => {
  const clockRef = useRef(null);

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'rock',
      fontUrl: rockFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  useEffect(() => {
    if (!fontsLoaded) return;

    const updateClock: React.FC = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ms = now.getMilliseconds().toString().padStart(3, '0');

      if (clockRef.current) {
        clockRef.current.textContent = `T-${h}:${m}:${s}.${ms}`;
      }
      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, [fontsLoaded]);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: '100dvh',
    width: '100vw',
    backgroundImage: `url(${rocketGif})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const clockStyle = {
    fontFamily: fontsLoaded ? 'rock' : 'monospace', // fallback font reserves space
    color: 'rgb(255, 0, 47)',
    fontSize: '1.8rem',
    textAlign: 'center',
    minWidth: '12ch', // reserve width for T-HH:MM:SS.MMM
  };

  return (
    <div style={containerStyle}>
      <div id="clock" ref={clockRef} style={clockStyle}>
        {/* show placeholder text until font loads */}
        {!fontsLoaded && 'T-00:00:00.000'}
      </div>
    </div>
  );
};

export default Clock;
