import{r,j as t}from"./index-CB5Z5zkF.js";const g="/assets/bg-ClhUlRZs.jpg",u="/assets/baud-9AONKx7j.ttf",m=()=>{const[e,i]=r.useState(new Date);r.useEffect(()=>{const f=setInterval(()=>i(new Date),1e3);return()=>clearInterval(f)},[]);const o=String((e.getHours()+11)%12+1).padStart(2,"0"),a=String(e.getMinutes()).padStart(2,"0"),c=String(e.getSeconds()).padStart(2,"0"),s={display:"flex",justifyContent:"center",alignItems:"center",fontFamily:"'MyDateFont', sans-serif",fontSize:"8rem",color:"#ffffff",margin:"0 0.5vw",minWidth:"8vw",textShadow:`
      0 0 5px #ff0000,
      0 0 10px #ff9900,
      0 0 15px #ffff00,
      0 0 20px #00ff00,
      0 0 25px #00ffff,
      0 0 30px #0000ff,
      0 0 35px #ff00ff,
      0 0 40px #ffffff,
      0 0 50px #ffffff,
      0 0 75px #ffffff
    `},l={height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"center"},d={display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},n=f=>f.split("").map((x,p)=>t.jsx("div",{style:s,children:x},p));return t.jsxs("div",{style:l,children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'MyDateFont';
            src: url(${u}) format('truetype');
            font-display: swap;
          }
        `}),t.jsxs("div",{style:d,children:[n(o),t.jsx("div",{style:s,children:":"}),n(a),t.jsx("div",{style:s,children:":"}),n(c)]})]})};export{m as default};
