    /* Local */
Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
    /* Flask */
// Physijs.scripts.worker = '/js/physijs_worker.js';
// Physijs.scripts.ammo = '/js/ammo.js';


    /*** Scene ***/
var scene = new Physijs.Scene();

    /*** Renderer ***/
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight - 23);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild(renderer.domElement);

    /*** Textures ***/
var textureLoader = new THREE.TextureLoader();
var textureGrass = textureLoader.load("img/grass.jpg");
textureGrass.anisotropy = 4;    //lower value if the view is too laggy
textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(10, 10);
var textureBall = textureLoader.load("img/ball.png");
textureBall.anisotropy = 3;     //lower value if the view is too laggy
var textureGoalie = textureLoader.load("img/goalie.jpg");
//     //net implementation attempt
// var textureNet = textureLoader.load('img/circuit_pattern.png');
// textureNet.wrapS = textureNet.wrapT = THREE.RepeatWrapping;
// textureNet.anisotropy = 16;



        /**************\
        |*   Camera   *|
        \**************/

    /*** Kicker ***/
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 23), .1, 1000);

camera.position.set(0, 25, 70);
camera.lookAt(new THREE.Vector3(0, 10, 20)); // for starting cam point

// orbit controls for the cam
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.target.set(0, 10, 20); // for orbit cam point
controls.minDistance = 30;
controls.maxDistance = 100;


    /*** Goalie ***/
// var camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 23), .1, 1000);
//
// camera.position.set(0, 25, -70);
// camera.lookAt(new THREE.Vector3(0, 10, -30)) // for starting cam point
//
// //  orbit controls for the cam
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.maxPolarAngle = Math.PI * 0.5;
// controls.target.set(0, 10, -30); // for orbit cam point
// controls.minDistance = 30;
// controls.maxDistance = 60;



        /**************\
        |*   Lights   *|
        \**************/

var ambLight = new THREE.AmbientLight(0xffffff, 0.6);
ambLight.position.set(0, 60, 0);
scene.add(ambLight);
var spotLight = new THREE.SpotLight(0xffffff, 0.7);
spotLight.castShadow = false;
spotLight.position.set(100, 80, 100);
spotLight.shadow.camera.near = 1;
spotLight.shadow.mapSize.width = 3048;
spotLight.shadow.mapSize.height = 3048;
scene.add(spotLight);
var spotLight2 = new THREE.SpotLight(0xffffff, 0.7);
spotLight2.castShadow = true;
spotLight2.position.set(0, 80, 50);
spotLight2.shadow.camera.near = 1;
spotLight2.shadow.mapSize.width = 3048;
spotLight2.shadow.mapSize.height = 3048;
scene.add(spotLight2);

        /*************\
        |*   Scene   *|
        \*************/

    /*** Field ***/
var plane = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0xffffff, map: textureGrass }),
    0
);

plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

ambLight.target = plane;
spotLight.target = plane;
spotLight2.target = plane;


    /*** Goal ***/
var postGeometry = new THREE.CylinderGeometry(.5, .5, 20);
var postMaterial = new THREE.MeshLambertMaterial({ color: 0xbcbaba });
var post1 = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);
var post2 = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);
var crossbar = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);

var goalHeight = 12;
post1.position.set(-10, goalHeight - 10, -40);
post2.position.set(10, goalHeight - 10, -40);
crossbar.position.set(0, goalHeight, -40);
crossbar.rotation.z = -.5 * Math.PI;
post1.castShadow = true;
post2.castShadow = true;
crossbar.castShadow = true;
scene.add(post1);
scene.add(post2);
scene.add(crossbar);


//     /*** Net ***/
// var netMaterial = new THREE.MeshPhongMaterial({
//     specular: 0x030303,
//     map: textureNet,
//     side: THREE.DoubleSide,
//     alphaTest: 0.5
// });

// netGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
// netGeometry.dynamic = true;

// var uniforms = {texture: { value: textureNet}};
// var vertexShader = document.getElementById('vertexShaderDepth').textContent;
// var fragmentShader = document.getElementById('fragmentShaderDepth').textContent;

// netObj = new THREE.Mesh(netGeometry, netMaterial);
// netObj.position.set(0, 7, 0);
// netObj.castShadow = true;
// scene.add(netObj);

// netObj.customDepthMaterial = new THREE.ShaderMaterial({
//     uniforms: uniforms,
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     side: THREE.DoubleSide
// });


    /*** Trigger ***/
var trigger = new THREE.Mesh(
    new THREE.CubeGeometry(18, 20, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
);
trigger.position.set(0, 1, -40);
scene.add(trigger);

var collidableMeshList = [];
collidableMeshList.push(trigger);

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;



        /************\
        |*   Ball   *|
        \************/

    /*** Object ***/
var ball = new Physijs.SphereMesh(
    new THREE.SphereGeometry(2, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0xffffff, map: textureBall })
);
ball.position.set(0, 5.5, 20);
ball.castShadow = true;
scene.add(ball);


    /*** Controls ***/
var clock = new THREE.Clock();
var keyboard = new KeyboardState();

document.addEventListener('keydown', function(event) {
    keyboard.update();

    var moveDistance = 10 * clock.getDelta();

    if (keyboard.pressed("A")) {
        ball.translateX(-moveDistance);
        ball.__dirtyPosition = true;
    }

    if (keyboard.pressed("D")) {
        ball.translateX(moveDistance);
        ball.__dirtyPosition = true;
    }

    if (keyboard.pressed("W")) {
        ball.translateZ(-moveDistance);
        ball.__dirtyPosition = true;
    }

    if (keyboard.pressed("S")) {
        ball.translateZ(moveDistance);
        ball.__dirtyPosition = true;
    }

    controls.update();
    stats.update();

}, false);



        /**************\
        |*   Goalie   *|
        \**************/

    /*** Object ***/
var goalie = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 7, 3),
    new THREE.MeshLambertMaterial({ map: textureGoalie }),
    1000
);
goalie.position.set(0, 4, -35);
goalie.castShadow = true;
scene.add(goalie);


    /*** Controls ***/
var goalieMoving = false;
document.addEventListener('keydown', function(event) {
    if (event.key == "r") {
        goalie.position.set(0, 4, -35);
        goalie.__dirtyPosition = true;
        goalie.rotation.set(0, 0, 0);
        goalie.__dirtyRotation = true;
        goalie.setLinearVelocity({ x: 0, y: 0, z: 0 });
        goalie.setAngularVelocity({ x: 0, y: 0, z: 0 });
    }


    goalieSpeed = 100;
    var goalieLV = goalie.getLinearVelocity()

    if (event.key == "i") {
        goalie.setLinearVelocity(
            goalieLV.add({ x: -goalieLV.x, y: goalieSpeed / 2, z: 0 })
        );
        goalieBlocked = false;

    } else if (!goalieMoving) {
        switch (event.key) {

            case "j":
                if (goalie.position.x < 10) {
                    goalie.setLinearVelocity(
                        goalieLV.add({ x: goalieSpeed, y: 0, z: 0 })
                    );
                    goalieMoving = true;
                }
                break;

            case "l":
            if (goalie.position.x > -10) {
                goalie.setLinearVelocity(
                    goalieLV.add({ x: -goalieSpeed, y: 0, z: 0 })
                );
                goalieMoving = true;
            }
                break;
        }
    }
}, false);
document.addEventListener('keyup', function(event) {
    if (goalieMoving) {
        var goalieLV = goalie.getLinearVelocity()

        switch (event.key) {
            case "j":
            case "l":
                goalie.setLinearVelocity(goalieLV.add({ x: -goalieLV.x, y: 0, z: 0 }));
                goalieMoving = false;
                break;
        }
    }
}, false);

var goalieBlocked = false;



        /*******************\
        |*   Visual Help   *|
        \*******************/

    /*** Axis ***/
var axis = new THREE.AxisHelper(10);
axis.position.set(0, .25, 0);
scene.add(axis);


    /*** Grid ***/
var grid = new THREE.GridHelper(50, 10);
scene.add(grid);



        /*****************\
        |*   Rendering   *|
        \*****************/

function clearText() { document.getElementById('message').innerHTML = '....'; }
function appendText(txt) { document.getElementById('message').innerHTML += txt; }

var render = function() {

    requestAnimationFrame(render);


        /*** Ball ***/
    clearText();

    var originPoint = ball.position.clone();
    for (var vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++) {
        var localVertex = ball.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(ball.matrix);
        var directionVector = globalVertex.sub(ball.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
            appendText(" GOAL! ");
    }


        /*** Goalie ***/
    var goalieLV = goalie.getLinearVelocity()
    if (goalie.position.y > goalHeight - 2 && !goalieBlocked) {
        goalie.setLinearVelocity(
            goalieLV.add({ x: 0, y: -goalieLV.y * 1.2, z: 0 })
        );
        goalieBlocked = true;
    }
    if (goalie.position.x > 10 && goalieLV.x > 1 ||
        goalie.position.x < -10 && goalieLV.x < -1) {
        goalie.setLinearVelocity({ x: 0, y: goalieLV.y, z: 0 });
    }

    //     /*** Net ***/
    // var p = cloth.particles;

    // for(var i = 0, il = p.length; i < il; i ++){
    //     netGeometry.vertices[i].copy(p[i].position);
    // }
    // netGeometry.computeFaceNormals();
    // netGeometry.computeVertexNormals();

    // netGeometry.normalsNeedUpdate = true;
    // netGeometry.verticesNeedUpdate = true;


    scene.simulate();
    renderer.render(scene, camera);
}

render();
