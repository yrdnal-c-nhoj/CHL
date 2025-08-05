import React, { useEffect, useState, useRef } from 'react';
import slotFont from './slot.otf';
import bgImage from './IMAGE_1688551792.webp';

// Define font-face globally
const style = document.createElement('style');
style.textContent = `
  @font-face {
    font-family: 'slot';
    src: url(${slotFont}) format('opentype');
  }
`;
document.head.appendChild(style);

const SlotMachineClock = () => {
  const [time, setTime] = useState({
    hour: '',
    minute: '',
    second: '',
    ampm: ''
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelContents, setReelContents] = useState([[], [], []]); // Store content for each reel
  const [bgContents, setBgContents] = useState([[], [], []]); // Store background content for each reel
  const reelsRef = useRef([]);
  const backgroundsRef = useRef([]);

  const hourSymbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const minuteSymbols = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const secondSymbols = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const slotEmojis = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔', '🧊', '🫀', '🔭', '🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];

  const getRandomEmoji = () => slotEmojis[Math.floor(Math.random() * slotEmojis.length)];

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
      hour: hours.toString(),
      minute: minutes.toString().padStart(2, '0'),
      second: seconds.toString().padStart(2, '0'),
      ampm
    };
  };

  const populateReel = (symbol, reelType, reelIndex) => {
    const symbols = reelType === 'hour' ? hourSymbols : (reelType === 'minute' ? minuteSymbols : secondSymbols);
    const symbolIndex = symbols.indexOf(symbol);
    const selectedEmoji = getRandomEmoji();
    const reelContent = [];
    const bgContent = [];
    for (let i = -1; i <= 1; i++) {
      const index = (symbolIndex + i + symbols.length) % symbols.length;
      reelContent.push(<div key={i}>{symbols[index]}</div>);
      bgContent.push(<div key={i}>{selectedEmoji}</div>);
    }
    setReelContents(prev => {
      const newContents = [...prev];
      newContents[reelIndex] = reelContent;
      return newContents;
    });
    setBgContents(prev => {
      const newContents = [...prev];
      newContents[reelIndex] = bgContent;
      return newContents;
    });
  };

  const updateTimeDisplay = () => {
    setTime(getCurrentTime());
  };

  const stopReel = (reelIndex, targetSymbol, reelType) => {
    const reel = reelsRef.current[reelIndex];
    const bgReel = backgroundsRef.current[reelIndex];
    if (reel && bgReel) {
      reel.classList.remove('spinning');
      bgReel.classList.remove('spinning');
      reel.style.transform = 'translateY(0)';
      bgReel.style.transform = 'translateY(0)';
      setReelContents(prev => {
        const newContents = [...prev];
        newContents[reelIndex] = [<div key={0}>{targetSymbol}</div>];
        return newContents;
      });
      setBgContents(prev => {
        const newContents = [...prev];
        newContents[reelIndex] = [
          <div key={-1} style={{ opacity: 0.5 }}>{getRandomEmoji()}</div>,
          <div key={0}>{getRandomEmoji()}</div>,
          <div key={1} style={{ opacity: 0.5 }}>{getRandomEmoji()}</div>
        ];
        return newContents;
      });
      if (reelIndex === 2) {
        updateTimeDisplay();
        setTimeout(() => {
          setIsSpinning(false);
          spinReels();
        }, 1500);
      }
    }
  };

  const spinReels = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const currentTime = getCurrentTime();
    const targets = [currentTime.hour, currentTime.minute, currentTime.second];

    reelsRef.current.forEach((reel, index) => {
      if (reel && backgroundsRef.current[index]) {
        reel.classList.add('spinning');
        backgroundsRef.current[index].classList.add('spinning');
        const reelType = index === 0 ? 'hour' : (index === 1 ? 'minute' : 'second');
        populateReel(targets[index], reelType, index);
      }
    });

    setTimeout(() => stopReel(0, targets[0], 'hour'), 500);
    setTimeout(() => stopReel(1, targets[1], 'minute'), 1000);
    setTimeout(() => stopReel(2, targets[2], 'second'), 1500);
  };

  useEffect(() => {
    const initialize = () => {
      const currentTime = getCurrentTime();
      setTime(currentTime);
      const targets = [currentTime.hour, currentTime.minute, currentTime.second];
      setReelContents(targets.map((target, index) => [<div key={0}>{target}</div>]));
      setBgContents(targets.map(() => [
        <div key={-1} style={{ opacity: 0.5 }}>{getRandomEmoji()}</div>,
        <div key={0}>{getRandomEmoji()}</div>,
        <div key={1} style={{ opacity: 0.5 }}>{getRandomEmoji()}</div>
      ]));
      spinReels();
    };
    initialize();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      margin: 0,
      backgroundColor: '#080808'
    }}>
      <img src={bgImage} style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        height: '100vh',
        width: '43.75rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0.9
      }} alt="Background" />
      <div id="slot-machine" style={{
        border: '0.3125rem solid #333',
        padding: '1.25rem',
        backgroundColor: '#83773c',
        borderRadius: '0.625rem',
        boxShadow: '0 0 0.625rem rgba(0, 0, 0, 0.5)'
      }}>
        <div id="reels" style={{ display: 'flex', justifyContent: 'center' }}>
          {[0, 1, 2].map(index => (
            <div key={index} id={`reel${index + 1}`} style={{
              zIndex: 3,
              width: '5rem',
              height: '11.25rem',
              border: '0.125rem solid #000',
              margin: 0,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f8f8f8',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0.4) 100%)',
              boxShadow: 'inset 0 0 0.625rem rgba(0, 0, 0, 0.3)',
              borderRadius: '0.3125rem',
              userSelect: 'none'
            }}>
              <div className="reel-background" ref={el => backgroundsRef.current[index] = el} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '11.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                lineHeight: '6.25rem',
                opacity: 0.9,
                zIndex: 1,
                userSelect: 'none'
              }}>
                {bgContents[index]}
              </div>
              <div className="reel-content" ref={el => reelsRef.current[index] = el} style={{
                fontFamily: 'slot',
                color: 'red',
                fontWeight: 'bold',
                letterSpacing: '-0.1em',
                transform: 'scaleX(1.1)',
                textShadow: `
                  -0.0625rem -0.0625rem 0 gold,
                  0.0625rem -0.0625rem 0 gold,
                  -0.0625rem 0.0625rem 0 gold,
                  0.0625rem 0.0625rem 0 gold,
                  -0.125rem -0.125rem 0 rgb(5, 5, 4),
                  0.125rem -0.0625rem 0 rgb(36, 36, 35),
                  -0.125rem 0.125rem 0 rgb(58, 58, 56),
                  0.125rem 0.125rem 0 rgb(21, 21, 20),
                  0 0 0.625rem gold,
                  0 0 1.25rem black
                `,
                fontSize: '3.625rem',
                lineHeight: '6.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '11.25rem',
                width: '100%',
                zIndex: 2,
                userSelect: 'none'
              }}>
                {reelContents[index]}
              </div>
            </div>
          ))}
        </div>
        <div id="time-display" style={{
          zIndex: 2,
          marginTop: 0,
          fontSize: 0,
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          userSelect: 'none'
        }}>
          {`${time.hour}:${time.minute}:${time.second} ${time.ampm}`}
        </div>
      </div>
    </div>
  );
};

export default SlotMachineClock;

// Inline CSS for child elements and animations
const styles = `
  .reel-background > div {
    height: 6.25rem;
    line-height: 6.25rem;
    width: 100%;
    text-align: center;
    flex-shrink: 0;
  }

  .reel-content > div {
    height: 6.25rem;
    line-height: 6.25rem;
    width: 100%;
    text-align: center;
    flex-shrink: 0;
  }

  .spinning {
    animation: spin 0.15s linear infinite;
  }

  @keyframes spin {
    0% { transform: translateY(0); }
    100% { transform: translateY(-6.25rem); }
  }
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);