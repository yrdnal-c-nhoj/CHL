import React from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import bgVideo from '../../../assets/images/26-03/26-03-28/water.mp4';
import bgImage from '../../../assets/images/26-03/26-03-28/h2o.webp';
import clockFont from '../../../assets/fonts/26-03-28-h2o.ttf';

const Clock: React.FC = () => {
  const time = useMillisecondClock();

  // Load custom font
  const fontConfigs = [
    {
      fontFamily: 'H2OClock',
      fontUrl: clockFont,
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const fontFamily = fontsLoaded ? 'H2OClock, monospace' : 'monospace';

  const digitBoxStyle = {
    width: '14vw',
    height: '5vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '1px solid #00ff41',
    color: '#00ff41',
    fontSize: '22.5vw',
    fontFamily,
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 10px #00ff41, 0 0 20px #00ff41',
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds();
  const msTens = Math.floor(ms / 100).toString();
  const msOnes = Math.floor((ms % 100) / 10).toString();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {/* Video background - bottom layer */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
          filter: 'saturate(3) brightness(1.5)',
          transform: 'rotate(180deg)',
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Image overlay - top layer */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          filter: 'saturate(3) brightness(1.5) hue-rotate(180deg) contrast(2.2)',
        }}
      />

      {/* Image overlay - flipped 180° horizontally */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 2,
          filter: 'saturate(3) brightness(1.5) hue-rotate(180deg) contrast(2.2)',
          transform: 'scaleX(-1)',
        }}
      />

      {/* Clock display */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3,
          gap: '0.25rem',
        }}
      >
        {/* Hours */}
        <div style={digitBoxStyle}>{hours[0]}</div>
        <div style={digitBoxStyle}>{hours[1]}</div>
        {/* Minutes */}
        <div style={digitBoxStyle}>{minutes[0]}</div>
        <div style={digitBoxStyle}>{minutes[1]}</div>
        {/* Seconds */}
        <div style={digitBoxStyle}>{seconds[0]}</div>
        <div style={digitBoxStyle}>{seconds[1]}</div>
        <div style={digitBoxStyle}>{msTens}</div>
        <div style={digitBoxStyle}>{msOnes}</div>
      </div>
    </div>
  );
};

export default Clock;
