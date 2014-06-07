/*-------JSHint Directives-------*/
/* global THREE                  */
/* global requestAnimationFrame  */
/*-------------------------------*/
'use strict';

// Create new canvas scene
var scene  = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(75, canvasWidth/canvasHeight, 0.1, 1000);

// Bind renderer to document
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);

// Create 3D cube
var geometry = new THREE.CubeGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial(0x23a454);
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;


// Render animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
