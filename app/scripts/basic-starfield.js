/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/* global $:false                */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var viewDistance = 50;
var zoomX = 0;
var zoomY = 50;
var zoomZ = 0;


/********************************
 * Helper Functions Declarations *
 ********************************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  controls.update();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderScene();
}


/****************************
 * Custom THREEJS Functions *
 ****************************/
function basicFloorGrid(lines, steps, gridColor) {
  lines = lines || 20;
  steps = steps || 2;
  gridColor = gridColor || 0xFFFFFF;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  return new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
}

function particleStarField(totalParticles) {
  totalParticles = totalParticles || 200;
  var particles = new THREE.Geometry();
  var material = new THREE.ParticleBasicMaterial({color: 0xFFFFFF, size: 10});
  for (var i = 0; i < totalParticles; i++) {
    var range = 250;
    var px = calc.getRandomNumber(-range, range);
    var py = calc.getRandomNumber(-range, range);
    var pz = calc.getRandomNumber(-range, range);
    particles.vertices.push(new THREE.Vector3(px, py, pz));
  }
  return new THREE.ParticleSystem(particles, material);
}

/************************
 * Scene Initialization *
 ************************/
function initializeScene() {

  // Scene and resize listener
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener( 'resize', resizeWindow, false );

  // Camera and initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 3000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // OrbitControls with mouse
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', renderScene );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Starter floor grid
  scene.add(basicFloorGrid(20, 2));

  // Add particle field
  scene.add(particleStarField(200));

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
