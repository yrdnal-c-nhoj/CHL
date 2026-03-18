import React, { useEffect, useState } from 'react';
import { useMultiAssetLoader } from '../../../utils/assetLoader';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import DigitalClockFont from '../../../assets/fonts/25-09-05-swi.ttf';
import DigitalClockBg from '../../../assets/images/25-09/25-09-05/swiss.jpg';
import MovingImg from '../../../assets/images/25-09/25-09-05/mouse.gif';

export default function DigitalClock() {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'DigitalClockFont',
      fontUrl: DigitalClockFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [now, setNow] = useState(new Date());
  const [fontReady, setFontReady] = useState<boolean>(fontsLoaded);
  const [bgReady, setBgReady] = useState<boolean>(false);
  const [imgReady, setImgReady] = useState<boolean>(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.src = DigitalClockBg;
    img.onload = () => setBgReady(true);
  }, []);

  // Load moving image
  useEffect(() => {
    const img = new Image();
    img.src = MovingImg;
    img.onload = () => setImgReady(true);
  }, []);

  // Only render once all assets are ready
  const allLoaded = fontReady && bgReady && imgReady;

  if (!allLoaded) return null; // or a loader div

  const sharedFontFamily = 'DigitalClockFont, monospace';
  const formatTwoDigits = (num) => num.toString().padStart(2, '0');

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours24 >= 12 ? 'P.M.' : 'A.M.';

  const allDigits = [
    ...formatTwoDigits(hours12),
    ...formatTwoDigits(minutes),
    ...formatTwoDigits(seconds),
  ];
  const allAMPM = ampm.split('');

  const rootStyle = {
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    backgroundImage: `url(${DigitalClockBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: sharedFontFamily,
    overflow: 'hidden',
  };

  const fontStyle = {
    color: '#EFD67BFF',
    textShadow: '0 1px 2px #333333',
  };

  const digitStyle = (xPercent, yPercent, fontSizeVW, zIndex = 1) => ({
    position: 'absolute',
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    fontSize: fontSizeVW,
    fontFamily: sharedFontFamily,
    userSelect: 'none',
    opacity: 0.8,
    transform: 'translate(-50%, -50%)',
    zIndex,
    ...fontStyle,
  });

  const movingStyle = {
    position: 'absolute',
    bottom: '19vh',
    left: '-20%',
    width: '11vw',
    height: 'auto',
    zIndex: 10,
    animation: 'moveRight 8s linear infinite',
  };

  const keyframes = `
    @keyframes moveRight {
      0% { left: -20%; }
      100% { left: 120%; }
    }
  `;

  return (
    <div style={rootStyle}>
      <style>{keyframes}</style>

      {allDigits.map((d, i) => {
        const positions = [
          { x: 13, y: 15 },
          { x: 33, y: 44 },
          { x: 20, y: 58 },
          { x: 40, y: 79 },
          { x: 60, y: 17 },
          { x: 89, y: 30 },
        ];
        let z = i < 2 ? 4 : i < 4 ? 3 : 2;
        return (
          <div
            key={`d${i}`}
            style={digitStyle(positions[i].x, positions[i].y, '62vw', z)}
          >
            {d}
          </div>
        );
      })}

      {allAMPM.map((c, i) => {
        const positions = [
          { x: 70, y: 70 },
          { x: 805, y: 80 },
          { x: 90, y: 90 },
          { x: 950, y: 80 },
        ];
        return (
          <div
            key={`a${i}`}
            style={digitStyle(positions[i].x, positions[i].y, '62vw', 5)}
          >
            {c}
          </div>
        );
      })}

      <img
        decoding="async"
        loading="lazy"
        src={MovingImg}
        alt="moving"
        style={movingStyle}
      />
    </div>
  );
}
