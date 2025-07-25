import React, { useEffect, useRef } from 'react';
import bgImage from './bg.webp'; // replace with your actual image file

const EmojiAnalogClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const hourNumbers = ['🎄', '🥇', '✌️', '🎶', '🍀', '⭐', '🀞', '🎰', '🎱', '🐈', '🎯', '⏸️'];

    function drawClock() {
      const radius = canvas.width / 2;
      const now = new Date();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);

      // Clock face
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
      ctx.fillStyle = '#6A7A82FF';
      ctx.fill();
      ctx.strokeStyle = '#738282';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hour markers
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -radius * 0.75);
        ctx.rotate(-angle);
        ctx.font = `${radius * 0.2}px Times New Roman`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(hourNumbers[i], 0, 0);
        ctx.restore();
      }

      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();

      // Hour hand
      ctx.save();
      ctx.rotate((hours + minutes / 60 + seconds / 3600) * 30 * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * 0.4);
      ctx.lineWidth = 0.6 * radius * 0.1;
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.restore();

      // Minute hand
      ctx.save();
      ctx.rotate((minutes + seconds / 60 + ms / 60000) * 6 * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * 0.6);
      ctx.lineWidth = 0.3 * radius * 0.1;
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.restore();

      // Second hand
      ctx.save();
      ctx.rotate((seconds + ms / 1000) * 6 * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * 0.9);
      ctx.lineWidth = 0.1 * radius * 0.1;
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.restore();
      animationFrame = requestAnimationFrame(drawClock);
    }

    animationFrame = requestAnimationFrame(drawClock);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Monofett&family=Nanum+Gothic+Coding:wght@400;700&family=Oxanium:wght@200..800&family=Roboto+Slab:wght@100..900&display=swap');
        `}
      </style>

      <img src={bgImage} alt="background" style={styles.bg} />

      <div style={styles.titleContainer}>
        <div style={styles.chltitle}>Cubist Heart Laboratories</div>
        <div style={styles.bttitle}>BorrowedTime</div>
      </div>

      <div style={styles.dateContainer}>
        <a href="../baybayin/" style={styles.dateLeft}>07/23/25</a>
        <a href="../index.html" style={styles.clockname}>Emojis</a>
        <a href="../index.html" style={styles.dateRight}>07/25/25</a>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={styles.canvas}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A7A82FF',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '110%',
    objectFit: 'cover',
    zIndex: -1,
    filter: 'contrast(90%) hue-rotate(-190deg)',
  },
  canvas: {
    border: '0.1rem solid #707c7c',
    borderRadius: '50%',
    backgroundColor: '#738282',
    zIndex: 1,
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
  titleContainer: {
    position: 'absolute',
    top: '1vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
    color: '#646461',
    textShadow: '#dddad6 1px 0px',
  },
  chltitle: {
    fontFamily: '"Roboto Slab", serif',
    fontSize: '2.8vh',
    position: 'absolute',
    top: '0.5vh',
    right: '1vw',
    letterSpacing: '0.1vh',
  },
  bttitle: {
    position: 'relative',
    left: '0',
    fontFamily: '"Oxanium", serif',
    fontSize: '2.8vh',
    fontStyle: 'italic',
    zIndex: 15,
    letterSpacing: '-0.1vh',
  },
  dateContainer: {
    position: 'absolute',
    bottom: '1vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
  },
  dateLeft: {
    fontSize: '3vh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'relative',
    left: 0,
    textDecoration: 'none',
    color: 'inherit',
  },
  dateRight: {
    fontSize: '3vh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'absolute',
    right: 0,
    textDecoration: 'none',
    color: 'inherit',
  },
  clockname: {
    fontFamily: '"Oxanium", serif',
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '4vh',
    lineHeight: '4vh',
    color: 'inherit',
    textDecoration: 'none',
  },
};

export default EmojiAnalogClock;
