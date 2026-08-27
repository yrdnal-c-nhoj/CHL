import React, { useState, useEffect, useRef } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader'; // Asset Imports
import clockFont from '@/assets/fonts/26fonts/26-01-30-ne.ttf';
import bgLayer1 from '@/assets/images/26_images/26-01/26-01-30/new.webp';
import bgLayer2 from '@/assets/images/26_images/26-01/26-01-30/nes.gif';
// import bgLayer3 from '@/assets/images/26_images/26-01/26-01-30/ne3.gif';
import { useSecondClock } from '@/utils/hooks';
export const assets = [clockFont, bgLayer1, bgLayer2, bgLayer3];

const DigitalClock =  () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const [bgPos, setBgPos] = useState<any>({ x: 0, y: 0 });

  const requestRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const brain = useRef({
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    speed: 0.005,
    turnStrength: 0.008,
    confusionTimer: 0,
  });

  useEffect(() => {
      setTime(time);
    }, [time]);

  const rawHours = time.getHours();
  const hours = rawHours % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden',
    },
    imageLayer1: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '130%',
      objectFit: 'cover',
      zIndex: 2,
      opacity: 0.5,
      filter: 'contrast(140%) brightness(1.3) hue-rotate(15deg) saturate(170%)',
      pointerEvents: 'none',
    },
    imageLayer2: {
      position: 'absolute',
      inset: 0,
      zIndex: 3,
      pointerEvents: 'none',
      backgroundImage: `url(${bgLayer2})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '220px 220px',
      animation: 'tileMove 8s linear infinite',
      opacity: 0.4,
      filter: 'drop-shadow(5px -5px 0 white)',
    },
    // imageLayer3: {
    //   position: 'absolute',
    //   top: '50%',
    //   left: '50%',
    //   width: '30%',
    //   height: '30%',
    //   objectFit: 'contain',
    //   zIndex: 7,
    //   opacity: 0.75,
    //   filter: 'drop-shadow(1px -1px 0 white)',
    //   pointerEvents: 'none',
    //   willChange: 'transform',
    //   transform: `translate(-50%, -50%) translate(${bgPos.x}vw, ${bgPos.y}vh) rotate(${bgPos.x * 1.6}deg)`,
    // },
    uiWrapper: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      color: '#CFDEEAB8',
      textShadow: '0 0 20px rgba(255,255,255,0.2)',
    },
    timeText: {
      fontFamily: 'MyCustomFont, sans-serif',
      fontSize: 'clamp(3rem, 15vw, 10rem)',
      lineHeight: 1,
      fontStyle: 'italic',
      transform: 'skewX(-25deg)',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    ampmText: {
      fontSize: '0.4em',
      verticalAlign: 'middle',
      marginLeft: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <img
        decoding="async"
        loading="lazy"
        src={bgLayer1}
        alt=""
        style={styles.imageLayer1}
      />
      <div style={styles.imageLayer2} />
      {/* <img decoding="async" loading="lazy" src={bgLayer3} alt="" style={styles.imageLayer3} /> */}
      <div style={styles.uiWrapper}>
        <div style={styles.timeText}>
          {hours}:{minutes} <span style={styles.ampmText}>{ampm}</span>
        </div>
      </div>
    </div>
  );
}

export default DigitalClock;
