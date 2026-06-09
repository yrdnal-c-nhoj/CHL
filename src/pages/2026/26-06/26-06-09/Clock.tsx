import vegasFont from '@/assets/fonts/25fonts/25-07-05-vegas.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

const GARISH_COLORS = [
  '#FF00FF', // Neon Magenta
  '#39FF14', // Neon Green
  '#FFFB00', // Neon Yellow
  '#00FFFF', // Cyan
  '#FF3131', // Neon Red
  '#FF5E00', // Neon Orange
];

const TREVI_IFRAME_URL = 'https://embed.skylinewebcams.com/en/webcam/286.html';
// Some environments block iframe rendering; provide a direct image fallback.
const TREVI_FALLBACK_IMG_URL = 'https://embed.skylinewebcams.com/img/286.jpg';

const Clock: React.FC = () => {

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'VegasFont',
        fontUrl: vegasFont,
        options: { weight: 'normal', style: 'normal' },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  // Full-screen, non-interactive background embed
  const iframeStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    pointerEvents: 'none',
    background: '#000',
  };

  const fallbackImgStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -2,
    objectFit: 'cover',
    pointerEvents: 'none',
    background: '#000',
  };


  const clockContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    display: 'flex',
    gap: '0.4rem',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  const digitBoxStyle = (color: string): React.CSSProperties => ({
    width: '0.9em',
    height: '1.4em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    fontFamily:
      'VegasFont, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 'clamp(2rem, 19vw, 4rem)',
  });

  const getTwo = (n: number) => String(n).padStart(2, '0');

  const time = useSecondClock();
  const timeStr = `${getTwo(time.getHours())}:${getTwo(time.getMinutes())}:${getTwo(time.getSeconds())}`;

  return (
    <>
      <div style={iframeStyle}>
        <iframe
          title="Trevi Fountain - SkylineWebcams"
          src={TREVI_IFRAME_URL}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <img
        src={TREVI_FALLBACK_IMG_URL}
        alt="Trevi Fountain webcam fallback"
        style={fallbackImgStyle}
        // If iframe works, this sits underneath due to z-index.
      />


      <div style={clockContainerStyle} aria-label={timeStr}>
        {timeStr.split('').map((char, i) => (
          <div
            key={i}
            style={digitBoxStyle(GARISH_COLORS[i % GARISH_COLORS.length])}
          >
            {char}
          </div>
        ))}
      </div>
    </>
  );
};

export default Clock;

