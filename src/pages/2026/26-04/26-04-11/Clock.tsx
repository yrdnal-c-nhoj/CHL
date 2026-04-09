import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import backgroundImage from '@/assets/images/2026/26-04/26-04-11/cloud.gif';

const Clock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let terrainGeometry: THREE.PlaneGeometry;
    let clock: THREE.Clock;
    let terrain: THREE.Mesh;
    let terrainLine: THREE.LineSegments;
    let animationId: number;
    let timeoutDebounce: ReturnType<typeof setTimeout>;

    let count = 0;
    let delta = 0;
    let digitMeshes: THREE.Mesh[] = [];
    let digitTextures: THREE.CanvasTexture[] = [];
    let digitCanvases: HTMLCanvasElement[] = [];
    let digitContexts: CanvasRenderingContext2D[] = [];
    let rockTime = 0;
    let wavesFontLoaded = false;
    let currentDigits = ['0', '0', '0', '0']; // HHMM
    // Terrain chunk management
    const terrainChunks: { mesh: THREE.Mesh; line: THREE.LineSegments; geometry: THREE.PlaneGeometry; myZ: Float32Array }[] = [];
    const TERRAIN_CHUNK_SIZE = 70;
    const TERRAIN_SPEED = 0.02;
    const DESPAWN_X = -100; // Remove when this far left
    const SPAWN_X = 80; // Spawn new chunk at this X position

    const init = () => {
      scene = new THREE.Scene();
      // No scene background - CSS background image shows through
      scene.fog = new THREE.Fog('#F1F1F4', 0.05, 50);

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
      camera.position.set(0, 1, 32);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // Transparent clear so CSS background shows
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      // Function to create a new terrain chunk
      const createTerrainChunk = (xPos: number) => {
        const geometry = new THREE.PlaneGeometry(TERRAIN_CHUNK_SIZE, TERRAIN_CHUNK_SIZE, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0x11e0a, fog: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -0.47 * Math.PI;
        mesh.rotation.z = THREE.MathUtils.degToRad(90);
        mesh.position.x = xPos;
        scene.add(mesh);

        const vertexArray = geometry.getAttribute('position').array;
        (geometry.getAttribute('position') as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

        geometry.setAttribute('myZ', new THREE.BufferAttribute(new Float32Array(vertexArray.length / 3), 1));
        const myZArray = geometry.getAttribute('myZ').array as Float32Array;

        for (let i = 0; i < vertexArray.length; i++) {
          myZArray[i] = THREE.MathUtils.randInt(0, 5);
        }

        // Terrain Lines
        const line = new THREE.LineSegments(
          geometry,
          new THREE.LineBasicMaterial({ color: '#F455FF00', fog: false })
        );
        line.rotation.x = -0.47 * Math.PI;
        line.rotation.z = THREE.MathUtils.degToRad(90);
        line.position.x = xPos;
        scene.add(line);

        terrainChunks.push({ mesh, line, geometry, myZ: myZArray });
        return { mesh, line, geometry, myZ: myZArray };
      };

      // Create initial terrain chunks (3 chunks to fill view)
      createTerrainChunk(-15);
      createTerrainChunk(55); // One chunk ahead
      createTerrainChunk(125); // Two chunks ahead

      // Load waves font for 26-04-11 using dynamic import
      import('@/assets/fonts/26-04-11-waves.ttf').then((fontModule) => {
        const fontUrl = (fontModule as { default: string }).default;
        const wavesFont = new FontFace('Waves', `url(${fontUrl})`);
        wavesFont.load().then((font) => {
          document.fonts.add(font);
          wavesFontLoaded = true;
          updateDigits();
        });
      });

      // Create 4 separate digit boxes - each with own canvas, texture, and mesh
      const digitSpacing = 2.2; // Space between digits
      const startX = -((4 - 1) * digitSpacing) / 2; // Center the group

      for (let i = 0; i < 4; i++) {
        // Create canvas for this digit
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 160;
        digitCanvases[i] = canvas;
        digitContexts[i] = canvas.getContext('2d')!;

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        digitTextures[i] = texture;

        // Create mesh for this digit
        const geometry = new THREE.PlaneGeometry(2.5, 3.3); // Each digit in its own box
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Position: 15 feet from camera, spread horizontally
        mesh.position.set(startX + i * digitSpacing, -0.5, 17);
        mesh.lookAt(mesh.position.x, -0.5, 32);
        scene.add(mesh);
        digitMeshes[i] = mesh;
      }

      updateDigits();
    };

    const updateDigits = () => {
      // Get current time (no seconds, no colons)
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const digits: string[] = [hours[0]!, hours[1]!, minutes[0]!, minutes[1]!];

      // Only update if changed
      const changed = digits.some((d, i) => d !== currentDigits[i]);
      if (!changed && digitTextures[0]) return;

      currentDigits = digits;

      // Update each digit independently
      for (let i = 0; i < 4; i++) {
        const ctx = digitContexts[i];
        const canvas = digitCanvases[i];
        const texture = digitTextures[i];
        if (!ctx || !canvas || !texture) continue;

        // Clear canvas (transparent background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw digit with waves font
        ctx.fillStyle = '#9ABC9A';
        const fontFamily = wavesFontLoaded ? 'Waves, monospace' : 'monospace';
        ctx.font = `bold 120px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(digits[i]!, canvas.width / 2, canvas.height / 2);

        // Update texture
        texture.needsUpdate = true;
      }
    };

    const animate = () => {
      // Animate and move all terrain chunks
      for (const chunk of terrainChunks) {
        const vertexArray = chunk.geometry.getAttribute('position').array as Float32Array;

        for (let i = 0; i < vertexArray.length; i++) {
          if (i >= 210 && i <= 250) {
            vertexArray[i * 3 + 2] = 0;
          } else {
            const myZ = chunk.myZ?.[i] ?? 0;
            vertexArray[i * 3 + 2] = Math.sin((i + count * 0.0003)) * (myZ - myZ * 0.5);
          }
        }

        (chunk.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        // Move chunk to the left
        chunk.mesh.position.x -= TERRAIN_SPEED;
        chunk.line.position.x -= TERRAIN_SPEED;
      }

      // Remove chunks that have left the viewport
      for (let i = terrainChunks.length - 1; i >= 0; i--) {
        if (terrainChunks[i]!.mesh.position.x < DESPAWN_X) {
          const chunk = terrainChunks[i]!;
          scene.remove(chunk.mesh);
          scene.remove(chunk.line);
          chunk.mesh.geometry.dispose();
          (chunk.mesh.material as THREE.Material).dispose();
          (chunk.line.material as THREE.Material).dispose();
          terrainChunks.splice(i, 1);
        }
      }

      // Spawn new chunk if the rightmost one is getting close
      const rightmostChunk = terrainChunks[terrainChunks.length - 1];
      if (rightmostChunk && rightmostChunk.mesh.position.x < SPAWN_X) {
        const newX = rightmostChunk.mesh.position.x + TERRAIN_CHUNK_SIZE;
        // Create new chunk
        const geometry = new THREE.PlaneGeometry(TERRAIN_CHUNK_SIZE, TERRAIN_CHUNK_SIZE, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0x11e0a, fog: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -0.47 * Math.PI;
        mesh.rotation.z = THREE.MathUtils.degToRad(90);
        mesh.position.x = newX;
        scene.add(mesh);

        const vertexArray = geometry.getAttribute('position').array;
        (geometry.getAttribute('position') as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('myZ', new THREE.BufferAttribute(new Float32Array(vertexArray.length / 3), 1));
        const myZArray = geometry.getAttribute('myZ').array as Float32Array;
        for (let i = 0; i < vertexArray.length; i++) {
          myZArray[i] = THREE.MathUtils.randInt(0, 5);
        }

        const line = new THREE.LineSegments(
          geometry,
          new THREE.LineBasicMaterial({ color: '#F455FF00', fog: false })
        );
        line.rotation.x = -0.47 * Math.PI;
        line.rotation.z = THREE.MathUtils.degToRad(90);
        line.position.x = newX;
        scene.add(line);

        terrainChunks.push({ mesh, line, geometry, myZ: myZArray });
      }

      count += 0.03; // Slower terrain animation

      // Update digital clock time
      updateDigits();

      // Each digit bobs independently with chaotic random motion
      rockTime += 0.025;
      const digitSpacing = 2.2;
      const startX = -((4 - 1) * digitSpacing) / 2;

      for (let i = 0; i < 4; i++) {
        const mesh = digitMeshes[i];
        if (!mesh) continue;

        // Each digit has unique random phase offsets for chaotic motion
        const phase1 = i * 1.7 + 0.5;
        const phase2 = i * 2.3 + 1.2;
        const phase3 = i * 1.1 + 0.8;

        // Chaotic vertical bobbing - bigger waves
        const bobY = Math.sin(rockTime * 0.9 + phase1) * 1.2 + Math.sin(rockTime * 1.7 + phase2) * 0.6;
        mesh.position.y = -0.5 + bobY;

        // Wider horizontal drifting - swaying side to side
        const driftX = Math.sin(rockTime * 0.6 + phase1) * 0.8 + Math.cos(rockTime * 0.4 + phase3) * 0.4;
        mesh.position.x = startX + i * digitSpacing + driftX;

        // Aggressive tilting from side to side (Z rotation - rolling)
        const roll = Math.sin(rockTime * 1.1 + phase2) * 0.4 + Math.sin(rockTime * 0.8 + phase1) * 0.25;
        mesh.rotation.z = roll;

        // Pitch (X rotation - front to back rocking)
        const pitch = Math.sin(rockTime * 0.7 + phase3) * 0.35 + Math.cos(rockTime * 1.3 + phase2) * 0.2;
        mesh.rotation.x = pitch;

        // Yaw (Y rotation - turning side to side)
        const yaw = Math.sin(rockTime * 0.5 + phase1) * 0.25 + Math.sin(rockTime * 0.9 + phase3) * 0.15;
        mesh.rotation.y = yaw;

        // Always face camera (but with some delay effect)
        mesh.lookAt(mesh.position.x, mesh.position.y, 32);
      }

      renderer.render(scene, camera);
    };

    const limitFPS = (interval: number) => {
      const loop = () => {
        animationId = requestAnimationFrame(loop);
        delta += clock.getDelta();
        if (delta > interval) {
          animate();
          delta = delta % interval;
        }
      };
      loop();
    };

    const onWindowResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const handleResize = () => {
      clearTimeout(timeoutDebounce);
      timeoutDebounce = setTimeout(onWindowResize, 80);
    };

    init();
    limitFPS(1 / 60);

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutDebounce);
      window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);


  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'contrast(1.7)',
  };

  const canvasContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <div ref={containerRef} style={canvasContainerStyle}></div>
    </div>
  );
};

export default Clock;
