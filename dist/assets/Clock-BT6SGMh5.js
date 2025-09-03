import{r as p,j as t}from"./index-CR9JyEBx.js";const x="/assets/pngtree-silver-pirate-hook-3d-object-png-image_11098846-t9WyPLFb.png",v="/assets/pirate_foam-D8RK0IdH.gif",I="/assets/cut-CkJeHQnj.gif",y="/assets/sasasd-CxxAy2vO.gif",b="/assets/2afe90c0ee6f32a3c59f29e2418047fd-CmWURp_c.gif",j=()=>(p.useEffect(()=>{const i=document.getElementById("clock"),u=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"];function d(){i.querySelectorAll(".number").forEach(o=>o.remove());const e=i.offsetWidth,s=e*.45,n=e/2;u.forEach((o,c)=>{const a=(c*30-90)*(Math.PI/180),l=n+s*Math.cos(a),g=n+s*Math.sin(a),r=document.createElement("div");Object.assign(r.style,{position:"absolute",left:`${l}px`,top:`${g}px`,transform:"translate(-50%, -50%)",fontSize:"clamp(2.4rem, 4vw, 2.5rem)",color:"#c29b0e",textShadow:"rgb(14, 2, 26) 1px 1px 5px",textAlign:"center",width:"4vw",height:"4vw",lineHeight:"4vw",minWidth:"30px",minHeight:"30px",animation:`float ${3.5+Math.random()}s ease-in-out infinite`,animationDelay:`${Math.random()*2}s`,fontFamily:"Metamorphous, serif",zIndex:"10"}),r.textContent=o,r.className="number",i.appendChild(r)})}function m(){const e=new Date,s=e.getHours()%12,n=e.getMinutes(),o=e.getSeconds(),c=s*30+n*.5,a=n*6,l=o*6;document.querySelector(".hour").style.transform=`translateX(-50%) rotate(${c}deg)`,document.querySelector(".minute").style.transform=`translateX(-50%) rotate(${a}deg)`,document.querySelector(".second").style.transform=`translateX(-50%) rotate(${l}deg)`}d(),m();const f=setInterval(m,1e3),h=()=>d();return window.addEventListener("resize",h),()=>{clearInterval(f),window.removeEventListener("resize",h)}},[]),t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        html {
          width: 100%;
          height: 100%;
        }
        @keyframes float {
          0%   { transform: translate(-50%, -50%) translateY(0); }
          50%  { transform: translate(-50%, -50%) translateY(-1.9vw); }
          100% { transform: translate(-50%, -50%) translateY(0); }
        }
      `}),t.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",margin:0,padding:0,backgroundColor:"#1c4dd3",position:"relative",overflow:"hidden"},children:[t.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${y})`,backgroundSize:"15% 15%",backgroundRepeat:"repeat",opacity:.4,zIndex:1}}),t.jsx("img",{src:b,alt:"Background",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0}}),t.jsxs("div",{id:"clock",style:{position:"relative",width:"min(80vw, 80vh)",height:"min(80vw, 80vh)",borderRadius:"50%",fontFamily:"Metamorphous, serif",zIndex:2},children:[t.jsx("img",{className:"hand hour",src:x,alt:"Hour hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%)",width:"20%",filter:"contrast(0.8)",zIndex:5}}),t.jsx("img",{className:"hand minute",src:v,alt:"Minute hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%)",width:"18%",filter:"saturate(0.8)",zIndex:3}}),t.jsx("img",{className:"hand second",src:I,alt:"Second hand",style:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"translateX(-50%)",width:"28%",zIndex:3}})]})]})]}));export{j as default};
