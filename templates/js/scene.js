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

var keyboard = new KeyboardState();
var clock = new THREE.Clock();

var loader = new THREE.TGALoader();

// FLOOR
var img = new Image();
img.crossOrigin = "anonymous";
img.src = "img/grass.jpg"; 
var floorTexture = new THREE.ImageUtils.loadTexture( img );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
// SKYBOX/FOG
var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
// scene.add(skyBox);
scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

//moving of a camera
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 6;

var planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

THREE.ImageUtils.crossOrigin = '';

// ball creation and texturing
var sphere_texture, loader;
var texture = loader.load( 'ball.png' );
var geometry  = new THREE.SphereGeometry(3, 32, 32);

// sphere_texture = new THREE.Texture();
// loader = new THREE.ImageLoader();

// loader.addEventListener('load', function (event){
//     sphere_texture.image = event.content;
//     sphere_texture.needsUpdate = true;
// });

// loader.load('ball.png');

var material  = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('ball1.jpg') } );
// var sphere_material = new THREE.MeshBasicMaterial({map: sphere_texture, overdraw: true});
var sphere    = new THREE.Mesh(geometry, material);

scene.add(sphere );

//material.map  = THREE.ImageUtils.loadTexture('ball.png');
//material.bumpScale = 0.05;

plane.rotation.x = -.5*Math.PI;
plane.receiveShadow = true;

scene.add(plane);

sphere.position.x = 0;
sphere.position.y = 3;
sphere.position.z = 0;
sphere.castShadow = true;



camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 10, 2000 );
camera.position.x = 70;
camera.position.y = 30;
camera.position.z = 0;

camera.lookAt(scene.position);

// function onDocumentMouseMove( event ) {
// 	mouseX = ( event.clientX - windowHalfX );
// 	mouseY = ( event.clientY - windowHalfY );
// }

var render = function() {

    requestAnimationFrame(render);

    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    document.addEventListener('keydown', function(event){   
        // var speed = 0.01; 

        // if(event.keyCode == 37){
        //     sphere.position.x -= speed
        // }else if(event.keyCode == 39){
        //     sphere.position.x += speed;
        // }else if(event.keyCode == 40){
        //     sphere.position.z +=speed;
        // }else if(event.keyCode == 38){
        //     sphere.position.z -=speed;
        // }
    keyboard.update();

	var moveDistance = 5 * clock.getDelta(); 

	if ( keyboard.pressed("W") )
		sphere.translateX( -moveDistance );
		
	if ( keyboard.pressed("S") )
		sphere.translateX(  moveDistance );
    
    if ( keyboard.pressed("D") )
		sphere.translateZ(  -moveDistance );
    
    if ( keyboard.pressed("A") )
		sphere.translateZ(  moveDistance );        
    }, false);

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y = THREE.Math.clamp( camera.position.y + ( - ( mouseY - 20 ) - camera.position.y ) * .05, 50, 1000 );
	// camera.lookAt( scene.position );

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