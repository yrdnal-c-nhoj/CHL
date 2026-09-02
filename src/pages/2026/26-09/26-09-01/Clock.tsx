import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useClock } from '@/utils/hooks';
import headVideo from '@/assets/images/26_images/26-09/26-09-01/head.webm';
import styles from './Clock.module.css';

export const assets: string[] = [headVideo];

const CLOCK_COUNT = 8;

const PALETTE = {
    bg: 0x0a0c14,
    rim: 0x8c6239,
    face: 0x11141f,
    tick: 0xd4af7a,
    hourHand: 0xf2e4c9,
    minuteHand: 0xd4af7a,
    secondHand: 0x3aafa9,
    glow: 0x3aafa9,
};

function buildClock() {
    const group = new THREE.Group();

    const rim = new THREE.Mesh(
        new THREE.RingGeometry(0.86, 1, 64),
        new THREE.MeshBasicMaterial({ color: PALETTE.rim, side: THREE.DoubleSide })
    );
    group.add(rim);

    const face = new THREE.Mesh(
        new THREE.CircleGeometry(0.86, 64),
        new THREE.MeshBasicMaterial({ color: PALETTE.face, side: THREE.DoubleSide })
    );
    face.position.z = -0.005;
    group.add(face);

    const glow = new THREE.PointLight(PALETTE.glow, 0.6, 3);
    glow.position.z = 0.3;
    group.add(glow);

    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const long = i % 3 === 0;
        const tick = new THREE.Mesh(
            new THREE.BoxGeometry(long ? 0.03 : 0.018, long ? 0.14 : 0.08, 0.01),
            new THREE.MeshBasicMaterial({ color: PALETTE.tick })
        );
        tick.position.set(Math.sin(angle) * 0.74, Math.cos(angle) * 0.74, 0.01);
        tick.rotation.z = -angle;
        group.add(tick);
    }

    function makeHand(length: number, width: number, color: number) {
        const pivot = new THREE.Group();
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, length, 0.012),
            new THREE.MeshBasicMaterial({ color })
        );
        mesh.position.y = length / 2 - width;
        pivot.add(mesh);
        pivot.position.z = 0.02;
        group.add(pivot);
        return pivot;
    }

    const hourHand = makeHand(0.42, 0.045, PALETTE.hourHand);
    const minuteHand = makeHand(0.62, 0.03, PALETTE.minuteHand);
    const secondHand = makeHand(0.68, 0.012, PALETTE.secondHand);

    return { group, hourHand, minuteHand, secondHand };
}

const Clock_26_09_01 = () => {
    const time = useClock();
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(PALETTE.bg, 6, 16);

        const camera = new THREE.PerspectiveCamera(
            50,
            mount.clientWidth / mount.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 1.6, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.25));

        const ringGroup = new THREE.Group();
        scene.add(ringGroup);

        const radius = 3.4;
        const clocks = Array.from({ length: CLOCK_COUNT }, (_, i) => {
            const clock = buildClock();
            const angle = (i / CLOCK_COUNT) * Math.PI * 2;
            clock.group.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
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
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
        resizeObserver.observe(mount);

        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (autoRotate) targetAzimuth += 0.0018;
            currentAzimuth += (targetAzimuth - currentAzimuth) * 0.08;

            const camDist = 7.2;
            camera.position.x = Math.sin(currentAzimuth) * camDist;
            camera.position.z = Math.cos(currentAzimuth) * camDist;
            camera.position.y = 1.2 + currentElevation * 3;
            camera.lookAt(0, 0, 0);

            const now = new Date();
            const h = now.getHours() % 12;
            const m = now.getMinutes();
            const s = now.getSeconds() + now.getMilliseconds() / 1000;

            clocks.forEach(({ hourHand, minuteHand, secondHand }) => {
                hourHand.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
                minuteHand.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
                secondHand.rotation.z = -(s / 60) * Math.PI * 2;
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
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const accessibleTime = `${hours}:${minutes}:${seconds}`;

    return (
        <main className={styles.container}>
            <video
                src={headVideo}
                autoPlay
                loop
                muted
                playsInline
                className={styles.videoBackground}
            />
            <div ref={mountRef} className={styles.canvasMount} />

            <time dateTime={time.toISOString()} className={styles.timeDisplay}>
                <span className={styles.digitGroup}>
                    <span className={styles.digit}>{hours[0]}</span>
                    <span className={styles.digit}>{hours[1]}</span>
                </span>
                <span className={styles.separator}>:</span>
                <span className={styles.digitGroup}>
                    <span className={styles.digit}>{minutes[0]}</span>
                    <span className={styles.digit}>{minutes[1]}</span>
                </span>
                <span className={styles.separator}>:</span>
                <span className={styles.digitGroup}>
                    <span className={styles.digit}>{seconds[0]}</span>
                    <span className={styles.digit}>{seconds[1]}</span>
                </span>
            </time>

            <span className={styles.srOnly} aria-live="polite">
                {accessibleTime}
            </span>
        </main>
    );
};

Clock_26_09_01.displayName = 'Clock_26_09_01';

export default Clock_26_09_01;
