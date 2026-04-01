import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import { useMillisecondClock } from '../../../../utils/useSmoothClock';
import styles from './Clock.module.css';

import dripFont from '../../../../assets/fonts/26-01-31-cond.ttf?url';
import analogBgImage from '../../../../assets/images/2026/26-02/26-02-01/rain.webp';

export const background = analogBgImage;

const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    silverText:
      'linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 45%, #C5C1C1 50%, #D3D8F3 100%)',
    hourHand: 'linear-gradient(to right, #959595, #ffffff, #959595)',
    minuteHand: 'linear-gradient(to right, #B0B0B0, #ffffff, #B0B0B0)',
    secondHand: 'linear-gradient(to top, #5F709F, #889AD4)',
  },
};

const AnalogClock: React.FC = () => {
  const now = useMillisecondClock();
  
  const fontConfigs = useMemo(() => [{
      fontFamily: 'BorrowedAnalog',
      fontUrl: dripFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
  }], []);
  
  useSuspenseFontLoader(fontConfigs);

  const msec = now.getMilliseconds();
  const sec = now.getSeconds() + msec / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  const renderedNumerals = useMemo(() => {
    const numbersToShow = [12, 3, 6, 9];
    return numbersToShow.map((num) => {
      const angle = (num / 12) * 2 * Math.PI;
      const x = 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angle);
      const y = 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angle);

      return (
        <div
          key={num}
          className={styles.numeralBase}
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* Background Layer */}
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${analogBgImage})`,
        }}
      />

      {/* Clock Face Layer */}
      <div className={styles.face}>
        {renderedNumerals}

        {/* Hour Hand */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{
            transform: `translate(-50%, 0) rotate(${hr * 30}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          className={`${styles.hand} ${styles.minHand}`}
          style={{
            transform: `translate(-50%, 0) rotate(${min * 6}deg)`,
          }}
        />

        {/* Second Hand */}
        <div
          className={`${styles.hand} ${styles.secHand}`}
          style={{
            transform: `translate(-50%, 0) rotate(${sec * 6}deg)`,
          }}
        />

        {/* Center Cap */}
        <div className={styles.centerDot} />
      </div>
    </div>
  );
};

export default AnalogClock;
