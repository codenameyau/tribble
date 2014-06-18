/*-------JSHint Directives-------*/
/* global THREE, $               */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer, clock;

// Windmill settings
var windmills = [], delta;
var WINDMILL = {
  height: 35,
};


// Camera settings
var CAMERA = {
  fov : 25,
  near : 1,
  far : 10000,
  zoomX : 0,
  zoomY : 0,
  zoomZ : 150,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
  center : new THREE.Vector3(0, WINDMILL.height/1.5, 0),
};


/********************
 * Helper Functions *
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

function degToRad(degrees) {
  return Math.PI/180 * degrees;
}

// Returns geometry of a blade
function bladeGeometry() {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(   0,   15,  0 ));
  geometry.vertices.push(new THREE.Vector3(  -1,  2.5,  0 ));
  geometry.vertices.push(new THREE.Vector3(   1,  2.5,  0 ));
  geometry.vertices.push(new THREE.Vector3(   0,  2.5,  0.5 ));
  geometry.vertices.push(new THREE.Vector3(   0,  2.5, -0.5 ));
  geometry.vertices.push(new THREE.Vector3(-0.3,  0.3,  0 ));
  geometry.vertices.push(new THREE.Vector3( 0.3,  0.3,  0 ));
  geometry.faces.push(new THREE.Face3(3, 0, 1));
  geometry.faces.push(new THREE.Face3(2, 0, 3));
  geometry.faces.push(new THREE.Face3(1, 0, 4));
  geometry.faces.push(new THREE.Face3(4, 0, 2));
  geometry.faces.push(new THREE.Face3(5, 3, 1));
  geometry.faces.push(new THREE.Face3(6, 2, 3));
  geometry.faces.push(new THREE.Face3(6, 3, 5));
  geometry.faces.push(new THREE.Face3(6, 4, 2));
  geometry.faces.push(new THREE.Face3(5, 1, 4));
  geometry.faces.push(new THREE.Face3(5, 4, 6));
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

// Returns three windmill blades as an Object3D
function windmillBladesObject3D(windmillMaterial) {
  var windmillBlades = new THREE.Object3D();
  // Rotating hub
  var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 16);
  var windmillHub = new THREE.Mesh(cylinderGeometry, windmillMaterial);
  windmillHub.rotation.x = degToRad(90);
  windmillBlades.add(windmillHub);
  // Windmill blades
  var windmillBlade = bladeGeometry();
  var rotationAngle = 0;
  for (var i=0; i<3; i++) {
    var blade = new THREE.Mesh(windmillBlade, windmillMaterial);
    blade.rotation.z = degToRad(rotationAngle);
    windmillBlades.add(blade);
    rotationAngle += 120;
  }
  return windmillBlades;
}

// Returns mesh of windmill hub head
function windmillHubMesh(windmillMaterial) {
  var geometry = new THREE.SphereGeometry(1, 16, 16, Math.PI, Math.PI, 0);
  var hubMesh = new THREE.Mesh(geometry, windmillMaterial);
  hubMesh.rotation.x = degToRad(180);
  hubMesh.scale.z = 2;
  hubMesh.position.z = 0.45;
  return hubMesh;
}

// Returns Object3D of windmill generator
function windmillGeneratorObject3D(windmillMaterial) {
  var sphere = new THREE.SphereGeometry(1, 3, 16, Math.PI, Math.PI, 0);
  var body = new THREE.Mesh(sphere, windmillMaterial);
  body.scale.z = 6;
  body.position.z = -0.45;
  return body;
}

// Returns mesh of windmill tower
function windmillTowerMesh(windmillMaterial) {
  var radius = 0.7;
  var cylinder = new THREE.CylinderGeometry(radius, radius+0.5, WINDMILL.height, 16);
  var tower = new THREE.Mesh(cylinder, windmillMaterial);
  tower.position.set(0, -WINDMILL.height/2, -1.5);
  return tower;
}

// Returns mesh of windmill ground base
function windmillGroundMesh(windmillMaterial) {
  var box = new THREE.BoxGeometry(10, 1, 10);
  var base = new THREE.Mesh(box, windmillMaterial);
  base.position.set(0, -WINDMILL.height, -1.5);
  return base;
}

function Windmill() {
  // Create blades
  var newWindmill = new THREE.Object3D();
  var windmillMaterial = new THREE.MeshLambertMaterial( {color: 0xfafafa} );
  var windmillBlades = windmillBladesObject3D( windmillMaterial );
  var windmillHub = windmillHubMesh( windmillMaterial );
  var windmillGenerator = windmillGeneratorObject3D( windmillMaterial );
  var windmillTower = windmillTowerMesh( windmillMaterial );
  var windmillGround = windmillGroundMesh( windmillMaterial );
  newWindmill.add(windmillBlades);
  newWindmill.add(windmillHub);
  newWindmill.add(windmillGenerator);
  newWindmill.add(windmillTower);
  newWindmill.add(windmillGround);
  return newWindmill;
}

/***********************
 * Rendering Functions *
 ***********************/
function rotateWindmillBlades() {
  delta = clock.getDelta();
  for (var i=0; i<windmills.length; i++) {
    windmills[i].children[0].rotation.z -= delta * 1.5;
  }
}

function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  controls.update();
  renderScene();
  rotateWindmillBlades();
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
  var lightAmbient = new THREE.AmbientLight(0x7a7a7a);
  var lightSource = new THREE.DirectionalLight(0x9a9a9a);
  lightSource.position.set(0, 0.4, 0.6);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Clock timeframe
  clock = new THREE.Clock();

  // Starter floor grid
  scene.add(basicFloorGrid(30, 4));

  // Add windmills to scene
  var windmillA = new Windmill();
  windmillA.position.set(0, WINDMILL.height+0.5, 0);
  scene.add(windmillA);
  windmills.push(windmillA);

  var windmillB = new Windmill();
  windmillB.position.set(-20, WINDMILL.height+0.5, 20);
  scene.add(windmillB);
  windmills.push(windmillB);

  var windmillC = new Windmill();
  windmillC.position.set(20, WINDMILL.height+0.5, -20);
  scene.add(windmillC);
  windmills.push(windmillC);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
