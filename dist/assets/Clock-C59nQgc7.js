import{r as s,j as n}from"./index-CB5Z5zkF.js";const T="/assets/orb-CYB_IVAf.ttf",e={hourTick:"#ff00ff",minuteTick:"#ffff00",number:"#00ffff",hourHand:"#32a6c3",minuteHand:"#00ff90",secondHand:"#FD02C3FF",background:"#000",clockBorder:"#0ff",centerDot:"#ff00ff",centerDotGradient:"#800080"},t={clock:"clamp(30vw, 50vh, 80vh)",hourHand:{width:"0.6rem",height:"5rem"},minuteHand:{width:"0.4rem",height:"7rem"},secondHand:{width:"0.3rem",height:"8.5rem"},centerDot:"1.6rem",hourTick:{width:"0.5rem",height:"2rem"},minuteTick:{width:"0.3rem",height:"1rem"},number:{width:"2rem",height:"2rem",fontSize:"1.9rem"}},v=()=>{const w=s.useRef(null),g=s.useRef([]),k=s.useRef(-1),u=s.useRef(null);s.useEffect(()=>{let c;const o=()=>{const r=new Date,d=r.getMilliseconds(),i=r.getSeconds()+d/1e3,a=r.getMinutes()+i/60,m=r.getHours()+a/60,h=document.getElementById("hour"),$=document.getElementById("minute"),b=document.getElementById("second");h&&$&&b&&(h.style.transform=`translateX(-50%) rotate(${m%12*30}deg)`,$.style.transform=`translateX(-50%) rotate(${a*6}deg)`,b.style.transform=`translateX(-50%) rotate(${i*6}deg)`),u.current&&(u.current.textContent=r.toLocaleTimeString());const f=Math.floor(i)%60;if(k.current!==f){const l=g.current[f];l&&!l.classList.contains("glow")&&(l.classList.add("glow"),setTimeout(()=>l.classList.remove("glow"),4e3)),k.current=f}c=requestAnimationFrame(o)};return c=requestAnimationFrame(o),()=>cancelAnimationFrame(c)},[]);const p=s.useMemo(()=>Array.from({length:60}).map((c,o)=>{const r=o*6-90,d=r*Math.PI/180,i=50+45*Math.cos(d),a=50+45*Math.sin(d),m=o%5===0;return n.jsx("div",{ref:h=>g.current[o]=h,className:`tick ${m?"hour-tick":"minute-tick"}`,style:{position:"absolute",top:`${a}%`,left:`${i}%`,transform:`translate(-50%, -50%) rotate(${r+90}deg)`}},o)}),[]),x=s.useMemo(()=>Array.from({length:12}).map((c,o)=>{const r=o+1,i=(r*30-90)*Math.PI/180,a=50+39*Math.cos(i),m=50+39*Math.sin(i);return n.jsx("div",{className:"number",style:{position:"absolute",top:`${m}%`,left:`${a}%`,transform:"translate(-50%, -50%)"},children:r},r)}),[]);return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
          @font-face {
            font-family: 'Orb';
            src: url(${T}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          .neon-clock {
            width: 100vw;
            height: 100dvh;
            background-color: ${e.background};
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .clock-container {
            width: ${t.clock};
            height: ${t.clock};
            aspect-ratio: 1 / 1;
            position: relative;
            font-family: 'Orb', sans-serif;
          }

          .clock-face {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle at center, #111 30%, ${e.background} 100%);
            box-shadow: 0 0 4rem ${e.number}, 0 0 9rem ${e.hourTick}, 0 0 16rem ${e.number},
                        inset 0 0 3rem ${e.number}, inset 0 0 8rem ${e.hourTick};
            border: 0.4rem solid ${e.clockBorder};
            filter: drop-shadow(0 0 2rem ${e.clockBorder}) drop-shadow(0 0 3rem ${e.hourTick});
          }

          .center-dot {
            width: ${t.centerDot};
            height: ${t.centerDot};
            background: radial-gradient(circle, ${e.centerDot}, ${e.centerDotGradient});
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            box-shadow: 0 0 1.5rem ${e.centerDot}, 0 0 3rem ${e.centerDot}, 0 0 6rem ${e.centerDot},
                        inset 0 0 1rem ${e.centerDot};
            z-index: 10;
          }

          .pulse {
            animation: neon-pulse 2s infinite ease-in-out;
          }

          @keyframes neon-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            border-radius: 1rem;
            transition: transform 0.05s linear;
          }

          .hour-hand {
            width: ${t.hourHand.width};
            height: ${t.hourHand.height};
            background: ${e.hourHand};
            z-index: 4;
          }

          .minute-hand {
            width: ${t.minuteHand.width};
            height: ${t.minuteHand.height};
            background: ${e.minuteHand};
            z-index: 3;
          }

          .second-hand {
            width: ${t.secondHand.width};
            height: ${t.secondHand.height};
            background: ${e.secondHand};
            z-index: 2;
            will-change: transform;
            backface-visibility: hidden;
          }

          .tick {
            position: absolute;
            border-radius: 0.3rem;
            transition: transform 5s ease, box-shadow 0.3s ease;
          }

          .hour-tick {
            width: ${t.hourTick.width};
            height: ${t.hourTick.height};
            background: ${e.hourTick};
            box-shadow: 0 0 1rem ${e.hourTick}, 0 0 2rem ${e.hourTick}, 0 0 3rem ${e.hourTick};
          }

          .minute-tick {
            width: ${t.minuteTick.width};
            height: ${t.minuteTick.height};
            background: ${e.minuteTick};
            box-shadow: 0 0 0.6rem ${e.minuteTick}, 0 0 1rem ${e.minuteTick}, 0 0 2rem ${e.minuteTick};
          }

          .glow {
            box-shadow: 0 0 1.5rem ${e.minuteTick}, 0 0 3rem ${e.minuteTick}, 0 0 6rem ${e.minuteTick} !important;
          }

          .number {
            position: absolute;
            width: ${t.number.width};
            height: ${t.number.height};
            text-align: center;
            line-height: ${t.number.height};
            color: ${e.number};
            font-size: ${t.number.fontSize};
            font-family: 'Orb', sans-serif;
            text-shadow: 0 0 0.5rem ${e.number}, 0 0 1rem ${e.number}, 0 0 1.5rem ${e.number};
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
          }

          @media (prefers-reduced-motion: reduce) {
            .pulse {
              animation: none;
            }
          }
        `}),n.jsx("div",{className:"neon-clock",role:"img","aria-label":"Analog neon clock displaying the current time",children:n.jsx("div",{className:"clock-container",children:n.jsxs("div",{ref:w,className:"clock-face",children:[n.jsx("div",{className:"pulse center-dot"}),n.jsx("div",{id:"hour",className:"hand hour-hand"}),n.jsx("div",{id:"minute",className:"hand minute-hand"}),n.jsx("div",{id:"second",className:"hand second-hand"}),p,x,n.jsx("div",{className:"sr-only","aria-live":"polite",ref:u,children:new Date().toLocaleTimeString()})]})})})]})};export{v as default};
