import{r as g,j as a}from"./index-37WBs3jL.js";const w="/assets/som-Tr_a2prM.ttf",k="/assets/met-MU62tiBE.jpg",x=()=>{const[p,u]=g.useState([]);g.useEffect(()=>{const n=r=>{let e=r.getHours()%12;e===0&&(e=12);const t=String(r.getMinutes()).padStart(2,"0");return`${e}${t}`},f=(r,e,t)=>{const s=Date.now()+Math.random(),c=Math.random()*90;let m,l;e<t?(m="hour",l="#FFD700"):e-t===0?(m="minuteTens",l="#C0C0C0"):(m="minuteOnes",l="#CD7F32"),u(d=>[...d,{id:s,char:r,top:c,typeClass:m,color:l}]),setTimeout(()=>{u(d=>d.filter(b=>b.id!==s))},6e3)},i=()=>{const e=n(new Date),t=e.length-2;[...e].forEach((s,c)=>{setTimeout(()=>f(s,c,t),c*1e3)})};i();const o=setInterval(i,666);return()=>clearInterval(o)},[]);const h=n=>({position:"absolute",top:`${n}vh`,left:"-30vw",fontFamily:"MyCustomFont, monospace",whiteSpace:"pre",transformOrigin:"center"});return a.jsxs(a.Fragment,{children:[a.jsx("div",{style:{position:"relative",width:"100vw",height:"100dvh",backgroundImage:`url(${k})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",overflow:"hidden",fontFamily:"MyCustomFont, monospace"},children:p.map(({id:n,char:f,top:i,typeClass:o})=>a.jsx("div",{className:o,style:{...h(i),fontSize:o==="hour"?"5rem":o==="minuteTens"?"3.5rem":"1.6rem"},children:f},n))}),a.jsx("style",{children:`
        @font-face {
          font-family: 'MyCustomFont';
          src: url(${w}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        .hour, .minuteTens, .minuteOnes {
          animation:
            fadeInSlide 0.6s ease-out,
            rollRight 6s linear forwards,
            shimmer 2s infinite linear;
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-family: 'MyCustomFont', monospace;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.4),
            1px 1px 2px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          -webkit-box-reflect: below -0.1em linear-gradient(transparent, rgba(0, 0, 0, 0.3));
        }

        .hour {
          background-image: linear-gradient(
            120deg,
            #b8860b 0%,
            #ffd700 40%,
            #fff8dc 60%,
            #ffd700 80%,
            #b8860b 100%
          );
        }

        .minuteTens {
          background-image: linear-gradient(
            120deg,
            #aaa 0%,
            #ccc 40%,
            #eee 60%,
            #ccc 80%,
            #aaa 100%
          );
        }

        .minuteOnes {
          background-image: linear-gradient(
            120deg,
            #8c6239 0%,
            #cd7f32 40%,
            #f4e2d8 60%,
            #cd7f32 80%,
            #8c6239 100%
          );
        }

        @keyframes fadeInSlide {
          0% {
            transform: translateX(-10vw);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes rollRight {
          0% {
            left: -10vw;
          }
          100% {
            left: 110vw;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `})]})};export{x as default};
