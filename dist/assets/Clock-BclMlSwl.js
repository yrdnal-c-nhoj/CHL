import{r as s,j as t}from"./index-CCm3oexO.js";const b="/assets/Antarctica-DP3gd5jV.jpg",j=()=>{const c=s.useRef(null),r=s.useRef(null),a=s.useRef(null),i=s.useRef(null);return s.useEffect(()=>{const o=c.current;for(let e=0;e<60;e++){const n=document.createElement("div");n.className="tick",e%5===0&&n.classList.add("major"),n.style.transform=`rotate(${e*6}deg)`,o.appendChild(n)}o.appendChild(r.current),o.appendChild(a.current),o.appendChild(i.current);const l=()=>{const e=new Date,n=e.getHours()%12,d=e.getMinutes(),h=e.getSeconds(),g=e.getMilliseconds(),m=n*30+d/2,f=d*6+h/10,v=h*6,u=g/1e3,p=v+(u<.3?u*12:0);r.current.style.transform=`translateX(-50%) rotate(${m}deg)`,a.current.style.transform=`translateX(-50%) rotate(${f}deg)`,i.current.style.transform=`translateX(-50%) rotate(${p}deg)`,requestAnimationFrame(l)};l()},[]),t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
          .tick {
            position: absolute;
            width: 0.1vw;
            height: 37.5vh;
            background-color: #b6eef6;
            top: 1.2vh;
            left: 50%;
            transform-origin: 50% 14.5vh;
          }

          .tick.major {
            height: 58vh;
            width: 0.1vw;
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom;
            background-color: #b3edf2;
          }

          .hour-hand {
            width: 3.7vw;
            height: 17vh;
          }

          .minute-hand {
            width: 2vw;
            height: 33vh;
          }

          .second-hand {
            width: 0.3vw;
            height: 100vh;
            background-color: rgb(72, 219, 242);
          }

          .center {
            position: absolute;
            width: 1.5vh;
            height: 1.5vh;
            background-color: #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          @keyframes slow-rotate {
            0% {
              transform: rotate(0deg) scale(1.5);
            }
            100% {
              transform: rotate(-360deg) scale(1.5);
            }
          }

          .bgimage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(0.4);
            z-index: -1;
            animation: slow-rotate 440s linear infinite;
            transform-origin: center center;
          }
        `}),t.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",margin:0,overflow:"hidden",position:"relative"},children:[t.jsx("img",{src:b,alt:"Antarctica",className:"bgimage"}),t.jsxs("div",{ref:c,className:"clock",style:{position:"relative",width:"50vh",height:"30vh",borderRadius:"50%"},children:[t.jsx("div",{className:"center"}),t.jsx("div",{ref:r,className:"hand hour-hand"}),t.jsx("div",{ref:a,className:"hand minute-hand"}),t.jsx("div",{ref:i,className:"hand second-hand"})]})]})]})};export{j as default};
