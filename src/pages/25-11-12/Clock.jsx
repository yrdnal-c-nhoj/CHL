import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import videoFile from "./octo.mp4";
import fallbackImg from "./octo.webp";
import customFontFile from "./oct.ttf";

export default function VideoBackgroundWithOctahedron() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false); // Kept false per user request
  const videoRef = useRef(null);
  const threeRef = useRef(null);
  const fontLoadedRef = useRef(false);

  // Video setup - MODIFIED for reliable Autoplay AND reliable Fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure the play button is hidden regardless of outcome
    setShowPlayButton(false); 

    // --- Handlers ---
    const onError = () => {
      console.error("Video asset failed to load or has format issues (Error event).");
      // This is the direct trigger for the fallback image
      setVideoFailed(true); 
    };
    
    // A proactive failure check if the video hasn't loaded (ready state)
    const checkReadiness = () => {
        // readyState < 4 means the video hasn't loaded enough data to play through
        if (v.readyState < 4) {
            console.warn("Video did not reach 'canplaythrough' state within timeout. Forcing fallback.");
            setVideoFailed(true);
        } else {
             // Optional: Log success if it passed the check
             console.log("Video loaded and ready to play (Passed readiness check).");
        }
    }

    // --- Execution ---
    v.addEventListener("error", onError);

    // 1. Attempt initial play (for autoplay policy)
    v.play()
      .then(() => {
        console.log("Initial play succeeded (Muted Autoplay)");
      })
      .catch((err) => {
        // Log the failure but DO NOT show the play button.
        console.warn("Autoplay blocked/failed. Play button suppressed.", err);
      });
    
    // 2. Set a timeout to check if the video has loaded properly (Asset check)
    // 3000ms (3 seconds) is usually enough time for most files to load initial chunks.
    const readinessTimeout = setTimeout(checkReadiness, 3000); 

    return () => {
      clearTimeout(readinessTimeout);
      v.removeEventListener("error", onError);
    };
  }, []); 

  // THREE.js Octahedron (Unchanged)
  useEffect(() => {
    const mount = threeRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

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
      opacity: 0.5,
      side: THREE.DoubleSide,
      map: texture,
    });
    const octahedron = new THREE.Mesh(geometry, material);
    scene.add(octahedron);

    const wireframeColor = 0xffffff;
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: wireframeColor,
        transparent: false,
        opacity: 1.0,
        depthTest: false,
        depthWrite: false,
      })
    );
    scene.add(wireframe);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x00ffcc, 0.5);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const clockTime = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      octahedron.rotation.x += 0.003;
      octahedron.rotation.y += 0.005;
      wireframe.rotation.x += 0.003;
      wireframe.rotation.y += 0.005;
      const t = clockTime.getElapsedTime();
      const cycleDuration = 25;
      const zStart = -15;
      const zEnd = 2;
      const zAmplitude = (zEnd - zStart) / 2;
      const zCenter = (zStart + zEnd) / 2;
      const zProgress = Math.sin((t / cycleDuration) * 2 * Math.PI);
      octahedron.position.z = zCenter + zProgress * zAmplitude;
      wireframe.position.z = zCenter + zProgress * zAmplitude;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(clockInterval);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
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
        preload="auto"
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
      <div
        ref={threeRef}
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      />
    </div>
  );
}