import React, { useEffect, useState } from 'react';
import digit7  from '../../../assets/images/26-02/26-02-22/1.webp';
import digit4  from '../../../assets/images/26-02/26-02-22/2.webp';
import digit12 from '../../../assets/images/26-02/26-02-22/3.webp';
import digit3  from '../../../assets/images/26-02/26-02-22/4.webp';
import digit11 from '../../../assets/images/26-02/26-02-22/5.webp';
import digit9  from '../../../assets/images/26-02/26-02-22/6.webp';
import digit2  from '../../../assets/images/26-02/26-02-22/7.webp';
import digit10 from '../../../assets/images/26-02/26-02-22/8.webp';
import digit6  from '../../../assets/images/26-02/26-02-22/9.webp';
import digit5  from '../../../assets/images/26-02/26-02-22/10.webp';
import digit8  from '../../../assets/images/26-02/26-02-22/11.webp';
import digit1  from '../../../assets/images/26-02/26-02-22/12.webp';

const DIGIT_IMAGES = [
  digit12, digit1, digit2, digit3, digit4, digit5,
  digit6,  digit7, digit8, digit9, digit11, digit10,
];

// ─────────────────────────────────────────────────────────────
// SVG clock hand — tapered "sword" shape with tip glow
//
// ViewBox 200×200, centre = (100,100). Face radius = 100 units.
//
// Props:
//   angle      – CSS rotation in degrees, 0° = 12 o'clock
//   length     – tip reach as fraction of face radius  (0–1)
//   tail       – counterweight as fraction of radius   (0–1)
//   baseW      – half-width at pivot, in SVG units
//   tipW       – half-width at tip,   in SVG units
//   color      – fill color
//   glowColor  – bloom color (defaults to color)
//   zIndex
// ─────────────────────────────────────────────────────────────
const ClockHand = ({
  angle,
  length,
  tail = 0.08,
  baseW = 4,
  tipW  = 0.8,
  color,
  glowColor,
  zIndex,
}) => {
  const glow = glowColor || color;

  const tipY  = 100 - length * 100;   // toward 12 o'clock
  const tailY = 100 + tail   * 100;   // counterweight end

  // Tapered polygon: tip → right shoulder → right tail → left tail → left shoulder
  const pts = [
    `100,${tipY}`,
    `${100 + baseW},${100 + 4}`,
    `${100 + tipW * 0.5},${tailY}`,
    `${100 - tipW * 0.5},${tailY}`,
    `${100 - baseW},${100 + 4}`,
  ].join(' ');

  const uid = color.replace(/[^a-z0-9]/gi, '');

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'center center',
      zIndex,
      pointerEvents: 'none',
    }}>
      <svg
        viewBox="0 0 200 200"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%"  stopColor={color}   stopOpacity="1"    />
            <stop offset="75%"  stopColor={color}   stopOpacity="0.85" />
            <stop offset="100%" stopColor={color}   stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Bloom layer */}
        <polygon
          points={pts}
          fill={glow}
          opacity="0.4"
          filter={`url(#glow-${uid})`}
        />

        {/* Main hand body */}
        <polygon
          points={pts}
          fill={`url(#grad-${uid})`}
        />

        {/* Spine highlight */}
        <line
          x1="100" y1={tipY + 3}
          x2="100" y2={100 + 2}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────

const AnalogDigitalClock = () => {
  const [time, setTime]             = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace(
      'DigitalClock',
      'url(../../../assets/fonts/26-02-22/digital-clock.woff2)',
    );
    font.load()
      .then(() => { document.fonts.add(font); setFontLoaded(true); })
      .catch(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // CSS rotate(0°) points right → subtract 90° to put 0 at 12 o'clock
  const hourAngle   = hours   * 30  + minutes * 0.5  - 90;
  const minuteAngle = minutes * 6   + seconds * 0.1  - 90;
  const secondAngle = seconds * 6                    - 90;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at center, #B0AEAE, #807F7F)',
    overflow: 'hidden',
    opacity: fontLoaded ? 1 : 0,
    visibility: fontLoaded ? 'visible' : 'hidden',
    transition: 'opacity 0.5s ease, visibility 0.5s ease',
  };

  const clockFaceStyle = {
    width: '90vmin',
    height: '90vmin',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '50%',
    position: 'relative',
  };

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5.5vmin',
    height: '5.5vmin',
    backgroundColor: '#E5E5E5',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 6vmin #F6F4F4, 0 0 10vmin #CBCACA, inset 0 0 2vmin #9B9A9A',
    border: '0.6vmin solid #BCBBBB',
    zIndex: 10,
  };

  const digitStyle = (angle) => ({
    position: 'absolute',
    width: '22vmin',
    height: '22vmin',
    top: '50%',
    left: '50%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transform:
      `translate(-50%, -50%) ` +
      `rotate(${angle}deg) ` +
      `translateY(-38vmin) ` +
      `rotate(-${angle}deg)`,
    transformOrigin: 'center center',
    filter: 'drop-shadow(0 0 2.5vmin rgba(70, 134, 57, 0.55)) brightness(1.06)',
    zIndex: 5,
  });

  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>

        {/* Digit images — completely untouched */}
        {DIGIT_IMAGES.map((src, i) => (
          <div
            key={i}
            style={{ ...digitStyle(i * 30), backgroundImage: `url(${src})` }}
          />
        ))}

        {/*
          Clock hands
          ──────────────────────────────────────────────────────
          z-index order:  hour(1) < minute(2) < second(3) < digits(5) < dot(10)
          length / tail:  fraction of face radius
        */}

        {/* Hour — short, wide, darkest */}
        <ClockHand
          angle={hourAngle}
          length={0.52}
          tail={0.12}
          baseW={5.5}
          tipW={1.4}
          color="#C0C0C0"
          glowColor="#E8E8E8"
          zIndex={1}
        />

        {/* Minute — medium length + width */}
        <ClockHand
          angle={minuteAngle}
          length={0.72}
          tail={0.11}
          baseW={3.8}
          tipW={1.0}
          color="#D3D3D3"
          glowColor="#F0F0F0"
          zIndex={2}
        />

        {/* Second — longest, razor-thin, vivid red, long counterweight */}
        <ClockHand
          angle={secondAngle}
          length={0.82}
          tail={0.22}
          baseW={1.6}
          tipW={0.4}
          color="#B8B8B8"
          glowColor="#E0E0E0"
          zIndex={3}
        />

        {/* Center dot — on top of all hands */}
        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

export default AnalogDigitalClock;
