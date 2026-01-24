import React, { useEffect, useState, useMemo } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [currentEmoji, setCurrentEmoji] = useState('🎲');
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  const tileSize = 60;

  // Memoize the emoji list so it's only created once
  const allEmojis = useMemo(() => {
    const ranges = [[0x1F600, 0x1F64F], [0x1F300, 0x1F5FF], [0x1F680, 0x1F6FF], [0x1F900, 0x1F9FF]];
    const list = [];
    ranges.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) list.push(String.fromCodePoint(i));
    });
    return list;
  }, []);

  const digitToEmoji = {
    '0': '🕳️', '1': '📍', '2': '✌️', '3': '🔱', '4': '🍀',
    '5': '⭐', '6': '🐝', '7': '🎰', '8': '🎱', '9': '☁️'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Change background emoji every second
      setCurrentEmoji(allEmojis[Math.floor(Math.random() * allEmojis.length)]);
    }, 1000);

    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [allEmojis]);

  // Create the CSS variable for the background to keep the DOM stable
  const backgroundLayerStyle = useMemo(() => {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">
        <text x="50%" y="55%" font-size="${tileSize * 0.9}" text-anchor="middle" dominant-baseline="middle">
          ${currentEmoji}
        </text>
      </svg>`.trim();
    
    return {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${tileSize}px ${tileSize}px`,
      backgroundPosition: 'center',
      zIndex: 1,
      transition: 'background-image 0.3s ease-in-out'   };
  }, [currentEmoji]);

  // Format time strings
  const format = (val) => String(val).padStart(2, '0');
  const h = format(((time.getHours() + 11) % 12) + 1);
  const m = format(time.getMinutes());
  const s = format(time.getSeconds());

  const renderDigits = (str) => (
    <div style={{ display: 'flex' }}>
      {str.split('').map((d, i) => (
        <div key={i} style={{
          width: isLargeScreen ? '14vw' : '20vh',
          fontSize: isLargeScreen ? '14vw' : '20vh',
          textAlign: 'center',
          lineHeight: 1
        }}>
          {digitToEmoji[d]}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ 
      height: '100dvh', width: '100vw', backgroundColor: '#8A8D8C', 
      position: 'relative', overflow: 'hidden', display: 'flex',
      justifyContent: 'center', alignItems: 'center' 
    }}>
      <div style={backgroundLayerStyle} />

      <div style={{
        position: 'relative', zIndex: 2, display: 'flex',
        flexDirection: isLargeScreen ? 'row' : 'column',
        alignItems: 'center', gap: '1rem',
        padding: '2rem', borderRadius: '2rem',
      }}>
        {renderDigits(h)}
      
        {renderDigits(m)}

        {renderDigits(s)}
      </div>
    </div>
  );
};

export default Clock;