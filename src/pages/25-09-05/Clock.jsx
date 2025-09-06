import React, { useEffect, useState } from 'react';
import DigitalClockFont from './swi.ttf';
import DigitalClockBg from './swiss.jpg';
import MovingImg from './mouse.gif'; // your image to move

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load custom font
  useEffect(() => {
    let mounted = true;
    if (typeof window !== 'undefined' && window.FontFace) {
      const f = new FontFace('DigitalClockFont', `url(${DigitalClockFont})`);
      f.load().then((loaded) => {
        if (!mounted) return;
        try { document.fonts.add(loaded); } catch {}
        setFontReady(true);
      }).catch(() => setFontReady(true));
    } else setFontReady(true);
    return () => { mounted = false; };
  }, []);

  // Update time
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 500);
    return () => clearInterval(t);
  }, []);

  const sharedFontFamily = fontReady ? 'DigitalClockFont, monospace' : 'monospace';
  const formatTwoDigits = (num) => num.toString().padStart(2, '0');

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours24 >= 12 ? 'P.M.' : 'A.M.';

  const allDigits = [...formatTwoDigits(hours12), ...formatTwoDigits(minutes), ...formatTwoDigits(seconds)];
  const allAMPM = ampm.split('');

  const rootStyle = {
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    backgroundImage: `url(${DigitalClockBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: sharedFontFamily,
    overflow: 'hidden', // hide anything outside viewport
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

  // Animation style for the moving image
  const movingStyle = {
    position: 'absolute',
    bottom: '19vh', // distance from bottom
    left: '-20%', // start outside left
    width: '11vw', // size of the image
    height: 'auto',
    zIndex: 10,
    animation: 'moveRight 8s linear infinite',
  };

  // Inline keyframes via a <style> tag
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
          <div key={`d${i}`} style={digitStyle(positions[i].x, positions[i].y, '62vw', z)}>
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
          <div key={`a${i}`} style={digitStyle(positions[i].x, positions[i].y, '62vw', 5)}>
            {c}
          </div>
        );
      })}

      {/* Moving image */}
      <img src={MovingImg} alt="moving" style={movingStyle} />
    </div>
  );
}
