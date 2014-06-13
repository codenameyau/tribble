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

var PATHS = {
  texture : 'images/texture/',
};

// World settings
var WORLD = {
  width: 2000,
  height: 2000,
  widthSegments: 250,
  heightSegments: 250,
  depth: 1500,
  param: 4,
  filterparam: 1
};

// Camera settings
var CAMERA = {
  fov : 55,
  near : 1,
  far : 3000,
  zoomX : 0,
  zoomY : 500,
  zoomZ : 50,
};

// OrbitControls settings
var CONTROLS = {
  userPan : true,
  userPanSpeed : 0.5,
  maxDistance : 10000.0,
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

  // Starter floor grid
  scene.add(basicFloorGrid(20, 2));

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var sunLight = new THREE.DirectionalLight( 0xffff55, 1 );
  sunLight.position.set(- 1, 0.4, -1);
  scene.add(lightAmbient);
  scene.add(sunLight);

  // Water demo
  var waterNormals = new THREE.ImageUtils.loadTexture(PATHS.texture + 'waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  var ocean = new THREE.Water(renderer, camera, scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha:  1.0,
    sunDirection: sunLight.position.normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0,
  });
  var oceanPlane = new THREE.PlaneGeometry(WORLD.width*500, WORLD.height*500, 50, 50);
  var mirrorMesh = new THREE.Mesh(oceanPlane, ocean.material);
  mirrorMesh.add(ocean);
  scene.add(mirrorMesh);
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
