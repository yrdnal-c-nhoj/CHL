import React, { useEffect, useRef, useState } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useGlobalStyles } from '@/utils/enhancedFontLoader';
import type { FontConfig } from '@/types/clock';

// Recycled internet font URLs - using common web fonts
const pressStartFontUrl = 'https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2';
const spaceMonoFontUrl = 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Press Start 2P',
    fontUrl: pressStartFontUrl,
    options: {
      weight: 'normal',
      style: 'normal'
    }
  },
  {
    fontFamily: 'Space Mono',
    fontUrl: spaceMonoFontUrl,
    options: {
      weight: 'normal',
      style: 'normal'
    }
  }
];

// Recycled internet ASCII art and patterns
const asciiChars = ['█', '▓', '▒', '░', '█', '▓', '▒', '░'];
const recycledSymbols = ['♻', '◉', '◎', '○', '●', '◐', '◑', '◒'];

const RecycledInternetClock: React.FC = () => {
  const time = useClockTime();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);

  // Inject recycled web styles
  useGlobalStyles(`
    @keyframes recycle-pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    
    @keyframes glitch {
      0%, 100% { text-shadow: 2px 2px 0 #ff00ff, -2px -2px 0 #00ffff; }
      25% { text-shadow: -2px 2px 0 #ffff00, 2px -2px 0 #ff00ff; }
      50% { text-shadow: 2px -2px 0 #00ff00, -2px 2px 0 #ff0000; }
      75% { text-shadow: -2px -2px 0 #0000ff, 2px 2px 0 #ffff00; }
    }
    
    .recycled-text {
      font-family: 'Press Start 2P', monospace;
      animation: glitch 2s infinite;
    }
    
    .recycle-symbol {
      animation: recycle-pulse 3s infinite;
      color: #00ff41;
      text-shadow: 0 0 10px #00ff41;
    }
  `, 'recycled-internet-clock');

  // Load fonts
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw recycled internet background pattern
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        
        ctx.fillStyle = `hsla(${120 + Math.random() * 60}, 100%, 50%, 0.3)`;
        ctx.font = '12px monospace';
        ctx.fillText(char, x, y);
      }

      // Draw recycle symbols
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1);
        const y = canvas.height / 2 + Math.sin((frame + i * 20) * 0.05) * 50;
        const symbol = recycledSymbols[i % recycledSymbols.length];
        
        ctx.fillStyle = `hsla(${120 + i * 30}, 100%, 50%, 0.8)`;
        ctx.font = '24px monospace';
        ctx.fillText(symbol, x, y);
      }

      // Draw time in recycled style
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      ctx.fillStyle = '#00ff41';
      ctx.font = 'bold 48px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 20;
      ctx.fillText(timeString, canvas.width / 2, canvas.height / 2);

      // Draw recycled internet quote
      const quotes = [
        "RECYCLED INTERNET",
        "DIGITAL ARCHEOLOGY",
        "WEB ARTIFACTS",
        "CYBER REBIRTH"
      ];
      const quote = quotes[Math.floor((frame / 100) % quotes.length)];
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px "Space Mono", monospace';
      ctx.fillText(quote, canvas.width / 2, canvas.height / 2 + 60);

      setFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [time, frame]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#00ff41',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        opacity: 0.7
      }}>
        <span className="recycle-symbol">♻</span> RECYCLED INTERNET CLOCK
      </div>
    </div>
  );
};

export default RecycledInternetClock;
