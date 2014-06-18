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

// Camera settings
var CAMERA = {
  fov : 50,
  near : 1,
  far : 3000,
  zoomX : 0,
  zoomY : 30,
  zoomZ : 50,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 100.0,
  maxPolarAngle : (Math.PI/180) * 80,
};


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

function getBladeGeometry() {
  var geometry = new THREE.Geometry();
  // Top blade front
  geometry.vertices.push(new THREE.Vector3( 0, 15,  0));
  geometry.vertices.push(new THREE.Vector3(-1,  2,  0));
  geometry.vertices.push(new THREE.Vector3( 1,  2,  0));
  geometry.vertices.push(new THREE.Vector3( 0,  2, 0.5));
  geometry.vertices.push(new THREE.Vector3( 0,  2, -0.5));
  geometry.faces.push(new THREE.Face3(3, 0, 1));
  geometry.faces.push(new THREE.Face3(2, 0, 3));
  geometry.faces.push(new THREE.Face3(1, 0, 4));
  geometry.faces.push(new THREE.Face3(4, 0, 2));




  // Compute normals
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
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
  var lightSource = new THREE.DirectionalLight(0x9a9a9a);
  lightSource.position.set(0, 0.4, 0.6);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Starter floor grid
  scene.add(basicFloorGrid(20, 2));

  // Add windmills to scene
  var windmill = new THREE.Object3D();
  scene.add(windmill);

  // Create blades
  var bladeGeometry = getBladeGeometry();
  var windmillMaterial = new THREE.MeshLambertMaterial({color: 0xfafafa});
  var windmillBlade = new THREE.Mesh(bladeGeometry, windmillMaterial);
  windmill.add(windmillBlade);


}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
