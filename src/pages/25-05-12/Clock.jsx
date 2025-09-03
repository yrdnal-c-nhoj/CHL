import React, { useEffect, useState } from 'react';
import A3ui from './A3ui.gif';
import leoFont from './leo.ttf';

const CheetahClock = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const font = new FontFace('leo', `url(${leoFont})`);
    font.load().then((loadedFont) => document.fonts.add(loadedFont));

    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    handleResize();

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = Math.floor(now.getMilliseconds() / 10);

      const [h, m, s, ms] = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
        milliseconds.toString().padStart(2, '0'),
      ];

      document.getElementById('h1').textContent = h[0];
      document.getElementById('h2').textContent = h[1];
      document.getElementById('m1').textContent = m[0];
      document.getElementById('m2').textContent = m[1];
      document.getElementById('s1').textContent = s[0];
      document.getElementById('s2').textContent = s[1];
      document.getElementById('ms1').textContent = ms[0];
      document.getElementById('ms2').textContent = ms[1];
    };

    const interval = setInterval(updateClock, 33);
    updateClock();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

 const vars = {
  '--digit-width': isMobile ? '29vw' : '13vw',   // reduce in landscape
  '--digit-height': '18vh',
  '--font-size': isMobile ? '14vh' : '11vh',     // optional tweak for spacing
};


  const sharedDigitStyle = {
    width: 'var(--digit-width)',
    height: 'var(--digit-height)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgb(192, 142, 26)',
    fontSize: 'var(--font-size)',
    boxSizing: 'border-box',
    fontFamily: 'leo, sans-serif',
  };

  const layoutStyle = isMobile
    ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, var(--digit-width))',
        gridTemplateAreas: `
          "h1 h2"
          "m1 m2"
          "s1 s2"
          "ms1 ms2"
        `,
        gap: '0.1rem',
        fontFamily: 'leo, sans-serif',
        textShadow: 'rgb(14, 2, 26) 0.8rem 0.5rem 0.3rem',
        zIndex: 2,
      }
    : {
        display: 'flex',
        flexWrap: 'nowrap',
        fontFamily: 'leo, sans-serif',
        textShadow: 'rgb(14, 2, 26) 0.8rem 0.5rem 0.3rem',
        zIndex: 2,
      };

  const gridAreas = ['h1', 'h2', 'm1', 'm2', 's1', 's2', 'ms1', 'ms2'];

  return (
    <div
      style={{
        ...vars,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        margin: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'black',
      }}
    >
     

      {/* Background */}
      <img
        src={A3ui}
        alt="Background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundRepeat: 'repeat',
          zIndex: 1,
        }}
      />

      {/* Clock */}
      <div id="clock" style={layoutStyle}>
        {gridAreas.map((id) => (
          <div
            key={id}
            id={id}
            style={{
              ...sharedDigitStyle,
              ...(isMobile ? { gridArea: id } : {}),
            }}
          ></div>
        ))}
      </div>

     
    </div>
  );
};

export default CheetahClock;
