import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import videoFile from "./octo.mp4";
import fallbackImg from "./octo.webp";
import customFontFile from "./oct.ttf";

export default function VideoBackgroundWithOctahedron() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef(null);
  const threeRef = useRef(null);
  const fontLoadedRef = useRef(false);

  // Video setup
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => {
      setVideoFailed(true);
      setShowPlayButton(true);
    };
    const onStalled = () => setShowPlayButton(true);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onStalled);
    v.play()?.catch(() => setShowPlayButton(true));
    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onStalled);
    };
  }, []);

  const handlePlayClick = () =>
    videoRef.current?.play().then(() => setShowPlayButton(false));

  // THREE.js Octahedron
  useEffect(() => {
    const mount = threeRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Clock canvas setup
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Function to update clock
    const fontName = "MyCustomFont";
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      const timeString = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `110px ${fontLoadedRef.current ? fontName : "Arial"}`;
      context.fillStyle = "#00ffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      const xOffset = 0;
      const yOffset = 0.2;
      const xPos = canvas.width / 2 + xOffset * canvas.width;
      const yPos = canvas.height / 2 + yOffset * canvas.height;
      context.fillText(timeString, xPos, yPos);
      texture.needsUpdate = true;
    };

    // Load custom font
    const font = new FontFace(fontName, `url(${customFontFile})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        fontLoadedRef.current = true;
        console.log(`${fontName} loaded`);
        updateClock();
      })
      .catch((err) => {
        console.warn(`Failed to load font: ${err}`);
      });

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Octahedron
    const geometry = new THREE.OctahedronGeometry(2);
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array;
    for (let i = 0; i < uvArray.length; i += 6) {
      uvArray[i] = 0;
      uvArray[i + 1] = 0;
      uvArray[i + 2] = 1;
      uvArray[i + 3] = 0;
      uvArray[i + 4] = 0.5;
      uvArray[i + 5] = 1;
    }
    uvAttribute.needsUpdate = true;
    const material = new THREE.MeshPhongMaterial({
      color: 0x2f20f0,
      shininess: 100,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      map: texture,
    });
    const octahedron = new THREE.Mesh(geometry, material);
    scene.add(octahedron);

    // Define wireframe color
    const wireframeColor = 0xfff0f0; // Red, can be changed to any hex color

    // Outer wireframe
    const wireframeOuter = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: wireframeColor,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
    );
    octahedron.add(wireframeOuter);

    // Inner wireframe (slightly smaller)
    const innerGeometry = geometry.clone();
    innerGeometry.scale(0.95, 0.95, 0.95); // Scale down slightly
    const wireframeInner = new THREE.LineSegments(
      new THREE.WireframeGeometry(innerGeometry),
      new THREE.LineBasicMaterial({
        color: wireframeColor,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    octahedron.add(wireframeInner);

    // Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x00ffcc, 0.5);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Animate with smooth Z movement
    const clockTime = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      // Rotation
      octahedron.rotation.x += 0.003;
      octahedron.rotation.y += 0.005;
      // Smooth Z motion
      const t = clockTime.getElapsedTime(); // elapsed seconds
      const cycleDuration = 25; // Full oscillation in 25 seconds
      const zStart = -15; // Farthest back
      const zEnd = 2; // Farthest forward
      const zAmplitude = (zEnd - zStart) / 2; // Amplitude
      const zCenter = (zStart + zEnd) / 2; // Center
      // Smooth sine wave for Z position
      const zProgress = Math.sin((t / cycleDuration) * 2 * Math.PI);
      octahedron.position.z = zCenter + zProgress * zAmplitude;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearInterval(clockInterval);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      innerGeometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          display: videoFailed ? "none" : "block",
        }}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${fallbackImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: videoFailed ? "block" : "none",
        }}
      />
      <div ref={threeRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />
      {showPlayButton && (
        <button
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            padding: "1rem 2rem",
            fontSize: "2.8rem",
            backgroundColor: "rgba(255,255,255,0.8)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
          onClick={handlePlayClick}
        >
          Play Video
        </button>
      )}
    </div>
  );
}