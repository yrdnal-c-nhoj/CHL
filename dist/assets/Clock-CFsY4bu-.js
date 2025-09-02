import{r as d,j as n}from"./index-CtpJRlFd.js";const q=()=>{const r=d.useRef(null),c=()=>{const t=r.current;t&&(t.width=window.innerWidth,t.height=window.innerHeight)};return d.useEffect(()=>(c(),window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)),[]),d.useEffect(()=>{const t=r.current;if(!t)return;const o=t.getContext("2d"),b=["cyan","magenta","yellow"],h=()=>{const s=new Date,j=s.getMilliseconds(),l=s.getSeconds()+j/1e3,m=s.getMinutes()+l/60,k=s.getHours()%12+m/60,u=l/60*360,g=m/60*360,f=k/12*360,M=(u-90)*Math.PI/180,P=(g-90)*Math.PI/180,z=(f-90)*Math.PI/180,w=t.width/2,v=t.height/2,R=Math.max(t.width,t.height)*.7;o.clearRect(0,0,t.width,t.height);const a=[M,P,z].map(e=>(e+2*Math.PI)%(2*Math.PI)).sort((e,i)=>e-i);for(let e=0;e<3;e++){const i=a[e],E=a[(e+1)%3]<=i?a[(e+1)%3]+2*Math.PI:a[(e+1)%3];o.beginPath(),o.moveTo(w,v),o.arc(w,v,R,i,E),o.closePath(),o.fillStyle=b[e],o.fill()}const x=document.querySelector(".second-hand"),y=document.querySelector(".minute-hand"),p=document.querySelector(".hour-hand");x&&(x.style.transform=`translateX(-50%) rotate(${u}deg)`),y&&(y.style.transform=`translateX(-50%) rotate(${g}deg)`),p&&(p.style.transform=`translateX(-50%) rotate(${f}deg)`),requestAnimationFrame(h)};requestAnimationFrame(h)},[]),n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background: black;
        }

        .clock {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: block;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background-color: rgb(6, 0, 0);
          z-index: 2;
        }

        .hour-hand {
          width: 1rem;
          height: 230vh;
        }

        .minute-hand {
          width: 0.6rem;
          height: 240vh;
        }

        .second-hand {
          width: 0.3rem;
          height: 245vh;
        }

        .date-container {
          color: rgb(168, 154, 154);
          position: absolute;
          bottom: 0.5vh;
          left: 50%;
          transform: translateX(-50%);
          width: 98vw;
          display: flex;
          justify-content: center;
          font-size: 1.2rem;
          z-index: 6;
        }
      `}),n.jsxs("div",{className:"clock",children:[n.jsx("canvas",{ref:r}),n.jsx("div",{className:"hand hour-hand"}),n.jsx("div",{className:"hand minute-hand"}),n.jsx("div",{className:"hand second-hand"}),n.jsx("div",{className:"date-container",children:" "})]})]})};export{q as default};
