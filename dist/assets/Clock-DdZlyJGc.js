import{r as n,j as e}from"./index-CacFjmHR.js";const w="/assets/bak-a8RA4Ukw.ttf",R="/assets/bk-BFibjThr.gif";function D(){const l=n.useRef(null),i=n.useRef(null),c=n.useRef(null),g=n.useRef([]);n.useEffect(()=>{new FontFace("bak",`url(${w})`).load().then(t=>{document.fonts.add(t),document.body.classList.add("font-loaded")});const a=()=>{const t=new Date,o=t.getSeconds(),r=t.getMinutes(),x=t.getHours()%12,m=o/60*360,v=r/60*360+o/60*6,k=x/12*360+r/60*30;c.current&&(c.current.style.transform=`rotate(${m}deg)`),i.current&&(i.current.style.transform=`rotate(${v}deg)`),l.current&&(l.current.style.transform=`rotate(${k}deg)`),g.current.forEach(s=>{const j=parseFloat(s.getAttribute("data-angle")),h=Math.abs(m-j);(h<5||h>355)&&!s.classList.contains("spin")&&(s.classList.add("spin"),setTimeout(()=>{s.classList.remove("spin"),s.style.transform="translate(-50%, -50%) scaleX(-1)"},5e3))})},f=setInterval(a,1e3);return a(),()=>clearInterval(f)},[]);const b={position:"fixed",top:0,left:0,height:"100vh",width:"100vw",margin:0,display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#4f4d4d",overflow:"hidden"},p={position:"relative",width:"70vh",height:"70vh",borderRadius:"50%",transform:"scaleX(-1)",perspective:"1000px",zIndex:2,display:"flex",justifyContent:"center",alignItems:"center"},d={position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom"},y=[{top:"10%",left:"50%",angle:0,label:"12"},{top:"15.86%",left:"74.13%",angle:30,label:"1"},{top:"30.86%",left:"85.86%",angle:60,label:"2"},{top:"50%",left:"90%",angle:90,label:"3"},{top:"69.14%",left:"85.86%",angle:120,label:"4"},{top:"84.14%",left:"74.13%",angle:150,label:"5"},{top:"90%",left:"50%",angle:180,label:"6"},{top:"84.14%",left:"25.87%",angle:210,label:"7"},{top:"69.14%",left:"14.14%",angle:240,label:"8"},{top:"50%",left:"10%",angle:270,label:"9"},{top:"30.86%",left:"14.14%",angle:300,label:"10"},{top:"15.86%",left:"25.87%",angle:330,label:"11"}];return e.jsxs("div",{style:b,children:[e.jsx("img",{src:R,alt:"background",style:{position:"absolute",bottom:0,right:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1,transform:"scale(1.2)",transformOrigin:"center center"}}),e.jsxs("div",{className:"clock",style:p,children:[e.jsx("div",{ref:l,className:"hand hour-hand",style:{...d,width:"0.4rem",height:"6rem",background:"#634a05"}}),e.jsx("div",{ref:i,className:"hand minute-hand",style:{...d,width:"0.3rem",height:"8rem",background:"#b97c03"}}),e.jsx("div",{ref:c,className:"hand second-hand",style:{...d,width:"0.2rem",height:"9rem",background:"rgb(148, 3, 3)"}}),e.jsx("div",{style:{width:"2rem",height:"2rem",background:"#cda343",borderRadius:"50%",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%) scaleX(-1)",zIndex:3}}),y.map(({top:u,left:a,angle:f,label:t},o)=>e.jsx("div",{ref:r=>g.current[o]=r,className:"number","data-angle":f,style:{position:"absolute",top:u,left:a,fontSize:"2.5rem",fontFamily:"bak, sans-serif",textAlign:"center",color:"hsl(274, 96%, 18%)",textShadow:"#F63409FF 1px 1px",lineHeight:"2rem",transform:"translate(-50%, -50%) scaleX(-1)",transformStyle:"preserve-3d"},children:t},t))]}),e.jsx("style",{children:`
          body { visibility: hidden; }
          body.font-loaded { visibility: visible; }

          @keyframes spin3D {
            0% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            50% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(720deg) rotateY(720deg) rotateZ(720deg);
            }
            100% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(1440deg) rotateY(1440deg) rotateZ(1440deg);
            }
          }

          .number.spin {
            animation: spin3D 5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          }
        `})]})}export{D as default};
