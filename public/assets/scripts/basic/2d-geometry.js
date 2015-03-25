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
  zoomY : 20,
  zoomZ : 40,
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
  lines = lines || 40;
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

function geometryIsoscelesTriangle(base, height) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( 0, height, 0) );
  geometry.faces.push( new THREE.Face3(0, 1, 2) );
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

function geometryEquilateralTriangle(width) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push( new THREE.Vector3(-width, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( width, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( 0, width, 0) );
  geometry.faces.push( new THREE.Face3(0, 1, 2) );
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

function geometryScaleneTriangle(base, sideA, sideB) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
  geometry.vertices.push( new THREE.Vector3( sideA, sideB, 0) );
  geometry.faces.push( new THREE.Face3(0, 1, 2) );
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
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, -100);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Starter floor grid
  scene.add(basicFloorGrid(14, 2));

  // Materials
  var basicMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );

  // Custom triangles
  var equalateralTriangle = geometryEquilateralTriangle(4);
  var triangleA = new THREE.Mesh(equalateralTriangle, basicMaterial);
  triangleA.position.set(0, 0, 12);

  var isoscelesTriangle = geometryIsoscelesTriangle(4, 6);
  var triangleB = new THREE.Mesh(isoscelesTriangle, basicMaterial);
  triangleB.position.set(0, 0, 0);

  var scaleneTriangle = geometryScaleneTriangle(4, -6, 7);
  var triangleC = new THREE.Mesh(scaleneTriangle, basicMaterial);
  triangleC.position.set(0, 0, -12);

  // Add custom objects
  scene.add(triangleA);
  scene.add(triangleB);
  scene.add(triangleC);
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
