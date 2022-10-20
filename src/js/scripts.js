import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

import space from "../assets/space.jpg"

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

camera.position.set(-5, 5, 5)


const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// const directLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directLight)
// directLight.position.set(10,10,10)


const cubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture])
// renderer.setClearColor(0xffffff, 1)

const gui = new dat.GUI()

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,

}

const uniforms = {
    u_time: { type: 'f', value: 0.0 },
    u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
    u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
    image: {type: 't', value: new THREE.TextureLoader().load(space)}
}

window.addEventListener('mousemove', (e) => {
    uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight)
})

const geometry = new THREE.PlaneGeometry(10, 10, 30, 30)
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    // wireframe: true,
    uniforms,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

orbits.update()

const clock = new THREE.Clock()

function animate() {

    uniforms.u_time.value = clock.getElapsedTime()
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})
