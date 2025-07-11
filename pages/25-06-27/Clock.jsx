import { useEffect, useRef } from 'react';
import morseFont from './morse.ttf';

const App = () => {
  const svgRef = useRef(null);

  const colors = [
    "#c0c6c7", "#99a3a3", "#B7410E", "#66615C", "#c0c6c7", "#99a3a3",
    "#B7410E", "#66615C", "#c0c6c7", "#99a3a3", "#999999", "#b0b0b0",
    "#a0522d", "#666666", "#333333", "#777777", "#444444", "#999999",
    "#888888", "#aaaaaa", "#bbbbbb", "#66615C", "#c0c6c7", "#99a3a3", "#B7410E"
  ];

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const totalLines = 70;
  const width = 1200; // Base width for viewport reference
  const height = 1200; // Base height for viewport reference
  const extendedWidth = 3600; // Overshoot on right
  const extendedHeight = 1800; // Overshoot vertically

  const denseY = (index, total) => {
    const t = index / (total - 1);
    return extendedHeight * (t * t * t); // Spread lines across full height
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = ''; // Clear previous paths to avoid duplication

    for (let i = 0; i < totalLines; i++) {
      const startY = denseY(i, totalLines) + randomInt(-0.7, 0.7);
      const controlX = width / 2; // Center control point for sag
      // Significantly increased sag with more variation
      const controlY = startY + randomInt(50, 120); // Increased range for deeper and varied sag
      const endY = startY + randomInt(-1.2, 1.2);

      // Start left of viewport, extend far beyond right edge
      const startX = -100; // Start slightly left of viewport
      const endX = extendedWidth; // Extend well beyond right edge

      const d = `M${startX} ${startY} Q${controlX} ${controlY} ${endX} ${endY}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", colors[i % colors.length]);
      path.setAttribute("stroke-width", 1.8 + (i % 3) * 0.9); // Maintain thick lines
      path.setAttribute("fill", "none");

      svg.appendChild(path);
    }
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      document.getElementById('hour1').textContent = hours[0];
      document.getElementById('hour2').textContent = hours[1];
      document.getElementById('minute1').textContent = minutes[0];
      document.getElementById('minute2').textContent = minutes[1];
      document.getElementById('second1').textContent = seconds[0];
      document.getElementById('second2').textContent = seconds[1];
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const styles = {
    body: {
      margin: 0,
      height: '100vh',
      background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
      position: 'relative',
      overflow: 'visible', // Allow SVG to extend beyond viewport
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"morse", Arial, sans-serif',
    },
    backgroundSvg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '150vw', // Ensure SVG covers beyond viewport
      height: '100vh',
      zIndex: 1,
    },
    clock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 4,
    },
    digitBox: {
      width: '110vw',
      height: '2.3rem',
      margin: '0.9rem 0',
      backgroundColor: '#b87333',
      color: '#b90404',
      textShadow: `
        0 -0.2rem 0 rgb(250, 247, 247),
        -0.2rem 0 0 rgb(247, 242, 242),
        0.2rem 0 0 rgba(0, 0, 0, 1),
        0 0.2rem 0 rgba(0, 0, 0, 1),
        0 -0.1rem 0 rgb(248, 241, 241),
        -0.1rem 0 0 rgba(0, 0, 0, 1),
        0.1rem 0 0 rgba(0, 0, 0, 1),
        0 0.1rem 0 rgba(0, 0, 0, 1)
      `,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '3rem',
      borderRadius: '7.5rem',
      zIndex: 4,
    },
  };

  return (
    <div style={styles.body}>
      <style>
        {`
          @font-face {
            font-family: 'morse';
            src: url(${morseFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <svg
        style={styles.backgroundSvg}
        viewBox={`-100 0 ${extendedWidth + 100} ${extendedHeight}`} // Adjusted viewBox for overshoot
        preserveAspectRatio="none"
        ref={svgRef}
      />
      <div style={styles.clock}>
        <div style={styles.digitBox} id="hour1">0</div>
        <div style={styles.digitBox} id="hour2">0</div>
        <div style={styles.digitBox} id="minute1">0</div>
        <div style={styles.digitBox} id="minute2">0</div>
        <div style={styles.digitBox} id="second1">0</div>
        <div style={styles.digitBox} id="second2">0</div>
      </div>
    </div>
  );
};

export default App;