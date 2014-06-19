/*-------JSHint Directives-------*/
/* global THREE, $               */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;

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
  floor.receiveShadow = true;
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

  // Yellow spotlight
  var S1 = {x: -50, y: 80, z: 30};
  var yellowLight = new THREE.SpotLight(0xFFFF00);
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.shadowCameraVisible = true;
  yellowLight.shadowDarkness = 0.95;
  yellowLight.castShadow = true;
  scene.add(yellowLight);

  // Starter floor grid
  scene.add(basicFloor(100, 100));

  // Lamp cover
  var coverMaterial = new THREE.MeshLambertMaterial({alpha: true, transparent: true, wireframe: true});
  var coverGeometry = new THREE.CylinderGeometry(10, 20, 14, 16, 16);
  var cylinder = new THREE.Mesh(coverGeometry, coverMaterial);
  cylinder.position.set(0, 20, 20);
  cylinder.castShadow = true;
  scene.add(cylinder);

  // Lamp tower
  var towerMaterial = new THREE.MeshLambertMaterial({color: 0x736540});
  var towerGeometry = new THREE.CylinderGeometry(2, 2, 8);
  var cube = new THREE.Mesh(towerGeometry, towerMaterial);
  cube.position.set(0, 20, 20);
  cube.castShadow = true;
  scene.add(cube);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
