import React, { useEffect, useMemo, useState } from 'react';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-08/beachnite.webm?url';

export const assets = [backgroundVideo];

/* -------------------------------------------------------------------------- */
/* Clock configuration                                                        */
/* -------------------------------------------------------------------------- */

const MARKERS = Array.from({ length: 12 }, (_, index) => ({
  angle: index * 30,
  isMajor: index % 3 === 0,
}));

/* -------------------------------------------------------------------------- */
/* Smooth Bioluminescent Animations                                            */
/* -------------------------------------------------------------------------- */

const ANIMATION_STYLES = `
  @keyframes ambientPulse {
    0%, 100% {
      opacity: 0.12;
      transform: scale(0.92);
      filter: blur(2vh);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.08);
      filter: blur(4vh);
    }
  }

  @keyframes framePulse {
    0%, 100% {
      opacity: 0.25;
      border-color: rgba(64, 224, 208, 0.2);
      box-shadow:
        0 0 2vh rgba(0, 240, 255, 0.15),
        inset 0 0 2vh rgba(0, 240, 255, 0.1);
    }
    50% {
      opacity: 0.85;
      border-color: rgba(127, 255, 212, 0.65);
      box-shadow:
        0 0 5vh rgba(0, 255, 200, 0.45),
        0 0 10vh rgba(0, 180, 255, 0.3),
        inset 0 0 4vh rgba(127, 255, 212, 0.35);
    }
  }

  @keyframes markerPulse {
    0%, 100% {
      opacity: 0.2;
      box-shadow: 0 0 0.8vh rgba(0, 255, 212, 0.2);
    }
    50% {
      opacity: 0.95;
      box-shadow:
        0 0 1.5vh rgba(0, 255, 220, 0.85),
        0 0 3vh rgba(0, 200, 255, 0.5);
    }
  }

  @keyframes handPulse {
    0%, 100% {
      opacity: 0.25;
      box-shadow: 0 0 1vh rgba(0, 240, 255, 0.25);
    }
    50% {
      opacity: 0.95;
      box-shadow:
        0 0 2vh rgba(255, 255, 255, 0.85),
        0 0 4vh rgba(64, 224, 208, 0.75),
        0 0 6vh rgba(0, 150, 255, 0.45);
    }
  }

  @keyframes capPulse {
    0%, 100% {
      opacity: 0.3;
      box-shadow: 0 0 1vh rgba(0, 255, 200, 0.35);
    }
    50% {
      opacity: 1;
      box-shadow:
        0 0 2.5vh rgba(255, 255, 255, 0.95),
        0 0 5vh rgba(64, 224, 208, 0.85),
        0 0 8vh rgba(0, 180, 255, 0.6);
    }
  }
`;

/* -------------------------------------------------------------------------- */
/* Clock component                                                             */
/* -------------------------------------------------------------------------- */

const Clock_26_09_02: React.FC = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

    return { hourDeg, minuteDeg, secondDeg };
  }, [time]);

  return (
    <main style={styles.container}>
      <style>{ANIMATION_STYLES}</style>

      {/* Background Video */}
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={styles.backgroundVideo}
      />

      {/* Atmospheric Ambient Aura */}
      <div style={styles.ambientGlow} />

      {/* Oversized Round Clock Frame */}
      <div style={styles.clockContainer}>
        <div style={styles.clockFace}>

          {/* Hour Markers (Strictly Radial Positioned Inside Border) */}
          {MARKERS.map(({ angle, isMajor }) => (
            <div
              key={angle}
              style={{
                ...styles.marker,
                height: isMajor ? '4vh' : '2.5vh',
                width: isMajor ? '0.4vh' : '0.2vh',
                transform: `
                  translate(-50%, -50%)
                  rotate(${angle}deg)
                  translateY(-52vh)
                `,
              }}
            />
          ))}

          {/* Hour hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.hourHand,
              transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            }}
          />

          {/* Minute hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            }}
          />

          {/* Second hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.secondHand,
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
            }}
          />

          {/* Center pivot */}
          <div style={styles.centerCap} />
        </div>
      </div>
    </main>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#010914',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  backgroundVideo: {
    position: 'absolute',
    inset: 0,

    width: '100%',
    height: '100%',

    objectFit: 'cover',
    filter: 'saturate(1.4) contrast(0.95) brightness(1.2)',

    zIndex: 1,
  },

  ambientGlow: {
    position: 'absolute',

    width: '140vh',
    height: '140vh',
    aspectRatio: '1 / 1',

    borderRadius: '50%',

    background:
      'radial-gradient(circle, rgba(0, 255, 200, 0.08) 0%, rgba(0, 150, 255, 0.12) 50%, transparent 75%)',

    zIndex: 2,

    animation: 'ambientPulse 18s ease-in-out infinite',
  },

  clockContainer: {
    position: 'relative',

    /* Enforces absolute 1:1 circular aspect ratio */
    width: '115vh',
    height: '115vh',
    aspectRatio: '1 / 1',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',
    border: '0.25vh solid rgba(64, 224, 208, 0.3)',

    zIndex: 3,

    animation: 'framePulse 16s ease-in-out infinite',
  },

  clockFace: {
    position: 'relative',

    width: '100%',
    height: '100%',
    aspectRatio: '1 / 1',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',
  },

  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',

    backgroundColor: '#a3ffe8',
    borderRadius: '0.3vh',

    animation: 'markerPulse 12s ease-in-out infinite',
  },

  hand: {
    position: 'absolute',

    bottom: '50%',
    left: '50%',

    transformOrigin: 'bottom center',

    borderRadius: '1vh',

    willChange: 'transform, opacity',
  },

  hourHand: {
    width: '0.6vh',
    height: '25vh',

    backgroundColor: 'rgba(215, 255, 248, 0.85)',

    animation: 'handPulse 16s ease-in-out infinite',
  },

  minuteHand: {
    width: '0.4vh',
    height: '38vh',

    backgroundColor: 'rgba(215, 255, 248, 0.85)',

    animation: 'handPulse 14s ease-in-out infinite',
  },

  secondHand: {
    width: '0.25vh',
    height: '48vh',

    backgroundColor: '#ffffff',

    animation: 'handPulse 10s ease-in-out infinite',
  },

  centerCap: {
    position: 'absolute',

    width: '1.6vh',
    height: '1.6vh',
    aspectRatio: '1 / 1',

    borderRadius: '50%',

    backgroundColor: '#e6ffff',

    zIndex: 4,

    animation: 'capPulse 8s ease-in-out infinite',
  },
};

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;