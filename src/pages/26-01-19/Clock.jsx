import React, { useState, useEffect, useRef } from 'react';
import bgImage from '../../assets/clocks/26-01-19/hands.webp';

const COLORS = {
  bg: '#FFFFFF',
  secondHand: '#F1E206', // Bright Yellow
  mainHands: '#1E293B',   
  border: '#330202',      // Darker border for contrast
};

// --- Physics deviation functions ---
const getJumpOvershoot = (f) => f < 0.2 ? f * 10 : (f < 0.5 ? 2 : 0);
const getSlowWiggle = (f) => Math.sin(f * Math.PI * 2) * 12;
const getElasticStretch = (f) => f < 0.7 ? -f * 8 : -5.6 + (f - 0.7) * 40;
const getHeavyTwitch = (f) => (f > 0.4 && f < 0.6 ? 6 : 0);
const getDelayedRush = (f) => f < 0.6 ? -10 : (f - 0.6) * 25;

const ComplexYellowHand = ({ rotation, zIndex, transition = 'none', size }) => {
  const radius = size / 2;
  const handWidth = size * 0.008;
  const outlineWidth = `${size * 0.0015}vh`; 
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: handWidth,
      height: 0,
      transformOrigin: 'bottom center',
      transform: `translateX(-50%) rotate(${rotation}deg)`,
      zIndex,
      transition
    }}>
      {/* Arrow head (Black Border Layer) */}
      <div style={{
        width: 0, height: 0,
        borderLeft: `${size * 0.09}vh solid transparent`,
        borderRight: `${size * 0.09}vh solid transparent`,
        borderBottom: `${size * 0.08}vh solid ${COLORS.border}`,
        position: 'absolute', bottom: `${radius * 0.9}vh`,
        left: '50%', transform: 'translateX(-50%)',
      }} />
      
      {/* Arrow head (Yellow Fill Layer) */}
      <div style={{
        width: 0, height: 0,
        borderLeft: `${size * 0.08}vh solid transparent`,
        borderRight: `${size * 0.08}vh solid transparent`,
        borderBottom: `${size * 0.074}vh solid ${COLORS.secondHand}`,
        position: 'absolute', bottom: `${radius * 0.9}vh`,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 1
      }} />
      
      {/* Main blade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%',
        height: `${radius * 0.8}vh`, 
        background: COLORS.secondHand,
        border: `${outlineWidth} solid ${COLORS.border}`,
        borderBottom: 'none', 
        boxSizing: 'border-box',
      }} />
      
      {/* Tail */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%',
        height: `${radius * 0.3}vh`, 
        background: COLORS.secondHand,
        border: `${outlineWidth} solid ${COLORS.border}`,
        borderTop: 'none', 
        boxSizing: 'border-box',
      }} />
      
      {/* Tail ball */}
      <div style={{
        position: 'absolute', 
        top: `${radius * 0.4}vh`, 
        left: '50%',
        transform: 'translateX(-50%)', 
        width: `${size * 0.08}vh`, 
        height: `${size * 0.08}vh`,
        borderRadius: '50%', 
        background: COLORS.secondHand, 
        border: `${outlineWidth} solid ${COLORS.border}`,
        boxSizing: 'border-box',
      }} />
    </div>
  );
};

const ManyHandClock = () => {
  const [now, setNow] = useState(new Date());
  const [fraction, setFraction] = useState(0);
  const [clockSize, setClockSize] = useState(90);
  
  // Hand positions
  const [forgetfulPos, setForgetfulPos] = useState(0);
  const [sleepyPos1, setSleepyPos1] = useState(0);
  const [sleepyPos2, setSleepyPos2] = useState(0);
  const [panickedPos, setPanickedPos] = useState(0);

  // Behavior Refs
  const nextChangeRef = useRef(0);
  const isFrozenRef = useRef(false);
  const frozenAtRef = useRef(0);
  const sleepyRefs = useRef([
    {frozen: false, at: 0, next: 0, shaking: false, start: 0}, 
    {frozen: false, at: 0, next: 0, shaking: false, start: 0}
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

  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date();
      const currentTime = t.getTime();
      const s = t.getSeconds();
      const sFraction = s + t.getMilliseconds() / 1000;
      const baseRotation = (sFraction / 60) * 360;
      
      setNow(t);
      setFraction(sFraction);

      // 1. Forgetful Logic
      if (currentTime > nextChangeRef.current) {
        isFrozenRef.current = !isFrozenRef.current;
        if (isFrozenRef.current) frozenAtRef.current = baseRotation;
        nextChangeRef.current = currentTime + (Math.random() * 3000 + 1000);
      }
      setForgetfulPos(isFrozenRef.current ? frozenAtRef.current : baseRotation);

      // 2. Sleepy Logic
      sleepyRefs.current.forEach((ref, i) => {
        if (currentTime > ref.next) {
          if (ref.frozen) { ref.shaking = true; ref.start = currentTime; ref.frozen = false; }
          else { ref.frozen = true; ref.at = baseRotation; }
          ref.next = currentTime + (Math.random() * 6000 + 2000);
        }
        if (ref.shaking && currentTime - ref.start > 300) ref.shaking = false;
        const pos = ref.frozen ? ref.at : (ref.shaking ? ref.at + Math.sin(currentTime * (0.05 + i*0.01)) * 8 : baseRotation);
        i === 0 ? setSleepyPos1(pos) : setSleepyPos2(pos);
      });

      // 3. Panicked Logic
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

    }, 16);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = fraction;
  const hourRot = (((h % 12) + m / 60) / 12) * 360;
  const minuteRot = ((m + s / 60) / 60) * 360;
  const baseSecondRot = (s / 60) * 360;
  const tickingRot = Math.floor(s) * 6;
  const deviations = [
    getSlowWiggle(s % 1), 
    getJumpOvershoot(s % 1), 
    getElasticStretch(s % 1), 
    getHeavyTwitch(s % 1), 
    getDelayedRush(s % 1)
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#FFFFFF',
      backgroundImage: `radial-gradient(circle at center, rgba(135, 168, 126, 0.73) 0%, rgba(123, 135, 87, 0.4) 100%), url(${bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', width: `${clockSize}vh`, height: `${clockSize}vh` }}>
        
        {/* Main Hands (Hour/Minute) */}
        <div style={{ position: 'absolute', bottom: '50%', left: '50%', height: `${clockSize * 0.25}vh`, width: `${clockSize * 0.015}vh`, background: COLORS.mainHands, transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${hourRot}deg)`, zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: '50%', left: '50%', height: `${clockSize * 0.4}vh`, width: `${clockSize * 0.01}vh`, background: COLORS.mainHands, transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${minuteRot}deg)`, zIndex: 11 }} />

        {/* --- YELLOW HAND ARMY --- */}

        {/* Regular Second Hand (At the very bottom of the yellow pile) */}
        <ComplexYellowHand rotation={baseSecondRot} size={clockSize} zIndex={1} transition="none" />

        {/* Deviation Hands */}
        {deviations.map((dev, i) => (
          <ComplexYellowHand key={i} rotation={baseSecondRot + dev} size={clockSize} zIndex={20 + i} transition="transform 0.1s ease-out" />
        ))}

        {/* Forgetful Hand */}
        <ComplexYellowHand rotation={forgetfulPos} size={clockSize} zIndex={40} transition="transform 0.5s ease-out" />
        
        {/* Sleepy Hands */}
        <ComplexYellowHand rotation={sleepyPos1} size={clockSize} zIndex={41} transition="transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" />
        <ComplexYellowHand rotation={sleepyPos2} size={clockSize} zIndex={42} transition="transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" />

        {/* Ticking Hand */}
        <ComplexYellowHand rotation={tickingRot} size={clockSize} zIndex={90} transition="transform 0.15s cubic-bezier(0.2, 2, 0.4, 1)" />

        {/* Panicked Hand (Topmost) */}
        <ComplexYellowHand rotation={panickedPos} size={clockSize} zIndex={150} transition={panicStateRef.current === 'rushing' ? "transform 0.4s cubic-bezier(0.17, 0.67, 0.6, 1.3)" : "none"} />

        {/* Center Dot */}
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: `${clockSize * 0.02}vh`, height: `${clockSize * 0.02}vh`, 
          background: '#EFD73C', border: '2px solid #000', borderRadius: '50%', zIndex: 200 
        }} />
      </div>
    </div>
  );
};

export default ManyHandClock;