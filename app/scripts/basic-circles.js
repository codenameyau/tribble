/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

// Create scene
var scene  = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseX, mouseY;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(80, canvasWidth/canvasHeight, 0.1, 10000);
var origin = new THREE.Vector3(0, 0, 0);
camera.position.set(0, 0, 1000);
camera.lookAt(origin);

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

// Create a new geometry object (Sphere)
var geometry = new THREE.SphereGeometry(150, 32, 32);
var material = new THREE.MeshLambertMaterial({color: 0xff00ff});
var sphere   = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create second sphere
material = new THREE.MeshLambertMaterial({color: 0xff0000});
sphere = new THREE.Mesh(geometry, material);
sphere.position.x = -325;
sphere.position.y = 100;
sphere.position.z = 325;
scene.add(sphere);

// Create third sphere
material = new THREE.MeshLambertMaterial({color: 0x000ff});
sphere = new THREE.Mesh(geometry, material);
sphere.position.x = 325;
sphere.position.y = -100;
sphere.position.z = -325;
scene.add(sphere);

// Track the mouse position, relative to the middle of the screen
document.addEventListener( 'mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );


function renderAnimation() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);
}

function animate() {
  window.requestAnimationFrame(animate);
  renderAnimation();
}
animate();


