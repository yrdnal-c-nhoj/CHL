import React, { useEffect, useState } from "react";
import fontLatin from "./words.ttf";
import fontCJK from "./CJK.ttf";
import fontArabic from "./NotoNaskhArabic-Regular.ttf";
import fontDevanagari from "./NotoSansDevanagari-Regular.ttf";
import backgroundImage from "./words.jpg";

export default function TimeWordsClock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(null);
  const [langIndex, setLangIndex] = useState(0);

  // 30 most popular Internet languages
  const languages = [
    "en","zh","es","ar","pt","fr","ru","ja","de","hi",
    "id","it","tr","pl","nl","ko","vi","fa","ur","th",
    "ms","he","bn","ta","mr","gu","pa","uk","ro","hu"
  ];

  // Plural helper
  const pluralize = (n, singular, plural) => (n === 1 ? singular : plural);

  // Translations (same as before)
  const translations = {
    en: {after:"after", before:"before", oclock:"o'clock", nowItIs:"Now, it is", and:"and", itIs:"It is", minute:["minute","minutes"], second:["second","seconds"], dir:"ltr"},
    zh: {after:"过", before:"差", oclock:"点", nowItIs:"现在是", and:"和", itIs:"是", minute:["分钟","分钟"], second:["秒","秒"], dir:"ltr"},
    es: {after:"después", before:"para", oclock:"en punto", nowItIs:"Ahora son", and:"y", itIs:"Son", minute:["minuto","minutos"], second:["segundo","segundos"], dir:"ltr"},
    ar: {after:"بعد", before:"إلا", oclock:"ساعة", nowItIs:"الآن الساعة", and:"و", itIs:"هي", minute:["دقيقة","دقائق"], second:["ثانية","ثواني"], dir:"rtl"},
    pt: {after:"depois", before:"para", oclock:"em ponto", nowItIs:"Agora são", and:"e", itIs:"São", minute:["minuto","minutos"], second:["segundo","segundos"], dir:"ltr"},
    fr: {after:"après", before:"avant", oclock:"heures", nowItIs:"Il est maintenant", and:"et", itIs:"Il est", minute:["minute","minutes"], second:["seconde","secondes"], dir:"ltr"},
    ru: {after:"после", before:"без", oclock:"часов", nowItIs:"Сейчас", and:"и", itIs:"Это", minute:["минута","минуты"], second:["секунда","секунды"], dir:"ltr"},
    ja: {after:"すぎ", before:"前", oclock:"時", nowItIs:"現在の時刻は", and:"と", itIs:"です", minute:["分","分"], second:["秒","秒"], dir:"ltr"},
    de: {after:"nach", before:"vor", oclock:"Uhr", nowItIs:"Jetzt ist", and:"und", itIs:"Es ist", minute:["Minute","Minuten"], second:["Sekunde","Sekunden"], dir:"ltr"},
    hi: {after:"बाद", before:"बिना", oclock:"घंटा", nowItIs:"अभी समय है", and:"और", itIs:"यह है", minute:["मिनट","मिनट"], second:["सेकंड","सेकंड"], dir:"ltr"},
    id: {after:"lebih", before:"kurang", oclock:"jam", nowItIs:"Sekarang pukul", and:"dan", itIs:"Ini", minute:["menit","menit"], second:["detik","detik"], dir:"ltr"},
    it: {after:"dopo", before:"a", oclock:"in punto", nowItIs:"Ora sono", and:"e", itIs:"Sono", minute:["minuto","minuti"], second:["secondo","secondi"], dir:"ltr"},
    tr: {after:"sonra", before:"eksi", oclock:"saat", nowItIs:"Şu anda", and:"ve", itIs:"Bu", minute:["dakika","dakikalar"], second:["saniye","saniyeler"], dir:"ltr"},
    pl: {after:"po", before:"do", oclock:"godzina", nowItIs:"Jest teraz", and:"i", itIs:"Jest", minute:["minuta","minuty"], second:["sekunda","sekundy"], dir:"ltr"},
    nl: {after:"over", before:"voor", oclock:"uur", nowItIs:"Het is nu", and:"en", itIs:"Het is", minute:["minuut","minuten"], second:["seconde","seconden"], dir:"ltr"},
    ko: {after:"후", before:"전", oclock:"시", nowItIs:"지금 시간은", and:"및", itIs:"입니다", minute:["분","분"], second:["초","초"], dir:"ltr"},
    vi: {after:"sau", before:"trước", oclock:"giờ", nowItIs:"Bây giờ là", and:"và", itIs:"Là", minute:["phút","phút"], second:["giây","giây"], dir:"ltr"},
    fa: {after:"بعد", before:"تا", oclock:"ساعت", nowItIs:"اکنون ساعت", and:"و", itIs:"است", minute:["دقیقه","دقیقه"], second:["ثانیه","ثانیه"], dir:"rtl"},
    ur: {after:"بعد", before:"باقی", oclock:"گھنٹہ", nowItIs:"اب وقت ہے", and:"اور", itIs:"یہ ہے", minute:["منٹ","منٹ"], second:["سیکنڈ","سیکنڈ"], dir:"rtl"},
    th: {after:"หลัง", before:"ถึง", oclock:"นาฬิกา", nowItIs:"ตอนนี้เวลา", and:"และ", itIs:"คือ", minute:["นาที","นาที"], second:["วินาที","วินาที"], dir:"ltr"},
    ms: {after:"selepas", before:"kurang", oclock:"pukul", nowItIs:"Sekarang adalah", and:"dan", itIs:"Ini adalah", minute:["minit","minit"], second:["saat","saat"], dir:"ltr"},
    he: {after:"אחרי", before:"לפני", oclock:"שעון", nowItIs:"הזמן עכשיו", and:"ו", itIs:"זה", minute:["דקה","דקות"], second:["שנייה","שניות"], dir:"rtl"},
    bn: {after:"পর", before:"আগে", oclock:"ঘন্টা", nowItIs:"এখন সময়", and:"এবং", itIs:"এটি", minute:["মিনিট","মিনিট"], second:["সেকেন্ড","সেকেন্ড"], dir:"ltr"},
    ta: {after:"பின்", before:"முன்", oclock:"மணி", nowItIs:"இப்போது நேரம்", and:"மற்றும்", itIs:"இது", minute:["நிமிடம்","நிமிடங்கள்"], second:["வினாடி","வினாடிகள்"], dir:"ltr"},
    mr: {after:"नंतर", before:"पूर्वी", oclock:"तास", nowItIs:"आता वेळ आहे", and:"आणि", itIs:"हे आहे", minute:["मिनिट","मिनिटे"], second:["सेकंद","सेकंद"], dir:"ltr"},
    gu: {after:"પછી", before:"પેહલા", oclock:"કલાક", nowItIs:"હવે સમય છે", and:"અને", itIs:"આ છે", minute:["મિનિટ","મિનિટો"], second:["સેકંડ","સેકંડો"], dir:"ltr"},
    pa: {after:"ਬਾਅਦ", before:"ਪਹਿਲਾਂ", oclock:"ਘੰਟਾ", nowItIs:"ਹੁਣ ਵਕਤ ਹੈ", and:"ਅਤੇ", itIs:"ਇਹ ਹੈ", minute:["ਮਿੰਟ","ਮਿੰਟ"], second:["ਸੈਕਿੰਡ","ਸੈਕਿੰਡ"], dir:"ltr"},
    uk: {after:"після", before:"до", oclock:"година", nowItIs:"Зараз", and:"і", itIs:"Це", minute:["хвилина","хвилини"], second:["секунда","секунди"], dir:"ltr"},
    ro: {after:"după", before:"înainte de", oclock:"ora", nowItIs:"Acum este", and:"și", itIs:"Este", minute:["minut","minute"], second:["secundă","secunde"], dir:"ltr"},
    hu: {after:"után", before:"előtt", oclock:"óra", nowItIs:"Most van", and:"és", itIs:"Ez", minute:["perc","percek"], second:["másodperc","másodpercek"], dir:"ltr"}
  };

  // --- Font detection by script ---
  const detectFontByScript = (lang) => {
    const arabicLangs = ["ar","fa","ur","he"];
    const cjkLangs = ["zh","ja","ko"];
    const devanagariLangs = ["hi","bn","ta","mr","gu","pa"];
    if (arabicLangs.includes(lang)) return "ArabicFont";
    if (cjkLangs.includes(lang)) return "CJKFont";
    if (devanagariLangs.includes(lang)) return "DevanagariFont";
    return "LatinFont";
  };

  // --- Font and background preloading ---
  useEffect(() => {
    let cancelled = false;

    const fonts = [
      { name: "LatinFont", url: fontLatin },
      { name: "CJKFont", url: fontCJK },
      { name: "ArabicFont", url: fontArabic },
      { name: "DevanagariFont", url: fontDevanagari },
    ];

    const styleTag = document.createElement("style");
    styleTag.textContent = fonts
      .map(
        (f) =>
          `@font-face { font-family: '${f.name}'; src: url('${f.url}') format('truetype'); font-display: swap; }`
      )
      .join("\n");
    document.head.appendChild(styleTag);

    const image = new Image();
    image.src = backgroundImage;

    Promise.all([
      ...fonts.map((f) => {
        if ("FontFace" in window) {
          const ff = new FontFace(f.name, `url(${f.url})`);
          return ff.load().then((loaded) => {
            document.fonts.add(loaded);
          });
        } else {
          return document.fonts?.ready || Promise.resolve();
        }
      }),
      new Promise((resolve) => {
        if (image.complete) resolve();
        else {
          image.onload = resolve;
          image.onerror = resolve;
        }
      }),
    ])
      .then(() => {
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
      document.head.removeChild(styleTag);
    };
  }, []);

  // --- Clock ticking and language rotation ---
  useEffect(() => {
    if (!ready) return;
    const tick = () => {
      setNow(new Date());
      setLangIndex((prev) => (prev + 1) % languages.length);
    };
    const msToNext = 1000 - (Date.now() % 1000);
    const t = setTimeout(() => {
      tick();
      const i = setInterval(tick, 1000);
      return () => clearInterval(i);
    }, msToNext);
    return () => clearTimeout(t);
  }, [ready]);

  // --- Time to words conversion ---
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

    const lines = [];
    if (displayMinutes > 0)
      lines.push(`${t.nowItIs} ${displayMinutes} ${pluralize(displayMinutes, t.minute[0], t.minute[1])}`);
    if (displaySeconds > 0)
      lines.push(displayMinutes > 0
        ? `${t.and} ${displaySeconds} ${pluralize(displaySeconds, t.second[0], t.second[1])}`
        : `${t.itIs} ${displaySeconds} ${pluralize(displaySeconds, t.second[0], t.second[1])}`);
    lines.push(`${relation} ${displayHour} ${t.oclock}`);
    return lines;
  };

  if (!ready || !now)
    return <div style={{width:"100vw", height:"100dvh", backgroundColor:"#000"}} />;

  const lang = languages[langIndex];
  const dir = translations[lang]?.dir || "ltr";
  const fontFamily = detectFontByScript(lang);

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    direction: dir,
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
    fontFamily: `${fontFamily}, Georgia, serif`,
    fontSize: "clamp(4vh, 5vw, 8vh)",
    color: "#050504FF",
    textAlign: "center",
    lineHeight: "1.4",
    borderRadius: "0.2vh",
    textShadow: "0.02em 0.02em #DF1414FF, -0.02em -0.02em 0 rgba(255,255,255,0.9)",
    padding: "2vh 4vw",
    border: "0.2vh solid rgba(255,255,255,0.3)",
    direction: dir,
  };

  const lines = timeToWords(now, lang);

  return (
    <div style={containerStyle} aria-live="polite">
      <div style={backgroundStyle}></div>
      <div style={textStyle}>
        {lines.map((line, i) => (
          <div key={i}>
            {line}
            <br />
            &nbsp;
          </div>
        ))}
      </div>
    </div>
  );
}
