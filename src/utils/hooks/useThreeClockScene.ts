import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSmoothClock } from './useSmoothClock';

function readPalette(mount: HTMLElement) {
    const style = getComputedStyle(mount);
    const num = (val: string) => parseFloat(val.trim());
    return {
        bg: style.getPropertyValue('--clock-bg').trim(),
        rim: style.getPropertyValue('--clock-rim').trim(),
        face: style.getPropertyValue('--clock-face').trim(),
        tick: style.getPropertyValue('--clock-tick').trim(),
        hourHand: style.getPropertyValue('--clock-hour-hand').trim(),
        minuteHand: style.getPropertyValue('--clock-minute-hand').trim(),
        secondHand: style.getPropertyValue('--clock-second-hand').trim(),
        glow: style.getPropertyValue('--clock-glow').trim(),
        rimInner: num(style.getPropertyValue('--clock-rim-inner')),
        rimOuter: num(style.getPropertyValue('--clock-rim-outer')),
        faceRadius: num(style.getPropertyValue('--clock-face-radius')),
        digitSize: num(style.getPropertyValue('--clock-digit-size')),
        digitDistance: num(style.getPropertyValue('--clock-digit-distance')),
        digitFontSize: parseInt(style.getPropertyValue('--clock-digit-font-size'), 10),
    };
}

function createNumberTexture(palette: ReturnType<typeof readPalette>, number: string): THREE.Texture {
    const size = Math.max(64, palette.digitFontSize || 128);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = palette.tick;
    ctx.font = `${palette.digitFontSize || 72}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const NUMBER_TEXTURES_CACHE: Record<string, THREE.Texture> = {};

function getNumberTexture(palette: ReturnType<typeof readPalette>, number: string): THREE.Texture {
    const key = `${number}-${palette.tick}`;
    if (!NUMBER_TEXTURES_CACHE[key]) {
        NUMBER_TEXTURES_CACHE[key] = createNumberTexture(palette, number);
    }
    return NUMBER_TEXTURES_CACHE[key];
}

function buildClock(palette: ReturnType<typeof readPalette>) {
    const group = new THREE.Group();

    const rimMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.rim),
        transparent: true,
        side: THREE.DoubleSide,
    });
    const rimGeo = new THREE.RingGeometry(palette.rimInner, palette.rimOuter, 64);
    const rim = new THREE.Mesh(rimGeo, rimMaterial);
    group.add(rim);

    const faceMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.face),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
    });
    const faceGeo = new THREE.CircleGeometry(palette.faceRadius, 64);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = -0.005;
    group.add(face);

    const glow = new THREE.PointLight(new THREE.Color(palette.glow), 0.6, 3);
    glow.position.z = 0.3;
    group.add(glow);

    const numberMeshes: THREE.Mesh[] = [];
    const numGeo = new THREE.PlaneGeometry(palette.digitSize, palette.digitSize);
    const numPositions = [
        { label: '12', x: 0, y: palette.digitDistance },
        { label: '3', x: palette.digitDistance, y: 0 },
        { label: '6', x: 0, y: -palette.digitDistance },
        { label: '9', x: -palette.digitDistance, y: 0 },
    ];

    numPositions.forEach(({ label, x, y }) => {
        const texture = getNumberTexture(palette, label);
        const numMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(numGeo, numMat);
        mesh.position.set(x, y, 0.01);
        group.add(mesh);
        numberMeshes.push(mesh);
    });

    function makeHand(length: number, width: number, hexColor: string) {
        const pivot = new THREE.Group();
        const handGeo = new THREE.BoxGeometry(width, length, 0.012);
        const handMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(hexColor),
            transparent: true,
        });
        const mesh = new THREE.Mesh(handGeo, handMat);
        mesh.position.y = length / 2 - width;
        pivot.add(mesh);
        pivot.position.z = 0.02;
        group.add(pivot);
        return { pivot, mesh, handGeo };
    }

    const hourHand = makeHand(0.42, 0.045, palette.hourHand);
    const minuteHand = makeHand(0.62, 0.03, palette.minuteHand);
    const secondHand = makeHand(0.68, 0.012, palette.secondHand);

    return {
        group,
        hourHand: hourHand.pivot,
        minuteHand: minuteHand.pivot,
        secondHand: secondHand.pivot,
        rimMaterial,
        faceMat,
        numberMeshes,
        hourHandMesh: hourHand.mesh,
        minuteHandMesh: minuteHand.mesh,
        secondHandMesh: secondHand.mesh,
        geometriesToDispose: [rimGeo, faceGeo, numGeo, hourHand.handGeo, minuteHand.handGeo, secondHand.handGeo],
    };
}

export function useThreeClockScene(mountRef: React.RefObject<HTMLDivElement | null>, radius: number, clockScale: number) {
    const time = useSmoothClock(16);
    const timeRef = useRef(time);
    timeRef.current = time;

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const palette = readPalette(mount);

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(new THREE.Color(palette.bg), 6, 16);

        const camera = new THREE.PerspectiveCamera(
            50,
            mount.clientWidth / mount.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 1.6, 14);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.25));

        const ringGroup = new THREE.Group();
        scene.add(ringGroup);

        const clocks = Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const initialZ = Math.cos(angle) * radius;
            const clock = buildClock(palette);
            clock.group.scale.set(clockScale, clockScale, clockScale);
            clock.group.position.set(Math.sin(angle) * radius, 0.5, initialZ);
            clock.group.lookAt(0, 0, 0);
            clock.group.rotateY(Math.PI);
            ringGroup.add(clock.group);
            return clock;
        });

        let autoRotate = true;
        let targetAzimuth = 0;
        let currentAzimuth = 0;
        let currentElevation = 0.35;
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        const onPointerDown = (e: PointerEvent) => {
            isDragging = true;
            autoRotate = false;
            lastX = e.clientX;
            lastY = e.clientY;
        };
        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            targetAzimuth -= dx * 0.005;
            currentElevation = Math.max(0.05, Math.min(1.2, currentElevation - dy * 0.003));
        };
        const onPointerUp = () => {
            isDragging = false;
        };

        mount.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        const resizeObserver = new ResizeObserver(() => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            if (w === 0 || h === 0) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
        resizeObserver.observe(mount);

        let frameId: number;
        const worldPos = new THREE.Vector3();
        const minDist = 14.2 - radius;
        const maxDist = 14.2 + radius;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (autoRotate) targetAzimuth += 0.0018;
            currentAzimuth += (targetAzimuth - currentAzimuth) * 0.08;

            const camDist = 14.2;
            camera.position.x = Math.sin(currentAzimuth) * camDist;
            camera.position.z = Math.cos(currentAzimuth) * camDist;
            camera.position.y = 1.2 + currentElevation * 3;
            camera.lookAt(0, 0, 0);

            const now = timeRef.current;
            const h = now.getHours() % 12;
            const m = now.getMinutes();
            const s = now.getSeconds() + now.getMilliseconds() / 1000;

            clocks.forEach((clock) => {
                const { hourHand, minuteHand, secondHand, rimMaterial, numberMeshes, hourHandMesh, minuteHandMesh, secondHandMesh } = clock;

                hourHand.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
                minuteHand.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
                secondHand.rotation.z = -(s / 60) * Math.PI * 2;

                clock.group.getWorldPosition(worldPos);
                const distanceToCamera = camera.position.distanceTo(worldPos);
                const normFactor = 1 - Math.max(0, Math.min(1, (distanceToCamera - minDist) / (maxDist - minDist)));
                const opacity = 0.15 + 0.85 * normFactor;

                rimMaterial.opacity = opacity;
                numberMeshes.forEach((num) => {
                    (num.material as THREE.MeshBasicMaterial).opacity = opacity;
                });
                [hourHandMesh, minuteHandMesh, secondHandMesh].forEach((mesh) => {
                    if (mesh) {
                        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
                    }
                });
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            mount.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            clocks.forEach((clock) => {
                clock.geometriesToDispose.forEach((g) => g.dispose());
                clock.group.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((m) => m.dispose());
                        } else if (child.material) {
                            child.material.dispose();
                        }
                    }
                });
            });
            Object.values(NUMBER_TEXTURES_CACHE).forEach((t) => t.dispose());
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [mountRef, radius, clockScale]);
}
