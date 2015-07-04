THREE.EffectComposer=function(e,r){if(this.renderer=e,void 0===r){var t=window.innerWidth||1,i=window.innerHeight||1,o={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBFormat,stencilBuffer:!1};r=new THREE.WebGLRenderTarget(t,i,o)}this.renderTarget1=r,this.renderTarget2=r.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.passes=[],void 0===THREE.CopyShader&&console.error("THREE.EffectComposer relies on THREE.CopyShader"),this.copyPass=new THREE.ShaderPass(THREE.CopyShader)},THREE.EffectComposer.prototype={swapBuffers:function(){var e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e},addPass:function(e){this.passes.push(e)},insertPass:function(e,r){this.passes.splice(r,0,e)},render:function(e){this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2;var r,t,i=!1,o=this.passes.length;for(t=0;o>t;t++)if(r=this.passes[t],r.enabled){if(r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){var a=this.renderer.context;a.stencilFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),a.stencilFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}r instanceof THREE.MaskPass?i=!0:r instanceof THREE.ClearMaskPass&&(i=!1)}},reset:function(e){void 0===e&&(e=this.renderTarget1.clone(),e.width=window.innerWidth,e.height=window.innerHeight),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2},setSize:function(e,r){var t=this.renderTarget1.clone();t.width=e,t.height=r,this.reset(t)}},THREE.EffectComposer.camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1),THREE.EffectComposer.quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),null),THREE.EffectComposer.scene=new THREE.Scene,THREE.EffectComposer.scene.add(THREE.EffectComposer.quad),THREE.RenderPass=function(e,r,t,i,o){this.scene=e,this.camera=r,this.overrideMaterial=t,this.clearColor=i,this.clearAlpha=void 0!==o?o:1,this.oldClearColor=new THREE.Color,this.oldClearAlpha=1,this.enabled=!0,this.clear=!0,this.needsSwap=!1},THREE.RenderPass.prototype={render:function(e,r,t,i){this.scene.overrideMaterial=this.overrideMaterial,this.clearColor&&(this.oldClearColor.copy(e.getClearColor()),this.oldClearAlpha=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),e.render(this.scene,this.camera,t,this.clear),this.clearColor&&e.setClearColor(this.oldClearColor,this.oldClearAlpha),this.scene.overrideMaterial=null}},THREE.ShaderPass=function(e,r){this.textureID=void 0!==r?r:"tDiffuse",this.uniforms=THREE.UniformsUtils.clone(e.uniforms),this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.renderToScreen=!1,this.enabled=!0,this.needsSwap=!0,this.clear=!1},THREE.ShaderPass.prototype={render:function(e,r,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=t),THREE.EffectComposer.quad.material=this.material,this.renderToScreen?e.render(THREE.EffectComposer.scene,THREE.EffectComposer.camera):e.render(THREE.EffectComposer.scene,THREE.EffectComposer.camera,r,this.clear)}},THREE.MaskPass=function(e,r){this.scene=e,this.camera=r,this.enabled=!0,this.clear=!0,this.needsSwap=!1,this.inverse=!1},THREE.MaskPass.prototype={render:function(e,r,t,i){var o=e.context;o.colorMask(!1,!1,!1,!1),o.depthMask(!1);var a,s;this.inverse?(a=0,s=1):(a=1,s=0),o.enable(o.STENCIL_TEST),o.stencilOp(o.REPLACE,o.REPLACE,o.REPLACE),o.stencilFunc(o.ALWAYS,a,4294967295),o.clearStencil(s),e.render(this.scene,this.camera,t,this.clear),e.render(this.scene,this.camera,r,this.clear),o.colorMask(!0,!0,!0,!0),o.depthMask(!0),o.stencilFunc(o.EQUAL,1,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP)}},THREE.ClearMaskPass=function(){this.enabled=!0},THREE.ClearMaskPass.prototype={render:function(e,r,t,i){var o=e.context;o.disable(o.STENCIL_TEST)}},THREE.CopyShader={uniforms:{tDiffuse:{type:"t",value:null},opacity:{type:"f",value:1}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform float opacity;","uniform sampler2D tDiffuse;","varying vec2 vUv;","void main() {","vec4 texel = texture2D( tDiffuse, vUv );","gl_FragColor = opacity * texel;","}"].join("\n")},THREE.DotScreenShader={uniforms:{tDiffuse:{type:"t",value:null},tSize:{type:"v2",value:new THREE.Vector2(256,256)},center:{type:"v2",value:new THREE.Vector2(.5,.5)},angle:{type:"f",value:1.57},scale:{type:"f",value:1}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform vec2 center;","uniform float angle;","uniform float scale;","uniform vec2 tSize;","uniform sampler2D tDiffuse;","varying vec2 vUv;","float pattern() {","float s = sin( angle ), c = cos( angle );","vec2 tex = vUv * tSize - center;","vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;","return ( sin( point.x ) * sin( point.y ) ) * 4.0;","}","void main() {","vec4 color = texture2D( tDiffuse, vUv );","float average = ( color.r + color.g + color.b ) / 3.0;","gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );","}"].join("\n")},THREE.ShaderLib.mirror={uniforms:{mirrorColor:{type:"c",value:new THREE.Color(8355711)},mirrorSampler:{type:"t",value:null},textureMatrix:{type:"m4",value:new THREE.Matrix4}},vertexShader:["uniform mat4 textureMatrix;","varying vec4 mirrorCoord;","void main() {","vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );","vec4 worldPosition = modelMatrix * vec4( position, 1.0 );","mirrorCoord = textureMatrix * worldPosition;","gl_Position = projectionMatrix * mvPosition;","}"].join("\n"),fragmentShader:["uniform vec3 mirrorColor;","uniform sampler2D mirrorSampler;","varying vec4 mirrorCoord;","float blendOverlay(float base, float blend) {","return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );","}","void main() {","vec4 color = texture2DProj(mirrorSampler, mirrorCoord);","color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);","gl_FragColor = color;","}"].join("\n")},THREE.Mirror=function(e,r,t){THREE.Object3D.call(this),this.name="mirror_"+this.id,t=t||{},this.matrixNeedsUpdate=!0;var i=void 0!==t.textureWidth?t.textureWidth:512,o=void 0!==t.textureHeight?t.textureHeight:512;this.clipBias=void 0!==t.clipBias?t.clipBias:0;var a=new THREE.Color(void 0!==t.color?t.color:8355711);this.renderer=e,this.mirrorPlane=new THREE.Plane,this.normal=new THREE.Vector3(0,0,1),this.mirrorWorldPosition=new THREE.Vector3,this.cameraWorldPosition=new THREE.Vector3,this.rotationMatrix=new THREE.Matrix4,this.lookAtPosition=new THREE.Vector3(0,0,-1),this.clipPlane=new THREE.Vector4;var s=void 0!==t.debugMode?t.debugMode:!1;if(s){var n=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0),10,16777088),l=new THREE.Geometry;l.vertices.push(new THREE.Vector3(-10,-10,0)),l.vertices.push(new THREE.Vector3(10,-10,0)),l.vertices.push(new THREE.Vector3(10,10,0)),l.vertices.push(new THREE.Vector3(-10,10,0)),l.vertices.push(l.vertices[0]);var m=new THREE.Line(l,new THREE.LineBasicMaterial({color:16777088}));this.add(n),this.add(m)}r instanceof THREE.PerspectiveCamera?this.camera=r:(this.camera=new THREE.PerspectiveCamera,console.log(this.name+": camera is not a Perspective Camera!")),this.textureMatrix=new THREE.Matrix4,this.mirrorCamera=this.camera.clone(),this.texture=new THREE.WebGLRenderTarget(i,o),this.tempTexture=new THREE.WebGLRenderTarget(i,o);var h=THREE.ShaderLib.mirror,c=THREE.UniformsUtils.clone(h.uniforms);this.material=new THREE.ShaderMaterial({fragmentShader:h.fragmentShader,vertexShader:h.vertexShader,uniforms:c}),this.material.uniforms.mirrorSampler.value=this.texture,this.material.uniforms.mirrorColor.value=a,this.material.uniforms.textureMatrix.value=this.textureMatrix,THREE.Math.isPowerOfTwo(i)&&THREE.Math.isPowerOfTwo(o)||(this.texture.generateMipmaps=!1,this.tempTexture.generateMipmaps=!1),this.updateTextureMatrix(),this.render()},THREE.Mirror.prototype=Object.create(THREE.Object3D.prototype),THREE.Mirror.prototype.renderWithMirror=function(e){this.updateTextureMatrix(),this.matrixNeedsUpdate=!1;var r=e.camera;e.camera=this.mirrorCamera,e.renderTemp(),e.material.uniforms.mirrorSampler.value=e.tempTexture,this.render(),this.matrixNeedsUpdate=!0,e.material.uniforms.mirrorSampler.value=e.texture,e.camera=r,e.updateTextureMatrix()},THREE.Mirror.prototype.updateTextureMatrix=function(){var e=THREE.Math.sign;this.updateMatrixWorld(),this.camera.updateMatrixWorld(),this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld),this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld),this.rotationMatrix.extractRotation(this.matrixWorld),this.normal.set(0,0,1),this.normal.applyMatrix4(this.rotationMatrix);var r=this.mirrorWorldPosition.clone().sub(this.cameraWorldPosition);r.reflect(this.normal).negate(),r.add(this.mirrorWorldPosition),this.rotationMatrix.extractRotation(this.camera.matrixWorld),this.lookAtPosition.set(0,0,-1),this.lookAtPosition.applyMatrix4(this.rotationMatrix),this.lookAtPosition.add(this.cameraWorldPosition);var t=this.mirrorWorldPosition.clone().sub(this.lookAtPosition);t.reflect(this.normal).negate(),t.add(this.mirrorWorldPosition),this.up.set(0,-1,0),this.up.applyMatrix4(this.rotationMatrix),this.up.reflect(this.normal).negate(),this.mirrorCamera.position.copy(r),this.mirrorCamera.up=this.up,this.mirrorCamera.lookAt(t),this.mirrorCamera.updateProjectionMatrix(),this.mirrorCamera.updateMatrixWorld(),this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld),this.textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix),this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse),this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal,this.mirrorWorldPosition),this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse),this.clipPlane.set(this.mirrorPlane.normal.x,this.mirrorPlane.normal.y,this.mirrorPlane.normal.z,this.mirrorPlane.constant);var i=new THREE.Vector4,o=this.mirrorCamera.projectionMatrix;i.x=(e(this.clipPlane.x)+o.elements[8])/o.elements[0],i.y=(e(this.clipPlane.y)+o.elements[9])/o.elements[5],i.z=-1,i.w=(1+o.elements[10])/o.elements[14];var a=new THREE.Vector4;a=this.clipPlane.multiplyScalar(2/this.clipPlane.dot(i)),o.elements[2]=a.x,o.elements[6]=a.y,o.elements[10]=a.z+1-this.clipBias,o.elements[14]=a.w},THREE.Mirror.prototype.render=function(){this.matrixNeedsUpdate&&this.updateTextureMatrix(),this.matrixNeedsUpdate=!0;for(var e=this;void 0!==e.parent;)e=e.parent;void 0!==e&&e instanceof THREE.Scene&&this.renderer.render(e,this.mirrorCamera,this.texture,!0)},THREE.Mirror.prototype.renderTemp=function(){this.matrixNeedsUpdate&&this.updateTextureMatrix(),this.matrixNeedsUpdate=!0;for(var e=this;void 0!==e.parent;)e=e.parent;void 0!==e&&e instanceof THREE.Scene&&this.renderer.render(e,this.mirrorCamera,this.tempTexture,!0)},THREE.ShaderLib.water={uniforms:{normalSampler:{type:"t",value:null},mirrorSampler:{type:"t",value:null},alpha:{type:"f",value:1},time:{type:"f",value:0},distortionScale:{type:"f",value:20},textureMatrix:{type:"m4",value:new THREE.Matrix4},sunColor:{type:"c",value:new THREE.Color(8355711)},sunDirection:{type:"v3",value:new THREE.Vector3(.70707,.70707,0)},eye:{type:"v3",value:new THREE.Vector3(0,0,0)},waterColor:{type:"c",value:new THREE.Color(5592405)}},vertexShader:["uniform mat4 textureMatrix;","uniform float time;","varying vec4 mirrorCoord;","varying vec3 worldPosition;","void main()","{"," mirrorCoord = modelMatrix * vec4( position, 1.0 );"," worldPosition = mirrorCoord.xyz;"," mirrorCoord = textureMatrix * mirrorCoord;"," gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["precision highp float;","uniform sampler2D mirrorSampler;","uniform float alpha;","uniform float time;","uniform float distortionScale;","uniform sampler2D normalSampler;","uniform vec3 sunColor;","uniform vec3 sunDirection;","uniform vec3 eye;","uniform vec3 waterColor;","varying vec4 mirrorCoord;","varying vec3 worldPosition;","vec4 getNoise( vec2 uv )","{"," vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);"," vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );"," vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );"," vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );"," vec4 noise = ( texture2D( normalSampler, uv0 ) ) +","   ( texture2D( normalSampler, uv1 ) ) +","   ( texture2D( normalSampler, uv2 ) ) +","   ( texture2D( normalSampler, uv3 ) );"," return noise * 0.5 - 1.0;","}","void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor )","{"," vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );"," float direction = max( 0.0, dot( eyeDirection, reflection ) );"," specularColor += pow( direction, shiny ) * sunColor * spec;"," diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;","}","void main()","{"," vec4 noise = getNoise( worldPosition.xz );"," vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );"," vec3 diffuseLight = vec3(0.0);"," vec3 specularLight = vec3(0.0);"," vec3 worldToEye = eye-worldPosition;"," vec3 eyeDirection = normalize( worldToEye );"," sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );"," float distance = length(worldToEye);"," vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;"," vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.z + distortion ) );"," float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );"," float rf0 = 0.3;"," float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );"," vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;"," vec3 albedo = mix( sunColor * diffuseLight * 0.3 + scatter, ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance );"," gl_FragColor = vec4( albedo, alpha );","}"].join("\n")},THREE.Water=function(e,r,t,i){function o(e,r){return void 0!==e?e:r}THREE.Object3D.call(this),this.name="water_"+this.id,i=i||{},this.matrixNeedsUpdate=!0;var a=o(i.textureWidth,512),s=o(i.textureHeight,512);this.clipBias=o(i.clipBias,0),this.alpha=o(i.alpha,1),this.time=o(i.time,0),this.normalSampler=o(i.waterNormals,null),this.sunDirection=o(i.sunDirection,new THREE.Vector3(.70707,.70707,0)),this.sunColor=new THREE.Color(o(i.sunColor,16777215)),this.waterColor=new THREE.Color(o(i.waterColor,8355711)),this.eye=o(i.eye,new THREE.Vector3(0,0,0)),this.distortionScale=o(i.distortionScale,20),this.renderer=e,this.scene=t,this.mirrorPlane=new THREE.Plane,this.normal=new THREE.Vector3(0,0,1),this.mirrorWorldPosition=new THREE.Vector3,this.cameraWorldPosition=new THREE.Vector3,this.rotationMatrix=new THREE.Matrix4,this.lookAtPosition=new THREE.Vector3(0,0,-1),this.clipPlane=new THREE.Vector4,r instanceof THREE.PerspectiveCamera?this.camera=r:(this.camera=new THREE.PerspectiveCamera,console.log(this.name+": camera is not a Perspective Camera!")),this.textureMatrix=new THREE.Matrix4,this.mirrorCamera=this.camera.clone(),this.texture=new THREE.WebGLRenderTarget(a,s),this.tempTexture=new THREE.WebGLRenderTarget(a,s);var n=THREE.ShaderLib.water,l=THREE.UniformsUtils.clone(n.uniforms);this.material=new THREE.ShaderMaterial({fragmentShader:n.fragmentShader,vertexShader:n.vertexShader,uniforms:l,transparent:!0}),this.material.uniforms.mirrorSampler.value=this.texture,this.material.uniforms.textureMatrix.value=this.textureMatrix,this.material.uniforms.alpha.value=this.alpha,this.material.uniforms.time.value=this.time,this.material.uniforms.normalSampler.value=this.normalSampler,this.material.uniforms.sunColor.value=this.sunColor,this.material.uniforms.waterColor.value=this.waterColor,this.material.uniforms.sunDirection.value=this.sunDirection,this.material.uniforms.distortionScale.value=this.distortionScale,this.material.uniforms.eye.value=this.eye,THREE.Math.isPowerOfTwo(a)&&THREE.Math.isPowerOfTwo(s)||(this.texture.generateMipmaps=!1,this.tempTexture.generateMipmaps=!1),this.updateTextureMatrix(),this.render()},THREE.Water.prototype=Object.create(THREE.Mirror.prototype),THREE.Water.prototype.updateTextureMatrix=function(){function e(e){return e?0>e?-1:1:0}this.updateMatrixWorld(),this.camera.updateMatrixWorld(),this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld),this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld),this.rotationMatrix.extractRotation(this.matrixWorld),this.normal.set(0,0,1),this.normal.applyMatrix4(this.rotationMatrix);var r=this.mirrorWorldPosition.clone().sub(this.cameraWorldPosition);r.reflect(this.normal).negate(),r.add(this.mirrorWorldPosition),this.rotationMatrix.extractRotation(this.camera.matrixWorld),this.lookAtPosition.set(0,0,-1),this.lookAtPosition.applyMatrix4(this.rotationMatrix),this.lookAtPosition.add(this.cameraWorldPosition);var t=this.mirrorWorldPosition.clone().sub(this.lookAtPosition);t.reflect(this.normal).negate(),t.add(this.mirrorWorldPosition),this.up.set(0,-1,0),this.up.applyMatrix4(this.rotationMatrix),this.up.reflect(this.normal).negate(),this.mirrorCamera.position.copy(r),this.mirrorCamera.up=this.up,this.mirrorCamera.lookAt(t),this.mirrorCamera.aspect=this.camera.aspect,this.mirrorCamera.updateProjectionMatrix(),this.mirrorCamera.updateMatrixWorld(),this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld),this.textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix),this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse),this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal,this.mirrorWorldPosition),this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse),this.clipPlane.set(this.mirrorPlane.normal.x,this.mirrorPlane.normal.y,this.mirrorPlane.normal.z,this.mirrorPlane.constant);var i=new THREE.Vector4,o=this.mirrorCamera.projectionMatrix;i.x=(e(this.clipPlane.x)+o.elements[8])/o.elements[0],i.y=(e(this.clipPlane.y)+o.elements[9])/o.elements[5],i.z=-1,i.w=(1+o.elements[10])/o.elements[14];var a=new THREE.Vector4;a=this.clipPlane.multiplyScalar(2/this.clipPlane.dot(i)),o.elements[2]=a.x,o.elements[6]=a.y,o.elements[10]=a.z+1-this.clipBias,o.elements[14]=a.w;var s=new THREE.Vector3;s.setFromMatrixPosition(this.camera.matrixWorld),this.eye=s,this.material.uniforms.eye.value=this.eye},THREE.BrightnessShader={uniforms:{tDiffuse:{type:"t",value:null},amount:{type:"f",value:.5}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);","}"].join("\n"),fragmentShader:["uniform sampler2D tDiffuse;","uniform float amount;","varying vec2 vUv;","void main() {","vec4 color = texture2D(tDiffuse, vUv);","gl_FragColor = color*amount;","}"].join("\n")};