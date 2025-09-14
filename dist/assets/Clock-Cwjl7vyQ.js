import{r as o,j as e}from"./index-CVcA385j.js";const w="/assets/Antarctica-DP3gd5jV.jpg",j=()=>{const c=o.useRef(null),r=o.useRef(null),a=o.useRef(null),i=o.useRef(null);return o.useEffect(()=>{const n=c.current;for(;n.firstChild;)n.removeChild(n.firstChild);for(let t=0;t<60;t++){const s=document.createElement("div");s.className="tick",t%5===0&&s.classList.add("major"),s.style.transform=`rotate(${t*6}deg)`,n.appendChild(s)}n.appendChild(r.current),n.appendChild(a.current),n.appendChild(i.current);const d=()=>{const t=new Date,s=t.getHours()%12,l=t.getMinutes(),h=t.getSeconds(),u=t.getMilliseconds(),g=s*30+l/2,m=l*6+h/10,f=h*6,v=u/1e3,p=f+v*6;r.current.style.transform=`translateX(-50%) rotate(${g}deg)`,a.current.style.transform=`translateX(-50%) rotate(${m}deg)`,i.current.style.transform=`translateX(-50%) rotate(${p}deg)`,requestAnimationFrame(d)};d()},[]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
            z-index: 0; /* changed from -1 */
            animation: slow-rotate 440s linear infinite;
            transform-origin: center center;
          }
        `}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100dvh",width:"100vw",margin:0,overflow:"hidden",position:"relative"},children:[e.jsx("img",{src:w,alt:"Antarctica",className:"bgimage"}),e.jsxs("div",{ref:c,className:"clock",style:{position:"relative",width:"50vh",height:"30vh",borderRadius:"50%",zIndex:1},children:[e.jsx("div",{className:"center"}),e.jsx("div",{ref:r,className:"hand hour-hand"}),e.jsx("div",{ref:a,className:"hand minute-hand"}),e.jsx("div",{ref:i,className:"hand second-hand"})]})]})]})};export{j as default};
