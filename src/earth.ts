import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { mainOptions } from "./main";


const { w, h, fov, ratio, near, far } = mainOptions;
const earthRenderer=new THREE.WebGLRenderer()
earthRenderer.setSize(w,h)
document.body.appendChild(earthRenderer.domElement)

const earthCamera=new THREE.PerspectiveCamera(fov,ratio,near,far)
earthCamera.position.z=2
const earthScene=new THREE.Scene()

const earthGeo=new THREE.IcosahedronGeometry(1.0,2)
const earthMat=new THREE.MeshStandardMaterial({
    color:0xcacaca,
    flatShading:true
})
const earthMesh=new THREE.Mesh(earthGeo,earthMat)
const light=new THREE.HemisphereLight(0x0011ff,0x00ff11)
earthScene.add(earthMesh)
earthScene.add(light)

function earthAnimate(){
    requestAnimationFrame(earthAnimate)
    earthRenderer.render(earthScene,earthCamera)
}
earthAnimate()