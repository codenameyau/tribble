/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/*-------------------------------*/
'use strict';

// Global settings
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var zoomX = 0;
var zoomY = 20;
var zoomZ = 180;

// Custom settings
var countSide = 18;
var countFace = 8;
var pillarRadius = 2;
var pillarHeight = 28;
var spacing = pillarRadius*4;


/********************
 * Helper Functions *
 ********************/
var addPillars = function(detail, pillarMaterial, totalPillars) {
  var xPosition = detail.xPos || 0;
  var yPosition = detail.yPos || 0;
  var zPosition = detail.zPos || 0;
  totalPillars = totalPillars || 8;

  var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 32);
  for (var i = 0; i < totalPillars; i++) {
    var pillar = new THREE.Mesh(cylinder, pillarMaterial);
    pillar.position.set(xPosition, pillarHeight/2+yPosition-1, zPosition);
    scene.add(pillar);
    xPosition += detail.xSpace;
    zPosition += detail.zSpace;
  }
};

var getFloorLayer = function(frontDist, sideDist, height, materialColor) {
  var floorFrontArea = (countFace + frontDist) * spacing;
  var floorSideArea = (countSide + sideDist) * spacing;
  var floorGeometry = new THREE.BoxGeometry(floorFrontArea, height, floorSideArea);
  var solidMaterial = new THREE.MeshLambertMaterial({color: materialColor});
  return new THREE.Mesh(floorGeometry, solidMaterial);
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
  var lines = 150, step = 5;
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

  // Materials and setup
  var concreteMaterial = new THREE.MeshLambertMaterial({color: 0xFAFAFA});

  // Add floor layers
  var floorHeight = 2;
  var floorFirstLayer = getFloorLayer(1.3, 2.0, floorHeight);
  floorFirstLayer.position.y = floorHeight/2;
  var floorSecondLayer = getFloorLayer(0.8, 1.5, floorHeight);
  floorSecondLayer.position.y = floorFirstLayer.position.y + floorHeight;
  var floorThirdLayer = getFloorLayer(0.3, 1.0, floorHeight);
  floorThirdLayer.position.y = floorSecondLayer.position.y + floorHeight;
  scene.add(floorFirstLayer);
  scene.add(floorSecondLayer);
  scene.add(floorThirdLayer);

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
  scene.add(ceilingLayer);
  scene.add(facadeLayer);

  // Adding triangularPrism roof
  var roofHeight = pillarHeight/2.8;
  var roofWidth = pillarRadius*2;
  var triangularPrism = calc.TriangularPrism(countFace*roofWidth, roofHeight, countSide*roofWidth*1.05);
  var roofMesh = new THREE.Mesh(triangularPrism, concreteMaterial);
  roofMesh.position.y = facadeLayer.position.y + (facadeHeight/2);
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
