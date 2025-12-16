import{r,j as e}from"./index-37WBs3jL.js";function M(){const[t,p]=r.useState(()=>new Date),l=r.useRef(null),c=r.useRef(null),d=r.useRef(null),m=r.useRef(null);r.useEffect(()=>{const a=()=>{const o=new Date;p(o);const g=o.getSeconds(),f=o.getMinutes(),v=o.getHours()%12,y=g/60*360+90,w=(f+g/60)/60*360+90,S=(v+f/60)/12*360+90;c.current&&(c.current.style.transform=`rotate(${y}deg)`),d.current&&(d.current.style.transform=`rotate(${w}deg)`),m.current&&(m.current.style.transform=`rotate(${S}deg)`),l.current=requestAnimationFrame(a)};return l.current=requestAnimationFrame(a),()=>{cancelAnimationFrame(l.current)}},[]);const n=r.useMemo(()=>({year:t.getFullYear(),month:t.toLocaleString("en",{month:"long"}),day:String(t.getDate()).padStart(2,"0"),hour:String(t.getHours()).padStart(2,"0"),minute:String(t.getMinutes()).padStart(2,"0"),second:String(t.getSeconds()).padStart(2,"0"),ms:String(t.getMilliseconds()).padStart(3,"0")}),[t]),s=[{label:"Formation of Earth",value:"4.540 Billion Years"},{label:"Phanerozoic Eon Begins",value:"541 Million Years"},{label:"Cenozoic Era Begins",value:"66 Million Years"},{label:"Quaternary Period",value:"2.58 Million Years"},{label:"Holocene Epoch",value:"11,700 Years"},{label:"Proposed Anthropocene",value:"~75 Years"},{label:"Current Year",value:`${n.year} C.E.`},{label:"Current Month",value:n.month},{label:"Current Day",value:n.day},{label:"Current Hour",value:n.hour},{label:"Current Minute",value:n.minute},{label:"Current Second",value:n.second},{label:"Current Millisecond",value:n.ms}],b=6,x=s.length,i=(100-b)/x,u=i*.4,h=.85*.4;return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Smooth transitions for clock hands */
        .clock-hand {
          transition: transform 0.3s cubic-bezier(0.4, 2.1, 0.4, 2.1);
          transform-origin: 100%;
          position: absolute;
          background: #113A66;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        
        /* Prevent text selection for better mobile experience */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Roboto+Mono:wght@400;700&display=swap",rel:"stylesheet"}),e.jsx("main",{style:{height:"100dvh",width:"100vw",margin:0,padding:"env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",background:"linear-gradient(90deg, #F5C280 0%, #F0E983FF 100%)",display:"flex",flexDirection:"column",alignItems:"center",boxSizing:"border-box",overflow:"hidden",fontFamily:"system-ui, -apple-system, sans-serif"},children:s.map((a,o)=>e.jsxs("div",{style:{width:"100%",maxWidth:"800px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:`clamp(0.2vh, ${i*.15}vh, 1vh) 0`,flex:`1 1 ${i}vh`,minHeight:"0",borderBottom:o<s.length-1?"1px solid rgba(17,58,102,0.2)":"none",overflow:"hidden",flexWrap:"nowrap"},children:[e.jsx("div",{style:{flex:"1 1 40%",textAlign:"right",paddingRight:"1rem",fontFamily:'"Playfair Display", Georgia, serif',fontSize:`clamp(0.6rem, ${Math.min(h*4,u)}vh, 1.4rem)`,fontWeight:500,color:"#113A66",whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",minWidth:"30%"},children:a.label}),e.jsx("div",{style:{width:"0.4vmin",height:`clamp(1.5em, ${i*.7}vh, 4rem)`,minHeight:"1.5em",background:"linear-gradient(to bottom, #113A66, #3D1759)",borderRadius:"3px",flexShrink:0}}),e.jsx("div",{style:{flex:"1 1 60%",paddingLeft:"1rem",fontFamily:'"Roboto Mono", monospace',fontSize:`clamp(0.6rem, ${Math.min(h*6,u)}vh, 1.4rem)`,color:"#3D1759",textAlign:"left",whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",minWidth:"50%"},children:a.value})]},o))})]})}export{M as default};
