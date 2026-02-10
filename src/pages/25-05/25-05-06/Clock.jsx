import React, { useEffect, useRef } from 'react';

const googleFonts = [
  'Kablammo', 'Oi', 'Ballet', 'Stalinist One', 'Silkscreen', 'Creepster', 
  'Monoton', 'Rubik Beastly', 'Lakki Reddy', 'Metal Mania', 
  'Kumar One Outline', 'Rye', 'Nosifer', 'Caesar Dressing', 'Moo Lah Lah', 'Danfo'
];

const UnrulyClock = () => {
  const digitRefs = useRef([]);
  // Added 'shake' to the behavior list
  const animations = ['bounce', 'skew', 'skew2', 'rotate', 'rotateRev', 'scale', 'scale2', 'shake'];

  useEffect(() => {
    const link = document.createElement('link');
    const fontQuery = googleFonts.map(f => `family=${f.replace(/ /g, '+')}`).join('&');
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const updateClock = () => {
      const now = new Date();
      const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join('');

      [...timeStr].forEach((val, i) => {
        const el = digitRefs.current[i];
        if (!el) return;
        
        // Randomize Appearance
        el.textContent = val;
        el.style.fontFamily = `'${googleFonts[Math.floor(Math.random() * googleFonts.length)]}', cursive`;
        el.style.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
        
        // Trigger Animation
        el.classList.remove(...animations);
        void el.offsetWidth; // Force reflow to restart animation
        el.classList.add(animations[Math.floor(Math.random() * animations.length)]);
      });
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => {
      clearInterval(interval);
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="container">
      <style>{`
        .container {
          background: #000;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          overflow: hidden;
        }

        /* Desktop: 6 columns across */
        .clock-wrapper {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          padding: 20px;
          justify-items: center;
          align-items: center;
        }

        .digit {
          width: 12vw;
          height: 12vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15vw;
          line-height: 1;
          transition: color 0.3s ease;
        }

        /* Phone: 3 rows of 2 (2x3 grid) */
        @media (max-width: 600px) {
          .clock-wrapper {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 2rem;
            width: 90vw;
            height: 80vh;
          }
          .digit {
            width: 40vw;
            height: 20vh;
            font-size: 35vw;
          }
        }

        /* Keyframes */
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes counterRotate { to { transform: rotate(-360deg); } }
        @keyframes scaleUp { 50% { transform: scale(2.5); } }
        @keyframes scaleDown { 50% { transform: scale(0.2); } }
        @keyframes bounce { 50% { transform: translateY(-80px); } }
        @keyframes skewLeft { 50% { transform: skewX(50deg); } }
        @keyframes skewRight { 50% { transform: skewX(-50deg); } }
        
        /* New Shake Animation */
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .rotate { animation: rotate 0.6s ease-in-out; }
        .rotateRev { animation: counterRotate 0.6s ease-in-out; }
        .scale { animation: scaleUp 0.6s ease-in-out; }
        .scale2 { animation: scaleDown 0.6s ease-in-out; }
        .bounce { animation: bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .skew { animation: skewLeft 0.6s ease-in-out; }
        .skew2 { animation: skewRight 0.6s ease-in-out; }
        .shake { animation: shake 0.5s linear infinite; }
      `}</style>

      <div className="clock-wrapper">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={el => (digitRefs.current[i] = el)}
            className="digit"
          >
            0
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnrulyClock;