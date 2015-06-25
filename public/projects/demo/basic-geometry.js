'use strict';

/***************************************************************
* BASIC GEOMETRY DEMO
***************************************************************/
var basicGeometryDemo = function() {
  var playground = new Playground();
  playground.enableGrid(20, 4);
  playground.setCameraPosition(0, 40, 60);

  // Custom basic 2D geometry
  function IsoscelesTriangleGeometry(base, height) {
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( 0, height, 0) );
    this.geometry.faces.push( new THREE.Face3(0, 1, 2) );
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    return this.geometry;
  }

  function EquilateralTriangleGeometry(width) {
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push( new THREE.Vector3(-width, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( width, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( 0, width, 0) );
    this.geometry.faces.push( new THREE.Face3(0, 1, 2) );
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    return this.geometry;
  }

  var ScaleneTriangleGeometry = function(base, sideA, sideB) {
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push( new THREE.Vector3(-base, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( base, 0, 0) );
    this.geometry.vertices.push( new THREE.Vector3( sideA, sideB, 0) );
    this.geometry.faces.push( new THREE.Face3(0, 1, 2) );
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    return this.geometry;
  };

  // Materials
  var basicMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );

  // Custom triangles
  var equalateralTriangle = new EquilateralTriangleGeometry(4);
  var triangleA = new THREE.Mesh(equalateralTriangle, basicMaterial);
  triangleA.position.set(0, 0, 12);

  var isoscelesTriangle = new IsoscelesTriangleGeometry(4, 6);
  var triangleB = new THREE.Mesh(isoscelesTriangle, basicMaterial);
  triangleB.position.set(0, 0, 0);

  var scaleneTriangle = new ScaleneTriangleGeometry(4, -6, 7);
  var triangleC = new THREE.Mesh(scaleneTriangle, basicMaterial);
  triangleC.position.set(0, 0, -12);

  // Add custom objects
  playground.scene.add(triangleA);
  playground.scene.add(triangleB);
  playground.scene.add(triangleC);
};
