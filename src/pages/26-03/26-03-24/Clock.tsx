import React, { useState, useEffect } from 'react';
import type { ClockTime } from '@/types/clock';

const Clock: React.FC = () => {
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
      <div>26-03-24</div>
    </div>
  );
};

export default Clock;
