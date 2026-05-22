import React, { useState } from 'react';
import { useClockTime } from '@/hooks/useClockTime';
import bg1 from '@/assets/images/25_images/25-11/25-11-17/mars2.webp';
import bg2 from '@/assets/images/25_images/25-11/25-11-17/mars1.gif';
import bg3 from '@/assets/images/25_images/25-11/25-11-17/mars1.gif';
import bg4 from '@/assets/images/25_images/25-11/25-11-17/mars5.webp';
import font2025_11_18 from '@/assets/fonts/25fonts/25-11-17-mars.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

export { bg1, bg2, bg3, bg4 };

export const fontConfigs = [
  {
    fontFamily: 'ClockFont',
    fontUrl: font2025_11_18,
  },
];

// Helper function to pad numbers with a leading zero
const two = (n: number) => String(n).padStart(2, '0');

// DigitBox component extracted for clarity
const DigitBox = ({ children }) => (
  <div className="digitBox" style={localStyles.digitBox}>
    {children}
  </div>
);

export default function MarsDigitalClock() {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  // Assume font is loaded by useSuspenseFontLoader for rendering purposes
  const [fontLoaded] = useState<boolean>(true);

  const hoursStr = two(time.getHours());
  const minutesStr = two(time.getMinutes());
  const secondsStr = two(time.getSeconds());
  const msStr = '00'; // Milliseconds not available with useClockTime
  return (
    <>
      <style>{localStyles.fontFace}</style>
      <style>{`
        @media (max-width: 768px) {
          .content {
            flex-direction: column !important;
          }
          .digitBox {
            font-size: 12vw !important;
            width: 12vw !important;
            height: 12vw !important;
          }
        }
      `}</style>

      <div style={styles.root}>
        <div style={localStyles.background4} aria-hidden="true"></div>
        <div style={localStyles.gradientBackground}></div>
        <div style={localStyles.background1}></div>
        <div style={localStyles.background2}></div>
        <div style={localStyles.background3}></div>

        <div className="content" style={localStyles.content}>
          <div className="group" style={localStyles.group}>
            <DigitBox>{hoursStr[0]}</DigitBox>
            <DigitBox>{hoursStr[1]}</DigitBox>
          </div>

          <div className="group" style={localStyles.group}>
            <DigitBox>{minutesStr[0]}</DigitBox>
            <DigitBox>{minutesStr[1]}</DigitBox>
          </div>

          <div className="group" style={localStyles.group}>
            <DigitBox>{secondsStr[0]}</DigitBox>
            <DigitBox>{secondsStr[1]}</DigitBox>
          </div>

          <div className="group" style={localStyles.group}>
            <DigitBox>{msStr[0]}</DigitBox>
            <DigitBox>{msStr[1]}</DigitBox>
          </div>
        </div>
      </div>
    </>
  );
}

// Inline styles are often better moved to CSS modules or a separate file.
// For now, keeping them as a local constant.
const localStyles = {
  fontFace: `
    @font-face {
      font-family: 'ClockFont';
      src: url(${font2025_11_18}) format('truetype');
      font-display: swap;
    }
  `,
  /* Mars four - behind everything else */
  background4: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bg4})`,
    backgroundSize: '130% 130%',
    opacity: 0.7,
    backgroundBlendMode: 'multiply',
    backgroundColor: 'red',
    filter: 'brightness(1.7) contrast(1.2)',
    // backgroundRepeat: "no-repeat",
    backgroundPosition: 'center',
    zIndex: 1,
  },

  root: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily:
      "ClockFont, Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
    overflow: 'hidden',
    padding: '2vh',
    boxSizing: 'border-box',
    opacity: 1, // Font loading is handled by useSuspenseFontLoader
    transition: 'opacity 0.35s ease-out',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(188deg, #F3061AFF, #181717FF)',
    zIndex: 0, // gradient behind everything
  },
  background1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'contain',

    backgroundPosition: 'center',
    filter: 'hue-rotate(-20deg) saturate(1.8) contrast(1.8) brightness(1.2)',
    zIndex: 1,
    // opacity: 0.3, // 60% opacity
  },
  background2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${bg2})`,
    backgroundSize: '100% 100%', // <— Stretch to fill container
    backgroundPosition: 'center',
    opacity: 0.5,
    zIndex: 2,
  },

  background3: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bg3})`,
    backgroundSize: '100% 100%', // <— Stretch to fill container
    backgroundPosition: 'center',
    transform: 'rotate(180deg)',
    opacity: 0.5,
    zIndex: 3,
  },

  content: {
    position: 'relative',
    zIndex: 4, // above all backgrounds
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2vh',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1vh',
  },
  digitBox: {
    width: '10vh',
    height: '11vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11vh',
    color: '#EF2005FF',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textShadow: '-1px -1px 0 #040404FF, 1px 1px 0 #F7F8BFFF',
  },
};
