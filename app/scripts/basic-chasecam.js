/*-------JSHint Directives-------*/
/* global THREE                  */
/* global THREEx                 */
/* global $:false                */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var viewDistance = 50;
var zoomX = 0;
var zoomY = 10;
var zoomZ = 20;
var movingFigure;


/*************************
 * Custom User Functions *
 *************************/
function basicFloorGrid(lines, steps, gridColor) {
  lines = lines || 80;
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

function simpleBox(figureSize, figureColor) {
  figureSize  = figureSize  || 4;
  figureColor = figureColor || 0xCCCCCC;
  var figureGeometry = new THREE.BoxGeometry(figureSize, figureSize, figureSize);
  var figureMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
  var boxFigure = new THREE.Mesh(figureGeometry, figureMaterial);
  boxFigure.position.set(0, figureSize/2, 0);
  return boxFigure;
}

function updateMovingFigure() {
  // Pixels per second
  var pxsPerSec = 20;
  var rotationSteed = 1.5;
  var delta = clock.getDelta();
  var moveDistance = pxsPerSec * delta;
  var rotationAngle = Math.PI / rotationSteed * delta;

  // Basic rotation
  if (keyboard.pressed('w')) {
    movingFigure.translateZ(-moveDistance);
  }
  if (keyboard.pressed('s')) {
    movingFigure.translateZ(moveDistance);
  }
  if (keyboard.pressed('a')) {
    movingFigure.rotation.y += rotationAngle;
  }
  if (keyboard.pressed('d')) {
    movingFigure.rotation.y -= rotationAngle;
  }

  // Adjust chase camera
  camera.position.z = movingFigure.position.z + zoomZ;
}

/********************************
 * Helper Functions Declarations *
 ********************************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  controls.update();
  updateMovingFigure();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderScene();
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

  // Ambient light
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, -100);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Starter floor grid
  scene.add(basicFloorGrid(20, 2));

  // Add Movable Cube
  movingFigure = simpleBox();
  scene.add(movingFigure);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
