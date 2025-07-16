import{r as l,j as o}from"./index-CCm3oexO.js";const v="/assets/morse-CiCspx5C.ttf",E=()=>{const m=l.useRef(null),g=["#c0c6c7","#99a3a3","#B7410E","#66615C","#c0c6c7","#99a3a3","#B7410E","#66615C","#c0c6c7","#99a3a3","#999999","#b0b0b0","#a0522d","#666666","#333333","#777777","#444444","#999999","#888888","#aaaaaa","#bbbbbb","#66615C","#c0c6c7","#99a3a3","#B7410E"],a=(t,e)=>Math.floor(Math.random()*(e-t+1))+t,u=70,b=1200,x=3600,h=1800,f=(t,e)=>{const n=t/(e-1);return h*(n*n*n)};l.useEffect(()=>{const t=m.current;if(t){t.innerHTML="";for(let e=0;e<u;e++){const n=f(e,u)+a(-.7,.7),i=b/2,c=n+a(50,120),d=n+a(-1.2,1.2),y=`M-100 ${n} Q${i} ${c} ${x} ${d}`,s=document.createElementNS("http://www.w3.org/2000/svg","path");s.setAttribute("d",y),s.setAttribute("stroke",g[e%g.length]),s.setAttribute("stroke-width",1.8+e%3*.9),s.setAttribute("fill","none"),t.appendChild(s)}}},[]),l.useEffect(()=>{const t=()=>{const n=new Date,i=n.getHours().toString().padStart(2,"0"),c=n.getMinutes().toString().padStart(2,"0"),d=n.getSeconds().toString().padStart(2,"0");document.getElementById("hour1").textContent=i[0],document.getElementById("hour2").textContent=i[1],document.getElementById("minute1").textContent=c[0],document.getElementById("minute2").textContent=c[1],document.getElementById("second1").textContent=d[0],document.getElementById("second2").textContent=d[1]},e=setInterval(t,1e3);return t(),()=>clearInterval(e)},[]);const r={body:{margin:0,height:"100vh",background:"linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)",position:"relative",overflow:"visible",display:"flex",justifyContent:"center",alignItems:"center",fontFamily:'"morse", Arial, sans-serif'},backgroundSvg:{position:"absolute",top:0,left:0,width:"150vw",height:"100vh",zIndex:1},clock:{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:4},digitBox:{width:"110vw",height:"2.3rem",margin:"0.9rem 0",backgroundColor:"#b87333",color:"#b90404",textShadow:`
        0 -0.2rem 0 rgb(250, 247, 247),
        -0.2rem 0 0 rgb(247, 242, 242),
        0.2rem 0 0 rgba(0, 0, 0, 1),
        0 0.2rem 0 rgba(0, 0, 0, 1),
        0 -0.1rem 0 rgb(248, 241, 241),
        -0.1rem 0 0 rgba(0, 0, 0, 1),
        0.1rem 0 0 rgba(0, 0, 0, 1),
        0 0.1rem 0 rgba(0, 0, 0, 1)
      `,display:"flex",justifyContent:"center",alignItems:"center",fontSize:"3rem",borderRadius:"7.5rem",zIndex:4}};return o.jsxs("div",{style:r.body,children:[o.jsx("style",{children:`
          @font-face {
            font-family: 'morse';
            src: url(${v}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}),o.jsx("svg",{style:r.backgroundSvg,viewBox:`-100 0 ${x+100} ${h}`,preserveAspectRatio:"none",ref:m}),o.jsxs("div",{style:r.clock,children:[o.jsx("div",{style:r.digitBox,id:"hour1",children:"0"}),o.jsx("div",{style:r.digitBox,id:"hour2",children:"0"}),o.jsx("div",{style:r.digitBox,id:"minute1",children:"0"}),o.jsx("div",{style:r.digitBox,id:"minute2",children:"0"}),o.jsx("div",{style:r.digitBox,id:"second1",children:"0"}),o.jsx("div",{style:r.digitBox,id:"second2",children:"0"})]})]})};export{E as default};
