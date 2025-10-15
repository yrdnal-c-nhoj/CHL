import{r as n,j as e}from"./index-DhGayC4d.js";const l="/assets/oort-hnemGdNZ.jpg";function b(){const[c,g]=n.useState(!1),[t,h]=n.useState(new Date);if(n.useEffect(()=>{const s=document.createElement("style");s.innerHTML=`
      @keyframes spinBackground {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .clock-face {
        position: relative;
        border-radius: 50%;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0BCAF5FF;
        z-index: 1;
        width: 70vw;   /* default for laptops */
        height: 40vh;
      }

      @media (max-width: 768px) {
        .clock-face {
          width: 60vw;   /* mobile width */
          height: 90vh;  /* mobile taller height */
        }
      }
    `,document.head.appendChild(s);const a=new Image;a.src=l,a.onload=()=>g(!0);let o;const d=()=>{h(new Date),o=requestAnimationFrame(d)};return o=requestAnimationFrame(d),()=>cancelAnimationFrame(o)},[]),!c)return e.jsx("div",{style:{width:"100vw",height:"100dvh",backgroundColor:"black"}});const i=t.getSeconds()+t.getMilliseconds()/1e3,r=t.getMinutes()+i/60,m=t.getHours()+r/60,u=i/60*360,f=r/60*360,p=m%12/12*360;return e.jsxs("div",{style:{width:"100vw",height:"100dvh",backgroundColor:"black",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"},children:[e.jsx("div",{style:{position:"absolute",width:"150vw",height:"150vw",backgroundImage:`url(${l})`,backgroundSize:"cover",backgroundPosition:"center",animation:"spinBackground 240s linear infinite",filter:"hue-rotate(120deg) saturate(1.2) brightness(0.9) contrast(1.1)"}}),e.jsxs("div",{className:"clock-face",children:[e.jsx("div",{style:{position:"absolute",width:"1px",height:"20%",backgroundColor:"#292A2BFF",transformOrigin:"50% 100%",transform:`rotate(${p}deg) translateY(-50%)`,top:"30%"}}),e.jsx("div",{style:{position:"absolute",width:"1px",height:"30%",backgroundColor:"#232325FF",transformOrigin:"50% 100%",transform:`rotate(${f}deg) translateY(-50%)`,top:"20%"}}),e.jsx("div",{style:{position:"absolute",width:"1px",height:"40%",backgroundColor:"#09E3FBFF",transformOrigin:"50% 100%",transform:`rotate(${u}deg) translateY(-50%)`,top:"10%"}})]})]})}export{b as default};
