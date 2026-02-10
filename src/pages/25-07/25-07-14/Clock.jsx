import React, { useEffect, useRef } from 'react';

// Hands
import hourHand from '../../../assets/images/25-07-14/ca.gif';
import minHand from '../../../assets/images/25-07-14/car.gif';
import secHand from '../../../assets/images/25-07-14/cart.gif';

// Digits
import img1 from '../../../assets/images/25-07-14/1.webp';
import img2 from '../../../assets/images/25-07-14/number-two.gif';
import img3 from '../../../assets/images/25-07-14/6.gif';
import img4 from '../../../assets/images/25-07-14/number-8-gif.gif';
import img5 from '../../../assets/images/25-07-14/numero-9.gif';
import img6 from '../../../assets/images/25-07-14/11.gif';
import img7 from '../../../assets/images/25-07-14/1650437258_50659_gif-url-3537927050.gif';
import img8 from '../../../assets/images/25-07-14/2to5-rolling.gif';
import img9 from '../../../assets/images/25-07-14/dancing-number-dancing-letter.gif';
import img10 from '../../../assets/images/25-07-14/goura-goura12.gif';
import img11 from '../../../assets/images/25-07-14/agencylife-kochstrasse.gif';
import img12 from '../../../assets/images/25-07-14/agenturleben-agencylife.gif';

const digitImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];
const sizes = [6.5, 7.1, 7.2, 7.7, 6.3, 10.5, 7.3, 7.5, 7.4, 6.7, 7.3, 7.3]; // rem units

const Clock = () => {
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12 || 12;

      const secDeg = (seconds / 60) * 360;
      const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

      if (secRef.current) {
        secRef.current.style.transition = seconds === 0 ? 'none' : 'transform 0.1s linear';
        secRef.current.style.transform = `rotate(${secDeg}deg)`;
      }
      if (minRef.current) {
        minRef.current.style.transition = (minutes === 0 && seconds === 0) ? 'none' : 'transform 0.5s ease-in-out';
        minRef.current.style.transform = `rotate(${minDeg}deg)`;
      }
      if (hourRef.current) {
        hourRef.current.style.transition = (hours === 12 && minutes === 0 && seconds === 0) ? 'none' : 'transform 0.5s ease-in-out';
        hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      }
    };

    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#817a8d',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%2354553c' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '80vw',
          height: '80vw',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {digitImages.map((img, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transform: `rotate(${(i + 1) * 30}deg) translateY(1vh)`,
                inset: 0,
              }}
            >
              <img
                src={img}
                alt={`digit-${i + 1}`}
                style={{
                  width: `${sizes[i]}rem`,
                  height: `${sizes[i]}rem`,
                  objectFit: 'contain',
                  opacity: 0.8,
                }}
              />
            </span>
          ))}

          {/* Clock Hands */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '33%',
              width: '0',
              height: '0',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <img ref={hourRef} src={hourHand} alt="hour" style={handStyle(16)} />
            <img ref={minRef} src={minHand} alt="minute" style={handStyle(19)} />
            <img ref={secRef} src={secHand} alt="second" style={handStyle(24)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const handStyle = (heightVh) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)',
  transformOrigin: '50% 100%',
  height: `${heightVh}vh`,
  opacity: 0.9,
  zIndex: 2,
});

export default Clock;
