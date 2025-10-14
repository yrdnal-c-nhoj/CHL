import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import OrbitronFont20251012 from "./air.ttf";
import bgImage from "./air.webp";

const SpinningDodecahedronClock = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const animationIdRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // --- Load font ---
  useEffect(() => {
    const fontFace = new FontFace("Orbitron20251012", `url(${OrbitronFont20251012})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      setFontLoaded(true);
    });
  }, []);

  // --- Load background image ---
  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  // --- Initialize scene once all assets are ready ---
  useEffect(() => {
    if (!containerRef.current || !fontLoaded || !imageLoaded) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // --- Dodecahedron base geometry ---
    const geometry = new THREE.DodecahedronGeometry(2, 0);

    // --- Blue translucent surface ---
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f4faf, // vivid blue
      transparent: true,
      opacity: 0.2, // mostly transparent
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
      emissive: 0x10129f,
      emissiveIntensity: 0.9,
    });
    const blueSurface = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(blueSurface);

    // --- Wireframe edges ---
    const edges = new THREE.EdgesGeometry(geometry);
    const coreMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const wireframe = new THREE.LineSegments(edges, coreMaterial);

    const dodecahedronGroup = new THREE.Group();
    dodecahedronGroup.add(wireframe);

    // --- Glow layers ---
    const glowColors = [0xf1f0ff, 0xaa0000, 0x2fff05];
    glowColors.forEach((color, i) => {
      const glowMaterial = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95 - i * 0.8, // slightly stronger glow
      });
      const glowWire = new THREE.LineSegments(edges, glowMaterial);
      const scale = 1 + (i + 1) * 0.015;
      glowWire.scale.set(scale, scale, scale);
      dodecahedronGroup.add(glowWire);
    });

    scene.add(dodecahedronGroup);

    // --- Clock Texture ---
    const createClockTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

 const drawTime = () => {
  ctx.clearRect(0, 0, 512, 512);
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const time = `${hours}${minutes}`;

  ctx.font = "280px 'Orbitron20251012', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw black outline
  ctx.lineWidth = 3;            // thickness of the outline
  ctx.strokeStyle = "black";     // color of the outline
  ctx.strokeText(time, 256, 256);

  // Draw main text
  ctx.fillStyle = "#E8CB0DFF";   // fill color
  ctx.fillText(time, 256, 256);
};


      drawTime();
      const texture = new THREE.CanvasTexture(canvas);
      setInterval(() => {
        drawTime();
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

    // --- Plane placement ---
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
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pointLight = new THREE.PointLight(0x66aaff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Background filter ---
    if (bgRef.current) {
      bgRef.current.style.filter = `
        brightness(0.8)
        contrast(1.8)
        saturate(0.9)
        hue-rotate(-170deg)
      `;
      bgRef.current.style.opacity = "1";
      bgRef.current.style.transition = "opacity 1.2s ease";
    }

    // --- Animate ---
    const clockObj = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const t = clockObj.getElapsedTime();

      // gentle spin
      dodecahedronGroup.rotation.x += 0.002;
      dodecahedronGroup.rotation.y += 0.0041;
      blueSurface.rotation.x += 0.002;
      blueSurface.rotation.y += 0.0041;

      // slow depth pulse
      dodecahedronGroup.position.z = Math.sin(t * 0.4) * 9;
      blueSurface.position.z = Math.sin(t * 0.4) * 9;

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

    setReady(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      geometry.dispose();
      edges.dispose();
      clockTexture.dispose();
      textMaterial.dispose();
      if (containerRef.current && renderer.domElement)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, [fontLoaded, imageLoaded]);

  // --- Layout ---
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#000",
      }}
    >
      {!ready && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontFamily: "monospace",
            fontSize: "1.2rem",
            zIndex: 5,
          }}
        >
          Loading clock...
        </div>
      )}

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
          opacity: "0",
          transition: "opacity 1.2s ease",
          zIndex: 0,
        }}
      />

      <div
        ref={containerRef}
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 1s ease",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default SpinningDodecahedronClock;
