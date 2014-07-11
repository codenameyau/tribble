/*-------JSHint Directives-------*/
/* global THREE, $               */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, renderer;
var controls, clock;
var dippyBird;

// Camera settings
var CAMERA = {
  fov : 45,
  near : 1,
  far : 2000,
  zoomX : 0,
  zoomY : 100,
  zoomZ : 120,
};

// OrbitControls settings
var CONTROLS = {
  enabled: true,
  userPan : true,
  userPanSpeed : 1,
  minDistance : 10.0,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

// Renderer settings
var RENDERER = {
  antialias : false,
};


/********************
 * Helper Functions *
 ********************/
function degToRad(degrees) {
  return Math.PI/180 * degrees;
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

function createDippyBird() {
  // Bird parameters
  var figure = new THREE.Object3D();
  var movingFigure = new THREE.Object3D();
  var tubeHeight = 25;
  var headRadius = 4;

  // Define bird head
  var figureHead = new THREE.Object3D();
  var headMaterial = new THREE.MeshLambertMaterial({color: 0xEE1111, transparent: true, opacity: 0.85});
  var eyeMaterial = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
  var irisMaterial = new THREE.MeshLambertMaterial({color: 0x111111});
  var headGeometry = new THREE.SphereGeometry(headRadius, 32, 32);
  var noseGeometry = new THREE.CylinderGeometry(1, 0.3, 5, 32);
  var eyeGeometry = new THREE.CircleGeometry(0.8, 16);
  var irisGeometry = new THREE.CircleGeometry(0.4, 16);
  var birdHead = new THREE.Mesh(headGeometry, headMaterial);
  var birdNose = new THREE.Mesh(noseGeometry, headMaterial);
  var leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  var rightEye = leftEye.clone();
  var leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
  var rightIris = leftIris.clone();

  // Set parameters of head
  birdNose.position.set(0, 0, 6);
  birdNose.rotation.x = degToRad(-90);
  leftEye.position.set(-1.8, 2, 3.5);
  rightEye.position.set(1.8, 2, 3.5);
  leftIris.position.set(-1.8, 2, 3.55);
  rightIris.position.set(1.8, 2, 3.55);
  figureHead.add(birdHead);
  figureHead.add(birdNose);
  figureHead.add(leftEye);
  figureHead.add(rightEye);
  figureHead.add(leftIris);
  figureHead.add(rightIris);

  // Bird hat
  var hatMaterial = new THREE.MeshPhongMaterial({color: 0x1111EE});
  var hatBaseGeometry = new THREE.CylinderGeometry(headRadius+1.5, headRadius+1.5, 0.5, 32);
  var hatTopGeometry = new THREE.CylinderGeometry(headRadius-1, headRadius-0.5, 5, 32);
  var hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
  var hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
  hatBase.position.set(0, headRadius-0.5, 0);
  hatTop.position.set(0, headRadius+2, 0);
  figureHead.add(hatBase);
  figureHead.add(hatTop);
  figureHead.position.set(0, tubeHeight+headRadius-0.5, 0);

  // Tube body
  var figureBody = new THREE.Object3D();
  var tubeMaterial = new THREE.MeshLambertMaterial({color: 0x2255FE, transparent: true, opacity: 0.7});
  var tubeGeometry = new THREE.CylinderGeometry(1.1, 1.1, tubeHeight, 16);
  var bowlGeometry = new THREE.SphereGeometry(3.5, 16, 16);
  var figureTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  var figureBowl = new THREE.Mesh(bowlGeometry, tubeMaterial);
  figureBowl.scale.y = 1.3;
  figureTube.position.set(0, tubeHeight/2, 0);
  figureBody.add(figureTube);
  figureBody.add(figureBowl);

  // Configure moving figure
  movingFigure.position.set(0, 10, 0);
  movingFigure.add(figureHead);
  movingFigure.add(figureBody);

  // Static figure legs
  var staticFigure = new THREE.Object3D();
  var feetHeight = 6;
  var hingeHeight = tubeHeight-1;
  var hingeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
  var legMaterial = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
  var feetMaterial = new THREE.MeshLambertMaterial({color: 0xBB2222});
  var hingeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 14.5, 16);
  var legGeometry = new THREE.BoxGeometry(1, tubeHeight-5, 5);
  var feetGeometry = new THREE.BoxGeometry(1, feetHeight, 12);
  var feetBaseGeometry = new THREE.BoxGeometry(12, 1, 12);
  var figureHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
  var leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  var rightLeg = leftLeg.clone();
  var leftFoot = new THREE.Mesh(feetGeometry, feetMaterial);
  var rightFoot = leftFoot.clone();
  var feetBase = new THREE.Mesh(feetBaseGeometry, feetMaterial);

  // Configure static figure
  figureHinge.rotation.z = degToRad(90);
  figureHinge.position.set(0, hingeHeight, 0);
  leftLeg.position.set(-6, 16, 0);
  rightLeg.position.set(6, 16, 0);
  leftFoot.position.set(-6, feetHeight/2, 3);
  rightFoot.position.set(6, feetHeight/2, 3);
  feetBase.position.set(0, 0.5, 3);
  staticFigure.add(figureHinge);
  staticFigure.add(leftLeg);
  staticFigure.add(rightLeg);
  staticFigure.add(leftFoot);
  staticFigure.add(rightFoot);
  staticFigure.add(feetBase);

  // Bind moving and static figure
  figure.add(movingFigure);
  figure.add(staticFigure);
  figure.position.set(0, 0, -10);
  return figure;
}

/***********************
 * Rendering Functions *
 ***********************/
function renderScene() {
  renderer.render( scene, camera );
}

function updateScene() {
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  updateScene();
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
  renderer = new THREE.WebGLRenderer(RENDERER);
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Light sources
  var frontLight = new THREE.DirectionalLight(0xaaaaaa);
  var sideLight = new THREE.DirectionalLight(0xaaaaaa);
  frontLight.position.set(0, 0.5, 0.5);
  sideLight.position.set(0.5, 0.8, 0);
  scene.add(frontLight);
  scene.add(sideLight);

  // Starter floor grid
  scene.add(basicFloorGrid(80, 8));

  // Dippy bird
  dippyBird = createDippyBird();
  scene.add(dippyBird);
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
