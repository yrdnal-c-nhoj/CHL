import{r as n,j as c}from"./index-CZtQCcTu.js";const E="/assets/Stick-0Anm3UOf.ttf",T=()=>{const f=n.useRef(null),[l,x]=n.useState({digits:["0","0","0","0"],colors:["white","white","white","white"]}),[m,v]=n.useState(0),[S,y]=n.useState(1),u=n.useRef(0),k=n.useRef(1),g=n.useRef("white"),p=()=>`hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;return n.useEffect(()=>{const s=f.current,t=s.getContext("2d"),h=()=>{s.width=window.innerWidth,s.height=window.innerHeight},d=()=>{const e=new Date;let r=e.getHours()%12;r===0&&(r=12);const a=String(e.getMinutes()).padStart(2,"0"),o=`${r}${a}`.padStart(4,"0").split(""),i=o.map(()=>p());x({digits:o,colors:i}),g.current=p(),u.current=(Math.random()-.5)*500,k.current=.6+Math.random()*.8},M=()=>{t.fillStyle="rgba(0, 0, 0, 0.04)",t.fillRect(0,0,s.width,s.height),t.save(),t.font=`${s.height*.2}px 'skew-stick', sans-serif`,t.textBaseline="middle",t.textAlign="center";const e=s.width*.15,r=s.width/2,a=s.height/2;l.digits.forEach((o,i)=>{const C=r+(i-1.5)*e+(Math.random()-.5)*10,b=a+(Math.random()-.5)*10;t.setTransform(S,m*.01,m*.01,1,C,b),t.strokeStyle=g.current,t.lineWidth=.5*s.height*.01,t.strokeText(o,0,0),t.fillStyle=l.colors[i]||"white",t.fillText(o,0,0)}),t.restore()},w=()=>{v(e=>e+(u.current-e)*.1),y(e=>e+(k.current-e)*.1),M(),requestAnimationFrame(w)},R=()=>{const e=document.querySelector(".skew-time-container");if(e){const r=Math.random()*360,a=Math.random()*360,o=Math.random()*360;e.style.transform=`translate(-50%, -50%) rotateX(${r}deg) rotateY(${a}deg) rotateZ(${o}deg)`}};h(),window.addEventListener("resize",h),document.fonts.load("1rem 'skew-stick'").then(()=>{d(),w()}).catch(()=>{console.warn("Font failed to load"),d(),w()});const $=setInterval(d,1e3),j=setInterval(R,5e3);return()=>{clearInterval($),clearInterval(j),window.removeEventListener("resize",h)}},[l]),c.jsxs("div",{className:"skew-wrapper",style:{fontFamily:"skew-stick, sans-serif"},children:[c.jsx("style",{children:`
        @font-face {
          font-family: 'skew-stick';
          src: url(${E}) format('truetype');
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
      `}),c.jsx("div",{className:"skew-time-container"}),c.jsx("canvas",{ref:f})]})};export{T as default};
