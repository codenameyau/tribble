/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

var scene, camera, renderer;

// Initialization
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;

  // Camera
  var viewAngle = 45;
  var aspectRatio  = canvasWidth/canvasHeight;
  var origin = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, 0.01, 5000);
  camera.position.z = 5;
  camera.lookAt(origin);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $('#canvas-body').append(renderer.domElement);

}

function updateScene() {
  renderer.render(scene, camera);
}

function animateScene() {
  window.requestAnimationFrame(animateScene);
  updateScene();
}

// Run Scene
initScene();
animateScene();

