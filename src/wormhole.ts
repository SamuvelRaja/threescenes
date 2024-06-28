import * as THREE from "three";

import spline from "./helper/spline";
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import resize from "./helper/resize";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
 scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const h2=document.createElement("h2")
h2.innerText="3) PORTAL TO NOWHERE"

document.body.appendChild(h2)
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom=false




  const tubeGeo=new THREE.TubeGeometry(spline, 222, 0.65, 16, true)
  const tubeMat=new THREE.MeshBasicMaterial({
    color:0xff0000,
    wireframe:true
  })
  // const tubeMesh=new THREE.Mesh(tubeGeo,tubeMat)


  const edges=new THREE.EdgesGeometry(tubeGeo,0.2)
  const lineMat=new THREE.LineBasicMaterial({color:0x51ff0d})
  const lineseg=new THREE.LineSegments(edges,lineMat)
  scene.add(lineseg)

  const hemilight=new THREE.HemisphereLight(0xffffff,0xff00ff)
  scene.add(hemilight)

  function updateCamera(t:any){
      const time = t * 0.1;
      const looptime = 10 * 1000;
      const p = (time % looptime) / looptime;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
      camera.position.copy(pos);
      camera.lookAt(lookAt);
  }

  // post-processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
    bloomPass.threshold = 0.002;
    bloomPass.strength = 3.5;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  
   const numAtoms = 55;
const atomGeo = new THREE.SphereGeometry( 0.10, 10, 10, 180, 6.28, 0, 3.14 );
for (let i = 0; i < numAtoms; i += 1) {
  const atomMat = new THREE.MeshBasicMaterial({
    color: 0x0098c4,
    wireframe: true
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
  const edges = new THREE.EdgesGeometry(atomGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ color:0x0098c4 });
  const atomLines = new THREE.LineSegments(edges, lineMat);
  atomLines.position.copy(pos);
  atomLines.rotation.set(rote.x, rote.y, rote.z);
  scene.add(atomLines);
}

resize(camera,renderer)

function animate(t=0){
  updateCamera(t)
  requestAnimationFrame(animate)
  composer.render(scene,camera)
  controls.update()
}
animate()