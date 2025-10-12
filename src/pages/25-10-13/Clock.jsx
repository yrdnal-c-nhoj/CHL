import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import OrbitronFont20251012 from "./air.ttf";
import bgImage from "./air.webp";

const SpinningDodecahedronClock = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const animationIdRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const fontFace = new FontFace("Orbitron20251012", `url(${OrbitronFont20251012})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // --- Dodecahedron Wireframe ---
    const geometry = new THREE.DodecahedronGeometry(2, 0);
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x3f4fff, linewidth: 10 });
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);

    // Simulated “thicker glow” overlay (since real linewidth rarely works)
    const glowMaterial = new THREE.LineBasicMaterial({ color: 0x3f4fff, transparent: true, opacity: 0.9 });
    const glowWire = new THREE.LineSegments(edges, glowMaterial);
    glowWire.scale.set(1.03, 1.03, 1.03); // slightly larger to simulate thickness

    const dodecahedronGroup = new THREE.Group();
    dodecahedronGroup.add(wireframe);
    dodecahedronGroup.add(glowWire);
    scene.add(dodecahedronGroup);

    // --- Clock Texture ---
    const createClockTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      const update = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const time = `${hours}${minutes}`;
        ctx.font = "280px 'Orbitron20251012', monospace";
        ctx.fillStyle = "#F6F3F0FF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(time, canvas.width / 2, canvas.height / 2);
      };

      update();
      const texture = new THREE.CanvasTexture(canvas);
      setInterval(() => {
        update();
        texture.needsUpdate = true;
      }, 1000);
      return texture;
    };

    const clockTexture = createClockTexture();
    const textMaterial = new THREE.MeshBasicMaterial({
      map: clockTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // --- Face Text Panels ---
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
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), textMaterial);
      const pos = center.clone().multiplyScalar(2);
      mesh.position.copy(pos);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      dodecahedronGroup.add(mesh);
    });

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0xffff5f, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Fixed Background Filters ---
    if (bgRef.current) {
      bgRef.current.style.filter = `
        brightness(1.15)
        contrast(0.8)
        saturate(0.1)
        hue-rotate(-110deg)
      `;
    }

    // --- Animate ---
    const clockObj = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const t = clockObj.getElapsedTime();

      // Rotate dodecahedron
      dodecahedronGroup.rotation.x += 0.002;
      dodecahedronGroup.rotation.y += 0.003;

      // Move the dodecahedron in and out through the camera
      dodecahedronGroup.position.z = Math.sin(t * 0.6) * 8;

      renderer.render(scene, camera);
    };
    animate();

    // --- Handle Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      edges.dispose();
      geometry.dispose();
      clockTexture.dispose();
      textMaterial.dispose();
      if (containerRef.current && renderer.domElement)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, [fontLoaded]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0 }}>
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          zIndex: 0,
        }}
      />
      <div
        ref={containerRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
      />
    </div>
  );
};

export default SpinningDodecahedronClock;
