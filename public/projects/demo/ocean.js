'use strict';


/***************************************************************
* OCEAN DEMO
***************************************************************/
var oceanDemo = function() {

  // External file paths
  var PATHS = {
    texture : 'projects/images/texture/',
    skybox : 'projects/images/skybox/',
    water : 'projects/images/texture/water/',
  };

  // World settings
  var WORLD = {
    skybox : 'skybox-sun.png',
    waterNormal : 'water-clear.png',
    width: 500,
    height: 500,
    widthSegments: 250,
    heightSegments: 250,
    depth: 200,
    param: 4,
    filterparam: 1
  };

  // Ocean config.
  var ocean;
  var waterSpeed = 1.0 / 90.0;

  // Playgroud intialization.
  var playground = new Playground();
  playground.setCameraPosition(0, 20, 200);
  playground.setMaxCameraDistance(300000);
  playground.controls.center = new THREE.Vector3(0, 50, 0);

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var sunLight = new THREE.DirectionalLight(0xffff55, 1);
  sunLight.position.set(- 1, 0.5, -1);
  playground.scene.add(lightAmbient);
  playground.scene.add(sunLight);

  // Create ocean skybox.
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

  // Cube shader for skybox,
  var cubeShader = THREE.ShaderLib.cube;
  cubeShader.uniforms.tCube.value = cubeMap;
  var skyBoxMaterial = new THREE.ShaderMaterial( {
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  // Create skybox around scene.
  var skyBox = new THREE.Mesh(
    new THREE.BoxGeometry(200000, 200000, 200000),
    skyBoxMaterial
  );
  playground.scene.add(skyBox);

  // Water demo
  var waterNormals = new THREE.ImageUtils.loadTexture(PATHS.water + WORLD.waterNormal);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  ocean = new THREE.Water(playground.renderer, playground.camera, playground.scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: sunLight.position.normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0,
  });

  // Mirror plane for ocean.
  var mirrorPlane = new THREE.PlaneGeometry(WORLD.width*500, WORLD.height*500, 50, 50);
  var mirrorMesh = new THREE.Mesh(mirrorPlane, ocean.material);
  mirrorMesh.add(ocean);
  mirrorMesh.rotation.x = - Math.PI * 0.5;
  playground.scene.add(mirrorMesh);

  // Set ocean animation.
  playground.setAnimation(function() {
    ocean.material.uniforms.time.value += waterSpeed;
    ocean.render();
    playground.defaultAnimation();
  });

};
