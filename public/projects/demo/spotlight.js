'use strict';


/***************************************************************
* SPOTLIGHT DEMO
***************************************************************/
var spotlightDemo = function() {
  var playground = new Playground();
  playground.setCameraPosition(0, 120, 400);
  playground.renderer.shadowMapEnabled = true;

  // Spotlight settings
  var SL = {
    visibility : true,
    intensity : 2,
    exponent: 10,
    red : 0.9,
    green : 0.9,
    blue : 0.85,
    x : 0,
    y : 120,
    z : 300,
  };

  var wall = function(width, length, gridColor) {
    width  = width || 20;
    length = length || 20;
    gridColor = gridColor || 0xCC4343;
    var floorPlane = new THREE.PlaneGeometry(width, length);
    var floorMaterial = new THREE.MeshLambertMaterial(
      {color: gridColor, side: THREE.DoubleSide});
    var floor = new THREE.Mesh(floorPlane, floorMaterial);
    floor.rotation.x = Math.PI/180 * -90;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    return floor;
  };

  var animateSpotLight = function() {
    yellowLight.position.set(SL.x, SL.y, SL.z);
    yellowLight.distance = SL.distance;
    yellowLight.intensity = SL.intensity;
    yellowLight.intensity = SL.intensity;
    yellowLight.shadowCameraVisible = SL.visibility;
  };

  // Dat gui iteraction
  var gui = new dat.GUI({ autoPlace: false });
  var guiContainer = document.getElementById('dat-gui-container');
  guiContainer.appendChild(gui.domElement);
  gui.add(SL, 'x').min(-200).max(200).step(1);
  gui.add(SL, 'y').min(40).max(250).step(1);
  gui.add(SL, 'z').min(-200).max(300).step(1);
  gui.add(SL, 'intensity').min(0).max(10).step(0.1);
  gui.add(SL, 'visibility');

  // Starter floor grid
  var wallWidth = 300;
  var wallHeight = 100;
  playground.scene.add(wall(wallWidth, wallHeight));

  // Add wall backdrop
  var backdrop = wall(wallWidth, wallHeight);
  backdrop.rotation.x = 0;
  backdrop.position.set(0, 100/2, -wallHeight/2);
  playground.scene.add(backdrop);

  // Yellow spotlight
  var yellowLight = new THREE.SpotLight(
    new THREE.Color(SL.red, SL.green, SL.blue));
  yellowLight.shadowCameraVisible = true;
  yellowLight.castShadow = true;
  yellowLight.position.set(SL.x, SL.y, SL.z);
  yellowLight.intensity = SL.intensity;
  playground.scene.add(yellowLight);

  // Lamp cover
  var coverMaterial = new THREE.MeshLambertMaterial(
    {color: 0xEDBC61, transparent: true, opacity: 0.70});
  var coverGeometry = new THREE.CylinderGeometry(8, 20, 15, 32, 32);
  var lampCover = new THREE.Mesh(coverGeometry, coverMaterial);
  lampCover.position.set(0, 40, 0);
  lampCover.castShadow = true;
  playground.scene.add(lampCover);
  playground.setAnimation(animateSpotLight);
};
