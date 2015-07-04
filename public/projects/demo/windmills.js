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
  function BladeGeometry() {
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
  }

  // Windmill Constructor
  function Windmill(height) {
    this.windmill = new THREE.Object3D();
    this.material = new THREE.MeshLambertMaterial( {color: 0xfafafa} );
    this.height = height;
    this.createBlades();
    this.createHub();
    this.createGenerator();
    this.createTower();
    this.createPlatform();
  }

  Windmill.prototype.createBlades = function() {
    this.blades = new THREE.Object3D();

    // Rotating hub
    var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 16);
    var rotator = new THREE.Mesh(cylinderGeometry, this.material);
    rotator.rotation.x = playground.utils.degToRad(90);
    this.blades.add(rotator);

    // Windmill blades
    var windmillBlade = new BladeGeometry();
    var rotationAngle = 0;
    for (var i=0; i<3; i++) {
      var blade = new THREE.Mesh(windmillBlade, this.material);
      blade.rotation.z = playground.utils.degToRad(rotationAngle);
      this.blades.add(blade);
      rotationAngle += 120;
    }
    this.windmill.add(this.blades);
  };

  Windmill.prototype.createHub = function() {
    var geometry = new THREE.SphereGeometry(1, 16, 16, Math.PI, Math.PI, 0);
    this.hub = new THREE.Mesh(geometry, this.material);
    this.hub.rotation.x = playground.utils.degToRad(180);
    this.hub.scale.z = 2;
    this.hub.position.z = 0.45;
    this.windmill.add(this.hub);
  };

  Windmill.prototype.createGenerator = function() {
    var sphere = new THREE.SphereGeometry(1, 3, 16, Math.PI, Math.PI, 0);
    this.generator = new THREE.Mesh(sphere, this.material);
    this.generator.scale.z = 6;
    this.generator.position.z = -0.45;
    this.windmill.add(this.generator);
  };

  Windmill.prototype.createTower = function() {
    var radius = 0.7;
    var cylinder = new THREE.CylinderGeometry(radius, radius+0.5, this.height, 16);
    this.tower = new THREE.Mesh(cylinder, this.material);
    this.tower.position.set(0, -this.height/2, -1.5);
    this.windmill.add(this.tower);
  };

  Windmill.prototype.createPlatform = function() {
    var box = new THREE.BoxGeometry(10, 1, 10);
    this.platform = new THREE.Mesh(box, this.material);
    this.platform.position.set(0, -this.height, -1.5);
    this.windmill.add(this.platform);
  };

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
  var windmillA = new Windmill(WINDMILL.height);
  windmillA.windmill.position.set(0, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillA.windmill);
  windmills.push(windmillA.windmill);

  var windmillB = new Windmill(WINDMILL.height);
  windmillB.windmill.position.set(-30, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillB.windmill);
  windmills.push(windmillB.windmill);

  var windmillC = new Windmill(WINDMILL.height);
  windmillC.windmill.position.set(30, WINDMILL.height+0.5, 0);
  playground.scene.add(windmillC.windmill);
  windmills.push(windmillC.windmill);

  // Animate windmill blades
  playground.setAnimation(function() {
    animateWindmillBlades();
    playground.controls.update();
    playground.composer.render(playground.scene, playground.camera);
  });
};
