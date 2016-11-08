Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
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
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 40;
controls.maxDistance = 50;

//VV for visual help *can be commented out* VV
var axis = new THREE.AxisHelper(100);
axis.position.set(0, .25, 0);
scene.add (axis);
var grid = new THREE.GridHelper(50, 5);
var color = new THREE.Color("rgb(160,160,160)");
grid.setColors(color, 0x000000);
scene.add (grid);
//^^ end ^^

var poleGeometry = new THREE.CylinderGeometry(.5, .5, 20, 32);
var poleMaterial = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
var pole = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var pole2 = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var pole3 = new Physijs.CylinderMesh(poleGeometry, poleMaterial, 0);
var ballGeometry = new THREE.SphereGeometry(1, 12, 12);
var ballMaterial = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
var ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 1);
var planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new Physijs.PlaneMesh(planeGeometry, planeMaterial, 0);

plane.rotation.x = -.5*Math.PI;
plane.receiveShadow = true;
scene.add(plane);

ball.position.set(2.5, 5.5, 2.5);
ball.castShadow = true;
scene.add(ball);

pole.position.set(-10, 0, -40);
scene.add(pole);
pole2.position.set(10, 0, -40);
scene.add(pole2);
pole3.position.set(0, 10, -40);
pole3.rotation.z = -.5*Math.PI;
scene.add(pole3);

camera.position.set( 30, 30, 30);
camera.lookAt(scene.position);

spotLight.target = plane;

var render = function() {
    scene.simulate();
    requestAnimationFrame(render);
// VV can be replaced with better movement VV
    document.addEventListener('keydown', function(event) {
        var speed = 0.01;

    if(event.keyCode == 37){
        ball.position.x -= speed
        ball.__dirtyPosition = true;
    }else if(event.keyCode == 39){
        ball.position.x += speed;
        ball.__dirtyPosition = true;
    }else if(event.keyCode == 40){
        ball.position.z +=speed;
        ball.__dirtyPosition = true;
    }else if(event.keyCode == 38){
        ball.position.z -=speed;
        ball.__dirtyPosition = true;
    }
    console.log(ball.position);
}, false);
// ^^ end ^^

    scene.simulate();
    renderer.render(scene, camera);
}
render();