import React from 'react';
import westVideo from '../../../assets/images/26-03/26-03-01/west.mp4';

const Clock = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          bottom: '0',
          left: '-53%',
          width: '180%',
          height: 'auto',
          minHeight: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'hue-rotate(-20deg) saturate(1.8) brightness(1.1)'
        }}
      >
        <source src={westVideo} type="video/mp4" />
      </video>
      
      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        color: '#fff',
        fontSize: '4rem',
        fontFamily: 'monospace',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '20px 40px',
        borderRadius: '10px'
      }}>
   srthewt
      </div>
    </div>
  );
};

export default Clock;
