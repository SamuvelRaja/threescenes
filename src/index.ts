import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import resize from "./helper/resize";
import getStarfield from "./helper/stars";
import spline from "./helper/spline";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

const w: number = window.innerWidth;
const h: number = window.innerHeight;

const ratio: number = w / h;
const fov: number = 75;
const near: number = 0.1;
const far: number = 1000;

let rendercp: THREE.WebGLRenderer | null = null;
let currentScene: THREE.Scene | null = null;
let currentCamera: THREE.PerspectiveCamera | null = null;
let currentControls: OrbitControls | null = null;
let currentComposer: EffectComposer | null = null;

function disposeResource(resource: any) {
  if (!resource) return;
  if (resource.dispose) resource.dispose();
  if (resource.children) {
    resource.children.forEach((child: any) => disposeResource(child));
  }
}

function disposeCurrentScene() {
  if (rendercp) {
    rendercp.dispose();
  }
  if (currentControls) {
    currentControls.dispose();
  }
  if (currentCamera) {
    disposeResource(currentCamera);
  }
  if (currentComposer) {
    disposeResource(currentComposer);
  }
  if (currentScene) {
    disposeResource(currentScene);
  }
  const app = document.querySelector("#app");
  if (app) {
    app.innerHTML = "";
  }
}

const orb = () => {
  disposeCurrentScene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  rendercp = renderer;
  renderer.setSize(w, h);

  document.querySelector("#app")?.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(fov, ratio, near, far);
  camera.position.z = 3;
  const scene = new THREE.Scene();
  const geo = new THREE.IcosahedronGeometry(1.0, 5);

  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
  });
  const light = new THREE.HemisphereLight(0x002288, 0x99cb00);
  scene.add(light);
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.enableZoom = false;

  const wire = new THREE.MeshBasicMaterial({
    color: 0x990000,
    wireframe: true,
  });
  const wiremesh = new THREE.Mesh(geo, wire);
  mesh.add(wiremesh);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }
  animate();

  resize(camera, renderer);

  currentScene = scene;
  currentCamera = camera;
  currentControls = controls;
};

const earth = () => {
  disposeCurrentScene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  rendercp = renderer;
  renderer.setSize(w, h);

  document.querySelector("#app")?.appendChild(renderer.domElement);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(fov, ratio, near, 1000);
  camera.position.z = 3;
  const scene = new THREE.Scene();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 1.0;
  controls.enableZoom = false;

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const loader = new THREE.TextureLoader();
  const earthGeo = new THREE.IcosahedronGeometry(1, 12);
  const earthMat = new THREE.MeshPhongMaterial({
    map: loader.load("/textures/00_earthmap1k.jpg"),
    specularMap: loader.load("/textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

  const earthlight = new THREE.MeshBasicMaterial({
    map: loader.load("/textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  });
  const lightMesh = new THREE.Mesh(earthGeo, earthlight);
  earthGroup.add(lightMesh);

  const earthCloud = new THREE.MeshStandardMaterial({
    map: loader.load("/textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
  });
  const cloudMesh = new THREE.Mesh(earthGeo, earthCloud);
  cloudMesh.scale.setScalar(1.003);
  earthGroup.add(cloudMesh);

  const stars = getStarfield({ numStars: 3000 });
  scene.add(stars);

  const sunlight = new THREE.DirectionalLight(0xffffff, 2);
  sunlight.position.set(-2, 0.5, 1.5);
  earthGroup.add(sunlight);

  function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.003;
    lightMesh.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.003;
    stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
    controls.update();
  }
  animate();

  resize(camera, renderer);

  currentScene = scene;
  currentCamera = camera;
  currentControls = controls;
};

const worm = () => {
  disposeCurrentScene();
  const renderer = new THREE.WebGLRenderer();
  rendercp = renderer;
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  document.querySelector("#app")?.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.3);
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 5;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.enableZoom = false;

  const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);

  const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x51ff0d });
  const lineseg = new THREE.LineSegments(edges, lineMat);
  scene.add(lineseg);

  const hemilight = new THREE.HemisphereLight(0xffffff, 0xff00ff);
  scene.add(hemilight);

  function updateCamera(t: any) {
    const time = t * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
  }

  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
  bloomPass.threshold = 0.002;
  bloomPass.strength = 3.5;
  bloomPass.radius = 0;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const numAtoms = 55;
  const atomGeo = new THREE.SphereGeometry(0.1, 10, 10, 180, 6.28, 0, 3.14);
  for (let i = 0; i < numAtoms; i += 1) {
    const atomMat = new THREE.MeshBasicMaterial({
      color: 0x0098c4,
      wireframe: true,
    });
    const atom = new THREE.Mesh(atomGeo, atomMat);
    const p = (i / numAtoms + Math.random() * 0.1) % 1;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.5;
    atom.position.copy(pos);
    const rote = new THREE.Vector3(
      Math.random() * Math.PI,
            Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    atom.rotation.set(rote.x, rote.y, rote.z);
    const atomEdges = new THREE.EdgesGeometry(atomGeo, 0.2);
    const atomLineMat = new THREE.LineBasicMaterial({ color: 0x0098c4 });
    const atomLines = new THREE.LineSegments(atomEdges, atomLineMat);
    atomLines.position.copy(pos);
    atomLines.rotation.set(rote.x, rote.y, rote.z);
    scene.add(atomLines);
  }

  resize(camera, renderer);

  function animate(t = 0) {
    updateCamera(t);
    requestAnimationFrame(animate);
    composer.render();
    controls.update();
  }
  animate();

  currentScene = scene;
  currentCamera = camera;
  currentControls = controls;
  currentComposer = composer;
};

const init = () => {
  orb();

  const loadBtn = document.querySelectorAll('button');
  loadBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const load = this.getAttribute("data-load");
      if (!load) return;
      const app = document.querySelector("#app");
      if (app) {
        rendercp?.dispose();
        app.innerHTML = "";
        switch (load) {
          case "orb":
            orb();
            break;
          case "earth":
            earth();
            break;
          case "worm":
            worm();
            break;
          default:
            break;
        }
      }
    });
  });
};

init();