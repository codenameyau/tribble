/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/*-------------------------------*/
'use strict';

// Global settings
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var zoomX = 0;
var zoomY = 90;
var zoomZ = 250;

// Custom variables
var concreteMaterial = new THREE.MeshLambertMaterial({color: 0xFAFAFA});
var countSide = 18;
var countFace = 8;
var pillarRadius = 2;
var spacing = pillarRadius*4;
var floorHeight = 2;


/********************
 * Helper Functions *
 ********************/
var addPillars = function(detail, pillarMaterial, totalPillars, pillarRadius) {
  var height = detail.height || 30;
  var xPosition = detail.xPos || 0;
  var yPosition = detail.yPos || 0;
  var zPosition = detail.zPos || 0;
  totalPillars = totalPillars || 8;
  pillarRadius = pillarRadius || 4;

  var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, height, 32);
  for (var i = 0; i < totalPillars; i++) {
    var pillar = new THREE.Mesh(cylinder, pillarMaterial);
    pillar.position.set(xPosition, height/2+yPosition-1, zPosition);
    scene.add(pillar);
    xPosition += detail.xSpace;
    zPosition += detail.zSpace;
  }
};

var addFloorLayer = function() {
  var floorFrontArea = (countFace + 1.0) * spacing;
  var floorSideArea = (countSide + 2.0) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, floorHeight, floorSideArea);
  var solidMaterial = new THREE.MeshLambertMaterial({color: 0xDCDCDC});
  var floorMesh = new THREE.Mesh(floorGeometry, solidMaterial);
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
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 3000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // Orbit controls
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', renderer );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x565656);
  scene.add(lightAmbient);
  var lightFront = new THREE.PointLight(0xcccccc);
  lightFront.position.set(0, 30, 120);
  scene.add(lightFront);
  var lightBack = new THREE.PointLight(0xcccccc);
  lightBack.position.set(0, 0, -120);
  scene.add(lightBack);

  // Example grid stage
  var lines = 120, step = 5;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial({color: 0xFAFAFA });
  for (var i = -lines; i <= lines; i += step) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }

  var stage = new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
  scene.add(stage);

  // Add floor
  var floorFrontArea = (countFace + 1.0) * spacing;
  var floorSideArea = (countSide + 2.0) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, floorHeight, floorSideArea);
  var solidMaterial = new THREE.MeshLambertMaterial({color: 0xDCDCDC});
  var floorMesh = new THREE.Mesh(floorGeometry, solidMaterial);
  floorMesh.position.y = floorHeight/2;
  scene.add(floorMesh);

  var floorFrontArea = (countFace + 0.5) * spacing;
  var floorSideArea = (countSide + 1.5) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, floorHeight, floorSideArea);
  var solidMaterial = new THREE.MeshLambertMaterial({color: 0xDCDCDC});
  var floorMesh = new THREE.Mesh(floorGeometry, solidMaterial);
  floorMesh.position.y = floorHeight+1;
  scene.add(floorMesh);

  // Add pillars
  var startX = (countFace-1) * pillarRadius * 2;
  var startZ = countSide * pillarRadius * 2;
  var pillarsFront = {xPos: -startX, xSpace: spacing, zPos: startZ,  zSpace: 0, yPos: floorHeight};
  var pillarsBack  = {xPos: -startX, xSpace: spacing, zPos: -startZ, zSpace: 0, yPos: floorHeight};
  var pillarsLeft  = {xPos: -startX, xSpace: 0, zPos: -startZ, zSpace: spacing, yPos: floorHeight};
  var pillarsright = {xPos:  startX, xSpace: 0, zPos: -startZ, zSpace: spacing, yPos: floorHeight};
  addPillars(pillarsFront, concreteMaterial, countFace, pillarRadius);
  addPillars(pillarsBack, concreteMaterial, countFace, pillarRadius);
  addPillars(pillarsLeft, concreteMaterial, countSide, pillarRadius);
  addPillars(pillarsright, concreteMaterial, countSide, pillarRadius);

  // Add ceiling
  var ceilingGeometry = new THREE.BoxGeometry(floorFrontArea, 3, floorSideArea);
  var ceilingMesh = new THREE.Mesh(ceilingGeometry, solidMaterial);
  ceilingMesh.position.y = 30;
  scene.add(ceilingMesh);

  // Adding triangularPrism roof
  var triangularPrism = calc.TriangularPrism(countFace*4.3, 10, countSide*4.3);
  var roofMesh = new THREE.Mesh(triangularPrism, concreteMaterial);
  roofMesh.position.y = 31;
  scene.add(roofMesh);
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
