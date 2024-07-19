import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { mainOptions } from "./helper/option";
import getStarfield from "./helper/stars";
import resize from "./helper/resize";

//reusing renderer options
const { w, h, fov, ratio, near} = mainOptions;

//adding renderer
const earthRenderer=new THREE.WebGLRenderer({antialias:true})
earthRenderer.setSize(w,h)

document.body.appendChild(earthRenderer.domElement)



earthRenderer.toneMapping = THREE.ACESFilmicToneMapping;
earthRenderer.outputColorSpace = THREE.LinearSRGBColorSpace;

//adding camera
const earthCamera=new THREE.PerspectiveCamera(fov,ratio,near,1000)
earthCamera.position.z=3
const earthScene=new THREE.Scene()

//orbit controls for interaction
const controls=new OrbitControls(earthCamera,earthRenderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=1.0
controls.enableZoom=false

//earth group creation
const earthGroup=new THREE.Group()
earthScene.add(earthGroup)

//adding basic earth mesh(geometry+material)
const loader=new THREE.TextureLoader
const earthGeo=new THREE.IcosahedronGeometry(1,12)
const earthMat=new THREE.MeshPhongMaterial({
    map:loader.load("/textures/00_earthmap1k.jpg"),
    specularMap: loader.load("/textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
})
const earthMesh=new THREE.Mesh(earthGeo,earthMat)
earthGroup.add(earthMesh)
earthGroup.rotation.z = -23.4 * Math.PI / 180;
//adding night lights
const earthlight=new THREE.MeshBasicMaterial({
    map:loader.load("/textures/03_earthlights1k.jpg"),
    blending:THREE.AdditiveBlending
})
const lightMesh=new THREE.Mesh(earthGeo,earthlight)
earthGroup.add(lightMesh)

//adding earth cloud
const earthCloud=new THREE.MeshStandardMaterial({
    map:loader.load("/textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
    })
const cloudMesh=new THREE.Mesh(earthGeo,earthCloud)
cloudMesh.scale.setScalar(1.003);
earthGroup.add(cloudMesh)

const stars = getStarfield({numStars: 3000});

earthScene.add(stars);

//adding sunlight
const sunlight=new THREE.DirectionalLight(0xffffff,2)
sunlight.position.set(-2,0.5,1.5)
earthGroup.add(sunlight)

function earthAnimate(){
    requestAnimationFrame(earthAnimate)
    earthMesh.rotation.y+=0.003
    lightMesh.rotation.y+=0.003
    cloudMesh.rotation.y+=0.003
     stars.rotation.y -= 0.0002;
    earthRenderer.render(earthScene,earthCamera)
        controls.update()    
}
earthAnimate()

resize(earthCamera,earthRenderer)

