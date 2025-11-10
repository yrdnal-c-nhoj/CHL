import{r as n,j as t}from"./index-CacFjmHR.js";const p="/assets/bg-ClhUlRZs.jpg",S="/assets/baud-9AONKx7j.ttf",w=()=>{const[f,x]=n.useState(new Date),[l,d]=n.useState(!1);n.useEffect(()=>{const e=setInterval(()=>x(new Date),1e3);return()=>clearInterval(e)},[]),n.useEffect(()=>{const e=document.createElement("style");e.textContent=`
      @font-face {
        font-family: 'MyDateFont';
        src: url(${S}) format('truetype');
        font-display: swap;
      }
    `,document.head.appendChild(e);const r=document.fonts.load("10rem MyDateFont"),a=new Promise((i,v)=>{const c=new Image;c.src=p,c.onload=i,c.onerror=v});return Promise.all([r,a]).then(()=>d(!0)).catch(i=>{console.error("Asset loading error:",i),d(!0)}),()=>{document.head.removeChild(e)}},[]);const m=String((f.getHours()+11)%12+1).padStart(2,"0"),u=String(f.getMinutes()).padStart(2,"0"),g=String(f.getSeconds()).padStart(2,"0"),s={display:"flex",justifyContent:"center",alignItems:"center",fontFamily:"'MyDateFont', sans-serif",fontSize:"8rem",color:"#ffffff",margin:"0 0.5vw",minWidth:"8vw",textShadow:`
      0 0 5px #ff0000,
      0 0 10px #ff9900,
      0 0 15px #ffff00,
      0 0 20px #00ff00,
      0 0 25px #00ffff,
      0 0 30px #0000ff,
      0 0 35px #ff00ff,
      0 0 45px #ff0000,
      0 0 50px #ff9900,
      0 0 55px #ffff00,
      0 0 60px #00ff00,
      0 0 65px #00ffff,
      0 0 70px #0000ff,
      0 0 75px #ff00ff,
      0 0 80px #ffffff,
      0 0 90px #ffffff,
      0 0 99px #ffffff
    `},h={height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"black",backgroundImage:l?`url(${p})`:"none",backgroundSize:"cover",backgroundPosition:"center"},y={display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},o=e=>e.split("").map((r,a)=>t.jsx("div",{style:s,children:r},a));return l?t.jsx("div",{style:h,children:t.jsxs("div",{style:y,children:[o(m),t.jsx("div",{style:s,children:":"}),o(u),t.jsx("div",{style:s,children:":"}),o(g)]})}):t.jsx("div",{style:{height:"100dvh",width:"100vw",backgroundColor:"black"}})};export{w as default};
