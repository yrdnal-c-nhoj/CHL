import React, { useEffect, useRef } from 'react';
import cocteauVideo from '../../../assets/images/26-03/26-03-12/vr.mp4';
import { useSecondClock } from '../../../utils/useSmoothClock';

const VirtualClock: React.FC = () => {
  const time = useSecondClock();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay blocked by browser/battery saver:', err);
      });
    }
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          html, body {
            margin: 0;
            padding: 0;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        * {
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
        }
      `}</style>

      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100dvh',
          objectFit: 'fill',
          opacity: 1.0,
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={cocteauVideo} type="video/mp4" />
      </video>

      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: 'min(120px, 15vw)',
          height: 'min(120px, 15vw)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,200,0.15) 0%, rgba(255,255,150,0.1) 50%, rgba(200,255,200,0.08) 100%)',
            border: '2px solid rgba(255,255,255,0.25)',
            filter: 'blur(2px) brightness(1.1)',
            boxShadow:
              '0 0 20px rgba(255,255,200,0.2), inset 0 0 15px rgba(200,255,200,0.15)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3px',
            height: '30%',
            background: 'rgba(255,255,255,0.5)',
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            transformOrigin: 'center bottom',
            filter: 'blur(1.5px)',
            boxShadow: '0 0 8px rgba(255,255,255,0.4)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2px',
            height: '40%',
            background: 'rgba(255,255,255,0.5)',
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            transformOrigin: 'center bottom',
            filter: 'blur(1.5px)',
            boxShadow: '0 0 8px rgba(255,255,255,0.4)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1px',
            height: '45%',
            background: 'rgba(200,255,200,0.4)',
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            transformOrigin: 'center bottom',
            filter: 'blur(1px)',
            boxShadow: '0 0 5px rgba(200,255,200,0.3)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            background: 'rgba(255,255,200,0.6)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(1.5px)',
            boxShadow: '0 0 8px rgba(255,255,200,0.5)',
          }}
        />

        <style>{`
          @keyframes tick {
            0%, 100% { transform: translate(-50%, -100%) rotate(${secondAngle}deg); }
            50% { transform: translate(-50%, -100%) rotate(${secondAngle}deg) scale(1.05); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default VirtualClock;
