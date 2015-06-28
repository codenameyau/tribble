'use strict';


/***************************************************************
* WINDMILLS DEMO
***************************************************************/
var windmillsDemo = function() {

  // Windmill settings
  var windmills = [];
  var WINDMILL = { height: 35 };

  var playground = new Playground();
  playground.controls.center = new THREE.Vector3(0, WINDMILL.height/1.5, 0);
  playground.setCameraPosition(0, 30, 100);
  playground.enableGrid(80, 10);

  // Effect composer
  playground.composer = new THREE.EffectComposer(playground.renderer);
  playground.composer.addPass(new THREE.RenderPass(
    playground.scene, playground.camera));

  // Shader effect: create new ShaderPass -> DotScreen
  var dotscreenEffect = new THREE.ShaderPass(THREE.DotScreenShader);
  dotscreenEffect.uniforms.scale.value = 4;
  dotscreenEffect.renderToScreen = true;
  playground.composer.addPass(dotscreenEffect);

  // Returns geometry of a blade
  var BladeGeometry = function() {
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(new THREE.Vector3(    0,   15,  0   ));
    this.geometry.vertices.push(new THREE.Vector3(   -1,  2.5,  0   ));
    this.geometry.vertices.push(new THREE.Vector3(    1,  2.5,  0   ));
    this.geometry.vertices.push(new THREE.Vector3(    0,  2.5,  0.5 ));
    this.geometry.vertices.push(new THREE.Vector3(    0,  2.5, -0.5 ));
    this.geometry.vertices.push(new THREE.Vector3( -0.3,  0.3,  0   ));
    this.geometry.vertices.push(new THREE.Vector3(  0.3,  0.3,  0   ));
    this.geometry.faces.push(new THREE.Face3(3, 0, 1));
    this.geometry.faces.push(new THREE.Face3(2, 0, 3));
    this.geometry.faces.push(new THREE.Face3(1, 0, 4));
    this.geometry.faces.push(new THREE.Face3(4, 0, 2));
    this.geometry.faces.push(new THREE.Face3(5, 3, 1));
    this.geometry.faces.push(new THREE.Face3(6, 2, 3));
    this.geometry.faces.push(new THREE.Face3(6, 3, 5));
    this.geometry.faces.push(new THREE.Face3(6, 4, 2));
    this.geometry.faces.push(new THREE.Face3(5, 1, 4));
    this.geometry.faces.push(new THREE.Face3(5, 4, 6));
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    return this.geometry;
  };

  // Returns three windmill blades as an Object3D
  var windmillBladesObject3D = function(windmillMaterial) {
    var windmillBlades = new THREE.Object3D();

    // Rotating hub
    var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 16);
    var windmillHub = new THREE.Mesh(cylinderGeometry, windmillMaterial);
    windmillHub.rotation.x = playground.utils.degToRad(90);
    windmillBlades.add(windmillHub);

    // Windmill blades
    var windmillBlade = new BladeGeometry();
    var rotationAngle = 0;
    for (var i=0; i<3; i++) {
      var blade = new THREE.Mesh(windmillBlade, windmillMaterial);
      blade.rotation.z = playground.utils.degToRad(rotationAngle);
      windmillBlades.add(blade);
      rotationAngle += 120;
    }
    return windmillBlades;
  };

  // Returns mesh of windmill hub head.
  var windmillHubMesh = function(windmillMaterial) {
    var geometry = new THREE.SphereGeometry(1, 16, 16, Math.PI, Math.PI, 0);
    var hubMesh = new THREE.Mesh(geometry, windmillMaterial);
    hubMesh.rotation.x = playground.utils.degToRad(180);
    hubMesh.scale.z = 2;
    hubMesh.position.z = 0.45;
    return hubMesh;
  };

  // Returns Object3D of windmill generator.
  var windmillGeneratorObject3D = function(windmillMaterial) {
    var sphere = new THREE.SphereGeometry(1, 3, 16, Math.PI, Math.PI, 0);
    var body = new THREE.Mesh(sphere, windmillMaterial);
    body.scale.z = 6;
    body.position.z = -0.45;
    return body;
  };

  // Returns mesh of windmill tower.
  var windmillTowerMesh = function(windmillMaterial) {
    var radius = 0.7;
    var cylinder = new THREE.CylinderGeometry(radius, radius+0.5, WINDMILL.height, 16);
    var tower = new THREE.Mesh(cylinder, windmillMaterial);
    tower.position.set(0, -WINDMILL.height/2, -1.5);
    return tower;
  };

  // Returns mesh of windmill ground base.
  var windmillGroundMesh = function(windmillMaterial) {
    var box = new THREE.BoxGeometry(10, 1, 10);
    var base = new THREE.Mesh(box, windmillMaterial);
    base.position.set(0, -WINDMILL.height, -1.5);
    return base;
  };

  function Windmill() {
    // Create blades
    var newWindmill = new THREE.Object3D();
    var windmillMaterial = new THREE.MeshLambertMaterial( {color: 0xfafafa} );
    var windmillBlades = windmillBladesObject3D( windmillMaterial );
    var windmillHub = windmillHubMesh( windmillMaterial );
    var windmillGenerator = windmillGeneratorObject3D( windmillMaterial );
    var windmillTower = windmillTowerMesh( windmillMaterial );
    var windmillGround = windmillGroundMesh( windmillMaterial );
    newWindmill.add(windmillBlades);
    newWindmill.add(windmillHub);
    newWindmill.add(windmillGenerator);
    newWindmill.add(windmillTower);
    newWindmill.add(windmillGround);
    return newWindmill;
  }

  var animateWindmillBlades = function() {
    var delta = playground.clock.getDelta();
    for (var i=0; i<windmills.length; i++) {
      windmills[i].children[0].rotation.z -= delta * 1.5;
    }
  };

  // Light sources
  var lightAmbient = new THREE.AmbientLight(0x7a7a7a);
  var lightSource = new THREE.DirectionalLight(0x9a9a9a);
  lightSource.position.set(0, 0.4, 0.6);
  playground.scene.add(lightAmbient);
  playground.scene.add(lightSource);

  // Add windmills to scene
  var windmillA = new Windmill();
  windmillA.position.set(0, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillA);
  windmills.push(windmillA);

  var windmillB = new Windmill();
  windmillB.position.set(-30, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillB);
  windmills.push(windmillB);

  var windmillC = new Windmill();
  windmillC.position.set(30, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillC);
  windmills.push(windmillC);

  // Animate windmill blades
  playground.setAnimation(function() {
    animateWindmillBlades();
    playground.controls.update();
    playground.composer.render(playground.scene, playground.camera);
  });
};
