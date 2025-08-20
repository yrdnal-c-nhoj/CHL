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
      position: 'relative', 
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
      filter: 'blur(2px) contrast(0.8) brightness(0.5) saturate(1.6)', // 👈 filter effect
      zIndex: 0, 
    },

 pendulum: {
  display: 'flex',
  borderStyle: 'solid',
  borderWidth: '1vw 1vw 3vw 1vw', // thicker bottom
  borderRadius: '3.25vw 3.25vw 0 0', // rounded top corners
  padding: '0 4.5vw 2.25vw',
  height: '26vw',
  zIndex: 1,
  borderImage: 'linear-gradient(145deg, #b08d57, #f6e27a, #b08d57, #8c6b32) 1',
  borderImageSlice: 1, // ensures the gradient slices evenly
  backgroundColor: 'transparent', // keeps inside open
  boxShadow: `
    inset 0 0.25vw 0.5vw rgba(255, 255, 255, 0.5),
    inset 0 -0.25vw 0.5vw rgba(0, 0, 0, 0.5)
  `,
}


,
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
          background: #F4F0DCFF;
          width: 2.25px;
          height: 18vw;
        }






  .piece::after {
    content: attr(data-digit);
    border-radius: 50%;
    width: 4.5vw;
    height: 4.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'CustomFont', monospace;
    font-size: 5vw;
    color: #31041DFF;

    /* Chrome metallic gradient */
    background: radial-gradient(circle at 30% 30%, #ffffff 0%, #d0d0d0 40%, #888888 60%, #4d4d4d 90%);
    
    /* Add a subtle inner glow for more metallic feel */
    box-shadow: inset -0.2vw -0.2vw 0.4vw rgba(255,255,255,0.6),
                inset 0.2vw 0.2vw 0.4vw rgba(0,0,0,0.4),
                0 0.2vw 0.4vw rgba(0,0,0,0.3);
    
    border: 0.1vw solid #aaa; /* subtle metallic edge */
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
