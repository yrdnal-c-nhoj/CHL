import{r as p,j as c}from"./index-CRYDvM5t.js";const z="/assets/tor-CT_XWY8t.gif",C="/assets/speed-CxG0G7qT.ttf",F=()=>(p.useEffect(()=>{const f=new Date;let d=f.getHours();const _=f.getMinutes();d=d%12||12;const u=`${d}${_.toString().padStart(2,"0")}`,w=100;let h=window.innerWidth/2;window.addEventListener("resize",()=>{h=window.innerWidth/2});function y(){return u[Math.floor(Math.random()*u.length)]}function n(t,e){return Math.floor(Math.random()*(e-t+1)+t)}function M(t){function e(){const o=n(90,140),r=n(50,90),s=n(30,60);return`rgb(${o},${r},${s})`}function m(){const o=n(10,40);return`rgb(${o},${o},${o})`}function b(){const o=n(60,100),r=Math.min(o+n(10,30),255),s=o,g=Math.max(o-n(10,30),0);return`rgb(${r},${s},${g})`}const l=Math.random();return l<.4?e():l<.7?m():b()}function H(){const t=document.createElement("span");t.className="tornado-clock__letter";const e=y();return t.textContent=e,t.style.color=M(),t.style.fontSize=`${n(1,16)}vh`,t.setAttribute("aria-hidden","true"),document.body.appendChild(t),t}const v=Array.from({length:w},(t,e)=>({el:H(),angle:Math.random()*2*Math.PI,baseHeight:e/w*window.innerHeight,speed:Math.random()*.2+.2,wobblePhase:Math.random()*2*Math.PI,wobbleFreq:Math.random()*.15+.1,wobbleAmp:Math.random()*2+1,secondaryWobblePhase:Math.random()*2*Math.PI,secondaryWobbleFreq:Math.random()*.2+.05}));let a=0;function x(){requestAnimationFrame(x),a+=.01;const t=Math.sin(a)*5;v.forEach(e=>{e.angle+=e.speed*.05,e.baseHeight-=e.speed+Math.sin(a+e.wobblePhase)*.2,e.baseHeight<-5&&(e.baseHeight=window.innerHeight+5,e.el.textContent=y(),e.el.style.color=M(e.el.textContent),e.el.style.fontSize=`${n(3,8)}vh`,e.angle=Math.random()*2*Math.PI,e.wobblePhase=Math.random()*2*Math.PI,e.secondaryWobblePhase=Math.random()*2*Math.PI);const b=3+(1-e.baseHeight/window.innerHeight)*20,l=Math.sin(a+e.wobblePhase)*1.5,o=b+l,r=Math.sin(a*e.wobbleFreq+e.wobblePhase)*e.wobbleAmp+Math.cos(a*e.secondaryWobbleFreq+e.secondaryWobblePhase)*(e.wobbleAmp*.5),s=h/window.innerWidth*100+t+Math.cos(e.angle)*o+r,g=e.baseHeight/window.innerHeight*100,$=.5+e.baseHeight/window.innerHeight*1.5,E=e.angle*50;e.el.style.transform=`translate(${s}vw, ${g}vh) scale(${$}) rotate(${E}deg)`,e.el.style.zIndex=Math.floor($*100)})}x();const i=document.getElementById("tornado-clock__flash-overlay");function P(t){i&&(i.style.backgroundColor=t,i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},50))}function k(){const t=Math.random()*2e3+1e3;setTimeout(()=>{const e=Math.random()<.5?"white":"black";P(e),k()},t)}return k(),()=>{v.forEach(t=>t.el.remove()),window.removeEventListener("resize",()=>{h=window.innerWidth/2})}},[]),c.jsxs("div",{className:"tornado-clock",children:[c.jsx("style",{children:`
          @font-face {
            font-family: 'speed';
            src: url(${C}) format('truetype');
          }

          .tornado-clock {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: radial-gradient(ellipse at center, #8d906e 0%, #eaf5a2 100%);
            background-color: rgb(184, 204, 168);
            font-family: 'speed', sans-serif;
            isolation: isolate;
          }

          .tornado-clock__letter {
            position: absolute;
            pointer-events: none;
            will-change: transform;
            font-family: 'speed', Arial, sans-serif;
          }

          .tornado-clock__bgimage {
            background-size: cover;
            background-position: center;
            position: absolute;
            height: 100vh;
            width: 100vw;
            transform: scaleX(-1);
            z-index: 1;
            opacity: 0.3;
            filter: contrast(0.2) invert(5.0);
          }

          .tornado-clock__flash-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            transition: opacity 0.1s ease;
            z-index: 3;
            opacity: 0;
          }
        `}),c.jsx("img",{src:z,className:"tornado-clock__bgimage",alt:"Tornado Background"}),c.jsx("div",{id:"tornado-clock__flash-overlay"})]}));export{F as default};
