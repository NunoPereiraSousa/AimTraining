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
// objects

// level
let level = 1
// level 

// targets speed 
let speed = {
    min: 0.01,
    max: 0.02,
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
    maxLevel: level
}
let bulletText = document.createElement('p');

// player


// three
let trees = []
// three


//  timer
let timer = null
let display = 0
//  timer



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

// Score
let score = 0;
let textScore = document.createElement('p');
// Score

window.addEventListener("mousedown", bonusScore, false);

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
    createCivil()
    createHouse();
    textStyle();

    display = 30

    startTimer()
    animate();
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

//+ -------------------- ESSENTIAL FUNCTIONS

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, true);
    player.shot -= 1
}

function animate() {
    headShot();
    ballMove();
    levelUp();
    updateSensivity();
    textScore.innerHTML = `Score: ${score}`;
    bulletText.innerHTML = `Bullets: ${player.shot}`;

    renderer.render(scene, camera)

    if (stopLoop == false) {
        requestAnimationFrame(animate)
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
    // console.log(score);
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
    // civilCount -= (1 * level)
    // ballCount -= (1 * level)

}
// Todo 
function bonusScore(event) {
    countTarget()



    if (event.timeStamp < 3000 * level && ballCount - 1 === 0) {
        score += 10
    }
}
document.body.addEventListener("mousedown", onMouseClick);

let ballVel = 0.01;

function ballMove() {
    for (const target of targets) {
        if (target.obj.position.x >= 20 || target.obj.position.x <= -20) {
            target.vel = -target.vel
        }
        target.obj.position.x += target.vel;
    }
}

function updateSensivity() {
    let y = mouse.y * 100;
    mouse.y += (y - mouse.y + 100) * 0.06;
    mouse.z = (y - mouse.y + 100) * 0.01;
    console.log(mouse.y);
    
    // plane.position.x = targetX;
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


// Todo <
/**
 * *Create hostiles
 */
function createObstacles() {
    for (let i = 0; i < 2 * level; i++) {
        let dir = Math.random() * (1 - (-1)) + -1, //!directions
            head = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: 0xffff00
                }));
        head.name = `head${i + 1}`
        positionX = Math.floor(Math.random() * (40)) - 20;
        positionZ = Math.floor(Math.random() * (20 + 2)) - 5;
        head.position.set(positionX, 3, positionZ);
        targets.push({
            obj: head,
            vel: (Math.random() * (speed.max - speed.min) + speed.min) * dir,
            objType: "hostile",
        })
    }

    for (const target of targets) {
        scene.add(target.obj);
    }
}

/**
 * * function that create civilians
 */
function createCivil() {

    for (let i = 0; i < 2; i++) {
        let dir = Math.random() * (1 - (-1)) + -1,
            civil = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: "blue"
                }));
        civil.name = `civil${i + 1}`
        positionX = Math.floor(Math.random() * (40)) - 20;
        positionZ = Math.floor(Math.random() * (20 + 2)) - 5;
        civil.position.set(positionX, 3, positionZ);
        targets.push({
            obj: civil,
            vel: 0.02 * dir,
            objType: "civil",
            // dead: false
        })
    }

    for (const civil of targets) {
        scene.add(civil.obj);
    }
}
// Todo >

function createTree(i) {
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
    tree.name = `tree`



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
    // alert('invoked')
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
    display += (5 + level)
}