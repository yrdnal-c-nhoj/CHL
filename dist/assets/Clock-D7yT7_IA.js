import{r as n,j as e}from"./index-37WBs3jL.js";const S=()=>{const[b,f]=n.useState(new Date),[a,p]=n.useState(!1),[r,u]=n.useState(!1),s=`ultraFont${new Date().getTime()}`;n.useEffect(()=>{const t=()=>{u(window.innerWidth<=768)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),n.useEffect(()=>{const t=document.createElement("style");return t.textContent=`
      @font-face {
        font-family: '${s}';
        src: local('JetBrains Mono'), local('SF Mono'), local('Menlo'), local('Monaco'), local('Consolas'), local('Fira Code'), local('monospace');
        font-display: block;
        font-weight: 100 900;
        font-variation-settings: 'wght' 900;
      }
    `,document.head.appendChild(t),(async()=>{await new Promise(d=>setTimeout(d,2500)),p(!0)})(),()=>{document.head.contains(t)&&document.head.removeChild(t)}},[s]),n.useEffect(()=>{if(!a)return;const t=setInterval(()=>f(new Date),1e3);return()=>clearInterval(t)},[a]);const y=t=>{let o=t.getHours();const d=t.getMinutes(),k=t.getSeconds();return o=o%12||12,{hours:o.toString().padStart(2,"0"),minutes:d.toString().padStart(2,"0"),seconds:k.toString().padStart(2,"0")}},{hours:c,minutes:g,seconds:m}=y(b),i={display:"inline-block",fontFamily:`${s}, 'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace`,fontWeight:"900",fontSize:r?"5vw":"6vw",lineHeight:"0.85",color:"#ffffff",textAlign:"center",background:`
      linear-gradient(135deg, 
        rgba(255,255,255,0.3) 0%, 
        rgba(255,255,255,0.15) 25%,
        rgba(147,51,234,0.2) 50%,
        rgba(59,130,246,0.2) 75%,
        rgba(0,0,0,0.3) 100%
      )
    `,borderRadius:"1.5rem",margin:r?"0.2rem":"0.3rem",padding:r?"0.8rem 0.6rem":"1.2rem 0.8rem",minWidth:r?"2.5rem":"3.5rem",border:"3px solid transparent",backgroundClip:"padding-box",backdropFilter:"blur(50px) saturate(220%) brightness(130%)",WebkitBackdropFilter:"blur(50px) saturate(220%) brightness(130%)",position:"relative",overflow:"hidden",transform:"translateZ(0) perspective(1200px)",transformStyle:"preserve-3d",transition:"all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",textShadow:`
      0 0 1.5rem rgba(255,255,255,1),
      0 0 3rem rgba(147,51,234,0.9),
      0 0 4.5rem rgba(59,130,246,0.9),
      0 0 6rem rgba(16,185,129,0.7),
      0 0 7.5rem rgba(245,101,101,0.5),
      0 0 9rem rgba(236,72,153,0.3)
    `,boxShadow:`
      0 0 3rem rgba(147,51,234,0.5),
      0 0 6rem rgba(59,130,246,0.4),
      0 0 9rem rgba(16,185,129,0.3),
      inset 0 1px 0 rgba(255,255,255,0.5),
      inset 0 -1px 0 rgba(0,0,0,0.3),
      0 3rem 6rem rgba(0,0,0,0.6)
    `,filter:"brightness(1.15) contrast(1.3) saturate(1.4)",animation:"float 7s ease-in-out infinite, rainbow-glow 6s ease-in-out infinite"},x={width:"100vw",height:"100dvh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:a?`
      radial-gradient(ellipse at top left, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #ec4899 100%),
      radial-gradient(ellipse at top right, #a8edea 0%, #fed6e3 20%, #ffecd2 40%, #fcb69f 60%, #667eea 80%, #f59e0b 100%),
      radial-gradient(ellipse at bottom left, #ff9a9e 0%, #fecfef 20%, #fecfef 40%, #667eea 60%, #764ba2 80%, #8b5cf6 100%),
      radial-gradient(ellipse at bottom right, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #10b981 100%),
      linear-gradient(45deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f0f23 60%, #000000 80%, #1e293b 100%)
    `:"#000000",backgroundSize:"500% 500%, 500% 500%, 500% 500%, 500% 500%, 100% 100%",backgroundBlendMode:"overlay, soft-light, color-dodge, multiply, normal",margin:0,padding:0,overflow:"hidden",position:"relative",animation:a?"aurora 25s ease-in-out infinite, fadeIn 4s ease-out":"none"},h={display:"flex",flexDirection:r?"column":"row",alignItems:"center",justifyContent:"center",gap:r?"1.5rem":"2rem",position:"relative",zIndex:10,animation:a?"entrance 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s both":"none",transform:"translateZ(0)",perspective:"1200px"},l={display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transform:"translateZ(60px)",animation:"group-float 9s ease-in-out infinite"},v={position:"absolute",top:0,left:0,right:0,bottom:0,opacity:.2,background:`
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 3%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 4%),
      radial-gradient(circle at 50% 5%, rgba(147,51,234,0.35) 0%, transparent 5%),
      radial-gradient(circle at 5% 50%, rgba(59,130,246,0.35) 0%, transparent 6%),
      radial-gradient(circle at 95% 95%, rgba(16,185,129,0.25) 0%, transparent 3%),
      radial-gradient(circle at 25% 75%, rgba(245,101,101,0.25) 0%, transparent 4%),
      radial-gradient(circle at 75% 25%, rgba(236,72,153,0.2) 0%, transparent 3%)
    `,backgroundSize:"350px 350px, 300px 300px, 450px 450px, 400px 400px, 250px 250px, 320px 320px, 280px 280px",animation:"cosmic-drift 35s linear infinite, twinkle 3s ease-in-out infinite"},w={position:"absolute",top:0,left:0,right:0,bottom:0,background:`
      linear-gradient(90deg, 
        transparent 0%, 
        rgba(147,51,234,0.15) 15%, 
        rgba(59,130,246,0.15) 30%, 
        rgba(16,185,129,0.15) 45%, 
        rgba(245,101,101,0.15) 60%, 
        rgba(236,72,153,0.15) 75%, 
        transparent 100%
      )
    `,animation:"aurora-sweep 15s ease-in-out infinite",zIndex:2};return a?e.jsxs("div",{style:x,children:[e.jsx("div",{style:v}),e.jsx("div",{style:w}),e.jsxs("div",{style:h,children:[e.jsxs("div",{style:{...l,animationDelay:"0s"},children:[e.jsx("div",{style:{...i,animationDelay:"0.1s"},children:c[0]}),e.jsx("div",{style:{...i,animationDelay:"0.2s"},children:c[1]})]}),e.jsxs("div",{style:{...l,animationDelay:"1.2s"},children:[e.jsx("div",{style:{...i,animationDelay:"0.3s"},children:g[0]}),e.jsx("div",{style:{...i,animationDelay:"0.4s"},children:g[1]})]}),e.jsxs("div",{style:{...l,animationDelay:"2.4s"},children:[e.jsx("div",{style:{...i,animationDelay:"0.5s"},children:m[0]}),e.jsx("div",{style:{...i,animationDelay:"0.6s"},children:m[1]})]})]}),e.jsx("style",{children:`
        @keyframes aurora {
          0%, 100% { background-position: 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%; }
          20% { background-position: 100% 50%, 25% 75%, 75% 25%, 50% 100%, 0% 50%; }
          40% { background-position: 50% 100%, 100% 50%, 50% 0%, 0% 50%, 0% 50%; }
          60% { background-position: 25% 25%, 75% 25%, 25% 75%, 75% 75%, 0% 50%; }
          80% { background-position: 75% 75%, 0% 25%, 100% 75%, 50% 50%, 0% 50%; }
          100% { background-position: 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8) rotate(5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes entrance {
          0% { opacity: 0; transform: translateY(10rem) rotateX(60deg) scale(0.7); filter: blur(3rem); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg) scale(1); filter: blur(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          25% { transform: translateY(-0.8rem) rotateX(3deg) rotateY(1deg); }
          50% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          75% { transform: translateY(0.5rem) rotateX(-2deg) rotateY(-1deg); }
        }
        @keyframes group-float {
          0%, 100% { transform: translateZ(60px) rotateY(0deg) rotateX(0deg); }
          33% { transform: translateZ(70px) rotateY(3deg) rotateX(1deg); }
          66% { transform: translateZ(50px) rotateY(-3deg) rotateX(-1deg); }
        }
        @keyframes rainbow-glow {
          0% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(147,51,234,0.9), 0 0 4.5rem rgba(59,130,246,0.9), 0 0 6rem rgba(16,185,129,0.7); }
          20% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(59,130,246,0.9), 0 0 4.5rem rgba(16,185,129,0.9), 0 0 6rem rgba(245,101,101,0.7); }
          40% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(16,185,129,0.9), 0 0 4.5rem rgba(236,72,153,0.9), 0 0 6rem rgba(59,130,246,0.7); }
          60% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(236,72,153,0.9), 0 0 4.5rem rgba(245,101,101,0.9), 0 0 6rem rgba(147,51,234,0.7); }
          80% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(245,101,101,0.9), 0 0 4.5rem rgba(147,51,234,0.9), 0 0 6rem rgba(16,185,129,0.7); }
          100% { text-shadow: 0 0 1.5rem rgba(255,255,255,1), 0 0 3rem rgba(147,51,234,0.9), 0 0 4.5rem rgba(59,130,246,0.9), 0 0 6rem rgba(16,185,129,0.7); }
        }
        @keyframes cosmic-drift {
          0% { background-position: 0% 0%, 0% 0%, 0% 0%; }
          100% { background-position: 100% 100%, -100% -100%, 100% -100%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes aurora-sweep {
          0%, 100% { transform: translateX(-20%) scaleX(1); opacity: 0.2; }
          50% { transform: translateX(120%) scaleX(1.5); opacity: 0.5; }
        }
        @keyframes premium-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes glow-text {
          0% { text-shadow: 0 0 0.5rem rgba(255,255,255,0.3); opacity: 0.6; }
          100% { text-shadow: 0 0 2rem rgba(147,51,234,0.8), 0 0 4rem rgba(59,130,246,0.6); opacity: 1; }
        }
      `})]}):e.jsxs("div",{style:{width:"100vw",height:"100dvh",background:"radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)",margin:0,padding:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[e.jsxs("div",{style:{position:"relative",width:"8rem",height:"8rem",marginBottom:"2rem"},children:[e.jsx("div",{style:{position:"absolute",width:"100%",height:"100%",border:"4px solid transparent",borderTop:"4px solid rgba(147,51,234,0.9)",borderRight:"4px solid rgba(59,130,246,0.7)",borderRadius:"50%",animation:"premium-spin 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite"}}),e.jsx("div",{style:{position:"absolute",width:"85%",height:"85%",top:"7.5%",left:"7.5%",border:"3px solid transparent",borderTop:"3px solid rgba(16,185,129,0.9)",borderLeft:"3px solid rgba(245,101,101,0.7)",borderRadius:"50%",animation:"premium-spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse"}}),e.jsx("div",{style:{position:"absolute",width:"70%",height:"70%",top:"15%",left:"15%",background:"radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",borderRadius:"50%",animation:"pulse 2.5s ease-in-out infinite"}}),e.jsx("div",{style:{position:"absolute",width:"40%",height:"40%",top:"30%",left:"30%",background:"radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",borderRadius:"50%",animation:"pulse 1.5s ease-in-out infinite reverse"}})]}),e.jsx("div",{style:{color:"rgba(255,255,255,0.8)",fontSize:"1.2rem",fontFamily:"monospace",letterSpacing:"0.3rem",textTransform:"uppercase",animation:"glow-text 2.5s ease-in-out infinite alternate"},children:"Initializing Cosmos..."})]})};export{S as default};
