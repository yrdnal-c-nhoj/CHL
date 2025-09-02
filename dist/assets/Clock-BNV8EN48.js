import{r as m,j as t}from"./index-CtpJRlFd.js";const f="/assets/cas-r-PHYe5m.ttf",g="/assets/ap-BNH6PGuf.jpeg",h=()=>{m.useEffect(()=>{const i=document.createElement("style");i.textContent=`
      @font-face {
        font-family: 'CustomFont';
        src: url(${f}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `,document.head.appendChild(i);const n=()=>{const a=new Date;let r=a.getHours();r=r%12||12,r=String(r).padStart(2,"0");const o=String(a.getMinutes()).padStart(2,"0"),l=String(a.getSeconds()).padStart(2,"0"),d=`${r}${o}${l}`;document.querySelectorAll(".piece").forEach((c,p)=>{c.setAttribute("data-digit",d[p])})};n();const s=setInterval(n,1e3);return()=>{clearInterval(s),document.head.removeChild(i)}},[]);const e={pendulumApp:{height:"100vh",margin:0,display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",position:"relative",overflow:"hidden"},bgLayer:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:`url(${g}) no-repeat center center fixed`,backgroundSize:"cover",filter:"blur(2px) contrast(0.8) brightness(0.5) saturate(1.6)",zIndex:0},pendulum:{display:"flex",borderStyle:"solid",borderWidth:"1vw 1vw 3vw 1vw",borderRadius:"3.25vw 3.25vw 0 0",padding:"0 4.5vw 2.25vw",height:"26vw",zIndex:1,borderImage:"linear-gradient(145deg, #b08d57, #f6e27a, #b08d57, #8c6b32) 1",borderImageSlice:1,backgroundColor:"transparent",boxShadow:`
    inset 0 0.25vw 0.5vw rgba(255, 255, 255, 0.5),
    inset 0 -0.25vw 0.5vw rgba(0, 0, 0, 0.5)
  `},piece:{transformOrigin:"center top",display:"flex",alignItems:"center",flexDirection:"column",width:"4.5vw",height:"22.5vw"},pieceFirstChild:{animation:"left 1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite alternate"},pieceLastChild:{animation:"right 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite alternate"}};return t.jsxs("div",{style:e.pendulumApp,children:[t.jsx("div",{style:e.bgLayer}),t.jsx("style",{children:`
        @keyframes left {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(45deg); }
        }
        @keyframes right {
          0% { transform: rotate(-45deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .piece::before {
          content: "";
          background: #F6E79DFF;
          width: 1px;
          height: 18vw;
        }






  .piece::after {
    content: attr(data-digit);
    border-radius: 50%;
    width: 4.5vw;
    height: 4.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'CustomFont', monospace;
    font-size: 5vw;
    color: #31041DFF;

    /* Chrome metallic gradient */
    background: radial-gradient(circle at 30% 30%, #ffffff 0%, #d0d0d0 40%, #888888 60%, #4d4d4d 90%);
    
    /* Add a subtle inner glow for more metallic feel */
    box-shadow: inset -0.2vw -0.2vw 0.4vw rgba(255,255,255,0.6),
                inset 0.2vw 0.2vw 0.4vw rgba(0,0,0,0.4),
                0 0.2vw 0.4vw rgba(0,0,0,0.3);
    
    border: 0.1vw solid #aaa; /* subtle metallic edge */
  }
`}),t.jsxs("div",{style:e.pendulum,children:[t.jsx("div",{style:{...e.piece,...e.pieceFirstChild},className:"piece"}),t.jsx("div",{style:e.piece,className:"piece"}),t.jsx("div",{style:e.piece,className:"piece"}),t.jsx("div",{style:e.piece,className:"piece"}),t.jsx("div",{style:e.piece,className:"piece"}),t.jsx("div",{style:{...e.piece,...e.pieceLastChild},className:"piece"})]})]})};export{h as default};
