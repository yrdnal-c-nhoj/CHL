import React from 'react';
import { useMillisecondClock } from '../../../../utils/useSmoothClock';
import digitalBgImage from '../../../../assets/images/2026/26-02/26-02-02/boom.webp';

const SonicBoomClock: React.FC = () => {
  const time = useMillisecondClock();

  const timeString =
    time.getHours().toString().padStart(2, '0') +
    time.getMinutes().toString().padStart(2, '0') +
    time.getSeconds().toString().padStart(2, '0') +
    Math.floor(time.getMilliseconds() / 100).toString();

  const digits = timeString.split('');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#5669C8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${digitalBgImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          filter: 'contrast(1.5) saturate(2.5)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          fontFamily: `"Syne Mono", monospace`,
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {digits.map((digit: string, index: number) => {
          const reverseIndex = digits.length - index - 1; 
          const fontSize = 40 + reverseIndex * -4.5; 
          const opacity = Math.max(1.0 - reverseIndex * 0.15, 0.3);

          return (
            <span
              key={index}
              style={{
                fontSize: `${fontSize}vmin`,
                opacity,
                color: '#D0D6F2',
                textShadow: '0 0 15px rgba(10, 63, 240, 0.4)',
                letterSpacing: '-0.1em',
                display: 'inline-block',
                marginLeft: index > 0 ? '-0.2em' : '0',
              }}
            >
              {digit}
            </span>
          );
        })}
      </div>

      <style>{`body { margin: 0; background: black; }`}</style>
    </div>
  );
};

export default SonicBoomClock;
