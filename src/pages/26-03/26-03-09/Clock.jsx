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
    const styleBlock = document.createElement('style');

    /* SVG UPDATES:
      1. Almond Eyes: Created using two curves (Q) meeting at points.
      2. Slit Pupils: Added vertical lines (M/L) inside the almond shape.
      3. Proportions: Scaled the facial features to be more "predatory" and less "doll-like."
    */
    const catSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23ffcad4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' opacity='0.25'%3E%3Cpath fill='%23ffcad4' fill-opacity='0.1' d='M60 40 L75 20 L85 40 Q95 45 95 60 Q95 80 75 90 L75 105 Q90 110 85 120 Q70 110 60 95 Q50 110 35 120 Q30 110 45 105 L45 90 Q25 80 25 60 Q25 45 35 40 L45 20 Z'/%3E%3Cpath d='M35 58 Q42 50 50 58 Q42 66 35 58'/%3E%3Cpath d='M42.5 54 L42.5 62' stroke-width='1.5'/%3E%3Cpath d='M70 58 Q78 50 85 58 Q78 66 70 58'/%3E%3Cpath d='M77.5 54 L77.5 62' stroke-width='1.5'/%3E%3Cpath fill='%23ffcad4' d='M58 68 L62 68 L60 71 Z'/%3E%3Cpath d='M52 76 Q56 81 60 76 Q64 81 68 76'/%3E%3C/g%3E%3C/svg%3E";

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
        pointer-events: none;
        z-index: 0;
        background-image: url("${catSvg}"), url("${catSvg}");
        background-size: 160px 160px, 160px 160px;
        background-position: 0 0, 80px 80px;
      }

      @keyframes driftUp {
        from { background-position: 0 0, 80px 80px; }
        to { background-position: 0 -160px, 80px -80px; }
      }

      .animate-bg {
        animation: driftUp 20s linear infinite;
      }
    `;

    document.head.appendChild(styleBlock);

    const timer = setInterval(() => {
      setTime(new Date());
      setIndex(prev => (prev + 1) % FONT_DATA.length);
      const newScale = (Math.random() * (1.2 - 0.9) + 0.9).toFixed(2);
      const newRotate = (Math.random() * 6 - 3).toFixed(1);
      setTransform({ scale: newScale, rotate: newRotate });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (document.head.contains(styleBlock)) document.head.removeChild(styleBlock);
    };
  }, []);

  const current = FONT_DATA[index];
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div style={{
      width: '100vw', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#520850', color: '#ffcad4', margin: 0, padding: 0, overflow: 'hidden',
      userSelect: 'none', position: 'relative'
    }}>
      <div className="cat-background-overlay animate-bg" />
      <div style={{
        fontSize: `calc(${transform.scale} * clamp(8rem, 25vw, 15rem))`,
        fontFamily: `'${current.name}', sans-serif`,
        transform: `rotate(${transform.rotate}deg)`,
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        lineHeight: 1, letterSpacing: '-0.02em', zIndex: 1,
        textShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {hours}{minutes}
      </div>
    </div>
  );
};

export default Clock;