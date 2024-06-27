import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import spline from "./helper/spline"

const w=window.innerHeight
const h=window.innerWidth
const camera=new THREE.PerspectiveCamera(75,w/h,0.1,1000)
camera.position.z=5
const scene=new THREE.Scene()
scene.fog=new THREE.FogExp2(0xffffff,0.1)
const renderer= new THREE.WebGLRenderer({antialias:true})
renderer.toneMapping=THREE.ACESFilmicToneMapping
renderer.outputColorSpace=THREE.SRGBColorSpace
renderer.setSize(w,h)
document.body.appendChild(renderer.domElement)

const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true
controls.dampingFactor=0.03