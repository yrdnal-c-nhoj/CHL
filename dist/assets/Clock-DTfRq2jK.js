import{r as n,j as o}from"./index-BG825qbX.js";const k="/assets/bg-C3oQVhj9.mp4",j="/assets/bg-C5ie6KeN.webp",x="/assets/fundy-BrCqS3SA.ttf";function I(){const[u,d]=n.useState(!1),[p,m]=n.useState(!1),[y,s]=n.useState(!1),[r,F]=n.useState(new Date),l=n.useRef(null);n.useEffect(()=>{const t=setInterval(()=>F(new Date),10);return()=>clearInterval(t)},[]),n.useEffect(()=>{new FontFace("MyCustomFont",`url(${x}) format("truetype")`).load().then(e=>{document.fonts.add(e),d(!0)}).catch(()=>d(!0))},[]),n.useEffect(()=>{const t=l.current;if(!t)return;const e=c=>{console.error("Video error:",c.target.error),m(!0),s(!0)},a=()=>s(!0);t.addEventListener("error",e),t.addEventListener("stalled",a);const i=t.play?.();return i&&i.catch(c=>{console.error("Autoplay failed:",c),s(!0)}),()=>{t.removeEventListener("error",e),t.removeEventListener("stalled",a)}},[]);const h=()=>{const t=l.current;t&&t.play().then(()=>s(!1)).catch(e=>console.error("Manual play failed:",e))},b=(()=>{const t=String(r.getHours()).padStart(2,"0"),e=String(r.getMinutes()).padStart(2,"0"),a=String(r.getSeconds()).padStart(2,"0"),i=String(r.getMilliseconds()).padStart(3,"0");return`${t}${e}${a}${i.slice(0,2)}`})().split(""),v={width:"100vw",height:"100dvh",position:"relative",overflow:"hidden",backgroundColor:"#000",display:u?"block":"none"},S={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,pointerEvents:"none",display:p?"none":"block"},g={position:"absolute",inset:0,backgroundImage:`url(${j})`,backgroundSize:"cover",backgroundPosition:"center",display:p?"block":"none"},C={position:"absolute",bottom:0,width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.1rem",zIndex:1,animation:"float_2025_10_22 26.3s linear infinite"},f={fontFamily:"'MyCustomFont', sans-serif",fontSize:"4rem",width:"2rem",textAlign:"center",color:"#DF9268FF",animation:"colorCycle_2025_10_22 26s linear infinite",textShadow:`
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,transition:"text-shadow 1s linear"},E={...f,width:"1rem"},w=`
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${x}) format('truetype');
      font-display: block;
    }

    @keyframes float_2025_10_22 {
      0% { bottom: 0; }
      50% { bottom: calc(100dvh - 4rem - 20px); }
      100% { bottom: 0; }
    }

    @keyframes colorCycle_2025_10_22 {
      0% {
        color: #df9268ff;
        text-shadow:
           -1px 0 0px #4b3424ff,
           0 0 6px #98643fff,
           0 0 4px #c88a5e,
           1px 0 2px #d2c497ff;
        opacity: 1;
      }
      23.08% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
          -1px -1px #04140BFF,
           3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
           1px 1px #e4ebe6ff;
      }
      50% {
        opacity: 1;
        color: #F4ECCCFF;
        text-shadow:
          1px 1px #e10e23ff,
          0 0 6px #F8FDF7FF,
          0 0 4px #5874a0ff,
         -1px 0 #0d131cff;
      }
      76.92% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
          -1px -1px #04140BFF,
           3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
           1px 1px #e4ebe6ff;
      }
      100% {
        color: #df9268ff;
        text-shadow:
           -1px 0 0px #4b3424ff,
           0 0 6px #98643fff,
           0 0 4px #c88a5e,
           1px 0 2px #d2c497ff;
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      video {
        object-fit: contain;
      }
    }
  `;return o.jsxs("div",{style:v,children:[o.jsx("style",{children:w}),o.jsxs("video",{ref:l,style:S,loop:!0,muted:!0,playsInline:!0,autoPlay:!0,preload:"metadata",children:[o.jsx("source",{src:k,type:"video/mp4"}),o.jsx("source",{src:"./bg.webm",type:"video/webm"}),"Your browser does not support the video tag."]}),o.jsx("div",{style:g,"aria-hidden":!0}),y&&o.jsx("button",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:2,padding:"10px 20px",fontSize:"1rem",cursor:"pointer"},onClick:h,children:"Play Video"}),o.jsx("div",{style:C,children:b.map((t,e)=>o.jsx("span",{style:/[0-9]/.test(t)?f:E,children:t},e))})]})}export{I as default};
