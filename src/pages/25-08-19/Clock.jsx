import React, { useEffect } from 'react';
import fontUrl from './cas.ttf';
import bgUrl from './ap.jpeg';

const Pendulum = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${fontUrl}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

    const updateTimeOnBalls = () => {
      const now = new Date();
      let hours = now.getHours();
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeString = `${hours}${minutes}${seconds}`;
      const pieces = document.querySelectorAll('.piece');
      pieces.forEach((piece, index) => {
        piece.setAttribute('data-digit', timeString[index]);
      });
    };
    updateTimeOnBalls();
    const interval = setInterval(updateTimeOnBalls, 1000);
    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  const styles = {
    pendulumApp: {
      height: '100vh',
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative', // ✅ allows bgLayer to stay inside
      overflow: 'hidden',
    },
    bgLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `url(${bgUrl}) no-repeat center center fixed`,
      backgroundSize: 'cover',
      filter: 'blur(6px) brightness(0.8)', // 👈 filter effect
      zIndex: 0, // ✅ keep visible
    },
    pendulum: {
      display: 'flex',
      border: '8.25px solid #574503FF',
      borderBottomWidth: '2.25vw',
      borderRadius: '3.25vw 3.25vw 0 0',
      padding: '0 4.5vw 2.25vw',
      height: '22.5vw',
      zIndex: 1, // ✅ ensures pendulum sits above bgLayer
    },
    piece: {
      transformOrigin: 'center top',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: '4.5vw',
      height: '22.5vw',
    },
    pieceFirstChild: {
      animation: 'left 1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite alternate',
    },
    pieceLastChild: {
      animation: 'right 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite alternate',
    },
  };

  return (
    <div style={styles.pendulumApp}>
      {/* ✅ filtered background layer */}
      <div style={styles.bgLayer}></div>

      <style>{`
        @keyframes left {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(45deg); }
        }
        @keyframes right {
          0% { transform: rotate(-45deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .piece::before {
          content: "";
          background: #232123FF;
          width: 2.25px;
          height: 18vw;
        }
        .piece::after {
          content: attr(data-digit);
          border-radius: 100%;
          background: white;
          width: 4.5vw;
          height: 4.5vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'CustomFont', monospace;
          font-size: 5vw;
          color: #6B040BFF;
        }
      `}</style>

      <div style={styles.pendulum}>
        <div style={{ ...styles.piece, ...styles.pieceFirstChild }} className="piece"></div>
        <div style={styles.piece} className="piece"></div>
        <div style={styles.piece} className="piece"></div>
        <div style={styles.piece} className="piece"></div>
        <div style={styles.piece} className="piece"></div>
        <div style={{ ...styles.piece, ...styles.pieceLastChild }} className="piece"></div>
      </div>
    </div>
  );
};

export default Pendulum;
