import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

// Lissajous curve parameters
const PARAMS = {
  a: 3,
  b: 2,
  delta: 3,
  animationLength: 16,
};

const generateLissajousPath = (width: number, height: number): string => {
  const { a, b, delta } = PARAMS;
  const numPoints = 256;

  const padX = width * 0.08;
  const padY = height * 0.08;
  const scaleX = width / 2 - padX;
  const scaleY = height / 2 - padY;
  const cx = width / 2;
  const cy = height / 2;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    pts.push({
      x: cx + scaleX * Math.sin(a * t + delta),
      y: cy + scaleY * Math.sin(b * t),
    });
  }

  if (pts.length === 0) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const pt = pts[i]!;
    d += ` L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
  }
  return d;
};

interface CharBox {
  char: string;
  width: number;
  index: number;
}

const Clock: React.FC = () => {
  const time = useClockTime();
  const containerRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string>('');
  const [charBoxes, setCharBoxes] = useState<CharBox[]>([]);

  const timeString = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return `${h}:${m}:${s}`;
  }, [time]);

  // Generate text with repeated time string
  const displayText = useMemo(() => {
    return (timeString + ' ').repeat(3);
  }, [timeString]);

  // Measure character widths and generate boxes
  useEffect(() => {
    const measureChars = () => {
      const ruler = document.createElement('span');
      ruler.style.cssText = [
        'position:absolute',
        'visibility:hidden',
        'white-space:nowrap',
        'font-family:"Inter",sans-serif',
        'font-size:clamp(30px,12vw,130px)',
        "font-weight:800",
      ].join(';');
      document.body.appendChild(ruler);

      const widthCache = new Map<string, number>();
      const measureChar = (char: string): number => {
        if (widthCache.has(char)) return widthCache.get(char)!;
        ruler.textContent = char;
        const w = ruler.getBoundingClientRect().width;
        widthCache.set(char, w);
        return w;
      };

      const boxes: CharBox[] = [...displayText].map((char, index) => {
        const displayChar = char === ' ' ? '\u00A0' : char;
        return {
          char: displayChar,
          width: measureChar(displayChar),
          index,
        };
      });

      document.body.removeChild(ruler);
      setCharBoxes(boxes);
    };

    measureChars();
  }, [displayText]);

  // Update Lissajous path on resize
  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const newPath = generateLissajousPath(clientWidth, clientHeight);
      setPath(newPath);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, []);

  const siblingCount = charBoxes.length;

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles.border}
        aria-label={timeString}
        style={
          {
            '--path': `"${path}"`,
            '--animation-length': `${PARAMS.animationLength}s`,
            '--sibling-count': siblingCount,
          } as React.CSSProperties
        }
      >
        {charBoxes.map((box) => (
          <span
            key={box.index}
            className={styles.box}
            aria-hidden="true"
            style={
              {
                '--sibling-index': box.index + 1,
                width: `${box.width}px`,
              } as React.CSSProperties
            }
          >
            {box.char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Clock;
