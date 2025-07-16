import{r as l,j as t}from"./index-BREfQhwF.js";const d="/assets/blu-C7FtDCpo.otf",g="/assets/8mMt-D1IblEaj.gif",h="/assets/13966281486_Volantis_Tumblr-BG7EbBKs.gif",m="/assets/bloo-rhwWrLJu.gif",p=()=>{const[s,r]=l.useState(new Date);l.useEffect(()=>{const a=setInterval(()=>r(new Date),1e3);return()=>clearInterval(a)},[]);const i=a=>String(a).padStart(2,"0"),n=i(s.getHours()),o=i(s.getMinutes()),c=i(s.getSeconds());return t.jsxs("div",{style:e.container,children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'blu';
            src: url(${d}) format('opentype');
            font-display: swap;
          }

          html, body, #root {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: black;
            font-family: 'blu', monospace;
          }

          .clock {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            z-index: 10;
          }

          .digit {
            font-size: 19vh;
            width: 6vw;
            height: 10vh;
            text-align: center;
            color: #7BC8C8FF;
            line-height: 10vh;
            text-shadow: 0 0 10px #fff, 0 0 20px #00f, 0 0 30px #0ff;
            user-select: none;
            font-variant-numeric: tabular-nums;
          }

          }
        `}),t.jsx("img",{src:g,alt:"bg1",style:e.image1}),t.jsx("img",{src:h,alt:"bg2",style:e.image2}),t.jsx("img",{src:m,alt:"bg3",style:e.image3}),t.jsxs("div",{className:"clock",style:e.clock,children:[t.jsx("span",{className:"digit",children:n[0]}),t.jsx("span",{className:"digit",children:n[1]}),t.jsx("span",{className:"digit",children:o[0]}),t.jsx("span",{className:"digit",children:o[1]}),t.jsx("span",{className:"digit",children:c[0]}),t.jsx("span",{className:"digit",children:c[1]})]})]})},e={container:{height:"100vh",width:"100vw",overflow:"hidden",position:"relative",background:"black"},clock:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},image1:{position:"fixed",top:0,left:0,width:"300vw",height:"100vh",objectFit:"cover",zIndex:1,opacity:.8,transform:"scaleX(-1) scaleY(-1)",filter:"contrast(150%) brightness(150%)"},image2:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",objectFit:"cover",zIndex:2,opacity:.4,transform:"scaleX(-1) scaleY(-1)"},image3:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",objectFit:"cover",zIndex:3,opacity:.3,transform:"scaleX(-1)"}};export{p as default};
