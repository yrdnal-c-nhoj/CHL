import{r as m,j as e}from"./index-_Zh6IFgu.js";const f="/assets/stretch-Cphcodrh.ttf",y=()=>{const[t,g]=m.useState({hours:"",minutes:"",seconds:""});m.useEffect(()=>{new FontFace("stretch",`url(${f})`).load().then(n=>{document.fonts.add(n)});const o=()=>{const n=new Date;let l=n.getHours()%12||12;const d=n.getMinutes().toString().padStart(2,"0"),h=n.getSeconds();g(s=>({hours:s.hours!==l.toString()?l.toString():s.hours,minutes:s.minutes!==d?d:s.minutes,seconds:s.seconds!==h.toString()?h.toString():s.seconds}))};o();const a=setInterval(o,1e3);return()=>clearInterval(a)},[]);const u={height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",backgroundImage:"repeating-linear-gradient(335deg, #07bb4f 0, #e51a8a 0.2px, transparent 0, transparent 50%)",backgroundSize:"1.1vw 1.1vw",backgroundColor:"#bbcdc4",position:"relative",fontSize:"4rem"},r=(c,o,a)=>({fontFamily:"stretch",position:"absolute",width:"100%",height:"100%",fontSize:"7rem",display:"flex",justifyContent:"center",alignItems:"center",lineHeight:1,textAlign:"center",overflow:"hidden",margin:0,padding:0,color:c,opacity:o,zIndex:a}),i={display:"flex",justifyContent:"center",alignItems:"center",transform:"scale(3.5, 2) skew(30deg)",width:"100%",height:"100%",lineHeight:1};return e.jsxs("div",{style:u,children:[e.jsx("div",{style:r("#090213",1,1),children:e.jsx("span",{style:i,className:"morph",children:t.hours},t.hours)}),e.jsx("div",{style:r("#76f705",.8,2),children:e.jsx("span",{style:i,className:"morph",children:t.minutes},t.minutes)}),e.jsx("div",{style:r("#eefa03",.6,3),children:e.jsx("span",{style:i,className:"morph",children:t.seconds},t.seconds)}),e.jsx("style",{children:`
        @keyframes morph {
          0% {
            transform: scale(3.5, 2) skew(40deg) rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(3.0, 1.5) skew(20deg) rotateX(45deg);
            opacity: 0.5;
          }
          100% {
            transform: scale(3.5, 2) skew(30deg) rotateX(0deg);
            opacity: 1;
          }
        }

        .morph {
          animation: morph 0.5s ease-in-out;
        }
      `})]})};export{y as default};
