import React, { useState, useEffect } from 'react';

const FONT_DATA = [
  { name: 'cat', url: '/src/assets/fonts/26-03-09/cat.ttf' },
  { name: 'Swats', url: '/src/assets/fonts/26-03-09/Swats.ttf' },
  { name: 'cat1', url: '/src/assets/fonts/26-03-09/cat1.ttf' },
  { name: 'catz', url: '/src/assets/fonts/26-03-09/catz.otf' },
  { name: 'kat', url: '/src/assets/fonts/26-03-09/kat.ttf' },
  { name: 'katzz', url: '/src/assets/fonts/26-03-09/katzz.ttf' },
  { name: 'Kitties', url: '/src/assets/fonts/26-03-09/Kitties.ttf' },
  { name: 'me', url: '/src/assets/fonts/26-03-09/me.ttf' },
  { name: 'Orienight', url: '/src/assets/fonts/26-03-09/Orienight.otf' },
  { name: 'Purrfect', url: '/src/assets/fonts/26-03-09/Purrfect.ttf' },
];

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [index, setIndex] = useState(0);
  const [transform, setTransform] = useState({ scale: 1, rotate: 0 });

  useEffect(() => {
    const styleBlock = document.createElement('style');

    // Clear cat-head SVG
    const catSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 35 L30 15 L45 30 Q50 28 55 30 L70 15 L80 35 Q85 50 80 65 Q70 85 50 85 Q30 85 20 65 Q15 50 20 35 Z' fill='%23ffcad4' fill-opacity='0.14'/%3E%3Ccircle cx='38' cy='52' r='3' fill='%23ffcad4' fill-opacity='0.14'/%3E%3Ccircle cx='62' cy='52' r='3' fill='%23ffcad4' fill-opacity='0.14'/%3E%3C/svg%3E`;

    styleBlock.textContent = `
      ${FONT_DATA.map(f => `
        @font-face {
          font-family: '${f.name}';
          src: url('${f.url}');
          font-display: swap;
        }
      `).join('\n')}

      .cat-background-overlay {
        position: absolute;
        inset: 0;
        background-image: url("${catSvg}");
        background-size: 90px 90px;
        background-repeat: repeat;
        pointer-events: none;
        z-index: 0;
      }
    `;

    document.head.appendChild(styleBlock);

    const timer = setInterval(() => {
      setTime(new Date());
      setIndex((prev) => (prev + 1) % FONT_DATA.length);

      const newScale = (Math.random() * (1.4 - 0.8) + 0.8).toFixed(2);
      const newRotate = (Math.random() * 16 - 8).toFixed(1);

      setTransform({
        scale: newScale,
        rotate: newRotate
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.head.removeChild(styleBlock);
    };
  }, []);

  const current = FONT_DATA[index];

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#520850',
        color: '#ffcad4',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Cat pattern background */}
      <div className="cat-background-overlay" />

      {/* Clock */}
      <div
        style={{
          fontSize: `calc(${transform.scale} * clamp(8rem, 25vw, 18rem))`,
          fontFamily: `'${current.name}', sans-serif`,
          transform: `rotate(${transform.rotate}deg)`,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          zIndex: 1,
          textShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        {hours}{minutes}
      </div>
    </div>
  );
};

export default Clock;