import{r as i,j as n}from"./index-B3uyj-Zi.js";const g="/assets/59bf80e17a216d0b052f12e3-BdOT1DE6.png",p="/assets/bad-BVkSebTt.png",x="/assets/Oswald-0PBiZmb6.ttf",k=()=>{const d=i.useRef(null),f=i.useRef(null),u=i.useRef(null),h=i.useRef(null),b=()=>{const e=h.current,s=e.offsetWidth,o=s*.45,r=s*.1;for(let c=1;c<=12;c++){const l=c*30*Math.PI/180,m=o*Math.sin(l),v=-o*Math.cos(l),a=document.createElement("div");a.className="number",a.style.left=`calc(50% + ${m}px - ${r/2}px)`,a.style.top=`calc(50% + ${v}px - ${r/2}px)`,a.textContent=c,e.appendChild(a)}},w=()=>{const e=new Date,s=e.getHours()%12,o=e.getMinutes(),r=e.getSeconds(),c=s*30+o*.5,l=o*6,m=r*6;d.current&&(d.current.style.transform=`translateX(-50%) rotate(${c}deg)`),f.current&&(f.current.style.transform=`translateX(-50%) rotate(${l}deg)`),u.current&&(u.current.style.transform=`translateX(-50%) rotate(${m}deg)`)};return i.useEffect(()=>{b(),w();const e=setInterval(w,1e3),s=()=>{h.current.querySelectorAll(".number").forEach(r=>r.remove()),b()};return window.addEventListener("resize",s),()=>{clearInterval(e),window.removeEventListener("resize",s)}},[]),n.jsxs("div",{style:t.body,children:[n.jsx("style",{children:`
        @font-face {
          font-family: 'Oswald';
          src: url(${x}) format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        .number {
          position: absolute;
          font-family: 'Oswald', sans-serif;
          font-size: 13vw;
          color: rgb(240, 7, 7);
          font-weight: bold;
          text-align: center;
          line-height: 3vw;
          z-index: 5;
        }
      `}),n.jsx("div",{style:t.clockWrapper,children:n.jsxs("div",{ref:h,style:t.clock,children:[n.jsx("img",{src:g,ref:d,style:{...t.hand,...t.hour},alt:"Hour"}),n.jsx("img",{src:g,ref:f,style:{...t.hand,...t.minute},alt:"Minute"}),n.jsx("img",{src:g,ref:u,style:{...t.hand,...t.second},alt:"Second"})]})}),n.jsx("img",{src:p,alt:"Background",style:t.bgImage})]})},t={body:{backgroundColor:"#deab34",height:"100vh",margin:0,overflow:"hidden",position:"relative",fontSize:"1rem"},clockWrapper:{position:"absolute",top:"50%",transform:"translateY(-50%)",display:"flex",justifyContent:"center",alignItems:"center",width:"100%",zIndex:7},clock:{width:"70vw",height:"70vw",maxWidth:"50vh",maxHeight:"50vh",borderRadius:"50%",position:"relative",zIndex:8},hand:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",zIndex:8,opacity:.9},hour:{width:"40vw",height:"54vw",transform:"translateX(-50%)"},minute:{width:"12vw",height:"75vw",transform:"translateX(-50%)",filter:"brightness(0.9) contrast(1.2)"},second:{width:"7.5vw",height:"80vw",transform:"translateX(-50%)",filter:"brightness(1.1) contrast(0.9)"},bgImage:{position:"absolute",bottom:0,right:0,width:"100%",height:"100%",objectFit:"cover",zIndex:4}};export{k as default};
