/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

var divId = '#canvas-body';
var scene, camera, renderer;

// Initialization
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;

  // Camera position
  var viewDistance = 50;
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 5000);
  camera.position.set(0, 50, 0);
  camera.lookAt(lookAtCoords);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(divId).append(renderer.domElement);

  // Example shape (delete sample)
  var lines = 20, step = 2;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial({color: 'white'});
  for (var i = -lines; i <= lines; i += step) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }

  var stage = new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
  scene.add(stage);

}

// Update scene
function updateScene() {
  renderer.render(scene, camera);
}

// Animate scene
function animateScene() {
  window.requestAnimationFrame(animateScene);
  updateScene();
}

// Run Scene
initScene();
animateScene();
