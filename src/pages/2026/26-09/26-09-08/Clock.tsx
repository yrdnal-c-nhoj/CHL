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
/* Animations                                                                 */
/*                                                                            */
/* No blur filters are used. Shadows are deliberately small and bright so    */
/* the clock remains sharp against the dark background.                      */
/* -------------------------------------------------------------------------- */

const ANIMATION_STYLES = `
  @keyframes ambientPulse {
    0%,
    100% {
      opacity: 0.08;
      transform: scale(0.92);
    }

    50% {
      opacity: 0.32;
      transform: scale(1.08);
    }
  }

  @keyframes framePulse {
    0%,
    100% {
      opacity: 0.25;
      box-shadow:
        0 0 3px rgba(210, 245, 255, 0.35),
        inset 0 0 3px rgba(210, 245, 255, 0.2);
    }

    45% {
      opacity: 0.95;
      box-shadow:
        0 0 6px rgba(230, 250, 255, 0.9),
        0 0 12px rgba(80, 180, 255, 0.55),
        inset 0 0 5px rgba(230, 250, 255, 0.7);
    }
  }

  @keyframes markerPulse {
    0%,
    100% {
      opacity: 0.2;
      box-shadow: 0 0 2px rgba(220, 248, 255, 0.3);
    }

    60% {
      opacity: 1;
      box-shadow:
        0 0 4px rgba(235, 252, 255, 0.95),
        0 0 8px rgba(100, 190, 255, 0.65);
    }
  }

  @keyframes handPulse {
    0%,
    100% {
      opacity: 0.18;
      box-shadow:
        0 0 2px rgba(220, 248, 255, 0.35);
    }

    40% {
      opacity: 1;
      box-shadow:
        0 0 4px rgba(255, 255, 255, 1),
        0 0 8px rgba(225, 250, 255, 0.9),
        0 0 14px rgba(90, 180, 255, 0.6);
    }
  }

  @keyframes capPulse {
    0%,
    100% {
      opacity: 0.25;
      box-shadow:
        0 0 3px rgba(220, 250, 255, 0.4);
    }

    50% {
      opacity: 1;
      box-shadow:
        0 0 5px rgba(255, 255, 255, 1),
        0 0 10px rgba(220, 250, 255, 0.95),
        0 0 16px rgba(70, 175, 255, 0.7);
    }
  }
`;

/* -------------------------------------------------------------------------- */
/* Clock component                                                             */
/* -------------------------------------------------------------------------- */

const Clock_26_09_02: React.FC = () => {
  const [time, setTime] = useState(() => new Date());

  /* Update the clock once per second. */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /* Convert the current time into analog-clock angles. */
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = (seconds / 60) * 360;

    const minuteDeg =
      ((minutes + seconds / 60) / 60) * 360;

    const hourDeg =
      (((hours % 12) + minutes / 60) / 12) * 360;

    return {
      hourDeg,
      minuteDeg,
      secondDeg,
    };
  }, [time]);

  return (
    <main style={styles.container}>
      <style>{ANIMATION_STYLES}</style>

      {/* ------------------------------------------------------------------ */}
      {/* Night video background                                             */}
      {/* ------------------------------------------------------------------ */}

      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={styles.backgroundVideo}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Subtle cyclical atmosphere                                         */}
      {/* ------------------------------------------------------------------ */}

      <div style={styles.ambientGlow} />

      {/* ------------------------------------------------------------------ */}
      {/* Clock                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div style={styles.clockContainer}>
        <div style={styles.clockFace}>

          {/* Hour markers */}
          {MARKERS.map(({ angle, isMajor }) => (
            <div
              key={angle}
              style={{
                ...styles.marker,
                height: isMajor ? '14px' : '8px',
                width: isMajor ? '3px' : '1px',
                transform: `
                  rotate(${angle}deg)
                  translateY(-120px)
                `,
              }}
            />
          ))}

          {/* Hour hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.hourHand,
              transform: `rotate(${hourDeg}deg)`,
            }}
          />

          {/* Minute hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              transform: `rotate(${minuteDeg}deg)`,
            }}
          />

          {/* Second hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.secondHand,
              transform: `rotate(${secondDeg}deg)`,
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

  /* ------------------------------ Page ---------------------------------- */

  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#02060d',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  /* -------------------------- Video background -------------------------- */

  backgroundVideo: {
    position: 'absolute',
    inset: 0,

    width: '100%',
    height: '100%',

    objectFit: 'fill',

    /*
     * Brightened slightly so the night scene remains visible.
     * No blur filter is used.
     */
    filter: 'saturate(1.35) contrast(0.9) brightness(1.55)',

    zIndex: 1,
  },

  /* --------------------------- Atmosphere -------------------------------- */

  ambientGlow: {
    position: 'absolute',

    width: '360px',
    height: '360px',

    borderRadius: '50%',

    background:
      'radial-gradient(circle, transparent 0%, transparent 58%, rgba(31, 95, 160, 0.45) 100%)',

    zIndex: 2,

    animation: 'ambientPulse 8.3s ease-in-out infinite',
  },

  /* ----------------------------- Frame ----------------------------------- */

  clockContainer: {
    position: 'relative',

    width: '50vmin',
    height: '50vmin',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',
    border: '2px solid #6fb8e8',

    zIndex: 3,

    animation: 'framePulse 6.7s ease-in-out infinite',
  },

  clockFace: {
    position: 'relative',

    width: '100%',
    height: '100%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',
  },

  /* ---------------------------- Markers --------------------------------- */

  marker: {
    position: 'absolute',

    backgroundColor: '#bfefff',
    borderRadius: '2px',

    animation: 'markerPulse 5.2s ease-in-out infinite',
  },

  /* ------------------------------ Hands ---------------------------------- */

  hand: {
    position: 'absolute',

    bottom: '50%',
    left: '50%',

    transformOrigin: 'bottom center',

    borderRadius: '4px',

    willChange: 'transform, opacity',
  },

  hourHand: {
    width: '4px',
    height: '70px',

    marginLeft: '-2px',

    backgroundColor: '#d9f7ff',

    animation: 'handPulse 7.4s ease-in-out infinite',
  },

  minuteHand: {
    width: '3px',
    height: '100px',

    marginLeft: '-1.5px',

    backgroundColor: '#d9f7ff',

    animation: 'handPulse 4.8s ease-in-out infinite',
  },

  secondHand: {
    width: '2px',
    height: '115px',

    marginLeft: '-1px',

    backgroundColor: '#ffffff',

    animation: 'handPulse 3.1s ease-in-out infinite',
  },

  /* --------------------------- Center cap ------------------------------- */

  centerCap: {
    position: 'absolute',

    width: '12px',
    height: '12px',

    borderRadius: '50%',

    backgroundColor: '#ffffff',

    zIndex: 4,

    animation: 'capPulse 2.9s ease-in-out infinite',
  },
};

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;