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

// Bind renderer to document
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
$('#canvas-body').append(renderer.domElement);

// Create shape
var geometry = new THREE.BoxGeometry(1, 1, 1);
var meshData = {color: 0xffeeae};
var material = new THREE.MeshBasicMaterial(meshData);
var figure = new THREE.Mesh(geometry, material);
scene.add(figure);
camera.position.z = 5;

// Render animation
function animate() {
  window.requestAnimationFrame(animate);
  figure.rotation.x += 0.01;
  figure.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
