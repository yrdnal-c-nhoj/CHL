import React, { useEffect } from 'react';
import spin from './20206.gif';
import bubl from './bubl.gif';
import fish from './fish.gif';
import gfish from './gfish.gif';
import aquarium from './aquarium.gif';

const AquariumClock = () => {
  useEffect(() => {
    const secondHand = document.querySelector('.second-hand');
    const minsHand = document.querySelector('.min-hand');
    const hourHand = document.querySelector('.hour-hand');
    let lastSecond = -1;

    function setDate() {
      const now = new Date();
      const seconds = now.getSeconds();
      const mins = now.getMinutes();
      const hour = now.getHours();

      const secondsDegrees = ((seconds / 60) * 360) + 90;
      const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
      const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;

      if (seconds === 0 && lastSecond === 59) {
        secondHand.style.transition = 'none';
      } else {
        secondHand.style.transition = 'transform 0.05s ease-in-out';
      }

      secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
      minsHand.style.transform = `rotate(${minsDegrees}deg)`;
      hourHand.style.transform = `rotate(${hourDegrees}deg)`;

      lastSecond = seconds;
    }

    const interval = setInterval(setDate, 1000);
    setDate();

    return () => clearInterval(interval);
  }, []);

  const sharedImageStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
  };

  return (
    <div>
      <img src={spin} style={{
        ...sharedImageStyle,
        opacity: 0.6,
        height: '80vh',
        zIndex: 3,
        filter: 'sepia(100%) hue-rotate(-30deg) brightness(120%) contrast(110%) saturate(400%)'
      }} alt="spin" />
      <img src={spin} style={{
        ...sharedImageStyle,
        transform: 'scaleX(-1)',
        opacity: 0.6,
        height: '80vh',
        zIndex: 4,
        filter: 'sepia(100%) hue-rotate(-30deg) brightness(120%) contrast(110%) saturate(400%)'
      }} alt="spin mirrored" />
      <img src={bubl} style={{
        position: 'fixed',
        top: 0,
        left: '-22vw',
        width: '100%',
        height: '110%',
        zIndex: 9,
        pointerEvents: 'none'
      }} alt="bubbles" />
      <img src={bubl} style={{
        position: 'absolute',
        bottom: 0
      }} alt="bubbles 2" />

      <div style={{
        width: '80vw',
        height: '100vh',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 8
      }}>
        <img src={fish} className="hand hour-hand" style={{
          position: 'absolute',
          width: '20%',
          height: '30%',
          right: '50%',
          top: '40%',
          transformOrigin: '100%',
          rotate: '30deg',
          filter: 'drop-shadow(2px 1px 3px rgb(0, 3, 2)) drop-shadow(-1px 1px 1px rgb(6, 85, 31)) drop-shadow(1px -1px 1px rgb(10, 154, 109)) drop-shadow(-1px -1px 1px rgb(214, 227, 216))',
        }} alt="hour hand" />

        <img src={fish} className="hand min-hand" style={{
          position: 'absolute',
          width: '40%',
          height: '30%',
          right: '50%',
          top: '40%',
          transformOrigin: '100%',
          filter: 'drop-shadow(2px 1px 3px rgb(0, 3, 2)) drop-shadow(-1px 1px 1px rgb(6, 85, 31)) drop-shadow(1px -1px 1px rgb(10, 154, 109)) drop-shadow(-1px -1px 1px rgb(214, 227, 216))',
        }} alt="minute hand" />

        <img src={fish} className="hand second-hand" style={{
          position: 'absolute',
          width: '65%',
          height: '20%',
          right: '50%',
          top: '40%',
          transformOrigin: '100%',
          filter: 'drop-shadow(2px 1px 3px rgb(0, 3, 2)) drop-shadow(-1px 1px 1px rgb(6, 85, 31)) drop-shadow(1px -1px 1px rgb(10, 154, 109)) drop-shadow(-1px -1px 1px rgb(214, 227, 216))',
        }} alt="second hand" />
      </div>

      <img src={gfish} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '180vw',
        height: '100vh',
        opacity: 0.8,
        transform: 'scaleX(-1)',
        zIndex: 4
      }} alt="gfish" />

      <img src={aquarium} style={{
        ...sharedImageStyle,
        opacity: 0.5,
        zIndex: -4
      }} alt="aquarium forward" />
      <img src={aquarium} style={{
        ...sharedImageStyle,
        opacity: 0.9,
        transform: 'scaleX(-1)',
        zIndex: -5
      }} alt="aquarium backward" />
    </div>
  );
};

export default AquariumClock;
