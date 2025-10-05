import React, { useState, useEffect } from 'react';
import ufoImg from './ufo.webp';
import skyImg from './stars.gif';
import nebulaImg from './sta.gif';
import customFont from './cow.ttf';

function getClockTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const dateVariation = '20250929';
const customFontFamily = `CustomClockFont${dateVariation}`;

export default function DesertUFOSequence() {
  const [stage, setStage] = useState(0);
  const [ufoX, setUfoX] = useState(112);
  const [clockY, setClockY] = useState(100);
  const [beam, setBeam] = useState(false);
  const [clockVisible, setClockVisible] = useState(true);
  const [clockOpacity, setClockOpacity] = useState(1);
  const [clockText, setClockText] = useState(getClockTime());
  const [chaos, setChaos] = useState(0);
  const [sparks, setSparks] = useState([]);
  const [digitScale, setDigitScale] = useState(1);
  const [blobOpacity, setBlobOpacity] = useState(0);
  const [blobScale, setBlobScale] = useState(1);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive constants
  const UFO_WIDTH = isMobile ? 24 : 28; // Smaller UFO on mobile
  const UFO_HOVER_X = 50 - UFO_WIDTH / 2;
  const UFO_ENTER_START = 112;
  const UFO_LEAVE_END = -15;
  const CLOCK_BASE_Y = isMobile ? 90 : 100; // Adjust clock position for mobile
  const CLOCK_ABDUCTED_Y = isMobile ? 50 : 44;
  const ABDUCTION_DELAY = 1700;
  const CHAOS_DURATION = 3000;
  const TRANSFORM_DURATION = 50;
  const UFO_LEAVE_DURATION = 2000;
  const LOOP_DELAY = 1000;
  const FLASH_DURATION = 600;

  // Load font
  useEffect(() => {
    const font = new FontFace(customFontFamily, `url(${customFont})`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));
  }, []);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clock update
  useEffect(() => {
    const interval = setInterval(() => setClockText(getClockTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  function generateSparks(count = 8) {
    const newSparks = Array.from({ length: count }).map(() => ({
      left: Math.random() * 10 - 5,
      top: Math.random() * 10 - 5,
      size: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.4,
    }));
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 400);
  }

  const renderScrambledClock = () =>
    clockText.split('').map((char, i) => (
      <span
        key={i}
        className="clock-text"
        style={{
          display: 'inline-block',
          transform: `translate(${(Math.random() - 0.5) * chaos}vw, ${(Math.random() - 0.5) * chaos}dvh) rotate(${(Math.random() - 0.5) * chaos * 5}deg) scale(${digitScale})`,
          transition: 'transform 0.005s linear, opacity 0.2s linear, filter 0.2s linear, color 0.2s linear',
          opacity: 0.5,
          filter: stage === 3 ? `blur(${0.4 * (1 - clockOpacity)}rem)` : 'none',
          color: stage === 3 ? `rgba(255,255,255,${1 - (1 - clockOpacity) * 0.5})` : '#B3EF30FF',
        }}
      >
        {char}
      </span>
    ));

  useEffect(() => {
    let timer;
    if (stage === 0) {
      setClockVisible(true);
      setClockOpacity(1);
      setClockY(CLOCK_BASE_Y);
      setBeam(false);
      setUfoX(UFO_ENTER_START);
      setDigitScale(1);
      setClockText(getClockTime());
      setBlobOpacity(0);
      setBlobScale(1);
      setFlashOpacity(0);
      const steps = 30;
      let step = 0;
      const slideInterval = setInterval(() => {
        step++;
        setClockY((prev) => Math.max(isMobile ? 70 : 80, prev - ((CLOCK_BASE_Y - (isMobile ? 70 : 80)) / steps)));
        if (step >= steps) clearInterval(slideInterval);
      }, 60);
      timer = setTimeout(() => {
        setUfoX(UFO_HOVER_X);
        setStage(1);
      }, 2500);
    } else if (stage === 1) {
      setBeam(false);
      timer = setTimeout(() => setStage(2), ABDUCTION_DELAY);
    } else if (stage === 2) {
      setBeam(true);
      timer = setTimeout(() => setStage(2.5), 300);
    } else if (stage === 2.5) {
      const steps = 60;
      let step = 0;
      const chaosInterval = setInterval(() => {
        step++;
        setChaos(Math.random() * 100);
        if (step >= steps) {
          clearInterval(chaosInterval);
          setChaos(0);
          setStage(3);
        }
      }, CHAOS_DURATION / steps);
    } else if (stage === 3) {
      generateSparks();
      let startTime = null;
      const transformToBlob = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / TRANSFORM_DURATION, 1);
        setDigitScale(1 - progress * 0.8);
        setClockOpacity(1 - progress);
        setBlobOpacity(progress);
        setBlobScale(1 - progress * 0.5);
        if (progress < 1) {
          requestAnimationFrame(transformToBlob);
        } else {
          setClockVisible(false);
          setClockOpacity(0);
          setDigitScale(0);
          setClockText('');
          setFlashOpacity(0.7);
          setTimeout(() => setFlashOpacity(0), FLASH_DURATION);
          let blobStart = performance.now();
          const moveBlob = (now) => {
            const blobProgress = Math.min((now - blobStart) / UFO_LEAVE_DURATION, 1);
            setClockY(CLOCK_BASE_Y - (CLOCK_BASE_Y - CLOCK_ABDUCTED_Y) * blobProgress);
            setBlobOpacity(1 - blobProgress);
            if (blobProgress < 1) requestAnimationFrame(moveBlob);
            else setStage(4);
          };
          requestAnimationFrame(moveBlob);
        }
      };
      requestAnimationFrame(transformToBlob);
    } else if (stage === 4) {
      setBeam(false);
      let step = 0;
      const leaveSteps = 26;
      const leaveInterval = setInterval(() => {
        step++;
        setUfoX((prev) => Math.max(UFO_LEAVE_END, prev - ((UFO_HOVER_X - UFO_LEAVE_END) / leaveSteps)));
        if (step >= leaveSteps) {
          clearInterval(leaveInterval);
          setStage(5);
        }
      }, UFO_LEAVE_DURATION / leaveSteps);
    } else if (stage === 5) {
      timer = setTimeout(() => {
        setUfoX(UFO_ENTER_START);
        setStage(0);
      }, LOOP_DELAY);
    }
    return () => timer && clearTimeout(timer);
  }, [stage, isMobile]);

  if (!fontLoaded)
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          background: 'black',
        }}
      />
    );

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundImage: `url(${nebulaImg}), url(${skyImg})`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <style>
        {`
          @font-face {
            font-family: "${customFontFamily}";
            src: url(${customFont}) format('woff2');
          }
          .clock-text {
            font-family: "${customFontFamily}", monospace;
          }
          @media (max-width: 768px) {
            .clock-text-container {
              font-size: 10vw !important;
              padding: 1vw 2vw !important;
            }
            .ufo-container {
              top: 32.4dvh !important;
              width: 20vw !important;
            }
            .beam {
              width: 3vw !important;
              height: 40dvh !important;
            }
          }
          @media (min-width: 769px) {
            .clock-text-container {
              font-size: 12vw !important;
              padding: 1.2vw 2.5vw !important;
            }
            .ufo-container {
              top: 32.4dvh !important;
              width: 28vw !important;
            }
            .beam {
              width: 4vw !important;
              height: 44dvh !important;
            }
          }
        `}
      </style>
      {/* Flash Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          background: 'white',
          opacity: flashOpacity,
          pointerEvents: 'none',
          transition: `opacity ${FLASH_DURATION / 1000}s linear`,
          zIndex: 10,
        }}
      />
      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100vw',
          height: '28dvh',
          background: 'linear-gradient(to top, #C8943FFF 0%, #AE854BFF 40%, #3B3404FF 100%)',
        }}
      />
      {/* Clock and Blob */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${clockY}dvh`,
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'pre',
          zIndex: 6,
        }}
      >
        {clockVisible && (
          <div
            className="clock-text-container"
            style={{
              padding: stage === 3 ? '0' : '1.2vw 2.5vw',
              borderRadius: stage === 3 ? '50%' : '2rem',
              transition: 'padding 0.2s linear, border-radius 0.2s linear',
              fontFamily: 'CowFont, serif',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#055500',
              textShadow: '0.3vw 0.3vw 0 #7a5a32, -1vw -1vw 0 #F4EFE9FF',
              letterSpacing: '0.05em',
              paddingInline: '0.5em',
            }}
          >
            {stage === 2.5 || stage === 3 ? (
              renderScrambledClock()
            ) : (
              <span
                className="clock-text"
                style={{
                  display: 'inline-block',
                  transform: `scale(${digitScale})`,
                  opacity: clockOpacity,
                  transition: 'transform 0.05s linear, opacity 0.05s linear',
                  color: '#E6EAE6FF',
                  textShadow: '0.5vw 0.5vw 0 #141312FF',
                }}
              >
                {clockText}
              </span>
            )}
          </div>
        )}
        {/* Blob */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            width: '3rem',
            height: '6rem',
            borderRadius: '50%',
            background: '#B1ED7FFF',
            filter: 'blur(0.5rem) drop-shadow(0 0 1.2rem #C7F650FF)',
            transform: `translateX(-50%) scale(${blobScale})`,
            opacity: blobOpacity,
            pointerEvents: 'none',
            zIndex: 7,
          }}
        />
        {sparks.map((spark, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${spark.left}vw)`,
              top: `${spark.top}dvh`,
              width: `${spark.size}rem`,
              height: `${spark.size}rem`,
              borderRadius: '50%',
              background: 'gold',
              opacity: spark.opacity,
              pointerEvents: 'none',
              filter: 'blur(0.1rem)',
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}
      </div>
      {/* UFO + Beam */}
      <div
        className="ufo-container"
        style={{
          position: 'absolute',
          top: '32.4dvh', // Moved 10% closer to the top
          left: `${ufoX}vw`,
          transition: 'left 0.4s linear',
        }}
      >
        {/* Beam behind UFO */}
        {beam && (
          <div
            className="beam"
            style={{
              position: 'absolute',
              left: '50%',
              top: '60%',
              transform: 'translateX(-50%)',
              height: '44dvh',
              background: 'linear-gradient(180deg, rgba(194,241,255,0.98) 0%, rgba(255,255,192,0.88) 85%, rgba(255,230,192,0.00) 100%)',
              borderRadius: '0.8vw',
              filter: 'blur(0.2rem)',
              zIndex: 3,
            }}
          />
        )}
        {/* UFO on top */}
        <img
          src={ufoImg}
          alt="UFO"
          style={{
            width: '100%',
            display: 'block',
            pointerEvents: 'none',
            position: 'relative',
            zIndex: 4,
          }}
        />
      </div>
      {/* Atmospheric overlay */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100dvh',
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 54vw 8dvh, rgba(40,60,140,0.52) 0%, rgba(30,32,49,0.25) 100%)',
        }}
      />
    </div>
  );
}