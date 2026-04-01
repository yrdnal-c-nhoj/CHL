import React, { useState, useEffect } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';

const fontVersion = '2026-03-11';
const FONT_NAME = `XanhMono_${fontVersion}`;

const BorrowedTimeClock: React.FC = () => {
  const time = useSecondClock();
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/800/600?sig=${Date.now()}`);
  const [imgOpacity, setImgOpacity] = useState<number>(1);
  const [isPendingNewImage, setIsPendingNewImage] = useState(false);

  useEffect(() => {
    const now = time;
    setImgOpacity(0);
    setIsPendingNewImage(true);

    setTimeout(() => {
      setImageUrl(`https://picsum.photos/800/600?sig=${now.getTime()}`);
    }, 300);
  }, [time.getSeconds()]);

  const handleImageLoad = () => {
    if (isPendingNewImage) {
      setImgOpacity(1);
      setIsPendingNewImage(false);
    }
  };

  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/:/g, ' ');
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    gap: '2vmin',
  };

  const frameStyle: React.CSSProperties = {
    width: 'min(75vmin, 75%)',
    height: 'min(56.25vmin, 37.5vh)',
    maxWidth: '500px',
    maxHeight: '375px',
    border: '1px solid #F2F7F1', 
    backgroundColor: '#111', // Subtle dark fill while empty
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.4s ease-in-out',
    opacity: imgOpacity,
  };

  const clockStyle: React.CSSProperties = {
    fontFamily: `"${FONT_NAME}", "Xanh Mono", monospace`,
    fontSize: 'min(15vmin, 16vw)',
    color: '#F7E3E4',
    letterSpacing: '0.05em',
    fontWeight: '400',
    lineHeight: '1',
    textShadow: '0 0 15px rgba(255,0,15,0.4)',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Xanh+Mono:ital@0;1&display=swap');
          body { margin:0; background:#000; }`}
      </style>

      <div style={containerStyle}>
        <div style={frameStyle}>
          <img 
            src={imageUrl} 
            alt="Borrowed Time" 
            style={imageStyle} 
            onLoad={handleImageLoad}
          />
        </div>

        <div style={clockStyle}>{formatTime(time)}</div>
      </div>
    </>
  );
};

export default BorrowedTimeClock;