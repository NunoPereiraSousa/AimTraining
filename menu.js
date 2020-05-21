var renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();
let sphere
window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(0, 5, 55);
    camera.lookAt(scene.position);

    let axes = new THREE.AxisHelper(200);
    scene.add(axes);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#971414", 5);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //! NOT USE CONTROLS IN THIS PROJECT !!!!

    // controls = new THREE.OrbitControls(camera);
    // controls.addEventListener('change', function () {
    //     renderer.render(scene, camera);
    // });

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const domEvents = new THREEx.DomEvents(camera, renderer.domElement)

    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        wireframe: true
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    domEvents.addEventListener(sphere, "click", animate)



    // animate();
    renderer.render(scene, camera)
}

function animate() {
    clickSphere()
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

function clickSphere() {
    let timer = Date.now() * 0.005;
    camera.position.x += Math.cos(timer) *1 ;
    camera.position.z += Math.sin(timer) * 0.01;
    camera.lookAt(scene.position);
    // sphere.rotation.x += 0.1
}