import React, { useState, useEffect, useMemo } from 'react';
import backgroundImage from '../../../assets/clocks/26-01-28/three.webp';

// --- Background Logic with Dual-Axis Mirroring ---
function CheckerboardBackground() {
  const [dimensions, setDimensions] = useState({ 
    cols: typeof window !== 'undefined' ? Math.ceil(window.innerWidth / 200) + 1 : 10, 
    rows: typeof window !== 'undefined' ? Math.ceil(window.innerHeight / 200) + 1 : 10 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / 200) + 1,
        rows: Math.ceil(window.innerHeight / 200) + 1
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize tiles so they don't re-render when the clock ticks
  const renderedTiles = useMemo(() => {
    const tiles = [];
    for (let r = 0; r < dimensions.rows; r++) {
      for (let c = 0; c < dimensions.cols; c++) {
        const flipH = c % 2 === 1;
        const flipV = r % 2 === 1;
        const transform = `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;

        tiles.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: 200,
              height: 200,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              transform: transform,
              opacity: 0.9, // Allows the gradient to bleed through the tiles
            }}
          />
        );
      }
    }
    return tiles;
  }, [dimensions, backgroundImage]);

  return (
    <div style={backgroundWrapperStyle}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${dimensions.cols}, 200px)`,
        gridTemplateRows: `repeat(${dimensions.rows}, 200px)`,
      }}>
        {renderedTiles}
      </div>
    </div>
  );
}

// --- Clock Hook ---
function useClockAngles() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let frameId;
    const tick = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return useMemo(() => {
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 24) + m / 60;

    return {
      hourAngle: h * 15, 
      minAngle: m * 6,
      secAngle: s * 6,
    };
  }, [now]);
}

export default function ThreeSingleHandClocks() {
  const { hourAngle, minAngle, secAngle } = useClockAngles();
  const [layout, setLayout] = useState('row');
  const [clockSize, setClockSize] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontName = 'Big Shoulders Inline Text';

  useEffect(() => {
    const loadGoogleFont = async () => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Inline+Text:wght@500;800&display=swap';
        document.head.appendChild(link);
        await document.fonts.load('800 12px "Big Shoulders Inline Text"');
        setFontLoaded(true);
      } catch (e) { setFontLoaded(true); }
    };
    loadGoogleFont();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nextLayout = w < 900 ? 'column' : 'row';
      setLayout(nextLayout);
      const diameter = nextLayout === 'row' 
        ? Math.min((w / 3) * 0.9, h * 0.9) 
        : Math.min(w * 0.9, (h / 3) * 0.9);
      setClockSize(diameter);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main style={containerStyle}>
      <CheckerboardBackground />
      <div style={{
        ...clockGridStyle,
        flexDirection: layout,
        gap: layout === 'column' ? '1vh' : '1vw',
        opacity: fontLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 10 
      }}>
        <Clock label="HOURS" angle={hourAngle} color="#FF0000" thickness="18%" maxUnits={24} step={1} clockSize={clockSize} fontName={fontName} />
        <Clock label="SECONDS" angle={secAngle} color="#FAD903" thickness="14%" maxUnits={60} step={5} smooth={false} clockSize={clockSize} fontName={fontName} />      
        <Clock label="MINUTES" angle={minAngle} color="#1693FA" thickness="16%" maxUnits={60} step={5} clockSize={clockSize} fontName={fontName} />
      </div>
    </main>
  );
}

function Clock({ angle, color, thickness, smooth = true, maxUnits, step, clockSize, fontName }) {
  const markers = useMemo(() => {
    const arr = [];
    for (let i = step; i <= maxUnits; i += step) arr.push(i);
    return arr;
  }, [maxUnits, step]);

  const transitionStyle = smooth ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';

  return (
    <div style={{ ...faceStyle, width: clockSize, height: clockSize }}>
      <div
        style={{
          ...handStyle,
          width: `calc(${thickness} + 12px)`,
          height: '500%',
          backgroundColor: '#F7F3F3',
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transition: transitionStyle,
          zIndex: 1,
        }}
      />
      <div
        style={{
          ...handStyle,
          width: thickness,
          height: '500%',
          backgroundColor: color,
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transition: transitionStyle,
          zIndex: 2,
        }}
      />
      {markers.map((num) => {
        const rotation = (num * (360 / maxUnits)) - 90;
        const radius = (clockSize / 2) * 0.82;
        return (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(${radius}px) rotate(${-rotation}deg)`,
              fontSize: `calc(${clockSize}px * 0.11)`,
              fontFamily: `'${fontName}', sans-serif`,
              fontWeight: '800',
              color: '#FFFFFF',
              mixBlendMode: 'difference',
              zIndex: 100,
              pointerEvents: 'none',
            //   textShadow: '0px 0px 2px rgba(0,0,0,0.2)'
            }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

// --- Styles ---
const containerStyle = {
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // LINEAR GRADIENT BACKGROUND
  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  position: 'relative'
};

const backgroundWrapperStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  overflow: 'hidden',
  pointerEvents: 'none'
};

const clockGridStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const faceStyle = {
  position: 'relative',
  background: 'transparent',
};

const handStyle = {
  position: 'absolute',
  left: '50%',
  bottom: '50%',
  transformOrigin: '50% 100%',
  borderRadius: '12px 12px 0 0',
};