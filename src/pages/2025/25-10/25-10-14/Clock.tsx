import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

import OrbitronFont20251012 from '@/assets/fonts/2025/25-10-14-air.ttf';
import bgImage from '@/assets/images/2025/25-10/25-10-14/air.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const SpinningDodecahedronClock: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const animationIdRef = useRef<number | null>(null);

    const [ready, setReady] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    // Use standardized font loader
    const fontConfigs = useMemo(
        () => [
            {
                fontFamily: 'Orbitron20251012',
                fontUrl: OrbitronFont20251012,
                options: { weight: 'normal', style: 'normal' },
            },
        ],
        [],
    );
    useSuspenseFontLoader(fontConfigs);

    // --- Load background image ---
    useEffect(() => {
        const img = new Image();
        img.src = bgImage;
        img.onload = () => setImageLoaded(true);
    }, [bgImage]);

    // --- Initialize Three.js scene ---
    useEffect(() => {
        if (!containerRef.current || !imageLoaded) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Create dodecahedron
        const geometry = new THREE.DodecahedronGeometry(2);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            specular: 0x444444,
            shininess: 100,
            wireframe: true,
        });
        const dodecahedron = new THREE.Mesh(geometry, material);
        scene.add(dodecahedron);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            dodecahedron.rotation.x += 0.01;
            dodecahedron.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        setReady(true);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [imageLoaded]);

    const time = new Date();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            background: '#000',
            overflow: 'hidden',
        }}>
            {/* Background */}
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    opacity: imageLoaded ? '0.3' : '0',
                    transition: 'opacity 1.2s ease',
                    zIndex: 0,
                }}
            />

            {/* Three.js container */}
            <div
                ref={containerRef}
                style={{
                    opacity: ready ? 1 : 0,
                    transition: 'opacity 1s ease',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                }}
            />

            {/* Time display */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Orbitron20251012, monospace',
                    fontSize: '4rem',
                    color: '#00ff88',
                    textShadow: '0 0 20px rgba(0, 255, 136, 0.8)',
                    textAlign: 'center',
                    zIndex: 2,
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 1s ease',
                }}
            >
                {hours}:{minutes}:{seconds}
            </div>
        </div>
    );
};

export default SpinningDodecahedronClock;
