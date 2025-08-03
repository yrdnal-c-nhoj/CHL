import{r as v,j as n}from"./index-f_Ern5kM.js";const g="/assets/coin-BeWTdq9O.gif",p="/assets/spin-CiSO6pWQ.webp",w=()=>(v.useEffect(()=>{const o=document.getElementById("clock");for(let e=1;e<=12;e++){const s=e*30*Math.PI/180,t=document.createElement("div");t.className="number",t.textContent=e,t.style.left=`calc(50% + ${Math.sin(s)*19}vw - 1vw)`,t.style.top=`calc(50% - ${Math.cos(s)*19}vw - 1vw)`,o.appendChild(t)}const a=document.createElement("div");a.className="hand hour-hand",o.appendChild(a);const r=document.createElement("div");r.className="hand minute-hand",o.appendChild(r);const i=document.createElement("div");i.className="hand second-hand",o.appendChild(i);const d=()=>{const e=new Date,s=e.getHours()%12,t=e.getMinutes(),l=e.getSeconds(),h=s*30+t*.5,m=t*6,u=l*6;a.style.transform=`translateX(-50%) rotate(${h}deg)`,r.style.transform=`translateX(-50%) rotate(${m}deg)`,i.style.transform=`translateX(-50%) rotate(${u}deg)`};d();const c=setInterval(d,1e3);return()=>clearInterval(c)},[]),n.jsxs("div",{style:{backgroundColor:"#060606",display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",margin:0,perspective:"100vw",overflow:"hidden",position:"relative"},children:[n.jsx("img",{src:g,alt:"coin background",style:{position:"absolute",top:0,left:0,width:"100vw",height:"100vh",objectFit:"cover",zIndex:-1}}),n.jsx("div",{id:"clock",style:{width:"80vh",height:"80vh",borderRadius:"50%",position:"relative",transformStyle:"preserve-3d",animation:"spin 7s linear infinite"},children:n.jsx("div",{className:"center",style:{width:"8vh",height:"8vh",backgroundImage:`url(${p})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",borderRadius:"50%",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:10}})}),n.jsx("style",{children:`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background-color: #d3ad62;
        }

        .hour-hand {
          width: 0.6vw;
          height: 12vw;
          transform: translateX(-50%);
        }

        .minute-hand {
          width: 0.4vw;
          height: 16vw;
          transform: translateX(-50%);
        }

        .second-hand {
          width: 0.2vw;
          height: 2000vw;
          transform: translateX(-50%);
        }

        .number {
          font-family: 'MoneyMoney-Regular', sans-serif;
          position: absolute;
          font-size: 7.6vw;
          color: #d3ad62;
          text-align: center;
          width: 2vw;
        }
      `})]}));export{w as default};
