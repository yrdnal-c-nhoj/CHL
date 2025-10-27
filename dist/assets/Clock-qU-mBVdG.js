import{r as c,j as d}from"./index-CxO71aJe.js";const k="/assets/Michroma-CAi-HuEq.ttf",v="/assets/Economica-Dq7gNelE.ttf",$="/assets/Questrial-C8uSKUik.ttf",y=["'michroma'","'economica'","'questrial'"],o=(r,e)=>Math.floor(Math.random()*(e-r+1)+r),x=(r,e,s)=>`rgb(${255-r}, ${255-e}, ${255-s})`,u=()=>new Date().toLocaleTimeString("en-US",{hour12:!1}),C=(r,e)=>{let s=0;const n=o(90,255),a=o(1,255),m=o(1,200),l=`rgb(${n},${a},${m})`,i=x(n,a,m);for(let f=0;f<r.length;f++){const t=document.createElement("span"),g=o(0,100),w=o(1,12),p=w>=7?1500:900,Y=o(0,100);t.textContent=r[f],t.style.position="absolute",t.style.left=`${g}vw`,t.style.top=`${Y}vh`,t.style.fontSize=`${w}rem`,t.style.fontFamily=y[f%y.length],t.style.animationDuration=`${p}ms`,t.style.color=l,t.style.textShadow=`0.5rem 0.5rem 0 ${i}`,t.id=`letter-${s++}`,t.className=`an-${o(1,6)}`,e.current.appendChild(t),setTimeout(()=>{t.style.transition="opacity 5s, transform 5s",t.style.opacity="0",t.style.transform+=" scale(0.5)",setTimeout(()=>t.remove(),2e3)},3e4)}if(e.current.children.length>300)for(;e.current.children.length>150;)e.current.removeChild(e.current.firstChild)},T=()=>{const r=c.useRef(null),[e,s]=c.useState(u());return c.useEffect(()=>{const n=`
      @font-face {
        font-family: 'michroma';
        src: url(${k}) format('truetype');
      }
      @font-face {
        font-family: 'economica';
        src: url(${v}) format('truetype');
      }
      @font-face {
        font-family: 'questrial';
        src: url(${$}) format('truetype');
      }
    `,a=document.createElement("style");a.innerHTML=n,document.head.appendChild(a);const m=setInterval(()=>{s(u())},1e3);let l;const i=()=>{C(u(),r),l=setTimeout(()=>requestAnimationFrame(i),2e3)};return i(),()=>{clearTimeout(l),clearInterval(m),document.head.removeChild(a)}},[]),d.jsxs("div",{style:h.body,children:[d.jsx("div",{style:h.stationaryClock,children:e}),d.jsx("div",{ref:r,style:h.throw}),d.jsx("style",{children:b})]})},h={body:{height:"100dvh",width:"100vw",margin:0,overflow:"hidden",background:"linear-gradient(180deg, #f50ae1 0%, #ed5e0b 100%)",position:"relative"},throw:{position:"absolute",top:0,right:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"hidden",zIndex:1},stationaryClock:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",fontSize:"12vw",fontFamily:"Courier New",color:"rgba(255, 255, 255, 0.08)",zIndex:0,pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap"}},b=`
  .an-1 {
    animation: throw-1-up 1200ms ease-out forwards, throw-1-down 750ms 1200ms ease-in forwards;
  }
  .an-2 {
    animation: throw-2-up 900ms ease-out forwards, throw-2-down 450ms 900ms ease-in forwards;
  }
  .an-3 {
    animation: throw-3-up 1300ms ease-out forwards, throw-3-down 1300ms 1300ms ease-in forwards;
  }
  .an-4 {
    animation: throw-4-up 1380ms ease-out forwards, throw-4-down 1130ms 1380ms ease-in forwards;
  }
  .an-5 {
    animation: throw-5-up 830ms ease-out forwards, throw-5-down 660ms 830ms ease-in forwards;
  }
  .an-6 {
    animation: throw-6-up 320ms ease-out forwards, throw-6-down 940ms 320ms ease-in forwards;
  }

  @keyframes throw-1-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-500%) rotate(720deg); }
  }
  @keyframes throw-1-down {
    0% { transform: translateY(-500%) rotate(720deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-2-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-300%) rotate(320deg); }
  }
  @keyframes throw-2-down {
    0% { transform: translateY(-300%) rotate(320deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-3-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-800%) rotate(600deg); }
  }
  @keyframes throw-3-down {
    0% { transform: translateY(-800%) rotate(600deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-4-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-850%) rotate(-550deg); }
  }
  @keyframes throw-4-down {
    0% { transform: translateY(-850%) rotate(-550deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-5-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-350%) rotate(200deg); }
  }
  @keyframes throw-5-down {
    0% { transform: translateY(-350%) rotate(200deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-6-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-523%) rotate(300deg); }
  }
  @keyframes throw-6-down {
    0% { transform: translateY(-523%) rotate(300deg); }
    100% { transform: translateY(0%); }
  }
`;export{T as default};
