import{r as o,j as n}from"./index-DuxRGnoV.js";const S="/assets/bg-C3oQVhj9.mp4",C="/assets/bg-C5ie6KeN.webp",f="/assets/fundy-BrCqS3SA.ttf";function _(){const[d,a]=o.useState(!1),[i,c]=o.useState(!1),[s,x]=o.useState(new Date),l=o.useRef(null);o.useEffect(()=>{const t=setInterval(()=>x(new Date),10);return()=>clearInterval(t)},[]),o.useEffect(()=>{new FontFace("MyCustomFont",`url(${f}) format("truetype")`).load().then(e=>{document.fonts.add(e),a(!0)}).catch(()=>a(!0))},[]),o.useEffect(()=>{const t=l.current;if(!t)return;const e=()=>c(!0);t.addEventListener("error",e),t.addEventListener("stalled",e);const r=t.play?.();return r?.catch&&r.catch(()=>c(!0)),()=>{t.removeEventListener("error",e),t.removeEventListener("stalled",e)}},[]);const u=(()=>{const t=String(s.getHours()).padStart(2,"0"),e=String(s.getMinutes()).padStart(2,"0"),r=String(s.getSeconds()).padStart(2,"0"),E=String(s.getMilliseconds()).padStart(3,"0");return`${t}${e}${r}${E.slice(0,2)}`})().split(""),F={width:"100vw",height:"100dvh",position:"relative",overflow:"hidden",backgroundColor:"#000",display:d?"block":"none"},m={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,pointerEvents:"none",display:i?"none":"block"},y={position:"absolute",inset:0,backgroundImage:`url(${C})`,backgroundSize:"cover",backgroundPosition:"center",display:i?"block":"none"},h={position:"absolute",bottom:0,width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.1rem",zIndex:1,animation:"float_2025_10_22 26.3s linear infinite"},p={fontFamily:"'MyCustomFont', sans-serif",fontSize:"4rem",width:"2rem",textAlign:"center",color:"#DF9268FF",animation:"colorCycle_2025_10_22 26s linear infinite",textShadow:`
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,transition:"text-shadow 1s linear"},b={...p,width:"1rem"},v=`
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${f}) format('truetype');
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
  `;return n.jsxs("div",{style:F,children:[n.jsx("style",{children:v}),n.jsx("video",{ref:l,style:m,src:S,loop:!0,muted:!0,playsInline:!0,autoPlay:!0,preload:"auto"}),n.jsx("div",{style:y,"aria-hidden":!0}),n.jsx("div",{style:h,children:u.map((t,e)=>n.jsx("span",{style:/[0-9]/.test(t)?p:b,children:t},e))})]})}export{_ as default};
