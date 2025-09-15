import{r as t,j as e}from"./index-CB5Z5zkF.js";const k="/assets/beat4-BgJ4PzWK.webp",S="/assets/tumblr_eb7034da88f87c02b8539374dca9c92e_746715e1_500-CtPSGGl-.webp",j=()=>{const r=t.useRef(null),n=t.useRef(null),o=t.useRef(null);t.useEffect(()=>{function i(){const a=new Date,c=a.getSeconds(),d=a.getMinutes(),m=a.getHours(),y=c*6,v=d*6+c*.1,w=m%12*30+d*.5;o.current&&(o.current.style.transform=`rotate(${y}deg)`),n.current&&(n.current.style.transform=`rotate(${v}deg)`),r.current&&(r.current.style.transform=`rotate(${w}deg)`)}i();const p=setInterval(i,1e3);return()=>clearInterval(p)},[]);const l={margin:0,overflow:"hidden",position:"relative",height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"},u={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${k})`,filter:"saturate(300%)",backgroundRepeat:"repeat",backgroundSize:"6%",zIndex:0},f={position:"relative",width:"50vh",height:"50vh",backgroundImage:`url(${S})`,filter:"hue-rotate(200deg)",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",border:"2px solid #eb0808",borderRadius:"50%",boxShadow:"0 0 400px #8e4dff",animation:"heartbeat 1s infinite",transformOrigin:"center",zIndex:10},s={position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"rotate(0deg)"},h={...s,width:"7px",height:"70px",background:"transparent",borderRadius:"10px",boxShadow:"0 0 3px #F80D3CFF",zIndex:3},b={...s,width:"6px",height:"140px",background:"transparent",borderRadius:"6px",boxShadow:"0 0 3px #F80D3CFF",zIndex:2},x={...s,width:"4px",height:"150px",background:"#588944FF",borderRadius:"4px",zIndex:1},g={width:"30px",height:"30px",background:"#ff333f",borderRadius:"50%",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:5,boxShadow:"0 0 5px #fff"};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.2);
          }
          40% {
            transform: scale(0.95);
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(1.03);
          }
        }
      `}),e.jsxs("div",{style:l,children:[e.jsx("div",{style:u}),e.jsxs("div",{style:f,children:[e.jsx("div",{ref:r,style:h}),e.jsx("div",{ref:n,style:b}),e.jsx("div",{ref:o,style:x}),e.jsx("div",{style:g})]})]})]})};export{j as default};
