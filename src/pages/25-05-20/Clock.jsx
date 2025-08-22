import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import flaFont from './fla.ttf'; // Import the font file from the same folder

const Clock = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 512;
    clockCanvas.height = 512;
    const ctx = clockCanvas.getContext('2d');
    const textColor = '#130101FF';

    const clockTexture = new THREE.CanvasTexture(clockCanvas);
    clockTexture.minFilter = THREE.LinearFilter;

    const updateClockCanvas = () => {
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);

      ctx.shadowColor = 'black';
      ctx.shadowBlur = 1;
      ctx.font = '80px "fla", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;

      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      ctx.fillText(timeString, 256, 366);
      clockTexture.needsUpdate = true;
    };

    const faceColors = [0xff0000, 0xd3531b, 0xf76b07, 0xb80404];
    const materials = faceColors.map(
      color =>
        new THREE.MeshBasicMaterial({
          map: clockTexture,
          color,
          side: THREE.DoubleSide,
          transparent: false,
        })
    );

    let geometry = new THREE.TetrahedronGeometry(1).toNonIndexed();
    const uvAttribute = new Float32Array(geometry.attributes.position.count * 2);
    const faceCount = geometry.attributes.position.count / 3;

    for (let i = 0; i < faceCount; i++) {
      const vertexIndex = i * 3;
      uvAttribute.set([0.0, 0.0, 1.0, 0.0, 0.5, 1.0], vertexIndex * 2);
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvAttribute, 2));

    for (let i = 0; i < faceCount; i++) {
      geometry.addGroup(i * 3, 3, i % materials.length);
    }

    const tetrahedron = new THREE.Mesh(geometry, materials);
    tetrahedron.scale.set(4, 4, 4);
    scene.add(tetrahedron);

    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframe.scale.set(4, 4, 4);
    scene.add(wireframe);

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      tetrahedron.rotation.x += 0.01;
      tetrahedron.rotation.y += 0.01;
      wireframe.rotation.x += 0.01;
      wireframe.rotation.y += 0.01;

      const time = performance.now() / 1000;
      const period = 14;
      const zMin = -2;
      const zMax = 17;
      const zRange = zMax - zMin;
      camera.position.z = zMin + (zRange * (Math.sin((2 * Math.PI * time) / period) + 1)) / 2;

      updateClockCanvas();
      renderer.render(scene, camera);
    };

    document.fonts
      .load('bold 80px "fla"')
      .then(() => {
        updateClockCanvas();
        animate();
      })
      .catch(err => {
        console.warn('Font loading failed:', err);
        updateClockCanvas();
        animate();
      });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'fla';
          src: url(${flaFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #b20832, #541c08);
        }

        .fire-gradient {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }
      `}</style>
      <div ref={mountRef} className="fire-gradient" />
    </>
  );
};

export default Clock;
