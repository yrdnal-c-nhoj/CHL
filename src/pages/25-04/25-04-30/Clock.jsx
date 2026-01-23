import { useEffect, useRef } from 'react';

function App() {
  const roomRef = useRef(null);

  // Inline styles
  const containerStyle = {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
    background: 'linear-gradient(to top, #DCD5B4, #D6F1F1)',
    position: 'relative'
  };

  const titleContainerStyle = {
    position: 'absolute',
    top: '0.3125rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
    color: '#cacccb',
    textShadow: '1px 0 #82877e'
  };

  const roomStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    boxSizing: 'border-box'
  };

  const getClockStyle = (size, color) => ({
    position: 'absolute',
    borderRadius: '50%',
    transition: 'transform 5s ease, opacity 5s ease',
    boxShadow: `0 0 ${size * 0.2 / 16}rem ${color}, 0 0 1.25rem rgba(0, 0, 0, 0.3)`,
    willChange: 'transform, opacity'
  });

  const getHandStyle = () => ({
    position: 'absolute',
    transformOrigin: 'bottom center',
    borderRadius: '0.125rem'
  });

  const getHourStyle = () => ({
    ...getHandStyle(),
    background: 'rgb(192, 188, 188)'
  });

  const getMinuteStyle = () => ({
    ...getHandStyle(),
    background: 'rgb(216, 209, 153)'
  });

  const getFadeOutStyle = () => ({
    transform: 'scale(0)',
    opacity: 0
  });

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
      const color = `hsl(${Math.floor(Math.random() * 360)}, 10%, 30%)`;

      const clock = document.createElement('div');
      Object.assign(clock.style, getClockStyle(size, color));
      clock.style.width = `${size / 16}rem`;
      clock.style.height = `${size / 16}rem`;
      clock.style.left = `${Math.random() * (100 - size / 16)}vw`;
      clock.style.top = '-9.375rem';
      clock.style.background = color;

      const hour = document.createElement('div');
      Object.assign(hour.style, getHourStyle());
      hour.style.width = `${size * 0.05 / 16}rem`;
      hour.style.height = `${size * 0.25 / 16}rem`;
      hour.style.top = `${size * 0.25 / 16}rem`;
      hour.style.left = `${size / 2 / 16 - (size * 0.05) / 2 / 16}rem`;

      const minute = document.createElement('div');
      Object.assign(minute.style, getMinuteStyle());
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

        // Use the actual container height instead of window.innerHeight
        const containerHeight = room.offsetHeight / 16; // Convert to rem
        const clockHeight = size / 16;
        
        if (y > containerHeight - clockHeight) {
          y = containerHeight - clockHeight;
          velocity *= -bounce;
        }

        clock.style.top = `${y}rem`;
        requestAnimationFrame(animate);
      }

      animate();
      updateHands(hour, minute);

      setTimeout(() => {
        Object.assign(clock.style, getFadeOutStyle());
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
    <div style={containerStyle}>
      <div style={titleContainerStyle}>
      </div>
      <div style={roomStyle} ref={roomRef}></div>
    </div>
  );
}

export default App;