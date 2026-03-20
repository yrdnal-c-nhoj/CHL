import React, { useEffect, useRef, useState } from 'react';
import walkVideo from '../../../assets/images/26-03/26-03-18/walk.mp4';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import walkFont from '../../../assets/fonts/26-03-18-walk.ttf';

const Clock: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(new Date());
  
  // 1950s Color Palette
  const gold = '#0A9CD6';
  const champagne = '#FFFACD';
  const neonPink = '#F2A280'; // Subverted 50s neon accent
  
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'walk',
      fontUrl: walkFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  
  // Responsive sizing for perfect centering on all devices
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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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
          /* Font loading handled by useMultipleFontLoader */

          .neon-glow {
            text-shadow: 0 0 10px ${gold}, 0 0 20px ${gold}, 0 0 30px #ffa500;
          }

          .starburst {
            position: absolute;
            width: 4500px;
            height: 4500px;
            background: repeating-conic-gradient(
              from 0deg,
              rgba(255, 217, 0, 0.27) 0deg 15deg,
              transparent 15deg 30deg
            );
            border-radius: 50%;
            animation: rotate 60s linear infinite;
          }

          @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(360deg); }
            to { transform: translate(-50%, -50%) rotate(0deg); }
          }
        `}
      </style>
      
      {/* Background Video with Cinema Filter */}
      <video
        ref={videoRef}
        loop muted playsInline preload="auto"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          objectFit: 'cover', filter: 'sepia(20%) contrast(110%) brightness(80%)',
        }}
      >
        <source src={walkVideo} type="video/mp4" />
      </video>

      <div className="screen-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.1)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main Clock Container */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${clockSize}px`, height: `${clockSize}px`,
          zIndex: 2,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          opacity: 0.8,
        }}
      >
        {/* Decorative Starburst (Googie Style) */}
        <div className="starburst" style={{ top: '50%', left: '50%' }} />

        

        {/* Numbers */}
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

        {/* Clock Hands */}
        {/* Hour */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${8 * handScale}px`, height: `${100 * handScale}px`,
          background: `linear-gradient(to top, ${gold}, ${champagne})`,
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          transformOrigin: 'bottom center',
          borderRadius: `${10 * handScale}px ${10 * handScale}px 0 0`,
          boxShadow: '2px 2px 10px rgba(0,0,0,0.5)'
        }} />

        {/* Minute */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${4 * handScale}px`, height: `${140 * handScale}px`,
          background: champagne,
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          transformOrigin: 'bottom center',
          borderRadius: `${10 * handScale}px`,
          boxShadow: '2px 2px 10px rgba(0,0,0,0.5)'
        }} />

        {/* Second Hand - Styled like a spotlight beam */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${2 * handScale}px`, height: `${160 * handScale}px`,
          backgroundColor: neonPink,
          transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
          transformOrigin: 'bottom center',
          boxShadow: `0 0 10px ${neonPink}`,
        }} />

        {/* Center Cap (The "Star") */}
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