import { useEffect, useState } from 'react';
import './Sprout.css';
import spr from './spr.gif';
import sprou from './sprou.gif';
import sprout from './sprout.gif';

const styles = {
  container: {
    fontFamily: "'sprout', monospace",
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  bgTiled: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
        opacity: 0.7,
    backgroundImage: `url(${spr})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '23px 23px',
    pointerEvents: 'none',
  },
  bgCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -2,
    backgroundImage: `url(${sprout})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.9,
    pointerEvents: 'none',
  },
  content: {
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1vh',
    zIndex: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  digit: {
    color: 'rgb(184, 244, 172)',
    textShadow: 'rgb(55, 4, 10) 2px 2px',
    fontFamily: 'sprout, monospace',
    padding: '0.1vh 0.1vw',
    fontSize: '16vh',
    minWidth: '14vh',
    textAlign: 'center',
  },
  imageBase: {
    position: 'fixed',
    width: '100vh',
    height: '110vh',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    zIndex: 12,
  },
};

const imagePositions = [
  { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  { top: '50%', left: '10%', transform: 'translate(-50%, -50%)' },
  { top: '50%', left: '90%', transform: 'translate(-50%, -50%)' },
  { top: '40%', left: '70%', transform: 'translate(-50%, -50%) scaleY(-1)' },
  { top: '40%', left: '30%', transform: 'translate(-50%, -50%) scaleY(-1)' },
];

function pad(num, length) {
  return num.toString().padStart(length, '0').split('');
}

export default function SproutClock() {
  const [time, setTime] = useState({ h: [], m: [], s: [], ms: [] });

  useEffect(() => {
    const font = new FontFace('sprout', 'url(/sprout.ttf)');
    font.load().then(loaded => document.fonts.add(loaded));
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        h: pad(now.getHours() % 12 || 12, 2),
        m: pad(now.getMinutes(), 2),
        s: pad(now.getSeconds(), 2),
        ms: pad(Math.floor(now.getMilliseconds() / 10), 2),
      });
    };
    const interval = setInterval(update, 33);
    update();
    return () => clearInterval(interval);
  }, []);

  const renderDigits = (digits) =>
    digits.map((d, i) => (
      <div key={i} style={styles.digit}>{d}</div>
    ));

  return (
    <div style={styles.container}>
      <div style={styles.bgTiled}></div>
      <div style={styles.bgCover}></div>

      <div style={styles.content}>
        {imagePositions.map((pos, i) => (
          <img
            key={i}
            src={sprou}
            alt=""
            loading="lazy"
            style={{ ...styles.imageBase, ...pos }}
            role="presentation"
          />
        ))}

        <div style={styles.clock} aria-label={`Current time ${time.h.join('')}:${time.m.join('')}:${time.s.join('')}.${time.ms.join('')}`}>
          <div style={styles.timeRow}>{renderDigits(time.h)}</div>
          <div style={styles.timeRow}>{renderDigits(time.m)}</div>
          <div style={styles.timeRow}>{renderDigits(time.s)}</div>
          <div style={styles.timeRow}>{renderDigits(time.ms)}</div>
        </div>
      </div>
    </div>
  );
}
