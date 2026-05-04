import React, { useEffect, useRef } from 'react';

class IsoEngine {
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

    drawPrism(x: number, y: number, z: number, w: number, l: number, h: number, color: string) {
        const { x: x1, y: y1 } = this.project(x, y, z);
        const { x: x2, y: y2 } = this.project(x + w, y, z);
        const { x: x3, y: y3 } = this.project(x + w, y + l, z);
        const { x: x4, y: y4 } = this.project(x, y + l, z);
        const { x: x5, y: y5 } = this.project(x, y, z + h);
        const { x: x6, y: y6 } = this.project(x + w, y, z + h);
        const { x: x7, y: y7 } = this.project(x + w, y + l, z + h);
        const { x: x8, y: y8 } = this.project(x, y + l, z + h);

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.lineTo(x4, y4);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x5, y5);
        this.ctx.lineTo(x6, y6);
        this.ctx.lineTo(x7, y7);
        this.ctx.lineTo(x8, y8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x5, y5);
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x6, y6);
        this.ctx.moveTo(x3, y3);
        this.ctx.lineTo(x7, y7);
        this.ctx.moveTo(x4, y4);
        this.ctx.lineTo(x8, y8);
        this.ctx.stroke();
    }
}

const GLYPH_MAP: Record<string, number[][]> = {
    '0': [
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
    ],
    '1': [
        [0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
    ],
    '2': [
        [1, 0, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
    ],
    '3': [
        [1, 0, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
    ],
    '4': [
        [1, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
    ],
    '5': [
        [1, 1, 0, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
    ],
    '6': [
        [1, 1, 0, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
    ],
    '7': [
        [1, 0, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 1],
    ],
    '8': [
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
    ],
    '9': [
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
    ],
    ':': [
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
    ],
    'M': [
        [1, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1],
    ],
};

const OrtogonalClock: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new IsoEngine(canvas);
        let raf: number;

        const tick = () => {
            const now = new Date();
            const timeStr = now.toTimeString().slice(0, 8);
            const clockColor = `hsl(${(now.getSeconds() * 6) % 360}, 70%, 50%)`;

            engine.ctx.clearRect(0, 0, canvas.width, canvas.height);
            engine.ctx.fillStyle = '#fff';
            engine.ctx.fillRect(0, 0, canvas.width, canvas.height);

            let currentX = -8;
            for (const char of timeStr) {
                const shapes = GLYPH_MAP[char as keyof typeof GLYPH_MAP];
                if (shapes) {
                    shapes.forEach((f: number[]) =>
                        engine.drawPrism(
                            f[0] + currentX,
                            f[1],
                            f[2],
                            f[3],
                            f[4],
                            f[5],
                            clockColor,
                        ),
                    );
                }
                currentX += char === 'M' ? 6 : 4;
            }
            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div
            style={{
                width: '100vw',
                height: '100dvh',
                background: 'linear-gradient(180deg, #185591 0%, #835CD7 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <canvas
                ref={canvasRef}
                width={window.innerWidth * 2}
                height={window.innerHeight * 2}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
};

export default OrtogonalClock;
