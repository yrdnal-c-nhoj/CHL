import{r as n,j as t}from"./index-CR9JyEBx.js";const c="/assets/auth-Bw_JM2l-.jpg",d="/assets/cattle-DlaqDbOU.ttf",g=()=>{const[e,a]=n.useState({hours:12,minutes:"00"});return n.useEffect(()=>{const s=()=>{const i=new Date;let r=i.getHours(),l=i.getMinutes();r=r%12||12;const m=l.toString().padStart(2,"0");a({hours:r,minutes:m})};s();const o=setInterval(s,1e3);return()=>clearInterval(o)},[]),t.jsxs("div",{style:{fontSize:"1rem",margin:0,height:"100vh",width:"100vw",fontFamily:"cattle"},children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'cattle';
            src: url(${d}) format('truetype');
          }
        `}),t.jsx("img",{src:c,alt:"Background",style:{position:"fixed",top:0,left:0,width:"120vw",height:"110vh",backgroundRepeat:"repeat",zIndex:1}}),t.jsxs("div",{style:{position:"relative",right:"-65vw",bottom:"-60vh",fontSize:"4rem",display:"flex",fontFamily:"cattle",alignItems:"baseline",color:"#331a00",textShadow:`
            0 0 0.0625rem #000,
            0 0 0.1875rem #2b1a00,
            0.0625rem 0.0625rem 0 rgba(255, 180, 100, 0.2),
            -0.0625rem -0.0625rem 0 rgba(255, 180, 100, 0.2),
            0 0 0.625rem rgba(50, 30, 10, 0.8)
          `,zIndex:2,transform:"rotate(-8deg)"},children:[t.jsx("div",{id:"hours",children:e.hours}),t.jsxs("div",{style:{display:"flex"},children:[t.jsx("div",{style:{position:"relative",top:"-1.2rem",right:"-0.4rem",transform:"rotate(90deg)",textAlign:"center"},children:e.minutes[0]}),t.jsx("div",{style:{position:"relative",top:"1.5rem",right:"2.6rem",transform:"rotate(45deg)",textAlign:"center"},children:e.minutes[1]})]})]})]})};export{g as default};
