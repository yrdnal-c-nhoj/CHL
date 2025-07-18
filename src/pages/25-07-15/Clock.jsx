import React, { useEffect, useRef } from 'react';
import asciiFontUrl from './ascii.ttf';
import asciiImageUrl from './ascii.jpg';

const DIGITS = {
  '0': [" 00000 ","00   00","00   00","00   00","00   00","00   00"," 00000 ","       "],
  '1': ["   11  ","  111  "," 1 11  ","   11  ","   11  ","   11  "," 111111","       "],
  '2': [" 22222 ","22   22","    22 ","   22  ","  22   "," 22    ","2222227","       "],
  '3': [" 33333 ","33   33","     33","  3333 ","     33","33   33"," 33333 ","       "],
  '4': ["   44  ","  444  "," 4 44  ","4  44  ","4444444","   44  ","   44  ","       "],
  '5': ["5555555","55     ","55555  ","    55 ","     55","55   55"," 55555 ","       "],
  '6': [" 66666 ","66     ","66666  ","66  66 ","66  66 ","66  66 "," 66666 ","       "],
  '7': ["7777777","     77","    77 ","   77  ","  77   "," 77    ","77     ","       "],
  '8': [" 88888 ","88   88","88   88"," 88888 ","88   88","88   88"," 88888 ","       "],
  '9': [" 99999 ","99   99","99   99"," 999999","     99","    99 "," 9999  ","       "],
  'A': ["   AA  ","  A  A "," A    A"," AAAAAA"," A    A"," A    A","A      A","       "],
  'M': ["M     M","MM   MM","M M M M","M  M  M","M     M","M     M","M     M","       "],
  'P': ["PPPPP  ","P    P ","P    P ","PPPPP  ","P      ","P      ","P      ","       "],
};

const AsciiClock = () => {
  const clockRef = useRef();

  useEffect(() => {
    const font = new FontFace('ascii', `url(${asciiFontUrl})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  const makeGroup = (str) => {
    const rows = Array(8).fill('');
    for (const char of str) {
      const glyph = DIGITS[char.toUpperCase()] || Array(8).fill('       ');
      for (let i = 0; i < 8; i++) {
        rows[i] += glyph[i];
      }
    }
    return rows.join('\n');
  };

  const drawClock = () => {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const isPM = h >= 12;

    h = h % 12 || 12;
    const hStr = String(h);
    const ampm = isPM ? 'PM' : 'AM';

    if (clockRef.current) {
      const clock = clockRef.current;
      clock.innerHTML = '';
      const container = document.createElement('div');
      container.style.whiteSpace = 'pre';

      [hStr, m, s, ampm].forEach((part) => {
        const div = document.createElement('div');
        div.style = digitGroupStyleString;
        div.textContent = makeGroup(part);
        container.appendChild(div);
      });

      clock.appendChild(container);
    }
  };

  useEffect(() => {
    drawClock();
    const interval = setInterval(drawClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={wrapperStyle}>
      <div style={bgLayerStyle}></div>
      <div id="clock" ref={clockRef} style={clockStyle}></div>
    </div>
  );
};

// Inline styles
const wrapperStyle = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: 'black',
};

const bgLayerStyle = {
  backgroundImage: `url(${asciiImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  filter: 'invert(1)',
  zIndex: -1,
};

const clockStyle = {
  fontFamily: 'ascii',
  lineHeight: '0.9',
  letterSpacing: '0.3rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.6rem',
  zIndex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'rgb(224, 250, 224)',
  padding: '1rem',
  borderRadius: '1rem',
  whiteSpace: 'pre',
};

const digitGroupStyleString = `
  display: flex;
  flex-direction: column;
  text-align: center;
  white-space: pre;
`;

export default AsciiClock;
