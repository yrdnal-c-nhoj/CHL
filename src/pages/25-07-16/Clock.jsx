import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MobiusStrip() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Camera
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    // Ambient light
    scene.add(new THREE.AmbientLight(0x404040));

    // Möbius strip geometry
    // Use parametric geometry to build a Möbius strip
    const mobiusParam = (u, t, target) => {
      // u: [0, 1], t: [0, 2 * PI]
      u = u * 2 - 1; // Map u to [-1,1]
      t = t * 2 * Math.PI; // Map t to [0, 2PI]

      const majorRadius = 1; // Radius of the center circle
      const minorRadius = 0.3; // Width of the strip

      // Parametric formula for Möbius strip
      const x =
        (majorRadius + (u / 2) * Math.cos(t / 2)) * Math.cos(t);
      const y = (majorRadius + (u / 2) * Math.cos(t / 2)) * Math.sin(t);
      const z = (u / 2) * Math.sin(t / 2);

      target.set(x, y, z);
    };

    const geometry = new THREE.ParametricGeometry(mobiusParam, 100, 30);

    // Material
    const material = new THREE.MeshPhongMaterial({
      color: 0x44aaff,
      side: THREE.DoubleSide,
      shininess: 100,
      specular: 0x555555,
    });

    // Mesh
    const mobiusMesh = new THREE.Mesh(geometry, material);
    scene.add(mobiusMesh);

    // Animation loop
    let reqId;
    const animate = () => {
      mobiusMesh.rotation.x += 0.005;
      mobiusMesh.rotation.y += 0.007;
      mobiusMesh.rotation.z += 0.004;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    />
  );
}
