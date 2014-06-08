/*-------JSHint Directives-------*/
/* global calc                   */
/* global THREE                  */
/* global THREEx                 */
/*-------------------------------*/
'use strict';

// Create scene
var scene = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseX, mouseY;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(1000, canvasWidth/canvasHeight, 0.1, 2000);
var start = new THREE.Vector3(0, 0, 500);
camera.position.set(0, 0, 500);
camera.lookAt(start);

// WebGLRenderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
$('#canvas-body').append(renderer.domElement);

// Create a new directional light at full intensity
var intensity = 0xffffff;
var light = new THREE.DirectionalLight(intensity);
light.position.set(0, 0, 0).normalize();
scene.add(light);

// Play with the pointlight
var pointLight = new THREE.PointLight(intensity);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

// Create geometry and materials
var pillarRadius = 10;
var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, 35, 20);
var pillarMaterial = new THREE.MeshLambertMaterial({color: 0xb1b1b1});

// Create green box
// var building = new THREE.Mesh(floor, greenMaterial);
// building.position.x = 0;
// building.position.y = 0;
// building.position.z = 0;
// scene.add(building);

// Create left side pillars
function addPillars(xOffset, yOffset, xChange, yChange, totalPillars) {
  for (var i = 0; i < totalPillars; i++) {
    var pillar = new THREE.Mesh(cylinder, pillarMaterial);
    pillar.rotation.x = calc.radToDeg(90);
    pillar.position.x = xOffset;
    pillar.position.y = yOffset;
    scene.add(pillar);
    xOffset += xChange;
    yOffset += yChange;
  }
}

var frontPillars = 8;
var sidePillars = 17;
var spacing = 4;

var frontOffset = frontPillars * pillarRadius * spacing;
addPillars(-90, frontOffset, pillarRadius*4, 0, sidePillars);
addPillars(-90, -frontOffset, pillarRadius*4, 0, sidePillars);
addPillars(90, -pillarRadius*frontPillars, 0, pillarRadius*4, frontPillars);

// Track the mouse position, relative to the middle of the screen
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );


function update() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);
  building.rotation.x += 0.01;
}

function animate() {
  window.requestAnimationFrame(animate);
  update();
}
animate();


