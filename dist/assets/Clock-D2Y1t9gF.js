import{r,j as e}from"./index-CyZMHo7v.js";const h="/assets/bone-jCxhOO-o.ttf",p="/assets/bone-vAIxiEPy.png",b="/assets/bone1-BBkEdZA4.png",x="/assets/bone2-DfHxgggE.png",y="/assets/bon-Cewn0iE2.png",I=()=>{const i=r.useRef(null),l=r.useRef(null),c=r.useRef(null),g=r.useRef(null);return r.useEffect(()=>{const d=()=>{const s=new Date,o=s.getSeconds(),n=s.getMinutes(),a=s.getHours(),m=o*6,f=n*6+o*.1,t=a%12*30+n*.5;c.current&&(c.current.style.transform=`translateX(-50%) rotate(${m}deg)`),l.current&&(l.current.style.transform=`translateX(-50%) rotate(${f}deg)`),i.current&&(i.current.style.transform=`translateX(-50%) rotate(${t}deg)`)};(()=>{const s=g.current;if(!s)return;const o=45;for(let n=1;n<=12;n++){const a=(n-3)*30*(Math.PI/180),m=50+o*Math.cos(a),f=50+o*Math.sin(a),t=document.createElement("span");t.textContent=n,t.style.position="absolute",t.style.left=`${m}%`,t.style.top=`${f}%`,t.style.transform="translate(-50%, -50%)",t.style.fontSize="5.5rem",t.style.fontFamily="bone, sans-serif",t.style.color="rgb(223, 213, 187)",t.style.textShadow="#1b1b1a 1px 1px 0px, #141412 -1px -1px 0px",s.appendChild(t)}})(),d();const u=setInterval(d,1e3);return()=>clearInterval(u)},[]),e.jsxs("div",{style:{margin:0,padding:0,background:"#757272",height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'bone';
          src: url(${h}) format('truetype');
        }

        .bgImage {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200vw;
          height: 100vh;
          z-index: 0;
          filter: brightness(120%);
          pointer-events: none;
        }
      `}),e.jsx("img",{src:y,className:"bgImage",alt:"background"}),e.jsxs("div",{style:{position:"relative",width:"28rem",height:"28rem",borderRadius:"50%",zIndex:5},children:[e.jsx("img",{src:x,ref:i,className:"hand-img",alt:"hour hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%) rotate(0deg)",height:"5rem",zIndex:3,pointerEvents:"none"}}),e.jsx("img",{src:b,ref:l,className:"hand-img",alt:"minute hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%) rotate(0deg)",height:"10rem",zIndex:2,pointerEvents:"none"}}),e.jsx("img",{src:p,ref:c,className:"hand-img",alt:"second hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%) rotate(0deg)",height:"14rem",filter:"brightness(0.8) contrast(1.3)",zIndex:1,pointerEvents:"none"}}),e.jsx("div",{ref:g,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}})]})]})};export{I as default};
