import { useState, useEffect } from 'react';
import backgroundVideo from './sput.mp4';     // ← Your looping video
import fallbackImage from './sput.webp';       // ← Fallback static image
import fontFile20251123 from './day.ttf';      // ← Your custom font
import secondHandImg from './sputnik.png';     // ← Sputnik second hand

// Load custom font
const fontFace = new FontFace('CustomFont', `url(${fontFile20251123})`);
fontFace.load().then((loadedFace) => {
  document.fonts.add(loadedFace);
});

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  // Smooth 60 fps update
  useEffect(() => {
    let frame;
    const tick = () => {
      setTime(new Date());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Time calculations
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  // Digit markers (12, 1, 2, ..., 11)
  const digitMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const radius = 22; // Increased from 15 to make clock face larger
    const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = radius * Math.sin((angle - 90) * (Math.PI / 180));

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(${x}vmin, ${y}vmin) translate(-50%, -50%)`,
          fontSize: '10vmin', // Increased from 8vmin for better visibility
        //   fontWeight: 'bold',
          color: '#CBC8CBFF',
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
          userSelect: 'none',
            pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 2,
        }}
      >
        {i === 0 ? '12' : i}
      </div>
    );
  });

  return (
    // Full-screen fixed container — background guaranteed visible
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        fontFamily: 'CustomFont, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#262726FF', // safety fallback
      }}
    >
      {/* Looping video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Fallback static image (shows if video fails) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      />

      {/* Optional subtle dark overlay for better contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,111,0.6) 100%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* Clock face */}
      <div
        style={{
          position: 'relative',
          borderRadius: '50%',
          zIndex: 4,
        }}
      >
        {/* Numbers */}
        {digitMarkers}

      {/* Hour hand */}
<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12vmin',
    height: '1.2vmin',
    background: '#f0f0f0',
    transform: `translate(0, -50%) rotate(${hourAngle}deg)`,
    transformOrigin: 'left center',
    borderRadius: '0 1vmin 1vmin 0',
    opacity: 0.7,
    boxShadow: '0 0 4vmin rgba(0,0,0,0.6)',
    zIndex: 5,
  }}
/>

{/* Minute hand */}
<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '18vmin',
    height: '0.8vmin',
    background: '#ddd',
    transform: `translate(0, -50%) rotate(${minuteAngle}deg)`,
    transformOrigin: 'left center',
    borderRadius: '0 1vmin 1vmin 0',
    opacity: 0.7,
    boxShadow: '0 0 4vmin rgba(0,0,0,0.6)',
    zIndex: 6,
  }}
/>


        {/* Sputnik second hand (image) */}
        <img
          src={secondHandImg}
          alt="Second hand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '25vmin', 
            height: 'auto',
            transform: `translate(0, -50%) rotate(${secondAngle}deg)`,
            transformOrigin: 'left center',
            zIndex: 9,
              userSelect: 'none',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        {/* Center dot */}
       
      </div>
    </div>
  );
}