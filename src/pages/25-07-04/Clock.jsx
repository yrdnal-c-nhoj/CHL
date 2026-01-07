import React, { useEffect, useState, useRef } from 'react';
import kalFont from '../../assets/fonts/25-07-04-kal.otf';
import bgImage from '../../assets/clocks/25-07-04/7ZAx.webp';

const SEGMENTS = 12;
const COLORS = [
  '#ff0040', '#045DF7FF', '#F9D108FF', '#00ff00',
  '#FC7B02FF', '#ff00ff', '#00bfff', '#ffffff',
  '#D0FF00FF', '#C12FFBFF', '#FAA404FF', '#12F5DBFF'
];

const Clock = () => {
  const [fontState, setFontState] = useState({ loading: true, error: null });
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  // 1. Font Loading Logic
  useEffect(() => {
    let isMounted = true;
    const loadFont = async () => {
      try {
        const font = new FontFace('kal', `url(${kalFont})`);
        font.display = 'swap';
        await font.load();
        if (isMounted) {
          document.fonts.add(font);
          setFontState({ loading: false, error: null });
        }
      } catch (error) {
        console.error('Failed to load font:', error);
        if (isMounted) {
          // Set loading to false anyway so the clock shows even with a fallback font
          setFontState({ loading: false, error: 'Failed' });
        }
      }
    };
    loadFont();
    return () => { isMounted = false; };
  }, []);

  // 2. Animation Loop
  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // 3. Early Return (using the correct state variable)
  if (fontState.loading) {
    return (
      <div style={{ background: 'black', height: '100dvh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#777', fontFamily: 'sans-serif' }}>
        Loading…
      </div>
    );
  }

  // 4. Time Calculations
  const h = time.getHours();
  const hourText = (h % 12 || 12).toString().padStart(2, '0');
  const minuteText = time.getMinutes().toString().padStart(2, '0');
  const secondText = time.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const s = time.getSeconds();

  const renderRingSegments = (offset) => {
    return Array.from({ length: SEGMENTS }).map((_, i) => {
      const angle = i * (360 / SEGMENTS);
      const colorIndex = (i + s + offset) % COLORS.length;

      return (
        <React.Fragment key={i}>
          <div className="segment hour" style={{ transform: `rotate(${angle}deg) translate(30vmin)`, color: COLORS[(colorIndex + 2) % COLORS.length] }}>{hourText}</div>
          <div className="segment minute" style={{ transform: `rotate(${angle}deg) translate(20vmin)`, color: COLORS[(colorIndex + 4) % COLORS.length] }}>{minuteText}</div>
          <div className="segment second" style={{ transform: `rotate(${angle}deg) translate(10vmin)`, color: COLORS[(colorIndex + 6) % COLORS.length] }}>{secondText}</div>
          <div className="segment ampm" style={{ transform: `rotate(${angle}deg) translate(5vmin)`, color: COLORS[(colorIndex + 8) % COLORS.length] }}>{ampm}</div>
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ margin: 0, padding: 0, background: 'black', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <img src={bgImage} alt="background" style={bgStyle} />
      
      {/* Top UI Overlay */}
      <div style={headerStyle}>
        <div style={{ fontFamily: '"Oxanium", serif', fontStyle: 'italic' }}>BorrowedTime</div>
        <div style={{ fontFamily: '"Roboto Slab", serif', position: 'absolute', right: 0 }}>Cubist Heart Laboratories</div>
      </div>

      {/* Clockwise Kaleidoscope */}
      <div className="kaleidoscope spin-cw" style={kaleidoscopeStyle}>
        {renderRingSegments(0)}
      </div>

      {/* Counter-Clockwise Kaleidoscope */}
      <div className="kaleidoscope spin-ccw" style={kaleidoscopeStyle}>
        {renderRingSegments(6)}
      </div>

      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .kaleidoscope { font-family: 'kal', sans-serif; position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 2; }
        .spin-cw { animation: spin-cw 45s linear infinite; opacity: 0.9; }
        .spin-ccw { animation: spin-ccw 90s linear infinite; opacity: 0.7; }
        .segment { position: absolute; font-weight: bold; mix-blend-mode: screen; transition: color 0.5s; font-size: 4.5rem; transform-origin: center; }
        .minute, .second { font-size: 2.4rem; }
        .ampm { font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

const bgStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', objectFit: 'cover', filter: 'brightness(210%) saturate(400%) hue-rotate(-190deg) blur(4px)', zIndex: 1, pointerEvents: 'none' };
const headerStyle = { position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', width: '98%', display: 'flex', color: '#bebcbc', zIndex: 6, fontSize: '2.8vh' };
const kaleidoscopeStyle = { position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default Clock;