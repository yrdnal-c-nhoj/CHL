import{r as a,j as t}from"./index-D1xzcOD-.js";const p="/assets/cubic-_0yVhNzr.ttf",f=["rgba(102, 51, 0, 0.75)","rgba(194, 178, 128, 0.75)","rgba(85, 87, 17, 0.75)","rgba(160, 82, 45, 0.75)","rgba(34, 32, 52, 0.75)","rgba(230, 180, 140, 0.75)"],x=()=>{const[o,s]=a.useState(new Date);a.useEffect(()=>{const e=setInterval(()=>s(new Date),1e3);return()=>clearInterval(e)},[]);const i=(()=>{let e=o.getHours();const r=o.getMinutes();return e===0&&(e=12),e>12&&(e-=12),`${e}${r.toString().padStart(2,"0")}`})(),n={width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",backgroundColor:"#1F1504FF"},l={position:"relative",width:"24rem",height:"24rem",perspective:"290rem",transition:"perspective 0.3s ease"},d={width:"100%",height:"100%",transformStyle:"preserve-3d",animation:"biteviteRotate 120s infinite linear"},m={position:"absolute",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(0.125rem)"},g={fontFamily:"'CustomHexFont', 'Courier New', monospace",fontSize:"9.5rem",background:"linear-gradient(135deg, #5B3A1A 0%, #7A5230 40%, #3E2A15 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textShadow:`
      1px 1px 0 #3b2713,
      -1px -1px 1px #F0E4D5FF,
      2px 2px 2px rgba(0,0,0,0.6),
      -2px -2px 1px rgba(255,255,255,0.05),
      0 0 2px #EAE6E3FF,
      0 1px 3px rgba(0,0,0,0.8),
      0 -1px 2px rgba(255,255,255,0.05)
    `,filter:"contrast(1.2) brightness(0.9)",letterSpacing:"0.01em",transition:"font-size 0.3s ease"},c={front:"translateZ(12.5rem)",back:"translateZ(-12.5rem) rotateY(180deg)",right:"rotateY(90deg) translateZ(12.5rem)",left:"rotateY(-90deg) translateZ(12.5rem)",top:"rotateX(90deg) translateZ(12.5rem)",bottom:"rotateX(-90deg) translateZ(12.5rem)"};return t.jsxs(t.Fragment,{children:[t.jsx("style",{jsx:!0,children:`
        @font-face {
          font-family: 'CustomHexFont';
          src: url(${p}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @keyframes biteviteRotate {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 600px) {
          div[style*="perspective: 290rem"] {
            perspective: 500rem; /* further away on small screens */
            width: 15rem;
            height: 15rem;
          }

          div[style*="font-size: 9.5rem"] {
            font-size: 5rem; /* smaller font on mobile */
          }
        }
      `}),t.jsx("div",{style:n,children:t.jsx("div",{style:l,children:t.jsx("div",{style:d,children:["front","back","right","left","top","bottom"].map((e,r)=>t.jsxs("div",{style:{...m,transform:c[e],backgroundColor:f[r]},children:[t.jsx("div",{style:g,children:i}),t.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"0.1rem",backgroundColor:"black"}}),t.jsx("div",{style:{position:"absolute",bottom:0,left:0,width:"100%",height:"0.1rem",backgroundColor:"black"}}),t.jsx("div",{style:{position:"absolute",top:0,left:0,width:"0.1rem",height:"100%",backgroundColor:"black"}}),t.jsx("div",{style:{position:"absolute",top:0,right:0,width:"0.1rem",height:"100%",backgroundColor:"black"}})]},e))})})})]})};export{x as default};
