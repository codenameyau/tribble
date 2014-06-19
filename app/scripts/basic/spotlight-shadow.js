/*-------JSHint Directives-------*/
/* global THREE, $               */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var cube;

// Camera settings
var CAMERA = {
  fov : 45,
  near : 1,
  far : 3000,
  zoomX : 0,
  zoomY : 20,
  zoomZ : 40,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
};


/********************
 * Helper Functions *
 ********************/
function basicFloor(width, length, gridColor) {
  width  = width || 20;
  length = length || 20;
  gridColor = gridColor || 0xA95555;
  var floorPlane = new THREE.PlaneGeometry(width, length);
  var floorMaterial = new THREE.MeshLambertMaterial( {color: gridColor} );
  var floor = new THREE.Mesh(floorPlane, floorMaterial);
  floor.rotation.x -= Math.PI/180 * 90;
  floor.position.set(0, 0, 0);
  return floor;
}


/***********************
 * Rendering Functions *
 ***********************/
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


/************************
 * Scene Initialization *
 ************************/
function initializeScene() {

  // Scene and resize listener
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener('resize', resizeWindow, false);

  // Camera and initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera(CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far);
  camera.position.set(CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ);
  scene.add(camera);

  // OrbitControls with mouse
  controls = new THREE.OrbitControls(camera);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.shadowMapEnabled = true;
  $(containerID).append(renderer.domElement);

  // Light sources
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, 80);
  scene.add(lightSource);

  // Starter floor grid
  scene.add(basicFloor(20, 20));

  // Basic cube
  var material = new THREE.MeshLambertMaterial();
  var boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  cube = new THREE.Mesh(boxGeometry, material);
  cube.position.set(0, 1, 0);
  scene.add(cube);
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
