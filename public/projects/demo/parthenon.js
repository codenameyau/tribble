'use strict';


/***************************************************************
* PARTHENON DEMO
***************************************************************/
var parthenonDemo = function() {
  var playground = new Playground();
  playground.enableGrid(120, 5);
  playground.setCameraPosition(0, 30, 230);

  // Custom settings
  var parthenon;
  var pillars = {
    sides: 18,
    faces: 8,
    radius: 2,
    height: 28,
  };

  var spacing = pillars.radius * 4;

  // Custom TriangularPrismGeometry
  var TriangularPrismGeometry = function(width, height, length) {
    width  = width  || 8;
    height = height || 8;
    length = length || 10;
    this.geometry = new THREE.Geometry();

    // Front triangle
    this.geometry.vertices.push(new THREE.Vector3(-width, 0, length));
    this.geometry.vertices.push(new THREE.Vector3(width, 0, length));
    this.geometry.vertices.push(new THREE.Vector3(0, height, length));

    // Back triangle
    this.geometry.vertices.push(new THREE.Vector3(-width, 0, -length));
    this.geometry.vertices.push(new THREE.Vector3(width, 0, -length));
    this.geometry.vertices.push(new THREE.Vector3(0, height, -length));

    // Connect faces
    this.geometry.faces.push(new THREE.Face3(2, 0, 1)); // CC: front face
    this.geometry.faces.push(new THREE.Face3(5, 4, 3)); // CW: back face
    this.geometry.faces.push(new THREE.Face3(4, 1, 3)); // CC: bottom
    this.geometry.faces.push(new THREE.Face3(1, 0, 3)); // CC: bottom
    this.geometry.faces.push(new THREE.Face3(2, 5, 3)); // CC: left side
    this.geometry.faces.push(new THREE.Face3(2, 3, 0)); // CW: left side
    this.geometry.faces.push(new THREE.Face3(1, 4, 2)); // CW: right side
    this.geometry.faces.push(new THREE.Face3(2, 4, 5)); // CC: right side
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    return this.geometry;
  };

  var addPillars = function(detail, pillarMaterial, totalPillars) {
    var x = detail.x || 0;
    var y = detail.y || 0;
    var z = detail.z || 0;
    totalPillars = totalPillars || 8;

    var cylinder = new THREE.CylinderGeometry(
      pillars.radius, pillars.radius, pillars.height, 32);

    for (var i = 0; i < totalPillars; i++) {
      var pillar = new THREE.Mesh(cylinder, pillarMaterial);
      pillar.position.set(x, pillars.height/2+y-1, z);
      parthenon.add(pillar);
      x += detail.xSpace;
      z += detail.zSpace;
    }
  };

  var getFloorLayer = function(frontDist, sideDist, height, materialColor) {
    materialColor = materialColor || 0xB2B2B2;
    var floorFrontArea = (pillars.faces + frontDist) * spacing;
    var floorSideArea = (pillars.sides + sideDist) * spacing;
    var floorGeometry = new THREE.BoxGeometry(floorFrontArea, height, floorSideArea);
    var solidMaterial = new THREE.MeshLambertMaterial({color: materialColor});
    return new THREE.Mesh(floorGeometry, solidMaterial);
  };

  // Main Scene
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightFront = new THREE.PointLight(0x7c7c7c);
  var lightLeft = new THREE.PointLight(0x525252);
  var lightRight = new THREE.PointLight(0x525252);
  lightFront.position.set(0, 100, 150);
  lightLeft.position.set(-250, 120, 80);
  lightRight.position.set(250, 120, 80);
  playground.scene.add(lightAmbient);
  playground.scene.add(lightFront);
  playground.scene.add(lightLeft);
  playground.scene.add(lightRight);

  // Materials and setup
  var concreteMaterial = new THREE.MeshLambertMaterial({color: 0xFAFAFA});
  parthenon = new THREE.Object3D();

  // Add floor layers
  var floorHeight = 2;
  var floorFirstLayer = getFloorLayer(1.3, 2.0, floorHeight);
  floorFirstLayer.position.y = floorHeight/2;
  var floorSecondLayer = getFloorLayer(0.8, 1.5, floorHeight);
  floorSecondLayer.position.y = floorFirstLayer.position.y + floorHeight;
  var floorThirdLayer = getFloorLayer(0.3, 1.0, floorHeight);
  floorThirdLayer.position.y = floorSecondLayer.position.y + floorHeight;
  parthenon.add(floorFirstLayer);
  parthenon.add(floorSecondLayer);
  parthenon.add(floorThirdLayer);

  // Add pillars
  var startX = (pillars.faces-1) * pillars.radius * 2;
  var startY = floorThirdLayer.position.y;
  var startZ = pillars.sides * pillars.radius * 2;
  var pillarsFront = {x: -startX, xSpace: spacing, z: startZ,  zSpace: 0, y: startY};
  var pillarsBack  = {x: -startX, xSpace: spacing, z: -startZ, zSpace: 0, y: startY};
  var pillarsLeft  = {x: -startX, xSpace: 0, z: -startZ, zSpace: spacing, y: startY};
  var pillarsright = {x:  startX, xSpace: 0, z: -startZ, zSpace: spacing, y: startY};
  addPillars(pillarsFront, concreteMaterial, pillars.faces);
  addPillars(pillarsBack, concreteMaterial, pillars.faces);
  addPillars(pillarsLeft, concreteMaterial, pillars.sides);
  addPillars(pillarsright, concreteMaterial, pillars.sides);

  // Add ceiling and facade.
  var ceilingHeight = 3;
  var facadeHeight = 5;
  var ceilingLayer = getFloorLayer(0, 1, ceilingHeight, 0xDCDCDC);
  ceilingLayer.position.y = startY+pillars.height;
  var facadeLayer = getFloorLayer(-0.1, 0.8, facadeHeight, 0xABABAB);
  facadeLayer.position.y = ceilingLayer.position.y + ceilingHeight+1;
  parthenon.add(ceilingLayer);
  parthenon.add(facadeLayer);

  // Add triangular prism roof.
  var roofHeight = pillars.height / 2.8;
  var pillarWidth = pillars.radius*2;
  var roofWidth = pillarWidth * pillars.faces;
  var roofLength = pillarWidth * pillars.sides * 1.05;
  var roof = new TriangularPrismGeometry(roofWidth, roofHeight, roofLength);
  var roofMesh = new THREE.Mesh(roof, concreteMaterial);
  roofMesh.position.y = facadeLayer.position.y + (facadeHeight/2);
  parthenon.add(roofMesh);
  playground.scene.add(parthenon);
};
