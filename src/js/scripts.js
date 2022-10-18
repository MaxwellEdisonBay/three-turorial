import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import * as dat from "dat.gui"

import starsTexture from "../img/stars.jpg"

const doggoUrl = new URL("../assets/doggo2.glb", import.meta.url)

const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const aspectRatio = window.innerWidth / window.innerHeight

const camera = new THREE.PerspectiveCamera(
    45,
    aspectRatio,
    0.1,
    1000
)

const orbits = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

camera.position.set(-10, 50, 30)


const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// const directLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directLight)
// directLight.position.set(10,10,10)


const cubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture])
renderer.setClearColor(0xffffff, 1)

const gui = new dat.GUI()

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,

}

const textureLoader = new THREE.TextureLoader()

const assetLoader = new GLTFLoader()

const grid = new THREE.GridHelper(30, 30)
scene.add(grid)


let mixer;
assetLoader.load(doggoUrl.href, (gltf) => {
    const model = gltf.scene
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    // const clip = THREE.AnimationClip.findByName(clips, "HeadAction")
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach((clip) => {
        const action = mixer.clipAction(clip)
        action.play()
    })

}, undefined, (error) => {
    console.error(error)
})

orbits.update()

const clock = new THREE.Clock()

function animate(time) {
    // console.log(mixer)
    mixer?.update(clock.getDelta())
    renderer.render(scene, camera)
}


renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})
