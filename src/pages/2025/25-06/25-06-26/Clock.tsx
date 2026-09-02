import React, { useEffect } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bg1 from '@/assets/images/25_images/25-06/25-06-26/co.png';
import bg2 from '@/assets/images/25_images/25-06/25-06-26/cos.png';
import wheFont from '@/assets/fonts/25fonts/25-06-26-whe.ttf';
import { useClock } from '@/utils/hooks';
export const assets = [bg1, bg2, wheFont];

const CosmicWheelClock =  () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'whe',
      fontUrl: wheFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  // Font loading handled by useSuspenseFontLoader
  // useEffect for updateClock removed - time is reactive via useClock

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#dbd7ca',

    overflow: 'hidden',
    position: 'relative',
  };

  const clockContainer = {
    zIndex: 4,
    display: 'flex',
    flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
    alignItems: 'center',
  };

  const timeSection = {
    display: 'flex',
  };

  const digitBox = (index) => ({
    fontFamily: 'whe',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '1 / 1',
    fontSize: '10rem',
    width: '8rem',
    height: '8rem',
    color: 'red',
    background: 'transparent',
    WebkitTextFillColor: 'transparent',
    backgroundImage: `url(${bg2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    animation: `${index % 2 === 0 ? 'spinClockwise' : 'spinCounter'} 30s linear infinite`,
  });

  const bgImgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(0.9) invert()',
    zIndex: 1,
    opacity: 0.9,
    animation: 'slow-rotate 120s linear infinite',
    transformOrigin: 'center center',
  };

  const bgImg2Style = {
    ...bgImgStyle,
    zIndex: 2,
    opacity: 0.5,
    animation: 'slowrotate 120s linear infinite',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes slow-rotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(-360deg) scale(1.5); }
        }
        @keyframes slowrotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}</style>

      <img
        decoding="async"
        loading="lazy"
        src={bg1}
        alt="Background 1"
        style={bgImgStyle}
      />
      <img
        decoding="async"
        loading="lazy"
        src={bg2}
        alt="Background 2"
        style={bgImg2Style}
      />

      <div style={clockContainer}>
        {['hours', 'minutes', 'seconds'].map((section) => (
          <div style={timeSection} id={section} key={section}>
            {[0, 1].map((i) => (
              <div key={i} className="digit-box" style={digitBox(i)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CosmicWheelClock;
