import React from 'react';
import paperflowerVideo from '../../../assets/images/26-03/26-03-02/paperflower.mp4';

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
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1
        }}
      >
        <source src={paperflowerVideo} type="video/mp4" />
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
        ;lkjhgftghj
      </div>
    </div>
  );
};

export default Clock;
