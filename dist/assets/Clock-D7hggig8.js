import{r as a,j as e}from"./index-37WBs3jL.js";const v="/assets/sea-D8nf82Xi.mp4",m="/assets/sea-CwYABM2I.webp",p="/assets/naut-CVc7kJoz.ttf";function y(){const n=a.useRef(null),[i,l]=a.useState(!1),[c,g]=a.useState(window.innerHeight),[r,s]=a.useState(!1);a.useEffect(()=>{const o=()=>g(window.innerHeight);window.addEventListener("resize",o),new FontFace("Nautical",`url(${p})`).load().then(f=>{document.fonts.add(f),s(!0)});const d=n.current;return d&&d.play().catch(()=>l(!0)),()=>window.removeEventListener("resize",o)},[]);const t="60vmin";return e.jsxs("div",{style:{position:"relative",width:"100vw",height:`${c}px`,overflow:"hidden"},children:[!i&&e.jsx("video",{ref:n,src:v,poster:m,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,filter:"brightness(1.5) contrast(1.4) hue-rotate(-10deg)"},onError:()=>l(!0)}),i&&e.jsx("img",{src:m,alt:"Sea Fallback",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,filter:"brightness(1.4) contrast(1.4)"}}),e.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",zIndex:2,width:t,height:t,opacity:.7,borderRadius:"50%",animation:"hurricaneRock 5s ease-in-out infinite",transformStyle:"preserve-3d"},children:r&&e.jsx(x,{})}),e.jsx("style",{children:`
        @keyframes hurricaneRock {
          0% { transform: translate(-50%, -50%) rotateZ(-35deg) rotateX(10deg) rotateY(8deg) scale(0.9); }
          10% { transform: translate(-50%, -50%) rotateZ(30deg) rotateX(-8deg) rotateY(-10deg) scale(1.1); }
          20% { transform: translate(-50%, -50%) rotateZ(-28deg) rotateX(12deg) rotateY(9deg) scale(0.95); }
          30% { transform: translate(-50%, -50%) rotateZ(32deg) rotateX(-10deg) rotateY(-12deg) scale(1.08); }
          40% { transform: translate(-50%, -50%) rotateZ(-30deg) rotateX(8deg) rotateY(10deg) scale(0.97); }
          50% { transform: translate(-50%, -50%) rotateZ(28deg) rotateX(-12deg) rotateY(-8deg) scale(1.05); }
          60% { transform: translate(-50%, -50%) rotateZ(-32deg) rotateX(10deg) rotateY(12deg) scale(0.94); }
          70% { transform: translate(-50%, -50%) rotateZ(35deg) rotateX(-8deg) rotateY(-10deg) scale(1.1); }
          80% { transform: translate(-50%, -50%) rotateZ(-30deg) rotateX(12deg) rotateY(8deg) scale(0.95); }
          90% { transform: translate(-50%, -50%) rotateZ(32deg) rotateX(-10deg) rotateY(-12deg) scale(1.08); }
          100% { transform: translate(-50%, -50%) rotateZ(-35deg) rotateX(10deg) rotateY(8deg) scale(0.9); }
        }

        .brass-text {
          background: linear-gradient(
            135deg,
            #b58e33 0%,
            #DEC05BFF 30%,
            #FFFACD 50%,
            #996515 70%,
            #b58e33 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 2px rgba(255, 220, 120, 0.5);
        }

        // .clock-glow {
    
      `})]})}function x(){const n=a.useRef(null),i=a.useRef(null),l=a.useRef(null);a.useEffect(()=>{const r=()=>{const t=new Date,o=t.getSeconds(),u=t.getMinutes(),d=t.getHours()%12,f=o*6,h=u*6+o*.1,b=d*30+u*.5;n.current&&(n.current.style.transform=`rotate(${b}deg)`),i.current&&(i.current.style.transform=`rotate(${h}deg)`),l.current&&(l.current.style.transform=`rotate(${f}deg)`)};r();const s=setInterval(r,1e3);return()=>clearInterval(s)},[]);const c=(r,s,t)=>({position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",width:`${r}vmin`,height:`${s}vmin`,background:"linear-gradient(180deg, #E7C970FF 0%, #b8860b 50%, #5a3e0a 100%)",borderRadius:"0.5vmin",boxShadow:t}),g=[{num:12,angle:0},{num:3,angle:90},{num:6,angle:180},{num:9,angle:270}];return e.jsxs("div",{className:"clock-glow",style:{fontFamily:"Nautical, sans-serif",width:"100%",height:"100%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"},children:[g.map(({num:r,angle:s})=>{const t=40*Math.sin(s*Math.PI/180),o=-40*Math.cos(s*Math.PI/180);return e.jsx("div",{className:"brass-text",style:{position:"absolute",left:`calc(50% + ${t}%)`,top:`calc(50% + ${o}%)`,transform:"translate(-50%, -50%)",fontSize:"clamp(6vmin, 10vmin, 12vmin)"},children:r},r)}),e.jsx("div",{ref:n,style:c(1.5,20,"inset 0 0 0.5rem #2a1b00, 0 0 1rem rgba(255,200,100,0.5)")}),e.jsx("div",{ref:i,style:c(1,30,"inset 0 0 0.3rem #3a2b00, 0 0 1rem rgba(255,200,80,0.4)")}),e.jsx("div",{ref:l,style:c(.5,30,"inset 0 0 0.2rem #4a3400, 0 0 1rem rgba(255,200,80,0.4)")})]})}export{y as default};
