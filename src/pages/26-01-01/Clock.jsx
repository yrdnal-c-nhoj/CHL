import { useMemo } from "react";

export default function RadarScanner() {
  const styles = useMemo(
    () => ({
      root: {
        width: "100vw",
        height: "100dvh",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        overflow: "hidden",
        boxSizing: "border-box",
      },

      radar: {
        width: "min(80vw, 80dvh)",
        height: "min(80vw, 80dvh)",
        borderRadius: "50%",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        border: "1px solid lime",
        boxShadow: "0 0 0 10px rgba(0,255,0,0.25)",
        cursor: "crosshair",
        transform: "scaleX(-1)",
        transformOrigin: "50% 50%",
        backgroundImage: `
          linear-gradient(90deg, rgba(0,255,0,0.25) 1px, transparent 1px),
          linear-gradient(rgba(0,255,0,0.25) 1px, transparent 1px),
          repeating-conic-gradient(
            rgba(0,255,0,0.25) 0deg 1deg,
            rgba(0,255,0,0) 1deg 45deg
          ),
          repeating-radial-gradient(
            rgba(0,255,0,0.25),
            rgba(0,255,0,0.25) 1px,
            black 1px,
            black 50px
          )
        `,
        backgroundSize: "50px 50px, 50px 50px, cover, cover",
      },

      sweep: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background:
          "conic-gradient(lime 0deg, rgba(0,255,0,0.4) 40deg, transparent 70deg)",
        animation: "radarSpin 60s linear infinite",
        pointerEvents: "none",
      },

      dot: (x, y, delay) => ({
        position: "absolute",
        width: "0.6rem",
        height: "0.6rem",
        borderRadius: "50%",
        backgroundColor: "lime",
        top: `${y}%`,
        left: `${x}%`,
        transform: "translate(-50%, -50%)",
        // filter: "blur(4px)",
        opacity: 0,
        animation: `dotPulse 5s linear infinite`,
        animationDelay: `${delay}s`,
        mixBlendMode: "plus-lighter",
      }),
    }),
    []
  );

  return (
    <div style={styles.root}>
      {/* Scoped keyframes */}
      <style>
        {`
          @keyframes radarSpin {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          @keyframes dotPulse {
            0% { opacity: 0; }
            40% { opacity: 1; }
            60% { opacity: 0.8; }
            100% { opacity: 0; }
          }
        `}
      </style>

      <div style={styles.radar}>
        <div style={styles.sweep} />
      </div>
    </div>
  );
}
