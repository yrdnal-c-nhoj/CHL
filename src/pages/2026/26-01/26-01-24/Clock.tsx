import React, { useEffect, useState, useMemo } from 'react';

const Clock: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [time, setTime] = useState(() => new Date());
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
  const [bgReady, setBgReady] = useState<boolean>(false);

  // --- EMOJI POOL ---
  const allEmojis = useMemo(() => {
    const rawList = [
      '🏓',
      '🏸',
      '🏒',
      '🏑',
      '🏏',
      '🥅',
      '🎣',
      '🥊',
      '🎽',
      '🛹',
      '🛷',
      '🥌',
      '🎿',
      '🎭',
      '🎨',
      '🎬',
      '🎹',
      '🥁',
      '🎸',
      '🎯',
      '🐶',
      '🐱',
      '🐹',
      '🦊',
      '🐯',
      '🦁',
      '🐸',
      '🦄',
      '🐄',
      '🐎',
      '🐩',
      '🐈',
      '🐅',
      '🦓',
      '🦒',
      '🦘',
      '🐛',
      '🦋',
      '🐌',
      '🐢',
      '🐍',
      '🦎',
      '🐙',
      '🦑',
      '🦐',
      '🦀',
      '🐡',
      '🐠',
      '🐬',
      '🐳',
      '🐋',
      '🦈',
      '🦃',
      '🦚',
      '🦜',
      '🦩',
      '🐾',
      '🐉',
      '🐲',
      '🌵',
      '🌴',
      '🌱',
      '🌿',
      '🎋',
      '🍁',
      '🍄',
      '🌾',
      '💐',
      '🌹',
      '🌸',
      '🌼',
      '🚗',
      '🚌',
      '🚎',
      '🏎',
      '🚒',
      '🚚',
      '🚜',
      '🚲',
      '🛵',
      '🚍',
      '🚘',
      '🚋',
      '🚞',
      '🚂',
      '🚇',
      '🚊',
      '🚀',
      '🚁',
      '🛶',
      '🚤',
      '🚢',
      '🗿',
      '🗽',
      '🗼',
      '🏰',
      '🏟',
      '🎡',
      '🎢',
      '🎠',
      '🏖',
      '🏜',
      '🌋',
      '🏔',
      '🏕',
      '🏘',
      '🏗',
      '🗺',
      '💺',
      '🎳',
    ];
    return [...new Set(rawList)].filter(Boolean);
  }, []);

  // --- NON-REPEATING CYCLE SYSTEM ---
  const [emojiCycle] = useState(() =>
    [...allEmojis].sort(() => Math.random() - 0.5),
  );
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  // --- DOUBLE BUFFER SYSTEM ---
  const [activeBuffer, setActiveBuffer] = useState<number>(1);
  const [buffer1Emoji, setBuffer1Emoji] = useState<any>(emojiCycle[0]);
  const [buffer2Emoji, setBuffer2Emoji] = useState<any>('');

  // --- DIGIT MAPPING ---
  const digitToEmoji = {
    0: '🕳️',
    1: '📍',
    2: '🥈',
    3: '🔱',
    4: '🍀',
    5: '⭐',
    6: '🐝',
    7: '🎰',
    8: '🎱',
    9: '☁️',
  };

  // --- MAIN EFFECT LOOP ---
  useEffect(() => {
    let frameId: number;
    let secondsCounter = 0;
    let lastTime = Date.now();

    const tick = () => {
      const now = Date.now();
      setTime(new Date());

      if (now - lastTime >= 1000) {
        secondsCounter++;
        lastTime = now;

        if (secondsCounter % 3 === 0) {
          setEmojiIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % emojiCycle.length;
            const nextEmoji = emojiCycle[nextIndex];

            if (activeBuffer === 1) {
              setBuffer2Emoji(nextEmoji);
              setActiveBuffer(2);
            } else {
              setBuffer1Emoji(nextEmoji);
              setActiveBuffer(1);
            }
            return nextIndex;
          });
        }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [emojiCycle, activeBuffer]);

  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const tileSize = 60;

  const getLayerStyle = (emoji, isVisible) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">
        <text x="50%" y="55%" font-size="${tileSize * 0.7}" text-anchor="middle" dominant-baseline="middle">
          ${emoji}
        </text>
      </svg>`.trim();

    return {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${tileSize}px ${tileSize}px`,
      backgroundPosition: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1,
      willChange: 'opacity',
    };
  };

  const format = (val) => String(val).padStart(2, '0');
  const h = format(((time.getHours() + 11) % 12) + 1);
  const m = format(time.getMinutes());
  const s = format(time.getSeconds());

  const renderDigits = (str) => (
    <div style={{ display: 'flex' }}>
      {str.split('').map((d, i) => (
        <div
          key={i}
          style={{
            width: isLargeScreen ? '12vw' : '20vh',
            fontSize: isLargeScreen ? '12vw' : '20vh',
            textAlign: 'center',
            // Interactivity removed: transitions, cursor, and transform-based effects are gone.
            textShadow: `
              0 -1px 5px rgba(255, 255, 255, 0.9),
              -1px -1px 0px #fff,
              1px 1px 0px rgba(0, 0, 0, 0.67),
              3px 3px 3px rgba(0, 0, 0, 0.3),
              15px 15px 35px rgba(0, 0, 0, 0.2)
            `,
            // filter: 'drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.92))',
          }}
        >
          {digitToEmoji[d]}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        backgroundColor: '#DAD3DE',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        opacity: bgReady ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div style={getLayerStyle(buffer1Emoji, activeBuffer === 1)} />
      <div style={getLayerStyle(buffer2Emoji, activeBuffer === 2)} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: isLargeScreen ? 'row' : 'column',
          alignItems: 'center',
          gap: isLargeScreen ? '2rem' : '1rem',
          padding: isLargeScreen ? '3rem 5rem' : '2rem',
        }}
      >
        {renderDigits(h)}
        {renderDigits(m)}
        {renderDigits(s)}
      </div>
    </div>
  );
};

export default Clock;
