import { useEffect, useMemo, useRef } from "react";

export default function FragmentedClockStream() {
  const canvasRef = useRef(null);

  const style = useMemo(
    () => ({
      width: "100vw",
      height: "100dvh",
      display: "block",
      backgroundColor: "#134080",
      overflow: "hidden",
      margin: 0,
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const colors = { hour: "#DC0AF3", minute: "#EC091C", period: "#068EEF" };
    const shadowLength = 3000;
    
    let fragments = [];
    const MAX_FRAGMENTS = 15; // Total number of floating elements

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class TimeFragment {
      constructor() {
        this.reset();
        // Randomize initial start position so they don't all spawn at once
        this.x = Math.random() * canvas.width;
      }

      reset() {
        const now = new Date();
        const types = ["hour", "minute", "period"];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // Determine Value
        if (this.type === "hour") {
          this.value = (now.getHours() % 12 || 12).toString();
          this.fontSize = Math.max(canvas.width * 0.12, 80);
        } else if (this.type === "minute") {
          this.value = now.getMinutes().toString().padStart(2, "0");
          this.fontSize = Math.max(canvas.width * 0.07, 50);
        } else {
          this.value = now.getHours() >= 12 ? "PM" : "AM";
          this.fontSize = Math.max(canvas.width * 0.04, 30);
        }

        // Random trajectory and rotation
        this.x = canvas.width + 200; // Start outside right
        this.y = Math.random() * canvas.height;
        this.angle = (Math.random() - 0.5) * 0.5; // Random flight angle
        this.speed = Math.random() * 1.5 + 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = colors[this.type];
      }

      update() {
        this.x -= this.speed;
        this.y += Math.sin(this.angle);
        this.rotation += this.rotationSpeed;

        // Reset if it leaves the viewport (left, top, or bottom)
        if (this.x < -200 || this.y < -200 || this.y > canvas.height + 200) {
          this.reset();
        }
      }

      getDots() {
        const hw = (this.fontSize * 0.6) / 2;
        const hh = this.fontSize / 2;
        const corners = [
          { x: -hw, y: -hh }, { x: hw, y: -hh },
          { x: hw, y: hh }, { x: -hw, y: hh }
        ];

        return corners.map(p => {
          const rx = p.x * Math.cos(this.rotation) - p.y * Math.sin(this.rotation);
          const ry = p.x * Math.sin(this.rotation) + p.y * Math.cos(this.rotation);
          return { x: this.x + rx, y: this.y + ry };
        });
      }

      drawShadow() {
        const dots = this.getDots();
        const lightX = canvas.width / 2;
        const lightY = canvas.height / 2;

        ctx.fillStyle = "rgba(20, 25, 30, 0.7)";

        dots.forEach((dot, i) => {
          const next = dots[(i + 1) % dots.length];
          const angle1 = Math.atan2(lightY - dot.y, lightX - dot.x);
          const angle2 = Math.atan2(lightY - next.y, lightX - next.x);

          const end1X = dot.x + shadowLength * Math.sin(-angle1 - Math.PI / 2);
          const end1Y = dot.y + shadowLength * Math.cos(-angle1 - Math.PI / 2);
          const end2X = next.x + shadowLength * Math.sin(-angle2 - Math.PI / 2);
          const end2Y = next.y + shadowLength * Math.cos(-angle2 - Math.PI / 2);

          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(next.x, next.y);
          ctx.lineTo(end2X, end2Y);
          ctx.lineTo(end1X, end1Y);
          ctx.fill();
        });
      }

      drawText() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.font = `bold ${this.fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.value, 0, 0);
        ctx.restore();
      }
    }

    const init = () => {
      fragments = Array.from({ length: MAX_FRAGMENTS }, () => new TimeFragment());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const lx = canvas.width / 2;
      const ly = canvas.height / 2;

      // Background Gradient
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, canvas.width * 0.7);
      grad.addColorStop(0, "#3b4654");
      grad.addColorStop(1, "#2c343f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shadow Pass
      fragments.forEach(f => {
        f.update();
        f.drawShadow();
      });

      // Text Pass
      fragments.forEach(f => f.drawText());

      // Center light point
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(lx, ly, 2, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    let animationFrameId;
    resize();
    init();
    draw();

    window.addEventListener("resize", () => { resize(); init(); });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={style} />;
}