import { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
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
import { useClock } from '@/utils/hooks';
export const assets = [
  hmmGif,
  hummPng,
  hum1,
  hum2,
  hum3,
  hum4,
  hum7,
  hum8,
  hum9,
];

const birdSources = [hum1, hum2, hum3, hum4, hum7, hum8, hum9];

// Generate unique flight paths for each bird
function generateFlightPath() {
  const random = (min: number, max: number) =>
    min + Math.random() * (max - min);
  const keyframes = [];
  let x = random(-40, 40);
  let y = random(-40, 40);
  let rot = random(-15, 15);
  let scale = random(0.9, 1.1);

  for (let i = 0; i <= 100; i += 10) {
    // Hummingbird behavior: hover, dart, hover
    if (i % 30 === 0 && i > 0) {
      // Dart to new position
      x += random(-25, 25);
      y += random(-25, 25);
      rot += random(-30, 30);
      scale = random(0.85, 1.15);
    } else {
      // Hover - small movements
      x += random(-3, 3);
      y += random(-3, 3);
      rot += random(-5, 5);
    }

    // Clamp to viewport
    x = Math.max(-45, Math.min(45, x));
    y = Math.max(-45, Math.min(45, y));

    keyframes.push(
      `${i}% { transform: translate(${x}vw, ${y}vh) rotate(${rot}deg) scale(${scale.toFixed(2)}); }`,
    );
  }

  return keyframes.join('\n');
}

// Generate random initial position for each bird
function getInitialPosition(index: number) {
  const seeds = [123, 456, 789, 234, 567, 890, 345];
  const seed = seeds[index % seeds.length];
  const random = (min: number, max: number) => {
    const r = ((seed * 9301 + 49297) % 233280) / 233280;
    return min + r * (max - min);
  };
  return {
    left: `${random(10, 90)}%`,
    top: `${random(15, 85)}%`,
  };
}

const birdConfigs = birdSources.map((src, i) => {
  const pos = getInitialPosition(i);
  return {
    src,
    delay: `${i * 1.5}s`,
    duration: `${18 + i * 2}s`,
    initialLeft: pos.left,
    initialTop: pos.top,
    keyframes: generateFlightPath(),
  };
});

const HummingbirdClock = () => {
  const time = useClock();
  useSuspenseFontLoader([{ fontFamily: 'humm', fontUrl: hummFont }]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Generate keyframes for each bird
  const styleSheets = useMemo(
    () =>
      birdConfigs
        .map(
          (bird, i) => `
    @keyframes float-bird-${i} {
      ${bird.keyframes}
    }
  `,
        )
        .join('\n'),
    [],
  );

  return (
    <>
      <style>{styleSheets}</style>
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
          src={hmmPng}
          alt="BG"
          style={styles.bgImageFlipped}
        />

        <div style={styles.clock}>
          <div style={{ ...styles.number, ...styles.numTwelve }}>twelve</div>
          <div style={{ ...styles.number, ...styles.numThree }}>three</div>
          <div style={{ ...styles.number, ...styles.numSix }}>six</div>
          <div style={{ ...styles.number, ...styles.numNine }}>nine</div>

          <div
            id="hour-hand"
            style={{
              ...styles.hand,
              ...styles.hourHand,
              transform: `rotate(${hourAngle}deg)`,
            }}
          />
          <div
            id="minute-hand"
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              transform: `rotate(${minuteAngle}deg)`,
            }}
          />
          <div
            id="second-hand"
            style={{
              ...styles.hand,
              ...styles.secondHand,
              transform: `rotate(${secondAngle}deg)`,
            }}
          />
        </div>

        {birdConfigs.map((bird, i) => (
          <img
            key={i}
            id={`float-${i}`}
            src={bird.src}
            alt={`Hummingbird ${i + 1}`}
            style={{
              ...styles.floatingImage,
              animationName: `float-bird-${i}`,
              animationDelay: bird.delay,
              animationDuration: bird.duration,
              left: bird.initialLeft,
              top: bird.initialTop,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </div>
    </>
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
    height: '100dvh',
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
    height: '100dvh',
    opacity: 0.8,
    zIndex: 3,
    transform: 'scaleX(-1)',
  },
  clock: {
    width: '95dvh',
    height: '90dvh',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 5,
  },
  number: {
    position: 'absolute',
    fontFamily: 'humm',
    fontSize: '14dvh',
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
    width: '8dvh',
    height: '8dvh',
    objectFit: 'cover',
    borderRadius: '1rem',
    zIndex: 7,
    pointerEvents: 'none',
    willChange: 'transform',
    transformOrigin: 'center center',
  },
} as const;

export default HummingbirdClock;
