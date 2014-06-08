/*-------JSHint Directives-------*/
/* global THREE                  */
/* global THREEx                 */
/*-------------------------------*/
'use strict';

// Create scene
var scene = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseX, mouseY;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(1000, canvasWidth/canvasHeight, 0.1, 2000);
var start = new THREE.Vector3(0, 0, 80);
camera.position.set(0, 0, 80);
camera.lookAt(start);

// WebGLRenderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
$('#canvas-body').append(renderer.domElement);

// Create a new directional light at full intensity
var intensity = 0xffffff;
var light = new THREE.DirectionalLight(intensity);
light.position.set(0, 0, 0).normalize();
scene.add(light);

// Play with the pointlight
var pointLight = new THREE.PointLight(intensity);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

// Create geometry and materials
var cylinder = new THREE.CylinderGeometry(10, 10, 35, 20);
var floor = new THREE.BoxGeometry(60, 20, 20);
var blueMaterial = new THREE.MeshLambertMaterial({color: 0x4a8cb9, wireframe: true});
var greenMaterial = new THREE.MeshLambertMaterial({color: 0x4acc69, wireframe: true});

// Create green box
var buildingCeiling = new THREE.Mesh(floor, greenMaterial);
buildingCeiling.position.x = 0;
scene.add(buildingCeiling);

// Create pillars
var pillarA = new THREE.Mesh(cylinder, blueMaterial);
pillarA.position.x = 45;
pillarA.position.y = 45;
pillarA.position.z = 45;
scene.add(pillarA);

var pillarB = new THREE.Mesh(cylinder, blueMaterial);
pillarB.position.x = -45;
pillarB.position.y = 45;
scene.add(pillarB);

var pillarC = new THREE.Mesh(cylinder, blueMaterial);
pillarC.position.x = -45;
pillarC.position.y = -45;
scene.add(pillarC);

var pillarD = new THREE.Mesh(cylinder, blueMaterial);
pillarD.position.x = 45;
pillarD.position.y = -45;
scene.add(pillarD);

// Track the mouse position, relative to the middle of the screen
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );


function update() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);

}

function animate() {
  window.requestAnimationFrame(animate);
  update();
}
animate();


