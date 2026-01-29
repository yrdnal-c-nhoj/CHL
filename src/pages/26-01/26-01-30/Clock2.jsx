import { useState, useEffect, useMemo } from 'react';
import backgroundImage from '../../../assets/clocks/26-01-27/pan.jpg';
import gizaFont from '../../../assets/fonts/26-01-27-pan.ttf';

const DATE_STR = '20260107';
const FONT_FAMILY = `Giza_${DATE_STR}`;

const createFontFaceRule = () => `
  @font-face {
    font-family: '${FONT_FAMILY}';
    src: url(${gizaFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const createStyles = () => `
  :root {
    --stretch: 1.8;           /* desktop/laptop default — moderate stretch */
    --pan-duration: 60s;      /* background pan speed — feel free to tweak */
  }

  @media (max-width: 1024px) {
    :root { --stretch: 2.4; }   /* tablets */
  }

  @media (max-width: 768px) {
    :root { --stretch: 3.2; }   /* phones — more stretch = image looks "wider" */
  }

  @media (orientation: portrait) {
    :root { --stretch: 3.8; }   /* portrait phones get even more stretch */
  }

  .pz-bg-layer {
    position: absolute;
    inset: 0;
    background: url(${backgroundImage}) center / calc(100% * var(--stretch)) 100% no-repeat;
    animation: pan  var(--pan-duration) linear infinite;
    will-change: background-position;
  }

  @keyframes pan {
    from { background-position: 0% center; }
    to   { background-position: calc(-100% * (var(--stretch) - 1)) center; }
  }

  .pz-clock-wrapper {
    display: flex;
    width: max-content;
    animation: clockScroll 40s linear infinite;
    will-change: transform;
  }

  .pz-clock-display {
    color: rgba(10, 152, 168, 0.9);
    font-family: '${FONT_FAMILY}', monospace;
    font-size: 10vh;
    padding-right: 5vh;
    text-shadow:
      -1px -1px 0 rgba(235, 236, 240, 0.99),
       1px  1px 0 rgba(247, 247, 245, 0.98);
    user-select: none;
    white-space: nowrap;
  }

  @keyframes clockScroll {
    to { transform: translateX(-50%); }
  }
`;

export default function PanoramaClock() {
  const [fontReady, setFontReady] = useState(false);
  const [time, setTime] = useState('');

  // Inject styles once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = [createFontFaceRule(), createStyles()].join('\n');
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  // Font loading
  useEffect(() => {
    if (!document.fonts) {
      setFontReady(true);
      return;
    }

    let cancelled = false;
    document.fonts
      .load(`1em ${FONT_FAMILY}`)
      .then(() => !cancelled && setFontReady(true))
      .catch((e) => {
        console.warn('Font load failed:', e);
        setFontReady(true);
      });

    return () => { cancelled = true; };
  }, []);

  // Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const str = now
        .toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })
        .replace(/\s/g, '');
      setTime(str);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const clockElement = useMemo(() => {
    if (!time) return null;
    const group = Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="pz-clock-display">{time}</div>
    ));
    return (
      <div className="pz-clock-wrapper">
        {group}
        {group}
      </div>
    );
  }, [time]);

  if (!fontReady || !time) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        background: '#000',
        pointerEvents: 'none',
      }}
    >
      {/* Single stretched + panning background */}
      <div className="pz-bg-layer" />

      {/* Clock strip */}
      <div
        style={{
          position: 'absolute',
          bottom: '5vh',
          left: 0,
          width: '100%',
          zIndex: 10,
        }}
      >
        {clockElement}
      </div>
    </div>
  );
}