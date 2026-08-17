import React, { useEffect, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgImage from '@/assets/images/25_images/25-07/25-07-01/mu.jpg';
import fontUrl from '@/assets/fonts/25fonts/25-07-01-mult.ttf';
import { useSecondClock } from '@/utils/hooks';
const { time } = useSecondClock();

const CinemaClock =  () => {
  const [time, setTime] = useState<any>({ hours: '', minutes: '' });

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'mult',
      fontUrl,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
      updateClock();
    }, [time]);

  const fontFace = `
    @font-face {
      font-family: 'mult';
      src: url(${fontUrl}) format('truetype');
    }
  `;

  const styles = {
    htmlBody: {
      margin: 0,
      padding: 0,
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontFamily: 'mult, monospace',
    },
    clock: {
      position: 'absolute',
      top: '32vh',
      color: 'rgb(137, 3, 3)',
      fontSize: '2.1rem',
      letterSpacing: '0.5rem',
      textTransform: 'uppercase',
      zIndex: 2,
    },
    bgImage: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'contrast(100%)',
      zIndex: 1,
      pointerEvents: 'none',
    },
  };

  return (
    <div style={styles.htmlBody}>
      <style>{fontFace}</style>
      <div style={styles.bgImage} />
      <div style={styles.clock}>
        {time.hours}
        {time.minutes}
      </div>
    </div>
  );
};

export default CinemaClock;
