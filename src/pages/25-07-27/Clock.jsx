import React, { useEffect, useState } from 'react';
import myCustomFont from './som.ttf';
import backgroundImage from './met.jpg'; // Import your background image

const Clock = () => {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    const formatTime = (date) => {
      let h = date.getHours() % 12;
      if (h === 0) h = 12;
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}${m}`;
    };

    const addDigit = (char, index, hourLength) => {
      const id = Date.now() + Math.random();
      const top = Math.random() * 90;

      let typeClass, color;

      if (index < hourLength) {
        typeClass = 'hour';
        color = '#FFD700'; // Gold
      } else {
        const minuteIndex = index - hourLength;
        if (minuteIndex === 0) {
          typeClass = 'minuteTens';
          color = '#C0C0C0'; // Silver
        } else {
          typeClass = 'minuteOnes';
          color = '#CD7F32'; // Bronze
        }
      }

      setDigits((prev) => [...prev, { id, char, top, typeClass, color }]);

      setTimeout(() => {
        setDigits((prev) => prev.filter((d) => d.id !== id));
      }, 6000);
    };

    const showTimeDigits = () => {
      const now = new Date();
      const timeStr = formatTime(now);
      const hourLength = timeStr.length - 2;

      [...timeStr].forEach((char, i) => {
        setTimeout(() => addDigit(char, i, hourLength), i * 1000);
      });
    };

    showTimeDigits();
    const interval = setInterval(showTimeDigits, 666);

    return () => clearInterval(interval);
  }, []);

  const digitStyle = (top) => ({
    position: 'absolute',
    top: `${top}vh`,
    left: '-30vw',
    fontFamily: 'MyCustomFont, monospace',
    whiteSpace: 'pre',
    transformOrigin: 'center',
  });

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`, // Add background image
          backgroundSize: 'cover', // Ensure the image covers the entire area
          backgroundPosition: 'center', // Center the image
          backgroundRepeat: 'no-repeat', // Prevent tiling
          overflow: 'hidden',
          fontFamily: 'MyCustomFont, monospace',
        }}
      >
        {digits.map(({ id, char, top, typeClass }) => (
          <div
            key={id}
            className={typeClass}
            style={{
              ...digitStyle(top),
              fontSize:
                typeClass === 'hour'
                  ? '5rem'
                  : typeClass === 'minuteTens'
                  ? '3.5rem'
                  : '1.6rem',
            }}
          >
            {char}
          </div>
        ))}
      </div>
      <style>{`
        @font-face {
          font-family: 'MyCustomFont';
          src: url(${myCustomFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        .hour, .minuteTens, .minuteOnes {
          animation:
            fadeInSlide 0.6s ease-out,
            rollRight 6s linear forwards,
            shimmer 2s infinite linear;
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-family: 'MyCustomFont', monospace;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.4),
            1px 1px 2px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          -webkit-box-reflect: below -0.1em linear-gradient(transparent, rgba(0, 0, 0, 0.3));
        }

        .hour {
          background-image: linear-gradient(
            120deg,
            #b8860b 0%,
            #ffd700 40%,
            #fff8dc 60%,
            #ffd700 80%,
            #b8860b 100%
          );
        }

        .minuteTens {
          background-image: linear-gradient(
            120deg,
            #aaa 0%,
            #ccc 40%,
            #eee 60%,
            #ccc 80%,
            #aaa 100%
          );
        }

        .minuteOnes {
          background-image: linear-gradient(
            120deg,
            #8c6239 0%,
            #cd7f32 40%,
            #f4e2d8 60%,
            #cd7f32 80%,
            #8c6239 100%
          );
        }

        @keyframes fadeInSlide {
          0% {
            transform: translateX(-10vw);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes rollRight {
          0% {
            left: -10vw;
          }
          100% {
            left: 110vw;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </>
  );
};

export default Clock;