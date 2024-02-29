// src/main.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10); // Adjust the camera height, fixed to ground
scene.add(camera);

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disable panning to restrict movement

// Add ground to the scene
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Add some basic objects to the scene
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube.position.set(2, 1, 0);
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
sphere.position.set(-2, 1, 0);
scene.add(sphere);

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
});

// Handle keyboard input
const keyboardState = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
};

document.addEventListener("keydown", (event) => {
  keyboardState[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keyboardState[event.code] = false;
});

// Handle mouse movement
document.addEventListener("mousemove", (event) => {
  // Instead, directly set the rotation based on the mouse movement
  camera.rotation.y -= event.movementX * 0.002;
  camera.rotation.x -= event.movementY * 0.002;

  // Clamp vertical rotation to avoid flipping upside down
  camera.rotation.x = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, camera.rotation.x)
  );

  // Ensure the camera stays at ground level
  camera.position.y = 0;
});

// Movement controls
const movementSpeed = 0.1;

document.addEventListener("keydown", (event) => {
  const moveVector = new THREE.Vector3();

  switch (event.key) {
    case "w":
      moveVector.set(
        -Math.sin(camera.rotation.y),
        0,
        -Math.cos(camera.rotation.y)
      );
      break;
    case "s":
      moveVector.set(
        Math.sin(camera.rotation.y),
        0,
        Math.cos(camera.rotation.y)
      );
      break;
    case "a":
      moveVector.set(
        -Math.cos(camera.rotation.y),
        0,
        Math.sin(camera.rotation.y)
      );
      break;
    case "d":
      moveVector.set(
        Math.cos(camera.rotation.y),
        0,
        -Math.sin(camera.rotation.y)
      );
      break;
  }

  // Normalize the movement vector to ensure consistent speed in all directions
  moveVector.normalize();

  // Update camera position based on the movement vector
  camera.position.addScaledVector(moveVector, movementSpeed);

  // Ensure the camera stays at ground level
  camera.position.y = 0;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Handle movement based on keyboard input
  if (keyboardState.KeyW) {
    camera.translateZ(-movementSpeed);
  }
  if (keyboardState.KeyA) {
    camera.translateX(-movementSpeed);
  }
  if (keyboardState.KeyS) {
    camera.translateZ(movementSpeed);
  }
  if (keyboardState.KeyD) {
    camera.translateX(movementSpeed);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
