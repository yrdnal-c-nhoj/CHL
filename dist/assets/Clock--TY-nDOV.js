import{r as c,j as o}from"./index-Dvyih0c3.js";const w="/assets/conf-CJJ480jK.ttf",Z="/assets/conf2-Bq8Zq7VN.gif",h=160,M=()=>{const l=c.useRef(null),n=c.useRef([]);c.useEffect(()=>{const e=new FontFace("conf",`url(${w})`);e.load().then(()=>{document.fonts.add(e)})},[]);const f=()=>{const e=new Date,a=e.getHours().toString().padStart(2,"0").split(""),r=e.getMinutes().toString().padStart(2,"0").split("");return[...a,...r]};return c.useEffect(()=>{const e=l.current;if(e){e.innerHTML="",n.current=[];for(let a=0;a<h;a++){const r=document.createElement("div");r.className="falling-digit",e.appendChild(r),n.current.push(r)}}},[]),c.useEffect(()=>{if(n.current.length===0)return;const e=["#ff1493","#800080","#ffa500"],a=["ease-in","ease-out","ease-in-out","cubic-bezier(0.25, 1, 0.5, 1)","cubic-bezier(0.42, 0, 0.58, 1)","cubic-bezier(0.6, -0.28, 0.735, 0.045)"];n.current.forEach((t,s)=>{const i=Math.random()*12+4;t.style.fontSize=`${i}vh`,t.style.fontFamily="'conf', sans-serif",t.style.color=e[Math.floor(Math.random()*e.length)],t.style.position="absolute",t.style.opacity="0.95",t.style.pointerEvents="none",t.style.willChange="transform",t.style.zIndex="2",t.style.left=`${Math.random()*100}vw`,t.style.top="0";const v=Math.random()*8+3,u=s/h*v,m=Math.random()*1080-540,p=Math.random()*1080-540,g=Math.random()*1080-540,y=Math.random()*40-20,X=120,Y=a[Math.floor(Math.random()*a.length)],x=Math.random()>.5?"leafFall":"fall3d";t.style.animation=`${x} ${v}s ${Y} infinite`,t.style.animationDelay=`-${u}s`,t.style.setProperty("--rotateX",`${m}deg`),t.style.setProperty("--rotateY",`${p}deg`),t.style.setProperty("--rotateZ",`${g}deg`),t.style.setProperty("--translateX",`${y}vw`),t.style.setProperty("--translateY",`${X}vh`)});const r=setInterval(()=>{const t=f();n.current.forEach((s,i)=>{s.textContent=t[i%t.length]})},1e4),d=f();return n.current.forEach((t,s)=>{t.textContent=d[s%d.length]}),()=>clearInterval(r)},[]),o.jsxs(o.Fragment,{children:[o.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"linear-gradient(to top, #ff0000, #ffff00)",zIndex:0}}),o.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${Z})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",zIndex:1,pointerEvents:"none"}}),o.jsx("div",{ref:l,style:{margin:0,overflow:"hidden",position:"fixed",top:0,left:0,width:"100vw",height:"100vh",pointerEvents:"none",userSelect:"none",zIndex:2}}),o.jsx("style",{children:`
        @keyframes fall3d {
          0% {
            transform: translateY(-20vh) translateX(0vw)
                       rotateX(0) rotateY(0) rotateZ(0);
            opacity: 1;
          }
          100% {
            transform:
              translateY(120vh) translateX(var(--translateX))
              rotateX(var(--rotateX))
              rotateY(var(--rotateY))
              rotateZ(var(--rotateZ));
            opacity: 1;
          }
        }

        @keyframes leafFall {
          0% {
            transform: translateY(-20vh) translateX(0vw)
                       rotateX(0) rotateY(0) rotateZ(0);
            opacity: 1;
          }
          25% {
            transform: translateY(30vh) translateX(calc(var(--translateX) * 0.3))
                       rotateX(calc(var(--rotateX) * 0.25))
                       rotateY(calc(var(--rotateY) * 0.25))
                       rotateZ(calc(var(--rotateZ) * 0.25));
            opacity: 1;
          }
          50% {
            transform: translateY(60vh) translateX(calc(var(--translateX) * -0.3))
                       rotateX(calc(var(--rotateX) * 0.5))
                       rotateY(calc(var(--rotateY) * 0.5))
                       rotateZ(calc(var(--rotateZ) * 0.5));
            opacity: 1;
          }
          75% {
            transform: translateY(90vh) translateX(calc(var(--translateX) * 0.3))
                       rotateX(calc(var(--rotateX) * 0.75))
                       rotateY(calc(var(--rotateY) * 0.75))
                       rotateZ(calc(var(--rotateZ) * 0.75));
            opacity: 1;
          }
          100% {
            transform:
              translateY(120vh) translateX(var(--translateX))
              rotateX(var(--rotateX))
              rotateY(var(--rotateY))
              rotateZ(var(--rotateZ));
            opacity: 1;
          }
        }

        .falling-digit {
          user-select: none;
          pointer-events: none;
          position: absolute;
          font-weight: 700;
          mix-blend-mode: screen;
          will-change: transform;
        }
      `})]})};export{M as default};
