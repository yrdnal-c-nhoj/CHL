import React, { useEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import futurBg from '@/assets/images/2026/26-02/26-02-24/futur.jpg';

interface Position {
  top: string;
  left: string;
  rotate: string;
  fontSize: string;
  font: string;
}

const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Dancing+Script&family=Creepster&family=Oswald&family=Cinzel+Decorative&family=Metal+Mania&family=UnifrakturMaguntia&family=ZCOOL+KuaiLe&family=Press+Start+2P&family=Space+Mono&display=swap';

const POSITIONS: Position[] = [
  {
    top: '8%',
    left: '10%',
    rotate: '-15deg',
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    font: "'Dancing Script'",
  },
  {
    top: '25%',
    left: '22%',
    rotate: '30deg',
    fontSize: 'clamp(11rem, 44vw, 22rem)',
    font: "'Creepster'",
  },
  {
    top: '72%',
    left: '35%',
    rotate: '-18deg',
    fontSize: 'clamp(24rem, 64vw, 30rem)',
    font: "'Oswald'",
  },
  {
    top: '80%',
    left: '75%',
    rotate: '25deg',
    fontSize: 'clamp(2.5rem, 9vw, 7rem)',
    font: "'Oswald'",
  },
  {
    top: '15%',
    left: '75%',
    rotate: '-35deg',
    fontSize: 'clamp(5rem, 16vw, 12rem)',
    font: "'Cinzel Decorative'",
  },
  {
    top: '40%',
    left: '80%',
    rotate: '44deg',
    fontSize: 'clamp(7.5rem, 31vw, 12rem)',
    font: "'Metal Mania'",
  },
];

const ImageDisplay = () => {
  const time = useClockTime();

  // Professional Practice: Use standardized font loading pipeline
  useEffect(() => {
    const link = document.createElement('link');
    link.href = GOOGLE_FONTS_URL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Accessibility: Update time string for screen readers
  const ariaTime = useMemo(() => 
    time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    [time.getHours(), time.getMinutes()]
  );

  const { amPm, digits } = useMemo(() => {
    const rawHours = time.getHours();
    const amPm = rawHours >= 12 ? 'PM' : 'AM';
    const displayHours = (rawHours % 12 || 12).toString().padStart(2, '0');
    const displayMinutes = time.getMinutes().toString().padStart(2, '0');
    const displaySeconds = time.getSeconds().toString().padStart(2, '0');

    // Array of exactly 6 digits: [H, H, M, M, S, S]
    const digits = [
      ...displayHours.split(''),
      ...displayMinutes.split(''),
      ...displaySeconds.split(''),
    ];
    return { amPm, digits };
  }, [time]);

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div style={redOverlayStyle} />

      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
        }}
      >
        {ariaTime}
      </div>

      {digits.map((char, index) => (
        <div
          key={`${index}-${char}`}
          style={{
            ...digitBox,
            position: 'absolute',
            top: POSITIONS[index].top,
            left: POSITIONS[index].left,
            transform: `translate(-50%, -50%) rotate(${POSITIONS[index].rotate})`,
            fontFamily: `${POSITIONS[index].font}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`,
            fontSize: POSITIONS[index].fontSize,
            zIndex: 10,
          }}
        >
          {char}
        </div>
      ))}

      <div
        style={{
          ...amPmStyle,
          bottom: '20%',
          right: '5%',
          fontSize: '15vw',
          transform: 'rotate(-50deg)',
          display: 'flex',
          gap: '0.1em',
        }}
      >
        {amPm[0].split('').map((letter, index) => (
          <span
            key={index}
            style={{
              fontFamily: index === 0 
                ? '"UnifrakturMaguntia", cursive, serif'
                : '"ZCOOL KuaiLe", cursive, sans-serif',
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div
        style={{
          ...amPmStyle,
          bottom: '10%',
          right: '10%',
          fontSize: '4vw',
          transform: 'rotate(10deg)',
          display: 'flex',
          gap: '0.1em',
        }}
      >
        {amPm.split('').map((letter, index) => (
          <span
            key={index}
            style={{
              fontFamily: index === 0 
                ? '"Press Start 2P", cursive, monospace'
                : '"Space Mono", monospace, sans-serif',
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const backgroundStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${futurBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'brightness(2.5) contrast(0.6) grayscale(1)',
  zIndex: 0,
};

const redOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(249, 9, 9, 0.7)',
  mixBlendMode: 'multiply', // Creates a professional "printed" look
  zIndex: 1,
};

const digitBox: React.CSSProperties = {
  color: 'black',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: 0.8,
  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Adds a tiny "bounce" to number changes
};

const amPmStyle: React.CSSProperties = {
  position: 'absolute',
  color: 'black',
  zIndex: 10,
};

export default ImageDisplay;
