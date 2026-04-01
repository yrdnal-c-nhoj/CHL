import React, { useEffect, useState, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import digi251103font from '../../../../assets/fonts/25-11-03-bin3.ttf?url';
import tec251103font from '../../../../assets/fonts/25-11-03-bin1.otf?url';

const digitalFont = 'digitalFont';
const techFont = 'techFont';

export default function BinaryClockWithColumns() {
  const fontConfigs = useMemo(() => [
    { fontFamily: digitalFont, fontUrl: digi251103font, options: { weight: 'normal', style: 'normal' } },
    { fontFamily: techFont, fontUrl: tec251103font, options: { weight: 'normal', style: 'normal' } }
  ], []);

  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const [time, setTime] = useState(new Date());
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Fade out overlay once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setOverlayVisible(false), 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  const formatBinary = (num: number) => num.toString(2).padStart(8, '0').split('');

  // --- Static Styles (Memoized to prevent object recreation) ---
  const styles = useMemo(() => ({
    container: {
      position: 'relative' as const,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100svh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    columnsWrapper: {
      display: 'flex',
      flexDirection: 'row' as const,
      width: '100%',
      height: '100%',
    },
    column: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      height: '100%',
    },
    binaryContainer: {
      display: 'flex',
      flexDirection: 'column-reverse' as const,
      flex: 1,
    },
    digitBox: {
      height: '12vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '8vh',
      fontFamily: digitalFont,
      color: '#F713DC',
      backgroundColor: '#024236',
      borderTop: '2px solid #000',
    }
  }), []);

  const getBitStyle = (bit: string) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '6vh',
    fontFamily: techFont,
    color: bit === '1' ? '#F6F2F2' : '#020202',
    backgroundColor: bit === '1' ? '#1100CC' : '#EFFA26',
    transition: 'background-color 0.2s ease, color 0.2s ease', // Smooth but fast
  });

  const renderColumn = (val: number) => {
    const bits = formatBinary(val);
    return (
      <div style={styles.column}>
        <div style={styles.binaryContainer}>
          {bits.map((bit, idx) => (
            <div key={idx} style={getBitStyle(bit)}>
              {bit}
            </div>
          ))}
        </div>
        <div style={styles.digitBox}>
          {val.toString().padStart(2, '0')}
        </div>
      </div>
    );
  };

  const ms = Math.floor(time.getMilliseconds() / 10);

  return (
    <div style={styles.container}>
      {/* Loading Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000',
          opacity: overlayVisible ? 1 : 0,
          transition: 'opacity 600ms ease-in-out',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />

      <div style={styles.columnsWrapper}>
        {renderColumn(time.getHours())}
        {renderColumn(time.getMinutes())}
        {renderColumn(time.getSeconds())}
        {renderColumn(ms)}
      </div>
    </div>
  );
}