import React, { useEffect, useRef, useState } from 'react';

const RandomColorClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  const dotContainerRef = useRef();
  const squareRefs = useRef([]);
  const clockRef = useRef();

  const [background, setBackground] = useState('#f7050d');

  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = seconds * 6;

    if (hourRef.current) {
      hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      hourRef.current.style.backgroundColor = getRandomColor();
    }
    if (minuteRef.current) {
      minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      minuteRef.current.style.backgroundColor = getRandomColor();
    }
    if (secondRef.current) {
      secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      secondRef.current.style.backgroundColor = getRandomColor();
    }

    if (dotContainerRef.current) {
      Array.from(dotContainerRef.current.children).forEach(dot => {
        dot.style.backgroundColor = getRandomColor();
      });
    }

    squareRefs.current.forEach(square => {
      square.style.backgroundColor = getRandomColor();
    });

    setBackground(getRandomColor());
  };

  const createDots = () => {
    const container = dotContainerRef.current;
    if (!container || !clockRef.current) return;

    container.innerHTML = '';
    const size = clockRef.current.offsetWidth;
    const radius = size * 0.3;
    const center = size / 2;

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle) - size * 0.04;
      const y = center + radius * Math.sin(angle) - size * 0.04;

      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.width = '3vw';
      dot.style.height = '3vw';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.transition = 'background-color 1s';
      dot.style.zIndex = '1';
      container.appendChild(dot);
    }
  };

  const positionSquares = () => {
    if (!clockRef.current) return;
    const size = clockRef.current.offsetWidth;
    const radius = size * 0.60;
    const center = size / 2;

    squareRefs.current.forEach((square, i) => {
      const angleDeg = i * 30;
      const angleRad = angleDeg * (Math.PI / 180);
      const x = center + radius * Math.sin(angleRad);
      const y = center - radius * Math.cos(angleRad);
      square.style.left = `${x}px`;
      square.style.top = `${y}px`;
    });
  };

  useEffect(() => {
    createDots();
    positionSquares();
    const interval = setInterval(updateClock, 1000);
    updateClock();

    window.addEventListener('resize', () => {
      createDots();
      positionSquares();
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        backgroundColor: background,
        transition: 'background-color 2s',
        overflow: 'hidden',
      }}
    >
      <div
        className="clock"
        ref={clockRef}
        style={{
          position: 'relative',
          width: '70vmin',
          height: '70vmin',
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (squareRefs.current[i] = el)}
            style={{
              position: 'absolute',
              width: '8vw',
              height: '8vw',
              backgroundColor: '#3498db',
              transform: 'translate(-50%, -50%)',
              transition: 'background-color 1s',
              zIndex: 2,
            }}
          />
        ))}

        <div ref={dotContainerRef} />

        <div
          ref={hourRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '11vmin',
            height: '50%',
            backgroundColor: 'blue',
            transformOrigin: 'bottom',
            transform: 'translateX(-50%) rotate(0deg)',
            transition: 'background-color 1s',
            zIndex: 3,
          }}
        />

        <div
          ref={minuteRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '6vmin',
            height: '70%',
            backgroundColor: 'green',
            transformOrigin: 'bottom',
            transform: 'translateX(-50%) rotate(0deg)',
            transition: 'background-color 1s',
            zIndex: 4,
          }}
        />

        <div
          ref={secondRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '2vmin',
            height: '100%',
            backgroundColor: 'red',
            transformOrigin: 'bottom',
            transform: 'translateX(-50%) rotate(0deg)',
            transition: 'background-color 1s',
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
};

export default RandomColorClock;
