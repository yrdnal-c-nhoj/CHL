import React, { useEffect, useRef } from 'react';

// ── constants ────────────────────────────────────────────────────────────────

const COLORS: Record<ElementType, string> = {
  hour:   '#ff1493',
  minute: '#00bfff',
  second: '#00ff7f',
  period: '#ffaa00',
};

const THRESH = 0.002;

type ElementType = 'hour' | 'minute' | 'second' | 'period';

interface ClockElement {
  val:  number | string;
  type: ElementType;
  idx:  number;
}

// Pre-build array out of the loop with precise typing
const ELEMENTS: ClockElement[] = [
  ...Array.from({ length: 12 }, (_, i) => ({ val: i + 1, type: 'hour' as const, idx: i + 1 })),
  ...Array.from({ length: 60 }, (_, i) => ({ val: i,     type: 'minute' as const, idx: i })),
  ...Array.from({ length: 60 }, (_, i) => ({ val: i,     type: 'second' as const, idx: i })),
  { val: 'am', type: 'period' as const, idx: 0 },
  { val: 'pm', type: 'period' as const, idx: 1 },
];

const TOTAL_ELEMENTS = ELEMENTS.length;

// ── helpers ──────────────────────────────────────────────────────────────────

/** Smooth circular proximity weight in [0, 1]. Optimized math. */
function prox(idx: number, cur: number, range: number): number {
  let d = idx - cur;
  if (d < 0) d = -d; // Faster than Math.abs
  if (d > range * 0.5) d = range - d;
  return d < 1.5 ? 1 - d * 0.6666666666666666 : 0; // Pre-calculated 1 / 1.5
}

/** Pre-allocated array to avoid GC sweeps inside rAF */
const WEIGHTS_ARRAY = new Float32Array(TOTAL_ELEMENTS);

/** Compute per-element weights directly into an existing array buffer. */
function updateWeights(now: Date): void {
  const ms    = now.getMilliseconds();
  const sec   = now.getSeconds();
  const min   = now.getMinutes();
  const rawH  = now.getHours();
  const dH    = rawH % 12 || 12;
  const pIdx  = rawH >= 12 ? 1 : 0;
  const cSec  = sec  + ms   * 0.001; // Multiplication is faster than division
  const cMin  = min  + cSec * 0.016666666666666666;
  const cHour = (rawH % 12 === 0 ? 0 : dH) + cMin * 0.016666666666666666;

  for (let i = 0; i < TOTAL_ELEMENTS; i++) {
    const el = ELEMENTS[i];
    if (el.type === 'hour') {
      WEIGHTS_ARRAY[i] = prox(el.idx === 12 ? 0 : el.idx, cHour, 12);
    } else if (el.type === 'minute') {
      WEIGHTS_ARRAY[i] = prox(el.idx, cMin, 60);
    } else if (el.type === 'second') {
      WEIGHTS_ARRAY[i] = prox(el.idx, cSec, 60);
    } else {
      WEIGHTS_ARRAY[i] = el.idx === pIdx ? 1 : 0;
    }
  }
}

/** Write visual state directly to DOM refs. Strings are strictly cached/built cleanly. */
function applyWeight(
  span: HTMLSpanElement,
  lens: HTMLDivElement,
  w:    number,
  el:   ClockElement,
): void {
  const isMain   = el.type !== 'period';
  const opFloor  = isMain ? 0.18 : 0.03;
  const sMul     = isMain ? 3.0  : 1.0;
  const scaleMax = isMain ? 1.45 : 1.15;
  const base     = COLORS[el.type];

  const tp   = Math.pow(w, 2.2);
  const fp   = Math.pow(w, 3.5);
  const blur = tp * 6.5 * sMul;
  const zoom = 1 + tp * scaleMax;

  span.style.opacity    = (opFloor + tp * (1 - opFloor)).toFixed(3);
  span.style.transform  = `scale(${zoom.toFixed(3)})`;
  span.style.color      = w > 0.3 ? '#fff' : base;
  span.style.fontWeight = isMain ? '900' : '700';
  
  if (blur > 0.01) {
    const b1 = blur.toFixed(2);
    const b2 = (blur * 1.5).toFixed(2);
    const b3 = (blur * 3.0).toFixed(2);
    const b4 = (blur * 4.5).toFixed(2);
    span.style.textShadow = `0 0 ${b1}vmin #fff, 0 0 ${b2}vmin ${base}, 0 0 ${b3}vmin ${base}, 0 0 ${b4}vmin ${base}`;
  } else {
    span.style.textShadow = 'none';
  }

  lens.style.opacity   = fp.toFixed(3);
  lens.style.transform = `scale(${(1 + (1 - fp) * 0.6).toFixed(3)})`;
}

// ── sub-components ───────────────────────────────────────────────────────────

interface NodeRefs {
  span:  HTMLSpanElement  | null;
  lens:  HTMLDivElement   | null;
  prevW: number;
}

interface ClockCellProps {
  val:    number | string;
  elRef:  NodeRefs;
}

const ClockCell = React.memo(({ val, elRef }: ClockCellProps) => {
  return (
    <div style={styles.cell}>
      <span
        ref={r => { elRef.span = r; }}
        style={styles.span}
      >
        {val}
      </span>
      <div
        ref={r => { elRef.lens = r; }}
        style={styles.lens}
      />
    </div>
  );
});

ClockCell.displayName = 'ClockCell';

// ── main component ───────────────────────────────────────────────────────────

export default function DigitalClock() {
  const refsArr = useRef<NodeRefs[]>([]);
  
  if (refsArr.current.length === 0) {
    refsArr.current = Array.from({ length: TOTAL_ELEMENTS }, () => ({ span: null, lens: null, prevW: -1 }));
  }

  const bucketRef = useRef(-1);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const linkId = 'google-font-bitcount';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const refs = refsArr.current;

    function frame() {
      rafRef.current = requestAnimationFrame(frame);

      const now = new Date();
      // 0.5ms bucket check -> roughly twice every millisecond.
      const mb = now.getMilliseconds() >> 1; 
      if (mb === bucketRef.current) return;
      bucketRef.current = mb;

      updateWeights(now);

      for (let i = 0; i < TOTAL_ELEMENTS; i++) {
        const r = refs[i];
        const w = WEIGHTS_ARRAY[i];
        
        let diff = w - r.prevW;
        if (diff < 0) diff = -diff; // Manual Math.abs optimization
        if (diff < THRESH) continue;

        r.prevW = w;
        if (r.span && r.lens) {
          applyWeight(r.span, r.lens, w, ELEMENTS[i]);
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.gridContainer}>
        <div style={styles.grid}>
          {ELEMENTS.map((el, i) => (
            <ClockCell
              key={`${el.type}-${el.idx}`}
              val={el.val}
              elRef={refsArr.current[i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    height:          '100vh',
    width:           '100vw',
    backgroundColor: '#787B80',
    fontFamily:      '"Bitcount Grid Double", monospace',
    boxSizing:       'border-box',
    overflow:        'hidden',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '4vmin',
    boxSizing: 'border-box',
  },
  grid: {
    display:               'grid',
    gridTemplateColumns:   'repeat(14, 1fr)',
    gridTemplateRows:      'repeat(10, 1fr)',
    aspectRatio:           '1.4 / 1',
    gap:                   '0.5px',
    userSelect:            'none',
    boxSizing:             'border-box',
  },
  cell: {
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: '#2D2003',
    position:        'relative',
    overflow:        'visible',
  },
  span: {
    fontSize:    '5vw',
    lineHeight:  1,
    display:     'inline-block',
    willChange:  'transform, opacity',
    position:    'relative',
    zIndex:      3,
  },
  lens: {
    position:     'absolute',
    width:        '175%',
    height:       '155%',
    borderRadius: '50%',
    border:       '0.1vmin solid #ffffff',
    pointerEvents:'none',
    willChange:   'transform, opacity',
    zIndex:       4,
    boxShadow:    '0 0 3vmin #fff, inset 0 0 2vmin #fff, 0 0 4vmin rgba(255, 255, 255, 0.98)',
    opacity:      0,
    transform:    'scale(1.6)',
  },
};