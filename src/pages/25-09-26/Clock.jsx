import React, { useState, useEffect } from 'react';

function getClockTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const UFO_HOVER_X = 49;     // VW at hover
const UFO_ENTER_START = 112; // VW off-screen right
const UFO_LEAVE_END = 125;  // VW off-screen right
const CLOCK_BASE_Y = 80;    // DVH on desert
const CLOCK_SCRUNCH_Y = 78; // DVH slight squish
const CLOCK_SUCKED_Y = 44;  // DVH sucked up to UFO
const ABDUCTION_DELAY = 1700; // How long UFO hovers before abducting
const CLOCK_SCRUNCH_DURATION = 700;
const CLOCK_SUCK_UP_DURATION = 1300;
const UFO_LEAVE_DURATION = 2000;
const CLOCK_REAPPEAR_DELAY = 1300;
const LOOP_DELAY = 1000;    // Delay before loop restarts

export default function DesertUFOSequence() {
  const [stage, setStage] = useState(0);
  const [ufoX, setUfoX] = useState(UFO_ENTER_START);
  const [clockY, setClockY] = useState(CLOCK_BASE_Y);
  const [clockScale, setClockScale] = useState(1);
  const [beam, setBeam] = useState(false);
  const [clockVisible, setClockVisible] = useState(true);
  const [clockOpacity, setClockOpacity] = useState(1);
  const [clockText, setClockText] = useState(getClockTime());

  useEffect(() => {
    const interval = setInterval(() => setClockText(getClockTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (stage === 0) { // UFO enters
      setClockVisible(true); setClockOpacity(1); setClockScale(1); setClockY(CLOCK_BASE_Y);
      setBeam(false); setUfoX(UFO_ENTER_START);
      timer = setTimeout(() => {
        setUfoX(UFO_HOVER_X);
        setStage(1);
      }, 1800);
    }
    else if (stage === 1) { // UFO hovers over clock
      setBeam(false); setUfoX(UFO_HOVER_X);
      timer = setTimeout(() => setStage(2), ABDUCTION_DELAY);
    }
    else if (stage === 2) { // Clock scrunch
      setBeam(true);
      // Animate "scrunch": shrink width, lower opacity, squish closer to ground for dramatic tension.
      setClockScale(0.6); setClockY(CLOCK_SCRUNCH_Y);
      timer = setTimeout(() => setStage(3), CLOCK_SCRUNCH_DURATION);
    }
    else if (stage === 3) { // Suck up clock (clock moves up, fades out)
      let step = 0;
      const steps = 22;
      const suckInterval = setInterval(() => {
        setClockY(prev => Math.max(CLOCK_SUCKED_Y, prev - ((CLOCK_SCRUNCH_Y - CLOCK_SUCKED_Y) / steps)));
        setClockOpacity(prev => Math.max(0, prev - (1/steps)));
        step++;
        if (step >= steps) {
          clearInterval(suckInterval);
          setClockVisible(false);
          setStage(4);
        }
      }, CLOCK_SUCK_UP_DURATION / steps);
    }
    else if (stage === 4) { // UFO leaves right
      setBeam(false);
      let step = 0;
      const steps = 26;
      const leaveInterval = setInterval(() => {
        setUfoX(prev => Math.min(UFO_LEAVE_END, prev + ((UFO_LEAVE_END - UFO_HOVER_X) / steps)));
        step++;
        if (step >= steps) {
          clearInterval(leaveInterval);
          setUfoX(UFO_ENTER_START);
          setStage(5);
        }
      }, UFO_LEAVE_DURATION / steps);
    }
    else if (stage === 5) { // Clock reappears
      setClockY(CLOCK_BASE_Y); setClockScale(1); setClockOpacity(1); setClockVisible(true);
      timer = setTimeout(() => setStage(6), CLOCK_REAPPEAR_DELAY);
    }
    else if (stage === 6) { // UFO comes in and abducts again
      setUfoX(UFO_ENTER_START);
      timer = setTimeout(() => {
        setUfoX(UFO_HOVER_X);
        setStage(7);
      }, 1800);
    }
    else if (stage === 7) { // UFO hovers, beam appears quickly, then abduction
      setBeam(true);
      setTimeout(() => setStage(2), 400); // Immediate re-abduction: go back to "scrunch"
    }
    else if (stage === 8) { // (Optional any extra repeat stage. Otherwise restart loop)
      timer = setTimeout(() => setStage(0), LOOP_DELAY);
    }
    return () => timer && clearTimeout(timer);
  }, [stage]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #050b1a 0%, #21233c 65%, #b29971 100%)'
    }}>
      <div style={{
        position: 'absolute',
        left: 0, bottom: 0,
        width: '100vw', height: '26dvh',
        background: 'linear-gradient(180deg, #b29971 20%, #d7c28e 100%)'
      }} />
      {/* Digital Clock */}
      {clockVisible && (
        <div style={{
          position: 'absolute',
          left: '50vw', transform: `translateX(-50%) scale(${clockScale})`,
          top: `${clockY}dvh`,
          color: '#fffefc',
          background: 'rgba(25,23,45, 0.8)',
          fontFamily: 'monospace',
          fontSize: '3.5rem',
          padding: '1.2rem 2.5rem',
          borderRadius: '2rem',
          boxShadow: '0 0 3rem 1rem #efe6c8',
          textAlign: 'center',
          opacity: clockOpacity
        }}>
          {clockText}
        </div>
      )}
      {/* UFO */}
      <div style={{
        position: 'absolute',
        top: `36dvh`,
        left: `${ufoX}vw`,
        width: '10vw',
        height: '4.8dvh',
        background: 'radial-gradient(circle,#cacde1 70%,#a5abbf 100%)',
        borderRadius: '50%/55%',
        boxShadow: '0 0 6rem 0.8rem #b7c3f2',
        zIndex: 4,
        transition: 'left 0.4s linear'
      }}>
        {/* UFO dome */}
        <div style={{
          position: 'absolute',
          left: '1vw',
          top: '-2dvh',
          width: '8vw',
          height: '2dvh',
          background: 'radial-gradient(circle,#e8e8e8 60%,#acb3c7 100%)',
          borderRadius: '50%'
        }} />
        {/* Beam */}
        {beam && (
          <div style={{
            position: 'absolute',
            left: '4vw', top: '2dvh',
            width: '2vw', height: '44dvh',
            background: 'linear-gradient(180deg, rgba(194,241,255,0.48) 0%, rgba(255,255,192,0.18) 85%, rgba(255,230,192,0.00) 100%)',
            borderRadius: '0.8vw',
            filter: 'blur(0.25rem)'
          }} />
        )}
      </div>
      {Array.from({length:18}).map((_,i)=>(
        <div key={i} style={{
          position:'absolute',
          left:`${(6+i*5)%100}vw`,
          top:`${(150 + i*11)%85}dvh`,
          width:'0.44rem', height:'0.44rem',
          borderRadius:'50%',
          background:'#fff',
          opacity:0.52 + (i%3)*0.15
        }} />
      ))}
      <div style={{
        position:'absolute',
        left:0,top:0,
        width:'100vw',height:'100dvh',
        pointerEvents:'none',
        background: 'radial-gradient(ellipse at 54vw 8dvh, rgba(40,60,140,0.27) 0%,rgba(30,32,49,0.65) 100%)'
      }} />
    </div>
  );
}
