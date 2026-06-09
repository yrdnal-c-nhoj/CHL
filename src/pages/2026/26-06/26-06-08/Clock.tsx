import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Using the PHP embed endpoint which is more resilient to Referrer Policy restrictions
const JESOLO_IFRAME_URL = 'https://www.skylinewebcams.com/webcam-embed.php?source=832';
const JESOLO_FALLBACK_IMG_URL = 'https://embed.skylinewebcams.com/img/832.jpg';

// Export assets so the global loader waits for the fallback image to be ready
export const assets = [JESOLO_FALLBACK_IMG_URL];

const Clock: React.FC = () => {
  const time = useSecondClock();
  const isoTime = useMemo(() => time.toISOString(), [time]);
  const timeStr = time.toLocaleTimeString('en-GB', { hour12: false });

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    backgroundColor: '#000'
  };

  const baseBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
  };

  const iframeSpecificStyle: React.CSSProperties = {
    ...baseBackgroundStyle,
    border: 'none',
    zIndex: 1,
    // The iframe itself should not have a background, it should show the stream.
  };

  const fallbackImgStyle: React.CSSProperties = {
    ...baseBackgroundStyle,
    zIndex: 0, // Sits at the bottom of the stack
    objectFit: 'cover', // Ensure the image covers the entire background
    pointerEvents: 'none', // Prevent interaction with the image
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay for better contrast
    zIndex: 2,
  };

  const timeStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3,
    color: '#ffffff',
    fontSize: 'clamp(3rem, 20vw, 16rem)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontWeight: 900,
    fontVariantNumeric: 'tabular-nums',
    textShadow: '0 0 40px rgba(0,0,0,0.8)',
    userSelect: 'none',
  };

  return (
    <main style={containerStyle}>
      <img
        src={JESOLO_FALLBACK_IMG_URL}
        alt="Jesolo Beach fallback"
        style={fallbackImgStyle}
      />
      <iframe
        src={JESOLO_IFRAME_URL}
        title="Jesolo Beach Webcam"
        style={iframeSpecificStyle}
        allow="autoplay; fullscreen; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div style={overlayStyle} /> 
      <time dateTime={isoTime} style={timeStyle}>
        {timeStr}
      </time>
    </main>
  );
};

export default Clock;