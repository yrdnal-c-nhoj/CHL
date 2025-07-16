import{r as u,j as t}from"./index-DqtFXLZd.js";const p="/assets/kal-DQp76bkx.ttf",h="/assets/7ZAx-C7-uerK_.webp",b=()=>{const r=["#ff0040","#00ffff","#ffff00","#00ff00","#ff8000","#ff00ff","#00bfff","#ffffff","#ffcc00","#ff66cc","#33ff33","#3399ff"],o=u.useRef([{hour:null,minute:null,second:null,hours:[],minutes:[],seconds:[],colorOffset:0},{hour:null,minute:null,second:null,hours:[],minutes:[],seconds:[],colorOffset:6}]);return u.useEffect(()=>{for(let n of o.current)for(let f=0;f<12;f++){const d=f*30,i=document.createElement("div");i.className="segment hour",i.style.transform=`rotate(${d}deg) translate(30vmin)`,n.hour.appendChild(i),n.hours.push(i);const c=document.createElement("div");c.className="segment minute",c.style.transform=`rotate(${d}deg) translate(20vmin)`,n.minute.appendChild(c),n.minutes.push(c);const l=document.createElement("div");l.className="segment second",l.style.transform=`rotate(${d}deg) translate(10vmin)`,n.second.appendChild(l),n.seconds.push(l)}const e=()=>{const n=new Date,f=n.getHours()%12||12,d=n.getMinutes(),i=n.getSeconds(),c=f.toString().padStart(2,"0"),l=d.toString().padStart(2,"0"),g=i.toString().padStart(2,"0");o.current.forEach((a,x)=>{for(let s=0;s<12;s++){const m=(s+i+a.colorOffset)%r.length;a.hours[s].textContent=c,a.hours[s].style.color=r[(m+2)%r.length],a.minutes[s].textContent=l,a.minutes[s].style.color=r[(m+4)%r.length],a.seconds[s].textContent=g,a.seconds[s].style.color=r[(m+6)%r.length]}}),requestAnimationFrame(e)};e()},[]),t.jsxs("div",{style:{margin:0,padding:0,background:"black",overflow:"hidden",height:"100vh",fontFamily:"kal"},children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'kal';
          src: url(${p}) format('truetype');
        }

        .kaleidoscope {
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.7;
        }

        .spin-cw {
          animation: spin-cw 60s linear infinite;
        }

        .spin-ccw {
          animation: spin-ccw 60s linear infinite;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
        }

        .segment {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          pointer-events: none;
          mix-blend-mode: screen;
          transition: color 1s;
          font-size: 9vmin;
        }

        .hour {
          transform-origin: 0 0;
        }

        .minute {
          transform-origin: 0 0;
          font-size: 7vmin;
        }

        .second {
          transform-origin: 0 0;
          font-size: 5.5vmin;
        }

        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .bgimage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url(${h});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          filter: brightness(50%);
          z-index: 1;
          pointer-events: none;
        }
      `}),t.jsx("div",{className:"bgimage"}),t.jsxs("div",{className:"kaleidoscope spin-cw",children:[t.jsx("div",{className:"ring",ref:e=>o.current[0].hour=e}),t.jsx("div",{className:"ring",ref:e=>o.current[0].minute=e}),t.jsx("div",{className:"ring",ref:e=>o.current[0].second=e})]}),t.jsxs("div",{className:"kaleidoscope spin-ccw",children:[t.jsx("div",{className:"ring",ref:e=>o.current[1].hour=e}),t.jsx("div",{className:"ring",ref:e=>o.current[1].minute=e}),t.jsx("div",{className:"ring",ref:e=>o.current[1].second=e})]})]})};export{b as default};
