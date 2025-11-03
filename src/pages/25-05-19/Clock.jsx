import { useEffect, useState } from 'react';
import antFontUrl from './Ant.ttf';
import bg1 from "./ants.gif";
import bg2 from "./ants1.gif";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  const radius = 45; // percent from center for numbers

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Ant';
          src: url(${antFontUrl}) format('truetype');
        }
        body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgb(255,254,254)'
      }}>
        {/* Backgrounds */}
        <div style={{
          backgroundImage: `url(${bg2})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1
        }} />
        <div style={{
          backgroundImage: `url(${bg1})`,
          backgroundRepeat: "repeat",
          backgroundSize: "35vh 45vh",
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 2
        }} />

        {/* Clock */}
        <div style={{
          position: 'relative',
          width: '60vh',
          height: '60vh',
          minWidth: '200px',
          minHeight: '200px',
          maxWidth: '400px',
          maxHeight: '400px',
          borderRadius: '50%',
          zIndex: 4,
        }}>
          {/* Numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30;
            const rad = angle * Math.PI / 180;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${50 + radius * Math.sin(rad)}%`,
                top: `${50 - radius * Math.cos(rad)}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Ant, sans-serif',
                fontSize: '18vh',
                color: 'black'
              }}>
                {i + 1}
              </div>
            );
          })}

          {/* Hour Hand */}
          <div style={{
            position: 'absolute',
            width: '1vh',
            height: '20vh',
            backgroundColor: 'black',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${hourDeg}deg)`,
            transformOrigin: '50% 50%',
            borderRadius: '1vh'
          }} />

          {/* Minute Hand */}
          <div style={{
            position: 'absolute',
            width: '0.8vh',
            height: '28vh',
            backgroundColor: 'black',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${minuteDeg}deg)`,
            transformOrigin: '50% 50%',
            borderRadius: '1vh'
          }} />

          {/* Second Hand */}
          <div style={{
            position: 'absolute',
            width: '0.5vh',
            height: '30vh',
            backgroundColor: 'red',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${secondDeg}deg)`,
            transformOrigin: '50% 50%',
            borderRadius: '1vh'
          }} />

          {/* Center Dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2vh',
            height: '2vh',
            backgroundColor: 'black',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }} />
        </div>
      </div>
    </>
  );
};

export default Clock;
