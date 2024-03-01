// src/main.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

// Load the aircraft model
const loader = new GLTFLoader();
let airplane: THREE.Object3D | undefined;
let propeller: THREE.Object3D | undefined;

loader.load("models/airplane/scene.gltf", (gltf) => {
  airplane = gltf.scene;
  scene.add(airplane);
  // Set initial airplane position
  airplane.position.set(0, 1, 0);

  // Adjust the scale if necessary
  airplane.scale.set(0.7, 0.7, 0.7);

  // Rotate the airplane to face the initial direction
  airplane.rotation.y = Math.PI; // Adjust this angle based on the orientation of your model

  gltf.scene.traverse((child) => {
    if (child.name === "Propeller_1") {
      propeller = child;
    }
  });
});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
});

// Flight controls
const flightSpeed = 0.5;

const rotationSpeed = 0.01;
let targetRotation = 0;
let targetPitch = 0;
const translationSmoothness = 0.1;

let targetPosition = new THREE.Vector3();

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      if (airplane) {
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(airplane.quaternion);
        targetPosition.addVectors(
          airplane.position,
          forward.multiplyScalar(flightSpeed)
        );
      }
      break;
    case "s":
      if (airplane) {
        const backward = new THREE.Vector3(0, 0, -1);
        backward.applyQuaternion(airplane.quaternion);
        targetPosition.addVectors(
          airplane.position,
          backward.multiplyScalar(flightSpeed)
        );
      }
      break;
  }
});

document.addEventListener("mousemove", (event) => {
  targetRotation += event.movementX * rotationSpeed;
  targetPitch += event.movementY * rotationSpeed;

  // Limit pitch rotation to avoid flipping upside down
  targetPitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetPitch));
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update airplane rotation based on mouse movement
  if (airplane) {
    airplane.rotation.y += (targetRotation - airplane.rotation.y) * 0.05;
    airplane.rotation.x += (targetPitch - airplane.rotation.x) * 0.05;

    airplane.position.lerp(targetPosition, translationSmoothness);

    // Rotate the propellers
    if (propeller) {
      propeller.rotation.z += 0.1; // Adjust the rotation speed as needed
    }

    airplane.rotation.x = Math.max(
      -Math.PI / 4,
      Math.min(Math.PI / 4, airplane.rotation.x)
    );
  }

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
