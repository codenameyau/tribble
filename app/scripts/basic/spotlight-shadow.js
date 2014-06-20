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
  far : 3000,
  zoomX : 0,
  zoomY : 60,
  zoomZ : 90,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
  enabled: false,
};

// Spotlight settings
var S1 = {
  visibility: true,
  x: -50,
  y: 80,
  z: 30,
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
  floor.receiveShadow = true;
  return floor;
}

function addSpotLightGUI(spotlight) {
  gui.add(spotlight, 'x').min(-90).max(90).step(1);
  gui.add(spotlight, 'y').min(0).max(200).step(1);
  gui.add(spotlight, 'z').min(-90).max(90).step(1);
  gui.add(spotlight, 'visibility');
}

function updateSpotLight() {
  yellowLight.position.set(S1.x, S1.y, S1.z);
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
  yellowLight = new THREE.SpotLight(0xF0E3B9);
  yellowLight.shadowCameraVisible = S1.visibility;
  yellowLight.castShadow = true;
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.intensity = 2;
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
