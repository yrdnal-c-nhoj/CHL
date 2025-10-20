import React, { useEffect, useState } from "react";
import fontLatin from "./word.ttf"; // Latin font for most languages
// TODO: Add fonts for non-Latin scripts
import fontCJK from "./CJK.ttf"; // zh, ja
import fontArabic from "./NotoNaskhArabic-Regular.ttf"; // ar
import fontDevanagari from "./NotoSansDevanagari-Regular.ttf"; // hi

import backgroundImage from "./words.jpg";

export default function TimeWordsClock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(null);
  const [langIndex, setLangIndex] = useState(0);

  // Languages ordered by Internet usage/popularity
  const languages = [
    "en", "zh", "es", "ar", "pt", "fr", "ru",
    "ja", "de", "hi", "id", "it", "tr", "pl", "nl"
  ];

  const pluralize = (n, singular, plural) => n === 1 ? singular : plural;

  const translations = {
    en:{hourWords:["twelve","one","two","three","four","five","six","seven","eight","nine","ten","eleven"], after:"after", before:"before", oclock:"o'clock", nowItIs:"Now, it is", and:"and", itIs:"It is", minute:["minute","minutes"], second:["second","seconds"], dir:"ltr"},
    zh:{hourWords:["十二","一","二","三","四","五","六","七","八","九","十","十一"], after:"过", before:"差", oclock:"点", nowItIs:"现在是", and:"和", itIs:"是", minute:["分钟","分钟"], second:["秒","秒"], dir:"ltr"},
    es:{hourWords:["doce","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once"], after:"después", before:"para", oclock:"en punto", nowItIs:"Ahora son", and:"y", itIs:"Son", minute:["minuto","minutos"], second:["segundo","segundos"], dir:"ltr"},
    ar:{hourWords:["اثنا عشر","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر"], after:"بعد", before:"إلا", oclock:"ساعة", nowItIs:"الآن الساعة", and:"و", itIs:"هي", minute:["دقيقة","دقائق"], second:["ثانية","ثواني"], dir:"rtl"},
    pt:{hourWords:["doze","uma","duas","três","quatro","cinco","seis","sete","oito","nove","dez","onze"], after:"depois", before:"para", oclock:"em ponto", nowItIs:"Agora são", and:"e", itIs:"São", minute:["minuto","minutos"], second:["segundo","segundos"], dir:"ltr"},
    fr:{hourWords:["douze","une","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze"], after:"après", before:"avant", oclock:"heures", nowItIs:"Il est maintenant", and:"et", itIs:"Il est", minute:["minute","minutes"], second:["seconde","secondes"], dir:"ltr"},
    ru:{hourWords:["двенадцать","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять","одиннадцать"], after:"после", before:"без", oclock:"часов", nowItIs:"Сейчас", and:"и", itIs:"Это", minute:["минута","минуты"], second:["секунда","секунды"], dir:"ltr"},
    ja:{hourWords:["十二","一","二","三","四","五","六","七","八","九","十","十一"], after:"すぎ", before:"前", oclock:"時", nowItIs:"現在の時刻は", and:"と", itIs:"です", minute:["分","分"], second:["秒","秒"], dir:"ltr"},
    de:{hourWords:["zwölf","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf"], after:"nach", before:"vor", oclock:"Uhr", nowItIs:"Jetzt ist", and:"und", itIs:"Es ist", minute:["Minute","Minuten"], second:["Sekunde","Sekunden"], dir:"ltr"},
    hi:{hourWords:["बारह","एक","दो","तीन","चार","पाँच","छह","सात","आठ","नौ","दस","ग्यारह"], after:"बाद", before:"बिना", oclock:"घंटा", nowItIs:"अभी समय है", and:"और", itIs:"यह है", minute:["मिनट","मिनट"], second:["सेकंड","सेकंड"], dir:"ltr"},
    id:{hourWords:["dua belas","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"], after:"lebih", before:"kurang", oclock:"jam", nowItIs:"Sekarang pukul", and:"dan", itIs:"Ini", minute:["menit","menit"], second:["detik","detik"], dir:"ltr"},
    it:{hourWords:["dodici","una","due","tre","quattro","cinque","sei","sette","otto","nove","dieci","undici"], after:"dopo", before:"a", oclock:"in punto", nowItIs:"Ora sono", and:"e", itIs:"Sono", minute:["minuto","minuti"], second:["secondo","secondi"], dir:"ltr"},
    tr:{hourWords:["on iki","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz","on","on bir"], after:"sonra", before:"eksi", oclock:"saat", nowItIs:"Şu anda", and:"ve", itIs:"Bu", minute:["dakika","dakikalar"], second:["saniye","saniyeler"], dir:"ltr"},
    pl:{hourWords:["dwanaście","jedna","dwie","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć","dziesięć","jedenaście"], after:"po", before:"do", oclock:"godzina", nowItIs:"Jest teraz", and:"i", itIs:"Jest", minute:["minuta","minuty"], second:["sekunda","sekundy"], dir:"ltr"},
    nl:{hourWords:["twaalf","een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien","elf"], after:"over", before:"voor", oclock:"uur", nowItIs:"Het is nu", and:"en", itIs:"Het is", minute:["minuut","minuten"], second:["seconde","seconden"], dir:"ltr"}
  };

  // Load font
  useEffect(() => {
    let cancelled = false;
    const family = "UserLoadedFontLatin";
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "font";
    preload.href = fontLatin;
    preload.type = "font/ttf";
    preload.crossOrigin = "anonymous";
    document.head.appendChild(preload);

    const styleTag = document.createElement("style");
    styleTag.textContent = `
      @font-face { font-family: '${family}'; src: url('${fontLatin}') format('truetype'); font-display: swap; }
    `;
    document.head.appendChild(styleTag);

    (async () => {
      try {
        if ("FontFace" in window) {
          const ff = new FontFace(family, `url(${fontLatin})`);
          await ff.load();
          document.fonts.add(ff);
        } else if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        if (!cancelled) { setNow(new Date()); setReady(true); }
      } catch { if (!cancelled) { setNow(new Date()); setReady(true); } }
    })();

    return () => { cancelled = true; document.head.removeChild(preload); document.head.removeChild(styleTag); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const tick = () => { setNow(new Date()); setLangIndex(prev => (prev + 1) % languages.length); };
    const msToNext = 1000 - (Date.now() % 1000);
    const t = setTimeout(() => { tick(); const i = setInterval(tick, 1000); return () => clearInterval(i); }, msToNext);
    return () => clearTimeout(t);
  }, [ready]);

  const timeToWords = (date, lang) => {
    const t = translations[lang];
    let hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
    let relation = t.after, displayMinutes = minutes, displaySeconds = seconds;
    let displayHour = hours % 12 === 0 ? 12 : hours % 12;
    if (minutes > 30 || (minutes === 30 && seconds > 0)) {
      relation = t.before;
      displayMinutes = 60 - minutes;
      displaySeconds = seconds > 0 ? 60 - seconds : 0;
      const nextHour = (hours + 1) % 24;
      displayHour = nextHour % 12 === 0 ? 12 : nextHour % 12;
    }
    const hourWord = t.hourWords[displayHour % 12 === 0 ? 0 : displayHour];
    const lines = [];
    if (displayMinutes>0) lines.push(`${t.nowItIs} ${displayMinutes} ${pluralize(displayMinutes,t.minute[0],t.minute[1])}`);
    if (displaySeconds>0) lines.push(displayMinutes>0?`${t.and} ${displaySeconds} ${pluralize(displaySeconds,t.second[0],t.second[1])}`:`${t.itIs} ${displaySeconds} ${pluralize(displaySeconds,t.second[0],t.second[1])}`);
    lines.push(`${relation} ${hourWord} ${t.oclock}`);
    return lines;
  };

  if(!ready || !now) return null;

  const lang = languages[langIndex];
  const dir = translations[lang].dir || "ltr";

  const containerStyle={width:"100vw",height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",direction:dir};
  const backgroundStyle={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${backgroundImage})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"hue-rotate(-130deg) saturate(0.6) contrast(0.3) brightness(1.9)",transform:"scaleX(-1)",zIndex:0};
  const textStyle={position:"relative",zIndex:1,fontFamily:"UserLoadedFontLatin, Georgia, serif",fontSize:"clamp(4vh,5vw,8vh)",color:"#050504FF",textAlign:"center",lineHeight:"1.4",borderRadius:"0.2vh",textShadow:"0.02em 0.02em #DF1414FF, -0.02em -0.02em 0 rgba(255,255,255,0.9)",padding:"2vh 4vw",border:"0.2vh solid rgba(255,255,255,0.3)"};

  const lines = timeToWords(now, lang);

  return (
    <div style={containerStyle} aria-live="polite">
      <div style={backgroundStyle}></div>
      <div style={textStyle}>
        {lines.map((line,i)=>(<div key={i}>{line}<br />&nbsp;</div>))}
      </div>
    </div>
  );
}
