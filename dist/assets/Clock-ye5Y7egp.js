import{r as s,j as n}from"./index-Bgm5-oK8.js";const b="/assets/z-Bn69_ZWI.gif",x="/assets/z2-D14x0fNY.gif",y="/assets/z3-DfSjcixQ.gif",z="/assets/z4-Bu9WuJhO.gif",j="/assets/z5-C7-ogJxR.gif",k="/assets/z6-Cgfd-1il.gif",R="/assets/z7-DaxThNfc.gif",I="/assets/z8-ciwLdcq5.webp",N="/assets/z9-hIOS73gU.webp",A="/assets/z10-DKtvpQ6-.gif",C="/assets/z11-GF2VAZgs.gif",H="/assets/z12-CzvwXqb6.gif",u="/assets/steth-ACJHZNgr.png",f="/assets/sss-fWHA3UqT.webp",w="/assets/ste-BbPcZy8c.gif";function D(){const c=s.useRef(null),d=s.useRef(null),h=s.useRef(null),g=s.useRef(null),[l,p]=s.useState(!1),r=s.useMemo(()=>[z,b,x,C,H,j,k,R,I,N,y,A],[]);s.useEffect(()=>{const i=[...r,u,f,w];Promise.all(i.map(t=>new Promise(a=>{const e=new Image;e.onload=e.onerror=a,e.src=t}))).then(()=>p(!0))},[r]);const v=s.useMemo(()=>r.map((i,t)=>{const a=t/12*2*Math.PI,e=42,o=50+e*Math.sin(a),m=50-e*Math.cos(a);return n.jsx("img",{src:i,alt:`digit-${t}`,className:"clock-digit",style:{position:"absolute",top:`${m}%`,left:`${o}%`,transform:"translate(-50%, -50%)",width:"auto"}},t)}),[r]);return s.useEffect(()=>{if(!l)return;const i=()=>{const t=new Date,a=t.getMilliseconds()/1e3,e=t.getSeconds()+a,o=t.getMinutes()+e/60,m=t.getHours()%12+o/60;h.current&&(h.current.style.transform=`translateX(-50%) rotate(${e/60*360}deg)`),d.current&&(d.current.style.transform=`translateX(-50%) rotate(${o/60*360}deg)`),c.current&&(c.current.style.transform=`translateX(-50%) rotate(${m/12*360}deg)`),g.current=requestAnimationFrame(i)};return g.current=requestAnimationFrame(i),()=>cancelAnimationFrame(g.current)},[l]),l?n.jsxs("div",{style:{height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",background:"radial-gradient(circle, rgba(123,120,120,0.8) 0%, rgba(159,116,10,0.3) 80%)"},children:[n.jsxs("div",{className:"clock-face",children:[v,n.jsx("img",{ref:c,src:u,alt:"hour-hand",className:"hour-hand"}),n.jsx("img",{ref:d,src:f,alt:"minute-hand",className:"minute-hand"}),n.jsx("img",{ref:h,src:w,alt:"second-hand",className:"second-hand"})]}),n.jsx("style",{children:`
        /* Clock Face */
        .clock-face {
          position: relative;
          border-radius: 50%;
          box-shadow: inset -1.2rem -1.2rem 2.4rem rgba(0,0,0,0.15),
                      inset 1.2rem 1.2rem 2.4rem rgba(220,235,255,0.15),
                      0 1.5rem 3rem rgba(90,0,0,0.15);
          background: radial-gradient(circle at center,
                      rgba(210,260,10,0.15) 10%,
                      rgba(260,280,60,0.15) 90%);
          width: 100vw;
          height: 100vw;
        }

        /* Digits */
        .clock-digit {
          height:16vh; /* phones */
        }
        @media (min-width: 768px) {
          .clock-face {
            width: 90vh;
            height: 90vh;
          }
          .clock-digit {
            height: 12vw; /* laptops/desktops */
          }
        }

        /* Hands */
        .hour-hand, .minute-hand, .second-hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          will-change: transform;
        }

        .hour-hand {
          opacity: 0.9;
          width: 9vmin;
          height: 22vmin;
        }
        .minute-hand {
          opacity: 0.8;
          width: 12vmin;
          height: 35vmin;
        }
        .second-hand {
          width: 32vmin;
          height: 40vmin;
        }

        @media (min-width: 768px) {
          .hour-hand {
            width: 16vh;
            height: 17vh;
          }
          .minute-hand {
            width: 12vh;
            height: 33vh;
          }
          .second-hand {
            width: 32vh;
            height: 38vh;
          }
        }
      `})]}):null}export{D as default};
