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



        /**************\
        |*   Camera   *|
        \**************/

    /*** Kicker ***/
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 23), .1, 1000);

camera.position.set(30, 30, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0)); // for starting cam point

// orbit controls for the cam
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.target.set(0, 0, 0); // for orbit cam point
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

var spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.castShadow = true;
spotLight.position.set(15, 50, 30);
scene.add(spotLight);
spotLight.shadow.camera.near = 1;



        /*************\
        |*   Scene   *|
        \*************/

    /*** Field ***/
var plane = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    0
);

plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

spotLight.target = plane;


    /*** Goal ***/
var postGeometry = new THREE.CylinderGeometry(.5, .5, 20);
var postMaterial = new THREE.MeshLambertMaterial({ color: 0x7a0c0c });
var post1 = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);
var post2 = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);
var crossbar = new Physijs.CylinderMesh(postGeometry, postMaterial, 0);

var goalHeight = 12;
post1.position.set(-10, goalHeight - 10, -40);
post2.position.set(10, goalHeight - 10, -40);
crossbar.position.set(0, goalHeight, -40);
crossbar.rotation.z = -.5 * Math.PI;
scene.add(post1);
scene.add(post2);
scene.add(crossbar);


    /*** Trigger ***/
var trigger = new THREE.Mesh(
    new THREE.CubeGeometry(18, 20, 0.2), 
    new THREE.MeshBasicMaterial({ wireframe: true, visible: false }) 
);
trigger.position.set(0, 1, -40.2);
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
    new THREE.MeshLambertMaterial({ color: 0x7a0c0c })
);
ball.position.set(0, 5.5, 0);
ball.castShadow = true;
scene.add(ball);


    /*** Controls ***/
var ballMoving = false;

//Setting timeout to give a various strangth of the kick
var lastKeyUpAt = 0;
var ballSpeed = 0;
var ballVertAngle = 0;
var space = " ";        

document.addEventListener('keydown', function(event) {    
    var ballLV = ball.getLinearVelocity()

    if (event.key == space) {
        if (lastKeyUpAt >= 50) {
            lastKeyUpAt = 0;    
            return lastKeyUpAt;
        }  
        ballBlocked = false;
        var ballLV = ball.getLinearVelocity();    
        setTimeout(function() {                
            lastKeyUpAt ++;  
        });        
    }
    else if (!goalieMoving || event.key == "w") {
        switch (event.key) {            
            case "w":
                ball.setLinearVelocity(
                    ballLV.add({ z: -ballSpeed, x: 0, y: ballVertAngle })
                );
                ballMoving = true;
                break;
        }    
        ballSpeed = 0;
        ballVertAngle = 0;
    }    
    console.log( "lastKeyUpAt = " + lastKeyUpAt );
    return ballSpeed, ballVertAngle;
}, false);

document.addEventListener('keyup', function(event) {
    if (event.key == space) {
        var ballLV = ball.getLinearVelocity()
       
        if (lastKeyUpAt >= 40) {
            ballSpeed = 5;          
        } 
        else if (lastKeyUpAt >= 35) {
            ballSpeed = 10;        
        } 
        else if (lastKeyUpAt >= 30) {
            
            ballSpeed = 25;  
            ballVertAngle = 3;        
        } 
        else if (lastKeyUpAt >= 27) {

            ballSpeed = 40; 
            ballVertAngle = 3;
        }   
        else if (lastKeyUpAt >= 20) {
            ballSpeed = 50; 
            ballVertAngle = 10;
        }   
        else if (lastKeyUpAt >= 16) {
            ballSpeed = 40; 
            ballVertAngle = 7;
        }   
        else if (lastKeyUpAt >= 12) {
            ballSpeed = 30; 
            ballVertAngle = 5;
        }  
        else if (lastKeyUpAt >= 5) {
            ballSpeed = 20; 
            ballVertAngle = 3;
        }  
        else if (lastKeyUpAt >= 1) {
            ballSpeed = 10; 
        }  
        else if (lastKeyUpAt >= 0) {
            ballSpeed = 5;             
        }    

        switch (event.key) {
            case space:
                lastKeyUpAt = 0; 
                console.log( "Ball speed = " + ballSpeed + "; VertAngle = " + ballVertAngle );  
                ballMoving = false;
        }    
        return ballSpeed, ballVertAngle;
    }

    if ( event.key == "w" || !ballMoving ) {
        var ballLV = ball.getLinearVelocity();
        ball.setLinearVelocity(
        ballLV.add({ z: -ballLV.x, x: 0, y: ballVertAngle })
        );        
        ballSpeed = 0;
        ballVertAngle = 0;
        ballMoving = true;        
    }
   
     
}, false);

var ballBlocked = false;



        /**************\
        |*   Goalie   *|
        \**************/

    /*** Object ***/
var goalie = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 7, 3),
    new THREE.MeshBasicMaterial({ color: 0x307460 })
);
goalie.position.set(0, 4, -35);
goalie.castShadow = true;
scene.add(goalie);


    /*** Controls ***/
var goalieMoving = false;
document.addEventListener('keydown', function(event) {
    goalieBlocked = false;
    goalieSpeed = 100;
    var goalieLV = goalie.getLinearVelocity()

    if (event.key == "i") {
        goalie.setLinearVelocity(
            goalieLV.add({ x: -goalieLV.x, y: goalieSpeed / 2, z: 0 })
        );

    } else if (!goalieMoving) {
        switch (event.key) {

            case "j":
                goalie.setLinearVelocity(
                    goalieLV.add({ x: goalieSpeed, y: 0, z: 0 })
                );
                goalieMoving = true;
                break;

            case "l":
                goalie.setLinearVelocity(
                    goalieLV.add({ x: -goalieSpeed, y: 0, z: 0 })
                );
                goalieMoving = true;
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

function clearText() { document.getElementById('message').innerHTML = ''; }
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
    if (goalie.position.y > goalHeight && !goalieBlocked) {
        goalie.setLinearVelocity(
            goalieLV.add({ x: 0, y: -goalieLV.y * 1.2, z: 0 })
        );
        goalieBlocked = true;
    }
    if (goalie.position.x > 10 && goalieLV.x > 1 ||
        goalie.position.x < -10 && goalieLV.x < -1) {
        goalie.setLinearVelocity(
            goalieLV.add({ x: -goalieLV.x, y: 0, z: 0 })
        );
    }


    scene.simulate();
    renderer.render(scene, camera);
}

render();
