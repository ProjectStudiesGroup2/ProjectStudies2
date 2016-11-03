var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); 
                                                    //aspect ratio; width/height is a good default setup; near clipping frame; far clipping frame
var light = new THREE.PointLight(0xFFFFFF);

var geometry = new THREE.BoxGeometry(3, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0x7a0c0c});
var cube = new THREE.Mesh(geometry, material);
var plane = new THREE.Mesh(geometry, material);
// var controls;
var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
            
    scene.add(cube);
    scene.add(plane);
    scene.add(light);

    camera.position.y = -50;

    plane.position.z = -3;

    light.position.x = 10;
    light.position.y = 50;
    light.position.z = 90;

    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = false;

var render = function() {
    requestAnimationFrame(render);
    renderer.setClearColor(666666);

    // controls.update();

    cube.rotation.x += 0.025;
    cube.rotation.y += 0.05;

    renderer.render(scene, camera);
}
    render();