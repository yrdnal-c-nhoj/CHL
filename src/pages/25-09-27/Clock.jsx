return (
  <div
    style={{
      width: "100vw",
      height: "100dvh",
      backgroundImage: `
        linear-gradient(
          135deg,
          black 25%,
          white 25%,
          white 50%,
          black 50%,
          black 75%,
          white 75%
        )`,
      backgroundSize: "3rem 3rem",
      backgroundPosition: `${offset}rem ${offset}rem`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        fontFamily: `${fontName}, monospace`,
        fontSize: "12vw",
        fontWeight: "bold",
        color: ready ? "transparent" : "white",
        background: `
          repeating-linear-gradient(
            50deg, /* angled at 1:40 */
            white 0,
            white 1rem,
            black 1rem,
            black 2rem
          )`,
        WebkitBackgroundClip: ready ? "text" : "none",
        backgroundClip: ready ? "text" : "none",
        backgroundPosition: `${offset}rem ${offset}rem`,
        lineHeight: "1",
        textAlign: "center",
      }}
    >
      {time}
    </div>
  </div>
);
