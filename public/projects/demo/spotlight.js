'use strict';


/***************************************************************
* Global Variables and Settings
***************************************************************/
var spotlightDemo = function() {
  var playground = new Playground();
  playground.camera.position.set(0, 100, 250);
  var yellowLight;

  // Spotlight settings
  var S1 = {
    visibility : true,
    intensity : 2,
    exponent: 5,
    red : 0.9,
    green : 0.9,
    blue : 0.85,
    x : 0,
    y : 180,
    z : 150,
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

  var addSpotLightGUI = function(spotlight) {
    gui.add(spotlight, 'x').min(-200).max(200).step(1);
    gui.add(spotlight, 'y').min(40).max(250).step(1);
    gui.add(spotlight, 'z').min(-200).max(250).step(1);
    gui.add(spotlight, 'intensity').min(0).max(10).step(0.1);
    gui.add(spotlight, 'visibility');
  };

  var updateSpotLight = function() {
    yellowLight.position.set(S1.x, S1.y, S1.z);
    yellowLight.distance = S1.distance;
    yellowLight.intensity = S1.intensity;
    yellowLight.intensity = S1.intensity;
    yellowLight.shadowCameraVisible = S1.visibility;
  };

  // Dat gui iteraction
  var gui = new dat.GUI({ autoPlace: false });
  var guiContainer = document.getElementById('dat-gui-container');
  guiContainer.appendChild(gui.domElement);
  addSpotLightGUI(S1);

  // Starter floor grid
  var floorSize = 200;
  playground.scene.add(wall(floorSize, floorSize));

  // Add wall backdrop
  var backdrop = wall(floorSize, 100);
  backdrop.rotation.x = 0;
  backdrop.position.set(0, 100/2, -floorSize/2);
  playground.scene.add(backdrop);

  // Yellow spotlight
  yellowLight = new THREE.SpotLight(new THREE.Color(S1.red, S1.green, S1.blue));
  yellowLight.shadowCameraVisible = S1.visibility;
  yellowLight.castShadow = true;
  yellowLight.position.set(S1.x, S1.y, S1.z);
  yellowLight.intensity = S1.intensity;
  playground.scene.add(yellowLight);

  // Lamp cover
  var coverMaterial = new THREE.MeshLambertMaterial(
    {color: 0xEDBC61, transparent: true, opacity: 0.70});
  var coverGeometry = new THREE.CylinderGeometry(8, 20, 15, 32, 32);
  var lampCover = new THREE.Mesh(coverGeometry, coverMaterial);
  lampCover.position.set(0, 40, 0);
  lampCover.castShadow = true;
  playground.scene.add(lampCover);
  playground.setAnimation(updateSpotLight);
};

