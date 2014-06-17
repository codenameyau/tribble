/*-------JSHint Directives-------*/
/* global THREE                  */
/* global $:false                */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var virtualClock;

// Camera settings
var CAMERA = {
  fov : 50,
  near : 1,
  far : 3000,
  zoomX : 0,
  zoomY : 50,
  zoomZ : 0,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 100.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

var CLOCK = {
  radius : 10,
  height : 2,
}

/********************
 * Custom Functions *
 ********************/
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


/********************
 * Helper Functions *
 ********************/
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

  // OrbitControls with mouse
  controls = new THREE.OrbitControls(camera);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, 0);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Starter floor grid
  scene.add(basicFloorGrid(20, 2));

  // Add Object3D clock
  virtualClock = new THREE.Object3D();
  virtualClock.position.y = CLOCK.height/2;
  scene.add(virtualClock);

  // Clock base
  var cylinderBase = new THREE.CylinderGeometry(CLOCK.radius, CLOCK.radius, 2, 32);
  var baseMaterial = new THREE.MeshLambertMaterial({color: 0xfafafa});
  var clockBody = new THREE.Mesh(cylinderBase, baseMaterial);
  scene.add(clockBody);

  // Clock markers
  var markerGeometry = new THREE.PlaneGeometry(0.2, 1.5);
  var markerMaterial = new THREE.MeshLambertMaterial({color: 0x121212, side: THREE.DoubleSide});
  var rotationAngle = 0;
  for (var i=0; i<4; i++) {
    var clockMarker = new THREE.Mesh(markerGeometry, markerMaterial);
    clockMarker.position.z = - CLOCK.radius+1;
    clockMarker.position.y = 0.1;
    clockMarker.rotation.x = -Math.PI/180 * 90;
    virtualClock.add(clockMarker);
    rotationAngle += 90;
  }
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
