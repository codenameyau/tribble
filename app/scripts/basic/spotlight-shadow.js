/*-------JSHint Directives-------*/
/* global THREE, $, dat          */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer, gui;
var yellowLight;

// Camera settings
var CAMERA = {
  fov : 45,
  near : 1,
  far : 1000,
  zoomX : 0,
  zoomY : 100,
  zoomZ : 150,
};

// OrbitControls settings
var CONTROLS = {
  enabled : true,
  userPan : true,
  userPanSpeed : 1,
  maxDistance : 350.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

// Spotlight settings
var S1 = {
  visibility : true,
  intensity : 2,
  exponent: 5,
  red : 0.9,
  green : 0.9,
  blue : 0.85,
  x : -50,
  y : 120,
  z : 30,
};


/********************
 * Helper Functions *
 ********************/
function basicFloor(width, length, gridColor) {
  width  = width || 20;
  length = length || 20;
  gridColor = gridColor || 0xCC4343;
  var floorPlane = new THREE.PlaneGeometry(width, length);
  var floorMaterial = new THREE.MeshLambertMaterial( {color: gridColor} );
  var floor = new THREE.Mesh(floorPlane, floorMaterial);
  floor.rotation.x -= Math.PI/180 * 90;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  return floor;
}

function addSpotLightGUI(spotlight) {
  gui.add(spotlight, 'x').min(-200).max(200).step(1);
  gui.add(spotlight, 'y').min(50).max(200).step(1);
  gui.add(spotlight, 'z').min(-200).max(200).step(1);
  gui.add(spotlight, 'intensity').min(0).max(10).step(0.1);
  gui.add(spotlight, 'visibility');
}

function updateSpotLight() {
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.distance = S1.distance;
  yellowLight.intensity = S1.intensity;
  yellowLight.intensity = S1.intensity;
  yellowLight.shadowCameraVisible = S1.visibility;
}

/***********************
 * Rendering Functions *
 ***********************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  updateSpotLight();
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

  // Dat gui iteraction
  gui = new dat.GUI({height : 5 * 32 - 1});
  addSpotLightGUI(S1);

  // Starter floor grid
  scene.add(basicFloor(180, 180));

  // Yellow spotlight
  yellowLight = new THREE.SpotLight(new THREE.Color(S1.red, S1.green, S1.blue));
  yellowLight.shadowCameraVisible = S1.visibility;
  yellowLight.castShadow = true;
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.intensity = S1.intensity;
  scene.add(yellowLight);

  // Lamp cover
  var coverMaterial = new THREE.MeshLambertMaterial(
    {color: 0xEDBC61, transparent: true, opacity: 0.70});
  var coverGeometry = new THREE.CylinderGeometry(8, 20, 15, 32, 32);
  var lampCover = new THREE.Mesh(coverGeometry, coverMaterial);
  lampCover.position.set(0, 30, 0);
  lampCover.castShadow = true;
  scene.add(lampCover);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
