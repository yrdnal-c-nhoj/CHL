import{r as z,j as c}from"./index-CGhn_q7G.js";const E="/assets/tor-CT_XWY8t.gif",I="/assets/speed-CxG0G7qT.ttf",T=()=>(z.useEffect(()=>{const g=new Date;let d=g.getHours();const H=g.getMinutes();d=d%12||12;const f=`${d}${H.toString().padStart(2,"0")}`,u=100;let w=window.innerWidth/2;window.addEventListener("resize",()=>{w=window.innerWidth/2});function y(){return f[Math.floor(Math.random()*f.length)]}function o(t,e){return Math.floor(Math.random()*(e-t+1)+t)}function M(t){function e(){const n=o(90,140),r=o(50,90),s=o(30,60);return`rgb(${n},${r},${s})`}function h(){const n=o(10,40);return`rgb(${n},${n},${n})`}function b(){const n=o(60,100),r=Math.min(n+o(10,30),255),s=n,m=Math.max(n-o(10,30),0);return`rgb(${r},${s},${m})`}const l=Math.random();return l<.4?e():l<.7?h():b()}function P(){const t=document.createElement("span");t.className="tornado-letter";const e=y();return t.textContent=e,t.style.color=M(),t.style.fontSize=`${o(1,16)}vh`,t.setAttribute("aria-hidden","true"),document.body.appendChild(t),t}const k=Array.from({length:u},(t,e)=>({el:P(),angle:Math.random()*2*Math.PI,baseHeight:e/u*window.innerHeight,speed:Math.random()*.2+.2,wobblePhase:Math.random()*2*Math.PI,wobbleFreq:Math.random()*.15+.1,wobbleAmp:Math.random()*40+20,secondaryWobblePhase:Math.random()*2*Math.PI,secondaryWobbleFreq:Math.random()*.2+.05}));let a=0;function v(){requestAnimationFrame(v),a+=.01;const t=Math.sin(a)*50;k.forEach(e=>{e.angle+=e.speed*.05,e.baseHeight-=e.speed+Math.sin(a+e.wobblePhase)*.2,e.baseHeight<-50&&(e.baseHeight=window.innerHeight+50,e.el.textContent=y(),e.el.style.color=M(e.el.textContent),e.el.style.fontSize=`${o(3,8)}vh`,e.angle=Math.random()*2*Math.PI,e.wobblePhase=Math.random()*2*Math.PI,e.secondaryWobblePhase=Math.random()*2*Math.PI);const b=30+(1-e.baseHeight/window.innerHeight)*200,l=Math.sin(a+e.wobblePhase)*15,n=b+l,r=Math.sin(a*e.wobbleFreq+e.wobblePhase)*e.wobbleAmp+Math.cos(a*e.secondaryWobbleFreq+e.secondaryWobblePhase)*(e.wobbleAmp*.5),s=w+t+Math.cos(e.angle)*n+r,m=e.baseHeight,$=.5+e.baseHeight/window.innerHeight*1.5,C=e.angle*50;e.el.style.transform=`translate(${s}px, ${m}px) scale(${$}) rotate(${C}deg)`,e.el.style.zIndex=Math.floor($*100)})}v();const i=document.getElementById("flash-overlay");function p(t){i&&(i.style.backgroundColor=t,i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},50))}function x(){const t=Math.random()*2e3+1e3;setTimeout(()=>{const e=Math.random()<.5?"white":"black";p(e),x()},t)}x()},[]),c.jsxs("div",{className:"tornado-clock",children:[c.jsx("style",{children:`
          @font-face {
            font-family: 'speed';
            src: url(${I}) format('truetype');
          }

          .tornado-clock {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: radial-gradient(ellipse at center, #8d906e 0%, #eaf5a2 100%);
            background-color: rgb(184, 204, 168);
            font-family: 'speed', sans-serif;
          }

          .tornado-letter {
            position: absolute;
            pointer-events: none;
            will-change: transform;
            font-family: 'speed', Arial, sans-serif;
          }

          .tornado-clock .bgimage {
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

          .tornado-clock #flash-overlay {
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
        `}),c.jsx("img",{src:E,className:"bgimage",alt:"Tornado Background"}),c.jsx("div",{id:"flash-overlay"})]}));export{T as default};
