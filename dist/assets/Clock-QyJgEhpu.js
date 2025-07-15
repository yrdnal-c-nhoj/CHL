import{r as v,j as n}from"./index-Dd_Xc2Em.js";const w="/assets/humm-B-wv8gHC.ttf",u="/assets/hmm-H2fB6PFA.gif",x="/assets/humm-Kqae5Nik.png",I="/assets/hum1-B6N8lVVy.webp",k="/assets/hum2-BvsprTz_.webp",j="/assets/hum3-t5qzlg8r.webp",$="/assets/hum4-C7Hmj8S6.gif",H="/assets/hum7-BUNqiG0H.webp",z="/assets/hum8-DPLmMf0Y.gif",E="/assets/hum9-pDdiDfNF.webp",f=[{src:I,animation:"motion1"},{src:k,animation:"motion2"},{src:j,animation:"motion3"},{src:$,animation:"motion4"},{src:z,animation:"motion5"},{src:H,animation:"motion6"},{src:E,animation:"motion7"}],X=()=>(v.useEffect(()=>{const o=document.createElement("style");o.textContent=`
      @font-face {
        font-family: 'humm';
        src: url(${w}) format('truetype');
      }

      @keyframes motion1 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.3rem, 0.3rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion2 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-0.2rem, 0.4rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion3 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.5rem, -0.2rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion4 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.4rem, 0); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion5 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-0.3rem, 0.6rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion6 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0, 0.5rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion7 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.6rem, 0.3rem); }
        100% { transform: translate(0, 0); }
      }
    `,document.head.appendChild(o);const r=()=>{const a=new Date,s=a.getSeconds(),e=a.getMinutes(),i=a.getHours()%12,m=s*6,l=e*6+s/10,d=i*30+e/2;document.getElementById("second-hand").style.transform=`translateX(-50%) rotate(${m}deg)`,document.getElementById("minute-hand").style.transform=`translateX(-50%) rotate(${l}deg)`,document.getElementById("hour-hand").style.transform=`translateX(-50%) rotate(${d}deg)`},g=setInterval(r,1e3);r();const c=(a,s,e)=>{const i=Math.random()*(window.innerWidth-80),m=Math.random()*(window.innerHeight-80),l=[1200,1500,1e3,1300,800,1100,1400],d=["ease-in-out","ease-out","linear","ease-in","linear","ease-in-out","ease-out"],h=Math.random()*600+l[e],y=d[e];a.style.transition=`all ${h}ms ${y}`,a.style.left=`${i}px`,a.style.top=`${m}px`;const p=[.2,.18,.15,.22,.12,.17,.14],b=e<4?"ease-in-out":"linear";a.style.animation=`${s} ${p[e]}s infinite alternate ${b}`,setTimeout(()=>{c(a,s,e)},h)};return requestAnimationFrame(()=>{f.forEach((a,s)=>{const e=document.getElementById(`float-${s}`);if(e){e.style.position="absolute";const i=Math.random()*(window.innerWidth-80),m=Math.random()*(window.innerHeight-80);e.style.left=`${i}px`,e.style.top=`${m}px`,requestAnimationFrame(()=>{c(e,e.dataset.animation,s)})}})}),()=>clearInterval(g)},[]),n.jsxs("div",{style:t.body,children:[n.jsx("div",{style:{...t.bgImageLayer,backgroundImage:`url(${u})`,zIndex:1}}),n.jsx("div",{style:{...t.bgImageLayer,backgroundImage:`url(${u})`,transform:"scaleX(-1) rotate(90deg)",zIndex:2}}),n.jsx("img",{src:x,alt:"BG",style:t.bgImageFlipped}),n.jsxs("div",{style:t.clock,children:[n.jsx("div",{style:{...t.number,...t.numTwelve},children:"twelve"}),n.jsx("div",{style:{...t.number,...t.numThree},children:"three"}),n.jsx("div",{style:{...t.number,...t.numSix},children:"six"}),n.jsx("div",{style:{...t.number,...t.numNine},children:"nine"}),n.jsx("div",{id:"hour-hand",style:{...t.hand,...t.hourHand}}),n.jsx("div",{id:"minute-hand",style:{...t.hand,...t.minuteHand}}),n.jsx("div",{id:"second-hand",style:{...t.hand,...t.secondHand}})]}),f.map((o,r)=>n.jsx("img",{id:`float-${r}`,src:o.src,alt:`Float ${r}`,"data-animation":o.animation,style:t.floatingImage},r))]})),t={body:{margin:0,height:"100vh",width:"100vw",background:"#e478d4",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center",position:"relative"},bgImageLayer:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",opacity:.8,backgroundRepeat:"repeat",backgroundSize:"auto",zIndex:1,filter:"brightness(150%)"},bgImageFlipped:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",opacity:.8,zIndex:3,transform:"scaleX(-1)"},clock:{width:"95vh",height:"90vh",borderRadius:"50%",position:"relative",zIndex:5},number:{position:"absolute",fontFamily:"humm",fontSize:"14vh",color:"#0adb26",textShadow:"#f98f85 0 -2rem, #ed5ad2 0 2rem",opacity:.7,textAlign:"center",transformOrigin:"center"},numTwelve:{top:0,left:"50%",transform:"translateX(-50%) rotate(0deg)"},numThree:{top:"50%",right:0,transform:"translateY(-50%) rotate(90deg)"},numSix:{bottom:0,left:"50%",transform:"translateX(-50%) rotate(180deg)"},numNine:{top:"50%",left:0,transform:"translateY(-50%) rotate(270deg)"},hand:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom",borderRadius:"0.8rem",opacity:.6,zIndex:6},hourHand:{background:"#f534e2a6",width:"1.5rem",height:"6rem"},minuteHand:{background:"#fca99a",width:"1rem",height:"9rem"},secondHand:{background:"#34f504",width:"0.3rem",height:"16rem"},floatingImage:{position:"absolute",width:"8vh",height:"8vh",objectFit:"cover",borderRadius:"1rem",zIndex:7,pointerEvents:"none"}};export{X as default};
