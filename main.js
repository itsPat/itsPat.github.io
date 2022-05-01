import './style.css';
import * as THREE from './node_modules/three';

// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0x5B01FF })
);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('./resources/space.jpg');
scene.background = spaceTexture;

// Pat

const patTexture = new THREE.TextureLoader().load('./resources/pat.png');
const pat = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: patTexture }));

scene.add(pat);

// Sphere

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(0x00FAEB)
      },
      color2: {
        value: new THREE.Color(0x3E05DC)
      }
    },
    vertexShader: `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
    
      varying vec2 vUv;
      
      void main() {
        
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `,
    wireframe: false
  })
);

scene.add(sphere);

sphere.position.z = 30;
sphere.position.setX(-10);

pat.position.z = -5;
pat.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.075;
  sphere.rotation.z += 0.05;

  pat.rotation.y += 0.01;
  pat.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.0025;
  torus.rotation.z += 0.005;

  pat.rotation.x += 0.001;
  pat.rotation.y += 0.0005;
  pat.rotation.z += 0.001;

  sphere.rotation.x += 0.001;
  sphere.rotation.y += 0.0005;
  sphere.rotation.z += 0.001;
  
  renderer.render(scene, camera);
}

animate();