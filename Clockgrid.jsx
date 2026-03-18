import React, { useEffect, useState, useMemo } from 'react';
import bgImage from './esp.jpeg';
import fontUrl from './gr.ttf';

const Clockgrid = () => {
  // 1. Time State and Logic
  const [time, setTime] = useState({ hours: '', minutes: '', seconds: '', millis: '', ampm: '' });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const millis = Math.floor(now.getMilliseconds() / 10);

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      setTime({
        hours: String(hours),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        millis: String(millis).padStart(2, '0'),
        ampm,
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 10);
    return () => clearInterval(interval);
  }, []);

  // UPDATED: Clock content now removes colons and dots, using only spaces
  const clockContent = useMemo(() => (
    // Format: HH MM SS ms AM/PM (Note the spaces between units)
    `${time.hours} ${time.minutes} ${time.seconds} ${time.millis} ${time.ampm}`.toUpperCase()
  ), [time]);

  // 2. Dynamic Grid Calculation and Font Setup
  // Define a fixed size for each clock cell in vh units
  const CLOCK_WIDTH_VH = 22; 
  const CLOCK_HEIGHT_VH = 4;
  
  // Calculate the number of columns and rows that perfectly fit the viewport
  const columns = Math.ceil(100 / CLOCK_WIDTH_VH);
  const rows = Math.ceil(100 / CLOCK_HEIGHT_VH);
  const totalClocks = columns * rows;

  // Use the calculated perfect cell size (in percentages of the viewport)
  const perfectCellWidthPercent = 100 / columns;
  const perfectCellHeightPercent = 100 / rows;

  const fontFace = `
    @font-face {
      font-family: 'mult';
      src: url(${fontUrl}) format('opentype');
    }
  `;

  // 3. Styles with Calculated Grid Templates
  const styles = {
    container: {
      margin: 0,
      padding: 0,
      height: '100dvh',
      width: '100vw',
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, ${perfectCellWidthPercent}%)`,
      gridTemplateRows: `repeat(${rows}, ${perfectCellHeightPercent}%)`,
      position: 'relative',
      fontFamily: 'mult, monospace',
      overflow: 'hidden',
      gap: '0', 
    },
    // Style for each individual clock
    clock: {
      color: 'rgb(137, 3, 3)',
      fontSize: '3.5vh',
      // letterSpacing ensures all characters (including the new spaces) are regularly spaced
      letterSpacing: '0.1em', // Slightly increased spacing for visual separation without punctuation
      textTransform: 'uppercase',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    bgImage: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'brightness(3.75) contrast(0.3)',
      zIndex: 1,
      pointerEvents: 'none',
    },
  };

  // 4. Render Clocks
  const clocks = Array.from({ length: totalClocks }, (_, index) => (
    <div key={index} style={styles.clock}>{clockContent}</div>
  ));

  // 5. Component Return
  return (
    <div style={styles.container}>
      <style>{fontFace}</style>
      <div style={styles.bgImage}></div>
      {clocks}
    </div>
  );
};

export default Clockgrid;