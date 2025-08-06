import { useState, useEffect } from 'react';
import myFontWoff2 from './hea.ttf';
import bg1 from './la.gif';
import bg2 from './em.webp';
import bg3 from './la.gif'; // copy of bg1 for flipping

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const bgFilter = 'brightness(1.5) contrast(3.2)';

  const fullScreenBackgroundStyle = (image, opacity, zIndex, custom = {}) => ({
    position: 'fixed',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity,
    zIndex,
    pointerEvents: 'none',
    filter: bgFilter,
    ...custom,
  });

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 10,
    fontFamily: 'MyCustomFont, monospace',
    fontSize: '0.5rem',
    color: '#2C2D2D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <>
      {/* Full-Screen Background Layer for bg2, stretched with distortion */}
      <div
        style={fullScreenBackgroundStyle(bg2, 1, 2, {
          backgroundSize: '100% 100%',
        })}
      />
{/* Centered Scaled Background for bg1 */}
<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90vw',
    height: '90vh',
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transform: 'translate(-50%, -50%)',
    filter: bgFilter, // optional
    zIndex: 0,
    pointerEvents: 'none',
  }}
/>

{/* Flipped and Centered Scaled Background for bg3 */}
<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90vw',
    height: '90vh',
    backgroundImage: `url(${bg3})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transform: 'translate(-50%, -50%) scaleX(-1) scaleY(-1)',
    filter: bgFilter,
    zIndex: 0,
    pointerEvents: 'none',
  }}
/>


      {/* Clock Display */}
      <div style={clockContainerStyle}>{formatTime(time)}</div>

      {/* Font Face */}
      <style>
        {`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${myFontWoff2}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
    </>
  );
};

export default DigitalClock;
