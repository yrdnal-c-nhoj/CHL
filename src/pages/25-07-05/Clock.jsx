import React, { useEffect, useRef, useState } from 'react';
import vegasFontUrl from './vegas.ttf';

const VegasClock = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const hour1Ref = useRef(null);
  const hour2Ref = useRef(null);
  const minute1Ref = useRef(null);
  const minute2Ref = useRef(null);
  const second1Ref = useRef(null);
  const second2Ref = useRef(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // Load font before showing text
  useEffect(() => {
    const font = new FontFace('vegas', `url(${vegasFontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: 'jtvmwjzZY0c',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            loop: 1,
            playlist: 'jtvmwjzZY0c',
            playsinline: 1,
          },
          events: { onReady: (event) => event.target.playVideo() },
        });
      }
    };
  }, []);

  // Clock logic
  useEffect(() => {
    if (!fontLoaded) return;

    const refs = {
      hour1: hour1Ref.current,
      hour2: hour2Ref.current,
      minute1: minute1Ref.current,
      minute2: minute2Ref.current,
      second1: second1Ref.current,
      second2: second2Ref.current,
    };

    const flickerClasses = [
      'flicker-015-a',
      'flicker-015-b',
      'flicker-015-c',
      'flicker-03-a',
      'flicker-03-b',
      'flicker-03-c',
    ];

    const getRandomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const setFlicker = (elementId, minInterval, maxInterval) => {
      const element = refs[elementId];
      if (!element) return;
      flickerClasses.forEach((cls) => element.classList.remove(cls));
      const flickerClass = flickerClasses[Math.floor(Math.random() * flickerClasses.length)];
      element.classList.add(flickerClass);
      const duration = flickerClass.includes('015') ? 150 : 300;
      setTimeout(() => element.classList.remove(flickerClass), duration);
      setTimeout(() => setFlicker(elementId, minInterval, maxInterval), getRandomInt(minInterval, maxInterval));
    };

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      hours = hours % 12 || 12;
      const hourStr = String(hours).padStart(2, '0');
      hour1Ref.current.textContent = hourStr[0];
      hour2Ref.current.textContent = hourStr[1];
      minute1Ref.current.textContent = minutes[0];
      minute2Ref.current.textContent = minutes[1];
      second1Ref.current.textContent = seconds[0];
      second2Ref.current.textContent = seconds[1];
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    setTimeout(() => setFlicker('minute2', 1000, 3000), 2000);
    setTimeout(() => setFlicker('hour1', 4000, 12000), 2000);

    return () => clearInterval(interval);
  }, [fontLoaded]);

  const iframeStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    zIndex: 1,
    pointerEvents: 'none',
  };

  const wrapperStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max-content',
    zIndex: 10,
  };

  const clockContainerStyle = {
    display: fontLoaded ? 'flex' : 'none', // hide until ready
    flexDirection: 'row',
    gap: '1vmin',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const digitGroupStyle = {
    fontFamily: 'vegas, sans-serif',
    display: 'flex',
    gap: '0.1vmin',
  };

  const digitBoxStyle = {
    color: '#edcb0b',
    textShadow:
      '#c406fe 0 0.2rem, #f84802 0 -0.2rem, #48d9e9 0.2rem 0, #f84802 -0.2rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3.5rem',
    width: '2.2rem',
    height: '4rem',
    textAlign: 'center',
    boxSizing: 'border-box',
    zIndex: 19,
  };

  return (
    <>
      <style>{`
        @keyframes flicker015a { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
        @keyframes flicker015b { 0%, 33%, 66% { opacity: 1; } 16%, 50%, 83% { opacity: 0; } }
        @keyframes flicker015c { 0%, 40% { opacity: 1; } 20%, 60%, 80% { opacity: 0; } }
        @keyframes flicker03a  { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
        @keyframes flicker03b  { 0%, 20%, 60% { opacity: 1; } 10%, 40%, 80% { opacity: 0; } }
        @keyframes flicker03c  { 0%, 33%, 66% { opacity: 1; } 16%, 50%, 83% { opacity: 0; } }

        .flicker-015-a { animation: flicker015a 0.15s 1; }
        .flicker-015-b { animation: flicker015b 0.15s 1; }
        .flicker-015-c { animation: flicker015c 0.15s 1; }
        .flicker-03-a  { animation: flicker03a 0.3s 1; }
        .flicker-03-b  { animation: flicker03b 0.3s 1; }
        .flicker-03-c  { animation: flicker03c 0.3s 1; }
      `}</style>

      {/* YouTube video as background */}
      <div ref={playerContainerRef} style={iframeStyle}></div>

      {/* Clock */}
      <div style={wrapperStyle}>
        <div style={clockContainerStyle}>
          <div style={digitGroupStyle}>
            <div ref={hour1Ref} style={digitBoxStyle}></div>
            <div ref={hour2Ref} style={digitBoxStyle}></div>
          </div>
          <div style={digitGroupStyle}>
            <div ref={minute1Ref} style={digitBoxStyle}></div>
            <div ref={minute2Ref} style={digitBoxStyle}></div>
          </div>
          <div style={digitGroupStyle}>
            <div ref={second1Ref} style={digitBoxStyle}></div>
            <div ref={second2Ref} style={digitBoxStyle}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VegasClock;
