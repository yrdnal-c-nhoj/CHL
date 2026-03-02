import React, { useEffect, useRef } from 'react';

const Clock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const clearColor = 'rgba(0, 0, 0, .1)';
    const max = 30;
    const drops = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function O() {}

    O.prototype = {
      init: function() {
        this.x = random(0, w);
        this.y = 0;
        this.color = 'hsl(180, 100%, 50%)';
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * .8, h * .9);
        this.a = 1;
        this.va = .96;
      },
      draw: function() {
        if (this.y > this.hit) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.h / 2);

          ctx.bezierCurveTo(
            this.x + this.w / 2, this.y - this.h / 2,
            this.x + this.w / 2, this.y + this.h / 2,
            this.x, this.y + this.h / 2);

          ctx.bezierCurveTo(
            this.x - this.w / 2, this.y + this.h / 2,
            this.x - this.w / 2, this.y - this.h / 2,
            this.x, this.y - this.h / 2);

          ctx.strokeStyle = 'hsla(180, 100%, 50%, '+this.a+')';
          ctx.stroke();
          ctx.closePath();
          
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }
        this.update();
      },
      update: function() {
        if(this.y < this.hit){
          this.y += this.vy;
        } else {
          if(this.a > .03){
            this.w += this.vw;
            this.h += this.vh;
            if(this.w > 100){
              this.a *= this.va;
              this.vw *= .98;
              this.vh *= .98;
            }
          } else {
            this.init();
          }
        }
      }
    }

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function setup(){
      for(let i = 0; i < max; i++){
        (function(j){
          setTimeout(function(){
            const o = new O();
            o.init();
            drops.push(o);
          }, j * 200)
        }(i));
      }
    }

    function anim() {
      ctx.fillStyle = clearColor;
      ctx.fillRect(0,0,w,h);
      for(let i in drops){
        drops[i].draw();
      }
      requestAnimationFrame(anim);
    }

    window.addEventListener("resize", resize);
    setup();
    anim();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        id="canvas-club"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        fontSize: '4rem',
        fontFamily: 'monospace',
        textAlign: 'center',
        padding: '20px 40px',
        borderRadius: '10px',
        zIndex: 10
      }}>
        26-03-03
      </div>
    </div>
  );
};

export default Clock;
