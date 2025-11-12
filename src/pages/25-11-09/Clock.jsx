// src/components/DarkRomanClock.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Font20251111 from './disc.ttf';       // main Roman font
import ActiveFont20251111 from './pin.ttf'; // active digit font

const ROMAN_NUMERALS = [
  'I','II','III','IV','V','VI','VII','VIII','IX','X',
  'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX',
  'XXI','XXII','XXIII','XXIV','XXV','XXVI','XXVII','XXVIII','XXIX','XXX',
  'XXXI','XXXII','XXXIII','XXXIV','XXXV','XXXVI','XXXVII','XXXVIII','XXXIX','XL',
  'XLI','XLII','XLIII','XLIV','XLV','XLVI','XLVII','XLVIII','XLIX','L',
  'LI','LII','LIII','LIV','LV','LVI','LVII','LVIII','LIX','LX'
];

// Helpers
const romanByIndex = (i) => ROMAN_NUMERALS[i];
const timeValueToIndex = (value, max) => (value + max - 1) % max;

const DarkRomanClock = () => {
  const [time, setTime] = useState(new Date());

  // ~60fps update
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 16);
    return () => clearInterval(id);
  }, []);

  const totalSeconds =
    time.getHours() * 3600 +
    time.getMinutes() * 60 +
    time.getSeconds() +
    time.getMilliseconds() / 1000;

  const ALIGNMENT_DEGREE = 180;

  const hourAngle = useMemo(
    () => ((totalSeconds / 3600) / 24) * -360 + ALIGNMENT_DEGREE,
    [totalSeconds]
  );
  const minuteAngle = useMemo(
    () => ((totalSeconds / 60) / 60) * -360 + ALIGNMENT_DEGREE,
    [totalSeconds]
  );
  const secondAngle = useMemo(
    () => ((totalSeconds % 60) / 60) * -360 + ALIGNMENT_DEGREE,
    [totalSeconds]
  );

  const currentH = time.getHours();
  const currentM = time.getMinutes();
  const currentS = time.getSeconds();

  const hoursActiveIndex = timeValueToIndex(currentH, 24);
  const minutesActiveIndex = timeValueToIndex(currentM, 60);
  const secondsActiveIndex = timeValueToIndex(currentS, 60);

  // Inject fonts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'RomanFont20251111';
        src: url(${Font20251111}) format('truetype');
      }
      @font-face {
        font-family: 'ActiveFont20251111';
        src: url(${ActiveFont20251111}) format('truetype');
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderNumerals = (count, activeIndex, radiusVH, keyPrefix) => {
    const numerals = [];
    const innerRadiusVH = radiusVH * 0.3;
    const radiusStep = (radiusVH - innerRadiusVH) / Math.max(1, count / 4);

    for (let i = 0; i < count; i++) {
      const angle = 90 + i * (360 / count);
      const angleRad = (angle * Math.PI) / 180;
      const isActive = i === activeIndex;
      const numPerSpoke = Math.ceil(count / 12);
      const spokeIndex = i % numPerSpoke;
      const r = innerRadiusVH + spokeIndex * radiusStep;
      const x = r * Math.cos(angleRad);
      const y = r * Math.sin(angleRad);

      numerals.push(
        <div
          key={`${keyPrefix}-${i}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${x}vh)`,
            top: `calc(50% + ${y}vh)`,
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
            fontFamily: isActive
              ? 'ActiveFont20251111, serif'
              : 'RomanFont20251111, serif',
            fontSize: isActive ? '20.0vh' : '1.5vh',
            color: isActive ? '#F068E7FF' : '#DAF858FF',
            textShadow: isActive
              ? '1px 1px 0vh #EFE9ECFF, 2px -2px 0vh #110E09FF'
              : '1px 1px 0.1vh #080102FF',
            transition: 'all 0.12s linear',
            whiteSpace: 'nowrap',
            opacity: isActive ? 0.5 : 1.0, // active digit opacity updated here
            zIndex: isActive ? 1 : 2,
          }}
        >
          {romanByIndex(i)}
        </div>
      );
    }
    return numerals;
  };

  const renderRing = (sizeVH, rotationAngle, numerals) => (
    <div
      style={{
        position: 'absolute',
        width: `${sizeVH}vh`,
        height: `${sizeVH}vh`,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
        borderRadius: '50%',
        transition: 'transform 0.016s linear',
      }}
    >
      {numerals}
    </div>
  );

  const hourRadiusVH = 17;
  const minuteRadiusVH = 44;
  const secondRadiusVH = 84;

  const hoursRing = renderRing(
    hourRadiusVH * 2.2,
    hourAngle,
    renderNumerals(24, hoursActiveIndex, hourRadiusVH, 'h')
  );

  const minutesRing = renderRing(
    minuteRadiusVH * 2.2,
    minuteAngle,
    renderNumerals(60, minutesActiveIndex, minuteRadiusVH, 'm')
  );

  const secondsRing = renderRing(
    secondRadiusVH * 2.2,
    secondAngle,
    renderNumerals(60, secondsActiveIndex, secondRadiusVH, 's')
  );

  return (
    <div
      style={{
        background: 'linear-gradient(185deg, #690ABBFF 0%, #312802FF 100%)',
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hoursRing}
      {minutesRing}
      {secondsRing}
    </div>
  );
};

export default DarkRomanClock;
