import React, { useEffect, useState, useMemo } from 'react';

/* ================= CONFIG ================= */

const CONFIG = {
  UPDATE_INTERVAL: 1000,
  FADE_DURATION: '0.8s',
  COLORS: {
    highlight: '#e74c3c',
    subtle: '#A5A8AA',
    background: '#0f0f0f',
  },
};

/* ================= MATRIX ================= */

const MATRIX = [
  ['I','T','L','I','S','A','S','Q','U','A','R','T','E','R','C'],
  ['T','W','E','N','T','Y','F','I','V','E','H','A','L','F','S'],
  ['P','A','S','T','O','R','O','C','L','O','C','K','T','O','D'],
  ['S','E','V','E','N','E','I','G','H','T','N','I','N','E','T'],
  ['O','N','E','T','W','O','T','H','R','E','E','L','W','K','N'],
  ['F','O','U','R','F','I','V','E','S','I','X','D','J','B','P'],
  ['T','E','N','E','L','E','V','E','N','T','W','E','L','V','E'],
];

/* ================= WORD MAP ================= */

const WORDS = {

  IT: [[0,0],[0,1]],
  IS: [[0,3],[0,4]],

  FIVE_MIN: [[1,6],[1,7],[1,8],[1,9]],
  TEN_MIN: [[6,0],[6,1],[6,2]],
  QUARTER: [[0,7],[0,8],[0,9],[0,10],[0,11],[0,12],[0,13]],
  TWENTY: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]],
  HALF: [[1,10],[1,11],[1,12],[1,13]],

  PAST: [[2,0],[2,1],[2,2],[2,3]],
  TO: [[2,12],[2,13]],

  OCLOCK: [[2,6],[2,7],[2,8],[2,9],[2,10],[2,11]],

  HOURS: {

    1:[[4,0],[4,1],[4,2]],
    2:[[4,3],[4,4],[4,5]],
    3:[[4,6],[4,7],[4,8],[4,9],[4,10]],
    4:[[5,0],[5,1],[5,2],[5,3]],
    5:[[5,4],[5,5],[5,6],[5,7]],
    6:[[5,8],[5,9],[5,10]],
    7:[[3,0],[3,1],[3,2],[3,3],[3,4]],
    8:[[3,5],[3,6],[3,7],[3,8],[3,9]],
    9:[[3,10],[3,11],[3,12],[3,13]],
    10:[[6,0],[6,1],[6,2]],
    11:[[6,3],[6,4],[6,5],[6,6],[6,7],[6,8]],
    12:[[6,9],[6,10],[6,11],[6,12],[6,13],[6,14]],

  }

};

/* ================= VALIDATOR ================= */

function validateWords(words) {

  const used = new Map();

  function checkWord(name, coords) {

    coords.forEach(([r,c]) => {

      const key = `${r}-${c}`;

      if (used.has(key)) {

        console.warn(
          `Overlap detected at ${key}:`,
          used.get(key),
          'and',
          name
        );

      } else {

        used.set(key, name);

      }

    });

  }

  Object.entries(words).forEach(([name, coords]) => {

    if (name === 'HOURS') {

      Object.entries(coords).forEach(([h, hCoords]) =>
        checkWord(`HOUR_${h}`, hCoords)
      );

    } else {

      checkWord(name, coords);

    }

  });

}

/* run once */
validateWords(WORDS);

/* ================= HELPERS ================= */

function normalizeTime(date) {

  let h = date.getHours();
  let m = date.getMinutes();

  let snapped = Math.round(m / 5) * 5;

  if (snapped === 60) {
    snapped = 0;
    h++;
  }

  const isTo = snapped > 30;

  const displayMinutes = isTo
    ? 60 - snapped
    : snapped;

  let displayHour = h % 12 || 12;

  if (isTo)
    displayHour = (displayHour % 12) + 1;

  return { displayHour, displayMinutes, isTo };

}

function addWord(set, coords) {

  coords.forEach(([r,c]) =>
    set.add(`${r}-${c}`)
  );

}

/* ================= COMPONENT ================= */

export default function WordClock() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const interval =
      setInterval(
        () => setTime(new Date()),
        CONFIG.UPDATE_INTERVAL
      );

    return () => clearInterval(interval);

  }, []);

  const highlighted = useMemo(() => {

    const active = new Set();

    const {
      displayHour,
      displayMinutes,
      isTo
    } = normalizeTime(time);

    addWord(active, WORDS.IT);
    addWord(active, WORDS.IS);

    const MINUTE_MAP = {

      5:[WORDS.FIVE_MIN],
      10:[WORDS.TEN_MIN],
      15:[WORDS.QUARTER],
      20:[WORDS.TWENTY],
      25:[WORDS.TWENTY, WORDS.FIVE_MIN],
      30:[WORDS.HALF],

    };

    if (displayMinutes === 0) {

      addWord(active, WORDS.OCLOCK);

    } else {

      MINUTE_MAP[displayMinutes]
        ?.forEach(w => addWord(active, w));

      addWord(active, isTo ? WORDS.TO : WORDS.PAST);

    }

    addWord(active, WORDS.HOURS[displayHour]);

    return active;

  }, [time]);

  return (

    <div style={styles.container}>

      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Nanum+Pen+Script&display=swap');
        `}
      </style>

      <div style={styles.grid}>

        {MATRIX.map((row,r)=>

          <div key={r} style={styles.row}>

            {row.map((letter,c)=>{

              const key = `${r}-${c}`;
              const on = highlighted.has(key);

              return (
                <div
                  key={key}
                  style={{
                    ...styles.cell,
                    color: on
                      ? CONFIG.COLORS.highlight
                      : CONFIG.COLORS.subtle,

                    fontFamily: on
                      ? "'Nanum Pen Script', cursive"
                      : "'Cinzel Decorative', cursive",

                    transform:
                      on ? 'scale(1.2)' : 'scale(1)',

                    opacity: on ? 1 : 0.7,

                    transition:
                      `all ${CONFIG.FADE_DURATION}`
                  }}
                >
                  {letter}
                </div>
              );

            })}

          </div>

        )}

      </div>

    </div>

  );

}

/* ================= STYLES ================= */

const styles = {

  container:{
    width:'100vw',
    height:'100vh',
    background:CONFIG.COLORS.background,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },

  grid:{
    display:'flex',
    flexDirection:'column',
    gap:'clamp(2px,0.8vh,8px)'
  },

  row:{
    display:'flex',
    gap:'clamp(2px,0.8vw,8px)',
    justifyContent:'center'
  },

  cell:{
    width:'clamp(18px,5vw,45px)',
    height:'clamp(18px,5vw,45px)',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    fontSize:'clamp(11px,8vw,42px)',
    userSelect:'none'
  }

};
