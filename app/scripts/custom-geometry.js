/*-------JSHint Directives-------*/
/* global THREE                  */
/* global THREEx                 */
/*-------------------------------*/
'use strict';

// Global variables
var containerID = '#canvas-body';
var scene, camera, keyboard, renderer;
var rotationSpeed = 0.02;
var zoomX = 0;
var zoomY = 40;
var zoomZ = 40;

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
  camera = new THREE.PerspectiveCamera(viewDistance, aspectRatio, 0.01, 1000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(lookAtCoords);

  // Keyboard controls
  keyboard = new THREEx.KeyboardState();

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Example grid stage
  var lines = 20, step = 2;
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

  // Add rectangular prism geometry
  var triangleHeight = 6;
  var prismMaterial = new THREE.MeshBasicMaterial();
  var triangularPrism = new THREE.Geometry();
  triangularPrism.vertices.push(new THREE.Vector3(-triangleHeight, 0, 10));
  triangularPrism.vertices.push(new THREE.Vector3(triangleHeight, 0, 10));
  triangularPrism.vertices.push(new THREE.Vector3(0, triangleHeight, 10));
  triangularPrism.faces.push(new THREE.Face3(0, 1, 2));
  var prism = new THREE.Mesh(triangularPrism, prismMaterial);
  scene.add(prism);
}

// Keyboard event listener
function updateKeyboard() {

  var x = camera.position.x;
  var y = camera.position.y;
  var z = camera.position.z;

  // Keyboard camera rotation
  if(keyboard.pressed('left')) {
    camera.position.x = x * Math.cos(rotationSpeed) - z * Math.sin(rotationSpeed);
    camera.position.z = z * Math.cos(rotationSpeed) + x * Math.sin(rotationSpeed);
  }
  else if(keyboard.pressed('right')) {
    camera.position.x = x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
    camera.position.z = z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed);
  }
  else if(keyboard.pressed('down')) {
    if (camera.position.y > 5) {
      camera.position.y = y * Math.cos(rotationSpeed) - z * Math.sin(rotationSpeed);
      camera.position.z = z * Math.cos(rotationSpeed) + y * Math.sin(rotationSpeed);
    }
  }
  else if(keyboard.pressed('up')) {
    if (camera.position.y < zoomY-0.1) {
      if (camera.position.y < 1) {
        camera.position.x = zoomX;
        camera.position.y = zoomY;
        camera.position.z = zoomZ;
      }
      else {
        camera.position.y = y * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
        camera.position.z = z * Math.cos(rotationSpeed) - y * Math.sin(rotationSpeed);
      }
    }
  }
  camera.lookAt(scene.position);
}

// Update animation scene
function updateScene() {
  renderer.render(scene, camera);
  updateKeyboard();
}

// Render scene
function renderScene() {
  window.requestAnimationFrame(renderScene);
  updateScene();
}

// Run Scene
initScene();
renderScene();
