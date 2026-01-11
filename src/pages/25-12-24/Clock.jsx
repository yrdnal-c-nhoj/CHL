import React, { useEffect, useRef, useState } from 'react';

/* ---------- Font ---------- */
const FONT_FAMILY = 'Newla';
import FONT_PATH from '../../assets/fonts/lapse.otf?url';

/* ---------- Timing ---------- */
const ERASE = 60000;
const HOLD = 1000;
const FADE = 3000;
const CYCLE = ERASE + HOLD + FADE;

const ErasingClock = () => {
  const [now, setNow] = useState(new Date());

  /* Fixed epoch */
  const epochRef = useRef(performance.now());
  const cycleIndexRef = useRef(0);
  const startSecondAngleRef = useRef(0);

  /* ---------- Font Loading ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f = new FontFace(FONT_FAMILY, `url(${FONT_PATH}) format('opentype')`);
    f.load().then(font => document.fonts.add(font)).catch(() => {});
  }, []);

  /* ---------- Tick Loop (60fps) ---------- */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 16);
    return () => clearInterval(id);
  }, []);

  /* ---------- Cycle Calculation ---------- */
  const perfNow = performance.now() - epochRef.current;
  const cycleIndex = Math.floor(perfNow / CYCLE);
  const elapsed = perfNow % CYCLE;

  /* Capture second angle ONCE per cycle start to begin erase from there */
  if (cycleIndex !== cycleIndexRef.current) {
    cycleIndexRef.current = cycleIndex;
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    startSecondAngleRef.current = s * 6;
  }

  const isErasing = elapsed < ERASE;
  const isHolding = elapsed >= ERASE && elapsed < ERASE + HOLD;
  const isFading = elapsed >= ERASE + HOLD;

  let opacity = 1;
  if (isHolding) opacity = 0;
  if (isFading) opacity = (elapsed - (ERASE + HOLD)) / FADE;

  /* ---------- REAL TIME MATH ---------- */
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;

  /* Erase logic */
  const eraseProgress = Math.min(elapsed / ERASE, 1);
  const eraseAngle = (startSecondAngleRef.current + eraseProgress * 360) % 360;

  /* ---------- Styles ---------- */
  const center = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const container = {
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#604604',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: `'${FONT_FAMILY}', monospace`,
    overflow: 'hidden',
  };

  const face = {
    width: '90vmin',
    height: '90vmin',
    borderRadius: '50%',
    backgroundColor: 'white',
    position: 'relative',
    opacity,
  };

  // Fixed: CSS rotate(0deg) is 12 o'clock, so we removed the -90 offset.
  const hand = (angle, w, h, z, color = 'black') => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${w}vmin`,
    height: `${h}vmin`,
    backgroundColor: color,
    transformOrigin: '50% 100%',
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    borderRadius: '1vmin',
    zIndex: z,
  });

  return (
    <div style={container}>
      <div style={face}>

        {/* Hour/Minute Ticks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            style={{
              ...center,
              transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-42vmin)`,
            }}
          >
            <div
              style={{
                width: i % 5 === 0 ? '0.6vmin' : '0.2vmin',
                height: i % 5 === 0 ? '6vmin' : '3vmin',
                backgroundColor: 'black',
              }}
            />
          </div>
        ))}

        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const n = i + 1;
          return (
            <div
              key={n}
              style={{
                ...center,
                transform: `translate(-50%, -50%) rotate(${n * 30}deg) translateY(-34vmin)`,
              }}
            >
              <div
                style={{
                  transform: `rotate(${-n * 30}deg)`,
                  fontSize: '9vmin',
                  color: '#EF5A0FDD',
                  textShadow: ' 1px -1px 0 black, -1px 1px 0 black',
                }}
              >
                {n < 10 ? `0${n}` : n}
              </div>
            </div>
          );
        })}

        {/* Hands — REAL TIME */}
        <div style={hand(hourAngle, 1.8, 22, 4)} />
        <div style={hand(minuteAngle, 1.2, 35, 5)} />

        {/* Erase mask — Fixed: Uses conic-gradient to follow the eraser hand */}
        {isErasing && (
          <div
            style={{
              position: 'absolute',
              inset: '0px', // Prevents sub-pixel flickering
              borderRadius: '50%',
              zIndex: 10,
              background: `conic-gradient(
                from 0deg,
                transparent 0deg,
                transparent ${startSecondAngleRef.current}deg,
                white ${startSecondAngleRef.current}deg,
                white ${eraseAngle}deg,
                transparent ${eraseAngle}deg
              )`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Eraser second hand */}
        {isErasing && (
          <div style={hand(eraseAngle, 0.4, 45, 11, 'white')} />
        )}

        {/* Center pin */}
        <div
          style={{
            ...center,
            width: '4vmin',
            height: '4vmin',
            backgroundColor: 'red',
            borderRadius: '50%',
            border: '0.5vmin solid black',
            zIndex: 12,
          }}
        />

      </div>
    </div>
  );
};

export default ErasingClock;
