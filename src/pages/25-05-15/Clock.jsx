import React, { useEffect } from 'react';
import roulGif from './roul.gif';
import rouleGif from './roule.gif';
import rouletteSvg from './Roulette_french.svg';
import loraFont from './lora.ttf'; // Assuming you have Lora.ttf in the same folder

const RouletteClock = () => {
  useEffect(() => {
    createClock();
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const createClock = () => {
    const clock = document.getElementById('clock');
    if (!clock) return;

    clock.innerHTML = ''; // Clear if re-rendered

    for (let i = 1; i <= 12; i++) {
      const angle = i * 30;
      const number = document.createElement('div');
      number.style.position = 'absolute';
      number.style.width = '100%';
      number.style.height = '100%';
      number.style.fontFamily = 'Lora, serif';
      number.style.fontWeight = '900';
      number.style.textAlign = 'center';
      number.style.fontSize = '6.5vw'; // Scaled with viewport width
      number.style.transform = `rotate(${angle}deg)`;

      const span = document.createElement('span');
      span.textContent = i;
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(-38.5vw)'; // Adjusted for larger clock
      span.style.backgroundColor = i % 2 === 0 ? 'red' : 'black';
      span.style.color = 'white';
      span.style.width = '7vw';
      span.style.height = '12vw';
      span.style.lineHeight = '12vw';
      span.style.textAlign = 'center';

      number.appendChild(span);
      clock.appendChild(number);
    }

    const hands = [
      { class: 'hour-hand', img: 'https://placehold.co/8x80/000000/000000/png' },
      { class: 'minute-hand', img: 'https://placehold.co/6x100/000000/000000/png' },
      { class: 'second-hand', img: 'https://placehold.co/4x120/FF0000/FF0000/png' },
    ];

    hands.forEach(hand => {
      const div = document.createElement('div');
      div.className = `hand ${hand.class}`;
      div.style.position = 'absolute';
      div.style.bottom = '50%';
      div.style.left = '50%';
      div.style.transformOrigin = 'bottom';
      div.style.zIndex = '10';

      const img = document.createElement('img');
      img.src = hand.img;
      img.style.display = 'block';

      if (hand.class === 'hour-hand') {
        img.style.width = '2vw';
        img.style.height = '35vw';
      } else if (hand.class === 'minute-hand') {
        img.style.width = '1.5vw';
        img.style.height = '40vw';
      } else {
        img.style.width = '1vw';
        img.style.height = '45vw';
      }

      div.appendChild(img);
      clock.appendChild(div);
    });

    const center = document.createElement('div');
    center.className = 'center';
    center.style.width = '3vw';
    center.style.height = '3vw';
    center.style.backgroundColor = 'rgb(237, 9, 9)';
    center.style.borderRadius = '50%';
    center.style.position = 'absolute';
    center.style.top = '50%';
    center.style.left = '50%';
    center.style.transform = 'translate(-50%, -50%)';
    center.style.zIndex = '20';

    clock.appendChild(center);
  };

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = seconds * 6;

    const hour = document.querySelector('.hour-hand');
    const minute = document.querySelector('.minute-hand');
    const second = document.querySelector('.second-hand');

    if (hour) hour.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    if (minute) minute.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    if (second) second.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  };

  const fontStyle = `
    @font-face {
      font-family: 'Lora';
      src: url(${loraFont}) format('truetype');
      font-weight: 400;
      font-style: normal;
    }
  `;

  return (
    <div style={{ height: '100dvh', margin: 0, overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>{fontStyle}</style>

      <div
        id="clock"
        style={{
          width: '100vw',
          height: '100vw',
          borderRadius: '50%',
          position: 'relative',
          backgroundImage: `url(${roulGif})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          aspectRatio: '1 / 1',
          boxSizing: 'border-box',
          zIndex: 6,
        }}
      ></div>

      <img
        src={rouleGif}
        alt="bg1"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '130vw',
          height: '130vw',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          filter: 'saturate(900%) brightness(70%)',
          zIndex: 3,
          opacity: 0.9,
        }}
      />
      <img
        src={rouletteSvg}
        alt="bg2"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '80vw',
          height: '80vw',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          filter: 'saturate(200%) brightness(140%) contrast(140%)',
          zIndex: 2,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export default RouletteClock;