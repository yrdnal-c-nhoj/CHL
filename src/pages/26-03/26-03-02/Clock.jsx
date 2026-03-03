import React, { useEffect, useRef } from 'react';

const RainCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const drops = [];
    const ripples = [];
    const dropCount = 150;
    const horizon = window.innerHeight * 0.5; 
    
    // Unified color for both rain and ripples
    const themeColor = "14, 9, 24"; 

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Drop {
      constructor() { this.init(); }
      init() {
        this.z = Math.random(); 
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height; 
        
        // SLOWED DOWN: Reduced from (z * 10) + 5 to (z * 4) + 2
        this.speed = (this.z * 4) + 2;
        this.length = (this.z * 15) + 5;
        this.targetY = horizon + (this.z * (canvas.height - horizon));
      }

      draw() {
        // DARK RAIN: Using the themeColor
        ctx.strokeStyle = `rgba(${themeColor}, ${this.z * 0.6})`;
        ctx.lineWidth = this.z * 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }

      update() {
        this.y += this.speed;
        if (this.y > this.targetY) {
          ripples.push(new Ripple(this.x, this.targetY, this.z));
          this.init();
        }
      }
    }

    class Ripple {
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = 1;
        this.opacity = 0.9; // Higher initial opacity for visibility
        // SLOWED DOWN: Reduced growth for better visibility
        this.growth = (z * 0.2) + 0.05;
        // SLOWER DECAY: Ripples last longer
        this.decay = (z * 0.002) + 0.001; 
      }

      draw() {
        ctx.strokeStyle = `rgba(${themeColor}, ${this.opacity})`;
        ctx.lineWidth = this.z * 2; // Thicker lines for more prominence
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.r * 2, this.r * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      update() {
        this.r += this.growth;
        this.opacity -= this.decay;
      }
    }

    for (let i = 0; i < dropCount; i++) drops.push(new Drop());

    const render = () => {
      // Background color
      ctx.fillStyle = 'rgb(219, 204, 153)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples.sort((a, b) => a.z - b.z);

      drops.forEach(drop => { drop.update(); drop.draw(); });
      
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].opacity <= 0) ripples.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'block', background: '#0D151D', width: '100vw', height: '100vh' }} 
    />
  );
};

export default RainCanvas;