import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

import squareSpace from "../static/square_space.jpg"
import starsTexture from "../img/stars.jpg"
import earthTexture from "../img/earth.jpg"
import jupiterTexture from "../img/jupiter.jpg"
import marsTexture from "../img/mars.jpg"
import mercuryTexture from "../img/mercury.jpg"
import neptuneTexture from "../img/neptune.jpg"
import plutoTexture from "../img/pluto.jpg"
import saturnRingTexture from "../img/saturn ring.png"
import saturnTexture from "../img/saturn.jpg"
import sunTexture from "../img/sun.jpg"
import uranusRingTexture from "../img/uranus ring.png"
import uranusTexture from "../img/uranus.jpg"
import venusTexture from "../img/venus.jpg"



const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const aspectRatio = window.innerWidth / window.innerHeight

const camera = new THREE.PerspectiveCamera(
    100,
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


const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture])

orbits.update()

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

const createPlanet = (size, texture, position, ring) => {
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    })
    const mesh = new THREE.Mesh(geo, mat)
    const obj = new THREE.Object3D()
    obj.add(mesh)
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32)
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide,
        })
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        obj.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
    }
    scene.add(obj)
    mesh.position.x = position
    return { mesh, obj }
}

// Sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30)
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)


// Mercury
const mercury = createPlanet(3.2, mercuryTexture, 28)

const venus = createPlanet(5.8, venusTexture, 44)
const earth = createPlanet(6, earthTexture, 62)
const mars = createPlanet(4, marsTexture, 78)
const jupiter = createPlanet(12, jupiterTexture, 100)



// Saturn
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
})

const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
})
const neptune = createPlanet(7, neptuneTexture, 200)
const pluto = createPlanet(2.8, plutoTexture, 216)


const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
scene.add(pointLight)


function animate(time) {

    // Self-rotation
    sun.rotateY(0.004)
    mercury.mesh.rotateY(0.004)
    venus.mesh.rotateY(0.002)
    earth.mesh.rotateY(0.02)
    mars.mesh.rotateY(0.018)
    jupiter.mesh.rotateY(0.04)
    saturn.mesh.rotateY(0.038)
    uranus.mesh.rotateY(0.03)
    neptune.mesh.rotateY(0.032)
    pluto.mesh.rotateY(0.008)

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera)
}


renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})
