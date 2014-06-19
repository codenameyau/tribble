/*-------JSHint Directives-------*/
/* global THREE                  */
/* global $:false                */
/*-------------------------------*/
'use strict';


/*********************************
 * Global Variables and Settings *
 *********************************/
var containerID = '#canvas-body';
var scene, camera, controls, renderer;
var ocean;

// Water movement speed
var waterSpeed = 1.0/60.0;

// External file paths
var PATHS = {
  texture : 'images/texture/',
  skybox : 'images/skybox/',
  water : 'images/texture/water/',
};

// World settings
var WORLD = {
  skybox : 'skybox-amethyst.jpg',
  waterNormal : 'water-clear.png',
  width: 500,
  height: 500,
  widthSegments: 250,
  heightSegments: 250,
  depth: 200,
  param: 4,
  filterparam: 1
};

// Camera settings
var CAMERA = {
  fov : 50,
  near : 50,
  far : 250000,
  zoomX : 0,
  zoomY : 200,
  zoomZ : 900,
};

// OrbitControls settings
var CONTROLS = {
  userPan : false,
  userPanSpeed : 0.0,
  minDistance : 300.0,
  maxDistance : 5000.0,
  maxPolarAngle : (Math.PI/180) * 85,
};


/********************
 * Helper Functions *
 ********************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  controls.update();
  ocean.material.uniforms.time.value += waterSpeed;
  ocean.render();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderScene();
}


/************************
 * Scene Initialization *
 ************************/
function initializeScene() {

  // Scene and resize listener
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener('resize', resizeWindow, false);

  // Camera and initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera(CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far);
  camera.position.set(CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ);

  // OrbitControls with mouse
  controls = new THREE.OrbitControls(camera);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var sunLight = new THREE.DirectionalLight(0xffff55, 1);
  sunLight.position.set(- 1, 0.5, -1);
  scene.add(lightAmbient);
  scene.add(sunLight);

  // Water demo
  var waterNormals = new THREE.ImageUtils.loadTexture(PATHS.water + WORLD.waterNormal);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  ocean = new THREE.Water(renderer, camera, scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: sunLight.position.normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0,
  });

  // Mirror plane for ocean
  var mirrorPlane = new THREE.PlaneGeometry(WORLD.width*500, WORLD.height*500, 50, 50);
  var mirrorMesh = new THREE.Mesh(mirrorPlane, ocean.material);
  mirrorMesh.add(ocean);
  mirrorMesh.rotation.x = - Math.PI * 0.5;
  scene.add(mirrorMesh);

  // Create ocean skybox
  var cubeMap = new THREE.Texture([]);
  cubeMap.format = THREE.RGBFormat;
  cubeMap.flipY = false;

  // Parse skybox image
  var loader = new THREE.ImageLoader();
  loader.load(PATHS.skybox + WORLD.skybox, function (image) {
    var getSide = function (x, y) {
      var size = 512;
      var canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      var context = canvas.getContext('2d');
      context.drawImage(image, -x * size, -y * size);
      return canvas;
    };
    cubeMap.image[0] = getSide( 2, 1 ); // px
    cubeMap.image[1] = getSide( 0, 1 ); // nx
    cubeMap.image[2] = getSide( 1, 0 ); // py
    cubeMap.image[3] = getSide( 1, 2 ); // ny
    cubeMap.image[4] = getSide( 1, 1 ); // pz
    cubeMap.image[5] = getSide( 3, 1 ); // nz
    cubeMap.needsUpdate = true;
  });

  var cubeShader = THREE.ShaderLib.cube;
  cubeShader.uniforms.tCube.value = cubeMap;
  var skyBoxMaterial = new THREE.ShaderMaterial( {
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  var skyBox = new THREE.Mesh(
    new THREE.BoxGeometry(300000, 300000, 300000),
    skyBoxMaterial
  );
  scene.add( skyBox );

}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
