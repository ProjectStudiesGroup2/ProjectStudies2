Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
// // uncomment for use with flask
// Physijs.scripts.worker = '/js/physijs_worker.js';
// Physijs.scripts.ammo = '/js/ammo.js';

var scene = new Physijs.Scene();
// cam for the kicker
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
// cam for the goalee
var camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
var spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.castShadow = true;
spotLight.position.set(15, 50, 30);
scene.add(spotLight);
spotLight.shadowCameraNear = 1;
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild(renderer.domElement);
// orbit controls for the kicker cam
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.target.set(0, 0, 0); // for orbit cam point
controls.minDistance = 30;
controls.maxDistance = 100;
//  orbit controls for the goalee cam
var controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
controls2.maxPolarAngle = Math.PI * 0.5;
controls2.target.set(0, 10, -30); // for orbit cam point
controls2.minDistance = 30;
controls2.maxDistance = 60;

var stats;

// STATS
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;

//VV for visual help *can be commented out* VV
var axis = new THREE.AxisHelper(100);
axis.position.set(0, .25, 0);
scene.add(axis);
var grid = new THREE.GridHelper(50, 5);
var color = new THREE.Color("rgb(160,160,160)");
grid.setColors(color, 0x000000);
scene.add(grid);
//^^ end ^^

var keyboard = new KeyboardState();
var clock = new THREE.Clock();

var poleGeometry = new THREE.CylinderGeometry(.5, .5, 20, 32);
var poleMaterial = new THREE.MeshLambertMaterial({ color: 0x7a0c0c });
var pole = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var pole2 = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var pole3 = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var ballGeometry = new THREE.SphereGeometry(2, 12, 12);
var ballMaterial = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
var ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 1);
var planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new Physijs.BoxMesh(planeGeometry, planeMaterial, 0);

plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

var wallGeometry = new THREE.CubeGeometry( 18, 20, 0.1, 1, 1, 1 );
var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe:true} );
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
	
var collidableMeshList = [];
var wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(0, 1, -40);
scene.add(wall);
collidableMeshList.push(wall);
var wall = new THREE.Mesh(wallGeometry, wireMaterial);
wall.position.set(0, 1, -40);
scene.add(wall);

ball.position.set(0, 5.5, 0);
ball.castShadow = true;
scene.add(ball);

pole.position.set(-10, 2, -40);
scene.add(pole);
pole2.position.set(10, 2, -40);
scene.add(pole2);
pole3.position.set(0, 12, -40);
pole3.rotation.z = -.5*Math.PI;
scene.add(pole3);

camera.position.set(30, 30, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0)); // for starting cam point
camera2.position.set(0, 25, -70);
camera2.lookAt(new THREE.Vector3(0, 10, -30)) // for starting cam point

spotLight.target = plane;

// -> Goalie
var goalie = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 7, 3),
    new THREE.MeshBasicMaterial({ color: 0x307460 })
);
goalie.position.set(0, 4, -35);
goalie.castShadow = goalie.receiveShadow = true;
scene.add(goalie);

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
            case "j": case "l":
                goalie.setLinearVelocity(goalieLV.add({
                    x: -goalieLV.x,
                    y: 0,
                    z: 0
                }));
                goalieMoving = false;
                break;
        }
    }
}, false);
// Goalie <-

var goalieBlocked = false;

function clearText()
{   document.getElementById('message').innerHTML = '....';   }

function appendText(txt)
{   document.getElementById('message').innerHTML += txt;   }

document.addEventListener('keydown', function(event) {
    keyboard.update();

	var moveDistance = 10 * clock.getDelta(); 

	if ( keyboard.pressed("A") )
		ball.translateX( -moveDistance);
        ball.__dirtyPosition = true; 
		
	if ( keyboard.pressed("D") )
		ball.translateX(  moveDistance );
        ball.__dirtyPosition = true; 
    
    if ( keyboard.pressed("W") )
		ball.translateZ(  -moveDistance );
        ball.__dirtyPosition = true; 
    
    if ( keyboard.pressed("S") )
		ball.translateZ(  moveDistance );  
        ball.__dirtyPosition = true; 

    controls.update();
	stats.update();

}, false);


var render = function() {
    clearText();
    scene.simulate();
    requestAnimationFrame(render);


    // -> Goalie
    var goalieLV = goalie.getLinearVelocity()
    if (goalie.position.y > goalie.geometry.parameters.height && !goalieBlocked) {
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
    // Goalie <-
    

    var originPoint = ball.position.clone();	
	
	for (var vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++)
	{		
		var localVertex = ball.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( ball.matrix );
		var directionVector = globalVertex.sub( ball.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			appendText(" GOAL! ");
	}

    scene.simulate();
    // render from kicker cam *comment out for kicker persp*
    renderer.render(scene, camera);
    // // render from goalee cam *comment out for goalee persp*
    // renderer.render(scene, camera2);
}
render();
