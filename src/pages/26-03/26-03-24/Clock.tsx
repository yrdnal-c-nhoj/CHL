import React, { useState, useEffect } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import bgImage from '../../../assets/images/26-03/26-03-24/blakstar.webp?url';

const Clock: React.FC = () => {
  const time = useSecondClock();
  
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url(${bgImage}) center/cover no-repeat`,
        color: '#fff',
        fontSize: '4rem',
        fontFamily: 'monospace',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
      }}
    >
      <div>{hours}:{minutes}:{seconds}</div>
    </div>
  );
};

export default Clock;
