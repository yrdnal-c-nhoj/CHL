import{r as B,j as v}from"./index-37WBs3jL.js";const g="/assets/dotted-B7F4ck4c.ttf";function R(){return B.useEffect(()=>{const r="ri-clock-2025-11-01",c="DottedRough2025_11_01";let d;const y=t=>{const e=new Date,a=e.getHours()%12||12,o=String(e.getMinutes()).padStart(2,"0");return t.textContent=e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),[...String(a)+o]},x=()=>{const t=[0,120,240,300];return`hsl(${t[Math.floor(Math.random()*t.length)]}, 70%, 50%)`},$=()=>"28vh",w=()=>(Math.random()*.5+.75).toFixed(2),l=()=>`${Math.floor(Math.random()*720-360)}deg`,F=()=>`${Math.floor(Math.random()*31-15)}deg`;function M(){const t=["top","bottom","left","right"][Math.floor(Math.random()*4)],e=100,a=100;switch(t){case"top":return{x:`${(Math.random()*e).toFixed(2)}vw`,y:"-10vh"};case"bottom":return{x:`${(Math.random()*e).toFixed(2)}vw`,y:"110vh"};case"left":return{x:"-10vw",y:`${(Math.random()*a).toFixed(2)}vh`};case"right":return{x:"110vw",y:`${(Math.random()*a).toFixed(2)}vh`};default:return{x:"0vw",y:"0vh"}}}const b=(t,e)=>{const a=y(e),o=document.createDocumentFragment(),s=a.length,i=45,h=20,C=30,u=5,S=8,E=x();a.forEach((k,z)=>{const n=document.createElement("span");n.className="digit",n.textContent=k;const A=(z-(s-1)/2)*S,D=`${(i+A+(Math.random()*h-h/2)).toFixed(2)}vw`,j=`${(C+(Math.random()*u-u/2)).toFixed(2)}vh`,q=w(),{x:I,y:T}=M(),p=10+Math.random()*8;n.style.cssText=`
          --x-start: ${I};
          --y-start: ${T};
          --x-final: ${D};
          --y-final: ${j};
          --scale: ${q};
          --rotate-x-start: ${l()};
          --rotate-y-start: ${l()};
          --rotate-z-start: ${l()};
          --rotate-z-final: ${F()};
          --digit-fs: ${$()};
          --anim-duration: ${p.toFixed(2)}s;
          color: ${E};
          opacity: 1;
        `,setTimeout(()=>{n.parentNode&&n.remove()},p*1e3),o.appendChild(n)}),t.appendChild(o)},f=()=>{const t=document.getElementById(r),e=document.getElementById("screen-reader-time");if(!t||!e)return;const a=1e3;let o=0;const s=i=>{i-o>=a&&(b(t,e),o=i-(i-o)%a),d=requestAnimationFrame(s)};d=requestAnimationFrame(s)},m=document.createElement("style");return m.setAttribute("data-scope",r),m.textContent=`
      @font-face {
        font-family: '${c}';
        src: url('${g}') format('truetype');
        font-display: swap;
      }
      #${r} {
        width: 100vw; height: 100vh; overflow: hidden;
        position: relative; font-family: '${c}', system-ui;
        background-image: linear-gradient(180deg, rgb(21 84 89) 0%, rgb(228 207 249) 100%);
      }
      #${r} .digit {
        position: absolute; left: 0; top: 0; will-change: transform, opacity;
        pointer-events: none; white-space: pre;
        font-size: var(--digit-fs, clamp(4rem, 6vh, 6rem));
        transform-origin: center center;
        transform-style: preserve-3d;
        animation: ri-fly-up var(--anim-duration, 12s) cubic-bezier(.2,.9,.3,1) forwards;
      }
      @keyframes ri-fly-up {
        0% { 
          transform: translate(var(--x-start), var(--y-start)) rotateX(var(--rotate-x-start)) rotateY(var(--rotate-y-start)) rotateZ(var(--rotate-z-start)) scale(var(--scale)); 
          opacity: 1; 
        }
        15%, 70% { 
          transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale)); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale)); 
          opacity: 0; 
        }
      }
      #${r} #screen-reader-time {
        position: absolute !important; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0);
        white-space: nowrap; border: 0;
      }
    `,document.head.appendChild(m),new FontFace(c,`url(${g})`,{style:"normal",weight:"400"}).load().then(t=>{document.fonts.add(t),f()}).catch(()=>f()),()=>{cancelAnimationFrame(d),document.querySelectorAll(`style[data-scope="${r}"]`).forEach(t=>t.remove()),document.querySelectorAll(`#${r} .digit`).forEach(t=>t.remove())}},[]),v.jsx("div",{id:"ri-clock-2025-11-01",role:"timer","aria-label":"Animated digital clock",children:v.jsx("time",{id:"screen-reader-time","aria-live":"polite"})})}export{R as default};
