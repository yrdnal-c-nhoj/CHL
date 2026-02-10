import React, { useEffect, useState, useMemo } from 'react';

const Clock = () => {
  const [time, setTime] = useState(() => new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [bgReady, setBgReady] = useState(false);
  const [bgVisible, setBgVisible] = useState(true);

  const allEmojis = useMemo(() => {
    const rawList = [
      '🏀','🏈','🥎','🎾','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳️','🪁','🏹','🎣','🤿','🥊','🎽',
      '🛹','🛼','🛷','🥌','🎿','🎭','🩰','🎨','🎬','🎤','🎧','🎹','🥁','🪘','🪇','🎷','🎺','🪗','🎸','🪕','🎻','🪈','♟','🎯',
      '🐶','🐱','🐹','🦊','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐥','🦆','🦅','🦉','🦇','🦄','🐝','🪱','🐛','🦋','🐌','🐢','🐍',
      '🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🪼','🪸','🐡','🐠','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦧','🦣','🐘','🦛',
      '🦏','🐪','🐫','🦒','🦘','🐄','🐎','🦌','🫎','🐩','🦮','🐈','🪶','🐓','🦃','🦤','🦚','🦜','🦩','🕊','🐇','🦨','🦥','🐿',
      '🐾','🐉','🐲','🐦‍🔥','🌵','🌴','🪺','🪵','🌱','🌿','🪴','🎋','🍁','🍄','🌾','💐','🪷','🌹','🥀','🌸','🪻','🌼',
      '🚗','🚌','🚎','🏎','🚒','🛻','🚚','🚜','🚲','🛵','🚍','🚘','🚖','🛞','🚡','🚠','🚋','🚞','🚈','🚂','🚇','🚊','✈️',
      '💺','🛰','🚀','🛸','🚁','🛶','⛵️','🚤','🚢','🛟','🪝','⛽️','🚏','🗺','🗿','🗽','🗼','🏰','🏯','🏟','🎡','🎢','🛝',
      '🎠','⛲️','⛱','🏖','🏝','🏜','🌋','🏔','🏕','🛖','🏘','🏗','🎳'
    ];
    return [...new Set(rawList)].filter(Boolean);
  }, []);

  const [currentEmoji, setCurrentEmoji] = useState(() => {
    const list = [...new Set([
      '🏀','🏈','🥎','🎾','🏉','🥏','🎱','🪀','🏓','🏸','🐶','🐱','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐬','🚗','🚀','🌸'
    ])];
    return list[Math.floor(Math.random() * list.length)];
  });

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
        setBgVisible(false);
        setTimeout(() => {
          setCurrentEmoji(prev => {
            const next = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            return next || prev;
          });
          setBgVisible(true);
        }, 600);
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

  // Small delay to avoid flash on mount
  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const tileSize = 60;

  // Grid size that covers any viewport (tiles are 60px)
  const gridCols = 25;
  const gridRows = 20;
  const backgroundTiles = useMemo(() => {
    const cells = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        cells.push({ key: `${r}-${c}` });
      }
    }
    return cells;
  }, []);

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
            width: isLargeScreen ? '12vw' : '25vh',
            fontSize: isLargeScreen ? '12vw' : '25vh',
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
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        backgroundColor: '#E9DBF0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        opacity: bgReady ? 1 : 0,
        visibility: bgReady ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: bgVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridRows}, ${tileSize}px)`,
          justifyContent: 'center',
          alignContent: 'center',
          overflow: 'hidden',
        }}
      >
        {backgroundTiles.map(({ key }) => (
          <div
            key={key}
            style={{
              width: tileSize,
              height: tileSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: tileSize * 0.7,
              lineHeight: 1,
            }}
          >
            {currentEmoji}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: isLargeScreen ? 'row' : 'column',
          alignItems: 'center',
          gap: isLargeScreen ? '2rem' : '0.5rem',
          padding: '2rem',
          borderRadius: '3rem',
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
