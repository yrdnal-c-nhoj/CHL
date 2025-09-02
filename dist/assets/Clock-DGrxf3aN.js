import{r as u,j as e}from"./index-CtpJRlFd.js";const b="/assets/kal-hbZkDxUy.otf",F="/assets/7ZAx-C7-uerK_.webp",j=()=>(u.useEffect(()=>{const t=["#ff0040","#045DF7FF","#F9D108FF","#00ff00","#FC7B02FF","#ff00ff","#00bfff","#ffffff","#D0FF00FF","#C12FFBFF","#FAA404FF","#12F5DBFF"],g=(i,f)=>{const n={hour:document.getElementById(`${i}Hour`),minute:document.getElementById(`${i}Minute`),second:document.getElementById(`${i}Second`),ampm:document.getElementById(`${i}Ampm`),hours:[],minutes:[],seconds:[],ampms:[],colorOffset:f};for(let m=0;m<12;m++){const a=m*30,r=document.createElement("div");r.className="segment hour",r.style.transform=`rotate(${a}deg) translate(30vmin)`,n.hour.appendChild(r),n.hours.push(r);const c=document.createElement("div");c.className="segment minute",c.style.transform=`rotate(${a}deg) translate(20vmin)`,n.minute.appendChild(c),n.minutes.push(c);const l=document.createElement("div");l.className="segment second",l.style.transform=`rotate(${a}deg) translate(10vmin)`,n.second.appendChild(l),n.seconds.push(l);const d=document.createElement("div");d.className="segment ampm",d.style.transform=`rotate(${a}deg) translate(5vmin)`,n.ampm.appendChild(d),n.ampms.push(d)}return n},v=[g("ring1",0),g("ring2",6)],h=()=>{const i=new Date,f=i.getHours(),n=f%12||12,m=i.getMinutes(),a=i.getSeconds(),r=f>=12?"PM":"AM",c=n.toString().padStart(2,"0"),l=m.toString().padStart(2,"0"),d=a.toString().padStart(2,"0");for(const s of v)for(let o=0;o<12;o++){const p=(o+a+s.colorOffset)%t.length;s.hours[o].textContent=c,s.hours[o].style.color=t[(p+2)%t.length],s.minutes[o].textContent=l,s.minutes[o].style.color=t[(p+4)%t.length],s.seconds[o].textContent=d,s.seconds[o].style.color=t[(p+6)%t.length],s.ampms[o].textContent=r,s.ampms[o].style.color=t[(p+8)%t.length]}requestAnimationFrame(h)};h()},[]),u.useEffect(()=>{new FontFace("kal",`url(${b})`).load().then(t=>document.fonts.add(t))},[]),e.jsxs("div",{style:{margin:0,padding:0,background:"black",height:"100vh",overflow:"hidden"},children:[e.jsx("img",{src:F,alt:"background",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"brightness(210%) saturate(400%) hue-rotate(-190deg) blur(4px)",zIndex:1,pointerEvents:"none"}}),e.jsxs("div",{style:{position:"absolute",top:"5px",left:"50%",transform:"translateX(-50%)",width:"98%",display:"flex",color:"#bebcbc",textShadow:"#141314 1px 0px",zIndex:6},children:[e.jsx("div",{style:{fontFamily:'"Roboto Slab", serif',fontSize:"2.8vh",position:"absolute",top:"1px",right:"1px",letterSpacing:"0.1vh"},children:"Cubist Heart Laboratories"}),e.jsx("div",{style:{fontFamily:'"Oxanium", serif',fontSize:"2.8vh",fontStyle:"italic",letterSpacing:"-0.1vh"},children:"BorrowedTime"})]}),e.jsxs("div",{style:{position:"absolute",bottom:"5px",left:"50%",transform:"translateX(-50%)",width:"98%",display:"flex",color:"#bec2be",zIndex:6},children:[e.jsx("a",{href:"../launchpad/",style:{fontSize:"3vh",fontFamily:'"Nanum Gothic Coding", monospace'},children:"07/03/25"}),e.jsx("a",{href:"../index.html",style:{position:"fixed",left:"50%",transform:"translateX(-50%)",fontSize:"4vh",lineHeight:"4vh",fontFamily:'"Oxanium", serif'},children:"Kaleidoscope"}),e.jsx("a",{href:"../vegas/",style:{fontSize:"3vh",fontFamily:'"Nanum Gothic Coding", monospace',position:"absolute",right:0},children:"07/05/25"})]}),e.jsxs("div",{className:"kaleidoscope spin-cw",style:x,children:[e.jsx("div",{id:"ring1Hour",className:"ring"}),e.jsx("div",{id:"ring1Minute",className:"ring"}),e.jsx("div",{id:"ring1Second",className:"ring"}),e.jsx("div",{id:"ring1Ampm",className:"ring"})]}),e.jsxs("div",{className:"kaleidoscope spin-ccw",style:x,children:[e.jsx("div",{id:"ring2Hour",className:"ring"}),e.jsx("div",{id:"ring2Minute",className:"ring"}),e.jsx("div",{id:"ring2Second",className:"ring"}),e.jsx("div",{id:"ring2Ampm",className:"ring"})]}),e.jsx("style",{children:`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes spin-ccw {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }

        .kaleidoscope {
          font-family: 'kal';
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        .spin-cw {
          animation: spin-cw 45s linear infinite;
          opacity: 0.9;
        }

        .spin-ccw {
          animation: spin-ccw 90s linear infinite;
          opacity: 0.7;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
        }

        .segment {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          pointer-events: none;
          mix-blend-mode: screen;
          transition: color 1s;
          font-size: 4.5rem;
          transform-origin: 0 0;
        }

        .minute, .second {
          font-size: 2.4rem;
        }

        .ampm {
          font-size: 0.8rem;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `})]})),x={position:"absolute",top:0,left:0,width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"};export{j as default};
