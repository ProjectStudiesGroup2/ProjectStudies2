var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(15, 30, 30);
scene.add(spotLight);
spotLight.shadowCameraNear = 1;
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild(renderer.domElement);

var axis = new THREE.AxisHelper(10);
scene.add (axis);
var grid = new THREE.GridHelper(50, 5);
var color = new THREE.Color("rgb(255,0,0)");
grid.setColors(color, 0x000000);
scene.add (grid);

// var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
// var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
var planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

// 
var image;
var geometry  = new THREE.SphereGeometry(1, 32, 32);
var material  = new THREE.MeshPhongMaterial();
var sphere    = new THREE.Mesh(geometry, material);

material.map  = THREE.ImageUtils.loadTexture('ball.png');
material.bumpScale = 0.05;


plane.rotation.x = -.5*Math.PI;
plane.receiveShadow = true;

scene.add(plane);

sphere .position.x = 2.5;
sphere .position.y = 2.5;
sphere .position.z = 2.5;
sphere .castShadow = true;

scene.add(sphere );

camera.position.x = 30;
camera.position.y = 30;
camera.position.z = 30;

camera.lookAt(scene.position);


var render = function() {

    requestAnimationFrame(render);

    document.addEventListener('keydown', function(event){
    var speed = 0.01;

    if(event.keyCode == 37){
        sphere.position.x -= speed
    }else if(event.keyCode == 39){
        sphere.position.x += speed;
    }else if(event.keyCode == 40){
        sphere.position.z +=speed;
    }else if(event.keyCode == 38){
        sphere.position.z -=speed;
    }

    console.log(sphere.position);
}, false);

    renderer.render(scene, camera);
}
render();


// <<<<<<<<<<<<<<<<<<<<<<<<<<<
// animated scene
// <<<<<<<<<<<<<<<<<<<<<<<<<<<

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); 
//                                                     //aspect ratio; width/height is a good default setup; near clipping frame; far clipping frame
// var light = new THREE.PointLight(0xFFFFFF);

// var geometry = new THREE.BoxGeometry(3, 1, 1);
// var material = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
// var cube = new THREE.Mesh(geometry, material);
// var plane = new THREE.Mesh(geometry, material);
// // var controls;
// var renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);
            
//     scene.add(cube);
//     scene.add(plane);
//     scene.add(light);

//     camera.position.z = 50;

//     plane.position.z = -3;

//     light.position.x = 10;
//     light.position.y = 50;
//     light.position.z = 90;

//     // controls = new THREE.OrbitControls(camera, renderer.domElement);
//     // controls.enableDamping = true;
//     // controls.dampingFactor = 0.25;
//     // controls.enableZoom = false;

// var render = function() {
//     requestAnimationFrame(render);
//     renderer.setClearColor(666666);

//     // controls.update();

//     cube.rotation.x += 0.025;
//     cube.rotation.y += 0.05;

//     renderer.render(scene, camera);
// }
//     render();

// <<<<<<<<<<<<<<<<<<<<<<<
// attemp the improting scene and assets
// <<<<<<<<<<<<<<<<<<<<<<<

// var camera, scene;

// camera = loadScene.camera;
// scene = loadScene.scene;

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// function createLoadScene(){
//     var result = {
//         scene: new THREE.Scene(),
//         camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)

//     };
//     result.camera.position.z = 100;
//     result.scene.add(result.camera);

//     var geometry, material, light

//     material = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
//     geometry = new THREE.BoxGeometry(3, 1, 1);

//     light = new THREE.DirectionalLight( 0xffffff);
//     result.scene.add(light);

//     return result;
// }
// function render(){
//     renderer.render(scene, camera);
// }
// render();