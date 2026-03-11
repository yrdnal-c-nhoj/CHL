import React, { useState, useEffect } from 'react';

const FONT_DATA = [
  { name: 'cat', url: '/fonts/26-03-09/cat.ttf' },
  { name: 'Swats', url: '/fonts/26-03-09/Swats.ttf' },
  { name: 'cat1', url: '/fonts/26-03-09/cat1.ttf' },
  { name: 'catz', url: '/fonts/26-03-09/catz.otf' },
  { name: 'kat', url: '/fonts/26-03-09/kat.ttf' },
  { name: 'katzz', url: '/fonts/26-03-09/katzz.ttf' },
  { name: 'Kitties', url: '/fonts/26-03-09/Kitties.ttf' },
  { name: 'me', url: '/fonts/26-03-09/me.ttf' },
  { name: 'Orienight', url: '/fonts/26-03-09/Orienight.otf' },
  { name: 'Purrfect', url: '/fonts/26-03-09/Purrfect.ttf' },
];

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [index, setIndex] = useState(0);
  const [transform, setTransform] = useState({ scale: 1, rotate: 0 });

  useEffect(() => {
    // 1. Inject Styles ONCE
    const styleBlock = document.createElement('style');
    const catSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 16c-4 0-7 4-7 4s-1-4-5-4-7 5-7 10c0 4 2 8 7 12l12 10 12-10c5-4 7-8 7-12 0-5-3-10-7-10s-1-4-5-4-7 4-7 4z' fill='%23ffcad4' fill-opacity='0.1'/%3E%3C/svg%3E`;

    styleBlock.textContent = `
      ${FONT_DATA.map(f => `
        @font-face { font-family: '${f.name}'; src: url('${f.url}'); font-display: swap; }
      `).join('\n')}

      .cat-background-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url("${catSvg}");
        background-size: 80px 80px;
        pointer-events: none;
        z-index: 0;
        opacity: 0.5;
      }

      /* Slow drifting animation for the background */
      @keyframes drift {
        from { background-position: 0 0; }
        to { background-position: 80px 80px; }
      }
      .animate-bg {
        animation: drift 10s linear infinite;
      }
    `;
    document.head.appendChild(styleBlock);

    // 2. Set the interval for time and randomization
    const timer = setInterval(() => {
      setTime(new Date());
      setIndex((prev) => (prev + 1) % FONT_DATA.length);
      
      const newScale = (Math.random() * (1.4 - 0.8) + 0.8).toFixed(2);
      const newRotate = (Math.random() * 16 - 8).toFixed(1);
      
      setTransform({ scale: newScale, rotate: newRotate });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.head.removeChild(styleBlock);
    };
  }, []); // Empty dependency array ensures this runs once

  const current = FONT_DATA[index];
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#520850', color: '#ffcad4',
      margin: 0, padding: 0, overflow: 'hidden',
      userSelect: 'none', position: 'relative'
    }}>
      
      <div className="cat-background-overlay animate-bg" />
    
      <div style={{
        fontSize: `calc(${transform.scale} * clamp(8rem, 25vw, 18rem))`,
        fontFamily: `'${current.name}', sans-serif`,
        transform: `rotate(${transform.rotate}deg)`,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        lineHeight: 1,
        letterSpacing: '-0.05em',
        zIndex: 1,
        textShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {hours}{minutes}
      </div>
    </div>
  );
};

export default Clock;