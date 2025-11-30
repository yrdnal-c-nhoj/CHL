import{r as a,j as n}from"./index-_Zh6IFgu.js";const $="/assets/fr-MxU86B32.jpg",y="/assets/rococo-CTetRS4l.ttf";function S(){const[i,c]=a.useState(new Date),[l,d]=a.useState(0),[h,g]=a.useState(0);a.useEffect(()=>{const t=setInterval(()=>c(new Date),1e3),r=setInterval(()=>{d(e=>e+1),g(e=>e+1.337)},5e3);return()=>{clearInterval(t),clearInterval(r)}},[]);let o=i.getHours();const f=o>=12;o=o%12||12;const v=i.getMinutes().toString().padStart(2,"0"),u=`${o}:${v}`,s=t=>{let r=Math.sin(t)*12345;return r-Math.floor(r)},m=(t,r)=>{const e=(l+r+t.charCodeAt(0))*13.37;return{transform:`
        rotate(${-50+s(e)*100}deg)
        skewX(${-65+s(e+1)*130}deg)
        skewY(${-50+s(e+2)*100}deg)
        scale(${.5+s(e+3)*1.3}, ${.7+s(e+4)*.9})
        translateY(${-4+s(e+5)*8}vh)
      `,transition:"transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)"}},p=()=>{const t=h*17.77,r=s(t),e=s(t+1),b=s(t+2),x=s(t+3);return{transform:`
        rotate(${-40+r*80}deg)
        skewX(${-50+e*100}deg)
        scale(${.8+b*1.1}, ${.9+x*.9})
        translate(${-8+r*16}vh, ${-6+e*12}vh)
      `,transition:"transform 4.6s cubic-bezier(0.15, 0.92, 0.32, 0.99)"}};return n.jsxs("div",{style:{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:`url(${$})`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"'RococoBlob', serif",overflow:"hidden"},children:[n.jsx("style",{children:`
        @font-face {
          font-family: 'RococoBlob';
          src: url(${y}) format('truetype');
          font-weight: 800;
          font-display: swap;
        }
      `}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6vh",padding:"8vh 10vh",borderRadius:"10vh",background:"linear-gradient(135deg, #f7c6d3 0%, #b7e4c7 100%)",transform:"translateX(-12vh) rotate(-4deg)"},children:[n.jsx("div",{style:{display:"flex",alignItems:"center",gap:"1vh"},children:u.split("").map((t,r)=>n.jsx("span",{style:{display:"inline-block",fontSize:t===":"?"12vh":"14.5vh",fontWeight:800,lineHeight:"0.88",color:"#111",...t===":"?{transform:"translateY(-3vh) rotate(-22deg) scale(1.4, 2.2)",transition:"transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)"}:m(t,r)},children:t},r))}),n.jsx("div",{style:{fontSize:"5.5vh",fontWeight:900,background:"rgba(255,255,255,0.28)",padding:"2.5vh 5vh",borderRadius:"6vh",letterSpacing:"0.6vh",boxShadow:"inset 0 1vh 2vh rgba(255,255,255,0.4), 0 2vh 4vh rgba(0,0,0,0.2)",...p()},children:f?"PM":"AM"})]})]})}export{S as default};
