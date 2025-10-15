import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import OrbitronFont20251012 from "./air.ttf";

const SpinningDodecahedronClock = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const animationIdRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load font
    const fontFace = new FontFace(
      "Orbitron20251012",
      `url(${OrbitronFont20251012})`,
      { weight: "400" }
    );

    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontLoaded(true);
      })
      .catch((error) => {
        console.error("Font loading failed:", error);
        setFontLoaded(true); // fallback
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // --- Dodecahedron ---
    const geometry = new THREE.DodecahedronGeometry(2.5, 0);
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x202f9f });
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);

    const dodecahedronGroup = new THREE.Group();
    dodecahedronGroup.add(wireframe);
    scene.add(dodecahedronGroup);

    // --- Digital clock texture ---
    const createClockTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");

      const updateClock = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const now = new Date();
        const hours = now.getHours(); // no leading zero
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const timeString = `${hours}${minutes}`;

        context.font = "bold 270px 'Orbitron20251012', monospace";
        context.fillStyle = "#4053DCFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(timeString, canvas.width / 2, canvas.height / 2);
      };

      updateClock();
      const texture = new THREE.CanvasTexture(canvas);

      setInterval(() => {
        updateClock();
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

    // --- Face centers approximation ---
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
      const textGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      const scaledCenter = center.clone().multiplyScalar(2.5);
      textMesh.position.copy(scaledCenter);
      textMesh.lookAt(scaledCenter.clone().multiplyScalar(2));
      dodecahedronGroup.add(textMesh);
    });

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Animation ---
    const clockObj = new THREE.Clock();
    const amplitudeZ = 6;
    const amplitudeY = 3;
    const amplitudeX = 2;
    const speed = 0.35;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const elapsed = clockObj.getElapsedTime();

      // Dodecahedron rotation
      dodecahedronGroup.rotation.x += 0.0001;
      dodecahedronGroup.rotation.y += 0.0001;

      // Camera swoop through center
      camera.position.z = Math.sin(elapsed * speed) * amplitudeZ;
      camera.position.y = Math.sin(elapsed * speed * 1.3) * amplitudeY;
      camera.position.x = Math.cos(elapsed * speed * 0.9) * amplitudeX;
      camera.lookAt(scene.position);

      // --- Smooth subtle background shift ---
      if (bgRef.current) {
        const percentX = 50 + Math.sin(elapsed * 0.05) * 5; // ±5% horizontal shift
        const percentY = 50 + Math.cos(elapsed * 0.03) * 5; // ±5% vertical shift
        bgRef.current.style.backgroundPosition = `${percentX}% ${percentY}%`;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
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
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [fontLoaded]);

  return (
    <div
      ref={bgRef}
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background:
          "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 20%, #6497b1 50%, #a3bffa 80%, #e6f0fa 100%)",
        backgroundSize: "200% 200%",
        backgroundPosition: "center center",
        visibility: fontLoaded ? "visible" : "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
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
