import React, { useEffect } from 'react';
import torGif from './tor.gif';
import speedFont from './speed.ttf';

const Clock = () => {
  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    hours = hours % 12 || 12;
    const timeString = `${hours}${minutes.toString().padStart(2, '0')}`;
    const CUSTOM_LETTERS = timeString;
    const numLetters = 100;

    let centerX = window.innerWidth / 2;
    window.addEventListener('resize', () => {
      centerX = window.innerWidth / 2;
    });

    function randomLetter() {
      return CUSTOM_LETTERS[Math.floor(Math.random() * CUSTOM_LETTERS.length)];
    }

    function randomInRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function assignColor(letter) {
      function randomBrownish() {
        const r = randomInRange(90, 140);
        const g = randomInRange(50, 90);
        const b = randomInRange(30, 60);
        return `rgb(${r},${g},${b})`;
      }

      function randomBlackish() {
        const shade = randomInRange(10, 40);
        return `rgb(${shade},${shade},${shade})`;
      }

      function randomBrownishGray() {
        const base = randomInRange(60, 100);
        const r = Math.min(base + randomInRange(10, 30), 255);
        const g = base;
        const b = Math.max(base - randomInRange(10, 30), 0);
        return `rgb(${r},${g},${b})`;
      }

      const rand = Math.random();
      if (rand < 0.4) return randomBrownish();
      else if (rand < 0.7) return randomBlackish();
      else return randomBrownishGray();
    }

    function createLetter() {
      const span = document.createElement('span');
      span.className = 'tornado-clock__letter';
      const letter = randomLetter();
      span.textContent = letter;
      span.style.color = assignColor(letter);
      span.style.fontSize = `${randomInRange(1, 16)}vh`;
      span.setAttribute('aria-hidden', 'true');
      document.body.appendChild(span);
      return span;
    }

    const particles = Array.from({ length: numLetters }, (_, index) => {
      const el = createLetter();
      return {
        el,
        angle: Math.random() * 2 * Math.PI,
        baseHeight: (index / numLetters) * window.innerHeight,
        speed: Math.random() * 0.2 + 0.2,
        wobblePhase: Math.random() * 2 * Math.PI,
        wobbleFreq: Math.random() * 0.15 + 0.1,
        wobbleAmp: Math.random() * 2 + 1,
        secondaryWobblePhase: Math.random() * 2 * Math.PI,
        secondaryWobbleFreq: Math.random() * 0.2 + 0.05
      };
    });

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      const swayOffset = Math.sin(time) * 5;

      particles.forEach(p => {
        p.angle += p.speed * 0.05;
        p.baseHeight -= p.speed + Math.sin(time + p.wobblePhase) * 0.2;
        if (p.baseHeight < -5) {
          p.baseHeight = window.innerHeight + 5;
          p.el.textContent = randomLetter();
          p.el.style.color = assignColor(p.el.textContent);
          p.el.style.fontSize = `${randomInRange(3, 8)}vh`;
          p.angle = Math.random() * 2 * Math.PI;
          p.wobblePhase = Math.random() * 2 * Math.PI;
          p.secondaryWobblePhase = Math.random() * 2 * Math.PI;
        }

        const normalizedHeight = 1 - (p.baseHeight / window.innerHeight);
        const baseRadius = 3 + normalizedHeight * 20;
        const radiusVariation = Math.sin(time + p.wobblePhase) * 1.5;
        const radius = baseRadius + radiusVariation;

        const wobble =
          Math.sin(time * p.wobbleFreq + p.wobblePhase) * p.wobbleAmp +
          Math.cos(time * p.secondaryWobbleFreq + p.secondaryWobblePhase) *
            (p.wobbleAmp * 0.5);
        const x = (centerX / window.innerWidth) * 100 + swayOffset + Math.cos(p.angle) * radius + wobble;
        const y = (p.baseHeight / window.innerHeight) * 100;

        const scale = 0.5 + (p.baseHeight / window.innerHeight) * 1.5;
        const rotation = p.angle * 50;

        p.el.style.transform = `translate(${x}vw, ${y}vh) scale(${scale}) rotate(${rotation}deg)`;
        p.el.style.zIndex = Math.floor(scale * 100);
      });
    }

    animate();

    const flashOverlay = document.getElementById('tornado-clock__flash-overlay');
    function triggerFlash(color) {
      if (flashOverlay) {
        flashOverlay.style.backgroundColor = color;
        flashOverlay.style.opacity = '1';
        setTimeout(() => {
          flashOverlay.style.opacity = '0';
        }, 50);
      }
    }

    function randomFlashLoop() {
      const nextDelay = Math.random() * 2000 + 1000;
      setTimeout(() => {
        const color = Math.random() < 0.5 ? 'white' : 'black';
        triggerFlash(color);
        randomFlashLoop();
      }, nextDelay);
    }

    randomFlashLoop();

    return () => {
      particles.forEach(p => p.el.remove());
      window.removeEventListener('resize', () => {
        centerX = window.innerWidth / 2;
      });
    };
  }, []);

  return (
    <div className="tornado-clock">
      <style>
        {`
          @font-face {
            font-family: 'speed';
            src: url(${speedFont}) format('truetype');
          }

          .tornado-clock {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: radial-gradient(ellipse at center, #8d906e 0%, #eaf5a2 100%);
            background-color: rgb(184, 204, 168);
            font-family: 'speed', sans-serif;
            isolation: isolate;
          }

          .tornado-clock__letter {
            position: absolute;
            pointer-events: none;
            will-change: transform;
            font-family: 'speed', Arial, sans-serif;
          }

          .tornado-clock__bgimage {
            background-size: cover;
            background-position: center;
            position: absolute;
            height: 100vh;
            width: 100vw;
            transform: scaleX(-1);
            z-index: 1;
            opacity: 0.3;
            filter: contrast(0.2) invert(5.0);
          }

          .tornado-clock__flash-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            transition: opacity 0.1s ease;
            z-index: 3;
            opacity: 0;
          }
        `}
      </style>

      <img src={torGif} className="tornado-clock__bgimage" alt="Tornado Background" />
      <div id="tornado-clock__flash-overlay"></div>
    </div>
  );
};

export default Clock;