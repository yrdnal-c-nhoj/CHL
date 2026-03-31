import React, { useMemo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import origamiFont from '../../../assets/fonts/26-03-30-origami.ttf';
import craneImg from '../../../assets/images/26-03/26-03-30/crane.webp';

const LETTERS = ['b', 'f', 'c', 'j', 'i', 'n', 'q', 's', 'u', 'w'];

// Sub-component memoized to prevent digit re-renders
const Digit = React.memo(({ char }: { char: string }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    // Added "Box" styling
    background: 'rgba(255, 255, 255, 0.92)',
    // padding: '10px',
    minWidth: '14vw',
    aspectRatio: '1/1'
  }}>
    <span style={{ 
      fontSize: 'clamp(2rem, 16vw, 10rem)', // Adjusted for smaller boxes
      color: '#ED0F1E', 
      fontFamily: 'OrigamiFont, sans-serif',
      textShadow: '0 0 20px rgb(0, 0, 0)' 
    }}>
      {char}
    </span>
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
    <div style={{
      width: '100vw', height: '100dvh', position: 'relative',
      overflow: 'hidden', backgroundColor: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Tiled crane background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: `url(${craneImg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '8vw 8vw',
        backgroundPosition: 'center',
        filter: 'saturate(0.4) contrast(1.8) brightness(2.9)'
      }} />
      {/* Responsive Clock Container */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        display: 'grid',
        placeItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 'auto',
        // Default (Mobile): 2 columns
        gridTemplateColumns: 'repeat(2, 1fr)', 
        // gap: '15px',
        padding: '20px',
        maxWidth: '90vw'
      }} className="clock-grid">
        {displayTime.map((char, i) => (
          <Digit key={`${i}-${char}`} char={char} />
        ))}

        {/* CSS-in-JS "Media Query" approach */}
        <style>{`
          @media (max-width: 767px) {
            .clock-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .clock-grid > * {
              min-width: 35vw !important;
            }
            .clock-grid span {
              font-size: clamp(3rem, 30vw, 10rem) !important;
            }
          }
          @media (min-width: 768px) {
            .clock-grid {
              grid-template-columns: repeat(6, 1fr) !important;
              gap: 2vw !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Clock;