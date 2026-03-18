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
      <div style={{ textAlign: 'center' }}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/z7SiAaN4ogw?si=KQFExjF1XdBeDv8g&controls=0&autoplay=1&mute=1&loop=1&playlist=z7SiAaN4ogw"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            maxWidth: '90vw',
            maxHeight: '70vh',
            border: 'none',
          }}
        />
        <div style={{ marginTop: '2rem' }}>26-03-15</div>
      </div>
    </div>
  );
};

export default Clock;
