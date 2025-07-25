import React, { useEffect, useState } from 'react';
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
  'P': ["PPPPP  ","P    P ","P    P ","PPPPP  ","P      ","P      ","P      ","       "]
};

const makeGroup = (str) => {
  const rows = Array(8).fill('');
  for (const char of str) {
    const glyph = DIGITS[char] || Array(8).fill('       ');
    for (let i = 0; i < 8; i++) {
      rows[i] += glyph[i];
    }
  }
  return rows.join('\n');
};

const AsciiClock = () => {
  const [timeParts, setTimeParts] = useState([]);

  useEffect(() => {
    const font = new FontFace('ascii', `url(${asciiFontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const isPM = h >= 12;
      h = h % 12 || 12;
      setTimeParts([String(h), m, s, isPM ? 'PM' : 'AM']);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    backgroundColor: 'rgb(32, 31, 31)',
    color: 'rgb(224, 250, 224)',
    whiteSpace: 'pre',
    fontSize: '0.6rem',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    fontFamily: 'ascii',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  };

  const bgStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${asciiImageUrl})`,
    backgroundRepeat: 'repeat',
    transform: 'scaleX(-1)',
    filter: 'invert(0.9) brightness(0.5)',
    zIndex: -1,
  };

  const titleContainerStyle = {
    color: '#a2a2a0',
    textShadow: '#100f0f 0.1vw 0',
    position: 'absolute',
    top: '0.5vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98vw',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 6,
  };

  const chltitleStyle = {
    fontFamily: '"Roboto Slab", serif',
    fontSize: '2.7vh',
    letterSpacing: '0.1vh',
  };

  



 

  return (
    <div style={containerStyle}>
      
      {timeParts.map((group, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            lineHeight: '0.9',
            letterSpacing: '0.3rem',
            marginBottom: '0.6rem',
          }}
        >
          {makeGroup(group)}
        </div>
      ))}
    </div>
  );
};

export default AsciiClock;
