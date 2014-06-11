/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/*-------------------------------*/
'use strict';

// Global variables
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var zoomX = 0;
var zoomY = 140;
var zoomZ = 200;

/********************
 * Helper Functions *
 ********************/
var addPillars = function(detail, pillarMaterial, totalPillars, pillarRadius) {
  var height = detail.height || 30;
  var xPosition = detail.xPos || 0;
  var zPosition = detail.zPos || 0;
  totalPillars = totalPillars || 8;
  pillarRadius = pillarRadius || 4;

  var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, height, 32);
  for (var i = 0; i < totalPillars; i++) {
    var pillar = new THREE.Mesh(cylinder, pillarMaterial);
    pillar.position.x = xPosition;
    pillar.position.y = height/2;
    pillar.position.z = zPosition;
    scene.add(pillar);
    xPosition += detail.xSpace;
    zPosition += detail.zSpace;
  }
};

/******************
 * Initialization *
 ******************/
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;

  // Camera position
  var viewDistance = 50;
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 1000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // Orbit controls
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', renderer );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Example grid stage
  var lines = 120, step = 5;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial({color: 'white'});
  for (var i = -lines; i <= lines; i += step) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  var stage = new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
  scene.add(stage);

  // Add pillars
  var countSide = 18;
  var countFace = 8;
  var pillarRadius = 2;
  var spacing = pillarRadius*4;
  var startX = (countFace-1) * pillarRadius * 2;
  var startZ = countSide * pillarRadius * 2;
  var pillarMaterial = new THREE.MeshBasicMaterial({color: 0xFAFAFA, wireframe: true});
  var pillarsFront = {xPos: -startX, xSpace: spacing, zPos: startZ,  zSpace: 0};
  var pillarsBack  = {xPos: -startX, xSpace: spacing, zPos: -startZ, zSpace: 0};
  var pillarsLeft  = {xPos: -startX, xSpace: 0, zPos: -startZ, zSpace: spacing};
  var pillarsright = {xPos:  startX, xSpace: 0, zPos: -startZ, zSpace: spacing};
  addPillars(pillarsFront, pillarMaterial, countFace, pillarRadius);
  addPillars(pillarsBack, pillarMaterial, countFace, pillarRadius);
  addPillars(pillarsLeft, pillarMaterial, countSide, pillarRadius);
  addPillars(pillarsright, pillarMaterial, countSide, pillarRadius);

  // Add floor
  var floorFrontArea = (countFace + 0.5) * spacing;
  var floorSideArea = (countSide + 1.5) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, 2, floorSideArea);
  var solidMaterial = new THREE.MeshBasicMaterial({color: 0xDCDCDC});
  var floorMesh = new THREE.Mesh(floorGeometry, solidMaterial);
  floorMesh.position.y = 0;
  scene.add(floorMesh);

  // Add ceiling
  var ceilingGeometry = new THREE.BoxGeometry(floorFrontArea, 3, floorSideArea);
  var ceilingMesh = new THREE.Mesh(ceilingGeometry, solidMaterial);
  ceilingMesh.position.y = 30;
  scene.add(ceilingMesh);

  // Adding triangularPrism roof
  var roofMaterial = new THREE.MeshBasicMaterial({color: 0xEAEAEA});
  var triangularPrism = calc.TriangularPrism(countFace*4.3, 10, countSide*4.3);
  var roofMesh = new THREE.Mesh(triangularPrism, roofMaterial);
  var wfh = new THREE.WireframeHelper( roofMesh, 0x000000 );
  wfh.position.y = 31;
  scene.add(wfh);
}

// Update animation scene
function updateScene() {
  renderer.render(scene, camera);
}

// Render scene
function renderScene() {
  window.requestAnimationFrame(renderScene);
  updateScene();
  controls.update();
}

// Run Scene
initScene();
renderScene();
