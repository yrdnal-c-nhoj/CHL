import{r as t,j as o}from"./index-_Zh6IFgu.js";const V="/assets/rose-ww6AdE3h.mp4",M="/assets/rose-D1ZigRnx.webp";function $(){const[i,v]=t.useState(!1),[c,f]=t.useState(!1),l=t.useRef(null),b=t.useRef(Date.now()),[,y]=t.useState(0);t.useEffect(()=>{let e;const n=()=>{y(r=>r+1),e=requestAnimationFrame(n)};return e=requestAnimationFrame(n),()=>cancelAnimationFrame(e)},[]),t.useEffect(()=>{const e=l.current;if(!e)return;const n=()=>v(!0),r=()=>f(!0);return e.addEventListener("canplay",n),e.addEventListener("error",r),e.muted=!0,e.loop=!0,e.playsInline=!0,e.play().catch(()=>{}),()=>{e.removeEventListener("canplay",n),e.removeEventListener("error",r)}},[]);const s=new Date,p=b.current,w=Date.now()-p,x=s.getMilliseconds()+w%1e3,d=s.getSeconds()+x/1e3,u=s.getMinutes()+d/60,S=s.getHours()%12+u/60,j=d*6,E=u*6,k=S*30,F={position:"relative",width:"100vw",height:"100dvh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#0b1220"},h={position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,transition:"opacity 0.4s ease, filter 1s ease"},g=`
    brightness(2.9)
    contrast(0.8)
    saturate(1.3)
    hue-rotate(-30deg)
  `,m="rotate(0.5deg) scale(1.02)",C={...h,opacity:i&&!c?1:0,filter:g,transform:m},D={...h,opacity:i&&!c?0:1,filter:g,transform:m},R={position:"relative",zIndex:2,width:"40vmin",height:"40vmin",pointerEvents:"none"},a={position:"absolute",bottom:"50%",left:"50%",transformOrigin:"50% 100%",borderRadius:"0.6vh",willChange:"transform",background:"rgba(255, 0, 40, 0.95)",opacity:.9,boxShadow:`
    0 0 3vh rgba(255, 20, 20, 0.8),
      0 0 6vh rgba(255, 40, 60, 0.6),
      0 0 10vh rgba(255, 0, 0, 0.5)
    `},I={...a,width:"1.6vh",height:"12vmin",transform:`translate(-50%, 0) rotate(${k}deg)`},A={...a,width:"0.9vh",height:"28vmin",transform:`translate(-50%, 0) rotate(${E}deg)`},L={...a,width:"0.4vh",height:"44vmin",opacity:.85,boxShadow:`
      0 0 3vh rgba(255, 20, 20, 0.8),
      0 0 6vh rgba(255, 40, 60, 0.6),
      0 0 10vh rgba(255, 0, 0, 0.5)
    `,filter:"blur(0.4vh)",transform:`translate(-50%, 0) rotate(${j}deg)`};return o.jsxs("div",{style:F,children:[o.jsx("video",{ref:l,style:C,src:V,playsInline:!0,muted:!0,loop:!0,preload:"auto"}),o.jsx("img",{src:M,alt:"",style:D}),o.jsxs("div",{style:R,children:[o.jsx("div",{style:I}),o.jsx("div",{style:A}),o.jsx("div",{style:L})]})]})}export{$ as default};
