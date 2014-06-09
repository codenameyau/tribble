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
var theta = 0;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(1000, canvasWidth/canvasHeight, 0.1, 2000);
camera.position.set(0, 90, 400);
camera.rotation.z = calc.radToDeg(180);
var keyboard = new THREEx.KeyboardState();

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
var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, 50, 20);
var pillarMaterial = new THREE.MeshLambertMaterial({color: 0xF7F3E4, wireframe: true});
var floorMaterial = new THREE.MeshLambertMaterial({color: 0xa3a3a3});

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

// Compute pillar offsets
var frontPillars = 7;
var sidePillars = 19;
var spacing = pillarRadius * 4;
var frontOffset = frontPillars * spacing/2;
var sideOffset = sidePillars * spacing/2;

// Add front and side pillars
addPillars(-sideOffset, frontOffset, spacing, 0, sidePillars);
addPillars(-sideOffset, -frontOffset, spacing, 0, sidePillars);
addPillars(-sideOffset, -frontOffset, 0, spacing, frontPillars);
addPillars(sideOffset-spacing, -frontOffset, 0, spacing, frontPillars);

// Add floor
var floorLength = (sidePillars-1) * spacing;
var floorWidth = frontPillars * spacing;
var floorHeight = 20;
var buildingBase = new THREE.BoxGeometry(floorLength, floorWidth, floorHeight);
var buildingFloor = new THREE.Mesh(buildingBase, floorMaterial);
buildingFloor.position.x = -20;
buildingFloor.position.z = -floorHeight;
scene.add(buildingFloor);


// Track the mouse position, relative to the middle of the screen
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );


function update() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);

  // Keyboard camera rotation
  if(keyboard.pressed('left')) {
    theta += 0.5;
    camera.rotation.y = calc.radToDeg(theta);
  }
  else if(keyboard.pressed('right')) {
    theta -= 0.5;
    camera.rotation.y = calc.radToDeg(theta);
  }
  else if(keyboard.pressed('down')) {
    theta += 0.5;
    camera.position.z -= 1;
    camera.rotation.x = calc.radToDeg(theta);
  }
  else if(keyboard.pressed('up')) {
    theta -= 0.5;
    camera.rotation.x = calc.radToDeg(theta);
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  update();
}
animate();

