import React from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import bgVideo from '../../../assets/images/26-03/26-03-29/sunrise.mp4';
import borderImage from '../../../assets/images/26-03/26-03-29/horse.webp';

const Clock: React.FC = () => {
  const time = useSecondClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const borderSize = '75px';
  const borderColor = 'rgba(255, 179, 0, 0.52)';
  const borderFilter = ' contrast(1.3) brightness(0.9)';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', background: '#000' }}>
      {/* Video background */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
          filter: 'saturate(1.5) brightness(1.4) contrast(0.5) hue-rotate(9deg)',
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* 1. TOP BORDER - Upside down */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: borderSize,
        backgroundImage: `linear-gradient(${borderColor}, ${borderColor}), url(${borderImage})`,
        backgroundSize: `auto ${borderSize}`,
        backgroundRepeat: 'repeat-x', transform: 'rotate(180deg)', zIndex: 10,
        filter: borderFilter,
      }} />

      {/* 2. BOTTOM BORDER - Right side up */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100vw', height: borderSize,
        backgroundImage: `linear-gradient(${borderColor}, ${borderColor}), url(${borderImage})`,
        backgroundSize: `auto ${borderSize}`,
        backgroundRepeat: 'repeat-x', zIndex: 10,
        filter: borderFilter,
      }} />

      {/* 3. LEFT BORDER - Spun 90° Clockwise */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: borderSize, 
        width: '100dvh',
        height: borderSize,
        backgroundImage: `linear-gradient(${borderColor}, ${borderColor}), url(${borderImage})`,
        backgroundSize: `auto ${borderSize}`,
        backgroundRepeat: 'repeat-x',
        transformOrigin: 'top left',
        transform: 'rotate(90deg)',
        zIndex: 10,
        filter: borderFilter,
      }} />

      {/* 4. RIGHT BORDER - Spun 90° Counter-Clockwise (-90deg) */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: borderSize,
        width: '100dvh',
        height: borderSize,
        backgroundImage: `linear-gradient(${borderColor}, ${borderColor}), url(${borderImage})`,
        backgroundSize: `auto ${borderSize}`,
        backgroundRepeat: 'repeat-x',
        transformOrigin: 'top right',
        transform: 'rotate(-90deg)',
        zIndex: 10,
        filter: borderFilter,
      }} />

      {/* Clock display */}
      <div style={{
        position: 'absolute', inset: borderSize,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
      }}>
        <div style={{
          color: '#fff', fontSize: '5rem', fontFamily: 'monospace',
          textShadow: '2px 2px 10px rgba(0,0,0,1)',
        }}>
          {hours}:{minutes}:{seconds}
        </div>
      </div>
    </div>
  );
};

export default Clock;