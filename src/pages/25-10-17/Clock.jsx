import React, { useEffect, useState } from "react";
import font20251016 from "./word.ttf";
import backgroundImage from "./words.jpg";

export default function TimeWordsClock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(null);
  const [langIndex, setLangIndex] = useState(0);

  const languages = ["en", "fr", "es", "pl", "it", "de", "nl", "pt"];

  // Translation dictionaries
  const translations = {
    en: {
      hourWords: ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"],
      smallNumbers: ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],
      tens: ["", "", "twenty", "thirty", "forty", "fifty"],
      after: "after",
      before: "before",
      oclock: "o'clock",
      nowItIs: "Now, it is",
      and: "and",
      itIs: "It is"
    },
    fr: {
      hourWords: ["douze","une","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze"],
      smallNumbers: ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"],
      tens: ["", "", "vingt", "trente", "quarante", "cinquante"],
      after: "après",
      before: "avant",
      oclock: "heures",
      nowItIs: "Il est maintenant",
      and: "et",
      itIs: "Il est"
    },
    es: {
      hourWords: ["doce","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once"],
      smallNumbers: ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve"],
      tens: ["", "", "veinte","treinta","cuarenta","cincuenta"],
      after: "después",
      before: "para",
      oclock: "en punto",
      nowItIs: "Ahora son",
      and: "y",
      itIs: "Son"
    },
    pl: {
      hourWords: ["dwanaście","jedna","dwie","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć","dziesięć","jedenaście"],
      smallNumbers: ["zero","jeden","dwa","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć","dziesięć","jedenaście","dwanaście","trzynaście","czternaście","piętnaście","szesnaście","siedemnaście","osiemnaście","dziewiętnaście"],
      tens: ["", "", "dwadzieścia","trzydzieści","czterdzieści","pięćdziesiąt"],
      after: "po",
      before: "do",
      oclock: "godzina",
      nowItIs: "Jest teraz",
      and: "i",
      itIs: "Jest"
    },
    it: {
      hourWords: ["dodici","una","due","tre","quattro","cinque","sei","sette","otto","nove","dieci","undici"],
      smallNumbers: ["zero","uno","due","tre","quattro","cinque","sei","sette","otto","nove","dieci","undici","dodici","tredici","quattordici","quindici","sedici","diciassette","diciotto","diciannove"],
      tens: ["", "", "venti","trenta","quaranta","cinquanta"],
      after: "dopo",
      before: "a",
      oclock: "in punto",
      nowItIs: "Ora sono",
      and: "e",
      itIs: "Sono"
    },
    de: {
      hourWords: ["zwölf","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf"],
      smallNumbers: ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"],
      tens: ["", "", "zwanzig","dreißig","vierzig","fünfzig"],
      after: "nach",
      before: "vor",
      oclock: "Uhr",
      nowItIs: "Jetzt ist es",
      and: "und",
      itIs: "Es ist"
    },
    nl: {
      hourWords: ["twaalf","een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien","elf"],
      smallNumbers: ["nul","een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien","elf","twaalf","dertien","veertien","vijftien","zestien","zeventien","achttien","negentien"],
      tens: ["", "", "twintig","dertig","veertig","vijftig"],
      after: "over",
      before: "voor",
      oclock: "uur",
      nowItIs: "Het is nu",
      and: "en",
      itIs: "Het is"
    },
    pt: {
      hourWords: ["doze","uma","duas","três","quatro","cinco","seis","sete","oito","nove","dez","onze"],
      smallNumbers: ["zero","um","dois","três","quatro","cinco","seis","sete","oito","nove","dez","onze","doze","treze","catorze","quinze","dezasseis","dezassete","dezoito","dezanove"],
      tens: ["", "", "vinte","trinta","quarenta","cinquenta"],
      after: "depois",
      before: "para",
      oclock: "em ponto",
      nowItIs: "Agora são",
      and: "e",
      itIs: "São"
    }
  };

  // Load font
  useEffect(() => {
    let cancelled = false;

    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "font";
    preload.href = font20251016;
    preload.type = "font/ttf";
    preload.crossOrigin = "anonymous";
    document.head.appendChild(preload);

    const family = "UserLoadedFont20251016";
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      @font-face {
        font-family: '${family}';
        src: url('${font20251016}') format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(styleTag);

    (async () => {
      try {
        if ("FontFace" in window) {
          const ff = new FontFace(family, `url(${font20251016})`);
          await ff.load();
          document.fonts.add(ff);
        } else if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      document.head.removeChild(preload);
      document.head.removeChild(styleTag);
    };
  }, []);

  // Tick
  useEffect(() => {
    if (!ready) return;
    const tick = () => {
      setNow(new Date());
      setLangIndex(prev => (prev + 1) % languages.length);
    };
    const msToNext = 1000 - (Date.now() % 1000);
    const t = setTimeout(() => {
      tick();
      const i = setInterval(tick, 1000);
      return () => clearInterval(i);
    }, msToNext);
    return () => clearTimeout(t);
  }, [ready]);

  const numberToWords = (num, lang) => {
    const smallNumbers = translations[lang].smallNumbers;
    const tens = translations[lang].tens;
    if (num < 20) return smallNumbers[num];
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return one === 0 ? tens[ten] : `${tens[ten]}-${smallNumbers[one]}`;
  };

  const timeToWords = (date, lang) => {
    const t = translations[lang];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let relation = t.after;
    let displayMinutes = minutes;
    let displaySeconds = seconds;
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

    if (displayMinutes > 0) {
      lines.push(`${t.nowItIs} ${numberToWords(displayMinutes, lang)} ${lang==="en"?"minute":"minut"}${displayMinutes !== 1?"s":""}`);
    }

    if (displaySeconds > 0) {
      if (displayMinutes > 0) {
        lines.push(`${t.and} ${numberToWords(displaySeconds, lang)} ${lang==="en"?"second":"sekund"}${displaySeconds !==1?"s":""}`);
      } else {
        lines.push(`${t.itIs} ${numberToWords(displaySeconds, lang)} ${lang==="en"?"second":"sekund"}${displaySeconds !==1?"s":""}`);
      }
    }

    lines.push(`${relation} ${hourWord} ${t.oclock}.`);

    return lines;
  };

  if (!ready || !now) return null;

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "hue-rotate(-130deg) saturate(0.6) contrast(0.3) brightness(1.9)",
    transform: "scaleX(-1)",
    zIndex: 0,
  };

  const textStyle = {
    position: "relative",
    zIndex: 1,
    fontFamily: "UserLoadedFont20251016, Georgia, serif",
    fontSize: "clamp(4vh, 5vw, 8vh)",
    color: "#050504FF",
    textAlign: "center",
    lineHeight: "1.4",
    borderRadius: "0.2vh",
    textShadow: `0.02em 0.02em  #DF1414FF, -0.02em -0.02em 0 rgba(255,255,255,0.9)`,
    padding: "2vh 4vw",
    border: "0.2vh solid rgba(255, 255, 255, 0.3)",
  };

  const lines = timeToWords(now, languages[langIndex]);

  return (
    <div style={containerStyle} aria-live="polite">
      <div style={backgroundStyle}></div>
      <div style={textStyle}>
        {lines.map((line, i) => (
          <div key={i}>{line}<br />&nbsp;</div>
        ))}
      </div>
    </div>
  );
}
