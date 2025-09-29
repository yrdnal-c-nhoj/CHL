import React, { useState, useEffect } from 'react';
import ufoImg from './ufo.gif';
import skyImg from './sky.gif'; // Imported background image from the same folder
import customFont from './cow.ttf'; // Imported custom font from the same folder

function getClockTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// UFO positioning
const UFO_WIDTH = 18; // VW
const UFO_HOVER_X = 50 - UFO_WIDTH / 2;
const UFO_ENTER_START = 112;
const UFO_LEAVE_END = -15;

// Clock positioning
const CLOCK_BASE_Y = 100;
const CLOCK_ABDUCTED_Y = 44;
const ABDUCTION_DELAY = 1700;
const CHAOS_DURATION = 3000;
const COLLAPSE_DURATION = 1000;
const UFO_LEAVE_DURATION = 2000;
const LOOP_DELAY = 1000;

// Date-based font variation
const dateVariation = '20250929'; // Based on current date: September 29, 2025
const customFontFamily = `CustomClockFont${dateVariation}`;

export default function DesertUFOSequence() {
  const [stage, setStage] = useState(0);
  const [ufoX, setUfoX] = useState(UFO_ENTER_START);
  const [clockY, setClockY] = useState(CLOCK_BASE_Y);
  const [clockGlow, setClockGlow] = useState(false);
  const [beam, setBeam] = useState(false);
  const [clockVisible, setClockVisible] = useState(true);
  const [clockOpacity, setClockOpacity] = useState(1);
  const [clockText, setClockText] = useState(getClockTime());
  const [chaos, setChaos] = useState(0);
  const [sparks, setSparks] = useState([]);
  const [digitScale, setDigitScale] = useState(1);
  const [clockScaleX, setClockScaleX] = useState(1);
  const [clockScaleY, setClockScaleY] = useState(1);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Preload font
  useEffect(() => {
    const font = new FontFace(customFontFamily, `url(${customFont})`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch((err) => {
      console.error('Font loading failed:', err);
      setFontLoaded(true); // Fallback to render with monospace if font fails
    });
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setClockText(getClockTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate random sparks
  function generateSparks(count = 8) {
    const newSparks = Array.from({ length: count }).map(() => ({
      left: Math.random() * 10 - 5,
      top: Math.random() * 10 - 5,
      size: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.4
    }));
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 400);
  }

  // Scrambled clock for chaos effect
  const renderScrambledClock = () => {
    return clockText.split('').map((char, i) => (
      <span
        key={i}
        className="clock-text"
        style={{
          display: 'inline-block',
          transform: `translate(${(Math.random() - 0.5) * chaos}vw, ${(Math.random() - 0.5) * chaos}dvh) rotate(${(Math.random() - 0.5) * chaos * 5}deg) scale(${digitScale})`,
          transition: 'transform 0.05s linear, opacity 0.05s linear',
          opacity: clockOpacity
        }}
      >
        {char}
      </span>
    ));
  };

  useEffect(() => {
    let timer;

    if (stage === 0) {
      setClockVisible(true);
      setClockOpacity(1);
      setClockScaleX(1);
      setClockScaleY(1);
      setClockY(CLOCK_BASE_Y);
      setBeam(false);
      setClockGlow(false); // Reset to dark color
      setUfoX(UFO_ENTER_START);
      setDigitScale(1);
      setClockText(getClockTime()); // Reset clock text

      const steps = 30;
      let step = 0;
      const slideInterval = setInterval(() => {
        step++;
        setClockY(prev => Math.max(80, prev - ((CLOCK_BASE_Y - 80) / steps)));
        if (step >= steps) clearInterval(slideInterval);
      }, 60);

      timer = setTimeout(() => {
        setUfoX(UFO_HOVER_X);
        setStage(1);
      }, 2500);
    }

    else if (stage === 1) {
      setBeam(false);
      timer = setTimeout(() => setStage(2), ABDUCTION_DELAY);
    }

    else if (stage === 2) {
      setBeam(true);
      setClockGlow(true);
      timer = setTimeout(() => setStage(2.5), 300);
    }

    else if (stage === 2.5) {
      // Chaos wobble effect
      const steps = 60;
      let step = 0;
      const chaosInterval = setInterval(() => {
        step++;
        setChaos(Math.random() * 10);
        if (step >= steps) {
          clearInterval(chaosInterval);
          setChaos(0);
          setStage(3);
        }
      }, CHAOS_DURATION / steps);
    }

    else if (stage === 3) {
      generateSparks();

      let startTime = null;

      const collapseDigits = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / COLLAPSE_DURATION, 1);

        // Shake & collapse clock into a thin blob of light
        setChaos(10 * (1 - progress));
        setDigitScale(1 - progress);
        setClockOpacity(1 - progress); // Fade digits
        setClockScaleX(0.05); // Collapse horizontally to a thin line
        setClockScaleY(0.2); // Slightly reduce vertical size for blob effect

        if (progress < 1) {
          requestAnimationFrame(collapseDigits);
        } else {
          // Clock fully collapsed into a blob
          setDigitScale(0);
          setClockOpacity(0); // Digits fully transparent
          setClockText('');
          setChaos(0);

          // Trigger the beam moving up into UFO
          const beamStart = performance.now();
          const moveBeam = (now) => {
            const beamProgress = Math.min((now - beamStart) / UFO_LEAVE_DURATION, 1);

            setClockY(CLOCK_BASE_Y - (CLOCK_BASE_Y - CLOCK_ABDUCTED_Y) * beamProgress);

            if (beamProgress < 1) {
              requestAnimationFrame(moveBeam);
            } else {
              setClockVisible(false);
              setStage(4);
            }
          };
          requestAnimationFrame(moveBeam);
        }
      };

      requestAnimationFrame(collapseDigits);
    }

    else if (stage === 4) {
      setBeam(false);
      let step = 0;
      const leaveSteps = 26;
      const leaveInterval = setInterval(() => {
        step++;
        setUfoX(prev => Math.max(UFO_LEAVE_END, prev - ((UFO_HOVER_X - UFO_LEAVE_END) / leaveSteps)));
        if (step >= leaveSteps) {
          clearInterval(leaveInterval);
          setStage(5);
        }
      }, UFO_LEAVE_DURATION / leaveSteps);
    }

    else if (stage === 5) {
      timer = setTimeout(() => {
        setUfoX(UFO_ENTER_START);
        setStage(0);
      }, LOOP_DELAY);
    }

    return () => timer && clearTimeout(timer);
  }, [stage]);

  // Show black page until font is loaded
  if (!fontLoaded) {
    return <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', background: 'black' }} />;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', backgroundImage: `url(${skyImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Embedded styles to avoid leakage */}
      <style>{`
        @font-face {
          font-family: "${customFontFamily}";
          src: url(${customFont}) format('woff2');
        }
        .clock-text {
          font-family: "${customFontFamily}", monospace;
        }
      `}</style>

      {/* Ground */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100vw', height: '26dvh', background: '#b29971', opacity: 1 }} />

      {/* Clock */}
      {clockVisible && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: `${clockY}dvh`,
          transform: `translateX(-50%) scale(${clockScaleX}, ${clockScaleY})`,
          color: '#fffefc',
          background: clockGlow ? 'rgba(255,255,200,0.9)' : 'rgba(25,23,45,0.8)',
          fontSize: '3.5rem',
          padding: stage === 3 ? '0' : '1.2rem 2.5rem',
          borderRadius: stage === 3 ? '50%' : '2rem',
          boxShadow: clockGlow ? '0 0 6rem 3rem #FFF8A9FF' : '0 0 3rem 1rem #efe6c8',
          textAlign: 'center',
          opacity: 1, // Container remains visible for blob effect
          whiteSpace: 'pre',
          transition: 'all 0.05s linear, transform 0.2s linear, padding 0.2s linear, border-radius 0.2s linear'
        }}>
          {stage === 2.5 || stage === 3 ? renderScrambledClock() : (
            <span className="clock-text" style={{
              display: 'inline-block',
              transform: `scale(${digitScale}) translate(${(Math.random()-0.5)*chaos}vw, ${(Math.random()-0.5)*chaos}dvh)`,
              opacity: clockOpacity,
              transition: 'transform 0.05s linear, opacity 0.05s linear'
            }}>
              {clockText}
            </span>
          )}

          {sparks.map((spark, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `calc(50% + ${spark.left}vw)`,
              top: `calc(${clockY}dvh + ${spark.top}dvh)`,
              width: `${spark.size}rem`,
              height: `${spark.size}rem`,
              borderRadius: '50%',
              background: 'gold',
              opacity: spark.opacity,
              pointerEvents: 'none',
              filter: 'blur(0.1rem)',
              transform: `translate(-50%, -50%)`
            }} />
          ))}
        </div>
      )}

      {/* UFO */}
      <div style={{ position: 'absolute', top: '36dvh', left: `${ufoX}vw`, width: `${UFO_WIDTH}vw`, zIndex: 4, transition: 'left 0.4s linear', filter: 'drop-shadow(0 0 1rem rgba(180,200,255,0.6))' }}>
        <img src={ufoImg} alt="UFO" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
        {beam && <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translateX(-50%)', width: '2vw', height: '44dvh', background: 'linear-gradient(180deg, rgba(194,241,255,0.48) 0%, rgba(255,255,192,0.18) 85%, rgba(255,230,192,0.00) 100%)', borderRadius: '0.8vw', filter: 'blur(0.25rem)' }} />}
      </div>


      {/* Atmospheric overlay */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100vw', height: '100dvh', pointerEvents: 'none', background: 'radial-gradient(ellipse at 54vw 8dvh, rgba(40,60,140,0.27) 0%, rgba(30,32,49,0.65) 100%)' }} />
    </div>
  );
}