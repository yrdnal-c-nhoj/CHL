import{r as s,j as e}from"./index-B3uyj-Zi.js";const m="/assets/iss-zB-a6Iar.ttf",u=()=>{const[n,i]=s.useState(new Date);s.useEffect(()=>{const r=setInterval(()=>i(new Date),1e3);return()=>clearInterval(r)},[]);const o=r=>String(r).padStart(2,"0").split(""),[a,p]=o(n.getHours()),[l,c]=o(n.getMinutes()),[x,f]=o(n.getSeconds()),t={fontFace:`
      @font-face {
        font-family: 'iss';
        src: url(${m}) format('truetype');
      }
    `,iframe:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%) scale(1.0)",width:"100vw",height:"120vh",border:"none",zIndex:0,pointerEvents:"none"},wrapper:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:10},clockContainer:{display:"flex",flexWrap:"nowrap",justifyContent:"center",alignItems:"center",flexDirection:"row",gap:"1vh",fontFamily:"iss, sans-serif"},digitBox:{color:"transparent",textShadow:`
        #0c0d0c 1px 1px 0px,
        #f3f7f8 -1px 1px 0px,
        #87b5b7 1px -1px 0px,
        #444b7c -1px -1px 0px,
        #f0f2f4 3px -3px 0px,
        #6b5e9a -3px 3px 0px,
        #80a2a7 3px 3px 0px,
        #10100f -3px -3px 0px
      `,display:"flex",justifyContent:"center",alignItems:"center",fontSize:"18vh",width:"14vh",height:"20vh",textAlign:"center",boxSizing:"border-box",zIndex:19}};return e.jsxs("div",{style:{margin:0,padding:0,overflow:"hidden",width:"100vw",height:"100vh"},children:[e.jsx("style",{children:t.fontFace}),e.jsx("iframe",{src:"https://www.youtube-nocookie.com/embed/DIgkvm2nmHc?autoplay=1&mute=1&controls=0&si=_KKOlzjwM5GbxkM4",title:"YouTube video player",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,style:t.iframe}),e.jsx("div",{style:t.wrapper,children:e.jsx("div",{style:t.clockContainer,children:[a,p,l,c,x,f].map((r,d)=>e.jsx("div",{style:t.digitBox,children:r},d))})})]})};export{u as default};
