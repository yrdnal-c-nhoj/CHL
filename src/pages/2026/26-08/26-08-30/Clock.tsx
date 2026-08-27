import { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;
const NUM_NODES = 19;
const SINGLE_SLICE = TWO_PI / NUM_NODES;
const BASE_RADIUS = 20;
const BOUNCE_RADIUS = 150;
const GRID_STEP = 100;

export default function SeaWavesTextClock() {
  const canvasRef = useRef(null);
  const timeStateRef = useRef({ hours: '12', minutes: '00', ampm: 'AM' });

  // Clock state synchronization (1s interval without triggering React re-renders)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let rawHours = now.getHours();
      const rawMinutes = now.getMinutes();

      const ampm = rawHours >= 12 ? 'PM' : 'AM';
      rawHours = rawHours % 12 || 12;

      timeStateRef.current = {
        hours: String(rawHours).padStart(2, '0'),
        minutes: String(rawMinutes).padStart(2, '0'),
        ampm,
      };
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    let animationFrameId;
    let containers = [];

    // Re-build container grid data structures
    const initGrid = (width, height) => {
      containers = [];
      let containerIdx = 0;

      for (let x = 0; x < width + GRID_STEP; x += GRID_STEP) {
        for (let y = 0; y < height + GRID_STEP; y += GRID_STEP) {
          const category = containerIdx % 3 === 0 ? 'hours' : containerIdx % 3 === 1 ? 'minutes' : 'ampm';
          
          // Generate node structure for this container cell
          const nodes = Array.from({ length: NUM_NODES }, (_, i) => {
            const angleCircle = i * SINGLE_SLICE;
            return {
              baseX: x,
              baseY: y + Math.random(),
              angleCircle,
              cosAngleCircle: Math.cos(angleCircle),
              sinAngleCircle: Math.sin(angleCircle),
              angle: x + y,
              speed: 0.01,
            };
          });

          containers.push({ category, nodes });
          containerIdx++;
        }
      }
    };

    const handleResize = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);
      initGrid(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Optimized Animation Loop
    const loop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const timeState = timeStateRef.current;

      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (let c = 0; c < containers.length; c++) {
        const container = containers[c];
        const textToRender = timeState[container.category];
        const nodes = container.nodes;

        for (let n = 0; n < nodes.length; n++) {
          const node = nodes[n];

          // Update motion dynamics
          const bounceOffset = Math.sin(node.angle + node.angleCircle) * BOUNCE_RADIUS + BASE_RADIUS;
          const posX = node.baseX + node.cosAngleCircle * bounceOffset;
          const posY = node.baseY + node.sinAngleCircle * bounceOffset;
          const size = Math.cos(node.angle) * 8 + 10;

          node.angle += node.speed;

          // Render Text Node
          context.fillStyle = `hsl(195, 100%, ${size * 4}%)`;
          context.font = `bold ${Math.max(12, size * 2.2)}px sans-serif`;
          context.fillText(textToRender, posX, posY);
        }
      }

      animationFrameId = window.requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: 'hsl(195, 100%, 7%)',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          filter: "url('#shadowed-goo')",
        }}
      />

      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadowed-goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="6" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feGaussianBlur in="goo" stdDeviation="2" result="shadow" />
            <feColorMatrix
              in="shadow"
              mode="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
              result="shadow"
            />
            <feOffset in="shadow" dx="1" dy="1" result="shadow" />
            <feBlend in2="shadow" in="goo" result="goo" />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}