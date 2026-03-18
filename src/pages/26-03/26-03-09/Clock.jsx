import React, { useState, useEffect, useRef } from 'react';

const FONT_DATA = [
  { name: 'cat', url: '/fonts/26-03-09/cat.ttf', maxSize: 0.4 },
  { name: 'Swats', url: '/fonts/26-03-09/Swats.ttf', maxSize: 4.0 },
  { name: 'cat1', url: '/fonts/26-03-09/cat1.ttf', maxSize: 2.3 },
  { name: 'catz', url: '/fonts/26-03-09/catz.otf', maxSize: 2.8 },
  { name: 'kat', url: '/fonts/26-03-09/kat.ttf', maxSize: 2.6 },
  { name: 'katzz', url: '/fonts/26-03-09/katzz.ttf', maxSize: 2.7 },
  { name: 'Kitties', url: '/fonts/26-03-09/Kitties.ttf', maxSize: 2.4 },
  { name: 'me', url: '/fonts/26-03-09/me.ttf', maxSize: 2.9 },
  { name: 'Orienight', url: '/fonts/26-03-09/Orienight.otf', maxSize: 2.2 },
  { name: 'Purrfect', url: '/fonts/26-03-09/Purrfect.ttf', maxSize: 1.5 },
];

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [index, setIndex] = useState(0);
  const [transform, setTransform] = useState({
    scale: 1,
    rotateX: 45,
    rotateY: 45,
    rotateZ: 45,
    x: 0,
    y: 0,
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const styleRef = useRef(null);

  // 1. Font Loading & Global Styles
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fontPromises = FONT_DATA.map((fontData) => {
          const font = new FontFace(fontData.name, `url(${fontData.url})`);
          return font
            .load()
            .then((loadedFont) => document.fonts.add(loadedFont));
        });
        await Promise.all(fontPromises);
        setFontsLoaded(true);
      } catch (err) {
        console.error('Font loading failed:', err);
        setFontsLoaded(true); // Proceed anyway with fallbacks
      }
    };

    loadFonts();

    // Inject Background Styles
    const catSvg =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23ffcad4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' opacity='0.25'%3E%3Cpath fill='%23ffcad4' fill-opacity='0.1' d='M60 40 L75 20 L85 40 Q95 45 95 60 Q95 80 75 90 L75 105 Q90 110 85 120 Q70 110 60 95 Q50 110 35 120 Q30 110 45 105 L45 90 Q25 80 25 60 Q25 45 35 40 L45 20 Z'/%3E%3Cpath d='M35 58 Q42 50 50 58 Q42 66 35 58'/%3E%3Cpath d='M42.5 54 L42.5 62' stroke-width='1.5'/%3E%3Cpath d='M70 58 Q78 50 85 58 Q78 66 70 58'/%3E%3Cpath d='M77.5 54 L77.5 62' stroke-width='1.5'/%3E%3Cpath fill='%23ffcad4' d='M58 68 L62 68 L60 71 Z'/%3E%3Cpath d='M52 76 Q56 81 60 76 Q64 81 68 76'/%3E%3C/g%3E%3C/svg%3E";
    const styleBlock = document.createElement('style');
    styleBlock.textContent = `
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
      @keyframes catPounce {
        0% { 
          transform: translateY(0px) scale(1); 
        }
        25% { 
          transform: translateY(-5px) scale(1.02); 
        }
        50% { 
          transform: translateY(-10px) scale(0.98); 
        }
        75% { 
          transform: translateY(-3px) scale(1.01); 
        }
        100% { 
          transform: translateY(0px) scale(1); 
        }
      }
      @keyframes catTail {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(2deg); }
        75% { transform: rotate(-2deg); }
      }
    `;
    document.head.appendChild(styleBlock);
    styleRef.current = styleBlock;

    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
    };
  }, []);

  // 2. Tick Logic (Handles Time, Font Index, and Random Positioning)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());

      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % FONT_DATA.length;
        const nextFont = FONT_DATA[nextIndex];

        // Cat-like movement: sudden bursts followed by stillness
        const catBehavior = Math.random();
        let newRotateX, newRotateY, newRotateZ, newX, newY;

        if (catBehavior < 0.3) {
          // Pounce behavior - bigger movements
          newRotateX = (Math.random() * 90 - 45).toFixed(1);
          newRotateY = (Math.random() * 90 - 45).toFixed(1);
          newRotateZ = (Math.random() * 180 - 90).toFixed(1);
          newX = (Math.random() * 60 - 30).toFixed(1);
          newY = (Math.random() * 40 - 20).toFixed(1);
        } else if (catBehavior < 0.7) {
          // Subtle twitch - small movements
          newRotateX = (Math.random() * 30 - 15).toFixed(1);
          newRotateY = (Math.random() * 30 - 15).toFixed(1);
          newRotateZ = (Math.random() * 45 - 22.5).toFixed(1);
          newX = (Math.random() * 20 - 10).toFixed(1);
          newY = (Math.random() * 15 - 7.5).toFixed(1);
        } else {
          // Stretch behavior - moderate movements
          newRotateX = (Math.random() * 60 - 30).toFixed(1);
          newRotateY = (Math.random() * 60 - 30).toFixed(1);
          newRotateZ = (Math.random() * 90 - 45).toFixed(1);
          newX = (Math.random() * 30 - 15).toFixed(1);
          newY = (Math.random() * 20 - 10).toFixed(1);
        }

        setTransform({
          scale: (Math.random() * (nextFont.maxSize - 0.6) + 0.6).toFixed(2),
          rotateX: newRotateX,
          rotateY: newRotateY,
          rotateZ: newRotateZ,
          x: newX,
          y: newY,
        });

        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#520850',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ECDE46',
          fontFamily: 'sans-serif',
        }}
      >
        LOADING...
      </div>
    );
  }

  const current = FONT_DATA[index];
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#520850',
        color: '#ECDE46',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        userSelect: 'none',
        position: 'relative',
        perspective: '800px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div className="animate-bg cat-background-overlay" />

      <div
        style={{
          fontSize: `calc(${transform.scale} * clamp(6rem, 20vw, 15rem))`,
          fontFamily: `'${current.name}', sans-serif`,
          transform: `translate(${transform.x}vw, ${transform.y}vh) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg) scale(${transform.scale})`,
          transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          zIndex: 1,
          textShadow: '0 10px 30px rgba(0, 0, 0, 0.71)',
          textAlign: 'center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'visible',
          display: 'inline-block',
        }}
      >
        {hours}
        {minutes}
      </div>
    </div>
  );
};

export default Clock;
