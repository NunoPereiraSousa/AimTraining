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

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
    camera.position.z = 250;

    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background, 3500, 20000);

    for (let i = 0; i < 800; i++) {
        let cube = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 200),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0xffffff,
                shininess: 50
            }));

        cube.position.x = 4000 * (2.0 * Math.random() - 1.0);
        cube.position.y = 4000 * (2.0 * Math.random() - 1.0);
        cube.position.z = 4000 * (2.0 * Math.random() - 1.0);

        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.rotation.z = Math.random() * Math.PI;

        cube.matrixAutoUpdate = false;
        cube.updateMatrix();

        scene.add(cube);
    }

    for (var i = 0; i < 1; i++) {

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

    addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    // instructions - renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    // instructions - end renderer

    // instructions - fly controls
    controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 2500;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;
    // instructions - end fly controls

    // instructions - end dom elements
    const domEvents = new THREEx.DomEvents(camera, renderer.container);
    domEvents.addEventListener(game, "dblclick", startGame)
    // instructions - end dom elements

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
}

function addLight(h, s, l, x, y, z) {
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    // lensflares
    let textureLoader = new THREE.TextureLoader();

    let textureFlare0 = textureLoader.load('/Images/lensflare0.png');
    let textureFlare3 = textureLoader.load('/Images/lensflare3.png');
    let light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    let lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
}

function render() {
    let delta = clock.getDelta();

    controls.update(delta);
    renderer.render(scene, camera);
}

function startGame() {
    window.location.href = "game.html";
}