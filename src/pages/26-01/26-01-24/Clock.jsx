import React, { useEffect, useState, useMemo } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [currentEmoji, setCurrentEmoji] = useState('🎲');
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  const tileSize = 60;

  const allEmojis = useMemo(() => {
    const isSupported = (emoji) => {
      if (typeof document === 'undefined') return true;
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.canvas.width = ctx.canvas.height = 1;
      ctx.fillText(emoji, -4, 4);
      return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
    };

    const list = [];
    const ranges = [
      [0x1F330, 0x1F37F], // Nature, Plants, Food
      [0x1F380, 0x1F3CF], // Activities
      [0x1F400, 0x1F4D0], // Animals
      [0x1F680, 0x1F6B1], // Transport
      [0x1F940, 0x1F96F], // Food/Nature additions
      [0x1F980, 0x1F9AE], // Animals/Nature additions
      [0x1FA70, 0x1FA86], // Objects
      [0x1FAD0, 0x1FADB]  // Food/Plants
    ];

    ranges.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) {
        const char = String.fromCodePoint(i);
        const isExcluded = 
          (i >= 0x0030 && i <= 0x0039) || 
          (i >= 0x1F550 && i <= 0x1F567) || 
          (i >= 0x1F600 && i <= 0x1F64F) || 
          (i >= 0x1F446 && i <= 0x1F450) || 
          (i >= 0x1F910 && i <= 0x1F93F);

        if (!isExcluded && isSupported(char)) {
          list.push(char);
        }
      }
    });

    return list.length > 0 ? list : ['💎', '🌈', '🔥', '🍄'];
  }, []);

  const digitToEmoji = {
    '0': '🕳️', '1': '📍', '2': '✌️', '3': '🔱', '4': '🍀',
    '5': '⭐', '6': '🐝', '7': '🎰', '8': '🎱', '9': '☁️'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
      
      // Batching the update ensures the digits and the background URL change in the same render
      setTime(now);
      setCurrentEmoji(nextEmoji);
    }, 1000);

    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [allEmojis]);

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
      // "Smooth" refers to the transition between background-image states
      transition: 'background-image 0.4s ease-in-out'
    };
  }, [currentEmoji]);

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
          lineHeight: 1,
          // Added a subtle scale transition to the digits so the clock change feels "smooth" too
          transition: 'all 0.2s ease-in-out'
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