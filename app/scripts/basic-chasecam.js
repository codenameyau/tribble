/*-------JSHint Directives-------*/
/* global calc                   */
/* global THREE                  */
/* global THREEx                 */
/*-------------------------------*/
'use strict';

// Scene
var scene = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;

// PerspectiveCamera
var viewAngle = 45;
var aspectRatio = canvasWidth/canvasHeight;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, 0.1, 20000);
camera.position.set(0, 150, 400);
scene.add(camera);

// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
$('#canvas-body').append(renderer.domElement);

// Lighting
var light = new THREE.PointLight(0xffffff);
light.position.set(0, 250, 0);
scene.add(light);

// Floor pattern
var floorTexture = new THREE.ImageUtils.loadTexture('images/texture/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
var floorGeometery = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometery, floorMaterial);
scene.add(floor);
