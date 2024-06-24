import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { mainOptions } from "./main";


const { w, h, fov, ratio, near, far } = mainOptions;
const earthRenderer=new THREE.WebGLRenderer({antialias:true})
earthRenderer.setSize(w,h)
document.body.appendChild(earthRenderer.domElement)

const earthCamera=new THREE.PerspectiveCamera(fov,ratio,near,far)
earthCamera.position.z=2
const earthScene=new THREE.Scene()

const controls=new OrbitControls(earthCamera,earthRenderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=1.0
controls.enableZoom=false

const loader=new THREE.TextureLoader
const earthGeo=new THREE.IcosahedronGeometry(1.0,12)
const earthMat=new THREE.MeshStandardMaterial({
    map:loader.load("../public/earthmap1k.jpg")
})
const earthMesh=new THREE.Mesh(earthGeo,earthMat)
const light=new THREE.HemisphereLight(0xffffff,0xffffff)
earthScene.add(earthMesh)
earthScene.add(light)

function earthAnimate(){
    requestAnimationFrame(earthAnimate)
    earthMesh.rotation.y+=0.01
    earthRenderer.render(earthScene,earthCamera)
    controls.update
}
earthAnimate()