import React, { useEffect } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader , useSuspenseFontLoader } from '@/utils/fontLoader';
import hummFont from '@/assets/fonts/25fonts/25-06-14-humm.ttf';
import hmmGif from '@/assets/images/25_images/25-06/25-06-14/hmm.gif';
import hummPng from '@/assets/images/25_images/25-06/25-06-14/humm.png';
import hum1 from '@/assets/images/25_images/25-06/25-06-14/hum1.webp';
import hum2 from '@/assets/images/25_images/25-06/25-06-14/hum2.webp';
import hum3 from '@/assets/images/25_images/25-06/25-06-14/hum3.webp';
import hum4 from '@/assets/images/25_images/25-06/25-06-14/hum4.gif';
import hum7 from '@/assets/images/25_images/25-06/25-06-14/hum7.webp';
import hum8 from '@/assets/images/25_images/25-06/25-06-14/hum8.gif';
import hum9 from '@/assets/images/25_images/25-06/25-06-14/hum9.webp';
import { useSecondClock } from '@/utils/hooks';
const floatingImages = [
  { src: hum1, animation: 'motion1' },
  { src: hum2, animation: 'motion2' },
  { src: hum3, animation: 'motion3' },
  { src: hum4, animation: 'motion4' },
  { src: hum8, animation: 'motion5' },
  { src: hum7, animation: 'motion6' },
  { src: hum9, animation: 'motion7' },
];

const HummingbirdClock =  () => {
  // useEffect for updateClock removed - time is reactive via useSecondClock

  return (
    <div style={styles.body}>
      <div
        style={{
          ...styles.bgImageLayer,
          backgroundImage: `url(${hmmGif})`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          ...styles.bgImageLayer,
          backgroundImage: `url(${hmmGif})`,
          transform: 'scaleX(-1) rotate(90deg)',
          zIndex: 2,
        }}
      />
      <img
        decoding="async"
        loading="lazy"
        src={hummPng}
        alt="BG"
        style={styles.bgImageFlipped}
      />

      <div style={styles.clock}>
        <div style={{ ...styles.number, ...styles.numTwelve }}>twelve</div>
        <div style={{ ...styles.number, ...styles.numThree }}>three</div>
        <div style={{ ...styles.number, ...styles.numSix }}>six</div>
        <div style={{ ...styles.number, ...styles.numNine }}>nine</div>

        <div id="hour-hand" style={{ ...styles.hand, ...styles.hourHand }} />
        <div
          id="minute-hand"
          style={{ ...styles.hand, ...styles.minuteHand }}
        />
        <div
          id="second-hand"
          style={{ ...styles.hand, ...styles.secondHand }}
        />
      </div>

      {floatingImages.map((img, i) => (
        <img
          decoding="async"
          loading="lazy"
          key={i}
          id={`float-${i}`}
          src={img.src}
          alt={`Float ${i}`}
          data-animation={img.animation}
          style={styles.floatingImage}
        />
      ))}
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    height: '100dvh',
    width: '100vw',
    background: '#e478d4',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bgImageLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.8,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    zIndex: 1,
    filter: 'brightness(150%)',
  },
  bgImageFlipped: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.8,
    zIndex: 3,
    transform: 'scaleX(-1)',
  },
  clock: {
    width: '95vh',
    height: '90vh',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 5,
  },
  number: {
    position: 'absolute',
    fontFamily: 'humm',
    fontSize: '14vh',
    color: '#0adb26',
    textShadow: '#f98f85 0 -2rem, #ed5ad2 0 2rem',
    opacity: 0.7,
    textAlign: 'center',
    transformOrigin: 'center',
  },
  numTwelve: {
    top: 0,
    left: '50%',
    transform: 'translateX(-50%) rotate(0deg)',
  },
  numThree: {
    top: '50%',
    right: 0,
    transform: 'translateY(-50%) rotate(90deg)',
  },
  numSix: {
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%) rotate(180deg)',
  },
  numNine: {
    top: '50%',
    left: 0,
    transform: 'translateY(-50%) rotate(270deg)',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    borderRadius: '0.8rem',
    opacity: 0.6,
    zIndex: 6,
  },
  hourHand: {
    background: '#f534e2a6',
    width: '1.5rem',
    height: '6rem',
  },
  minuteHand: {
    background: '#fca99a',
    width: '1rem',
    height: '9rem',
  },
  secondHand: {
    background: '#34f504',
    width: '0.3rem',
    height: '16rem',
  },
  floatingImage: {
    position: 'absolute',
    width: '8vh',
    height: '8vh',
    objectFit: 'cover',
    borderRadius: '1rem',
    zIndex: 7,
    pointerEvents: 'none',
  },
};

export default HummingbirdClock;
