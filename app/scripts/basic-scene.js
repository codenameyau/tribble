/*-------JSHint Directives-------*/
/* global THREE                  */
/*-------------------------------*/
'use strict';

var scene  = new THREE.Scene();
var canvasWidth  = window.innerWidth;
var canvasHeight = window.innerHeight;

// PerspectiveCamera(field of view, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(75, canvasWidth/canvasHeight, 0.1, 1000);

// Bind renderer to document
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);
