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
var particles = [];

// Update mouse
function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  console.log(mouseX + ' ' + mouseY);
}

// Particle renderer
function particleRender(context) {
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2, true);
  context.fill();
}

// Creates random starfield
function makeParticles() {
  var particle;
  var material = new THREE.ParticleCanvasMaterial(
    { color: 0xffffff, program: particleRender });

  for (var z=-zoomZ; z<zoomZ; z+=particleSpeed) {
    particle = new THREE.Particle(material);
    particle.position.x = calc.getRandomNumber(-500, 500);
    particle.position.y = calc.getRandomNumber(-500, 500);
    particle.position.z = z;
    particle.scale.x = particle.scale.y = 10;
    scene.add(particle);
    particles.push(particle);
  }
}

// Moves particles based on mouse position
function updateParticles() {
  for (var i=0; i<particles.length; i++) {
    var particle = particles[i];
    particle.position.z += mouseY * 0.1;
    if (particle.position.z > 1000) {
      particle.position.z = 2000;
    }
  }
}

// Update animation scene
function updateScene() {
  updateParticles();
  renderer.render(scene, camera);
}

// Render scene
function renderScene() {
  window.requestAnimationFrame(renderScene);
  updateScene();
  // controls.update();
}

// Initialization
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

  // Particles
  makeParticles();
  document.addEventListener( 'mousemove', onMouseMove, false );
  setInterval(updateScene, 1000/updateSpeed);
}

// Run Scene
initScene();
renderScene();

