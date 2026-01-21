import React, { useState, useEffect, useRef } from 'react';
import bgImage from '../../assets/clocks/26-01-19/hands.webp';

const COLORS = {
  bg: '#FFFFFF',
  secondHand: '#FF2306', 
  mainHands: '#1E293B',   
  border: '#000000',
};

// Physics deviation functions
const getJumpOvershoot = (f) => f < 0.2 ? f * 10 : (f < 0.5 ? 2 : 0);
const getSlowWiggle = (f) => Math.sin(f * Math.PI * 2) * 12;
const getElasticStretch = (f) => f < 0.7 ? -f * 8 : -5.6 + (f - 0.7) * 40;
const getHeavyTwitch = (f) => (f > 0.4 && f < 0.6 ? 6 : 0);
const getDelayedRush = (f) => f < 0.6 ? -10 : (f - 0.6) * 25;

const ComplexRedHand = ({ rotation, zIndex, transition = 'none', size }) => {
  const scale = size / 100;
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: `${0.5 * scale}vh`,
      height: '0px',
      transformOrigin: 'bottom center',
      transform: `translateX(-50%) rotate(${rotation}deg)`,
      zIndex,
      transition
    }}>
      {/* Arrow head border */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: `${2 * scale}vh solid transparent`,
        borderRight: `${2 * scale}vh solid transparent`,
        borderBottom: `${3.6 * scale}vh solid ${COLORS.border}`,
        position: 'absolute',
        bottom: `${23 * scale}vh`,
        left: `${-2 * scale}vh`,
      }} />
      
      {/* Arrow head fill */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: `${1.8 * scale}vh solid transparent`,
        borderRight: `${1.8 * scale}vh solid transparent`,
        borderBottom: `${3.2 * scale}vh solid ${COLORS.secondHand}`,
        position: 'absolute',
        bottom: `${23.15 * scale}vh`,
        left: `${-1.8 * scale}vh`,
      }} />
      
      {/* Main blade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: `${19 * scale}vh`,
        background: COLORS.secondHand,
        border: `${0.1 * scale}vh solid ${COLORS.border}`,
        borderBottom: 'none',
        boxSizing: 'border-box',
      }} />
      
      {/* Tail */}
      <div style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: `${8 * scale}vh`,
        background: COLORS.secondHand,
        border: `${0.1 * scale}vh solid ${COLORS.border}`,
        borderTop: 'none',
        boxSizing: 'border-box',
      }} />
      
      {/* Tail ball */}
      <div style={{
        position: 'absolute',
        top: `${9 * scale}vh`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${3 * scale}vh`,
        height: `${3 * scale}vh`,
        borderRadius: '50%',
        background: COLORS.secondHand,
        border: `${0.1 * scale}vh solid ${COLORS.border}`,
        boxSizing: 'border-box',
      }} />
    </div>
  );
};

const ManyHandClock = () => {
  const [now, setNow] = useState(new Date());
  const [fraction, setFraction] = useState(0);
  const [forgetfulPos, setForgetfulPos] = useState(0);
  const [sleepyPos1, setSleepyPos1] = useState(0);
  const [sleepyPos2, setSleepyPos2] = useState(0);
  const [clockSize, setClockSize] = useState(90);
  
  const nextChangeRef = useRef(0);
  const isFrozenRef = useRef(false);
  const frozenAtRef = useRef(0);
  
  const nextSleepy1Ref = useRef(0);
  const isSleepy1FrozenRef = useRef(false);
  const sleepy1FrozenAtRef = useRef(0);
  const sleepy1ShakingRef = useRef(false);
  const sleepy1ShakeStartRef = useRef(0);
  
  const nextSleepy2Ref = useRef(0);
  const isSleepy2FrozenRef = useRef(false);
  const sleepy2FrozenAtRef = useRef(0);
  const sleepy2ShakingRef = useRef(false);
  const sleepy2ShakeStartRef = useRef(0);

  // Calculate responsive clock size
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Calculate size based on viewport dimensions with safe margins
      const isPortrait = vh > vw;
      const safeMargin = 32; // 16px on each side
      const maxSize = isPortrait 
        ? Math.min(vw - safeMargin, (vh - safeMargin) * 0.9) // 90% of height to prevent clipping
        : Math.min(vh - safeMargin, (vw - safeMargin) * 0.9); // 90% of width in landscape
      
      // Convert to vh units for consistent scaling
      const sizeInVh = (maxSize / vh) * 100;
      setClockSize(Math.min(155, sizeInVh));
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Time and animation logic
  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date();
      const currentTime = t.getTime();
      const sFraction = t.getSeconds() + t.getMilliseconds() / 1000;
      
      setNow(t);
      setFraction(sFraction);

      // Forgetful hand logic
      if (currentTime > nextChangeRef.current) {
        if (isFrozenRef.current) {
          isFrozenRef.current = false;
          nextChangeRef.current = currentTime + (Math.random() * 3000 + 1000);
        } else {
          isFrozenRef.current = true;
          frozenAtRef.current = (sFraction / 60) * 360;
          nextChangeRef.current = currentTime + (Math.random() * 2000 + 1000);
        }
      }
      
      if (isFrozenRef.current) {
        setForgetfulPos(frozenAtRef.current);
      } else {
        setForgetfulPos((sFraction / 60) * 360);
      }

      // Sleepy hand 1 logic
      if (currentTime > nextSleepy1Ref.current) {
        if (isSleepy1FrozenRef.current) {
          // Start shaking
          sleepy1ShakingRef.current = true;
          sleepy1ShakeStartRef.current = currentTime;
          isSleepy1FrozenRef.current = false;
          nextSleepy1Ref.current = currentTime + (Math.random() * 6000 + 1000); // 1-7 seconds
        } else {
          // Start sleeping
          isSleepy1FrozenRef.current = true;
          sleepy1FrozenAtRef.current = (sFraction / 60) * 360;
          nextSleepy1Ref.current = currentTime + (Math.random() * 6000 + 1000);
        }
      }
      
      if (sleepy1ShakingRef.current && currentTime - sleepy1ShakeStartRef.current > 300) {
        sleepy1ShakingRef.current = false;
      }
      
      if (isSleepy1FrozenRef.current) {
        setSleepyPos1(sleepy1FrozenAtRef.current);
      } else if (sleepy1ShakingRef.current) {
        const shakeAmount = Math.sin(currentTime * 0.05) * 8;
        setSleepyPos1(sleepy1FrozenAtRef.current + shakeAmount);
      } else {
        setSleepyPos1((sFraction / 60) * 360);
      }

      // Sleepy hand 2 logic
      if (currentTime > nextSleepy2Ref.current) {
        if (isSleepy2FrozenRef.current) {
          // Start shaking
          sleepy2ShakingRef.current = true;
          sleepy2ShakeStartRef.current = currentTime;
          isSleepy2FrozenRef.current = false;
          nextSleepy2Ref.current = currentTime + (Math.random() * 6000 + 1000); // 1-7 seconds
        } else {
          // Start sleeping
          isSleepy2FrozenRef.current = true;
          sleepy2FrozenAtRef.current = (sFraction / 60) * 360;
          nextSleepy2Ref.current = currentTime + (Math.random() * 6000 + 1000);
        }
      }
      
      if (sleepy2ShakingRef.current && currentTime - sleepy2ShakeStartRef.current > 300) {
        sleepy2ShakingRef.current = false;
      }
      
      if (isSleepy2FrozenRef.current) {
        setSleepyPos2(sleepy2FrozenAtRef.current);
      } else if (sleepy2ShakingRef.current) {
        const shakeAmount = Math.sin(currentTime * 0.06) * 8;
        setSleepyPos2(sleepy2FrozenAtRef.current + shakeAmount);
      } else {
        setSleepyPos2((sFraction / 60) * 360);
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

  const scale = clockSize / 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.bg,
      backgroundImage: `
        radial-gradient(circle at center, 
          rgba(135, 168, 126, 0.68) 0%, 
          rgba(120, 141, 120, 0.45) 40%, 
          rgba(123, 135, 87, 0.61) 100%
        ),
        url(${bgImage})
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      touchAction: 'manipulation', // Prevent double-tap zoom on mobile
      overscrollBehavior: 'contain' // Prevent pull-to-refresh and overscroll glow
    }}>
      <div style={{ 
        position: 'relative', 
        width: `${clockSize * 0.9}vh`, // Slightly smaller to ensure it fits
        height: `${clockSize * 0.9}vh`,
        maxWidth: '90vw', // Ensure it doesn't exceed viewport width
        maxHeight: '90vh', // Ensure it doesn't exceed viewport height
        aspectRatio: '1/1' // Maintain square aspect ratio
      }}>
        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          height: `${12 * scale}vh`,
          width: `${1.2 * scale}vh`,
          border: `${0.1 * scale}vh solid ${COLORS.border}`,
          background: COLORS.mainHands,
          transform: `translateX(-50%) rotate(${hourRot}deg)`,
          transformOrigin: 'bottom center',
          boxSizing: 'border-box',
          zIndex: 10
        }} />
        
        {/* Minute hand */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          height: `${20 * scale}vh`,
          width: `${0.8 * scale}vh`,
          border: `${0.1 * scale}vh solid ${COLORS.border}`,
          background: COLORS.mainHands,
          transform: `translateX(-50%) rotate(${minuteRot}deg)`,
          transformOrigin: 'bottom center',
          boxSizing: 'border-box',
          zIndex: 11
        }} />

        {/* Forgetful hand */}
        <ComplexRedHand 
          rotation={forgetfulPos} 
          size={clockSize}
          zIndex={40} 
          transition="transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" 
        />
        
        {/* Sleepy hands */}
        <ComplexRedHand 
          rotation={sleepyPos1} 
          size={clockSize}
          zIndex={41} 
          transition="transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" 
        />
        <ComplexRedHand 
          rotation={sleepyPos2} 
          size={clockSize}
          zIndex={42} 
          transition="transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" 
        />
        
        {/* Deviation hands */}
        {deviations.map((dev, i) => (
          <ComplexRedHand 
            key={i} 
            rotation={baseSecondRot + dev} 
            size={clockSize}
            zIndex={20 + i} 
            transition="transform 0.1s ease-out" 
          />
        ))}

        {/* Ticking hand */}
        <ComplexRedHand 
          rotation={tickingRot} 
          size={clockSize}
          zIndex={90} 
          transition="transform 0.15s cubic-bezier(0.2, 2, 0.4, 1)" 
        />
        
        {/* Smooth second hand */}
        <ComplexRedHand 
          rotation={baseSecondRot} 
          size={clockSize}
          zIndex={100} 
          transition="none" 
        />

        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: `${0.8 * scale}vh`,
          height: `${0.8 * scale}vh`,
          background: '#EFD73C',
          border: `${0.15 * scale}vh solid #333`,
          borderRadius: '50%',
          zIndex: 200
        }} />
      </div>
    </div>
  );
};

export default ManyHandClock;