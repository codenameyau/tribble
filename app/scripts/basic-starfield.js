/*-------JSHint Directives-------*/
/* global THREE                  */
/* global calc                   */
/*-------------------------------*/
'use strict';

// Global variables
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var zoomX = 0;
var zoomY = 0;
var zoomZ = 1000;
var updateSpeed = 30;
var particleSpeed = 20;

// Starfield settings
var mouseX = 0, mouseY = 0;

// Initialization
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;

  // Camera position
  var viewDistance = 80;
  var aspectRatio  = canvasWidth/canvasHeight;
  var lookAtCoords = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 1, 4000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // Orbit controls
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', renderer );

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // create the particle variables
  var particleCount = 100;
  var particles = new THREE.Geometry();
  var pMaterial = new THREE.ParticleSystemMaterial({color: 0xFFFFFF,size: 2});

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {
    // create a particle at random position
    var pX = Math.random() * 500 - 250;
    var pY = Math.random() * 500 - 250;
    var pZ = Math.random() * 500 - 250;
    particles.vertices.push(new THREE.Vector3(pX, pY, pZ));
  }

  // create the particle system
  var particleSystem = new THREE.ParticleSystem(particles, pMaterial);

  // add it to the scene
  scene.add(particleSystem);
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
