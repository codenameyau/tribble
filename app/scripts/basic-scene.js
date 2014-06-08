/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

// Create new canvas scene
var scene  = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(80, canvasWidth/canvasHeight, 0.1, 1000);
camera.position.z = 5;

// Bind renderer to document
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
$('#canvas-body').append(renderer.domElement);

// Create shape
var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
var material = new THREE.MeshNormalMaterial();
var figure = new THREE.Mesh(geometry, material);

// Set position
figure.position.x = 0;
figure.position.y = 0;
figure.position.z = 0;

// Set scale
figure.scale.z = 1.0;
figure.scale.y = 1.0;
figure.scale.x = 1.0;
scene.add(figure);

// Render animation
function renderAnimation() {
  // Angles are in radians
  figure.rotation.x += 0.01;
  figure.rotation.z += 0.01;
}

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  renderAnimation();
}
animate();
