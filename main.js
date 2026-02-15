import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

// Geometry + Material
const cubeParams = {
  width: 1,
  height: 4,
  depth: 3,
  rotationY:0,
  rotationX:0,
  rotationZ:0,
  color: "#ff0000",
  wireframe: false,
  rotationSpeed: 0.01,
  reset: function () {
    cubeParams.width = 1;
    cubeParams.height = 4;
    cubeParams.depth = 3;
   cubeParams.rotationY = 0;
    cubeParams.color = "#ff0000";
    cubeParams.wireframe = false;
    cubeParams.rotationSpeed = 0.01;
    updateGeometry();
    mesh.material.color.set(cubeParams.color);
    mesh.material.wireframe = cubeParams.wireframe;
    // gui.updateDisplay();
  },
};

let geometry = new THREE.BoxGeometry(
  cubeParams.width,
  cubeParams.height,
  cubeParams.depth
);

const material = new THREE.MeshBasicMaterial({
  color: cubeParams.color,
  wireframe: cubeParams.wireframe,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;

controls.minAzimuthAngle = Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 1.25;

// lil-gui
const gui = new GUI();

// Update geometry function
function updateGeometry() {
  mesh.geometry.dispose();
  mesh.geometry = new THREE.BoxGeometry(
    cubeParams.width,
    cubeParams.height,
    cubeParams.depth
  );
}

// GUI Controls
gui.add(cubeParams, "width", 0.1, 10).onChange(updateGeometry);
gui.add(cubeParams, "height", 0.1, 10).onChange(updateGeometry);
gui.add(cubeParams, "depth", 0.1, 10).onChange(updateGeometry);
gui.add(cubeParams, "rotationY",-Math.PI, +Math.PI).onChange(function(value){
    mesh.rotation.y = value;
});
gui.add(cubeParams, "rotationX",-Math.PI, +Math.PI).onChange(function(value){
    mesh.rotation.x = value;
});gui.add(cubeParams, "rotationZ",-Math.PI, +Math.PI).onChange(function(value){
    mesh.rotation.z = value;
});



gui.addColor(cubeParams, "color").onChange(() => {
  mesh.material.color.set(cubeParams.color);
});

gui.add(cubeParams, "wireframe").onChange(() => {
  mesh.material.wireframe = cubeParams.wireframe;
});

gui.add(cubeParams, "rotationSpeed", 0, 0.1);

gui.add(cubeParams, "reset");

// Mouse Tracking
const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = e.clientY / window.innerHeight;
});

// Resize Handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Rotate cube
  mesh.rotation.y += cubeParams.rotationSpeed;

  // Mouse lookAt effect
  mesh.lookAt(
    new THREE.Vector3(mouse.x - 0.5, -mouse.y + 0.5, 0)
  );

  renderer.render(scene, camera);
}

animate();
