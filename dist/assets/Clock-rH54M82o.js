import{r,j as o}from"./index-_Zh6IFgu.js";const j="/assets/bg-C3oQVhj9.mp4",C="/assets/bg-C5ie6KeN.webp",h="/assets/fundy-BrCqS3SA.ttf";function D(){const[y,p]=r.useState(!1),[d,f]=r.useState(!1),[k,_]=r.useState(!1),[a,m]=r.useState(new Date),x=r.useRef(null);r.useEffect(()=>{const e=setInterval(()=>m(new Date),10);return()=>clearInterval(e)},[]),r.useEffect(()=>{new FontFace("MyCustomFont",`url(${h}) format("truetype")`).load().then(t=>{document.fonts.add(t),p(!0)}).catch(()=>p(!0))},[]),r.useEffect(()=>{const e=x.current;if(!e)return;const t=c=>{console.error("Video error (asset failure):",c.target.error),f(!0)},s=()=>{};e.addEventListener("error",t),e.addEventListener("stalled",s);const i=e.play?.();i&&i.catch(c=>{console.warn("Autoplay failed (Policy issue). Proceeding silently.",c)});const E=setTimeout(()=>{e.readyState<4&&!e.paused&&(console.warn("Video failed to load completely. Switching to fallback."),f(!0))},3e3);return()=>{clearTimeout(E),e.removeEventListener("error",t),e.removeEventListener("stalled",s)}},[]);const u=()=>{const e=String(a.getHours()).padStart(2,"0"),t=String(a.getMinutes()).padStart(2,"0"),s=String(a.getSeconds()).padStart(2,"0"),i=String(a.getMilliseconds()).padStart(3,"0");return`${e}${t}${s}${i.slice(0,2)}`};u().split("");const F={width:"100vw",height:"100dvh",position:"relative",overflow:"hidden",backgroundColor:"#000",display:y?"block":"none"},b={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,pointerEvents:"none",display:d?"none":"block"},v={position:"absolute",inset:0,backgroundImage:`url(${C})`,backgroundSize:"cover",backgroundPosition:"center",display:d?"block":"none"},S={position:"absolute",bottom:0,width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.1rem",zIndex:1,animation:"float_2025_10_22 26.3s linear infinite"},n={fontFamily:"'MyCustomFont', sans-serif",fontSize:"4rem",width:"2rem",textAlign:"center",color:"#DF9268FF",animation:"colorCycle_2025_10_22 26s linear infinite",textShadow:`
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,transition:"text-shadow 1s linear"},l={...n,width:"1rem"},g=`
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${h}) format('truetype');
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
        /* CHANGED: Use cover to fill the screen for a background effect */
        object-fit: cover; 
      }
    }
  `,w=()=>{const e=u(),t=[];let s=0;return t.push(o.jsx("span",{style:n,children:e[0]},s++)),t.push(o.jsx("span",{style:n,children:e[1]},s++)),t.push(o.jsx("span",{style:l,children:":"},"sep1")),t.push(o.jsx("span",{style:n,children:e[2]},s++)),t.push(o.jsx("span",{style:n,children:e[3]},s++)),t.push(o.jsx("span",{style:l,children:":"},"sep2")),t.push(o.jsx("span",{style:n,children:e[4]},s++)),t.push(o.jsx("span",{style:n,children:e[5]},s++)),t.push(o.jsx("span",{style:l,children:"."},"sep3")),t.push(o.jsx("span",{style:n,children:e[6]},s++)),t.push(o.jsx("span",{style:n,children:e[7]},s++)),t};return o.jsxs("div",{style:F,children:[o.jsx("style",{children:g}),o.jsxs("video",{ref:x,style:b,loop:!0,muted:!0,playsInline:!0,autoPlay:!0,preload:"metadata",children:[o.jsx("source",{src:j,type:"video/mp4"}),o.jsx("source",{src:"./bg.webm",type:"video/webm"}),"Your browser does not support the video tag."]}),o.jsx("div",{style:v,"aria-hidden":!0}),o.jsx("div",{style:S,children:w()})]})}export{D as default};
