import{r as I,j as n}from"./index-DyJr5cre.js";const j="/assets/kla-e4sVwpHZ.webp",F="/assets/klax-DRSXN1QX.png",z="/assets/klaxon-C7GY-biL.png",C="/assets/kla-AZCilWpQ.png",H="/assets/klax-_ZDNIFwR.ttf",S=["xii","i","ii","iii","iv","v","vi","vii","viii","ix","x","xi"],M=()=>(I.useEffect(()=>{const u=document.createElement("style");u.textContent=`
      @font-face {
        font-family: 'klax';
        src: url(${H}) format('truetype');
      }
    `,document.head.appendChild(u);const y=document.getElementById("clock"),p=[];S.forEach((o,d)=>{const a=d*30,i=a*Math.PI/180,r=43,l=50+r*Math.sin(i),m=50-r*Math.cos(i),t=document.createElement("div");t.className="number",t.style.left=`${l}%`,t.style.top=`${m}%`,t.textContent=o,t.style.transform=`translate(-50%, -50%) rotate(${a}deg)`,t.dataset.angle=a,t.isFlashing=!1,t.lastPassedTime=0,p.push(t),y.appendChild(t)});const v=6,k=6,w=300,x=()=>{const o=new Date,d=o.getMilliseconds(),a=o.getSeconds()+d/1e3,i=o.getMinutes(),r=o.getHours(),l=a*6,m=i*6+a*.1,t=r%12*30+i*.5;document.getElementById("second").style.transform=`translateX(-50%) rotate(${l}deg)`,document.getElementById("minute").style.transform=`translateX(-50%) rotate(${m}deg)`,document.getElementById("hour").style.transform=`translateX(-50%) rotate(${t}deg)`;const c=l%360;p.forEach(e=>{const b=parseFloat(e.dataset.angle);let g=(b-v+360)%360,h=(b+k)%360,f=!1;if(g<h?f=c>=g&&c<=h:f=c>=g||c<=h,f)e.isFlashing=!0,e.lastPassedTime=performance.now(),e.classList.add("flash-red");else{const E=performance.now();e.isFlashing&&E-e.lastPassedTime<w?e.classList.add("flash-red"):(e.isFlashing=!1,e.classList.remove("flash-red"))}}),requestAnimationFrame(x)};requestAnimationFrame(x)},[]),n.jsxs("div",{style:s.body,children:[n.jsx("div",{style:s.bgImage}),n.jsx("div",{style:s.clockWrapper,children:n.jsxs("div",{style:s.clock,id:"clock",children:[n.jsx("img",{src:F,alt:"Hour Hand",className:"hand hour",id:"hour",style:s.handHour}),n.jsx("img",{src:z,alt:"Minute Hand",className:"hand minute",id:"minute",style:s.handMinute}),n.jsx("img",{src:C,alt:"Second Hand",className:"hand second",id:"second",style:s.handSecond})]})}),n.jsx("style",{children:`
        .number {
          position: absolute;
          font-size: 29.5vh;
          font-weight: bold;
          transform-origin: center center;
          z-index: 6;
          opacity: 0.8;
          font-family: 'klax', serif;
        }

        .flash-red {
          animation: flash 0.01s ease-in-out alternate infinite;
        }

        @keyframes flash {
          from {
            color: rgb(246, 14, 37);
          }
          to {
            color: rgb(247, 46, 6);
            text-shadow:
              0 0 1rem rgb(11, 237, 211),
              0 0 2rem rgb(237, 11, 11),
              0 0 5rem rgb(238, 8, 54),
              0 0 5rem rgb(238, 8, 85);
          }
        }
      `})]})),s={body:{margin:0,padding:0,height:"100vh",width:"100vw",background:"#0c0c0c",position:"relative",overflow:"hidden",fontFamily:"klax, serif"},bgImage:{backgroundImage:`url(${j})`,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"brightness(50%)",zIndex:1,pointerEvents:"none"},clockWrapper:{position:"relative",display:"flex",justifyContent:"center",alignItems:"center",width:"100vw",height:"100vh",zIndex:5},clock:{width:"80vmin",height:"80vmin",borderRadius:"50%",position:"relative",color:"rgb(241, 231, 244)"},handHour:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom",transform:"translateX(-50%)",height:"35%",filter:"sepia(100%) saturate(150%) hue-rotate(-10deg) brightness(90%) contrast(120%)",zIndex:7,pointerEvents:"none"},handMinute:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom",transform:"translateX(-50%)",height:"45%",zIndex:7,pointerEvents:"none"},handSecond:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom",transform:"translateX(-50%)",height:"55%",zIndex:7,pointerEvents:"none"}};export{M as default};
