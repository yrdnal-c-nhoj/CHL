import * as THREE from "three";
import { GUI } from "jsm/libs/lil-gui.module.min.js";
import { FontLoader } from "jsm/loaders/FontLoader.js";
import { TextGeometry } from "jsm/geometries/TextGeometry.js";

const gui = new GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector(".webgl"),
	antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

//textures
const textureLoader = new THREE.TextureLoader();

//fonts
const fontLoader = new FontLoader();
fontLoader.load(
	"https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/fonts/helvetiker_regular.typeface.json",
	(font) => {
		const textGeometry = new TextGeometry("CODEPEN", {
			font,
			size: 1,
			depth: 0,
			curveSegments: 5,
			bevelEnabled: true,
			bevelThickness: 0,
			bevelSize: 0,
			bevelOffset: 0,
			bevelSegments: 4,
		});
		textGeometry.computeBoundingBox();
		textGeometry.center();

		const textMaterial = new THREE.MeshBasicMaterial();
		textMaterial.wireframe = false;
		const text = new THREE.Mesh(textGeometry, textMaterial);
		scene.add(text);
	}
);

const torusGeometry = new THREE.TorusGeometry(0.7, 0.4, 100, 60);
const torusMaterial = new THREE.MeshPhysicalMaterial();
torusMaterial.metalness = 0;
torusMaterial.roughness = 0;
torusMaterial.iridescence = 1;
torusMaterial.iridescenceIOR = 1.5;
torusMaterial.iridescenceThicknessRange = [100, 324];
torusMaterial.transmission = 1;
torusMaterial.ior = 1.2;
torusMaterial.thickness = 0.8;
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.z = 1;
scene.add(torus);

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(-1, 2, 0);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 10);
pointLight2.position.set(-1, -2, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 10);
pointLight3.position.set(1, -2, 0);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 10);
pointLight4.position.set(1, 2, 0);
scene.add(pointLight4);

gui.add(torusMaterial, "metalness").min(0).max(1).step(0.001);
gui.add(torusMaterial, "roughness").min(0).max(1).step(0.001);
gui.add(torusMaterial, "iridescence").min(0).max(1).step(0.001);
gui.add(torusMaterial, "iridescenceIOR").min(1).max(2.333).step(0.001);
gui.add(torusMaterial.iridescenceThicknessRange, "0").min(0).max(1000).step(1);
gui.add(torusMaterial.iridescenceThicknessRange, "1").min(0).max(1000).step(1);
gui.add(torusMaterial, "transmission").min(0).max(1).step(0.001);
gui.add(torusMaterial, "ior").min(1).max(10).step(0.001);
gui.add(torusMaterial, "thickness").min(0).max(10).step(0.001);

const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	renderer.render(scene, camera);
	torus.rotation.x = elapsedTime * 0.5;
	torus.rotation.y = elapsedTime * 0.1;
	requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
