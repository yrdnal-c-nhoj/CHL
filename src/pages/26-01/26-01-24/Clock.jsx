import React, { useEffect, useState, useMemo } from 'react';

const Clock = () => {
  const [time, setTime] = useState(() => new Date());
  const [currentEmoji, setCurrentEmoji] = useState('🎲');
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const allEmojis = useMemo(() => {
    const rawList = [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🪇', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🪈', '🎲', '♟', '🎯', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐦‍⬛', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🪼', '🪸', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🫏', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🫎', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪽', '🪶', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🪿', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲', '🐦‍🔥', '🌵', '🎄', '🌲', '🌳', '🪾', '🌴', '🪹', '🪺', '🪵', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🎋', '🍃', '🍂', '🍁', '🍄', '🍄‍🟫', '🐚', '🪨', '🌾', '💐', '🌷', '🪷', '🌹', '🥀', '🌺', '🌸', '🪻', '🌼', '🌻', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🛞', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵️', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓️', '🛟', '🪝', '⛽️', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🛝', '🎠', '⛲️', '⛱', '🏖', '🏝', '🏜', '🌋', '⛰', '🏔', '🗻', '🏕', '⛺️', '🛖', '🏠', '🏡', '🏘', '🏚', '🏗', '🎳'
    ];
    // Filter out any potential falsy values (like empty strings or undefined from commas)
    return [...new Set(rawList)].filter(Boolean);
  }, []);

  const digitToEmoji = {
    '0': '🕳️', '1': '📍', '2': '🥈', '3': '🔱', '4': '🍀',
    '5': '⭐', '6': '🐝', '7': '🎰', '8': '🎱', '9': '☁️',
  };

  useEffect(() => {
    let secondsCounter = 0;
    const timer = setInterval(() => {
      setTime(new Date());
      secondsCounter++;
      if (secondsCounter % 3 === 0) {
        setCurrentEmoji(prev => {
          const next = allEmojis[Math.floor(Math.random() * allEmojis.length)];
          return next || prev;
        });
      }
    }, 1000);

    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [allEmojis]);

  const tileSize = 60;

  const backgroundLayerStyle = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">
        <text x="50%" y="55%" font-size="${tileSize * 0.7}" text-anchor="middle" dominant-baseline="middle">
          ${currentEmoji}
        </text>
      </svg>`.trim();

    return {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${tileSize}px ${tileSize}px`,
      backgroundPosition: 'center',
      zIndex: 1,
      transition: 'background-image 0.4s ease-in-out',
    };
  }, [currentEmoji]);

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
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {digitToEmoji[d]}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      height: '100dvh', width: '100vw', backgroundColor: '#E9DBF0',
      position: 'relative', overflow: 'hidden', display: 'flex',
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'
    }}>
      <div style={backgroundLayerStyle} />
      <div style={{
        position: 'relative', zIndex: 2, display: 'flex',
        flexDirection: isLargeScreen ? 'row' : 'column',
        alignItems: 'center', gap: isLargeScreen ? '2rem' : '0.5rem',
        padding: '2rem', borderRadius: '3rem', 
      }}>
        {renderDigits(h)}
        {renderDigits(m)}
        {renderDigits(s)}
      </div>
    </div>
  );
};

export default Clock;