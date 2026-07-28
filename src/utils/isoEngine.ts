interface Color {
  r: number;
  g: number;
  b: number;
}

export class IsoEngine {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  scale: number;
  angle: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.canvas = canvas;
    this.scale = 20;
    this.angle = Math.PI / 6;
  }

  project(x: number, y: number, z: number) {
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height / 2;

    const px =
      originX +
      x * this.scale * cosA +
      y * this.scale * Math.cos(Math.PI - this.angle);
    const py =
      originY -
      x * this.scale * sinA -
      y * this.scale * Math.sin(Math.PI - this.angle) -
      z * this.scale;
    return { x: px, y: py };
  }

  drawPrism(x: number, y: number, z: number, w: number, l: number, h: number, color: Color) {
    const points = [
      [x, y, z], [x + w, y, z], [x + w, y + l, z], [x, y + l, z],
      [x, y, z + h], [x + w, y, z + h], [x + w, y + l, z + h], [x, y + l, z + h],
    ];
    const faces = [
      [0, 1, 5, 4], [1, 2, 6, 5], [4, 5, 6, 7],
    ];
    const shades = [0.8, 0.6, 1.0];

    faces.forEach((indices, i) => {
      this.ctx.beginPath();
      const p0 = this.project(...points[indices[0]] as [number, number, number]);
      this.ctx.moveTo(p0.x, p0.y);
      indices.slice(1).forEach((idx) => {
        const p = this.project(...points[idx] as [number, number, number]);
        this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.closePath();
      this.ctx.fillStyle = `rgb(${color.r * shades[i]}, ${color.g * shades[i]}, ${color.b * shades[i]})`;
      this.ctx.fill();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}