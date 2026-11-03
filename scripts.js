import * as THREE from 'https://unpkg.com';

// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg-3d'),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 15;

// Sphère en fil de fer futuriste (Cyan fluide)
const sphereGeometry = new THREE.SphereGeometry(4, 30, 30);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffcc,
  wireframe: true,
  transparent: true,
  opacity: 0.15 // Discret pour préserver la lisibilité de vos projets
});
const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(mainSphere);

// Nuage de particules
const particlesCount = 700;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 60;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.04,
  color: 0x00aaff,
  transparent: true,
  opacity: 0.6
});
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// Interaction souris sans conflit
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Boucle d'animation
function animate() {
  requestAnimationFrame(animate);

  mainSphere.rotation.x += 0.001;
  mainSphere.rotation.y += 0.0015;
  particleSystem.rotation.y += 0.0005;

  mainSphere.rotation.y += (mouseX * 0.3 - mainSphere.rotation.y) * 0.05;
  mainSphere.rotation.x += (mouseY * 0.3 - mainSphere.rotation.x) * 0.05;

  renderer.render(scene, camera);
}
animate();

// Redimensionnement automatique
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});