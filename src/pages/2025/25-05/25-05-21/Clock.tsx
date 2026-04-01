import { useEffect, useState } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import background from '../../../../assets/images/2025/25-05/25-05-21/signals.jpg';
import semFont from '../../../../assets/fonts/25-05-21-sem.ttf';

const Clock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'sem',
      fontUrl: semFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [time, setTime] = useState(new Date());
  const isMobile = window.innerWidth < 768;

  // Font loading handled by useMultipleFontLoader

  useEffect(() => {
    // Font loading handled by useMultipleFontLoader
    // Ensure the font is loaded and apply class when ready
    if (document && document.fonts) {
      document.fonts
        .load('1rem sem')
        .then(() => {
          document.documentElement.classList.add('fonts-loaded-sem');
        })
        .catch(() => {
          // ignore
        });
    }

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDigits = (value) => String(value).padStart(2, '0').split('');
  const [hourTens, hourUnits] = getDigits(time.getHours());
  const [minuteTens, minuteUnits] = getDigits(time.getMinutes());
  const [secondTens, secondUnits] = getDigits(time.getSeconds());

  const bodyStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    width: '100vw',
    margin: 0,
    background: 'rgb(99, 93, 93)',
    overflow: 'hidden',
    position: 'relative',
  };

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'invert(0.6) hue-rotate(180deg)',
    // zIndex: 3,
  };

  const containerStyle = {
    fontFamily: 'sem, sans-serif',
    fontSize: isMobile ? '20vh' : '25vh',
    color: 'rgb(245, 19, 19)',
    textShadow:
      '#fff000 2px 2px, #fff000 -2px 2px, #fff000 2px -2px, #fff000 -2px -2px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.1vh',
    zIndex: 1,
  };

  const timeGroupStyle = {
    display: 'flex',
    gap: isMobile ? '0.5ch' : '0.1ch',
  };

  const digitStyle = {
    width: '1ch',
    textAlign: 'center',
  };

  return (
    <div style={bodyStyle}>
      <div style={bgStyle}></div>
      <div style={containerStyle}>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{hourTens}</div>
          <div style={digitStyle}>{hourUnits}</div>
        </div>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{minuteTens}</div>
          <div style={digitStyle}>{minuteUnits}</div>
        </div>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{secondTens}</div>
          <div style={digitStyle}>{secondUnits}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
