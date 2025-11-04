import{r as n,j as e}from"./index-BG825qbX.js";const y="/assets/watch-BIS26Q5f.ttf",b="/assets/gears-13950_128-BKyKeb4M.gif",k=()=>{const[r,d]=n.useState(!1),[l,u]=n.useState([]),[x,g]=n.useState([]),[h,v]=n.useState([]),[m,p]=n.useState(window.innerHeight),f={0:"zero",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine"},o=t=>t.split("").map(i=>f[i]||i);if(n.useEffect(()=>{const t=()=>p(window.innerHeight);return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),n.useEffect(()=>{const t=()=>{const s=new Date;let c=s.getHours()%12||12;const w=String(s.getMinutes()).padStart(2,"0"),j=String(s.getSeconds()).padStart(2,"0");u(o(String(c))),g(o(w)),v(o(j))};(async()=>{try{const s=new FontFace("watch",`url(${y})`);await s.load(),document.fonts.add(s),t(),d(!0);const c=setInterval(t,1e3);return()=>clearInterval(c)}catch(s){console.error("Font failed to load",s)}})()},[]),!r)return null;const a={position:"fixed",width:"100%",height:"100%",top:0,left:0,backgroundImage:`url(${b})`,backgroundRepeat:"repeat",backgroundPosition:"center",pointerEvents:"none"};return e.jsxs("div",{style:{height:m,width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",position:"relative",overflow:"hidden",backgroundColor:"#c9dbef",margin:0,padding:0},children:[e.jsx("style",{children:`
        .clock {
          font-family: 'watch', sans-serif;
          color: rgb(29, 2, 84);
          text-shadow: rgb(238, 87, 5) 1px 1px 0px, white -1px 0px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 15vh;
          text-align: center;
          z-index: 10;
        }

        .unit { display: flex; flex-direction: column; }
        .value { display: flex; flex-direction: column; align-items: center; }
        .digit-box { display: inline-flex; justify-content: center; align-items: center; height: 3rem; user-select: none; }
        .divider { height: 1px; width: 30vw; background-color: rgb(52, 1, 77); margin: 0.5rem auto; }

        @media (max-width: 600px) {
          .clock { font-size: 12vh; }
          .digit-box { height: 9vh; }
          .divider { width: 50vw; }
        }
      `}),e.jsx("div",{style:{...a,backgroundSize:"22vw 18vw",opacity:.3,zIndex:5}}),e.jsx("div",{style:{...a,backgroundSize:"21vw 17vw",opacity:.35,zIndex:4}}),e.jsx("div",{style:{...a,backgroundSize:"20vw 16vw",opacity:.4,zIndex:3}}),e.jsxs("div",{className:"clock",children:[e.jsx("div",{className:"unit",id:"hours",children:e.jsx("div",{className:"value",children:l.map((t,i)=>e.jsx("span",{className:"digit-box",children:t},i))})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"unit",id:"minutes",children:e.jsx("div",{className:"value",children:x.map((t,i)=>e.jsx("span",{className:"digit-box",children:t},i))})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"unit",id:"seconds",children:e.jsx("div",{className:"value",children:h.map((t,i)=>e.jsx("span",{className:"digit-box",children:t},i))})})]})]})};export{k as default};
