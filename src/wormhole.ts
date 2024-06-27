import * as THREE from "three";

import spline from "./helper/spline";
import { OrbitControls } from "three/examples/jsm/Addons.js";


const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
// scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;



// create a line geometry from the spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xffff00, });
const line = new THREE.Line(geometry, material);
//  scene.add(line);

 const tubeGeo=new THREE.TubeGeometry(spline, 222, 0.65, 16, true)
 const tubeMat=new THREE.MeshBasicMaterial({
  color:0xff0000,
  wireframe:true
 })
 const tubeMesh=new THREE.Mesh(tubeGeo,tubeMat)
 scene.add(tubeMesh)

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
  controls.update()
}
animate()