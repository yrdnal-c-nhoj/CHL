import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import * as THREE from 'three';
import OrbitronFont20251012 from '@/assets/fonts/25fonts/25-10-14-air.ttf?url';
import bgImage from '@/assets/images/25_images/25-10/25-10-14/air.webp';
import styles from './Clock.module.css';

export const assets = [OrbitronFont20251012, bgImage];

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

const SpinningDodecahedronClock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>();

  const [ready, setReady] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !imageLoaded) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.DodecahedronGeometry(2, 0);

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f03ff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
      emissive: 0x7f01ff,
      emissiveIntensity: 0.9,
    });
    const blueSurface = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(blueSurface);

    const edges = new THREE.EdgesGeometry(geometry);
    const coreMaterial = new THREE.LineBasicMaterial({ color: 0xff900f });
    const wireframe = new THREE.LineSegments(edges, coreMaterial);

    const dodecahedronGroup = new THREE.Group();
    dodecahedronGroup.add(wireframe);

    const glowColors = [0xf1f0ff, 0xaa0000, 0x2fff05];
    glowColors.forEach((color, i) => {
      const glowMaterial = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95 - i * 0.8,
      });
      const glowWire = new THREE.LineSegments(edges, glowMaterial);
      const scale = 1 + (i + 1) * 0.015;
      glowWire.scale.set(scale, scale, scale);
      dodecahedronGroup.add(glowWire);
    });

    scene.add(dodecahedronGroup);

    const createClockTexture =  () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const drawTime =  () => {
        ctx.clearRect(0, 0, 512, 512);
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}${minutes}`;

        ctx.font = "280px 'Orbitron20251012', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeText(timeStr, 256, 256);

        ctx.fillStyle = '#E8CB0DFF';
        ctx.fillText(timeStr, 256, 256);
      };

      drawTime();
      const texture = new THREE.CanvasTexture(canvas);

      const updateTexture = () => {
        drawTime();
        texture.needsUpdate = true;
        intervalRef.current = setTimeout(updateTexture, 1000);
      };
      updateTexture();

      return texture;
    };

    const clockTexture = createClockTexture();
    const textMaterial = new THREE.MeshBasicMaterial({
      map: clockTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const phi = (1 + Math.sqrt(5)) / 2;
    const a = 1 / Math.sqrt(3);
    const b = a / phi;
    const c = a * phi;
    const faceCenters = [
      new THREE.Vector3(c, 0, b),
      new THREE.Vector3(-c, 0, -b),
      new THREE.Vector3(-b, c, 0),
      new THREE.Vector3(-b, -c, 0),
      new THREE.Vector3(0, -b, c),
      new THREE.Vector3(0, b, -c),
      new THREE.Vector3(b, c, 0),
      new THREE.Vector3(b, -c, 0),
      new THREE.Vector3(0, b, c),
      new THREE.Vector3(0, -b, -c),
      new THREE.Vector3(c, 0, -b),
      new THREE.Vector3(-c, 0, b),
    ];

    faceCenters.forEach((center) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 1.2),
        textMaterial,
      );
      const pos = center.clone().multiplyScalar(2);
      mesh.position.copy(pos);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      dodecahedronGroup.add(mesh);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pointLight = new THREE.PointLight(0x66aaff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    if (bgRef.current) {
      bgRef.current.style.filter = `
        brightness(1.2)
        contrast(1.2)
        saturate(0.1)
        hue-rotate(200deg)
      `;
      bgRef.current.style.opacity = '1';
      bgRef.current.style.transition = 'opacity 1.2s ease';
    }

    const clockObj = new THREE.Clock();
    const animate =  () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const t = clockObj.getElapsedTime();

      dodecahedronGroup.rotation.x += 0.007;
      dodecahedronGroup.rotation.y += 0.009;
      blueSurface.rotation.x += 0.007;
      blueSurface.rotation.y += 0.009;

      dodecahedronGroup.position.z = Math.sin(t * 0.4) * 9;
      blueSurface.position.z = Math.sin(t * 0.4) * 9;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize =  () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    setReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      renderer.dispose();
      geometry.dispose();
      edges.dispose();
      clockTexture.dispose();
      textMaterial.dispose();
      if (containerRef.current && renderer.domElement)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, [imageLoaded]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      {!ready && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            zIndex: 5,
          }}
         />
      )}

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
          opacity: '0',
          transition: 'opacity 1.2s ease',
          zIndex: 0,
        }}
      />

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
    </main>
  );
};

const MemoizedSpinningDodecahedronClock = memo(SpinningDodecahedronClock);
MemoizedSpinningDodecahedronClock.displayName = 'Clock_25_10_14';
export default MemoizedSpinningDodecahedronClock;
