import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const roomRef = useRef(null);

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;

    function createClock() {
      const sizes = [
        { size: 20, gravity: 0.5 },
        { size: 40, gravity: 0.05 },
        { size: 70, gravity: 0.001 },
        { size: 100, gravity: 0.001 },
        { size: 130, gravity: 0.00005 },
      ];

      const { size, gravity } = sizes[Math.floor(Math.random() * sizes.length)];

      const clock = document.createElement('div');
      clock.className = 'clock';
      clock.style.width = `${size / 16}rem`;
      clock.style.height = `${size / 16}rem`;
      clock.style.left = `${Math.random() * (100 - size / 16)}vw`;
      clock.style.top = '-9.375rem';

      const color = `hsl(${Math.floor(Math.random() * 360)}, 10%, 30%)`;
      clock.style.background = color;
      clock.style.boxShadow = `0 0 ${size * 0.2 / 16}rem ${color}`;

      const hour = document.createElement('div');
      hour.className = 'hand hour';
      hour.style.width = `${size * 0.05 / 16}rem`;
      hour.style.height = `${size * 0.25 / 16}rem`;
      hour.style.top = `${size * 0.25 / 16}rem`;
      hour.style.left = `${size / 2 / 16 - (size * 0.05) / 2 / 16}rem`;

      const minute = document.createElement('div');
      minute.className = 'hand minute';
      minute.style.width = `${size * 0.025 / 16}rem`;
      minute.style.height = `${size * 0.4 / 16}rem`;
      minute.style.top = `${size * 0.1 / 16}rem`;
      minute.style.left = `${size / 2 / 16 - (size * 0.025) / 2 / 16}rem`;

      clock.appendChild(hour);
      clock.appendChild(minute);
      room.appendChild(clock);

      let y = -9.375; // -150px in rem
      let velocity = 0;
      const bounce = 0.7;

      function animate() {
        velocity += gravity;
        y += velocity;

        if (y > window.innerHeight / 16 - size / 16) {
          y = window.innerHeight / 16 - size / 16;
          velocity *= -bounce;
        }

        clock.style.top = `${y}rem`;
        requestAnimationFrame(animate);
      }

      animate();
      updateHands(hour, minute);

      setTimeout(() => {
        clock.classList.add('fade-out');
        clock.addEventListener('transitionend', () => {
          if (clock.parentElement) {
            clock.parentElement.removeChild(clock);
          }
        });
      }, 30000);
    }

    function updateHands(hour, minute) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();

      hour.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
      minute.style.transform = `rotate(${m * 6}deg)`;
    }

    const intervalId = setInterval(createClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden font-sans">
      <div className="title-container absolute top-[0.3125rem] left-1/2 -translate-x-1/2 w-[98%] flex z-[6] text-[#cacccb] [text-shadow:_1px_0_#82877e]">
      </div>
      <div className="room w-full h-full overflow-hidden absolute inset-0 z-10" ref={roomRef}></div>
    </div>
  );
}

export default App;