import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import bgImage from '../../../../assets/images/2026/26-04/26-04-25/magnify.jpg';

const LabClock: React.FC = () => {
  const time = useClockTime();

  const angles = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const ms = time.getMilliseconds();

    const secondsWithMs = s + ms / 1000;

    return {
      hour: ((h % 12) + m / 60) * 30,
      minute: (m + s / 60) * 6,
      second: secondsWithMs * 6,
    };
  }, [time]);

  // Shared styles for the hands
  const handBaseStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '3px',
    willChange: 'transform',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      position: 'relative'
    }}>
      {/* Fixed-size background image */}
      <img
        src={bgImage}
        alt=""
        style={{
          position: 'absolute',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          filter: 'brightness(1.0) contrast(0.8)'
        }}
      />
      {/* Clock Face Container */}
      <div style={{
        position: 'relative',
        width: '116px',
        height: '116px',
        marginLeft: '16px',
        marginTop: '5px',
        borderRadius: '50%',
        opacity: 0.3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        
        {/* Tick Marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '100%',
              left: 'calc(50% - 1.5px)',
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <div style={{
              width: '100%',
              height: '3%',
              backgroundColor: '#212629',
              borderRadius: '2px'
            }} />
          </div>
        ))}

        {/* Hour Hand */}
        <div style={{
          ...handBaseStyle,
          width: '3px',
          height: '35px',
          backgroundColor: '#65788B',
          marginLeft: '-1.5px', 
          transform: `rotate(${angles.hour}deg)`,
          zIndex: 3,
        }} />

        {/* Minute Hand */}
        <div style={{
          ...handBaseStyle,
          width: '2.5px',
          height: '58px',
          backgroundColor: '#5887B3',
          marginLeft: '-1.25px',
          transform: `rotate(${angles.minute}deg)`,
          zIndex: 4,
        }} />

        {/* Second Hand */}
        <div style={{
          ...handBaseStyle,
          width: '2px',
          height: '58px',
          backgroundColor: '#E74D3C92',
          marginLeft: '-1px',
          transform: `rotate(${angles.second}deg)`,
          zIndex: 5,
        }} />

        {/* Center Dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '7px',
          height: '7px',
          backgroundColor: '#2c3e50',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid white',
          zIndex: 10
        }} />
      </div>
    </div>
  );
};

export default LabClock;