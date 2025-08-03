import{r as l,j as e}from"./index-f_Ern5kM.js";const h="/assets/zod-ypFEwwQ0.ttf",p=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"],j=()=>{const[o,c]=l.useState(new Date);l.useEffect(()=>{const t=setInterval(()=>c(new Date),1e3);return()=>clearInterval(t)},[]);const a=o.getSeconds(),i=o.getMinutes(),m=o.getHours(),d=a/60*360,f=i/60*360+a/60*6,u=m%12/12*360+i/60*30,I={position:"relative",width:"16rem",height:"16rem",backgroundColor:"#f0f0f0",borderRadius:"50%",boxShadow:"0 0 20px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},g={position:"absolute",width:"0.5rem",height:"0.5rem",backgroundColor:"#000",borderRadius:"50%",zIndex:10},y=t=>({position:"absolute",transform:`rotate(${t}deg) translate(0, -6.5rem) rotate(-${t}deg)`,fontSize:"1.25rem",fontWeight:"bold",color:"#000",fontFamily:"MyCustomFont"}),s=(t,r,n,x)=>({position:"absolute",width:t,height:r,backgroundColor:n,transform:`rotate(${x}deg) translate(0, -4px)`,transformOrigin:"bottom center"});return e.jsxs("div",{style:I,children:[e.jsx("style",{children:`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${h}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}),e.jsx("div",{style:g}),p.map((t,r)=>{const n=r/12*360;return e.jsx("div",{style:y(n),children:t},t)}),e.jsx("div",{style:s("0.25rem","4rem","#000",u)}),e.jsx("div",{style:s("0.15rem","5rem","#000",f)}),e.jsx("div",{style:s("0.1rem","6rem","red",d)})]})};export{j as default};
