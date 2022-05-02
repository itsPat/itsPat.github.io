import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const nodesToSpin = [];

function setupNodes() {
  const randomScale = Math.random() * 5.0;

  const geometry = [
    new THREE.TorusGeometry(randomScale, randomScale * 0.33, 16, 100),
    new THREE.SphereGeometry(randomScale * 0.5),
    new THREE.BoxGeometry(randomScale, randomScale, randomScale),
    new THREE.TetrahedronGeometry(randomScale),
    new THREE.IcosahedronGeometry(randomScale),
    new THREE.OctahedronGeometry(randomScale),
    new THREE.DodecahedronGeometry(randomScale)
  ].random();

  const material = [
    new THREE.MeshStandardMaterial({ color: 0x5B01FF }),
    new THREE.MeshStandardMaterial({ color: 0xF89600 }),
    new THREE.MeshStandardMaterial({ color: 0x00F866 }),
    new THREE.MeshStandardMaterial({ color: 0xF800D3 }),
  ].random();
  

  const object = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  object.position.set(x, y, z);

  nodesToSpin.push(object);
  scene.add(object);
}

Array(50).fill().forEach(setupNodes);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('./resources/space.jpg');
scene.background = spaceTexture;

// Pat

const patTexture = new THREE.TextureLoader().load('./resources/pat.png');
const pat = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: patTexture }));

scene.add(pat);

pat.position.z = -5;
pat.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  pat.rotation.x += 0.001;
  pat.rotation.y += 0.0005;
  pat.rotation.z += 0.001;

  nodesToSpin.forEach(function (node) {
    node.rotation.x += 0.01;
    node.rotation.y += 0.005;
    node.rotation.z += 0.01;
  });

  camera.position.z = -0.01;
  camera.position.x = -0.0002;
  camera.rotation.y = -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  nodesToSpin.forEach(function (node) {
    node.rotation.x += 0.01;
    node.rotation.y += 0.005;
    node.rotation.z += 0.01;
  });

  pat.rotation.x += 0.001;
  pat.rotation.y += 0.0005;
  pat.rotation.z += 0.001;
  
  renderer.render(scene, camera);
}

animate();