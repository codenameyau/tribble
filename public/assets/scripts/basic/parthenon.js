/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/

// Global variables
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var zoomX = 0;
var zoomY = 20;
var zoomZ = 180;

// Custom settings
var parthenon;
var countSide = 18;
var countFace = 8;
var pillarRadius = 2;
var pillarHeight = 28;
var spacing = pillarRadius*4;

// OrbitControls settings
var CONTROLS = {
  userPan : false,
  userPanSpeed : 0.0,
  maxDistance : 300.0,
  maxPolarAngle : (Math.PI/180) * 80,
};


/********************
 * Helper Functions *
 ********************/

// Custom Geometry: triangular prism
function triangularPrism(width, height, length) {
  // Default sizes
  width  = width  || 8;
  height = height || 8;
  length = length || 10;
  var geometry = new THREE.Geometry();

  // Front triangle
  geometry.vertices.push(new THREE.Vector3(-width, 0, length));
  geometry.vertices.push(new THREE.Vector3(width, 0, length));
  geometry.vertices.push(new THREE.Vector3(0, height, length));
  // Back triangle
  geometry.vertices.push(new THREE.Vector3(-width, 0, -length));
  geometry.vertices.push(new THREE.Vector3(width, 0, -length));
  geometry.vertices.push(new THREE.Vector3(0, height, -length));
  // Connect faces
  geometry.faces.push(new THREE.Face3(2, 0, 1)); // CC: front face
  geometry.faces.push(new THREE.Face3(5, 4, 3)); // CW: back face
  geometry.faces.push(new THREE.Face3(4, 1, 3)); // CC: bottom
  geometry.faces.push(new THREE.Face3(1, 0, 3)); // CC: bottom
  geometry.faces.push(new THREE.Face3(2, 5, 3)); // CC: left side
  geometry.faces.push(new THREE.Face3(2, 3, 0)); // CW: left side
  geometry.faces.push(new THREE.Face3(1, 4, 2)); // CW: right side
  geometry.faces.push(new THREE.Face3(2, 4, 5)); // CC: right side
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

function addPillars(detail, pillarMaterial, totalPillars) {
  var xPosition = detail.xPos || 0;
  var yPosition = detail.yPos || 0;
  var zPosition = detail.zPos || 0;
  totalPillars = totalPillars || 8;

  var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 32);
  for (var i = 0; i < totalPillars; i++) {
    var pillar = new THREE.Mesh(cylinder, pillarMaterial);
    pillar.position.set(xPosition, pillarHeight/2+yPosition-1, zPosition);
    parthenon.add(pillar);
    xPosition += detail.xSpace;
    zPosition += detail.zSpace;
  }
}

function getFloorLayer(frontDist, sideDist, height, materialColor) {
  materialColor = materialColor || 0xB2B2B2;
  var floorFrontArea = (countFace + frontDist) * spacing;
  var floorSideArea = (countSide + sideDist) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, height, floorSideArea);
  var solidMaterial = new THREE.MeshLambertMaterial({color: materialColor});
  return new THREE.Mesh(floorGeometry, solidMaterial);
}

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


/******************
 * Initialization *
 ******************/
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener( 'resize', resizeWindow, false );

  // Camera position
  var fov = 45;
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, 2, 500);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // Orbit controls
  controls = new THREE.OrbitControls( camera );
  for (var key in CONTROLS) {controls[key] = CONTROLS[key];}
  controls.addEventListener( 'change', renderScene );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  scene.add(lightAmbient);
  var lightFront = new THREE.PointLight(0x7c7c7c);
  var lightLeft  = new THREE.PointLight(0x525252);
  var lightRight = new THREE.PointLight(0x525252);
  lightFront.position.set(0, 100, 150);
  lightLeft.position.set(-250, 120, 80);
  lightRight.position.set(250, 120, 80);
  scene.add(lightFront);
  scene.add(lightLeft);
  scene.add(lightRight);

  // Example grid stage
  scene.add(basicFloorGrid(150, 5));

  // Materials and setup
  var concreteMaterial = new THREE.MeshLambertMaterial({color: 0xFAFAFA});
  parthenon = new THREE.Object3D();
  scene.add(parthenon);

  // Add floor layers
  var floorHeight = 2;
  var floorFirstLayer = getFloorLayer(1.3, 2.0, floorHeight);
  floorFirstLayer.position.y = floorHeight/2;
  var floorSecondLayer = getFloorLayer(0.8, 1.5, floorHeight);
  floorSecondLayer.position.y = floorFirstLayer.position.y + floorHeight;
  var floorThirdLayer = getFloorLayer(0.3, 1.0, floorHeight);
  floorThirdLayer.position.y = floorSecondLayer.position.y + floorHeight;
  parthenon.add(floorFirstLayer);
  parthenon.add(floorSecondLayer);
  parthenon.add(floorThirdLayer);

  // Add pillars
  var startX = (countFace-1) * pillarRadius * 2;
  var startY = floorThirdLayer.position.y;
  var startZ = countSide * pillarRadius * 2;
  var pillarsFront = {xPos: -startX, xSpace: spacing, zPos: startZ,  zSpace: 0, yPos: startY};
  var pillarsBack  = {xPos: -startX, xSpace: spacing, zPos: -startZ, zSpace: 0, yPos: startY};
  var pillarsLeft  = {xPos: -startX, xSpace: 0, zPos: -startZ, zSpace: spacing, yPos: startY};
  var pillarsright = {xPos:  startX, xSpace: 0, zPos: -startZ, zSpace: spacing, yPos: startY};
  addPillars(pillarsFront, concreteMaterial, countFace);
  addPillars(pillarsBack, concreteMaterial, countFace);
  addPillars(pillarsLeft, concreteMaterial, countSide);
  addPillars(pillarsright, concreteMaterial, countSide);

  // Add ceiling
  var ceilingHeight = 3;
  var facadeHeight = 6;
  var ceilingLayer = getFloorLayer(0, 1, ceilingHeight, 0xDCDCDC);
  ceilingLayer.position.y = startY+pillarHeight;
  var facadeLayer = getFloorLayer(-0.1, 0.8, facadeHeight, 0xABABAB);
  facadeLayer.position.y = ceilingLayer.position.y + ceilingHeight+1;
  parthenon.add(ceilingLayer);
  parthenon.add(facadeLayer);

  // Adding triangularPrism roof
  var roofHeight = pillarHeight/2.8;
  var roofWidth = pillarRadius*2;
  var roof = triangularPrism(countFace*roofWidth, roofHeight, countSide*roofWidth*1.05);
  var roofMesh = new THREE.Mesh(roof, concreteMaterial);
  roofMesh.position.y = facadeLayer.position.y + (facadeHeight/2);
  parthenon.add(roofMesh);
}


/******************
 * Run Animations *
 ******************/
initScene();
animateScene();
