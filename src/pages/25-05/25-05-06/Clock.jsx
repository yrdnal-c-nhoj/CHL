import React, { useEffect, useRef } from 'react';

const googleFonts = [
  'Nabla', 'Kablammo',  'Modak', 'Oi', 
  'Bricolage Grotesque', 'Silkscreen', 
  'Flow Block', 'Bungee Spice', 'Creepster', 
  'Monoton', 'Rubik Puddles', 'Lakki Reddy', 'Metal Mania'
];

const UnrulyClock = () => {
  const digitRefs = useRef([]);
  const animations = ['rotate', 'scale', 'fade', 'bounce', 'skew'];

  const getRandomFont = () => googleFonts[Math.floor(Math.random() * googleFonts.length)];
  const getRandomSize = () => `${Math.floor(Math.random() * 6) + 3}rem`; // Slightly larger for impact
  const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
  const getRandomAnimation = () => animations[Math.floor(Math.random() * animations.length)];

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    const fontQuery = googleFonts.map(f => f.replace(/ /g, '+')).join('|');
    link.href = `https://fonts.googleapis.com/css?family=${fontQuery}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const digits = [...h, ...m, ...s];

      digits.forEach((val, i) => {
        const el = digitRefs.current[i];
        if (!el) return;

        // Update content and styles
        el.textContent = val;
        el.style.fontFamily = `'${getRandomFont()}', cursive`;
        el.style.fontSize = getRandomSize();
        el.style.color = getRandomColor();

        // Reset and trigger animation
        animations.forEach((anim) => el.classList.remove(anim));
        void el.offsetWidth; // Force reflow
        el.classList.add(getRandomAnimation());
      });
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => {
      clearInterval(interval);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="container">
      <style>{`
        .container {
          background: #1a1a1a;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }
        .clock-wrapper {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .clock-wrapper { flex-direction: column; gap: 1rem; }
        }
        .digit-group { display: flex; }
        .digit {
          width: 8rem;
          height: 8rem;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation-duration: 0.8s;
        }
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes scale { 50% { transform: scale(1.8); } }
        @keyframes fade { 50% { opacity: 0; } }
        @keyframes bounce { 40% { transform: translateY(-30px); } 60% { transform: translateY(-15px); } }
        @keyframes skew { 50% { transform: skewX(40deg); } }
        
        .rotate { animation-name: rotate; }
        .scale { animation-name: scale; }
        .fade { animation-name: fade; }
        .bounce { animation-name: bounce; }
        .skew { animation-name: skew; }
      `}</style>

      <div className="clock-wrapper">
        {[0, 1, 2].map((gIdx) => (
          <div key={gIdx} className="digit-group">
            {[0, 1].map((i) => (
              <div
                key={i}
                ref={(el) => (digitRefs.current[gIdx * 2 + i] = el)}
                className="digit"
              >
                0
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnrulyClock;