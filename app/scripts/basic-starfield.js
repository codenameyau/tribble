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
var starSystem;

/********************************
 * Helper Functions Declarations *
 ********************************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  // starSystem.rotation.y += 0.001;
  controls.update();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderScene();
}


/****************************
 * Custom THREEJS Functions *
 ****************************/
function particleStarField(totalParticles) {
  totalParticles = totalParticles || 200;
  var particles = new THREE.Geometry();
  var texture = THREE.ImageUtils.loadTexture('images/texture/pstar.jpg');
  var material = new THREE.ParticleBasicMaterial(
    {color: 0xFFFFFF, size: 5, map: texture, blending: THREE.AdditiveBlending, transparent: true});

  // Add particles vectors
  for (var i = 0; i < totalParticles; i++) {
    var range = 250;
    var px = calc.getRandomNumber(-range, range);
    var py = calc.getRandomNumber(-range, range);
    var pz = calc.getRandomNumber(-range, range);
    particles.vertices.push(new THREE.Vector3(px, py, pz));
  }
  var starSystem = new THREE.ParticleSystem(particles, material);
  starSystem.sortParticles = true;
  return starSystem;
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
  starSystem = particleStarField(500);
  scene.add(starSystem);

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
