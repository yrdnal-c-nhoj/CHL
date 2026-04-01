/** @jsxImportSource react */
import React, { useEffect, useMemo, useRef, useState } from 'react';

/* =========================
   CONFIG
========================= */

const DIGIT_COUNT = 6;
const UPDATE_INTERVAL = 1000;

/* =========================
   STATIC GLOBS (REQUIRED BY VITE)
========================= */

const digitGlobs = {
  0: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/0/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  1: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/1/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  2: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/2/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  3: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/3/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  4: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/4/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  5: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/5/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  6: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/6/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  7: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/7/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  8: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/8/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),

  9: import.meta.glob(
    '../../../../assets/images/2026/26-01/26-01-04/digits/9/*.{png,jpg,jpeg,gif,webp}',
    { eager: true, as: 'url' },
  ),
};

/* =========================
   LOAD FOLDERS
========================= */

function loadDigitFolders() {
  const folders = {};

  for (let d = 0; d <= 9; d++) {
    const urls = Object.values(digitGlobs[d] || {}).filter(Boolean);

    folders[d] = urls.length ? urls : [''];
  }

  return folders;
}

/* =========================
   TIME
========================= */

function get24HourDigits(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');

  return (h + m + s).split('').map(Number);
}

/* =========================
   IMAGE SELECTOR ENGINE
========================= */

function createSelector(folders) {
  const lastUsed = {};

  return (digits, tick) => {
    const usedThisFrame = {};
    const result = new Array(DIGIT_COUNT);

    for (let pos = 0; pos < DIGIT_COUNT; pos++) {
      const digit = digits[pos];
      const images = folders[digit];
      const key = `${digit}-${pos}`;

      if (images.length === 1) {
        result[pos] = images[0];
        continue;
      }

      const lastIdx = lastUsed[key] ?? -1;
      const used = usedThisFrame[digit] ?? [];

      let selected = -1;

      for (let i = 0; i < images.length; i++) {
        const idx = (tick + i) % images.length;

        if (idx !== lastIdx && !used.includes(idx)) {
          selected = idx;
          break;
        }
      }

      if (selected === -1) selected = (lastIdx + 1) % images.length;

      lastUsed[key] = selected;
      usedThisFrame[digit] = [...used, selected];

      result[pos] = images[selected];
    }

    return result;
  };
}

/* =========================
   HOOK
========================= */

function useDigitClockImages(folders) {
  const selectorRef = useRef(null);
  const lastSecondRef = useRef(-1);

  const [urls, setUrls] = useState(() => Array(DIGIT_COUNT).fill(''));
  const [ready, setReady] = useState<boolean>(false);

  if (!selectorRef.current) selectorRef.current = createSelector(folders);

  useEffect(() => {
    function update() {
      const now = new Date();
      const sec = now.getSeconds();

      if (sec === lastSecondRef.current) return;

      lastSecondRef.current = sec;

      const digits = get24HourDigits(now);
      const newUrls = selectorRef.current(digits, sec);

      setUrls(newUrls);

      if (!ready && newUrls.some(Boolean)) setReady(true);
    }

    update();

    const interval = setInterval(update, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [folders, ready]);

  return { urls, ready };
}

/* =========================
   COMPONENT
========================= */

export default function DigitClock() {
  const folders = useMemo(loadDigitFolders, []);
  const { urls, ready } = useDigitClockImages(folders);

  if (!ready) return <div style={styles.loading}>LOADING...</div>;

  return (
    <div style={styles.container}>
      <style>{css}</style>

      <div className="clock">
        <DigitPair urls={urls.slice(0, 2)} />
        <Colon />

        <DigitPair urls={urls.slice(2, 4)} />
        <Colon />

        <DigitPair urls={urls.slice(4, 6)} />
      </div>
    </div>
  );
}

/* =========================
   SUBCOMPONENTS
========================= */

function DigitPair({ urls }) {
  return (
    <div className="pair">
      {urls.map((url, i) => (
        <img key={i} src={url} className="digit" alt="" />
      ))}
    </div>
  );
}

function Colon() {
  return <div className="colon">:</div>;
}

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle, #233343, #000)',
  },

  loading: {
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#000',
    color: '#fff',
  },
};

const css = `

.clock {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.pair {
  display: flex;
  gap: 0.5rem;
}

.digit {
  width: 18vh;
  height: 26vh;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #333;
  background: #111;
}

.colon {
  font-size: 10vh;
  color: #666;
}

@media (max-width:768px){

.clock{
flex-direction:column;
}

.digit{
width:25vw;
height:35vw;
}

.colon{
display:none;
}

}

`;
