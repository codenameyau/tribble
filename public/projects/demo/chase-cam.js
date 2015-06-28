'use strict';


/***************************************************************
* CHASECAM DEMO
***************************************************************/
var chaseCamDemo = function() {
  var playground = new Playground();
  playground.enableGrid(80, 5);
  playground.controls.enabled = false;

  var camera = {x: 0, y: 10, z: 40};
  playground.setCameraPosition(camera.x, camera.y, camera.z);
  playground.camera.lookAt(playground.scene.position);

  var keyboard = new THREEx.KeyboardState();
  var movingFigure;
  var pixelsPerSec = 20;
  var rotationSteed = Math.PI / 1.5;

  var basicBox = function(figureSize, figureColor) {
    figureSize  = figureSize  || 4;
    figureColor = figureColor || 0xDADADA;
    var figureGeometry = new THREE.BoxGeometry(figureSize, figureSize, figureSize);
    var figureMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
    var boxFigure = new THREE.Mesh(figureGeometry, figureMaterial);
    boxFigure.position.set(0, figureSize/2, 0);
    return boxFigure;
  };

  var animateMovingFigure = function() {
    var delta = playground.clock.getDelta();
    var moveDistance = pixelsPerSec * delta;
    var rotationAngle = rotationSteed * delta;

    // Basic rotation
    if (keyboard.pressed('w')) {
      movingFigure.translateZ(-moveDistance);
    }
    if (keyboard.pressed('s')) {
      movingFigure.translateZ(moveDistance);
    }
    if (keyboard.pressed('a')) {
      movingFigure.rotation.y += rotationAngle;
    }
    if (keyboard.pressed('d')) {
      movingFigure.rotation.y -= rotationAngle;
    }

    // Adjust chase camera
    var relativeOffset = new THREE.Vector3(camera.x, camera.y, camera.z);
    var offset = relativeOffset.applyMatrix4( movingFigure.matrixWorld );
    playground.setCameraPosition(offset.x, offset.y, offset.z);
    playground.camera.lookAt( movingFigure.position );
  };

  // Ambient and point light
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, -100);
  playground.scene.add(lightAmbient);
  playground.scene.add(lightSource);

  // Add Movable Cube
  movingFigure = basicBox();
  playground.scene.add(movingFigure);
  playground.setAnimation(animateMovingFigure);
};
