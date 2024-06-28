
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import resize from "./helper/resize";

const w:number=window.innerWidth;
const h:number=window.innerHeight;

const ratio:number=w/h;
const fov:number=75;
const near:number=0.1;
const far:number=10;

export const mainOptions = {
  w: w,
  h: h,
  ratio: ratio,
  fov: fov,
  near: near,
  far: far
};
const renderer=new THREE.WebGLRenderer({antialias:true})

renderer.setSize(w,h);
const h2=document.createElement("h2")
h2.innerText="1)ORB OF DYSTOPIA"
document.body.appendChild(h2)
document.body.appendChild(renderer.domElement)


const camera=new THREE.PerspectiveCamera(fov,ratio,near,far)
camera.position.z=2
const scene=new THREE.Scene()
const geo=new THREE.IcosahedronGeometry(1.0,2)

 //The material used for the mesh.

const mat=new THREE.MeshStandardMaterial({
  color:0xffffff,
  flatShading:true
})
const light=new THREE.HemisphereLight(0x002288,0x99cb00)
scene.add(light)
const mesh=new THREE.Mesh(geo,mat)//geometry + material creates a mesh 
scene.add(mesh)//then mesh added to the scene

const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true
controls.dampingFactor=0.03
controls.enableZoom=false
//wire mesh
const wire=new THREE.MeshBasicMaterial({
  color:0x990000,
  wireframe:true
})
const wiremesh =new THREE.Mesh(geo,wire)
mesh.add(wiremesh)


//animate scene
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
  controls.update()
}
animate()

resize(camera,renderer)