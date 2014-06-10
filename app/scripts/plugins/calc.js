/*-------JSHint Directives-------*/
/* global THREE                  */
/* exported calc                 */
/*-------------------------------*/
'use strict';

var calc = {

  // radToDeg(Number) -> Float
  radToDeg : function(degrees) {
    return degrees * (Math.PI / 180);
  },

  // Custom Geometry: triangular prism
  TriangularPrism : function(width, height, length) {
    // Default sizes
    width  = width  || 8;
    height = height || 8;
    length = length || 10;
    var triangularPrism = new THREE.Geometry();
    // Front triangle
    triangularPrism.vertices.push(new THREE.Vector3(-width, 0, length));
    triangularPrism.vertices.push(new THREE.Vector3(width, 0, length));
    triangularPrism.vertices.push(new THREE.Vector3(0, height, length));
    // Back triangle
    triangularPrism.vertices.push(new THREE.Vector3(-width, 0, -length));
    triangularPrism.vertices.push(new THREE.Vector3(width, 0, -length));
    triangularPrism.vertices.push(new THREE.Vector3(0, height, -length));
    // Connect faces
    triangularPrism.faces.push(new THREE.Face3(0, 1, 2));
    triangularPrism.faces.push(new THREE.Face3(3, 4, 5));
    triangularPrism.faces.push(new THREE.Face3(0, 2, 3));
    triangularPrism.faces.push(new THREE.Face3(1, 2, 4));
    triangularPrism.faces.push(new THREE.Face3(2, 3, 5));
    triangularPrism.faces.push(new THREE.Face3(2, 4, 5));
    triangularPrism.faces.push(new THREE.Face3(0, 3, 4));
    triangularPrism.faces.push(new THREE.Face3(0, 1, 4));
    return triangularPrism;
  },

};
