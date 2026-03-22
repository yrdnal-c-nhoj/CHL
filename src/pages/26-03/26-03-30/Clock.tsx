import React, { useState, useEffect } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';

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
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '4rem',
        fontFamily: 'monospace',
      }}
    >
      <div>{hours}:{minutes}:{seconds}</div>
    </div>
  );
};

export default Clock;
