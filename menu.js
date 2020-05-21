import * as THREE from './libs/three.module.js';

import {
    FlyControls
} from "./libs/FlyControls.js";
import {
    Lensflare,
    LensflareElement
} from './libs/Lensflare.js';

let mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();

let container, stats;

let camera, scene, renderer;
let controls;

let clock = new THREE.Clock();


window.onload = function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // camera

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background, 3500, 15000);


    // world

    for (let i = 0; i < 800; i++) {
        let mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 200),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0xffffff,
                shininess: 50
            }));

        mesh.position.x = 4000 * (2.0 * Math.random() - 1.0);
        mesh.position.y = 4000 * (2.0 * Math.random() - 1.0);
        mesh.position.z = 4000 * (2.0 * Math.random() - 1.0);

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add(mesh);

    }

    for (var i = 0; i < 40; i++) {

        var game = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 200), new THREE.MeshPhongMaterial({
            color: 0xfe5000,
            specular: 0xfe5000,
            shininess: 50
        }));

        game.position.x = 2000 * (2.0 * Math.random() - 1.0);
        game.position.y = 2000 * (2.0 * Math.random() - 1.0);
        game.position.z = 2000 * (2.0 * Math.random() - 1.0);

        game.rotation.x = Math.random() * Math.PI;
        game.rotation.y = Math.random() * Math.PI;
        game.rotation.z = Math.random() * Math.PI;

        game.matrixAutoUpdate = false;
        game.updateMatrix();

        scene.add(game);

    }


    // lights

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    // lensflares
    var textureLoader = new THREE.TextureLoader();

    var textureFlare0 = textureLoader.load('/Images/lensflare0.png');
    var textureFlare3 = textureLoader.load('/Images/lensflare3.png');

    addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    function addLight(h, s, l, x, y, z) {

        var light = new THREE.PointLight(0xffffff, 1.5, 2000);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        scene.add(light);

        var lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        light.add(lensflare);

    }

    // renderer

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    //

    controls = new FlyControls(camera, renderer.domElement);

    controls.movementSpeed = 2500;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    const domEvents = new THREEx.DomEvents(camera, renderer.container);
    domEvents.addEventListener(game, "click", rotate)


    // events

    window.addEventListener('resize', onWindowResize, false);
    animate();

}

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

function animate() {
    requestAnimationFrame(animate);

    render();
    // stats.update();
}

function render() {
    let delta = clock.getDelta();

    controls.update(delta);
    renderer.render(scene, camera);

}

function rotate() {
    game.rotation.z += 0.1
}

// var renderer, scene, camera, mouse = {
//         x: 0,
//         y: 0
//     },
//     raycaster = new THREE.Raycaster();
// let sphere
// window.onload = function init() {
//     //scene
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
//     scene.fog = new THREE.Fog(scene.background, 3500, 15000);
//     //camera
//     camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
//     // position and point the camera to the center of the scene
//     camera.position.set(0, 0, 250);
//     camera.lookAt(scene.position);

//     let axes = new THREE.AxisHelper(200);
//     scene.add(axes);

//     //renderer
//     renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.outputEncoding = THREE.sRGBEncoding;
//     document.getElementById('canvas-container').appendChild(renderer.domElement);
//     //! NOT USE CONTROLS IN THIS PROJECT !!!!

//     // controls = new THREE.OrbitControls(camera);
//     // controls.addEventListener('change', function () {
//     //     renderer.render(scene, camera);
//     // });



//     const domEvents = new THREEx.DomEvents(camera, renderer.domElement)

//     var geometry = new THREE.SphereGeometry(5, 32, 32);
//     var material = new THREE.MeshBasicMaterial({
//         wireframe: true
//     });
//     sphere = new THREE.Mesh(geometry, material);
//     scene.add(sphere);

//     domEvents.addEventListener(sphere, "click", animate)

//     var dirLight = new THREE.DirectionalLight(0xff0000, 1);
//     dirLight.position.set(0, -1, 0).normalize();
//     dirLight.color.setHSL(0.1, 0.7, 0.5);
//     scene.add(dirLight);



//     // animate();
//     renderer.render(scene, camera)
// }

// function animate() {
//     requestAnimationFrame(animate)

//     renderer.render(scene, camera)
// }

// function clickSphere() {
//     let timer = Date.now() * 0.005;
//     setInterval(() => {
//         // camera.position.x += Math.cos(timer) * 1;
//         // camera.position.z += Math.sin(timer) * 0.01;
//         // camera.lookAt(scene.position);
//         sphere.rotation.x += 0.1
//     }, 1000);
//     // sphere.rotation.x += 0.1
// }