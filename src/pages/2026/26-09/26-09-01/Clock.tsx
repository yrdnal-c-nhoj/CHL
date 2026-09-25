import React, { useEffect, useRef } from 'react';
import SRTime from '@/components/SRTime';
import * as THREE from 'three';
import { useClock } from '@/utils/hooks';
import headVideo from '@/assets/images/26_images/26-09/26-09-01/head.webm';
import fontUrl from '@/assets/fonts/26fonts/26-09-01.ttf?url';
import styles from './Clock.module.css';

export const assets: string[] = [headVideo, fontUrl];

const CLOCK_COUNT = 12;

const PALETTE = {
    bg: '#c9a26e',
    rim: '#7e94c2',
    hourHand: '#302715',
    minuteHand: '#2c1f0d',
    secondHand: '#e21111',
    glow: '#3aafa9',
};

function createNumberTexture(number: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = '#71abdb';
    ctx.font = '172px "ClockFont_26_09_01"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const Clock_26_09_01 = () => {
    const time = useClock();
    const timeRef = useRef(time);
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let frameId: number;
        let cleanup: (() => void) | undefined;

        const face = new FontFace('ClockFont_26_09_01', `url(${fontUrl})`, { display: 'block' });

        const init = async () => {
            try {
                const loadedFace = await face.load();
                document.fonts.add(loadedFace);
            } catch {
                // font failed; fall back to default
            }

            const numberTextures: Record<string, THREE.Texture> = {
                '12': createNumberTexture('12'),
                '3': createNumberTexture('3'),
                '6': createNumberTexture('6'),
                '9': createNumberTexture('9'),
            };

            const scene = new THREE.Scene();
            scene.fog = new THREE.Fog(new THREE.Color(PALETTE.bg), 6, 16);

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

            const rimGeo = new THREE.RingGeometry(0.92, 1, 64);
            const numGeo = new THREE.PlaneGeometry(0.35, 0.35);

            function buildClock() {
                const group = new THREE.Group();

                const rimMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(PALETTE.rim),
                    transparent: true,
                    side: THREE.DoubleSide,
                });
                const rim = new THREE.Mesh(rimGeo, rimMaterial);
                group.add(rim);

                const glow = new THREE.PointLight(new THREE.Color(PALETTE.glow), 0.6, 3);
                glow.position.z = 0.3;
                group.add(glow);

                const numberMeshes: THREE.Mesh[] = [];
                const numPositions = [
                    { label: '12', x: 0, y: 0.62 },
                    { label: '3', x: 0.62, y: 0 },
                    { label: '6', x: 0, y: -0.62 },
                    { label: '9', x: -0.62, y: 0 },
                ];

                numPositions.forEach(({ label, x, y }) => {
                    const texture = numberTextures[label];
                    if (!texture) return;
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

                const hourHand = makeHand(0.5, 0.06, PALETTE.hourHand);
                const minuteHand = makeHand(0.75, 0.045, PALETTE.minuteHand);
                const secondHand = makeHand(0.85, 0.018, PALETTE.secondHand);

                return {
                    group,
                    hourHand: hourHand.pivot,
                    minuteHand: minuteHand.pivot,
                    secondHand: secondHand.pivot,
                    rimMaterial,
                    numberMeshes,
                    hourHandMesh: hourHand.mesh,
                    minuteHandMesh: minuteHand.mesh,
                    secondHandMesh: secondHand.mesh,
                    geometriesToDispose: [hourHand.handGeo, minuteHand.handGeo, secondHand.handGeo],
                };
            }

            const radius = window.innerWidth < 767 ? 5.0 : 7.5;
            const clockScale = window.innerWidth < 767 ? 1.0 : 1.5;

            const clocks = Array.from({ length: CLOCK_COUNT }, (_, i) => {
                const angle = (i / CLOCK_COUNT) * Math.PI * 2;
                const initialZ = Math.cos(angle) * radius;
                const clock = buildClock();
                clock.group.scale.set(clockScale, clockScale, clockScale);
                clock.group.position.set(Math.sin(angle) * radius, 0.5, initialZ);
                clock.group.lookAt(0, 0, 0);
                clock.group.rotateY(Math.PI);
                ringGroup.add(clock.group);
                return clock;
            });

            let currentAzimuth = 0;
            const elevation = 0.35;

            const resizeObserver = new ResizeObserver(() => {
                const w = mount.clientWidth;
                const h = mount.clientHeight;
                if (w === 0 || h === 0) return;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            });
            resizeObserver.observe(mount);

            const worldPos = new THREE.Vector3();
            const minDist = 14.2 - radius;
            const maxDist = 14.2 + radius;

            const animate = () => {
                frameId = requestAnimationFrame(animate);

                currentAzimuth += 0.0018;
                const camDist = 14.2;
                camera.position.x = Math.sin(currentAzimuth) * camDist;
                camera.position.z = Math.cos(currentAzimuth) * camDist;
                camera.position.y = 1.2 + elevation * 3;
                camera.lookAt(0, 0, 0);

                const now = timeRef.current;
                const h = now.getHours() % 12;
                const m = now.getMinutes();
                const s = now.getSeconds() + now.getMilliseconds() / 1000;

                clocks.forEach(
                    ({
                        group,
                        hourHand,
                        minuteHand,
                        secondHand,
                        rimMaterial,
                        numberMeshes,
                        hourHandMesh,
                        minuteHandMesh,
                        secondHandMesh,
                    }) => {
                        hourHand.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
                        minuteHand.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
                        secondHand.rotation.z = -(s / 60) * Math.PI * 2;

                        group.getWorldPosition(worldPos);
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
                    }
                );

                renderer.render(scene, camera);
            };

            animate();

            cleanup = () => {
                cancelAnimationFrame(frameId);
                resizeObserver.disconnect();
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
                rimGeo.dispose();
                numGeo.dispose();
                Object.values(numberTextures).forEach((t) => t.dispose());
                renderer.dispose();
                if (mount.contains(renderer.domElement)) {
                    mount.removeChild(renderer.domElement);
                }
            };
        };

        init();

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

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
            <SRTime time={time} />
        </main>
    );
};

Clock_26_09_01.displayName = 'Clock_26_09_01';
export default Clock_26_09_01;