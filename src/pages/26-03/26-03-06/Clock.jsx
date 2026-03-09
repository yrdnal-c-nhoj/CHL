import React, { useEffect, useRef } from 'react';
// ... imports stay the same

const RocketGrid = () => {
  // Refs for the clock hands to avoid state-driven re-renders
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  const requestRef = useRef();

  const animate = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    const secondsWithMs = (s + ms / 1000) * 6;
    const minutesWithSeconds = (m + s / 60) * 6;
    const hoursWithMinutes = ((h % 12) + m / 60) * 30;

    // Direct DOM updates are much faster for 60fps animations
    if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${secondsWithMs}deg)`;
    if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${minutesWithSeconds}deg)`;
    if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${hoursWithMinutes}deg)`;

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Memoize the grid so it never re-renders after the first paint
  const grid = React.useMemo(() => {
    const rows = 22;
    const cols = 15;
    return Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} style={rowStyle}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={`cell-${rowIndex}-${colIndex}`} style={cellStyle}>
            <img
              src={rocketBg}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: rowIndex % 2 === 0 ? 'rotate(90deg)' : 'rotate(270deg)',
              }}
            />
          </div>
        ))}
      </div>
    ));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridWrapperStyle}>{grid}</div>

      <div style={clockWrapperStyle}>
        <img ref={hourRef} src={hourHandImg} alt="Hour" style={{ ...handStyle, height: '110px' }} />
        <img ref={minuteRef} src={minuteHandImg} alt="Minute" style={{ ...handStyle, height: '160px' }} />
        <img ref={secondRef} src={secondHandImg} alt="Second" style={{ ...handStyle, height: '190px' }} />
      </div>
    </div>
  );
};