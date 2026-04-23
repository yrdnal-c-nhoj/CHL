import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import revolution251127font from '@/assets/fonts/2025/25-11-27-dec.ttf?url';
import line251127font from '@/assets/fonts/2025/25-11-27-french.ttf?url';
import hourHandImg from '@/assets/images/2025/25-11/25-11-27/fre.webp';
import minuteHandImg from '@/assets/images/2025/25-11/25-11-27/fren.webp';
import secondHandImg from '@/assets/images/2025/25-11/25-11-27/french.webp';
import backgroundImg from '@/assets/images/2025/25-11/25-11-27/fr.jpg';
import styles from './Clock.module.css';

const fontConfigs: FontConfig[] = [
  { fontFamily: 'RevolutionaryClock251127font', fontUrl: revolution251127font },
  { fontFamily: 'Line251127font', fontUrl: line251127font },
];

export default function Clock() {
  const [time, setTime] = useState(new Date());
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  const decimalTime = useMemo(() => {
    const totalSeconds =
      time.getHours() * 3600 +
      time.getMinutes() * 60 +
      time.getSeconds() +
      time.getMilliseconds() / 1000;

    const totalDecimalSeconds = (totalSeconds / 86400) * 100000;
    return {
      h: Math.floor(totalDecimalSeconds / 10000),
      m: Math.floor((totalDecimalSeconds % 10000) / 100),
      s: totalDecimalSeconds % 100,
    };
  }, [time]);

  const handConfig = [
    {
      img: hourHandImg,
      className: styles.hourHand,
      rotation: (decimalTime.h / 10) * 360 + (decimalTime.m / 100) * 36,
      zIndex: 5,
    },
    {
      img: minuteHandImg,
      className: styles.minuteHand,
      rotation: (decimalTime.m / 100) * 360 + (decimalTime.s / 100) * 3.6,
      zIndex: 7,
    },
    {
      img: secondHandImg,
      className: styles.secondHand,
      rotation: (decimalTime.s / 100) * 360,
      zIndex: 9,
      opacity: 0.7,
    },
  ];

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className={styles.topDigits}>
        {['1', '7', '9', '3'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className={styles.dial}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((hour) => (
          <div
            key={hour}
            className={styles.markerContainer}
            style={{ transform: `rotate(${(hour / 10) * 360}deg)` }}
          >
            <div
              className={styles.hourMarker}
              style={{
                transform: `translateX(-50%) rotate(-${(hour / 10) * 360}deg)`,
              }}
            >
              {hour}
            </div>
          </div>
        ))}

        {handConfig.map(({ img, rotation, zIndex, opacity, className }, i) => (
          <div
            key={i}
            className={`${styles.handBase} ${className}`}
            style={{
              zIndex,
              opacity,
              backgroundImage: `url(${img})`,
              transform: `translateX(-50%) rotate(${rotation}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
