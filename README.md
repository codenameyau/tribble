tribble
=======

Playground for three.js and computer graphics

###3D Modeling and Animation Software ($)
* ZBrush - Digital painting and sculpting with polygons
* Maya - 3D animation, modeling, simulation, rendering, and compositing


###Learning Milestones

#####boilerplate.js
* Created reusabile boilerplate
* XYZ coordinate system
* Basic grid with LineBasicMaterial
* OrbitControls for mouse
* Rendering on window resize
* Global setting objects

#####custom-geometry.js
* Created a custom triangular prism geometry
* First draw geometry and label the vertices
* Clockwise vs counter-clockwise vectors
* MeshBasicMaterial is solid and non-reflective
* THREEx KeyboardState plugin

#####basic-architecture.js
* Created Parthenon with basic geometry
* Position objects with position.set
* MeshLambertMaterial for reflective surfaces
* Ambient and point lighting
* Fixed undefined issue

#####basic-starfield.js
* Created starfield particle system
* Rotate objects with rotation property
* Use ImageUtils.loadTexture for textures
* Material properties: map, blending, transparent

#####basic-chasecam.js
* Clock is used to keep framerate consistent
* Relative camera offset and rotation
* Must disable OrbitControls with chase cam

#####demo-ocean.js
* OrbitControl custom settings
* WebGL detector and canvas fall-back
