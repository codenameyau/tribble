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
var viewAngle = 90;
var rotationSpeed = 0.02;
var aspectRatio = canvasWidth/canvasHeight;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, 0.1, 2000);
camera.position.set(0, 0, 400);
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
var cylinder = new THREE.CylinderGeometry(pillarRadius, pillarRadius, 100, 20);
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
var floorLength = sidePillars * spacing;
var floorWidth = frontPillars * spacing;
var floorHeight = 15;
var buildingBase = new THREE.BoxGeometry(floorLength, floorWidth, floorHeight);
var buildingFloor = new THREE.Mesh(buildingBase, floorMaterial);
buildingFloor.position.x = -20;
buildingFloor.position.z = -floorHeight-40;
scene.add(buildingFloor);

// Add ceiling
var ceilingFloor = new THREE.Mesh(buildingBase, floorMaterial);
ceilingFloor.position.x = -20;
ceilingFloor.position.z = floorHeight+40;
scene.add(ceilingFloor);

// Add ceiling triangle prism
// var triangularPrism = new THREE.Geometry();
// var testMaterial = new THREE.MeshLambertMaterial({color: 0xaa2233});
// var v1 = new THREE.Vector3(50, 0, 0);
// var v2 = new THREE.Vector3(-50, 0, 0);
// var v3 = new THREE.Vector3(0, 0, 50);
// triangularPrism.vertices.push(v1);
// triangularPrism.vertices.push(v2);
// triangularPrism.vertices.push(v3);
// triangularPrism.faces.push(new THREE.Face3( 0, 1, 2 ));
// var triangularRoof = new THREE.Mesh(triangularPrism, testMaterial);
// scene.add(triangularRoof);


// Track the mouse position, relative to the middle of the screen
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = window.innerHeight / 2 - e.clientY;
}, false );



function checkRotation() {
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
    if (camera.position.z > 10) {
      camera.position.y = y * Math.cos(rotationSpeed) - z * Math.sin(rotationSpeed);
      camera.position.z = z * Math.cos(rotationSpeed) + y * Math.sin(rotationSpeed);
    }
  }
  else if(keyboard.pressed('up')) {
    if (camera.position.y < -10) {
      camera.position.y = y * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
      camera.position.z = z * Math.cos(rotationSpeed) - y * Math.sin(rotationSpeed);
    }
  }
  camera.lookAt(scene.position);
}

function update() {
  // Move light position to track mouse (must be a unit vector!)
  light.position.set(mouseX, mouseY, 100).normalize();
  renderer.render(scene, camera);
  checkRotation();
}

function animate() {
  window.requestAnimationFrame(animate);
  update();
}

animate();


