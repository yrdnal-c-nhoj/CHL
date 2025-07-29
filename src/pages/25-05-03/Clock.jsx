import React, { useEffect, useState } from 'react';
import fontUrl from './Petal.ttf';
import bg1 from './petals.gif';
import bg2 from './talos.gif';
import bg3 from './petalos.gif';
import bg4 from './petals.gif';

const FlyingPetalsClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const font = new FontFace('Petal', `url(${fontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeParts = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return [...hours, ...minutes, ...seconds];
  };

  const digits = getTimeParts();

  const containerStyle = {
    fontFamily: 'Petal, sans-serif',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: 'rgb(224, 145, 156)',
    height: '100vh',
    width: '100vw',
    position: 'relative',
  };

  const imgStyleBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  };

  const imageStyles = [
    { ...imgStyleBase, transform: 'rotate(180deg)', filter: 'saturate(7.5)', zIndex: 4 },
    { ...imgStyleBase, transform: 'rotate(185deg)', filter: 'saturate(2.5) brightness(1.5)', zIndex: 1 },
    { ...imgStyleBase, transform: 'rotate(180deg)', filter: 'saturate(1.5) brightness(1.5)', zIndex: 2 },
    { ...imgStyleBase, transform: 'rotate(10deg)', filter: 'saturate(1.5) brightness(1.5)', zIndex: 3 },
  ];

  const wrapperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  };

  const clockContainerStyle = {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '2vw',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const digitGroupStyle = {
    display: 'flex',
    gap: '0.5vw',
  };

  const digitBoxStyle = {
    color: '#7f8431',
    textShadow:
      '#88f157 0.2rem 0.3rem 2rem, #88f157 -0.2rem 0.3rem 2rem, #88f157 0.2rem -0.3rem 2rem, #88f157 -0.2rem -0.3rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '9vw',
    width: '8vw',
    height: '6vw',
    minWidth: '5vw',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <img src={bg1} alt="background1" style={imageStyles[0]} />
      <img src={bg2} alt="background2" style={imageStyles[1]} />
      <img src={bg3} alt="background3" style={imageStyles[2]} />
      <img src={bg4} alt="background4" style={imageStyles[3]} />
      <div style={wrapperStyle}>
        <div style={clockContainerStyle}>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{digits[0]}</div>
            <div style={digitBoxStyle}>{digits[1]}</div>
          </div>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{digits[2]}</div>
            <div style={digitBoxStyle}>{digits[3]}</div>
          </div>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{digits[4]}</div>
            <div style={digitBoxStyle}>{digits[5]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyingPetalsClock;
