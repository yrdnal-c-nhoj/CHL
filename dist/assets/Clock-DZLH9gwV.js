import{r as C,j as m}from"./index-Bshzq55w.js";const E="/assets/rrrr-CXJN-tKg.ttf",N=()=>(C.useEffect(()=>{const b=document.getElementById("ticker"),k=40,c=window.innerWidth;function h(){const r=document.createElement("div");r.className="clock-container",r.style.left=c+"px";const o=document.createElement("div");o.className="clock";for(let t=1;t<=12;t++){const n=document.createElement("div");n.className="number",n.innerText=t;const e=(t-3)*30*(Math.PI/180),a=40,s=50+a*Math.cos(e),p=50+a*Math.sin(e);n.style.left=`${s}%`,n.style.top=`${p}%`,n.style.transform=`translate(-50%, -50%) rotate(${(t-3)*30}deg)`,o.appendChild(n)}const i=document.createElement("div");i.className="hand hour";const d=document.createElement("div");d.className="hand minute";const l=document.createElement("div");l.className="hand";const u=document.createElement("div");u.className="center-dot",o.appendChild(i),o.appendChild(d),o.appendChild(l),o.appendChild(u),r.appendChild(o),b.appendChild(r);function f(){const t=new Date,n=t.getTime()+t.getTimezoneOffset()*6e4,e=new Date(n-4*36e5),a=e.getSeconds(),s=e.getMinutes(),p=e.getHours();l.style.transform=`rotate(${a*6}deg)`,d.style.transform=`rotate(${s*6+a*.1}deg)`,i.style.transform=`rotate(${p%12*30+s*.5}deg)`}f(),setInterval(f,1e3);const g=300,w=c+g+100,y=performance.now();function x(t){const e=(t-y)/2e3*k,a=-(e/(Math.PI*g))*360;r.style.left=`${c-e}px`,r.style.transform=`translateY(-50%) rotate(${a}deg)`,e<w?requestAnimationFrame(x):r.remove()}requestAnimationFrame(x)}h();const v=setInterval(h,3500);return()=>clearInterval(v)},[]),m.jsxs("div",{style:$.wrapper,children:[m.jsx("style",{children:`
        @font-face {
          font-family: 'rrrr';
          src: url(${E}) format('truetype');
        }

        #ticker {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100vw;
          height: 100vh;
          transform: translateY(-50%);
        }

        .clock-container {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
        }

        .clock {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .number {
          position: absolute;
          font-family: 'rrrr', sans-serif;
          font-size: 1.2rem;
          color: #C9F7E3FF;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          background: white;
          border-radius: 0.5rem;
        }

        .hand.hour {
          height: 60px;
          width: 8px;
          background: green;
        }

        .hand.minute {
          height: 90px;
          width: 6px;
          background: blue;
        }

        .hand {
          height: 600px;
          width: 2px;
          background: cyan;
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 19px;
          height: 19px;
          background: black;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      `}),m.jsx("div",{id:"ticker"})]})),$={wrapper:{overflow:"hidden",margin:0,padding:0,height:"100vh",width:"100vw",backgroundImage:"radial-gradient(#301e01 11px, transparent 11px), radial-gradient(#301e01 11px, transparent 11px)",backgroundSize:"56px 56px",backgroundPosition:"0 0, 28px 28px",backgroundColor:"#4b1a03",position:"relative",fontFamily:"'rrrr', sans-serif"}};export{N as default};
