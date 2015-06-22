'use strict';

/***************************************************************
* STARFIELD PARTICLES DEMO
***************************************************************/
var starfieldParticlesDemo = function() {
  var playground = new Playground();
  playground.camera.position.set(0, 200, 300);

  // Particles configuration.
  var TEXTURES = 'projects/images/texture/stars/';
  var starFields = [];

  var particleStarField = function(totalParticles, texture, scale) {
    totalParticles = totalParticles || 200;
    scale = scale || 8;
    var particles = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
      size: scale,
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: false
    });

    // Add particles vectors
    for (var i = 0; i < totalParticles; i++) {
      var sideRange = 500;
      var heightRange = 200;
      var px = playground.utils.randomExclusive(-sideRange, sideRange);
      var py = playground.utils.randomExclusive(-heightRange, heightRange);
      var pz = playground.utils.randomExclusive(-sideRange, sideRange);
      particles.vertices.push(new THREE.Vector3(px, py, pz));
    }
    return new THREE.PointCloud(particles, material);
  };

  // Add particle field.
  var yellowStar = THREE.ImageUtils.loadTexture(TEXTURES + 'f-star.png');
  var redStar = THREE.ImageUtils.loadTexture(TEXTURES + 'm-star.png');
  var whiteStar = THREE.ImageUtils.loadTexture(TEXTURES + 'a-star.png');
  starFields.push(particleStarField(4000, whiteStar, 2));
  starFields.push(particleStarField(1200, redStar, 3));
  starFields.push(particleStarField(1200, yellowStar, 3));
  starFields.push(particleStarField(100, redStar, 5));
  starFields.push(particleStarField(100, yellowStar, 5));
  starFields.push(particleStarField(30, yellowStar, 8));
  starFields.push(particleStarField(3, redStar, 12));
  for (var i=0; i<starFields.length; i++) {
    playground.scene.add(starFields[i]);
  }

  // Animate starfield.
  playground.setAnimation(function() {
    for (var i=0; i<starFields.length; i++) {
      starFields[i].rotation.y += 0.0025;
      starFields[i].rotation.x += 0.0035;
    }
  });
};
