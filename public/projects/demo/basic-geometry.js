'use strict';


/***************************************************************
* BASIC GEOMETRY DEMO
***************************************************************/
var basicGeometryDemo = function() {
  var playground = new Playground();
  playground.enableGrid();

  // Define basic 2D geometry
  var geometryIsoscelesTriangle = function(base, height) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 0, height, 0) );
    geometry.faces.push( new THREE.Face3(0, 1, 2) );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
  };

  var geometryEquilateralTriangle = function(width) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(-width, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( width, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 0, width, 0) );
    geometry.faces.push( new THREE.Face3(0, 1, 2) );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
  };

  var geometryScaleneTriangle = function(base, sideA, sideB) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( sideA, sideB, 0) );
    geometry.faces.push( new THREE.Face3(0, 1, 2) );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
  };

  // Materials
  var basicMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );

  // Custom triangles
  var equalateralTriangle = geometryEquilateralTriangle(4);
  var triangleA = new THREE.Mesh(equalateralTriangle, basicMaterial);
  triangleA.position.set(0, 0, 12);

  var isoscelesTriangle = geometryIsoscelesTriangle(4, 6);
  var triangleB = new THREE.Mesh(isoscelesTriangle, basicMaterial);
  triangleB.position.set(0, 0, 0);

  var scaleneTriangle = geometryScaleneTriangle(4, -6, 7);
  var triangleC = new THREE.Mesh(scaleneTriangle, basicMaterial);
  triangleC.position.set(0, 0, -12);

  // Add custom objects
  playground.scene.add(triangleA);
  playground.scene.add(triangleB);
  playground.scene.add(triangleC);
};
