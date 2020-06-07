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
let civil;
let civilians = []
let house;
let sky;
// objects

// level
let level = 1
// level 


//  player speed
// let playerSpeed = 0.5
//  player speed

// targets speed 
let speed = {
    min: 0.02,
    max: 0.05,
}
// targets speed

// counters
let civilCount = 0
let ballCount = 0
// counters 

// objects that have been intercepted (by mouse click)
let intersects = null
//  objects that have been intercepted


// player
let player = {
    name: null, // future change
    shot: level * 2 + 10,
    kill: 0,
    civilianKill: 0,
    points: 0,
    maxLevel: level,
    speed: 0.5,
    live: 5
}
let bulletText = document.createElement('p');

// player


// three
let trees = []
// three


//  timer

//* Game timer related
let timer = null
let display = 0

//* Start game timer
let gameStartTimer = null
let countDown = 3
//  timer



// gameProgress
let gameInProgress = false
// gameProgress



// gameController
stopLoop = false
// gameController


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



// player Movement
let keys = []
let angle = 0
// Player Movement



// scope
let scope = null
let scopeMirror = null
// scope

// Score
let score = 0;
let textScore = document.createElement('p');
// Score



//bunker parts
let compBunker = new THREE.Object3D();
let bunker = {
    bWall: null,
    lWall: null,
    roof: null,
    bfWall: null

}

//



// textures
let civilTexture = null
let bombersTexture = null
// textures



//  !test variables: 
let gun = null
// ! test variables 

window.addEventListener("mousedown", bonusScore, false);
window.addEventListener("resize", responsiveScene);

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1200);
    // position and point the camera to the center of the scene
    camera.position.set(0, 1.2, 55);
    camera.lookAt(scene.position);

    let axes = new THREE.AxisHelper(200);
    scene.add(axes);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor("#ffffff", 50);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    for (let i = 0; i < 110; i++) {
        createTree();
    }

    createLights();
    createPlane();
    createBunker()
    createHouse();
    createSky();
    textStyle();
    addScope();
    addScopeMirror();

    display = 30


    document.addEventListener("keydown", keyPressed);
    document.addEventListener('keyup', keyReleased);
    loadGun()
    // startTimer()
    // flechasObject.traverse(function (object) {
    //     object.frustumCulled = false;
    // });


    // scene.traverse((node) => {
    //     if (node.isMesh) node.material.transparent = false;
    // });
    animate();
}

function animate() {
    if (gameInProgress) {
        headShot();
        detectCollision()
        targetsMove();
        levelUp();

        terroristBoom()



        textScore.innerHTML = `Score: ${score}`;
        bulletText.innerHTML = `Bullets: ${player.shot}`;
        createBunker()

    }
    movePLayer()

    sky.rotation.y += 0.0002;

    if (stopLoop == false) {
        requestAnimationFrame(animate)
    }

    renderer.render(scene, camera)
}

function textStyle() {
    textScore.style.position = 'absolute';
    textScore.style.width = 100;
    textScore.style.height = 100;
    textScore.style.top = 50 + 'px';
    textScore.style.left = 70 + 'px';
    textScore.style.color = "#fefefa";
    textScore.style.fontSize = 1.4 + "em"
    document.body.appendChild(textScore);

    bulletText.style.position = 'absolute';
    bulletText.style.width = 100;
    bulletText.style.height = 100;
    bulletText.style.top = 100 + 'px';
    bulletText.style.left = 70 + 'px';
    bulletText.style.color = "#fefefa";
    bulletText.style.fontSize = 1.4 + "em"
    document.body.appendChild(bulletText);
}

function toXYCoords(pos) {
    var vector = projector.projectVector(pos.clone(), camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return vector;
}

//? -------------------- CREATING/ MODELING OBJECTS

let mountains = []

function createPlane() {
    let planeTexture = new THREE.TextureLoader().load("/Images/terrain.jpg");
    //  new THREE.PlaneGeometry(300, 300, 10, 10),
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(200, 100);
    plane = new THREE.Mesh(
        new THREE.BoxGeometry(300, 10, 300),
        new THREE.MeshBasicMaterial({
            // map: planeTexture,
            color: 0xDEB887,
            side: THREE.DoubleSide
        }));
    plane.position.y = -5
    scene.add(plane);
}

function createLights() {
    light = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(light)
}

function createSky() {
    sky = new THREE.Mesh(
        new THREE.SphereGeometry(145, 64, 64),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("/Images/sky.jpg")
        }));
    sky.material.side = THREE.DoubleSide;
    scene.add(sky);
}

function createObstacles() {
    if (bombersTexture == null) {
        do {
            bombersTexture = new THREE.TextureLoader().load("/Images/Person/suicideBomberCod.png")
        } while (bombersTexture == null);
    }

    for (let i = 0; i < 2 * level; i++) {
        let dir = Math.random() * (1 - (-1)) + -1, //!directions
            head = new THREE.Mesh(
                new THREE.BoxGeometry(2, 3, 0.5),
                new THREE.MeshBasicMaterial({
                    color: "#FA8072"
                }));


        head.material.map = bombersTexture
        head.name = `head${i + 1}`
        positionX = Math.floor(Math.random() * (60 - (-60) + 1) - 60);
        positionZ = Math.floor(Math.random() * (-50 - (-60) + 1) - 60);
        head.position.set(positionX, 1.5, positionZ);
        targets.push({
            obj: head,
            vel: (Math.random() * (speed.max - speed.min) + speed.min) * dir,
            objType: "hostile",
            velZ: 0.8,
            collision: false
        })
    }

    for (const target of targets) {
        scene.add(target.obj);
    }
}

function createCivil() {
    if (civilTexture == null) {
        do {
            civilTexture = new THREE.TextureLoader().load("/Images/Person/trevor Philip.jpg")
        } while (civilTexture == null);
    }


    for (let i = 0; i < 2 * level / 2; i++) {
        let dir = Math.random() * (1 - (-1)) + -1,
            civil = new THREE.Mesh(
                new THREE.BoxGeometry(2, 3, 0.5),
                new THREE.MeshBasicMaterial({
                    color: "#A9A9A9"
                }));
        civil.material.map = civilTexture
        civil.name = `civil${i + 1}`
        positionX = Math.floor(Math.random() * (40)) - 20;
        positionZ = Math.floor(Math.random() * (20 + 2)) - 5;
        civil.position.set(positionX, 1.5, positionZ);
        targets.push({
            obj: civil,
            vel: 0.02 * dir,
            objType: "civil",

        })
    }

    for (const civil of targets) {
        scene.add(civil.obj);
    }
}

function createTree(i) {
    tree = new THREE.Object3D();

    let trunkTexture = new THREE.TextureLoader().load("/Images/trunk.jpg");
    trunkTexture.wrapS = THREE.RepeatWrapping;
    trunkTexture.wrapT = THREE.RepeatWrapping;
    trunkTexture.repeat.set(4, 4);

    let trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.05, 2),
        new THREE.MeshLambertMaterial({
            // map: trunkTexture
            color: randomGreenColor()
        }));
    trunk.position.y = 1;
    tree.add(trunk);

    let treeTexture = new THREE.TextureLoader().load("/Images/treeGreen2.jpg");
    treeTexture.wrapS = THREE.RepeatWrapping;
    treeTexture.wrapT = THREE.RepeatWrapping;
    treeTexture.repeat.set(2, 4);

    let bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.45, 2, 16),
        new THREE.MeshLambertMaterial({
            // map: treeTexture
            color: randomGreenColor()
        }));
    bottom.position.y = 1.8;
    tree.add(bottom);

    let middle = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.39, 3),
        new THREE.MeshLambertMaterial({
            color: randomGreenColor()
            // map: treeTexture
        }));
    middle.position.y = 3.2;
    tree.add(middle);

    let top = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.32, 3),
        new THREE.MeshLambertMaterial({
            color: randomGreenColor()
            // map: treeTexture
        }));
    top.position.y = 4.3;
    tree.add(top);

    tree.scale.x = tree.scale.z = Math.random() * 2 + 1.8;

    positionX = Math.floor(Math.random() * (200)) - 100;
    positionZ = Math.floor(Math.random() * (100 + 20)) - 100;

    tree.position.set(positionX, 0, positionZ);
    tree.name = `tree`

    scene.add(tree)
    trees.push(tree)
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

function createBunker() {
    let bWidth = 80
    let height = 2 // 8 
    let wallsDeep = 2
    compBunker = new THREE.Object3D();

    let wallTexture = new THREE.TextureLoader().load("/Images/wall.jpg");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(50, 1);

    // back wall
    let geometry = new THREE.BoxGeometry(bWidth, height, wallsDeep);
    let material = new THREE.MeshPhongMaterial({
        // map: wallTexture
        color: 0x888888
    });
    bunker.bWall = new THREE.Mesh(geometry, material);
    compBunker.add(bunker.bWall)

    //  left wall
    geometry = new THREE.BoxGeometry(wallsDeep, height, 40);
    bunker.lWall = new THREE.Mesh(geometry, material);
    compBunker.add(bunker.lWall)
    bunker.lWall.position.x = -bWidth / 2
    bunker.lWall.position.z = -19

    // right wall
    bunker.rWall = new THREE.Mesh(geometry, material);
    compBunker.add(bunker.rWall)
    bunker.rWall.position.x = bWidth / 2
    bunker.rWall.position.z = -19

    // front bottom 
    geometry = new THREE.BoxGeometry(bWidth, 4 / 8, wallsDeep);
    bunker.bfWall = new THREE.Mesh(geometry, material);
    compBunker.add(bunker.bfWall)
    bunker.bfWall.position.z = -38
    bunker.bfWall.position.y = -0.8

    //  roof
    // geometry = new THREE.BoxGeometry(bWidth, 4 / 3, 40);
    // bunker.roof = new THREE.Mesh(geometry, material);
    // compBunker.add(bunker.roof)
    // bunker.roof.position.z = -20
    // bunker.roof.position.y = 6 - 1.5

    //  bunker place
    compBunker.position.y = height / 2
    scene.add(compBunker)

    compBunker.position.z = 55 + 20

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


// generates random color to trees 
function randomGreenColor() {
    // Note: the less min and max variables are, darken the green color will look like
    let max = 120;
    let min = 90;
    let green = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(0, ${green}, 0)`
}

// Makes the scene responsive
function responsiveScene() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

//* -------------------- HELPING FUNCTIONS

//+ -------------------- ESSENTIAL FUNCTIONS

function onMouseClick(event) {
    if (gameInProgress == true) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children, true);
        player.shot -= 1
    }
}

function onMouseMove(event) {
    if (gameInProgress == true) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        scope.position.x = mouse.x * 40
        scope.position.y = mouse.y * 23

        scopeMirror.position.x = mouse.x * 150
        scopeMirror.position.y = mouse.y * 50

        camera.lookAt(scope.position.x, scope.position.y, scope.position.z)
        gun.lookAt(-scopeMirror.position.x, -scopeMirror.position.y, scopeMirror.position.z)
    }
}

function headShot() {
    countTarget()
    if (intersects != null) {

        obstacleConfirm()
        humanShieldConfirm()
        intersects.forEach(intersection => {
            targets.forEach((target, i) => {

                if (intersection.object.name === target.obj.name) {
                    scene.remove(intersection.object);
                    if (target.objType == "civil") {
                        display -= (3 + level)
                        player.civilianKill++
                        if (score > 1) {
                            score -= 2;
                        } else if (score == 1) {
                            score = 0
                        }
                    } else if (target.objType == "hostile") {
                        player.kill++
                        score += 1;
                    }
                    target.dead = true
                    targets.splice(i, 1); // Remove de deaths
                }
            });
        })
    }
    intersects = null
}

function countTarget() {
    civilCount = 0
    ballCount = 0
    for (const target of targets) {
        if (target.objType == "civil") {
            civilCount++
        } else {
            ballCount++
        }
    }
}

function bonusScore(event) {
    countTarget()

    if (event.timeStamp < 3000 * level && ballCount - 1 === 0) {
        score += 10
    }
}
document.body.addEventListener("mousedown", onMouseClick);
document.addEventListener("mousemove", onMouseMove, false);

function targetsMove() {
    for (const target of targets) {
        if (target.obj.position.x >= 80 || target.obj.position.x <= -80) {
            target.vel = -target.vel
        }

        if (target.objType == "hostile") {
            target.obj.position.z += target.velZ
        }
        target.obj.position.x += target.vel;
    }
}

var lastmousex = -1;
var lastmousey = -1;
var lastmousetime;
var mousetravel = 0;
window.addEventListener("mousemove", updateSensitivity)

function updateSensitivity(e) {
    var mousex = e.pageX;
    var mousey = e.pageY;
    if (lastmousex > -1)
        mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
    lastmousex = mousex;
    lastmousey = mousey;
    return
    // plane.position.x = targetX;
}

function levelUp() {
    if (inGame()) {
        if (ballCount == 0) {

            level++
            player.maxLevel = level
            playerReload()
            levelTimer()
            for (let j = 0; j < targets.length; j++) {
                for (let i = scene.children.length - 1; i > 0; i--) {
                    if (scene.children[i].name == targets[j].obj.name) {
                        scene.remove(scene.getObjectByName(scene.children[i].name));
                    }
                }
            }
            targets = []
            if (speed.max < 10) {
                speed.max += 0.02
            }

            createObstacles()
            createCivil()
        }
    } else {
        saveHeightScore()
        alert(`Game over`)
        stopLoop = true
        stopTimer()
    }
}

function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove(selectedObject);
    animate();
}
/**
 * Function that reloads the players gun
 */
function playerReload() {
    player.shot = level * 2 + 10
}

/**
 * Function that confirms if the players continues in the game or not 
 */
function inGame() {
    if (display <= 0) {
        return false
    }

    if (player.civilianKill == 5) {
        return false
    }

    if (player.shot == 0) {
        return false
    }

    if (player.live == 0) {
        return false
    }
    return true
}

/**
 * Function that confirms in front obstacles
 */
function obstacleConfirm() {
    let intersects2 = [] // save all the trees that are possible obstacles
    let intersects3 = [] // save all interception that are targets

    //  gets all the trees that have been touched bhy the mouse
    for (const intersect of intersects) {
        if (intersect.object.parent.name === "tree") {
            intersects2.push(intersect)
        }
    }
    //  >
    //  <confirm all targets that are behind an tree 
    for (const intersect of intersects) {
        for (const target of targets) {
            if (target.obj.name === intersect.object.name) {
                let push = true // confirms if you can [push it in
                for (let i = 0; i < intersects2.length; i++) {
                    if (intersects2[i].object.parent.position.z > intersect.object.position.z) {
                        push = false
                        break;
                    }
                }
                if (push == true) {
                    intersects3.push(intersect)
                }
            }
        }
    }
    // confirm all targets that are behind an tree>

    intersects = [] // global 
    intersects = intersects3 // you just need the targets not all the objects that where in the way of the mouse click
}

/**
 * Function that confirms if there is an target in front of another target (human shield) 
 */
function humanShieldConfirm() {
    let intersects2 = [] // save all the obstacles that are not protected by other

    for (let i = 0; i < intersects.length; i++) {
        let push = true
        for (let j = 0; j < intersects.length; j++) {
            if (intersects[j].object.name !== intersects[i].object.name) {
                if (intersects[j].object.position.z > intersects[i].object.position.z) {
                    push = false
                    break
                }
            }
        }
        if (push == true) {
            intersects2.push(intersects[i])
        }
    }

    intersects = []
    intersects = intersects2
}

/**
 * Function that add a timer to the system 
 * if the time in the timer = 0 the player loses 
 */
function startTimer() {

    timer = window.setTimeout(
        function () {
            display--
            stopTimer()

        }, 1000);
}
/**
 * Function that stops the timer
 */
function stopTimer() {
    clearTimeout(timer)
    startTimer()
}

/**
 * Function that alter changes de "Time that the person need to complete an level"
 */
function levelTimer() {
    display += (20 + level)
}

/**
 * Function related to the press of the keys
 */
// key down handling 
function keyPressed(event) {
    keys[event.keyCode] = true
}

// Key up handling 
function keyReleased() {
    keys[event.keyCode] = false
}

function movePLayer() {
    if (gameInProgress == false) {
        let obj = confirmTransition()

        //  W
        if (keys[87] == true && obj.w) {
            // camera an scope positioning
            camera.position.z -= player.speed * Math.cos(camera.rotation.y)
            camera.position.x -= player.speed * Math.sin(camera.rotation.y)
            scope.position.z -= player.speed * Math.cos(camera.rotation.y)
            scopeMirror.position.z -= player.speed * Math.cos(camera.rotation.y)
            // gun positioning
            gun.position.z -= player.speed * Math.cos(camera.rotation.y)
            gun.position.x -= player.speed * Math.sin(camera.rotation.y)
        }
        // S 
        if (keys[83] == true && obj.s) {
            // camera and scope
            camera.position.z -= player.speed * -Math.cos(camera.rotation.y)
            camera.position.x -= player.speed * -Math.sin(camera.rotation.y)
            scope.position.z -= player.speed * -Math.cos(camera.rotation.y)
            scopeMirror.position.z -= player.speed * -Math.cos(camera.rotation.y)
            // gun positioning 
            gun.position.z -= player.speed * -Math.cos(camera.rotation.y)
            gun.position.x -= player.speed * -Math.sin(camera.rotation.y)
        }
        // A
        if (keys[65] == true && obj.a) {
            //  camera and scope positioning
            camera.position.z -= player.speed * -Math.sin(camera.rotation.y)
            camera.position.x -= player.speed * Math.cos(camera.rotation.y)

            //  gun positioning
            gun.position.z -= player.speed * -Math.sin(camera.rotation.y)
            gun.position.x -= player.speed * Math.cos(camera.rotation.y)
        }
        // D
        if (keys[68] == true && obj.d) {

            //  camera and scope positioning
            camera.position.z -= player.speed * Math.sin(camera.rotation.y)
            camera.position.x -= player.speed * -Math.cos(camera.rotation.y)
            // gun positioning
            gun.position.z -= player.speed * Math.sin(camera.rotation.y)
            gun.position.x -= player.speed * -Math.cos(camera.rotation.y)
        }

        //   left
        if (keys[81] == true) {
            camera.rotation.y += Math.PI * 0.01
            gun.rotation.y += Math.PI * 0.01
        }

        //   right
        if (keys[69] == true) {
            camera.rotation.y -= Math.PI * 0.01
            gun.rotation.y -= Math.PI * 0.01
        }
    }

    // it is need to press the "SPACE BAR" to place the "bipod" to start the game
    if (keys[32] == true && gameInProgress == false) {
        let time = 0

        do {
            gun.visible = true
            if (time == 10000) {
                countDown--
            }
            if (time == 20000) {
                countDown--
            }
            if (time == 30000) {
                countDown--
            }
            time++
        } while (countDown != 0);

        countDown = 3
        gameInProgress = true
        createObstacles();
        createCivil()
        startTimer()
    }
}

/**
 * This function predicts what happens if the user presses the "walking" buttons
 * !objective: define the limits of the player movement 
 */
function confirmTransition() {
    let obj = {
        w: true,
        s: true,
        a: true,
        d: true
    }

    let countWx = camera.position.x - player.speed * Math.sin(camera.rotation.y)
    let countSx = camera.position.x - player.speed * -Math.sin(camera.rotation.y)
    let countAx = camera.position.x - player.speed * Math.cos(camera.rotation.y)
    let countDx = camera.position.x - player.speed * -Math.cos(camera.rotation.y)

    let countWz = camera.position.z - player.speed * Math.cos(camera.rotation.y)
    let countSz = camera.position.z - player.speed * -Math.cos(camera.rotation.y)
    let countAz = camera.position.z - player.speed * -Math.sin(camera.rotation.y)
    let countDz = camera.position.z - player.speed * Math.sin(camera.rotation.y)

    if (countWz < 41.5 || countWz > 72) {
        obj.w = false
    }

    if (countSz < 41.5 || countSz > 72) {
        obj.s = false
    }
    if (countAz < 41.5 || countAz > 72) {
        obj.a = false
    }
    if (countDz < 41.5 || countDz > 72) {
        obj.d = false
    }

    if (countWx < -38 || countWx > 38) {
        obj.w = false
    }
    if (countSx < -38 || countSx > 38) {
        obj.s = false
    }
    if (countAx < -38 || countAx > 38) {
        obj.a = false
    }
    if (countDx < -38 || countDx > 38) {
        obj.d = false
    }
    return obj
}

/**
 * Function that adds an "scope" to the system, an scope helps the camera movement
 */
function addScope() {
    let targetGeometry = new THREE.CircleGeometry(1, 32);
    let targetMaterial = new THREE.MeshBasicMaterial({
        color: "green"
    });
    scope = new THREE.Mesh(targetGeometry, targetMaterial);
    scope.name = `scope`
    scope.visible = false
    scene.add(scope);
}

/**
 * Function that detect the collision between the trees and the "targets"
 */
function detectCollision() {
    let collision = false

    for (const target of targets) {
        target.collision = false
    }

    for (let i = 0; i < targets.length; i++) {
        collision = false
        if (targets[i].objType == "hostile") {
            for (let j = 0; j < trees.length; j++) {
                for (const children of trees[j].children) {
                    var BBox = new THREE.Box3().setFromObject(children);
                    var BBox2 = new THREE.Box3().setFromObject(targets[i].obj);
                    collision = BBox.intersectsBox(BBox2)

                    if (collision) {
                        targets[i].collision = true
                        break;
                    }
                }
                if (collision) {
                    break;
                }
            }
        }
    }

    for (const target of targets) {
        if (target.objType == "hostile") {
            if (target.collision == true) {
                if (target.vel > 0) {
                    target.obj.position.x += 0.05
                } else {
                    target.obj.position.x -= 0.05
                }
                target.velZ = 0
            } else {
                target.velZ = 0.1
            }
        }
    }
}

//  Todo : This is unfinished I need to finish this boommmmm
function terroristBoom() {
    let removes = []
    for (const target of targets) {
        if (target.objType == "hostile" && (target.obj.position.z >= 40)) {
            scene.remove(target.obj);
            removes.push(target.obj.name) // id of the target
            player.live -= 1
        }
    }
    for (const id of removes) {
        targets = targets.filter(target => target.obj.name != id);
    }
}

/**
 * Function that loads the guns 
 * The gun is just an addition to the game
 */
function loadGun() {
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('/models/M4A1/M4A1.mtl', function (materials) {
        materials.preload();
        let loader = new THREE.OBJLoader();
        loader.setMaterials(materials);
        loader.load('/models/M4A1/M4A1.obj', function (object) {
            gun = object;
            gun.scale.set(0.1, 0.1, 0.1);

            gun.position.z = 54
            gun.position.y = 0.5
            // !!!!!!!!!!!!!!!!!!!!!!!
            gun.rotation.y = -gun.rotation.y

            gun.visible = false

            // gun.frustumCulled = false;
            scene.add(gun);
        });
    });
}

/**
 * Function that adds the revers of the scope
 * The reverseScope helps the gun turning by making it more "smooth" 
 */

function addScopeMirror() {
    let targetGeometry = new THREE.CircleGeometry(1, 32);
    let targetMaterial = new THREE.MeshBasicMaterial({
        color: "blue"
    });
    scopeMirror = new THREE.Mesh(targetGeometry, targetMaterial);
    scopeMirror.name = `scopeMirror`
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    scopeMirror.visible = false


    scopeMirror.position.z = 200
    scene.add(scopeMirror);
}

/**
 * Function that add a timer to the system 
 * if the time in the timer = 0 the player loses 
 */

function startGameTimer() {
    // alert('invoked')
    gameStartTimer = window.setTimeout(
        function () {
            countDown--
            stopGameTimer()
        }, 1000);
}
/**
 * Function that stops the timer
 */
function stopGameTimer() {
    if (countDown > 0) {
        clearTimeout(gameStartTimer)
        startGameTimer()
    }
}

/**
 * Function that saves the heights score
 * It changes the previews height score if it has been bitten 
 */
function saveHeightScore() {
    let topScorer = null
    if (JSON.parse(localStorage.getItem("heightScorer"))) {

        let topScorer = JSON.parse(localStorage.getItem("heightScorer"))

        if (topScorer.points < player.points) {
            localStorage.setItem("heightScorer", JSON.stringify(player));
            alert("New Top Scorer")
        }
    } else {
        localStorage.setItem("heightScorer", JSON.stringify(player));
        alert("New Top Scorer")
    }
    JSON.parse(localStorage.getItem("logUser"))
}

//+ -------------------- ESSENTIAL FUNCTIONS