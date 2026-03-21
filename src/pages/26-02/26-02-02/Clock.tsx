import React, { useEffect, useState } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import digitalBgImage from '../../../assets/images/26-02/26-02-02/boom.webp';

const FONT_NAME = 'Share Tech Mono';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';

interface DigitStyle {
  fontSize: string;
  opacity: number;
  color: string;
  textShadow: string;
  letterSpacing: string;
  display: string;
  marginLeft: string;
}

const SonicBoomClock: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const time = useMillisecondClock();

  // Load Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = FONT_URL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setShowContent(true);

    return () => {
      // Optional: remove link on unmount if you want to clean up
      // document.head.removeChild(link);
    };
  }, []);

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
          fontFamily: `"${FONT_NAME}", monospace`,
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {digits.map((digit: string, index: number) => {
          const reverseIndex = digits.length - index - 1; 
          // Progressive sizing: larger on left, smaller on right
          const fontSize = 40 + reverseIndex * -4.5; 
          const opacity = Math.max(1.0 - reverseIndex * 0.15, 0.3);

          const digitStyle: DigitStyle = {
            fontSize: `${fontSize}vmin`,
            opacity,
            color: '#D0D6F2',
            textShadow: '0 0 15px rgba(10, 63, 240, 0.4)',
            letterSpacing: '-0.1em', // Negative letter spacing to bring digits closer
            display: 'inline-block',
            marginLeft: index > 0 ? '-0.2em' : '0',
          };

          return (
            <span
              key={index}
              style={digitStyle}
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
