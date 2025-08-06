import{r as n,j as c}from"./index-IRhd_y07.js";const A="/assets/Stick-0Anm3UOf.ttf",I=()=>{const w=n.useRef(null),[g,x]=n.useState(["0","0","0","0"]),[v,S]=n.useState(["white","white","white","white"]),[f,y]=n.useState(0),[C,b]=n.useState(1),u=n.useRef(0),m=n.useRef(1),k=n.useRef("white"),p=()=>`hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;return n.useEffect(()=>{const s=w.current,t=s.getContext("2d"),l=()=>{s.width=window.innerWidth,s.height=window.innerHeight},h=()=>{const e=new Date;let r=e.getHours()%12;r===0&&(r=12);const a=String(e.getMinutes()).padStart(2,"0"),o=`${r}${a}`.padStart(4,"0").split(""),i=o.map(()=>p());x(o),S(i),k.current=p(),u.current=(Math.random()-.5)*500,m.current=.6+Math.random()*.8},M=()=>{t.save(),t.globalAlpha=.1,t.fillStyle="black",t.fillRect(0,0,s.width,s.height),t.globalAlpha=1,t.font=`${s.height*.2}px 'skew-stick', sans-serif`,t.textBaseline="middle",t.textAlign="center";const e=s.width*.15,r=s.width/2,a=s.height/2;g.forEach((o,i)=>{const E=r+(i-1.5)*e,z=a;t.setTransform(C,f*.01,f*.01,1,E,z),t.strokeStyle=k.current,t.lineWidth=.5*s.height*.01,t.strokeText(o,0,0),t.fillStyle=v[i]||"white",t.fillText(o,0,0)}),t.restore()},d=()=>{y(e=>e+(u.current-e)*.1),b(e=>e+(m.current-e)*.1),M(),requestAnimationFrame(d)},R=()=>{const e=document.querySelector(".skew-time-container");if(e){const r=Math.random()*360,a=Math.random()*360,o=Math.random()*360;e.style.transform=`translate(-50%, -50%) rotateX(${r}deg) rotateY(${a}deg) rotateZ(${o}deg)`}};l(),window.addEventListener("resize",l),document.fonts.load("1rem 'skew-stick'").then(()=>{h(),d()}).catch(()=>{console.warn("Font failed to load"),h(),d()});const $=setInterval(h,1e3),j=setInterval(R,5e3);return()=>{clearInterval($),clearInterval(j),window.removeEventListener("resize",l)}},[]),c.jsxs("div",{className:"skew-wrapper",style:{fontFamily:"skew-stick, sans-serif"},children:[c.jsx("style",{children:`
        @font-face {
          font-family: 'skew-stick';
          src: url(${A}) format('truetype');
        }

        .skew-wrapper, .skew-wrapper * {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .skew-wrapper {
          background: black;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }

        .skew-time-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          transition: transform 0.5s ease;
        }
      `}),c.jsx("div",{className:"skew-time-container"}),c.jsx("canvas",{ref:w})]})};export{I as default};
