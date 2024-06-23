import './style.css'
import * as THREE from "three"


const w:number=window.innerWidth;
const h:number=window.innerHeight;

const ratio:number=w/h;
const fov:number=75;
const near:number=0.1;
const far:number=10;;

const renderer=new THREE.WebGLRenderer({antialias:true})

renderer.setSize(w,h);

document.body.appendChild(renderer.domElement)

const camera=new THREE.PerspectiveCamera(fov,ratio,near,far)
camera.position.z=2
const scene=new THREE.Scene()
const geo=new THREE.IcosahedronGeometry
const mat=new THREE.MeshBasicMaterial({
  color:"#dd3d44"
})
const mesh=new THREE.Mesh(geo,mat)
scene.add(mesh)
renderer.render(scene,camera)


