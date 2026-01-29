import { useState, useEffect, useMemo } from 'react';

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
    const h = now.getHours() % 24 + m / 60; // 24-hour support

    return {
      // 360 / 24 = 15 degrees per hour
      hourAngle: h * 15,
      // 360 / 60 = 6 degrees per unit
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
  const font260128 = 'Big Shoulders Inline Text';

  // Load Google Fonts Big Shoulders Inline Text
  useEffect(() => {
    const loadGoogleFont = async () => {
      try {
        // Create and inject Google Fonts link
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);

        const link2 = document.createElement('link');
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'anonymous';
        document.head.appendChild(link2);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Inline+Text:wght@500&display=swap';
        document.head.appendChild(fontLink);

        // Wait for font to load
        await document.fonts.load('500 12px "Big Shoulders Inline Text"');
        setFontLoaded(true);

        return () => {
          // Cleanup links on unmount
          if (link.parentNode) document.head.removeChild(link);
          if (link2.parentNode) document.head.removeChild(link2);
          if (fontLink.parentNode) document.head.removeChild(fontLink);
        };
      } catch (error) {
        console.warn('Google Font loading failed:', error);
        setFontLoaded(true); // Continue without custom font
      }
    };

    loadGoogleFont();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const nextLayout = width < 900 ? 'column' : 'row';
      setLayout(nextLayout);

      let diameter;
      if (nextLayout === 'row') {
          const maxDiameterByWidth = (width / 3) * 0.9;
        const maxDiameterByHeight = height * 0.9;
        diameter = Math.min(maxDiameterByWidth, maxDiameterByHeight);
      } else {
        const maxDiameterByWidth = width * 0.9;
        const maxDiameterByHeight = (height / 3) * 0.9;
        diameter = Math.min(maxDiameterByWidth, maxDiameterByHeight);
      }
      setClockSize(diameter);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main style={containerStyle}>
      {!fontLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.2rem',
          font260128: 'monospace'
        }}>
        </div>
      )}
      <div style={{
        ...clockGridStyle,
        flexDirection: layout,
        gap: layout === 'column' ? '1vh' : '1vw',
        opacity: fontLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>
        <Clock label="HOURS" angle={hourAngle} color="#FF0000" thickness="8vh" maxUnits={24} step={1} clockSize={clockSize} font260128={font260128} />
        <Clock label="SECONDS" angle={secAngle} color="#FAD903" thickness="6vh" maxUnits={60} step={5} smooth={false} clockSize={clockSize} font260128={font260128} />      
        <Clock label="MINUTES" angle={minAngle} color="#1693FA" thickness="7vh" maxUnits={60} step={5} clockSize={clockSize} font260128={font260128} />
      </div>
    </main>
  );
}

function Clock({ angle, color, thickness, smooth = true, maxUnits, step, label, clockSize, font260128 }) {
  const markers = useMemo(() => {
    const arr = [];
    // Start from step, include maxUnits (e.g., 24 or 60 at the top)
    for (let i = step; i <= maxUnits; i += step) {
      if (i !== 0) arr.push(i); // Skip zeros
    }
    return arr;
  }, [maxUnits, step]);

  return (
    <div
      style={{
        ...faceStyle,
        width: clockSize,
        height: clockSize,
      }}
    >
    
      
      {/* Markers */}
      {markers.map((num) => {
        // -90deg offset so that 'maxUnits' (24 or 60) appears at the top (12 o'clock position)
        const rotation = (num * (360 / maxUnits)) - 90;
        // Position numbers at 82% of the radius to keep them inside the face
        const radius = (clockSize / 2) * 0.82;

        return (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              // 1. Center the div on the parent
              // 2. Rotate the path
              // 3. Move out along the rotated path
              // 4. Counter-rotate the text so it stays upright
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(${radius}px) rotate(${-rotation}deg)`,
              fontSize: `calc(${clockSize}px * 0.08)`,
              fontWeight: '500',
              color: 'rgb(7, 6, 6)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              font260128: `'${font260128}', sans-serif`,
              zIndex: 10,
            }}
          >
            {num}
          </div>
        );
      })}
   
      {/* Hand */}
      <div
        style={{
          ...handStyle,
          width: thickness,
          height: '500%',
          backgroundColor: color,
          border: '10px solid black',
        //   boxShadow: `0 0 12px ${color}88`,
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transition: smooth ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      />
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
  background: '#DED4D0',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
  font260128: 'system-ui, -apple-system, sans-serif'
};

const clockGridStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

const faceStyle = {
  position: 'relative',
  borderRadius: '50%',
//   background: 'radial-gradient(circle at center, #1A1A1A0D 0%, #0A990031 100%)',
//   border: '1px solid #333',
  flexShrink: 0,
//   boxShadow: '0 2px 50px rgba(14, 90, 4, 0.38)',
};


const handStyle = {
  position: 'absolute',
  left: '50%',
  bottom: '50%',
  transformOrigin: '50% 100%',
  borderRadius: '10px',
  zIndex: 1,
};