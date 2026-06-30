import mapFont from '@/assets/fonts/25fonts/25-05-05-Map.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Component Props interface
interface WarholGraveCamClockProps {
  // No props required for this component
}

const WarholGraveCamClock: React.FC<WarholGraveCamClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'MapFont',
        fontUrl: mapFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const time = useMemo(() => {
    const now = currentTime;
    return {
      hours: String(now.getHours()).padStart(2, '0'),
      minutes: String(now.getMinutes()).padStart(2, '0'),
      seconds: String(now.getSeconds()).padStart(2, '0'),
    };
  }, [currentTime]);

  const digitStyle = {
    color: '#ef1337',
    fontFamily: "'Map', sans-serif", // removed !important from inline style
    fontSize: '6rem',
    width: '3rem',
    height: '6rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '2rem',
    textAlign: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  return (
    <>
      <iframe
        src="https://www.youtube.com/embed/JHpJvvn9hvk?autoplay=1&mute=1"
        title="Live YouTube Stream"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100dvh',
          border: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2vmin',
        }}
      >
        {Object.values(time).map((unit, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5vmin' }}>
            {unit.split('').map((digit, j) => (
              <div key={j} className="digit" style={digitStyle}>
                {digit}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WarholGraveCamClock;
