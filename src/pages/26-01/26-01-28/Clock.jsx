import React, { useState, useEffect, useMemo } from 'react';
import backgroundImage from '../../../assets/clocks/26-01-28/three.webp';

// --- Background Logic with Centered Dual-Axis Mirroring ---
function CheckerboardBackground() {
  const tileSize = 200;
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / tileSize) + 2,
        rows: Math.ceil(window.innerHeight / tileSize) + 2
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderedTiles = useMemo(() => {
    const tiles = [];
    const startCol = -Math.floor(dimensions.cols / 2);
    const startRow = -Math.floor(dimensions.rows / 2);

    for (let r = 0; r < dimensions.rows; r++) {
      for (let c = 0; c < dimensions.cols; c++) {
        const currCol = startCol + c;
        const currRow = startRow + r;
        const flipH = Math.abs(currCol) % 2 === 1;
        const flipV = Math.abs(currRow) % 2 === 1;
        const transform = `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;

        tiles.push(
          <div
            key={`${currRow}-${currCol}`}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              transform: transform,
              opacity: 0.6,
            }}
          />
        );
      }
    }
    return tiles;
  }, [dimensions]);

  return (
    <div style={backgroundWrapperStyle}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${dimensions.cols}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${dimensions.rows}, ${tileSize}px)`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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

// --- Main Component ---
export default function ThreeSingleHandClocks() {
  const { hourAngle, minAngle, secAngle } = useClockAngles();
  const [layout, setLayout] = useState('row');
  const [clockSize, setClockSize] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const font260128Name = 'Big Shoulders Inline Text';

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
        ? Math.min((w / 3) * 0.8, h * 0.7) 
        : Math.min(w * 0.8, (h / 3) * 0.7);
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
        gap: layout === 'column' ? '0vh' : '0vw',
        opacity: fontLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 10 
      }}>

        <Clock label="SECONDS" angle={secAngle} color="#FAD903" thickness="14%" maxUnits={60} step={1} smooth={false} clockSize={clockSize} font260128Name={font260128Name} />      
  
        <Clock label="HOURS" angle={hourAngle} color="#FF0000" thickness="18%" maxUnits={24} step={1} clockSize={clockSize} font260128Name={font260128Name} />
 
          <Clock label="MINUTES" angle={minAngle} color="#1693FA" thickness="16%" maxUnits={60} step={1} clockSize={clockSize} font260128Name={font260128Name} />
             </div>
    </main>
  );
}

// --- Clock Sub-component ---
function Clock({ angle, color, thickness, smooth = true, maxUnits, step, clockSize, font260128Name }) {
  const markers = useMemo(() => {
    const arr = [];
    for (let i = step; i <= maxUnits; i += step) arr.push(i);
    return arr;
  }, [maxUnits, step]);

  const transitionStyle = smooth ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  
  // Set the "padding" for the white border (e.g., 6px even on all sides)
  const borderWeight = 6; 
  const massiveHeight = '200vh'; 

  return (
    <div style={{ ...faceStyle, width: clockSize, height: clockSize }}>
      {/* 1. Outer Hand (White + 1px Black Border) */}
      <div
        style={{
          ...handStyle,
          width: `calc(${thickness} + ${borderWeight * 2}px)`,
          height: massiveHeight,
          backgroundColor: '#F7F3F3',
          border: '1px solid #000000',
          borderRadius: '18px',
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transition: transitionStyle,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `${borderWeight}px`, // This creates the even white border
        }}
      >
        {/* 2. Inner Hand (The color fill nested inside) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: color,
            borderRadius: '18px',
          }}
        />
      </div>

      {/* 3. Numbers */}
      {markers.map((num) => {
        const rotation = (num * (360 / maxUnits)) - 90;
        const radius = (clockSize / 2) * 1.8;
        return (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(${radius}px) rotate(${-rotation}deg)`,
              fontSize: `calc(${clockSize}px * 0.13)`,
              fontFamily: `'${font260128Name}', sans-serif`,
              color: '#1A6804',
              mixBlendMode: 'difference',
              zIndex: 22,
              pointerEvents: 'none',
              // fontWeight: 800
            }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

// --- Final Styles ---
const containerStyle = {
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(90deg, #000000 0%, #BEC1F3 50% , #000000 100%)',
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
  boxSizing: 'border-box',
};