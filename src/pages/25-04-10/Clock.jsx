import React from 'react';

const BrokenClocksRoom = () => {
  const roomStyle = {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#2b2b2b',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'sans-serif',
  };

  const clockFaceStyle = {
    width: '12rem',
    height: '12rem',
    border: '0.4rem solid #555',
    borderRadius: '50%',
    position: 'relative',
    margin: '2rem',
    transform: `rotate(${Math.random() * 360}deg)`,
    backgroundColor: '#1a1a1a',
    boxShadow: 'inset 0 0 1rem #000',
  };

  const numberStyle = (top, left, rotate) => ({
    position: 'absolute',
    top,
    left,
    fontSize: '1rem',
    color: '#ddd',
    transform: `rotate(${rotate}deg)`,
  });

  const handStyle = (width, height, color, duration) => ({
    position: 'absolute',
    width,
    height,
    backgroundColor: color,
    borderRadius: '0.25rem',
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    transform: `rotate(${Math.random() * 360}deg)`,
    transformOrigin: 'bottom center',
    animation: `spin ${duration}s linear infinite`,
  });

  return (
    <div style={roomStyle}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ ...clockFaceStyle, transform: `rotate(${Math.random() * 360}deg)` }}>
          {[...Array(12)].map((_, n) => {
            const angle = (n + 1) * 30;
            const rad = (angle * Math.PI) / 180;
            const radius = 4.5;
            const top = `${5.8 + radius * Math.sin(rad)}rem`;
            const left = `${5.8 + radius * Math.cos(rad)}rem`;
            return (
              <div
                key={n}
                style={numberStyle(top, left, Math.random() * 360)}
              >
                {n + 1}
              </div>
            );
          })}
        </div>
      ))}

      {/* Flying hands */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`hand-${i}`}
          style={handStyle(
            `${Math.random() > 0.5 ? 0.3 : 0.2}rem`,
            `${3 + Math.random() * 4}rem`,
            ['#f33', '#3f3', '#33f'][i % 3],
            2 + Math.random() * 3
          )}
        />
      ))}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg) translateY(-0.25rem); }
          100% { transform: rotate(360deg) translateY(-0.25rem); }
        }
      `}</style>
    </div>
  );
};

export default BrokenClocksRoom;
