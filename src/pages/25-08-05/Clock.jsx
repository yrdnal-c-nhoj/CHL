// src/RectangularAnalogClock.tsx
import { useState, useEffect } from 'react';
import myFontUrl from './rope.ttf'; // Import font as URL

const RectangularAnalogClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [viewBoxMargin, setViewBoxMargin] = useState<number>(5); // Initial fallback margin

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Update margin on resize for responsive positioning
    const updateMargin = () => {
      const pixelMargin = 15; // ~15px margin from edges
      const margin = window.innerWidth ? (pixelMargin / window.innerWidth) * 100 : 5;
      setViewBoxMargin(margin);
    };
    updateMargin();
    window.addEventListener('resize', updateMargin);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateMargin);
    };
  }, []);

  // Inject @font-face dynamically using the imported font URL
  const fontFaceStyle = `
    @font-face {
      font-family: 'RopeFont';
      src: url(${myFontUrl}) format('truetype');
      font-weight: 400;
      font-style: normal;
    }
  `;

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate hand positions (0-360 degrees)
  const hourAngle = hours * 30 + minutes * 0.5 - 90; // -90 to start at 12 o'clock
  const minuteAngle = minutes * 6 - 90;
  const secondAngle = seconds * 6 - 90;

  // Generate hour numbers with responsive positioning
  const generateHourMarkers = () => {
    const positions = [
      { num: 12, x: 50, y: viewBoxMargin }, // Top center
      { num: 1, x: 100 - viewBoxMargin * 1.5, y: viewBoxMargin * 1.2 }, // Top right
      { num: 2, x: 100 - viewBoxMargin, y: viewBoxMargin * 2.5 }, // Right upper
      { num: 3, x: 100 - viewBoxMargin, y: 50 }, // Right center
      { num: 4, x: 100 - viewBoxMargin, y: 100 - viewBoxMargin * 2.5 }, // Right lower
      { num: 5, x: 100 - viewBoxMargin * 1.5, y: 100 - viewBoxMargin * 1.2 }, // Bottom right
      { num: 6, x: 50, y: 100 - viewBoxMargin }, // Bottom center
      { num: 7, x: viewBoxMargin * 1.5, y: 100 - viewBoxMargin * 1.2 }, // Bottom left
      { num: 8, x: viewBoxMargin, y: 100 - viewBoxMargin * 2.5 }, // Left lower
      { num: 9, x: viewBoxMargin, y: 50 }, // Left center
      { num: 10, x: viewBoxMargin, y: viewBoxMargin * 2.5 }, // Left upper
      { num: 11, x: viewBoxMargin * 1.5, y: viewBoxMargin * 1.2 }, // Top left
    ];

    return positions.map((pos) => (
      <text
        key={pos.num}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-bold fill-gray-800 custom-font"
        style={{ fontSize: 'clamp(0.8vw, 1.5vw, 2vw)' }} // Responsive font size
      >
        {pos.num}
      </text>
    ));
  };

  // Generate tick marks in square pattern
  const generateTicks = () => {
    const ticks: JSX.Element[] = [];

    // Top edge ticks
    for (let i = 0; i < 15; i++) {
      const x = 10 + (i * 80) / 14;
      const isHourTick = i === 0 || i === 7 || i === 14;
      ticks.push(
        <line
          key={`top-${i}`}
          x1={x}
          y1="5"
          x2={x}
          y2={isHourTick ? '12' : '8'}
          stroke="#374151"
          strokeWidth={isHourTick ? 2 : 1}
          className="opacity-80"
        />
      );
    }

    // Right edge ticks
    for (let i = 1; i < 15; i++) {
      const y = 5 + (i * 90) / 14;
      const isHourTick = i === 7;
      ticks.push(
        <line
          key={`right-${i}`}
          x1="95"
          y1={y}
          x2={isHourTick ? '88' : '92'}
          y2={y}
          stroke="#374151"
          strokeWidth={isHourTick ? 2 : 1}
          className="opacity-80"
        />
      );
    }

    // Bottom edge ticks
    for (let i = 1; i < 15; i++) {
      const x = 90 - (i * 80) / 14;
      const isHourTick = i === 7;
      ticks.push(
        <line
          key={`bottom-${i}`}
          x1={x}
          y1="95"
          x2={x}
          y2={isHourTick ? '88' : '92'}
          stroke="#374151"
          strokeWidth={isHourTick ? 2 : 1}
          className="opacity-80"
        />
      );
    }

    // Left edge ticks
    for (let i = 1; i < 14; i++) {
      const y = 95 - (i * 90) / 14;
      const isHourTick = i === 7;
      ticks.push(
        <line
          key={`left-${i}`}
          x1="5"
          y1={y}
          x2={isHourTick ? '12' : '8'}
          y2={y}
          stroke="#374151"
          strokeWidth={isHourTick ? 2 : 1}
          className="opacity-80"
        />
      );
    }

    return ticks;
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Inject @font-face for the imported font */}
      <style>{fontFaceStyle}</style>
      <svg
        width="100vw"
        height="100vh"
        viewBox="0 0 100 100"
        className="bg-gradient-to-br from-gray-50 to-white"
        preserveAspectRatio="xMidYMid meet" // Better scaling
      >
        {/* Clock face background */}
        <rect width="100" height="100" fill="url(#clockGradient)" />

        {/* Gradient definition */}
        <defs>
          <radialGradient id="clockGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </radialGradient>
        </defs>

        {/* Tick marks */}
        {generateTicks()}

        {/* Hour numbers */}
        {generateHourMarkers()}

        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + Math.cos((hourAngle * Math.PI) / 180) * 18}
          y2={50 + Math.sin((hourAngle * Math.PI) / 180) * 18}
          stroke="#1f2937"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + Math.cos((minuteAngle * Math.PI) / 180) * 25}
          y2={50 + Math.sin((minuteAngle * Math.PI) / 180) * 25}
          stroke="#374151"
          strokeWidth="1"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Second hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + Math.cos((secondAngle * Math.PI) / 180) * 28}
          y2={50 + Math.sin((secondAngle * Math.PI) / 180) * 28}
          stroke="#dc2626"
          strokeWidth="0.3"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Center dot */}
        <circle cx="50" cy="50" r="1.5" fill="#1f2937" className="drop-shadow-sm" />
      </svg>

      {/* Digital time display - fixed position overlay */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
        <div className="text-white text-xs md:text-sm lg:text-base custom-font">
          {time.toLocaleTimeString('en-US', { hour12: true })}
        </div>
      </div>
    </div>
  );
};

export default RectangularAnalogClock;