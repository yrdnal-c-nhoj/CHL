import React, { useEffect } from 'react';
import mintFont from './mint.ttf';
import hourImg from './mint.png';
import minuteImg from './minty.webp';
import secondImg from './min.png';
import bgImage from './candy.jpg';

const MintClock = () => {
  useEffect(() => {
    const clock = document.getElementById('clock');
    for (let i = 1; i <= 12; i++) {
      const numberDiv = document.createElement('div');
      numberDiv.className = 'number';
      numberDiv.style.transform = `rotate(${i * 30}deg) skew(-15deg)`;
      const span = document.createElement('span');
      span.textContent = i;
      numberDiv.appendChild(span);
      clock.appendChild(numberDiv);
    }

    const hourHand = document.querySelector('.hand.hour');
    const minuteHand = document.querySelector('.hand.minute');
    const secondHand = document.querySelector('.hand.second');

    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();
      const secDeg = seconds * 6;
      const minDeg = minutes * 6 + seconds * 0.1;
      const hrDeg = (hours % 12) * 30 + minutes * 0.5;

      secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
      minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
      hourHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    [hourHand, minuteHand, secondHand].forEach(hand => {
      hand.onerror = () => {
        console.error(`Failed to load image for ${hand.alt} at ${hand.src}`);
        hand.style.background = hand.classList.contains('hour') ? 'blue' : hand.classList.contains('minute') ? 'green' : 'red';
        hand.style.width = hand.classList.contains('hour') ? '0.3rem' : hand.classList.contains('minute') ? '0.2rem' : '0.1rem';
        hand.style.height = hand.classList.contains('hour') ? '6rem' : hand.classList.contains('minute') ? '8rem' : '10rem';
      };
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: 0, height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#85ed6b', overflow: 'hidden' }}>
      <style>
        {`
          @font-face {
            font-family: 'mint';
            src: url(${mintFont}) format('truetype');
          }

          .clock {
            z-index: 6;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60vmin;
            height: 60vmin;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .number {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            font-family: 'mint';
            font-size: 4rem;
            color: #8AE3A8;
            text-shadow: 0.05rem 0.05rem 0 rgb(10, 39, 17), 0.1rem 0.1rem 0 #f1f6f2;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }

          .number span {
            display: block;
            transform: translateY(-15vmin);
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: 50% 100%;
            transform: translateX(-50%) rotate(0deg);
            pointer-events: none;
            height: auto;
            object-fit: contain;
          }

          .hour {
            height: 10vmin;
            z-index: 2;
          }

          .minute {
            height: 16vmin;
            z-index: 3;
          }

          .second {
            height: 20vmin;
            z-index: 4;
          }

          .bgimage {
            background-image: url(${bgImage});
            background-size: cover;
            background-position: center;
            position: fixed;
            height: 100vh;
            width: 100vw;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            opacity: 0.4;
          }
        `}
      </style>
      <div className="bgimage"></div>
      <div className="clock" id="clock">
        <img className="hand hour" src={hourImg} alt="Hour Hand" />
        <img className="hand minute" src={minuteImg} alt="Minute Hand" />
        <img className="hand second" src={secondImg} alt="Second Hand" />
        <div className="center-dot"></div>
      </div>
    </div>
  );
};

export default MintClock;