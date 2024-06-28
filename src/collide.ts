import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { mainOptions } from "./main";
import resize from "./helper/resize";

//reusing renderer options
const { w, h, fov, ratio, near, far } = mainOptions;

const camera=new THREE.PerspectiveCamera(fov,ratio,near,1000)
camera.position.z=5
const renderer=new THREE.WebGLRenderer()
renderer.setSize(w,h)
renderer.toneMapping=THREE.ACESFilmicToneMapping
renderer.outputColorSpace=THREE.SRGBColorSpace
const h2=document.createElement("h2")
h2.innerText="4) collider"
document.body.appendChild(h2)
document.body.appendChild(renderer.domElement)

const scene=new THREE.Scene()


