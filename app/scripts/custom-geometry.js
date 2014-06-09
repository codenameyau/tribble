/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

var divId = '#canvas-body';
var scene, camera, renderer;

// Initialization
function initScene() {

  // Create scene
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;

  // Camera
  var viewAngle = 45;
  var aspectRatio  = canvasWidth/canvasHeight;
  var origin = new THREE.Vector3(0, 0, 0);
  camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, 0.01, 5000);
  camera.position.set(0, 0, 200);
  camera.lookAt(origin);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(divId).append(renderer.domElement);

  // Example shape
  var geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0,0,0));
  geom.vertices.push(new THREE.Vector3(0,50,0));
  geom.vertices.push(new THREE.Vector3(0,50,50));
  geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
  geom.computeFaceNormals();

  var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
  object.rotation.y = -Math.PI * 0.5; // rotate it -90 degrees on Y
  scene.add(object);

}

// Update scene
function updateScene() {
  renderer.render(scene, camera);
}

// Animate scene
function animateScene() {
  window.requestAnimationFrame(animateScene);
  updateScene();
}

// Run Scene
initScene();
animateScene();
