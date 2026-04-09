import React, { useEffect, useState, useRef } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-09/water.mp4';

const Clock: React.FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [digitTransforms, setDigitTransforms] = useState([
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
  ]);
  const timeRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const time = useClockTime();

  useEffect(() => {
    import('@/assets/fonts/26-04-09-water.ttf').then((fontModule) => {
      const fontUrl = (fontModule as { default: string }).default;
      const waterFont = new FontFace('Water', `url(${fontUrl})`);
      waterFont.load().then((font) => {
        document.fonts.add(font);
        setFontLoaded(true);
      });
    });
  }, []);

  // Independent motion animation for each digit - choppy water chaos
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.025; // Faster time increment
      const t = timeRef.current;

      // Chaotic choppy wave motion - bigger, faster, more random
      const newTransforms = [
        // Digit 0 (first hour digit) - big choppy waves
        {
          y: Math.sin(t * 1.5) * 18 + Math.cos(t * 2.3) * 12 + Math.sin(t * 3.7) * 6,
          rotate: Math.sin(t * 1.2) * 25 + Math.cos(t * 1.8) * 15 + Math.sin(t * 4.2) * 8,
          scale: 1 + Math.sin(t * 0.9) * 0.08 + Math.cos(t * 2.1) * 0.04,
        },
        // Digit 1 (second hour digit) - erratic chop
        {
          y: Math.cos(t * 1.7) * 22 + Math.sin(t * 2.9) * 10 + Math.cos(t * 4.5) * 7,
          rotate: Math.cos(t * 1.4) * 30 + Math.sin(t * 2.1) * 12 + Math.cos(t * 3.8) * 9,
          scale: 1 + Math.cos(t * 1.1) * 0.09 + Math.sin(t * 2.7) * 0.05,
        },
        // Digit 2 (first minute digit) - rapid turbulent
        {
          y: Math.sin(t * 2.0) * 20 + Math.sin(t * 3.4) * 14 + Math.cos(t * 5.2) * 5,
          rotate: Math.sin(t * 1.6) * 28 + Math.cos(t * 2.5) * 14 + Math.sin(t * 4.8) * 10,
          scale: 1 + Math.sin(t * 1.3) * 0.07 + Math.cos(t * 3.3) * 0.06,
        },
        // Digit 3 (second minute digit) - wild surge
        {
          y: Math.cos(t * 1.8) * 24 + Math.cos(t * 3.1) * 11 + Math.sin(t * 4.9) * 8,
          rotate: Math.cos(t * 1.3) * 32 + Math.sin(t * 2.7) * 16 + Math.cos(t * 4.1) * 11,
          scale: 1 + Math.cos(t * 1.0) * 0.1 + Math.sin(t * 2.9) * 0.05,
        },
      ];

      setDigitTransforms(newTransforms);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 24-hour format with leading zeros, no seconds
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const digits = [h[0], h[1], m[0], m[1]];

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const digitBoxStyle = (index: number): React.CSSProperties => {
    const transform = digitTransforms[index];
    return {
      width: 'clamp(3rem, 12vw, 10rem)',
      height: 'clamp(4rem, 15vw, 12rem)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 'clamp(2.5rem, 12vw, 10rem)',
      color: '#fff',
      fontFamily: fontLoaded ? 'Water, monospace' : 'monospace',
      fontWeight: 300,
      transform: `translateY(${transform!.y}px) rotate(${transform!.rotate}deg) scale(${transform!.scale})`,
      willChange: 'transform',
    };
  };

  const digitsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };

  const spaceStyle: React.CSSProperties = {
    width: '1rem',
  };

  return (
    <div style={containerStyle}>
      <video style={videoStyle} autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div style={clockWrapperStyle}>
        <div style={digitsContainerStyle}>
          <span style={digitBoxStyle(0)}>{digits[0]}</span>
          <span style={digitBoxStyle(1)}>{digits[1]}</span>
          <span style={spaceStyle}></span>
          <span style={digitBoxStyle(2)}>{digits[2]}</span>
          <span style={digitBoxStyle(3)}>{digits[3]}</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;
