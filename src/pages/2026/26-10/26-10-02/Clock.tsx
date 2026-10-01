import { useEffect, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

const TARGET_FPS = 120;
const REDUCED_MOTION_FPS = 30;

/* Rain */
const RAIN_DENSITY = 0.0005;
const RAIN_DIR = Math.PI * 0.4;
const RAIN_SPEED_MIN = 8;
const RAIN_SPEED_MAX = 90;
const RAIN_TRAIL = 16;
const RAIN_WIDTH = 2.2;

/* Splash */
const SPLASH_SPEED = 5;
const SPLASH_GRAVITY = 0.28;
const SPLASH_FRICTION = 0.98;
const SPLASH_PER_HIT_MIN = 5;
const SPLASH_PER_HIT_MAX = 12;

/* Water running off digits */
const DRIP_SPAWN_THRESHOLD = 2;
const DRIP_SPAWN_CHANCE = 0.012;
const DRIP_GRAVITY = 0.45;
const DRIP_MIN_SPEED = 0.5;
const DRIP_MAX_SPEED = 2.2;
const DRIP_WIDTH = 3;
const DRIP_LENGTH = 1.5;

/* Water pools */
const POOL_ADD_PER_HIT = 10;
const POOL_DECAY = 0.97;
const POOL_FLOW = 0.32;
const POOL_VIS_MIN = 0.1;
const POOL_VIS_SCALE = 0.55;

const SLOPE_FLOW_BOOST = 12;
const SLOPE_DRIP_BONUS = 120;

/* Edge splashes */
const EDGE_FAKE_RATE = 24;
const EDGE_SPLASH_COUNT_MIN = 3;
const EDGE_SPLASH_COUNT_MAX = 5;
const EDGE_SPLASH_SPEED = 0.35;
const EDGE_SPLASH_SPREAD = Math.PI * 0.9;

const BACKGROUND = '#000000';
const RAIN_COLOR = '#ffffff';

type RainDrop = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Splash = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

type Drip = {
  x: number;
  y: number;
  vy: number;
  width: number;
  length: number;
  life: number;
};

const Clock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const clockText = `${hours}${minutes}`;

  const clockTextRef = useRef(clockText);

  useEffect(() => {
    clockTextRef.current = clockText;
  }, [clockText]);

  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Cormorant:wght@700&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d', {
      alpha: false,
    });

    if (!ctx) {
      return;
    }

    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');

    if (!textCtx) {
      return;
    }

    let W = 0;
    let H = 0;
    let DPR = 1;

    let maskData: Uint8ClampedArray | null = null;
    let ledgeFlags: Uint8Array | null = null;
    let pool: Float32Array | null = null;
    let slideNeighbor: Int32Array | null = null;
    let slopeDown: Uint8Array | null = null;

    const ledgeIndices: number[] = [];
    const edgeTop: number[] = [];
    const edgeBottom: number[] = [];
    const edgeLeft: number[] = [];
    const edgeRight: number[] = [];

    const rain: RainDrop[] = [];
    const splashes: Splash[] = [];
    const drips: Drip[] = [];

    let groundY = -1;

    let animationFrame = 0;
    let lastFrameTime = 0;
    let lastTime = 0;

    let effectiveTargetFps = TARGET_FPS;

    let edgeEmitAccumulator = 0;
    let renderedClockText = '';

    const fontFamily =
      '"Cormorant", "Montserrat", "Poppins", "Inter", system-ui, sans-serif';

    const hexToRgb = (hex: string) => {
      let value = hex.replace('#', '');

      if (value.length === 3) {
        value = value
          .split('')
          .map((character) => character + character)
          .join('');
      }

      const number = parseInt(value, 16);

      return {
        r: (number >> 16) & 255,
        g: (number >> 8) & 255,
        b: number & 255,
      };
    };

    const rainRgb = hexToRgb(RAIN_COLOR);

    const rgba = (alpha: number) =>
      `rgba(${rainRgb.r}, ${rainRgb.g}, ${rainRgb.b}, ${alpha})`;

    const isSolidAt = (x: number, y: number) => {
      if (!maskData) {
        return false;
      }

      const xi = x | 0;
      const yi = y | 0;

      if (
        xi < 0 ||
        yi < 0 ||
        xi >= W ||
        yi >= H
      ) {
        return false;
      }

      return (
        maskData[((yi * W + xi) << 2) + 3]! >
        127
      );
    };

    const isLedge = (index: number) => {
      return ledgeFlags
        ? ledgeFlags[index] === 1
        : false;
    };

    const nearestTopSurfaceIndex = (
      x: number,
      y: number,
    ) => {
      if (!maskData || !ledgeFlags) {
        return -1;
      }

      const xi = Math.max(
        0,
        Math.min(W - 1, x | 0),
      );

      let yi = Math.max(
        0,
        Math.min(H - 1, y | 0),
      );

      if (!isSolidAt(xi, yi)) {
        while (
          yi < H &&
          !isSolidAt(xi, yi)
        ) {
          yi++;
        }

        yi = Math.min(H - 1, yi);
      }

      while (
        yi >= 0 &&
        isSolidAt(xi, yi)
      ) {
        yi--;
      }

      yi = Math.min(H - 1, yi + 1);

      const index = yi * W + xi;

      return isLedge(index)
        ? index
        : -1;
    };

    /*
     * Spawn a rain drop outside the viewport.
     */
    const spawnAtEntry = (
      drop: RainDrop,
    ) => {
      const dx = Math.cos(RAIN_DIR);
      const dy = Math.sin(RAIN_DIR);

      const marginX = Math.max(
        50,
        W * 0.25,
      );

      const marginY = Math.max(
        50,
        H * 0.25,
      );

      if (dx > 0) {
        if (dy > 0) {
          drop.x =
            -marginX -
            Math.random() * marginX;

          drop.y =
            Math.random() *
              (H + marginY) -
            marginY;
        } else {
          drop.x =
            -marginX -
            Math.random() * marginX;

          drop.y =
            H +
            Math.random() * marginY;
        }
      } else {
        if (dy > 0) {
          drop.x =
            W +
            Math.random() * marginX;

          drop.y =
            -marginY -
            Math.random() * marginY;
        } else {
          drop.x =
            W +
            Math.random() * marginX;

          drop.y =
            H +
            Math.random() * marginY;
        }
      }

      /*
       * Start some drops at the top as well.
       * This creates a fuller field of rain.
       */
      if (Math.random() < 0.55) {
        drop.x =
          Math.random() *
            (W + marginX * 2) -
          marginX;

        drop.y =
          -marginY -
          Math.random() * marginY;
      }

      const speed =
        RAIN_SPEED_MIN +
        Math.random() *
          (RAIN_SPEED_MAX -
            RAIN_SPEED_MIN);

      drop.vx = dx * speed;
      drop.vy = dy * speed;
    };

    const spawnInitialRain = () => {
      rain.length = 0;
      splashes.length = 0;
      drips.length = 0;

      const count = Math.max(
        700,
        Math.floor(
          W *
            H *
            RAIN_DENSITY,
        ),
      );

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const drop: RainDrop = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        };

        spawnAtEntry(drop);

        /*
         * Distribute the initial rain through
         * the viewport so it is raining immediately.
         */
        drop.x =
          Math.random() * W;

        drop.y =
          Math.random() * H;

        rain.push(drop);
      }
    };

    const spawnSplashes = (
      x: number,
      y: number,
      count: number,
    ) => {
      for (
        let i = 0;
        i < count;
        i++
      ) {
        const angle =
          -Math.PI / 2 +
          Math.random() *
            Math.PI *
            0.7 -
          Math.PI *
            0.35;

        const speed =
          SPLASH_SPEED *
          (0.7 +
            Math.random() *
              0.7);

        splashes.push({
          x,
          y,
          vx:
            Math.cos(angle) *
            speed,
          vy:
            Math.sin(angle) *
            speed,
          life:
            0.8 +
            Math.random() *
              0.5,
        });
      }
    };

    const spawnDirectedSplashes = (
      x: number,
      y: number,
      normalAngle: number,
      count: number,
      baseSpeed: number,
      spread: number,
    ) => {
      for (
        let i = 0;
        i < count;
        i++
      ) {
        const angle =
          normalAngle +
          Math.random() *
            spread -
          spread * 0.5;

        const speed =
          baseSpeed *
          (0.7 +
            Math.random() *
              0.8);

        splashes.push({
          x,
          y,
          vx:
            Math.cos(angle) *
            speed,
          vy:
            Math.sin(angle) *
            speed,
          life:
            0.8 +
            Math.random() *
              0.5,
        });
      }
    };

    /*
     * Larger, thicker drips.
     */
    const spawnDrip = (
      index: number,
    ) => {
      const y =
        (index / W) | 0;

      const x =
        index -
        y * W;

      drips.push({
        x:
          x +
          Math.random() *
            1.6 -
          0.8,

        y:
          y -
          1,

        vy:
          DRIP_MIN_SPEED +
          Math.random() *
            (DRIP_MAX_SPEED -
              DRIP_MIN_SPEED),

        width:
          DRIP_WIDTH *
          (0.75 +
            Math.random() *
              0.7),

        length:
          DRIP_LENGTH *
          (0.8 +
            Math.random() *
              1.2),

        life:
          1,
      });
    };

    const spawnEdgeEvent = () => {
      const top =
        edgeTop.length;

      const bottom =
        edgeBottom.length;

      const left =
        edgeLeft.length;

      const right =
        edgeRight.length;

      const total =
        top +
        bottom +
        left +
        right;

      if (total <= 0) {
        return;
      }

      let random =
        Math.random() *
        total;

      let source: number[];
      let angle: number;

      if (
        (random -= top) <
        0
      ) {
        source = edgeTop;
        angle =
          -Math.PI / 2;
      } else if (
        (random -= bottom) <
        0
      ) {
        source =
          edgeBottom;

        angle =
          Math.PI / 2;
      } else if (
        (random -= left) <
        0
      ) {
        source =
          edgeLeft;

        angle = Math.PI;
      } else {
        source =
          edgeRight;

        angle = 0;
      }

      if (
        source.length === 0
      ) {
        return;
      }

      const index =
        source[
          (Math.random() *
            source.length) |
            0
        ]!;

      const y =
        (index / W) | 0;

      const x =
        index -
        y * W;

      if (
        groundY >= 0 &&
        y > groundY
      ) {
        return;
      }

      const count =
        EDGE_SPLASH_COUNT_MIN +
        ((Math.random() *
          (EDGE_SPLASH_COUNT_MAX -
            EDGE_SPLASH_COUNT_MIN +
            1)) |
          0);

      spawnDirectedSplashes(
        x,
        y,
        angle,
        count,
        EDGE_SPLASH_SPEED,
        EDGE_SPLASH_SPREAD,
      );

      if (pool) {
        pool[index]! +=
          POOL_ADD_PER_HIT *
          0.15;
      }
    };

    /*
     * IMPORTANT:
     *
     * The font size is calculated directly from
     * the actual viewport dimensions every time
     * the viewport changes.
     *
     * There is no CSS transform and no arbitrary
     * fixed clock size.
     */
    const rebuildTextMask = () => {
      if (
        !maskData ||
        !ledgeFlags ||
        !pool ||
        !slideNeighbor ||
        !slopeDown
      ) {
        return;
      }

      textCtx.clearRect(
        0,
        0,
        W,
        H,
      );

      const text =
        clockTextRef.current;

      /*
       * Start with a large measurement size.
       * We then calculate the exact final font
       * size needed for this viewport.
       */
      const measurementFontSize =
        1000;

      textCtx.font =
        `700 ${measurementFontSize}px ${fontFamily}`;

      textCtx.textAlign =
        'center';

      textCtx.textBaseline =
        'middle';

      const measurement =
        textCtx.measureText(
          text,
        );

      const measuredWidth =
        measurement.width;

      const measuredHeight =
        (measurement.actualBoundingBoxAscent ||
          measurementFontSize *
            0.75) +
        (measurement.actualBoundingBoxDescent ||
          measurementFontSize *
            0.2);

      /*
       * Keep considerably more space around
       * the clock than before.
       */
      const horizontalMargin =
        W * 0.10;

      const verticalMargin =
        H * 0.16;

      const availableWidth =
        Math.max(
          1,
          W -
            horizontalMargin *
              2,
        );

      const availableHeight =
        Math.max(
          1,
          H -
            verticalMargin *
              2,
        );

      /*
       * Calculate the font size independently
       * from width and height.
       */
      const widthFontSize =
        measurementFontSize *
        (availableWidth /
          measuredWidth);

      const heightFontSize =
        measurementFontSize *
        (availableHeight /
          measuredHeight);

      /*
       * This is the actual font size used
       * to render the clock.
       */
      const finalFontSize =
        Math.max(
          10,
          Math.min(
            widthFontSize,
            heightFontSize,
          ),
        );

      textCtx.clearRect(
        0,
        0,
        W,
        H,
      );

      textCtx.font =
        `700 ${finalFontSize}px ${fontFamily}`;

      textCtx.fillStyle =
        '#ffffff';

      textCtx.textAlign =
        'center';

      textCtx.textBaseline =
        'middle';

      /*
       * Render the clock at its final calculated
       * size. No scale() transformation.
       */
      textCtx.fillText(
        text,
        W / 2,
        H / 2,
      );

      /*
       * Measure the actual rendered bounds
       * again. This gives us the true bottom
       * of the digits.
       */
      const finalMeasurement =
        textCtx.measureText(
          text,
        );

      const actualAscent =
        finalMeasurement.actualBoundingBoxAscent ||
        finalFontSize * 0.75;

      const actualDescent =
        finalMeasurement.actualBoundingBoxDescent ||
        finalFontSize * 0.2;

      const textBottom =
        H / 2 +
        actualDescent;

      /*
       * Put the water-catching surface well below
       * the digits.
       */
      const groundGap =
        Math.max(
          10 * DPR,
          finalFontSize *
            0.55,
        );

      const groundThickness =
        Math.max(
          14 * DPR,
          finalFontSize *
            0.18,
        );

      const calculatedGroundY =
        textBottom +
        groundGap;

      /*
       * Never allow the ground to push the clock
       * outside the viewport.
       */
      groundY = Math.min(
        H -
          groundThickness -
          1,
        calculatedGroundY,
      );

      /*
       * Ground beneath the clock.
       */
      textCtx.fillRect(
        0,
        groundY,
        W,
        groundThickness,
      );

      /*
       * Read the final mask.
       */
      const image =
        textCtx.getImageData(
          0,
          0,
          W,
          H,
        );

      maskData =
        image.data;

      ledgeFlags.fill(0);
      pool.fill(0);
      slideNeighbor.fill(-1);
      slopeDown.fill(0);

      ledgeIndices.length = 0;
      edgeTop.length = 0;
      edgeBottom.length = 0;
      edgeLeft.length = 0;
      edgeRight.length = 0;

      const solid = (
        x: number,
        y: number,
      ) => {
        if (
          x < 0 ||
          y < 0 ||
          x >= W ||
          y >= H
         ) {
          return false;
        }

        if (!maskData) {
          return false;
        }

        return (
          maskData[
            ((y * W + x) << 2) +
              3
          ]! > 127
        );
      };

      /*
       * Detect every exposed edge of the digits
       * and the water-catching surface.
       */
      for (
        let y = 0;
        y < H;
        y++
      ) {
        for (
          let x = 0;
          x < W;
          x++
        ) {
          if (
            !solid(x, y)
          ) {
            continue;
          }

          const index =
            y * W + x;

          if (
            !solid(
              x,
              y - 1,
            )
          ) {
            ledgeFlags[
              index
            ] = 1;

            ledgeIndices.push(
              index,
            );

            edgeTop.push(
              index,
            );
          }

          if (
            !solid(
              x,
              y + 1,
            )
          ) {
            edgeBottom.push(
              index,
            );
          }

          if (
            !solid(
              x - 1,
              y,
            )
          ) {
            edgeLeft.push(
              index,
            );
          }

          if (
            !solid(
              x + 1,
              y,
            )
          ) {
            edgeRight.push(
              index,
            );
          }
        }
      }

      /*
       * Find downhill neighbors for water flow.
       */
      const offsets: [number, number][] = [
        [1, 1],
        [1, 0],
        [0, 1],
        [2, 1],
        [2, 0],
        [-1, 1],
      ];

      for (
        const index of ledgeIndices
      ) {
        const y =
          (index / W) | 0;

        const x =
          index -
          y * W;

        let best = -1;
        let bestScore =
          -Infinity;

        let drop = 0;

        for (
          const [dx, dy] of offsets
        ) {
          const nx =
            x + dx;

          const ny =
            y + dy;

          if (
            nx < 0 ||
            ny < 0 ||
            nx >= W ||
            ny >= H
          ) {
            continue;
          }

          const neighborIndex =
            ny * W + nx;

          if (
            !ledgeFlags[
              neighborIndex
            ]
          ) {
            continue;
          }

          const verticalDrop =
            ny - y;

          const score =
            verticalDrop *
              10 +
            (dx > 0
              ? 1
              : 0) -
            Math.abs(dx) *
              0.2;

          if (
            score >
            bestScore
          ) {
            bestScore =
              score;

            best =
              neighborIndex;

            drop =
              verticalDrop;
          }
        }

        slideNeighbor[
          index
        ] = best;

        slopeDown[
          index
        ] = drop & 3;
      }
    };

    const resize = () => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      /*
       * Recalculate DPR and canvas size on
       * every viewport change.
       */
      DPR = Math.min(
        1.5,
        Math.max(
          1,
          window.devicePixelRatio ||
            1,
        ),
      );

      W =
        Math.max(
          1,
          Math.floor(
            width * DPR,
          ),
        );

      H =
        Math.max(
          1,
          Math.floor(
            height * DPR,
          ),
        );

      canvas.width = W;
      canvas.height = H;

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      textCanvas.width = W;
      textCanvas.height = H;

      ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0,
      );

      maskData =
        new Uint8ClampedArray(
          W * H * 4,
        );

      ledgeFlags =
        new Uint8Array(
          W * H,
        );

      pool =
        new Float32Array(
          W * H,
        );

      slideNeighbor =
        new Int32Array(
          W * H,
        );

      slideNeighbor.fill(
        -1,
      );

      slopeDown =
        new Uint8Array(
          W * H,
        );

      /*
       * This is where the clock is continuously
       * resized to the new viewport.
       */
      rebuildTextMask();

      spawnInitialRain();
    };

    const frame = (
      timestamp: number,
    ) => {
      const frameInterval =
        1000 /
        effectiveTargetFps;

      if (
        lastFrameTime &&
        timestamp -
          lastFrameTime <
          frameInterval
      ) {
        animationFrame =
          requestAnimationFrame(
            frame,
          );

        return;
      }

      lastFrameTime =
        timestamp;

      if (
        lastTime === 0
      ) {
        lastTime = timestamp;
      }

      const delta =
        Math.min(
          33,
          timestamp -
            lastTime,
        ) / 16.67;

      lastTime =
        timestamp;

      /*
       * Update the clock mask immediately when
       * HHMM changes.
       */
      if (
        renderedClockText !==
        clockTextRef.current
      ) {
        renderedClockText =
          clockTextRef.current;

        rebuildTextMask();
        spawnInitialRain();
      }

      ctx.fillStyle =
        BACKGROUND;

      ctx.fillRect(
        0,
        0,
        W,
        H,
      );

      ctx.save();

      /*
       * Do not draw the rain below the water
       * surface.
       */
      if (
        groundY >= 0
      ) {
        ctx.beginPath();

        ctx.rect(
          0,
          0,
          W,
          groundY,
        );

        ctx.clip();
      }

      /*
       * LARGE RAIN
       */
      ctx.lineWidth =
        RAIN_WIDTH;

      ctx.lineCap =
        'round';

      ctx.strokeStyle =
        rgba(0.72);

      ctx.beginPath();

      for (
        const drop of rain
      ) {
        const nextX =
          drop.x +
          drop.vx *
            delta;

        const nextY =
          drop.y +
          drop.vy *
            delta;

        /*
         * Collision with the clock.
         */
        if (
          isSolidAt(
            nextX,
            nextY,
          )
        ) {
          const hitX =
            drop.x +
            drop.vx *
              delta *
              0.4;

          const hitY =
            drop.y +
            drop.vy *
              delta *
              0.4;

          const surfaceIndex =
            nearestTopSurfaceIndex(
              hitX,
              hitY,
            );

          if (
            surfaceIndex !==
              -1 &&
            pool
          ) {
            pool[
              surfaceIndex
            ]! +=
              POOL_ADD_PER_HIT;
          }

          const splashCount =
            SPLASH_PER_HIT_MIN +
            ((Math.random() *
              (SPLASH_PER_HIT_MAX -
                SPLASH_PER_HIT_MIN +
                1)) |
              0);

          spawnSplashes(
            hitX,
            hitY,
            splashCount,
          );

          spawnAtEntry(
            drop,
          );
        } else {
          ctx.moveTo(
            drop.x -
              drop.vx *
                RAIN_TRAIL,
            drop.y -
              drop.vy *
                RAIN_TRAIL,
          );

          ctx.lineTo(
            drop.x,
            drop.y,
          );

          drop.x =
            nextX;

          drop.y =
            nextY;

          if (
            drop.x <
              -100 ||
            drop.x >
              W + 100 ||
            drop.y <
              -100 ||
            drop.y >
              H + 100
          ) {
            spawnAtEntry(
              drop,
            );
          }
        }
      }

      ctx.stroke();

      /*
       * Splash particles.
       */
      ctx.lineWidth =
        Math.max(
          1.5,
          RAIN_WIDTH *
            0.9,
        );

      ctx.strokeStyle =
        rgba(0.75);

      ctx.beginPath();

      for (
        let index =
          splashes.length -
          1;
        index >= 0;
        index--
      ) {
        const splash =
          splashes[index]!;

        splash.vy +=
          SPLASH_GRAVITY *
          delta;

        splash.vx *=
          Math.pow(
            SPLASH_FRICTION,
            delta,
          );

        splash.vy *=
          Math.pow(
            SPLASH_FRICTION,
            delta,
          );

        const previousX =
          splash.x;

        const previousY =
          splash.y;

        splash.x +=
          splash.vx *
          delta;

        splash.y +=
          splash.vy *
          delta;

        splash.life -=
          0.02 *
          delta;

        ctx.moveTo(
          previousX,
          previousY,
        );

        ctx.lineTo(
          splash.x,
          splash.y,
        );

        if (
          splash.life <=
            0 ||
          isSolidAt(
            splash.x,
            splash.y,
          )
        ) {
          const surfaceIndex =
            nearestTopSurfaceIndex(
              splash.x,
              splash.y,
            );

          if (
            surfaceIndex !==
              -1 &&
            pool
          ) {
            pool[
              surfaceIndex
            ]! += 1;
          }

          splashes.splice(
            index,
            1,
          );
        }
      }

      ctx.stroke();

      /*
       * Additional small impacts around
       * the exposed edges.
       */
      edgeEmitAccumulator +=
        EDGE_FAKE_RATE *
        delta;

      while (
        edgeEmitAccumulator >=
        1
      ) {
        spawnEdgeEvent();

        edgeEmitAccumulator -=
          1;
      }

      /*
       * Move accumulated water along
       * the upper edges of the digits.
       */
      if (
        pool &&
        slideNeighbor &&
        slopeDown
      ) {
        for (
          const index of
            ledgeIndices
        ) {
          let value =
            pool[index]!;

          if (
            value <=
            0.0001
          ) {
            pool[index] =
              0;

            continue;
          }

          value *=
            Math.pow(
              POOL_DECAY,
              delta,
            );

          const nextIndex =
            slideNeighbor[
              index
            ]!;

          if (
            nextIndex !==
            -1
          ) {
            const drop =
              slopeDown[
                index
              ]!;

            const flow =
              Math.min(
                value *
                  0.9,

                value *
                  (1 -
                    Math.pow(
                      1 -
                        POOL_FLOW,
                      delta,
                    )) *
                  (1 +
                    SLOPE_FLOW_BOOST *
                      drop),
              );

            value -=
              flow;

            pool[
              nextIndex
            ]! +=
              flow;

            /*
             * Larger drips form much more readily
             * when water reaches an edge.
             */
            if (
              value >
                DRIP_SPAWN_THRESHOLD &&
              Math.random() <
                (DRIP_SPAWN_CHANCE +
                  drop *
                    SLOPE_DRIP_BONUS) *
                  delta
            ) {
              spawnDrip(
                index,
              );

              value =
                Math.max(
                  0,
                  value -
                    1.5,
                );
            }
          } else if (
            value >
              DRIP_SPAWN_THRESHOLD &&
            Math.random() <
              DRIP_SPAWN_CHANCE *
                1.5 *
                delta
          ) {
            spawnDrip(
              index,
            );

            value =
              Math.max(
                0,
                value -
                  1.5,
              );
          }

          pool[index] =
            value;
        }
      }

      /*
       * Thick water sitting on the digit edges.
       */
      if (pool) {
        ctx.lineWidth =
          Math.max(
            2,
            RAIN_WIDTH *
              1.2,
          );

        ctx.strokeStyle =
          rgba(0.95);

        ctx.beginPath();

        for (
          const index of
            ledgeIndices
        ) {
          const value =
            pool[index]!;

          if (
            value <=
            POOL_VIS_MIN
          ) {
            continue;
          }

          const y =
            (index / W) | 0;

          const x =
            index -
            y * W;

          const alpha =
            Math.min(
              1,
              (value -
                POOL_VIS_MIN) *
                POOL_VIS_SCALE,
            );

          if (
            value > 1 ||
            Math.random() <
              0.75
          ) {
            ctx.strokeStyle =
              rgba(alpha);

            ctx.moveTo(
              x - 1,
              y - 1,
            );

            ctx.lineTo(
              x + 2,
              y - 1,
            );
          }
        }

        ctx.stroke();
      }

      /*
       * BIG DRIPS
       */
      for (
        let index =
          drips.length - 1;
        index >= 0;
        index--
      ) {
        const drip =
          drips[index]!;

        const previousY =
          drip.y;

        drip.vy +=
          DRIP_GRAVITY *
          delta;

        drip.vy = Math.min(
          drip.vy,
          12,
        );

        drip.y +=
          drip.vy *
          delta;

        /*
         * Draw a thick vertical stream
         * followed by a large round drop.
         */
        ctx.beginPath();

        ctx.strokeStyle =
          rgba(0.9);

        ctx.lineWidth =
          drip.width;

        ctx.lineCap =
          'round';

        ctx.moveTo(
          drip.x,
          previousY,
        );

        ctx.lineTo(
          drip.x,
          drip.y,
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.fillStyle =
          rgba(0.95);

        ctx.arc(
          drip.x,
          drip.y,
          drip.width *
            drip.length,
          0,
          Math.PI * 2,
        );

        ctx.fill();

        /*
         * Drips occasionally grow.
         */
        if (
          Math.random() <
          0.025 * delta
        ) {
          drip.width =
            Math.min(
              7,
              drip.width *
                1.025,
            );

          drip.length =
            Math.min(
              3,
              drip.length *
                1.025,
            );
        }

        /*
         * Hit another part of the clock.
         */
        const belowY =
          drip.y + 2;

        if (
          belowY >= 0 &&
          belowY < H &&
          isSolidAt(
            drip.x,
            belowY,
          )
        ) {
          const surfaceIndex =
            nearestTopSurfaceIndex(
              drip.x,
              belowY,
            );

          if (
            surfaceIndex !==
              -1 &&
            pool
          ) {
            pool[
              surfaceIndex
            ]! += 5;
          }

          spawnSplashes(
            drip.x,
            drip.y,
            3,
          );

          drips.splice(
            index,
            1,
          );

          continue;
        }

        /*
         * Let large drips fall substantially
         * farther before removing them.
         */
        if (
          drip.y >
          H + 30
        ) {
          drips.splice(
            index,
            1,
          );
        }
      }

      ctx.restore();

      animationFrame =
        requestAnimationFrame(
          frame,
        );
    };

    renderedClockText =
      clockTextRef.current;

    let initResizeObserver: ResizeObserver | null = null;
    let initPrefersReducedMotion: MediaQueryList | null = null;
    let initUpdateReducedMotion:
      | ((event: MediaQueryListEvent) => void)
      | null = null;

    document.fonts.ready.then(() => {
      resize();

      initResizeObserver =
        new ResizeObserver(
          resize,
        );

      initResizeObserver.observe(
        canvas,
      );

      window.addEventListener(
        'orientationchange',
        resize,
      );

      window.addEventListener(
        'resize',
        resize,
      );

      initPrefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );

      initUpdateReducedMotion = (
        event: MediaQueryListEvent,
      ) => {
        effectiveTargetFps = event.matches
          ? REDUCED_MOTION_FPS
          : TARGET_FPS;
      };

      effectiveTargetFps = initPrefersReducedMotion.matches
        ? REDUCED_MOTION_FPS
        : TARGET_FPS;

      initPrefersReducedMotion.addEventListener(
        'change',
        initUpdateReducedMotion,
      );

      animationFrame =
        requestAnimationFrame(
          frame,
        );
    });

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );

      initResizeObserver?.disconnect();

      if (
        initPrefersReducedMotion &&
        initUpdateReducedMotion
      ) {
        initPrefersReducedMotion.removeEventListener(
          'change',
          initUpdateReducedMotion,
        );
      }

      window.removeEventListener(
        'orientationchange',
        resize,
      );

      window.removeEventListener(
        'resize',
        resize,
      );
    };
  }, []);

  return (
    <main
      className={styles.container}
      aria-label={`Current time ${clockText}`}
    >
      <SRTime time={time} />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />
    </main>
  );
};

Clock.displayName = 'Clock_26_10_01';

export default Clock;
