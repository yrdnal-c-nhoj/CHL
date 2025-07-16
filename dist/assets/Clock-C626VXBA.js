import{r as a,j as e}from"./index-DqtFXLZd.js";const g="/assets/mu-BtVGLSAE.jpg",p="/assets/mult-DNXazs0y.ttf",h=()=>{const[i,c]=a.useState("");a.useEffect(()=>{const s=()=>{const r=new Date;let t=r.getHours();const o=r.getMinutes();t=t%12||12;const u=t<10?"0"+t:t,d=o<10?"0"+o:o;c(`${u}${d}`)};s();const m=setInterval(s,1e3);return()=>clearInterval(m)},[]);const l=`
    @font-face {
      font-family: 'mult';
      src: url(${p}) format('truetype');
    }
  `,n={htmlBody:{margin:0,padding:0,height:"100vh",width:"100vw",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"mult, monospace"},clock:{position:"absolute",top:"20vh",color:"rgb(137, 3, 3)",fontSize:"2.1rem",letterSpacing:"0.5rem",textTransform:"uppercase",zIndex:2},bgImage:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"contrast(100%)",zIndex:1,pointerEvents:"none"}};return e.jsxs("div",{style:n.htmlBody,children:[e.jsx("style",{children:l}),e.jsx("div",{style:n.bgImage}),e.jsx("div",{style:n.clock,children:i})]})};export{h as default};
