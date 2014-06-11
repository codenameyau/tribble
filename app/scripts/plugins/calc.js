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

  // getRandomNum(Int, Int) -> Int
  getRandomNumber : function(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Custom Geometry: triangular prism
  // To do: make double sided true internally
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
    triangularPrism.faces.push(new THREE.Face3(2, 0, 1)); // CC: front face
    triangularPrism.faces.push(new THREE.Face3(5, 4, 3)); // CW: back face
    triangularPrism.faces.push(new THREE.Face3(4, 1, 3)); // CC: bottom
    triangularPrism.faces.push(new THREE.Face3(1, 0, 3)); // CC: bottom
    triangularPrism.faces.push(new THREE.Face3(2, 5, 3)); // CC: left side
    triangularPrism.faces.push(new THREE.Face3(2, 3, 0)); // CW: left side
    triangularPrism.faces.push(new THREE.Face3(1, 4, 2)); // CW: right side
    triangularPrism.faces.push(new THREE.Face3(2, 4, 5)); // CC: right side
    triangularPrism.computeFaceNormals();
    triangularPrism.computeVertexNormals();
    return triangularPrism;
  },

};
