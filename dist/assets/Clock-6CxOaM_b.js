import{r as i,j as t}from"./index-CtpJRlFd.js";const u="/assets/Kina-DE1hlUgV.ttf",g="/assets/swurl-BrgGltzA.gif",x=[12,3,6,9],p=()=>t.jsx("style",{children:`
    @font-face {
      font-family: 'Kina';
      src: url(${u}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `}),w=()=>{const c=i.useRef(null),[o,d]=i.useState(new Date);i.useEffect(()=>{let e;const n=()=>{d(new Date),e=requestAnimationFrame(n)};return e=requestAnimationFrame(n),()=>cancelAnimationFrame(e)},[]);const a=60,l=20;return t.jsxs(t.Fragment,{children:[t.jsx(p,{}),t.jsxs("div",{style:{margin:0,display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",overflow:"hidden",position:"relative",fontFamily:"'Kina', sans-serif"},children:[t.jsx("img",{src:g,alt:"Swirling background",style:{position:"absolute",top:0,left:0,height:"100vh",width:"100vw",objectFit:"cover",zIndex:0,opacity:.5,filter:"hue-rotate(290deg) contrast(200%) saturate(200%)",pointerEvents:"none"}}),t.jsxs("div",{ref:c,id:"clock",style:{position:"relative",width:"100vw",maxWidth:`${a}rem`,height:"100vw",maxHeight:`${a}rem`,overflow:"hidden",animation:"spin 60s linear infinite",zIndex:10},children:[t.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",width:"0.5rem",height:"0.5rem",backgroundColor:"#000",borderRadius:"50%",transform:"translate(-50%, -50%)",zIndex:20}}),x.map(e=>{const n=(e-3)/12*2*Math.PI,s=Math.cos(n),r=Math.sin(n);return t.jsx("div",{className:"number",style:{position:"absolute",top:"50%",left:"50%",fontSize:"7rem",color:"#f199c8",textShadow:"5px 5px #100f10, -2px -2px white, 6px 6px white",fontFamily:"'Kina', sans-serif",pointerEvents:"none",zIndex:1,opacity:.7,transform:`translate(calc(${s} * ${l}vw), calc(${r} * ${l}vw)) translate(-50%, -50%)`,userSelect:"none"},children:e},e)}),(()=>{const e=o.getMilliseconds(),n=o.getSeconds()+e/1e3,s=o.getMinutes()+n/60,r=o.getHours()+s/60,m=n*6,f=s*6,h=r%12*30;return t.jsxs(t.Fragment,{children:[t.jsx("div",{id:"hour",className:"hand hour",style:{position:"absolute",bottom:"50%",left:"50%",width:"2rem",height:"8rem",backgroundColor:"#FB8906FF",color:"#F87D0AFF",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${h}deg)`,zIndex:4}}),t.jsx("div",{id:"minute",className:"hand minute",style:{position:"absolute",bottom:"50%",left:"50%",width:"1rem",height:"12rem",backgroundColor:"#f0df6e",color:"#f0df6e",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${f}deg)`,zIndex:5}}),t.jsx("div",{id:"second",className:"hand second",style:{position:"absolute",bottom:"50%",left:"50%",width:"0.5rem",height:"150vh",backgroundColor:"#ee0909",color:"#ee0909",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${m}deg)`,zIndex:6}})]})})()]}),t.jsx("style",{children:`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            }
          }
        `})]})]})};export{w as default};
