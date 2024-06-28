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
  const lineMat=new THREE.LineBasicMaterial({color:0x0000ff})
  const lineseg=new THREE.LineSegments(edges,lineMat)
  scene.add(lineseg)

  const hemilight=new THREE.HemisphereLight(0xffffff,0xff00ff)
  scene.add(hemilight)

  function updateCamera(t:any){
      const time = t * 0.1;
      const looptime = 5 * 1000;
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


resize(camera,renderer)

function animate(t=0){
  updateCamera(t)
  requestAnimationFrame(animate)
  composer.render(scene,camera)
  controls.update()
}
animate()