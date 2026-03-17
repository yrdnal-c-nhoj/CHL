import React, { useMemo } from 'react'
import { useClock } from '../../../hooks/useClock'
import { useMultipleFontLoader } from '../../../utils/fontLoader'
import bgImage from '../../../assets/images/25-12/25-12-13/roc.webp' 
import fontFile from '../../../assets/fonts/25-12-13-cherub.ttf?url'; 

// --- Configuration ---
const CONFIG = {
  fontFamily: 'RococoFont',
  bgImage: bgImage,
  // Animation tweaks
  minDuration: 8,
  maxDuration: 14,
  floatIntensityX: 3, // vw
  floatIntensityY: 4, // vh
  rotateIntensity: 15, // deg
};

// --- Helper: Generate consistent random config for digits ---
const generateDigitConfig = (index) => ({
  duration: CONFIG.minDuration + Math.random() * (CONFIG.maxDuration - CONFIG.minDuration), 
  delay: Math.random() * -10,
  rangeX: 2 + Math.random() * CONFIG.floatIntensityX, 
  rangeY: 3 + Math.random() * CONFIG.floatIntensityY,
  rotate: 5 + Math.random() * CONFIG.rotateIntensity,
  scale: 1.05 + Math.random() * 0.1
});

export default function RococoClock() {
  // 1. Standardized Hooks
  const { now } = useClock(1000);
  
  // 2. Standardized Font Loading
  const fontsLoaded = useMultipleFontLoader(useMemo(() => [{
    fontFamily: CONFIG.fontFamily,
    fontUrl: fontFile,
    options: { display: 'swap' }
  }], []));

  // 3. Memoized Calculations
  const digitConfigs = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => generateDigitConfig(i));
  }, []); // Run once on mount

  // Time processing
  const hours = now.getHours();
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const hourDigits = displayHours.toString().split('');
  const minuteDigits = now.getMinutes().toString().padStart(2, '0').split('');
  const ampmDigits = (hours >= 12 ? 'pm' : 'am').split('');
  const allChars = [...hourDigits, ...minuteDigits, ...ampmDigits];

  return (
    <div style={{ ...containerStyle, opacity: fontsLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      {/* In a pure CSS Module world, this <style> would be in a .module.css file */}
      <style>
        {`
          @keyframes rococoFloat {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
            }
            33% {
              transform: translate(var(--rx), var(--ry)) rotate(var(--rot)) scale(var(--sc)); 
            }
            66% {
              transform: translate(calc(var(--rx) * -0.8), calc(var(--ry) * 1.2)) rotate(calc(var(--rot) * -0.5)) scale(0.95); 
            }
          }
        `}
      </style>

      <div style={rowStyle}>
        {allChars.map((char, i) => {
          const config = digitConfigs[i];
          
          // Dynamic styling logic that handles single-digit hours (5 chars) vs double (6 chars)
          const isAmpm = i >= allChars.length - 2;
          const isHour = i < hourDigits.length;
          const fontSize = isAmpm ? 'clamp(4rem, 8vh, 12vh)' : 'clamp(6rem, 15vh, 25vh)';
          const zIndex = isHour ? 30 : isAmpm ? 5 : 15;

          return (
            <div
              key={i}
              style={{
                ...baseDigitStyle,
                fontFamily: fontsLoaded ? `'${CONFIG.fontFamily}', serif` : 'serif',
                fontSize: fontSize,
                // Using a "slow-in, slow-out" bezier curve for gracefulness
                animation: `rococoFloat ${config.duration}s infinite cubic-bezier(0.45, 0, 0.55, 1)`,
                animationDelay: `${config.delay}s`,
                '--rx': `${config.rangeX}vw`,
                '--ry': `${config.rangeY}vh`,
                '--rot': `${config.rotate}deg`,
                '--sc': config.scale,
                zIndex: zIndex,
                // Soft entry to avoid a "pop" on load
                opacity: fontsLoaded ? 1 : 0,
                transition: 'opacity 2s ease-in'
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const containerStyle = {
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // Centered looks more graceful on various screen sizes
  backgroundImage: `url(${CONFIG.bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#000',
  overflow: 'hidden',
  position: 'relative'
}

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap', // Allows digits to stack elegantly on very narrow phones
  justifyContent: 'center',
  alignItems: 'center',
  width: '90%',
  gap: '1rem'
}

const baseDigitStyle = {
  display: 'inline-block',
  color: '#DCD0AD',
  textAlign: 'center',
  pointerEvents: 'none', // Prevents interaction from breaking the immersion
  textShadow: `
    0 0 10px rgb(251, 249, 249),
    0.2vh 0.2vh 0.4vh rgba(100, 9, 58, 0.63),
    -0.2vh -0.2vh 0.4vh rgba(50, 205, 50, 0.45)
  `,
  willChange: 'transform' // Optimizes performance for constant motion
}