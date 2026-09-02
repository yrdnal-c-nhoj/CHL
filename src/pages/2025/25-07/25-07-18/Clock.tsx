import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgImage from '@/assets/images/25_images/25-07/25-07-18/558074085193-ezgif.com-optiwebp-1.webp';
import xrayFontUrl from '@/assets/fonts/25fonts/25-07-18-xray.ttf';
import { useSmoothClock } from '@/utils/hooks';
export const assets = [bgImage, xrayFontUrl];


const HospitalClock = () => {
  const time = useSmoothClock();

  const timeString = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [time]);

  const fontConfigs = [
    {
      fontFamily: 'xray',
      fontUrl: xrayFontUrl,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  return (
    <div style={styles.body}>
      <div style={styles.machine}>
        <div style={{ ...styles.screen, backgroundImage: `url(${bgImage})` }}>
          <div style={styles.flickerOverlay} />
          <div style={styles.clock}>
            {timeString.split('').map((char, i) => (
              <span key={i} style={styles.digit}>
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    height: '100dvh',
    width: '100vw',
    background: '#313131FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
  },
  machine: {
    background: '#575656',
    border: '1.5rem solid #9a9595',
    borderRadius: '2rem',
    padding: '2rem',
    boxShadow:
      'inset 0 0 6dvh #000, 0 0 3dvh rgba(0,255,255,0.1), 0 0 8dvh rgba(0,255,255,0.2)',
    width: '80vw',
    maxWidth: '90rem',
    height: '60dvh',
    maxHeight: '50rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  screen: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    flexGrow: 1,
    margin: '1rem 0',
    border: '0.3rem solid rgb(201, 204, 204)',
    borderRadius: '1rem',
    position: 'relative',
    boxShadow: '0 0 1.5rem #9ca1a1, inset 0 0 6rem rgba(0,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clock: {
    display: 'flex',
    gap: '0.2rem',
    fontSize: '6vw',
    fontFamily: 'xray, monospace',
    color: '#d4dcdc',
    textShadow: '0 0 0.4rem #ebf0f0, 0 0 1.2rem #f1dddd, 0 0 2.4rem #c5caca',
    animation: 'pulse 1s infinite',
    zIndex: 2,
    position: 'relative',
  },
  digit: {
    display: 'inline-block',
    minWidth: '1ch',
    textAlign: 'center',
  },
  flickerOverlay: {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      to bottom,
      rgba(184, 190, 190, 0.03),
      rgba(0, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 3px
    )`,
    pointerEvents: 'none',
    animation: 'flicker 0.3s infinite alternate',
    zIndex: 1,
  },
} as const;

export default HospitalClock;
