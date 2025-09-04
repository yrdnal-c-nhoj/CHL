import React, { useEffect, useState } from 'react';
import DigitalClockFont from './swi.ttf';
import DigitalClockBg from './swiss.jpg';

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
  };

  // Single variable for color + text shadow
  const fontStyle = {
    color: '#EFD67BFF',
    textShadow: '0 1px 2px #333333',
  };

  const digitStyle = (xPercent, yPercent, fontSizeVW) => ({
    position: 'absolute',
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    fontSize: fontSizeVW,
    fontFamily: sharedFontFamily,
    userSelect: 'none',
    transform: 'translate(-50%, -50%)',
    ...fontStyle, // merge color + shadow
  });

  return (
    <div style={rootStyle}>
      {allDigits.map((d, i) => {
        const positions = [
          { x: 3, y: 5 }, // hour tens
          { x: 19, y: 20 }, // hour units
          { x: 30, y: 50 }, // minute tens
          { x: 40, y: 75 }, // minute units
          { x: 50, y: 17 }, // second tens
          { x: 60, y: 30 }, // second units
        ];
        return (
          <div key={`d${i}`} style={digitStyle(positions[i].x, positions[i].y, '12vw')}>
            {d}
          </div>
        );
      })}

      {allAMPM.map((c, i) => {
        const positions = [
          { x: 70, y: 70 }, // A
          { x: 805, y: 80 }, // .
          { x: 90, y: 90 }, // M
          { x: 950, y: 80 }, // .
        ];
        return (
          <div key={`a${i}`} style={digitStyle(positions[i].x, positions[i].y, '12vw')}>
            {c}
          </div>
        );
      })}
    </div>
  );
}
