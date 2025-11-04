import{r as a,j as t}from"./index-BG825qbX.js";const y="/assets/cloudy-Pg9CFaLp.ttf",g="/assets/cmoon-DQfv1cJj.webp",h="/assets/clou-BEkIAWB9.gif",r="/assets/clll-DJTnwkss.webp",b=()=>{const e=a.useRef();a.useEffect(()=>{const o=document.createElement("style");o.textContent=`
      @font-face {
        font-family: 'cloudy';
        src: url(${y}) format('truetype');
      }
    `,document.head.appendChild(o);const n=()=>{const s=new Date;let m=s.getHours()%12||12;const p=String(s.getMinutes()).padStart(2,"0");e.current.textContent=`${m}:${p}`},f=setInterval(n,1e3);return n(),()=>clearInterval(f)},[]);const i={margin:0,overflow:"hidden",background:"linear-gradient(to bottom, #1d1d4f, #182c21)",height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",position:"relative"},c={position:"absolute",left:"50%",top:"120vh",width:"32vh",height:"32vh",backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"center",display:"flex",justifyContent:"center",alignItems:"center",transform:"translateX(-50%)",animation:"moonRise 15s infinite ease-in-out",zIndex:5},l={fontFamily:"cloudy, sans-serif",fontSize:"3.5rem",color:"#f9f6c2",textShadow:`
      0.2rem 0.2rem 0 rgba(69, 73, 52, 0.9),
      0.1rem 0.1rem 0 rgba(207, 250, 16),
      -0.1rem 0 0.4rem rgb(150, 228, 215)
    `,lineHeight:1,textAlign:"center",transform:"translateY(2%)"},d={width:"120vw",height:"90vh",backgroundImage:`url(${h})`,backgroundSize:"cover",backgroundPosition:"center",animation:"cloudSweep 15s infinite ease-in-out",zIndex:10,filter:"brightness(40%) contrast(200%) sepia(1) hue-rotate(190deg) saturate(2)",opacity:.7},u={position:"fixed",top:"-19vh",left:0,height:"150vh",backgroundImage:`url(${r})`,backgroundRepeat:"repeat",zIndex:2,opacity:.3,filter:"brightness(60%)"};return t.jsxs("div",{style:i,children:[t.jsx("img",{src:r,alt:"bg",style:u}),t.jsx("div",{style:c,children:t.jsx("div",{style:e?l:{},ref:e,children:"12:00"})}),t.jsx("div",{style:d}),t.jsx("style",{children:`
        @keyframes moonRise {
          0% { top: 100vh; opacity: 0; }
          25% { top: 32vh; opacity: 1; }
          50% { top: 32vh; opacity: 1; }
          60% { top: 32vh; opacity: 0; }
          100% { top: 100vh; opacity: 0; }
        }

        @keyframes cloudSweep {
          0% {
            transform: translateX(-90vw);
            opacity: 0;
          }
          40% {
            transform: translateX(-90vw);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 1;
          }
          65% {
            transform: translateX(0);
            opacity: 1;
          }
          80% {
            transform: translateX(90vw);
            opacity: 0;
          }
          100% {
            transform: translateX(90vw);
            opacity: 0;
          }
        }

        
       
      `})]})};export{b as default};
