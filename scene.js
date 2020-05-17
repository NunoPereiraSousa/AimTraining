var renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();

// objects
let plane;
let head;
let tree;
let targets = [];
let house;
// objects

// Lights
let light;
// Lights

// Materials
let material = [
    new THREE.MeshLambertMaterial({
        color: 0x3d2817
    }), // brown
    new THREE.MeshLambertMaterial({
        color: 0x2d4c1e
    }), // green
];
// Materials

// Score
let score = 0;
// Score

window.addEventListener("mousedown", onMouseClick, false);

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

    for (let i = 0; i < 150; i++) {
        createTree();
    }

    createLights();
    createPlane();
    createObstacles();
    createHouse();

    animate();
}

//+ -------------------- ESSENTIAL FUNCTIONS

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    headShot();
    ballMove();
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function headShot() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    intersects.forEach(intersection => {
        targets.forEach((target, i) => {
            ballCount = targets.length - 1;
            if (intersection.object.name === target.name) {
                scene.remove(intersection.object);
                targets.splice(i, 1);
                score += 1;
            }
        });
    })
}

function bonusScore(event) {
    if (event.timeStamp < 2000 && ballCount === 0) {
        score += 10
    }
}
document.body.addEventListener("mousedown", bonusScore);

let ballVel = 0.01;

function ballMove() {
    for (const target of targets) {
        if (target.positionX < 50 || target.positionX > -50) {
            ballVel = -ballVel
        }
        target.positionX += ballVel;      
    }  
    
    // if (head2.position.x < 50 || head2.position.x > -50) {
    //     ballVel = -ballVel
    // }
    // head2.position.x += ballVel;
}

//+ -------------------- ESSENTIAL FUNCTIONS

//? -------------------- CREATING/ MODELING OBJECTS

function createPlane() {
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshBasicMaterial({
            color: 0x9b7653,
            side: THREE.DoubleSide
        }));
    plane.position.set(0, 0, 0)
    plane.rotateX(Math.PI / 2)
    scene.add(plane);
}

function createLights() {
    light = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(light)
}

function createObstacles() {
    head = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffff00
        }));
    head.visible = false;
    for (let i = 0; i < 1; i++) {
        head2 = head.clone();
        head2.name = `head${i + 1}`;
        head2.visible = true;
        positionX = Math.floor(Math.random() * (40)) - 20;
        positionZ = Math.floor(Math.random() * (20 + 2)) - 5;
        head2.position.set(positionX, 3, positionZ);
        targets.push({
            id: i + 1,
            name: head2.name,
            positionX: head2.position.x,
            positionZ: head2.position.z

        })
        scene.add(head2);
    }
    console.table(targets)
    scene.add(head);
}

function createTree() {
    tree = new THREE.Object3D();

    let trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.05, 2),
        material[0]);
    trunk.position.y = 1;
    tree.add(trunk);

    let bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.45, 2, 16),
        new THREE.MeshLambertMaterial({
            color: randomGreenColor()
        }));
    bottom.position.y = 1.8;
    tree.add(bottom);

    let middle = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.39, 3),
        new THREE.MeshLambertMaterial({
            color: randomGreenColor()
        }));
    middle.position.y = 3.2;
    tree.add(middle);

    let top = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.32, 3),
        new THREE.MeshLambertMaterial({
            color: randomGreenColor()
        }));
    top.position.y = 4.3;
    tree.add(top);

    tree.scale.x = tree.scale.z = Math.random() * 2 + 1.8;

    positionX = Math.floor(Math.random() * (200)) - 100;
    positionZ = Math.floor(Math.random() * (100 + 20)) - 100;

    tree.position.set(positionX, 0, positionZ);

    scene.add(tree)
}

function createHouse() {
    house = new THREE.Object3D();
    walls = new THREE.Mesh(
        new THREE.BoxGeometry(20, 10, 20),
        new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("/Images/House/woodWallColor.jpg"),
            normalMap: new THREE.TextureLoader().load("/Images/House/woodWallNormal.jpg"),
            roughnessMap: new THREE.TextureLoader().load("/Images/House/woodWallRoughness.jpg"),
        }));
    house.position.set(10, 5, -100);
    scene.add(house);
    house.add(walls);

    let roofTexture = new THREE.TextureLoader().load("/Images/House/roof_tiles.jpg");
    roofTexture.normalMap = new THREE.TextureLoader().load("/Images/House/roof_tiles_normal.jpg");
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(16, 4);
    let cone = new THREE.Mesh(
        new THREE.ConeGeometry(16, 6, 4),
        new THREE.MeshStandardMaterial({
            map: roofTexture
        }));
    cone.rotateY(radians(45))
    cone.position.y = 8;
    house.add(cone);
}

//? -------------------- CREATING/ MODELING OBJECTS

//* -------------------- HELPING FUNCTIONS

// Converts from degrees to radians
function radians(degrees) {
    return degrees * Math.PI / 180;
}

// Converts from radians to degrees
function degrees(radians) {
    return radians * 180 / Math.PI;
}

function randomGreenColor() {
    // Note: the less min and max variables are, darken the green color will look like
    let max = 120;
    let min = 90;
    let green = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(0, ${green}, 0)`
}

//* -------------------- HELPING FUNCTIONS