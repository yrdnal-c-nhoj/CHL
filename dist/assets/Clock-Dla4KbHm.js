import{r as h,j as t}from"./index-CQ6_D-kb.js";const g="/assets/banana-ClkXZroS.gif",f="/assets/baaa-CvPaoeNs.png",u="/assets/bana-Baw4frJC.png",p="/assets/ban-qbg91qXt.png",y="/assets/Ban-D9xkAfAA.ttf",b=()=>{h.useEffect(()=>{const e=()=>{const s=new Date,a=s.getSeconds(),o=s.getMinutes(),l=s.getHours()%12,d=a*6,c=o*6+a*.1,m=l*30+o*.5;document.getElementById("secondHand").style.transform=`translate(-50%, -100%) rotate(${d}deg)`,document.getElementById("minuteHand").style.transform=`translate(-50%, -100%) rotate(${c}deg)`,document.getElementById("hourHand").style.transform=`translate(-50%, -100%) rotate(${m}deg)`},n=setInterval(e,1e3);return e(),()=>clearInterval(n)},[]);const r=8*8,i=Array.from({length:r},(e,n)=>t.jsx("img",{src:g,alt:"banana tile",style:{width:"15vw",height:"15vw",objectFit:"cover"}},n));return t.jsxs("div",{style:{margin:0,padding:0,width:"100vw",height:"100vh",overflow:"hidden",position:"relative",backgroundColor:"#000",fontSize:"13px"},children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'Ban';
          src: url(${y}) format('truetype');
        }
      `}),t.jsx("div",{style:{position:"absolute",top:0,left:0,display:"grid",gridTemplateColumns:"repeat(8, 15vw)",gridAutoRows:"15vw",width:"100%",height:"100%",zIndex:0},children:i}),t.jsxs("div",{className:"clock",style:{position:"absolute",top:"47%",left:"55%",width:"70vmin",height:"70vmin",transform:"translate(-50%, -50%)",pointerEvents:"none"},children:[t.jsx("img",{src:f,alt:"hour",className:"hand hour-hand",id:"hourHand",style:{position:"absolute",top:"50%",left:"50%",width:"25%",height:"20%",transformOrigin:"50% 100%",zIndex:3,filter:"brightness(160%)"}}),t.jsx("img",{src:u,alt:"minute",className:"hand minute-hand",id:"minuteHand",style:{position:"absolute",top:"50%",left:"50%",width:"28%",height:"40%",transformOrigin:"50% 100%",zIndex:2,filter:"contrast(150%)"}}),t.jsx("img",{src:p,alt:"second",className:"hand second-hand",id:"secondHand",style:{position:"absolute",top:"50%",left:"50%",width:"22%",height:"50%",transformOrigin:"50% 100%",zIndex:4}}),[[12,"10%","50%"],[1,"19%","73%"],[2,"36%","87%"],[3,"50%","92%"],[4,"64%","87%"],[5,"81%","73%"],[6,"90%","50%"],[7,"81%","27%"],[8,"64%","13%"],[9,"50%","8%"],[10,"36%","13%"],[11,"19%","27%"]].map(([e,n,s])=>t.jsx("div",{style:{position:"absolute",top:n,left:s,fontFamily:"Ban, sans-serif",color:"rgb(247, 227, 6)",textShadow:"#af8704 0.5rem 0.5rem, #483909 -0.1rem -0.1rem",fontSize:"8rem",fontWeight:"bold",opacity:.7,width:"10%",textAlign:"center",transform:"translate(-190%, -50%)"},children:e},e))]}),t.jsx("style",{children:`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(-360deg) scale(1.5); }
        }
        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `})]})};export{b as default};
