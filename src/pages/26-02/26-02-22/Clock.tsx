import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';

import digit7 from '../../../assets/images/26-02/26-02-22/1.webp';
import digit4 from '../../../assets/images/26-02/26-02-22/2.webp';
import digit12 from '../../../assets/images/26-02/26-02-22/3.webp';
import digit3 from '../../../assets/images/26-02/26-02-22/4.webp';
import digit1 from '../../../assets/images/26-02/26-02-22/5.webp';
import digit9 from '../../../assets/images/26-02/26-02-22/6.webp';
import digit2 from '../../../assets/images/26-02/26-02-22/7.webp';
import digit10 from '../../../assets/images/26-02/26-02-22/8.webp';
import digit6 from '../../../assets/images/26-02/26-02-22/9.webp';
import digit5 from '../../../assets/images/26-02/26-02-22/10.webp';
import digit8 from '../../../assets/images/26-02/26-02-22/11.webp';
import digit11 from '../../../assets/images/26-02/26-02-22/12.webp';
import skinBg from '../../../assets/images/26-02/26-02-22/skin.jpg';

const DIGITS = [
  digit12,
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
  digit11,
  digit10,
];

const SimpleClock: React.FC = () => {
  const time = useSecondClock();
  const [hueRotation, setHueRotation] = useState(
    Math.floor(Math.random() * 360),
  );

  useEffect(() => {
    if (time.getSeconds() % 1 === 0) {
      setHueRotation((prev) => (prev + 45) % 360);
    }
  }, [time]);

  // Calculate angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `url(${skinBg}) center/cover no-repeat`,
          filter: `hue-rotate(${hueRotation}deg) saturate(4.4) brightness(1.92) contrast(0.38)`,
        }}
      />

      <div
        style={{
          width: '90vmin',
          height: '90vmin',
          position: 'relative',
        }}
      >
        {DIGITS.map((img, i) => {
          // Unique filter values for each digit
          const filters = [
            { saturate: 1.2, brightness: 1.1, contrast: 1.0 }, // 12
            { saturate: 1.9, brightness: 1.2, contrast: 1.1 }, // 1
            { saturate: 1.3, brightness: 0.9, contrast: 1.2 }, // 2
            { saturate: 1.0, brightness: 1.3, contrast: 0.9 }, // 3
            { saturate: 3.4, brightness: 1.0, contrast: 1.3 }, // 4
            { saturate: 3.0, brightness: 0.8, contrast: 1.4 }, // 5
            { saturate: 1.1, brightness: 1.4, contrast: 1.0 }, // 6
            { saturate: 3.7, brightness: 1.1, contrast: 1.2 }, // 7
            { saturate: 2.5, brightness: 0.7, contrast: 1.1 }, // 8
            { saturate: 1.2, brightness: 1.3, contrast: 0.8 }, // 9
            { saturate: 1.9, brightness: 1.0, contrast: 1.5 }, // 11
            { saturate: 1.6, brightness: 1.2, contrast: 0.7 }, // 10
          ];

          const filter = filters[i];

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '20vmin',
                height: '20vmin',
                top: '50%',
                left: '50%',
                backgroundImage: `url(${img})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-35vmin) rotate(-${i * 30}deg)`,
                filter: `saturate(${filter.saturate}) brightness(${filter.brightness}) contrast(${filter.contrast})`,
                zIndex: 2,
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            width: '1.6vmin',
            height: '22vmin',
            background: '#111',
            top: '50%',
            left: '50%',
            transformOrigin: '50% 85%',
            transform: `translate(-50%, -85%) rotate(${hourAngle}deg)`,
            borderRadius: '1vmin',
            zIndex: 5,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '1vmin',
            height: '30vmin',
            background: '#111',
            top: '50%',
            left: '50%',
            transformOrigin: '50% 90%',
            transform: `translate(-50%, -90%) rotate(${minuteAngle}deg)`,
            borderRadius: '1vmin',
            zIndex: 6,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '0.5vmin',
            height: '34vmin',
            background: '#d00',
            top: '50%',
            left: '50%',
            transformOrigin: '50% 92%',
            transform: `translate(-50%, -92%) rotate(${secondAngle}deg)`,
            borderRadius: '1vmin',
            zIndex: 7,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '3vmin',
            height: '3vmin',
            background: '#111',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default SimpleClock;
