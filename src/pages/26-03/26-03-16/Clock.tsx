import React, { useState, useEffect } from 'react';
import bgImage from '../../../assets/images/26-03/26-03-16/metrop.webp'; // keep your background if desired, or replace with solid color

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

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

  // Responsive sizing based on viewport with better mobile handling
  const getClockSize = () => {
    if (typeof window === 'undefined') return 380;
    
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const isMobile = vw <= 480;
    const isSmallScreen = vw <= 768;
    
    if (isMobile) {
      return Math.min(vw * 0.9, 320); // Use 90% of width on mobile, max 320px
    } else if (isSmallScreen) {
      return Math.min(vw * 0.7, 350); // Use 70% on small screens
    } else {
      return Math.min(vw * 0.8, 420); // Use 80% on desktop, max 420px
    }
  };

  const clockSize = getClockSize();

  // Mobile-specific adjustments for better centering
  const mobileAdjustments = {
    padding: typeof window !== 'undefined' && window.innerWidth <= 480 ? '15px' : '0px',
    transform: typeof window !== 'undefined' && window.innerWidth <= 480 ? 'scale(0.9)' : 'scale(1)',
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000', // stark industrial black
        backgroundImage: `url(${bgImage})`, // optional — consider removing or using a very dark/gray industrial photo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif', // clean sans-serif fallback
        padding: mobileAdjustments.padding,
      }}
    >
      {/* Main clock face — responsive size with mobile adjustments */}
      <div
        style={{
          width: `${clockSize}px`,
          height: `${clockSize}px`,
          position: 'relative',
          borderRadius: '50%',
          transform: mobileAdjustments.transform,
        }}
      >
        {/* Minimal hour markers — simple white bars, longer at cardinals */}
        {[...Array(12)].map((_, i) => {
          const isCardinal = i % 3 === 0;
          const markerWidth = isCardinal ? clockSize * 0.011 : clockSize * 0.005;
          const markerHeight = isCardinal ? clockSize * 0.074 : clockSize * 0.037;
          const markerTop = clockSize * 0.053;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${markerWidth}px`,
                height: `${markerHeight}px`,
                backgroundColor: '#eee', // off-white for high contrast
                top: `${markerTop}px`,
                left: '50%',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: '50% 160px',
              }}
            />
          );
        })}

        {/* Minute tick marks — small lines between hour markers */}
        {[...Array(60)].map((_, i) => {
          // Skip positions where hour markers already exist
          if (i % 5 === 0) return null;

          const tickWidth = clockSize * 0.003;
          const tickHeight = clockSize * 0.021;
          const tickTop = clockSize * 0.066;

          return (
            <div
              key={`tick-${i}`}
              style={{
                position: 'absolute',
                width: `${tickWidth}px`,
                height: `${tickHeight}px`,
                backgroundColor: '#aaa', // lighter gray for minute marks
                top: `${tickTop}px`,
                left: '50%',
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
                transformOrigin: '50% 165px',
              }}
            />
          );
        })}

        {/* Hands — pure geometry, no gradients, no clip-path tricks */}
        {/* Hour hand — short, broad, rectangular with slight taper */}
        <div
          style={{
            position: 'absolute',
            width: `${clockSize * 0.042}px`,
            height: `${clockSize * 0.211}px`,
            backgroundColor: '#eee',
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            borderRadius: `${clockSize * 0.021}px ${clockSize * 0.021}px ${clockSize * 0.005}px ${clockSize * 0.005}px`,
          }}
        />
        {/* Minute hand — longer, thinner */}
        <div
          style={{
            position: 'absolute',
            width: `${clockSize * 0.026}px`,
            height: `${clockSize * 0.342}px`,
            backgroundColor: '#eee',
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            borderRadius: `${clockSize * 0.013}px ${clockSize * 0.013}px ${clockSize * 0.003}px ${clockSize * 0.003}px`,
          }}
        />
        {/* Second hand — very thin, red accent (common in functionalist designs for visibility) */}
        <div
          style={{
            position: 'absolute',
            width: `${clockSize * 0.008}px`,
            height: `${clockSize * 0.421}px`,
            backgroundColor: '#DA4008', // Bauhaus often used primary red accents
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
            transition: 'transform 0.05s linear', // smooth but mechanical feel
          }}
        >
          {/* Tiny counterbalance circle — functional, not decorative */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-3.5px',
              width: '1px',
              height: '1px',
              backgroundColor: '#c00',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Center pivot — simple chrome-like industrial bolt */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: '#222',
            // border: '2px solid #555', // steel/chrome look
            borderRadius: '50%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default Clock;
