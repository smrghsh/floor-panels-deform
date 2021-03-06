import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Scene } from 'three'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import joshdreamVertexShader from './shaders/joshdream/vertex.glsl'
import joshdreamFragmentShader from './shaders/joshdream/fragment.glsl'

// /**
//  * Base
//  */


// // Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('white')
scene.add(new THREE.AxesHelper())

// //buffer
// // var quantityPoints = 300000
// const particlesGeometry = new THREE.BufferGeometry()
// // const position = new Float32Array(quantityPoints*3)
// // position.forEach((e,i) => {position[i] = Math.random()})

// var points = [];
// var rows = 60;
// var columns = 60;
// for(var i = 0; i <rows; i+=0.1){
//     for(var j = 0; j <columns; j+=0.1){
//         points.push([i,0,j])
//     }
// }

// points = points.flat(2)
// points = Float32Array.from(points)
// console.log(points)
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(points ,3))





const testMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    // size: .02,
    // sizeAttenuation: true,
    uniforms: {
        // uDownload: {value: 0.0},
        uTime: {value: 0.0},
    },
    depthWrite: false,
    transparent: true,
    alphaTest: 0.5,
    // sizeAttentuation: true,
    // blending: THREE.AdditiveBlending
})

// const particles = new THREE.Points(particlesGeometry, testMaterial)
// scene.add(particles)
var xRows = 20.0
var zRows = 20.0
var spacing = 0.2;

const planeGeometry = new THREE.PlaneGeometry()
const cubeGeometry = new THREE.SphereGeometry()
const joshdreamMaterial = new THREE.ShaderMaterial({
    vertexShader: joshdreamVertexShader,
    fragmentShader: joshdreamFragmentShader,
    // size: .02,
    // sizeAttenuation: true,
    uniforms: {
        // uDownload: {value: 0.0},
        uTime: {value: 0.0},
        uXRows: {value: xRows},
        uYRows: {value: zRows},
        uSpacing: {value: spacing}
    },
    depthWrite: false,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
    // sizeAttentuation: true,
    // blending: THREE.AdditiveBlending
})

var sheets = 1;

for ( let i = 0; i < sheets; i++){
    for(let xRow = 0; xRow < xRows; xRow++ ){
        for(let zRow = 0; zRow < zRows; zRow++){
            const p = new THREE.Mesh(Math.random() > 0.6 ? cubeGeometry : planeGeometry,joshdreamMaterial)
            p.rotation.x -= Math.PI/2
            p.position.x += xRow + xRow*spacing;
            p.position.z += zRow + zRow*spacing;
            // p.position.x += xRow + xRow*spacing + 10.0 * Math.random() + 3.0;
            // p.position.z += zRow + zRow*spacing + 20.0 + 0.0 * Math.random();
            p.position.y -=  i * 10.0;
            scene.add(p)
        }
    }
}






//Point construction

// shader material


//expose uniforms dat.GUI



//some code to load the .glb file into an avatar
//set the avatar's blend shapes
//scene.add(avatar)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 800)
camera.position.x = 30
camera.position.y = 20
camera.lookAt(30,0,30)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.xr.enabled = true;
document.body.appendChild( VRButton.createButton( renderer ) );


/**
 * Animate
 */
const clock = new THREE.Clock()
let delta = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update controls
    controls.update()
    delta += clock.getDelta();
    joshdreamMaterial.uniforms.uTime.value = elapsedTime
}
tick()

renderer.setAnimationLoop( function () {
    tick()
	renderer.render( scene, camera );
} );


