import React, { useEffect } from 'react';
import bgGif from './images/tumblr_53c27c64cc9f17a0880aff18b8f6d934_d138a0cd_500.gif';
import layer5Gif from './images/2501912_2ddac-564534539.gif';
import layer3Gif from './images/giphy-3181726992.webp';
import rectangleGif from './images/e0435fd452bbed155b5b3c5128b4f7c5.gif';

const PrimaryClock = () => {
  useEffect(() => {
    const secondHand = document.querySelector('.second-hand');
    const minsHand = document.querySelector('.min-hand');
    const hourHand = document.querySelector('.hour-hand');

    function setDate() {
      const now = new Date();
      const seconds = now.getSeconds();
      const secondsDegrees = ((seconds / 60) * 360) + 90;
      secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

      const mins = now.getMinutes();
      const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
      minsHand.style.transform = `rotate(${minsDegrees}deg)`;

      const hour = now.getHours();
      const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
      hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }

    const interval = setInterval(setDate, 1000);
    setDate();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
      <div style={{ ...styles.bgimage, backgroundImage: `url(${bgGif})` }} />
      <div style={{ ...styles.layer5, backgroundImage: `url(${layer5Gif})` }} />
      <div style={{ ...styles.layer3, backgroundImage: `url(${layer3Gif})` }} />
      <div style={{ ...styles.rectangle, backgroundImage: `url(${rectangleGif})` }} />

      <div style={styles.centerContainer}>
        <div style={styles.clock}>
          <div className="hand min-hand" style={styles.minHand}></div>
          <div className="hand hour-hand" style={styles.hourHand}></div>
          <div className="hand second-hand" style={styles.secondHand}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    height: '100dvh',
    margin: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    position: 'relative',
  },
  bgimage: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundRepeat: 'repeat',
    backgroundSize: '9vh 22vw',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  layer5: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundRepeat: 'repeat',
    backgroundSize: '5vh 15vw',
    opacity: 0.6,
    zIndex: 2,
    top: 0,
    left: 0,
  },
  layer3: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundRepeat: 'repeat',
    backgroundSize: '12vh 42vw',
    opacity: 0.9,
    zIndex: 12,
    top: 0,
    left: 0,
  },
  rectangle: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '200% 200%',
    filter: 'contrast(600%) brightness(300%)',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: 0.7,
    top: 0,
    left: 0,
  },
  centerContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
  },
  clock: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    opacity: 0.8,
  },
  minHand: {
    height: '9vh',
    width: '100%',
    background: '#0a2ef8',
    position: 'absolute',
    top: '50%',
    transformOrigin: '100%',
    right: '50%',
    zIndex: 11,
  },
  hourHand: {
    height: '11vh',
    width: '72%',
    background: '#fbf703',
    position: 'absolute',
    top: '50%',
    transformOrigin: '100%',
    right: '50%',
    zIndex: 18,
  },
  secondHand: {
    height: '4vh',
    width: '400%',
    background: '#f40606',
    position: 'absolute',
    top: '50%',
    transformOrigin: '100%',
    right: '50%',
    zIndex: 10,
  },
};

export default PrimaryClock;
