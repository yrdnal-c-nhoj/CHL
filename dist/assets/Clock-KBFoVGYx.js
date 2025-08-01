import{r as i,j as e}from"./index-pvgtSMk9.js";const l="/assets/Map-B8tfrOAY.ttf",d=()=>{const[t,s]=i.useState({hours:"00",minutes:"00",seconds:"00"});return i.useEffect(()=>{const r=()=>{const n=new Date;s({hours:String(n.getHours()).padStart(2,"0"),minutes:String(n.getMinutes()).padStart(2,"0"),seconds:String(n.getSeconds()).padStart(2,"0")})};r();const o=setInterval(r,1e3);return()=>clearInterval(o)},[]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'Map';
          src: url(${l}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: 'Map', sans-serif;
        }
      `}),e.jsx("iframe",{src:"https://www.youtube.com/embed/JHpJvvn9hvk?autoplay=1&mute=1",title:"Live YouTube Stream",allow:"autoplay; encrypted-media",allowFullScreen:!0,style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"100vw",height:"100vh",border:"none",zIndex:1}}),e.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:2,display:"flex",justifyContent:"center",alignItems:"center",gap:"2vmin",flexWrap:"nowrap"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.5vmin"},children:[e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.hours[0]}),e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.hours[1]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5vmin"},children:[e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.minutes[0]}),e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.minutes[1]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5vmin"},children:[e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.seconds[0]}),e.jsx("div",{style:{color:"#ef1337",fontSize:"8rem",width:"4.5rem",height:"6rem",display:"flex",justifyContent:"center",alignItems:"center",minWidth:"2rem",textAlign:"center",boxSizing:"border-box",userSelect:"none"},children:t.seconds[1]})]})]})]})};export{d as default};
