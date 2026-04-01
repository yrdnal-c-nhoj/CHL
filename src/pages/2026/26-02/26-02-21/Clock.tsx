import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import { useSecondClock } from '../../../../utils/useSmoothClock';

const CONFIG = {
  UPDATE_INTERVAL: 1000,
  MAX_DYNAMIC_IMAGES: 10,
  COLLAGE_COUNT: 40,
  FONT_FAMILY: 'ClockCustom',
};

import img1 from '../../../../assets/images/2026/26-02/26-02-21/123.webp';
import img2 from '../../../../assets/images/2026/26-02/26-02-21/1231.gif';
import img3 from '../../../../assets/images/2026/26-02/26-02-21/1232.webp';
import img4 from '../../../../assets/images/2026/26-02/26-02-21/1233.webp';
import img5 from '../../../../assets/images/2026/26-02/26-02-21/1234.webp';
import img6 from '../../../../assets/images/2026/26-02/26-02-21/1235.webp';
import img7 from '../../../../assets/images/2026/26-02/26-02-21/1236.gif';
import img8 from '../../../../assets/images/2026/26-02/26-02-21/1237.webp';
import customFont from '../../../../assets/fonts/26-02-21-321.otf?url';

export { img1, img2, img3, img4, img5, img6, img7, img8 };

const ASSETS = [img1, img2, img3, img4, img5, img6, img7, img8];

const getRandomImage = () => ASSETS[Math.floor(Math.random() * ASSETS.length)];

const generateImageStyle = (isDynamic = false): React.CSSProperties => ({
  position: 'absolute',
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  transform: `translate(-50%, -50%)`,
  width: `${Math.random() * 300 + 100}px`,
  height: 'auto',
  maxWidth: '40vw',
  objectFit: 'cover',
  opacity: isDynamic ? 0.8 : 0.6 + Math.random() * 0.2,
  zIndex: isDynamic
    ? Math.floor(Math.random() * 10) + 50
    : Math.floor(Math.random() * 10),
  filter: `hue-rotate(${Math.random() * 360}deg) brightness(${0.8 + Math.random() * 0.4})`,
  pointerEvents: 'none',
  transition: 'all 0.5s ease-out',
});

interface StaticCollageProps {
  count: number;
}

interface DynamicImages {
  id: string;
  src: string;
  style?: React.CSSProperties;
}

export const fontConfigs = [
  {
    fontFamily: CONFIG.FONT_FAMILY,
    fontUrl: customFont,
    options: {
      weight: 'normal',
      style: 'normal'
    }
  }
];

const StaticCollage = memo<StaticCollageProps>(({ count }) => {
  const collage = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `static-${i}`,
        src: getRandomImage(),
        style: generateImageStyle(false),
      })),
    [count],
  );

  return (
    <>
      {collage.map((img) => (
        <img
          key={img.id}
          src={img.src}
          style={img.style}
          alt=""
          aria-hidden="true"
        />
      ))}
    </>
  );
});

export default function RefactoredClock() {
  const time = useSecondClock();
  const [dynamicImages, setDynamicImages] = useState<DynamicImages[]>([]);
  const [showContent, setShowContent] = useState(false);
  
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setShowContent(true);
  }, []);

  useEffect(() => {
    if (time.getSeconds() % 1 === 0) {
      const newImg = `https://picsum.photos/seed/${Math.random()}/100/100.jpg`;
      setDynamicImages((prev) => [
        ...prev.slice(-(CONFIG.MAX_DYNAMIC_IMAGES - 1)),
        { id: Date.now().toString(), src: newImg, style: generateImageStyle(true) }
      ]);
    }
  }, [time]);

  const timeStrings = useMemo(() => {
    const hours24 = time.getHours();
    const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
    const h = hours12.toString(); // No leading zeros
    const m = time.getMinutes().toString().padStart(2, '0'); // Keep leading zeros for minutes
    return { h, m, raw: time };
  }, [time]);

  const rootStyle = {
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    color: '#fff',
    fontFamily: `'${CONFIG.FONT_FAMILY}', sans-serif`,
  };

  const digitGroupStyle: React.CSSProperties = {
    fontSize: 'clamp(5rem, 25vw, 15rem)',
    display: 'flex',
    gap: '0.2em',
    zIndex: 100,
    position: 'relative',
    mixBlendMode: 'difference', // Makes text readable over any background color
    opacity: 0.8,
  };

  return (
    <div
      style={rootStyle}
      className="clock-26-02-21"
      aria-label={`Current time: ${timeStrings.h}:${timeStrings.m}`}
    >
      {/* Global Style Injection for Font Face */}
      <style>{`
        .clock-26-02-21 img { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: inherit; } }
      `}</style>

      <StaticCollage count={CONFIG.COLLAGE_COUNT} />

      {dynamicImages.map((img, index) => (
        <img key={`dynamic-${index}-${img.id}`} src={img.src} style={img.style} alt="" />
      ))}

      <div style={digitGroupStyle} aria-hidden="true">
        <span>{timeStrings.h}</span>
        <span>{timeStrings.m}</span>
      </div>
    </div>
  );
}
