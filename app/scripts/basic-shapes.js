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
var camera = new THREE.PerspectiveCamera(80, canvasWidth/canvasHeight, 0.1, 1000);
var origin = new THREE.Vector3(0, 0, 0);
camera.position.set(0, 0, 100);
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

// Create geometry and materials
var cylinder = new THREE.CylinderGeometry(15, 15, 25, 20);
var box = new THREE.BoxGeometry(25, 25, 25);
var tetrahedron = new THREE.TetrahedronGeometry(20);
var redMaterial = new THREE.MeshLambertMaterial({color: 0xa34554});
var blueMaterial = new THREE.MeshLambertMaterial({color: 0x4a8cb9});
var greenMaterial = new THREE.MeshLambertMaterial({color: 0x4acc69});

// Create red tetrahedron
var firstTetrahedron = new THREE.Mesh(tetrahedron, redMaterial);
firstTetrahedron.position.x = -45;
scene.add(firstTetrahedron);

// Create green box
var firstBox = new THREE.Mesh(box, greenMaterial);
firstBox.position.x = 0;
scene.add(firstBox);

// Create blue cylinder
var firstCylinder = new THREE.Mesh(cylinder, blueMaterial);
firstCylinder.position.x = 45;
scene.add(firstCylinder);


// Track the mouse position, relative to the middle of the screen
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );


function renderAnimation() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);
  firstTetrahedron.rotation.x += 0.01;
  firstTetrahedron.rotation.y += 0.01;
  firstCylinder.rotation.x += 0.01;
  firstCylinder.rotation.y += 0.01;
  firstBox.rotation.x += 0.01;
  firstBox.rotation.y += 0.01;
}

function animate() {
  window.requestAnimationFrame(animate);
  renderAnimation();
}
animate();


