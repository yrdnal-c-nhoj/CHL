import bgImage from '@/assets/images/26_images/26-01/26-01-19/hands.webp';
import { useClockTime as useSmoothClock } from '@/utils/clockUtils';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

// Asset exports for preloading pipeline
export const assets = [bgImage];

const COLORS = {
  bg: '#FFFFFF',
  secondHand: '#F1E206', // Bright Yellow
  mainHands: '#1E293B',
  border: '#330202', // Darker border for contrast
};

const STYLE_VARS = {
  handTransition: 'transform 0.1s ease-out',
  sleepyTransition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  panicTransition: 'transform 0.4s cubic-bezier(0.17, 0.67, 0.6, 1.3)',
};

// --- Physics deviation functions ---
const getJumpOvershoot = (f) => (f < 0.2 ? f * 10 : f < 0.5 ? 2 : 0);
const getSlowWiggle = (f) => Math.sin(f * Math.PI * 2) * 12;
const getElasticStretch = (f) => (f < 0.7 ? -f * 8 : -5.6 + (f - 0.7) * 40);
const getHeavyTwitch = (f) => (f > 0.4 && f < 0.6 ? 6 : 0);
const getDelayedRush = (f) => (f < 0.6 ? -10 : (f - 0.6) * 25);

const ComplexYellowHand = ({ rotation, zIndex, transition = 'none', size }) => {
  const r = size / 2;
  const handWidth = size * 0.008;
  const outlineWidth = `${size * 0.0015}vh`;
  const arrowBase = {
    width: 0, height: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: `${r * 0.9}vh`
  };

  return (
    <div style={{
      position: 'absolute', bottom: '50%', left: '50%', width: handWidth, height: 0,
      transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${rotation}deg)`,
      zIndex, transition
    }}>
      {/* Arrow Heads */}
      <div style={{
        ...arrowBase,
        borderLeft: `${size * 0.09}vh solid transparent`,
        borderRight: `${size * 0.09}vh solid transparent`,
        borderBottom: `${size * 0.08}vh solid ${COLORS.border}`,
      }} />
      <div style={{
        ...arrowBase, zIndex: 1,
        borderLeft: `${size * 0.08}vh solid transparent`,
        borderRight: `${size * 0.08}vh solid transparent`,
        borderBottom: `${size * 0.074}vh solid ${COLORS.secondHand}`,
      }} />

      {/* Main Blade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${r * 0.8}vh`,
        background: COLORS.secondHand, boxSizing: 'border-box',
        borderTop: `${outlineWidth} solid ${COLORS.border}`,
        borderLeft: `${outlineWidth} solid ${COLORS.border}`,
        borderRight: `${outlineWidth} solid ${COLORS.border}`,
      }} />

      {/* Tail */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: `${r * 0.3}vh`,
        background: COLORS.secondHand, boxSizing: 'border-box',
        borderBottom: `${outlineWidth} solid ${COLORS.border}`,
        borderLeft: `${outlineWidth} solid ${COLORS.border}`,
        borderRight: `${outlineWidth} solid ${COLORS.border}`,
      }} />

      {/* Tail Ball */}
      <div style={{
        position: 'absolute', top: `${r * 0.4}vh`, left: '50%', transform: 'translateX(-50%)',
        width: `${size * 0.08}vh`, height: `${size * 0.08}vh`,
        borderRadius: '50%', background: COLORS.secondHand, boxSizing: 'border-box',
        border: `${outlineWidth} solid ${COLORS.border}`,
      }} />
    </div>
  );
};

const ManyHandClock: React.FC = () => {
  const now = useSmoothClock();
  const [clockSize, setClockSize] = useState<number>(90);

  // Hand positions
  const [forgetfulPos, setForgetfulPos] = useState<number>(0);
  const [sleepyPos1, setSleepyPos1] = useState<number>(0);
  const [sleepyPos2, setSleepyPos2] = useState<number>(0);
  const [panickedPos, setPanickedPos] = useState<number>(0);

  // Behavior Refs
  const nextChangeRef = useRef(0);
  const isFrozenRef = useRef(false);
  const frozenAtRef = useRef(0);
  const sleepyRefs = useRef([
    { frozen: false, at: 0, next: 0, shaking: false, start: 0 },
    { frozen: false, at: 0, next: 0, shaking: false, start: 0 },
  ]);
  const panicStateRef = useRef('normal');
  const panicStuckAtRef = useRef(0);

  useEffect(() => {
    const updateSize = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      setClockSize((vmin / window.innerHeight) * 95);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Derived time values
  const sFraction = now.getSeconds() + now.getMilliseconds() / 1000;
  const baseRotation = (sFraction / 60) * 360;
  const currentTime = now.getTime();
  const s = now.getSeconds();

  // Behavior Logic: Using currentTime as the primary driver for physics
  useEffect(() => {
    if (currentTime > nextChangeRef.current) {
      isFrozenRef.current = !isFrozenRef.current;
      if (isFrozenRef.current) frozenAtRef.current = baseRotation;
      nextChangeRef.current = currentTime + (Math.random() * 3000 + 1000);
    }
    setForgetfulPos(isFrozenRef.current ? frozenAtRef.current : baseRotation);

    sleepyRefs.current.forEach((ref, i) => {
      if (currentTime > ref.next) {
        if (ref.frozen) {
          ref.shaking = true;
          ref.start = currentTime;
          ref.frozen = false;
        } else {
          ref.frozen = true;
          ref.at = baseRotation;
        }
        ref.next = currentTime + (Math.random() * 6000 + 2000);
      }
      if (ref.shaking && currentTime - ref.start > 300) ref.shaking = false;
      const pos = ref.frozen
        ? ref.at
        : ref.shaking
          ? ref.at + Math.sin(currentTime * (0.05 + i * 0.01)) * 8
          : baseRotation;
      i === 0 ? setSleepyPos1(pos) : setSleepyPos2(pos);
    });

    if (s >= 0 && s < 6) {
      if (panicStateRef.current === 'normal') {
        panicStateRef.current = 'stuck';
        panicStuckAtRef.current = (Math.random() * 3 + 1) * 6;
      }
    }
    if (panicStateRef.current === 'stuck') {
      setPanickedPos(panicStuckAtRef.current);
      if (s >= 7) panicStateRef.current = 'rushing';
    } else if (panicStateRef.current === 'rushing') {
      const shake = Math.sin(currentTime * 0.12) * 2.5;
      setPanickedPos(baseRotation + 12 + shake);
      if (s >= 15) panicStateRef.current = 'normal';
    } else {
      setPanickedPos(baseRotation);
    }
  }, [currentTime, baseRotation, s]);

  const hourRot = (((now.getHours() % 12) + now.getMinutes() / 60) / 12) * 360;
  const minuteRot = ((now.getMinutes() + sFraction / 60) / 60) * 360;
  const baseSecondRot = (sFraction / 60) * 360;
  const tickingRot = Math.floor(s) * 6;
  const deviations = [
    getSlowWiggle(sFraction % 1),
    getJumpOvershoot(sFraction % 1),
    getElasticStretch(sFraction % 1),
    getHeavyTwitch(sFraction % 1),
    getDelayedRush(sFraction % 1),
  ];

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(135, 168, 126, 0.73) 0%, rgba(123, 135, 87, 0.4) 100%), url(${bgImage})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${clockSize}vh`,
          height: `${clockSize}vh`,
        }}
      >
        {/* Main Hands (Hour/Minute) */}
        <div
          className={styles.hand}
          style={{
            height: `${clockSize * 0.25}vh`,
            width: `${clockSize * 0.015}vh`,
            background: COLORS.mainHands,
            transform: `translateX(-50%) rotate(${hourRot}deg)`,
          }}
        />
        <div
          className={styles.hand}
          style={{
            height: `${clockSize * 0.4}vh`,
            width: `${clockSize * 0.01}vh`,
            background: COLORS.mainHands,
            transform: `translateX(-50%) rotate(${minuteRot}deg)`,
            zIndex: 11,
          }}
        />

        {/* --- YELLOW HAND ARMY --- */}

        {/* Regular Second Hand (At the very bottom of the yellow pile) */}
        <ComplexYellowHand
          rotation={baseSecondRot}
          size={clockSize}
          zIndex={1}
          transition="none"
        />

        {/* Deviation Hands */}
        {deviations.map((dev, i) => (
          <ComplexYellowHand
            key={i}
            rotation={baseSecondRot + dev}
            size={clockSize}
            zIndex={20 + i}
            transition="transform 0.1s ease-out"
          />
        ))}

        {/* Forgetful Hand */}
        <ComplexYellowHand
          rotation={forgetfulPos}
          size={clockSize}
          zIndex={40}
          transition="transform 0.5s ease-out"
        />

        {/* Sleepy Hands */}
        <ComplexYellowHand
          rotation={sleepyPos1}
          size={clockSize}
          zIndex={41}
          transition="transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
        />
        <ComplexYellowHand
          rotation={sleepyPos2}
          size={clockSize}
          zIndex={42}
          transition="transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
        />

        {/* Ticking Hand */}
        <ComplexYellowHand
          rotation={tickingRot}
          size={clockSize}
          zIndex={90}
          transition="transform 0.15s cubic-bezier(0.2, 2, 0.4, 1)"
        />

        {/* Panicked Hand (Topmost) */}
        <ComplexYellowHand
          rotation={panickedPos}
          size={clockSize}
          zIndex={150}
          transition={
            panicStateRef.current === 'rushing'
              ? 'transform 0.4s cubic-bezier(0.17, 0.67, 0.6, 1.3)'
              : 'none'
          }
        />

        {/* Center Dot */}
        <div
          className={styles.centerDot}
          style={{
            width: `${clockSize * 0.02}vh`,
            height: `${clockSize * 0.02}vh`,
          }}
        />
      </div>
    </div>
  );
};

export default ManyHandClock;
