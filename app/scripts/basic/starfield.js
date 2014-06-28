/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/* global $:false                */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var viewDistance = 50;
var zoomX = 10;
var zoomY = 10;
var zoomZ = 300;
var starFields = [];


/****************************
 * Custom THREEJS Functions *
 ****************************/
function particleStarField(totalParticles, texture, scale) {
  totalParticles = totalParticles || 200;
  scale = scale || 8;
  var particles = new THREE.Geometry();
  var material = new THREE.ParticleBasicMaterial(
    {size: scale, map: texture, blending: THREE.AdditiveBlending, transparent: true});

  // Add particles vectors
  for (var i = 0; i < totalParticles; i++) {
    var sideRange = 500;
    var heightRange = 200;
    var px = calc.getRandomNumber(-sideRange, sideRange);
    var py = calc.getRandomNumber(-heightRange, heightRange);
    var pz = calc.getRandomNumber(-sideRange, sideRange);
    particles.vertices.push(new THREE.Vector3(px, py, pz));
  }
  return new THREE.ParticleSystem(particles, material);
}

function rotateStarfields() {
  for (var i=0; i<starFields.length; i++) {
    starFields[i].rotation.y += 0.0035;
    starFields[i].rotation.x += 0.0045;
  }
}


/********************************
 * Helper Functions Declarations *
 ********************************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  rotateStarfields();
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
  window.addEventListener( 'resize', resizeWindow, false );

  // Camera and initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 3000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // OrbitControls with mouse
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', renderScene );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Add particle field
  var yellowStar = THREE.ImageUtils.loadTexture('images/texture/f-star.png');
  var redStar = THREE.ImageUtils.loadTexture('images/texture/m-star.png');
  var whiteStar = THREE.ImageUtils.loadTexture('images/texture/a-star.png');
  starFields.push(particleStarField(3000, whiteStar, 2));
  starFields.push(particleStarField(400, redStar, 3));
  starFields.push(particleStarField(100, redStar, 5));
  starFields.push(particleStarField(600, yellowStar, 3));
  starFields.push(particleStarField(200, yellowStar, 5));
  starFields.push(particleStarField(30, yellowStar, 8));
  for (var i=0; i<starFields.length; i++) {
    scene.add(starFields[i]);
  }
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
