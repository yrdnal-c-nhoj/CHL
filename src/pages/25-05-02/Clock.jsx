import { useEffect } from 'react';
import styled from 'styled-components';
import pinMeNeedles from './pin_me_needles.ttf';
import scorpImage from './scorp.webp';
import hourHandImage from './giphy1-ezgif.com-rotate(2).gif';
import minuteHandImage from './giphy1-ezgif.com-rotate(1).gif';
import secondHandImage from './giphy1-ezgif.com-rotate(3).gif';

const numbers = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  rotation: i * 30,
}));

const Body = styled.div`
  @font-face {
    font-family: 'pin_me_needles';
    src: url(${pinMeNeedles}) format('truetype');
  }

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100vw;
  margin: 0;
  background-color: #94814a;
  overflow: hidden;
  position: relative; /* create stacking context */
`;

const BgImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  z-index: 0;
  filter: saturate(200%) contrast(200%);
  pointer-events: none;
`;

const ClockContainer = styled.div`
  position: relative;
  width: 90vmin;
  height: 90vmin;
  z-index: 2; /* ensures above background */
`;

const ClockFace = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
`;

const Number = styled.div`
  font-family: 'pin_me_needles';
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 16.5vmin;
  color: #c5c53e;
  z-index: 3;
  text-shadow: #09f745 0.1rem 0.1rem, #080808 -0.1rem 0.1rem;

  & > div {
    position: absolute;
    width: 100%;
    top: 5%;
  }
`;

const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  transition: transform 0.05s ease-out;
`;

const HourHand = styled(Hand)`
  filter: saturate(950%);
  z-index: 4;
`;

const MinuteHand = styled(Hand)`
  filter: sepia(300%) saturate(400%);
  left: 8.8rem;
  transform: translateX(-60%);
  z-index: 5;
`;

const SecondHand = styled(Hand)`
  filter: saturate(390%) contrast(200%) brightness(170%) sepia(200%);
  z-index: 6;
`;

const Nav = styled.div`
  position: fixed;
  top: 2vh;
  left: 2vw;
  z-index: 100; /* ensures above everything */
  color: white;
  font-family: sans-serif;
  font-size: 1.5rem;
`;

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const jitter = () => Math.random() * 2 - 1;
      const secondDeg = seconds * 6 + jitter() * 0.3;
      const minuteDeg = minutes * 6 + seconds / 10 + jitter() * 0.02;
      const hourDeg = hours * 30 + minutes / 2 + jitter() * 0.005;

      const secondScale = 1 + Math.sin(seconds * Math.PI / 30) * 0.05;
      const minuteScale = 1 + Math.sin(minutes * Math.PI / 30) * 0.03;
      const hourScale = 1 + Math.sin(hours * Math.PI / 6) * 0.02;

      const secondHand = document.querySelector('.second-hand');
      const minuteHand = document.querySelector('.minute-hand');
      const hourHand = document.querySelector('.hour-hand');

      if (secondHand) {
        secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg) scaleY(${secondScale})`;
      }
      if (minuteHand) {
        minuteHand.style.transform = `translateX(-60%) rotate(${minuteDeg}deg) scaleY(${minuteScale})`;
      }
      if (hourHand) {
        hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg) scaleY(${hourScale})`;
      }
    };

    const intervalId = setInterval(updateClock, 50);
    updateClock();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Body>
      <BgImage src={scorpImage} alt="Background" />
      <Nav>← Navigation</Nav>

      <ClockContainer>
        <ClockFace>
          {numbers.map((num) => (
            <Number key={num.value} style={{ transform: `rotate(${num.rotation}deg)` }}>
              <div>{num.value}</div>
            </Number>
          ))}
          <HourHand className="hour-hand">
            <img src={hourHandImage} alt="Hour Hand" />
          </HourHand>
          <MinuteHand className="minute-hand">
            <img src={minuteHandImage} alt="Minute Hand" />
          </MinuteHand>
          <SecondHand className="second-hand">
            <img src={secondHandImage} alt="Second Hand" />
          </SecondHand>
        </ClockFace>
      </ClockContainer>
    </Body>
  );
};

export default Clock;
