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
  zoomY : 80,
  zoomZ : 100,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

// Lamp settings
var LAMP = {
  towerHeight : 40,
  coverHeight : 15,
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
  var yellowLight = new THREE.SpotLight(0xF0E3B9);
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.shadowCameraVisible = true;
  yellowLight.shadowDarkness = 0.95;
  yellowLight.castShadow = true;
  yellowLight.intensity = 2;
  scene.add(yellowLight);

  // Lamp light source
  var lampLight = new THREE.PointLight(0xFFFFFF);
  lampLight.position.set(0, LAMP.towerHeight, 0);
  scene.add(lampLight);

  // Starter floor grid
  scene.add(basicFloor(100, 100));

  // Lamp cover
  var coverMaterial = new THREE.MeshLambertMaterial(
    {color: 0xEDBC61, transparent: true, opacity: 0.8});
  var coverGeometry = new THREE.CylinderGeometry(8, 20, LAMP.coverHeight, 16, 16);
  var lampCover = new THREE.Mesh(coverGeometry, coverMaterial);
  lampCover.position.set(0, LAMP.towerHeight, 0);
  lampCover.castShadow = true;
  scene.add(lampCover);

  // Lamp tower
  var towerMaterial = new THREE.MeshLambertMaterial({color: 0x736540});
  var towerGeometry = new THREE.CylinderGeometry(2, 2, LAMP.towerHeight + LAMP.coverHeight);
  var lampTower = new THREE.Mesh(towerGeometry, towerMaterial);
  lampTower.position.set(0, LAMP.towerHeight/2, 0);
  lampTower.castShadow = true;
  scene.add(lampTower);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
