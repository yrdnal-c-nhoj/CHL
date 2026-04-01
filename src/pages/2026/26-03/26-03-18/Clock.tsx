import React, { useEffect, useRef, useMemo } from 'react';
import walkVideo from '@/assets/images/2026/26-03/26-03-18/walk.mp4';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import walkFont from '@/assets/fonts/2026/26-03-18-walk.ttf?url';

const Clock: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const time = useMillisecondClock();
  
  const hollywoodGold = '#FFD700';
  const vintageRose = '#FF69B4';
  const champagne = '#FFFACD';
  const silver = '#C0C0C0';
  const neonPink = '#F2A280';
  
  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'walk',
      fontUrl: walkFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }], []);

  useSuspenseFontLoader(fontConfigs);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const clockSize = isMobile ? 300 : 500;
  const numberSize = isMobile ? '10vh' : '12vh';
  const handScale = isMobile ? 0.7 : 1;

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(error => console.log('Autoplay blocked:', error));
    }
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <>
      <style>
        {`
          .neon-glow {
            text-shadow: 
              0 0 10px ${hollywoodGold},
              0 0 20px ${vintageRose},
              0 0 30px ${champagne},
              0 0 40px ${silver},
              0 0 50px ${neonPink},
              0 2px 4px rgba(0,0,0,0.8);
          }

          .starburst {
            position: absolute;
            width: 4500px;
            height: 4500px;
            background: repeating-conic-gradient(
              from 0deg,
              rgba(255, 215, 0, 0.4) 0deg 15deg,
              rgba(255, 105, 180, 0.3) 15deg 30deg
            );
            border-radius: 50%;
            animation: rotate 60s linear infinite;
            filter: blur(2px);
          }

          @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(360deg); }
            to { transform: translate(-50%, -50%) rotate(0deg); }
          }

          @keyframes hollywoodPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }

          .hollywood-glow {
            animation: hollywoodPulse 3s ease-in-out infinite;
          }
        `}
      </style>
      
      <video
        ref={videoRef}
        loop muted playsInline preload="auto"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          objectFit: 'cover', filter: 'contrast(140%) brightness(120%)',
        }}
      >
        <source src={walkVideo} type="video/mp4" />
      </video>

      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${clockSize}px`, height: `${clockSize}px`,
          zIndex: 2,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}
      >
        <div className="starburst" style={{ top: '50%', left: '50%' }} />

        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = i * 30;
          const radius = clockSize * 0.42; 
          const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
          const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
          
          return (
            <div
              key={num}
              className="neon-glow"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: numberSize,
                color: champagne,
                fontFamily: 'walk, serif',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                letterSpacing: '-2px',
                transformOrigin: 'center center',
              }}
            >
              {num}
            </div>
          );
        })}

        <div className="hollywood-glow" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${8 * handScale}px`, height: `${100 * handScale}px`,
          background: `linear-gradient(to top, ${hollywoodGold}, ${champagne})`,
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          transformOrigin: 'bottom center',
          borderRadius: `${10 * handScale}px ${10 * handScale}px 0 0`,
          boxShadow: `
            0 0 10px ${hollywoodGold},
            0 0 20px ${vintageRose},
            2px 2px 10px rgba(0,0,0,0.5)
          `
        }} />

        <div className="hollywood-glow" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${4 * handScale}px`, height: `${140 * handScale}px`,
          background: `linear-gradient(to top, ${silver}, ${champagne})`,
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          transformOrigin: 'bottom center',
          borderRadius: `${10 * handScale}px`,
          boxShadow: `
            0 0 8px ${silver},
            0 0 15px ${vintageRose},
            2px 2px 10px rgba(0,0,0,0.5)
          `
        }} />

        <div className="hollywood-glow" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${2 * handScale}px`, height: `${160 * handScale}px`,
          background: `linear-gradient(to top, ${neonPink}, ${vintageRose})`,
          transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
          transformOrigin: 'bottom center',
          boxShadow: `
            0 0 15px ${neonPink},
            0 0 30px ${vintageRose},
            0 0 45px ${hollywoodGold}
          `,
        }} />

        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${60 * handScale}px`, height: `${60 * handScale}px`,
          backgroundColor: '#FFD700',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          transform: 'translate(-50%, -50%)',
          filter: `drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 30px rgba(0,0,0,0.9))`,
          zIndex: 10
        }} />
      </div>
    </>
  );
};

export default Clock;