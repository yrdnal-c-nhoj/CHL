import{r as i,j as s}from"./index-Dvyih0c3.js";const v="/assets/bang-Bip4PLr6.ttf",w="/assets/fw-BtCY5VF0.webp",b="/assets/giphy-CCX5yupA.gif",k="/assets/84298-BngiFNaw.gif",C=()=>{const l=i.useRef(null);i.useEffect(()=>{const e=new FontFace("bang",`url(${v})`);e.load().then(()=>{document.fonts.add(e)})},[]),i.useEffect(()=>{const e=()=>{const g=new Date().toLocaleTimeString("en-US",{hour12:!1}).slice(0,5),o=l.current;if(o){o.innerHTML="",o.style.animation="none",o.offsetWidth,o.style.animation="riseUp 1.5s ease-out forwards";for(const a of g){const t=document.createElement("span");t.textContent=a,t.style.color=d(),t.style.fontSize=f(),t.style.fontWeight="bold",t.style.position="relative",t.style.display="inline-block",t.style.willChange="transform, opacity",t.style.textShadow="0 0 0.5rem white";const{dx:h,dy:u,rot:x}=y();t.style.setProperty("--dx",h),t.style.setProperty("--dy",u),t.style.setProperty("--rot",x),o.appendChild(t)}setTimeout(()=>{for(const a of o.children)a.style.animation="explodeWild 1.5s ease-out forwards"},1500)}};e();const r=setInterval(e,5e3);return()=>clearInterval(r)},[]);const d=()=>`hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`,f=()=>`${Math.floor(Math.random()*2)+4}rem`,y=()=>{const e=`${(Math.random()-.5)*80}vw`,r=`${(Math.random()-.5)*80}vh`,c=`${Math.random()*1440-720}deg`;return{dx:e,dy:r,rot:c}},m={fontFamily:"bang, sans-serif",margin:0,padding:0,background:"rgb(9, 9, 9)",height:"100vh",width:"100vw",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"flex-end",position:"relative"},n={position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",opacity:.7,filter:"saturate(1.3)",animation:"pulse 3s infinite alternate ease-in-out",zIndex:0},p={display:"flex",position:"relative",zIndex:50,flexWrap:"wrap",justifyContent:"center",alignItems:"center",gap:"0.5rem"};return s.jsxs("div",{style:m,children:[s.jsx("img",{src:w,alt:"bg1",style:n}),s.jsx("img",{src:b,alt:"bg2",style:n}),s.jsx("img",{src:k,alt:"bg3",style:n}),s.jsx("div",{ref:l,id:"clock",style:p}),s.jsx("style",{children:`
        @keyframes pulse {
          from {
            transform: scale(1);
            opacity: 0.6;
          }
          to {
            transform: scale(1.03);
            opacity: 0.75;
          }
        }

        @keyframes riseUp {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-70vh);
          }
        }

        @keyframes explodeWild {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(5) translate(var(--dx), var(--dy)) rotate(var(--rot));
          }
        }
      `})]})};export{C as default};
