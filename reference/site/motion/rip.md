# Ripped motion windows

> 600 chars of context around each match. Modules are minified single lines; read the object literals, they are the exact values Framer ships. Never round.

## three.module.BQ2sF8ia.mjs (536 KB)

### canvas (79 matches, 24 windows)

_canvas / WebGL code to port verbatim (shader source, uniforms, draw loop)._

```js
// @6487
t),n.version=e.version)}return{get:o,remove:s,update:c}}function re(e,t,n,r,i){let a=new K(0),o=0,s,c,l=null,u=0,d=null;function f(n,i){let f=!1,m=!0===i.isScene?i.background:null;m&&m.isTexture&&(m=t.get(m));let h=e.xr,g=h.getSession&&h.getSession();g&&g.environmentBlendMode===`additive`&&(m=null),m===null?p(a,o):m&&m.isColor&&(p(m,1),f=!0),(e.autoClear||f)&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),m&&(m.isCubeTexture||m.mapping===306)?(c===void 0&&(c=new Ga(new Ka(1,1,1),new Xa({name:`BackgroundCubeMaterial`,uniforms:j(po.cube.uniforms),vertexShader:po.cube.vertexShader,fragmentShader:po.cube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute(`normal`),c.geometry.deleteAttribute(`uv`),c.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),c.material.uniforms.envMap.value=m,c.material.uniforms.flipEnvMap.value=m.isCubeTexture&&!1===m.isRenderTargetTexture?-1:1,(l!==m||u!==m.version||d!==e.toneMapping)&&(c.material.needsUpdate=!0,l=m,u=m.version,d=e.toneMapping),n.unshift(c,c.geometry,c.material,0,0,null)):m&&m.isTexture&&(s===void 0&&(s=new Ga(new fo(2,2),new Xa({name:`BackgroundMaterial`,uniforms:j(po.background.uniforms),vertexShader:po.background.vertexShader,fragmentShader:po.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),s.geometry.deleteAttribute(`normal`),Object.defineProperty(s.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(s)),s.material.uniforms.t2D.value=m,!0===m.matrixAutoUpdate&&m.updateMatrix(),s.material.uniforms.uvTransform.value.copy(m.matrix),(l!==m||u!==m.version||d!==e.toneMapping)&&(s.material.needsUpdate=!0,l=m,u=m.version,d=e.toneMapping),n.unshift(s,s.geometry,s.material,0,0,null))}function p(e,t){n.buffers.color.setClear(e.r,e.g,e.b,t,i)}return{getClearColor:function(){return a},setClearColor:function(e,t=
```

```js
// @17243
m.setAttribute(`uv`,new _a(f,2)),m.setAttribute(`faceIndex`,new _a(p,1)),e.push(m),r>go&&r--}return{_lodPlanes:e,_sizeLods:t,_sigmas:n}}function ce(e){let t=new Xr(3*vo,3*vo,e);return t.texture.mapping=306,t.texture.name=`PMREM.cubeUv`,t.scissorTest=!0,t}function le(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ue(e){let t=new Float32Array(e),n=new U(0,1,0);return new ho({name:`SphericalGaussianBlur`,defines:{n:e},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:t},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:pe(),fragmentShader:`\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform int samples;\n\t\t\tuniform float weights[ n ];\n\t\t\tuniform bool latitudinal;\n\t\t\tuniform float dTheta;\n\t\t\tuniform float mipInt;\n\t\t\tuniform vec3 poleAxis;\n\n\t\t\t${me()}\n\n\t\t\t#define ENVMAP_TYPE_CUBE_UV\n\t\t\t#include <cube_uv_reflection_fragment>\n\n\t\t\tvec3 getSample( float theta, vec3 axis ) {\n\n\t\t\t\tfloat cosTheta = cos( theta );\n\t\t\t\t// Rodrigues' axis-angle rotation\n\t\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross( axis, vOutputDirection ) * sin( theta )\n\t\t\t\t\t+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n\t\t\t\treturn bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n\t\t\t\tif ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n\t\t\t\t\taxis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n\t\t\t\t}\n\n\t\t\t\taxis = normalize( axis );\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n\t\t\t\tfor ( int i = 1; i < n; i++ ) {\n\n\t\t\t\t\tif ( i >= samples ) {\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfloat theta = dTheta * float( i );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n\t\t\t\t}\n\n\t\t\t}\n\t\t`,blending:0,depthTest:!1,depthWrite:!1})}function de(){let e=new V(1,1);return new ho({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null},texelSize:{value:e},inputEncoding:{value:So[Mr]}},vertexShader:pe(),fragmentShader:`\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform vec2 texelSize;\n\n\t\t\t${me()}\n\n\t\t\t#include <common>\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\n\t\t\t\tvec3 outputDirection = normalize( vOutputDirection );\n\t\t\t\tvec2 uv = equirectUv( outputDirection );\n\n\t\t\t\tvec2 f = fract( uv / texelSize - 0.5 );\n\t\t\t\tuv -= f * texelSize;\n\t\t\t\tvec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.x += texelSize.x;\n\t\t\t\tvec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.y += texelSize.y;\n\t\t\t\tvec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\t\t\t\tuv.x -= texelSize.x;\n\t\t\t\tvec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;\n\n\t\t\t\tvec3 tm = mix( tl, tr, f.x );\n\t\t\t\tvec3 bm = mix( bl, br, f.x );\n\t\t\t\tgl_FragColor.rgb = mix( tm, bm, f.y );\n\n\t\t\t}\n\t\t`,blending:0,depthTest:!1,depthWrite:!1})}function fe(){return new ho({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},inputEncoding:{value:So[Mr]}},vertexShader:pe(),fragmentShader:`\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform samplerCube envMap;\n\n\t\t\t${me()}\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) );\n\n\t\t\t}\n\t\t`,blending:0,depthTest:!1,depthWrite:!1})}function pe(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

```

```js
// @40002
YPE_VSM`),t}function It(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:case 307:t=`ENVMAP_TYPE_CUBE_UV`;break}return t}function Lt(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:case 307:t=`ENVMAP_MODE_REFRACTION`;break}return t}function Rt(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`;break}return t}function zt(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ft(n),l=It(n),u=Lt(n),d=Rt(n),f=n.isWebGL2?``:Ct(n),p=wt(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[p].filter(Et).join(`
`),h.length>0&&(h+=`
`),g=[f,p].filter(Et).join(`
`),g.length>0&&(g+=`
`)):(h=[Pt(n),`#define SHADER_NAME `+n.shaderName,p,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.supportsVertexTextures?`#define VERTEX_TEXTURES`:``,`#define MAX_BONES `+n.maxBones,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP
```

```js
// @47493
ng):``,n.lightMap?bt(`lightMapTexelToLinear`,n.lightMapEncoding):``,xt(`linearToOutputTexel`,n.outputEncoding),n.depthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Et).join(`
`)),o=kt(o),o=Dt(o,n),o=Ot(o,n),s=kt(s),s=Dt(s,n),s=Ot(s,n),o=jt(o),s=jt(s),n.isWebGL2&&!0!==n.isRawShaderMaterial&&(_=`#version 300 es
`,h=[`precision mediump sampler2DArray;`,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=gt(i,35633,v),x=gt(i,35632,y);if(i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?!0===n.morphTargets&&i.bindAttribLocation(m,0,`p
```

```js
// @48713
ibLocation(m,0,n.index0AttributeName),i.linkProgram(m),e.debug.checkShaderErrors){let e=i.getProgramInfoLog(m).trim(),t=i.getShaderInfoLog(b).trim(),n=i.getShaderInfoLog(x).trim(),r=!0,a=!0;if(!1===i.getProgramParameter(m,35714)){r=!1;let t=yt(i,b,`vertex`),n=yt(i,x,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,35715)+`

Program Info Log: `+e+`
`+t+`
`+n)}else e===``?t!==``&&n!==``||(a=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,e);a&&(this.diagnostics={runnable:r,programLog:e,vertexShader:{log:t,prefix:h},fragmentShader:{log:n,prefix:g}})}i.deleteShader(b),i.deleteShader(x);let S;this.getUniforms=function(){return S===void 0&&(S=new ht(i,m)),S};let C;return this.getAttributes=function(){return C===void 0&&(C=Tt(i,m)),C},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.name=n.shaderName,this.id=Go++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}function Bt(e,t,n,r,i,a,o){let s=new zi,c=new Xo,l=[],u=i.isWebGL2,d=i.logarithmicDepthBuffer,f=i.floatVertexTextures,p=i.maxVertexUniforms,m=i.vertexTextures,h=i.precision,g={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMateri
```

```js
// @50688
.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead.`),t=e.texture.encoding):t=Mr,u&&e&&e.isTexture&&e.format===1023&&e.type===1009&&e.encoding===3001&&(t=3e3),t}function y(a,s,l,p,y){let b=p.fog,x=a.isMeshStandardMaterial?p.environment:null,S=(a.isMeshStandardMaterial?n:t).get(a.envMap||x),C=g[a.type],w=y.isSkinnedMesh?_(y):0;a.precision!==null&&(h=i.getMaxPrecision(a.precision),h!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,h,`instead.`));let T,E,D,O;if(C){let e=po[C];T=e.vertexShader,E=e.fragmentShader}else T=a.vertexShader,E=a.fragmentShader,c.update(a),D=c.getVertexShaderID(a),O=c.getFragmentShaderID(a);let k=e.getRenderTarget(),ee=a.alphaTest>0,A=a.clearcoat>0;return{isWebGL2:u,shaderID:C,shaderName:a.type,vertexShader:T,fragmentShader:E,defines:a.defines,customVertexShaderID:D,customFragmentShaderID:O,isRawShaderMaterial:!0===a.isRawShaderMaterial,glslVersion:a.glslVersion,precision:h,instancing:!0===y.isInstancedMesh,instancingColor:!0===y.isInstancedMesh&&y.instanceColor!==null,supportsVertexTextures:m,outputEncoding:k===null?e.outputEncoding:v(k.texture),map:!!a.map,mapEncoding:v(a.map),matcap:!!a.matcap,matcapEncoding:v(a.matcap),envMap:!!S,envMapMode:S&&S.mapping,envMapEncoding:v(S),envMapCubeUV:!!S&&(S.mapping===306||S.mapping===307),lightMap:!!a.lightMap,lightMapEncoding:v(a.lightMap),aoMap:!!a.aoMap,e
```

```js
// @66621
{init:a,state:{lightsArray:r,shadowsArray:i,lights:n},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Zt(e,t){let n=new WeakMap;function r(r,i=0){let a;return!1===n.has(r)?(a=new Xt(e,t),n.set(r,[a])):i>=n.get(r).length?(a=new Xt(e,t),n.get(r).push(a)):a=n.get(r)[i],a}function i(){n=new WeakMap}return{get:r,dispose:i}}function Qt(e,t,n){let r=new uo,i=new V,a=new V,o=new H,s=new $o({depthPacking:Fr}),c=new es,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Xa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:ts,fragmentShader:ns}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Y;m.setAttribute(`position`,new _a(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ga(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1,this.render=function(t,n,s){if(!1===g.enabled||!1===g.autoUpdate&&!1===g.needsUpdate||t.length===0)return;let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===
```

```js
// @78152
etFlipSided:fe,setCullFace:pe,setLineWidth:me,setPolygonOffset:he,setScissorTest:ge,activeTexture:_e,bindTexture:ve,unbindTexture:ye,compressedTexImage2D:be,texImage2D:L,texImage3D:R,texStorage2D:Ce,texStorage3D:I,texSubImage2D:F,texSubImage3D:xe,compressedTexSubImage2D:Se,scissor:we,viewport:z,reset:Te}}function en(e,t,n,r,i,a,o){let s=i.isWebGL2,c=i.maxTextures,l=i.maxCubemapSize,u=i.maxTextureSize,d=i.maxSamples,f=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):void 0,p=new WeakMap,m,h=!1;try{h=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function g(e,t){return h?new OffscreenCanvas(e,t):w(`canvas`)}function _(e,t,n,r){let i=1;if((e.width>r||e.height>r)&&(i=r/Math.max(e.width,e.height)),i<1||!0===t){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let r=t?x:Math.floor,a=r(i*e.width),o=r(i*e.height);m===void 0&&(m=g(a,o));let s=n?g(a,o):m;return s.width=a,s.height=o,s.getContext(`2d`).drawImage(e,0,0,a,o),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+e.width+`x`+e.height+`) to (`+a+`x`+o+`).`),s}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+e.width+`x`+e.height+`).`),e}return e}function v(e){return y(e.width)&&y(e.height)}function b(e){return!s&&(e.wrapS!==1001||e.wrapT!==1001||e.minFilter!==1003&&e.minFilter!==1006)}function S(e,t){return e.generateMipmaps&&t&&e.minFilter!==1003&&e.minFilter!==1006}function C(t){e.generateMipmap(t)}function T(n,r,i,a){if(!1===s)return r;if(n!==null){if(e[n]!==
```

```js
// @146846
lements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Gr.prototype.isMatrix3=!0,qr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Kr===void 0&&(Kr=w(`canvas`)),Kr.width=e.width,Kr.height=e.height;let n=Kr.getContext(`2d`);e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Kr}return t.width>2048||t.height>2048?(console.warn(`THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons`,e),t.toDataURL(`image/jpeg`,.6)):t.toDataURL(`image/png`)}},Jr=0,Yr=class e extends zr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=ir,a=ir,o=lr,s=dr,c=vr,l=fr,u=1,d=Mr){super(),Object.defineProperty(this,"id",{value:Jr++}),this.uuid=r(),this.name=``,this.image=t,this.mipmaps=[],this.mapping=n,this.wrapS=i,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.ani
```

```js
// @242159
,D=new U;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},qa={clone:j,merge:M},Ja=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ya=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xa=class extends da{constructor(e){super(),this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.vertexShader=Ja,this.fragmentShader=Ya,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error(`THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.`),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=j(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let e in this.extensions)!0===this.extensions[e]&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Xa.prototype.isShaderMaterial=!0,Za=class extends G{constructor(){super(),this.type=`Camera`,this.matrixWorldInverse=new W,this.projectionMatrix=new W,this.projectionMatrixInverse=new W}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.el
```

```js
// @249644
angularTexture(e,t){this.texture.type=t.type,this.texture.format=vr,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ka(5,5,5),i=new Xa({name:`CubemapFromEquirect`,uniforms:j(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ga(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new to(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},ro.prototype.isWebGLCubeRenderTarget=!0,io=new U,ao=new U,oo=new Gr,so=class{constructor(e=new U(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(
```

```js
// @269925
lacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,encodings_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,encodings_pars_fragment:`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
	
```

```js
// @274594
rldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		return ( coord.x < 
```

```js
// @307332
learcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,output_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * S
```

```js
// @309001
in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
```

```js
// @324720
= skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RR
```

```js
// @331009
;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,depth_vert:`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtar
```

```js
// @333109
de <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include 
```

```js
// @334634
 nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipp
```

```js
// @346319
iewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vert
```

```js
// @359167
#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatri
```

```js
// @363620
,rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new K(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Gr}},sprite:{diffuse:{value:new K(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Gr}}},po={basic:{uniforms:M([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:M([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.fog,Z.lights,{emissive:{value:new K(0)}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:M([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new K(0)},specular:{value:new K(1118481)},shininess:{value:30}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:M([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new K(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:M([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new K(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:M([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:M([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:M([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:M([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:M([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:M([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new Gr},t2D:{value:null}},vertexShader:X.background_vert,fragmentShader:X.background_frag},cube:{uniforms:M([Z.envmap,{opacity:{value:1}}]),vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distanceRGBA:{uniforms:M([Z.common,Z.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distanceRGBA_vert,fragmentShader:X.distanceRGBA_frag},shadow:{uniforms:M([Z.lights,Z.fog,{color:{value:new K(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}},po.physical={uniforms:M([po.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new V(1,1)},clearcoatNormalMap:{value:null},sheen:{value:0},sheenColor:{value:new K(0)},sheenColorMap:{value:null},sheenRoughness:{value:0},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new K(0)},specularIntensity:{value:0},specularIntensityMap:{value:null},specularColor:{value:new K(1,1,1)},specularColorMap:{value:null}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},mo=class extends Za{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1
```

```js
// @374751
ngth;i!==a;++i){let a=t[i],o=n[a.id];!1!==o.needsUpdate&&a.setValue(e,o.value,r)}},ht.seqWithValue=function(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n},Go=0,Ko=/^[ \t]*#include +<([\w\d./]+)>/gm,qo=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,Jo=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g,Yo=0,Xo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return!1===a.has(r)&&(a.add(r),r.usedTimes++),!1===a.has(i)&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache;return!1===t.has(e)&&t.set(e,new Set),t.get(e)}_getShaderStage(e){let t=this.shaderCache;if(!1===t.has(e)){let n=new Zo;t.set(e,n)}return t.get(e)}},Zo=class{constructor(){this.id=Yo++,this.usedTimes=0}},Qo=0,$o=class extends da{constructor(e){super(),this.type=`MeshDepthMaterial`,this.depthPacking=Pr,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=
```

```js
// @377880
de;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`,rs=class extends Qa{constructor(e=[]){super(),this.cameras=e}},rs.prototype.isArrayCamera=!0,is=class extends G{constructor(){super(),this.type=`Group`}},is.prototype.isGroup=!0,as={type:`move`},os=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new is,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new is,this._target
```

## tQctxOsxU.BMpimIfh.mjs (388 KB)

### transition constants

```js
const transition1$1={bounce:.2,delay:0,duration:.4,type:`spring`}
const transition1={bounce:.2,delay:0,duration:.4,type:`spring`}
const transition2={delay:0,duration:.3,ease:[.12,.23,.5,1],type:`tween`}
const transition3={delay:.3,duration:.2,ease:[.12,.23,.5,1],type:`tween`}
const transition6={delay:.3,duration:.4,ease:[.12,.23,.5,1],type:`tween`}
const transition7={delay:.2,duration:.4,ease:[.12,.23,.5,1],type:`tween`}
const transition8={delay:0,duration:.4,ease:[.12,.23,.5,1],type:`tween`}
const transition9={bounce:.2,delay:.2,duration:.4,type:`spring`}
```

### text-effect (2 matches, 1 window)

_per token appear: spring + stagger (0.05s default), trigger onMount or onInView threshold._

```js
// @362374
h`,variantClassNames={CryN59OAs:`framer-v-10yyrs5`,CtVEKtlJu:`framer-v-1o94yvz`,dGCFozRyi:`framer-v-1b5ogf8`,eg6XjUQLY:`framer-v-103xv9v`,MPeNLgoLm:`framer-v-mj3k6j`,yebqQkg1K:`framer-v-g4n91k`},numberToPixelString=e=>{if(typeof e!=`number`)return e;if(Number.isFinite(e))return Math.max(0,e)+`px`},transition1={bounce:.2,delay:0,duration:.4,type:`spring`},transition2={delay:0,duration:.3,ease:[.12,.23,.5,1],type:`tween`},transition3={delay:.3,duration:.2,ease:[.12,.23,.5,1],type:`tween`},textEffect={effect:{filter:`blur(3px)`,opacity:.001,rotate:0,scale:1,skewX:0,skewY:0,x:0,y:2},startDelay:.1,tokenization:`character`,transition:{delay:.025,duration:.1,ease:[.12,.23,.5,1],type:`tween`},trigger:`onMount`,type:`appear`},Transition=({value:e,children:t})=>{let n=re(MotionConfigContext),r=e??n.transition,i=se(()=>({...n,transition:r}),[JSON.stringify(r)]);return p(MotionConfigContext.Provider,{value:i,children:t})},textEffect1={effect:{opacity:.001,rotate:0,scale:1,skewX:0,skewY:0,x:0,y:0},tokenization:`character`,transition:{delay:.025,duration:.01,ease:[.12,.23,.5,1],type:`tween`},trigger:`onMount`,type:`appear`},transformTemplate1=(e,t)=>`translateX(-50%) ${t}`,transition6={delay:.3,duration:.4,ease:[.12,.23,.5,1],type:`tween`},transition7={delay:.2,duration:.4,ease:[.12,.23,.5,1],type:`tween`},transition8={delay:0,duration:.4,ease:[.12,.23,.5,1],type:`tween`},transition9={bounce:.2,delay:.2,duration:.4,type:`spring`},greaterThan=(e,t)=>typeof e==`number`&&typeof t==`number`&&e>t,animation2={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:.1,d
```

### loop (1 match, 1 window)

_infinite loops (pulses, rotating arrows)._

```js
// @325326
AnimatePresence,{mode:`popLayout`,initial:!s,children:m.map((e,r)=>{let i=c===a.length-1;return p(Letter,{index:r,transition:n,gradientAnim:!i&&t&&!s,...o,children:e},`${r}-${c}-${m[r-1]??`z`}-${m[r]}-${m[r+1]??`z`}`)})})})})}var Letter,init_TextTransitionV2=__esmMin((()=>{init_jsx_runtime(),init_framer_274G56QY(),init_framer_motion_7WZJ4B6X(),init_npm_react_18_2_0(),init_lib(),Letter=Y(({transition:{delay:e,...t},index:n,children:r,startDelay:i,gradient:a,gradientDuration:o,gradientRange:s,gradientAnim:c=!1},l)=>{let d=useMotionValue(0);ue(()=>{if(c){let t=animate(d,100,{delay:n*e,duration:o,repeat:1/0,ease:`linear`});return()=>t.stop()}},[c,o,n,e,i,d]);let{inputRange:f,outputColors:m}=se(()=>{let e=a.length===0?[`#333333`]:a;if(e.length===1)return{inputRange:[50-s,50+s],outputColors:[e[0],e[0]]};let t=e.length;return{inputRange:Array.from({length:t},(e,n)=>50-s+n/(t-1)*(s*2)),outputColors:e}},[a,s]),h=useTransform(d,f,m);return p(motion.span,{ref:l,initial:{rotateX:-90,opacity:0},animate:{rotateX:0,opacity:1},exit:{rotateX:90,opacity:0},transition:{delay:n*e+i,...t},style:{color:h,display:`inline-block`,whiteSpace:`pre`,transformOrigin:`center center -5px`},children:r})}),addProp
```

### scroll-hook (1 match, 1 window)

_custom scroll-linked code components._

```js
// @325643
nit_framer_motion_7WZJ4B6X(),init_npm_react_18_2_0(),init_lib(),Letter=Y(({transition:{delay:e,...t},index:n,children:r,startDelay:i,gradient:a,gradientDuration:o,gradientRange:s,gradientAnim:c=!1},l)=>{let d=useMotionValue(0);ue(()=>{if(c){let t=animate(d,100,{delay:n*e,duration:o,repeat:1/0,ease:`linear`});return()=>t.stop()}},[c,o,n,e,i,d]);let{inputRange:f,outputColors:m}=se(()=>{let e=a.length===0?[`#333333`]:a;if(e.length===1)return{inputRange:[50-s,50+s],outputColors:[e[0],e[0]]};let t=e.length;return{inputRange:Array.from({length:t},(e,n)=>50-s+n/(t-1)*(s*2)),outputColors:e}},[a,s]),h=useTransform(d,f,m);return p(motion.span,{ref:l,initial:{rotateX:-90,opacity:0},animate:{rotateX:0,opacity:1},exit:{rotateX:90,opacity:0},transition:{delay:n*e+i,...t},style:{color:h,display:`inline-block`,whiteSpace:`pre`,transformOrigin:`center center -5px`},children:r})}),addPropertyControls(TextTransitionV2,{playMode:{title:`Play Mode`,type:ControlType.Enum,options:[`once`,`loop`],optionTitles:[`Once`,`Loop`],defaultValue:`loop`},play:{title:`Play`,type:ControlType.Boolean,defaultValue:!0},font:{title:`Font`,type:ControlType.Font,controls:`extended`,defaultValue:{textAlign:`left`,fontSize:
```

### hover-variant (2 matches, 2 windows)

_gesture variant maps; the component `transition` constant applies._

```js
// @221
sx_runtime,u,v as Y,x as ae,z as global}from"./react.BpkJvQWg.mjs";import{C as motion,H as useMotionValue,X as useSpring,Z as useTransform,a as MotionConfigContext,f as animate,n as AnimatePresence,r as LayoutGroup,s as MotionValue,t as init_framer_motion_7WZJ4B6X,v as init_chunk_B2CCIJNA,w as motionValue}from"./motion.CaYsD5Db.mjs";import{$ as init_framer_274G56QY,B as forwardLoader,E as RenderTarget,Et as useOnVariantChange,F as animate2,It as withFX,K as getFonts,N as addFonts,Nt as useVariantState,P as addPropertyControls,Pt as withCSS,R as cx,_ as Instance,bt as useIsOnFramerCanvas,dt as useActiveVariantCallback,i as ComponentViewportProvider,it as parsePaddingString,j as SmartComponentScopedContainer,jt as useSVGTemplate,k as RichText2,o as ControlType,pt as useComponentViewport,q as getFontsFromSharedStyle,wt as useLocaleInfo,zt as withOptimizedAppearEffect}from"./framer.Dy0MSJwM.mjs";import{n as init_zD0HidK19,t as Icon$4}from"./zD0HidK19.BonexWDa.mjs";import{i as init_zP54Deppw,n as css,r as fonts,t as className}from"./zP54Deppw.CV5M7OPU.mjs";import{n as init_StatusPingV2,t as StatusPingV2}from"./StatusPingV2.Dx0_L55Q.mjs";import{i as init_HN3v7c7uq,n as css$1,r as fonts$1
```

```js
// @366163
join(`-`),FramertQctxOsxU=withCSS(Y(function(e,t){let n=pe(null),r=t??n,i=ae(),{activeLocale:a,setLocale:o}=useLocaleInfo(),s=useComponentViewport(),{style:c,className:l,layoutId:d,variant:f,ltWGnHZW1:m,onltWGnHZW1Change:h,Pwl_s00am:g,PSTJiG3p8:_,ugG8YyQe7:v,...y}=getProps(e),[b,S]=useStateVariable(m,h),{baseVariant:C,classNames:w,clearLoadingGesture:T,gestureHandlers:E,gestureVariant:D,isLoading:O,setGestureState:k,setVariant:A,variants:j}=useVariantState({cycleOrder,defaultVariant:`dGCFozRyi`,ref:r,variant:f,variantClassNames}),M=createLayoutDependency(e,j),{activeVariantCallback:N,delay:P}=useActiveVariantCallback(C),F=N(async(...e)=>{await P(()=>A(`yebqQkg1K`,!0),2e3)}),I=N(async(...e)=>{await P(()=>A(`CtVEKtlJu`,!0),2e3)}),L=N(async(...e)=>{await P(()=>A(`eg6XjUQLY`,!0),4e3)}),R=N(async(...e)=>{await P(()=>A(`CryN59OAs`,!0),3500)});useOnVariantChange(C,{CryN59OAs:N(async(...e)=>{await P(()=>A(`dGCFozRyi`,!0),500)}),CtVEKtlJu:L,default:F,eg6XjUQLY:R,MPeNLgoLm:void 0,yebqQkg1K:I});let z=cx(serializationHash,className$2),B=()=>![`yebqQkg1K`,`CtVEKtlJu`,`eg6XjUQLY`].includes(C),V=()=>!![`yebqQkg1K`,`CtVEKtlJu`,`eg6XjUQLY`].includes(C),H=greaterThan(g,0),ee=greaterThan(g,1),ne=grea
```

### canvas (8 matches, 8 windows)

_canvas / WebGL code to port verbatim (shader source, uniforms, draw loop)._

```js
// @33497
oCase.parent.parentNode.removeChild((this||_global).fonts[e].monoCase.parent)));i!==0&&Date.now()-(this||_global).initTime<5e3?setTimeout((this||_global).checkLoadedFontsBinded,20):setTimeout((this||_global).setIsLoadedBinded,10)}function o(e,t){var n=createNS(`text`);n.style.fontSize=`100px`;var r=getFontProperties(t);n.setAttribute(`font-family`,t.fFamily),n.setAttribute(`font-style`,r.style),n.setAttribute(`font-weight`,r.weight),n.textContent=`1`,t.fClass?(n.style.fontFamily=`inherit`,n.setAttribute(`class`,t.fClass)):n.style.fontFamily=t.fFamily,e.appendChild(n);var i=createTag(`canvas`).getContext(`2d`);return i.font=t.fWeight+` `+t.fStyle+` 100px `+t.fFamily,n}function s(e,t){if(!e){(this||_global).isLoaded=!0;return}if((this||_global).chars){(this||_global).isLoaded=!0,(this||_global).fonts=e.list;return}var n=e.list,r,a=n.length,s=a;for(r=0;r<a;r+=1){var c=!0,l,d;if(n[r].loaded=!1,n[r].monoCase=i(n[r].fFamily,`monospace`),n[r].sansCase=i(n[r].fFamily,`sans-serif`),!n[r].fPath)n[r].loaded=!0,--s;else if(n[r].fOrigin===`p`||n[r].origin===3){if(l=document.querySelectorAll(`style[f-forigin="p"][f-family="`+n[r].fFamily+`"], style[f-origin="3"][f-family="`+n[r].fFamily+`"]`),l.
```

```js
// @87790
actory:function(e){(this||_global).audioFactory=e},setVolume:function(e){(this||_global)._volume=e,this._updateVolume()},mute:function(){(this||_global)._isMuted=!0,this._updateVolume()},unmute:function(){(this||_global)._isMuted=!1,this._updateVolume()},getVolume:function(){return(this||_global)._volume},_updateVolume:function(){var e,t=(this||_global).audios.length;for(e=0;e<t;e+=1)(this||_global).audios[e].volume((this||_global)._volume*+!(this||_global)._isMuted)}},function(){return new e}}(),ImagePreloader=function(){var e=function(){var e=createTag(`canvas`);e.width=1,e.height=1;var t=e.getContext(`2d`);return t.fillStyle=`rgba(0,0,0,0)`,t.fillRect(0,0,1,1),e}();function t(){(this||_global).loadedAssets+=1,(this||_global).loadedAssets===(this||_global).totalImages&&(this||_global).loadedFootagesCount===(this||_global).totalFootages&&(this||_global).imagesLoadedCb&&this.imagesLoadedCb(null)}function n(){(this||_global).loadedFootagesCount+=1,(this||_global).loadedAssets===(this||_global).totalImages&&(this||_global).loadedFootagesCount===(this||_global).totalFootages&&(this||_global).imagesLoadedCb&&this.imagesLoadedCb(null)}function r(e,t,n){var r=``;if(e.e)r=e.p;else if(t){v
```

```js
// @129079
_global).canvasContext.globalAlpha=t,(this||_global).globalData.currentGlobalAlpha=t)},CanvasRenderer.prototype.configAnimation=function(e){if((this||_global).animationItem.wrapper){(this||_global).animationItem.container=createTag(`canvas`);var t=(this||_global).animationItem.container.style;t.width=`100%`,t.height=`100%`;var n=`0px 0px 0px`;t.transformOrigin=n,t.mozTransformOrigin=n,t.webkitTransformOrigin=n,t[`-webkit-transform`]=n,(this||_global).animationItem.wrapper.appendChild((this||_global).animationItem.container),(this||_global).canvasContext=(this||_global).animationItem.container.getContext(`2d`),(this||_global).renderConfig.className&&(this||_global).animationItem.container.setAttribute(`class`,(this||_global).renderConfig.className),(this||_global).renderConfig.id&&(this||_global).animationItem.container.setAttribute(`id`,(this||_global).renderConfig.id)}else(this||_global).canvasContext=(this||_global).renderConfig.context;(this||_global).data=e,(this||_global).layers=e.layers,(this||_global).transformCanvas={w:e.w,h:e.h,sx:0,sy:0,tx:0,ty:0},this.setupGlobalData(e,document.body),(this||_global).globalData.canvasContext=(this||_global).canvasContext,(this||_global).g
```

```js
// @211365
s.initElement(e,t,n)}extendPrototype([BaseElement,TransformElement,CVBaseElement,HierarchyElement,FrameElement,RenderableElement],CVImageElement),CVImageElement.prototype.initElement=SVGShapeElement.prototype.initElement,CVImageElement.prototype.prepareFrame=IImageElement.prototype.prepareFrame,CVImageElement.prototype.createContent=function(){if((this||_global).img.width&&((this||_global).assetData.w!==(this||_global).img.width||(this||_global).assetData.h!==(this||_global).img.height)){var e=createTag(`canvas`);e.width=(this||_global).assetData.w,e.height=(this||_global).assetData.h;var t=e.getContext(`2d`),n=(this||_global).img.width,r=(this||_global).img.height,i=n/r,a=(this||_global).assetData.w/(this||_global).assetData.h,o,s,c=(this||_global).assetData.pr||(this||_global).globalData.renderConfig.imagePreserveAspectRatio;i>a&&c===`xMidYMid slice`||i<a&&c!==`xMidYMid slice`?(s=r,o=s*a):(o=n,s=o/a),t.drawImage((this||_global).img,(n-o)/2,(r-s)/2,o,s,0,0,(this||_global).assetData.w,(this||_global).assetData.h),(this||_global).img=e}},CVImageElement.prototype.renderInnerContent=function(){(this||_global).canvasContext.drawImage((this||_global).img,0,0)},CVImageElement.prototype.d
```

```js
// @225399
al).textSpans=[],(this||_global).yOffset=0,(this||_global).fillColorAnim=!1,(this||_global).strokeColorAnim=!1,(this||_global).strokeWidthAnim=!1,(this||_global).stroke=!1,(this||_global).fill=!1,(this||_global).justifyOffset=0,(this||_global).currentRender=null,(this||_global).renderType=`canvas`,(this||_global).values={fill:`rgba(0,0,0,0)`,stroke:`rgba(0,0,0,0)`,sWidth:0,fValue:``},this.initElement(e,t,n)}extendPrototype([BaseElement,TransformElement,CVBaseElement,HierarchyElement,FrameElement,RenderableElement,ITextElement],CVTextElement),CVTextElement.prototype.tHelper=createTag(`canvas`).getContext(`2d`),CVTextElement.prototype.buildNewText=function(){var e=(this||_global).textProperty.currentData;(this||_global).renderedLetters=createSizedArray(e.l?e.l.length:0);var t=!1;e.fc?(t=!0,(this||_global).values.fill=this.buildColor(e.fc)):(this||_global).values.fill=`rgba(0,0,0,0)`,(this||_global).fill=t;var n=!1;e.sc&&(n=!0,(this||_global).values.stroke=this.buildColor(e.sc),(this||_global).values.sWidth=e.sw);var r=(this||_global).globalData.fontManager.getFontByName(e.f),i,a,o=e.l,s=(this||_global).mHelper;(this||_global).stroke=n,(this||_global).values.fValue=e.finalSize+`px `+(
```

```js
// @333312
GridSize:{value:m.gridSize},uPointSize:{value:m.pointSize},uNumLayers:{value:m.gridLayers},uDispersionOffset:{value:m.dispersionOffset},uNoiseFrequency:{value:m.noiseFrequency},uWaveHeightScale:{value:m.waveHeightScale},uAmpWeight:{value:m.ampWeight},uNoiseLayerSpread:{value:m.noiseLayerSpread},uIntensity:{value:m.intensity},uFocalDistance:{value:m.focalDistance},uFocalRange:{value:m.focalRange},uBlurStrength:{value:m.blurStrength},uMouse:{value:{x:0,y:1}},uMouseScale:{value:m.mouseScale},uLightDirection:{value:G.current.clone()},uNoiseOffset:{value:oe.current.clone()}},vertexShader:`
        precision highp float;

        #define OCTAVES ${R}

        attribute vec4 random;

        varying vec4 vRandom;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying float vFactor;
        varying float vBlur;

        uniform float uTime;
        uniform float uGridSize;
        uniform float uPointSize;
        uniform sampler2D uDispersionMap;

        uniform float uDispersionOffset; // 0.8, row into the dispersion (color) map
        uniform float uNoiseFrequency;   // starting coordinate scale for octave 0
        uniform float uWa
```

```js
// @339517
 vec2((random.w * 0.7 + 1.0) / 2.0, uDispersionOffset);
            vColor = texture2D(uDispersionMap, dispersionUV).xyz;

            vec4 mvPosition = modelViewMatrix * vec4(dispPosition, 1.0);

            float cameraDist = length(mvPosition.xyz);
            float focalDelta = abs(cameraDist - uFocalDistance);
            float blur = clamp(focalDelta / uFocalRange, 0.0, 1.0);
            vBlur = blur;

            gl_PointSize = uPointSize * (1.0 + blur * uBlurStrength) * (1.0 / -mvPosition.z); // perspective scale
            gl_Position = projectionMatrix * mvPosition;
        }
    `,fragmentShader:`
        varying vec4 vRandom;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying float vFactor;
        varying float vBlur;

        uniform float uTime;
        uniform float uNumLayers;

        uniform float uIntensity; // 2.0

        uniform float uFocalDistance;
        uniform float uFocalRange;
        uniform float uBlurStrength;

        uniform vec3 uLightDirection;

        void main() {
            // gl_PointCoord is the UV across the quad (0..1)
            // This draws a circle by discarding corners
    
```

```js
// @340852
ec3 normal = normalize(vNormal);

            float alpha = clamp((dot(normal, normalize(uLightDirection))) * vFactor, 0.0, 1.0);
            float randomOpacity = mix(1.0, 1.0, sin(vRandom.y * 3.14 * 2.0 + uTime * 0.5) * 0.5 + 0.5);  
            alpha *= randomOpacity;

            // Physically motivated dimming — energy spreads as point grows
            float enlargedSize = 1.0 + vBlur * uBlurStrength;
            float energyFactor = 1.3 / (enlargedSize * enlargedSize);
            alpha *= energyFactor;

            alpha = clamp(alpha / uNumLayers * uIntensity, 0.0, 1.0);

            gl_FragColor = vec4(col * alpha, alpha);
        }
    `,transparent:!0,depthTest:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:201,blendDstAlpha:201});M.current=y,P.current&&(y.uniforms.uDispersionMap.value=P.current);let b=new Points(v,y);l.add(b);let S=document.visibilityState===`visible`,O=!1,k=()=>{if(r.halted()){s.setAnimationLoop(null);return}S&&O?s.setAnimationLoop(I):s.setAnimationLoop(null)},A=()=>{S=document.visibilityState===`visible`,k()};document.addEventListener(`visibilitychange`,A);let N=0,F=0;function I(e){if(r.shouldStop())ret
```

## script_main.8MTO-Tt7.mjs (354 KB)

### transition constants

```js
const di={bounce:.2,delay:0,duration:.4,type:`spring`}
const Ci={delay:0,duration:.2,ease:[.12,.23,.5,1],type:`tween`}
const Fi={bounce:.2,delay:0,duration:.4,type:`spring`}
const na={bounce:.2,delay:0,duration:.4,type:`spring`}
const qa={bounce:.2,delay:0,duration:.4,type:`spring`}
const co={bounce:.2,delay:0,duration:.4,type:`spring`}
const wo={bounce:.2,delay:0,duration:.4,type:`spring`}
const Bo={bounce:.2,delay:0,duration:.4,type:`spring`}
const ec={delay:0,duration:.1,ease:[.12,.23,.5,1],type:`tween`}
const fc={delay:0,duration:.1,ease:[.12,.23,.5,1],type:`tween`}
const wc={delay:0,duration:.1,ease:[.12,.23,.5,1],type:`tween`}
const Ic={bounce:.2,delay:0,duration:.4,type:`spring`}
const Zc={delay:0,duration:.2,ease:[.12,.23,.5,1],type:`tween`}
const _l={delay:0,duration:.2,ease:[.12,.23,.5,1],type:`tween`}
const yl={bounce:.2,delay:0,duration:.4,type:`spring`}
const lu={delay:0,duration:.1,ease:[.12,.23,.5,1],type:`tween`}
```

### variant-on-scroll (1 match, 1 window)

_variant switch by scroll ranges built from __framer__targets refs; animateOnce:false flips back._

```js
// @332601
:5,position:`to bottom`,shift:-4,spread:0,style:{height:`100%`,width:`100%`},width:`100%`})})}),D(A.div,{className:`framer-vjqi89`,"data-border":!0,"data-framer-name":`Footer Container`,children:[p!==!1&&b(`div`,{className:`framer-1aeo38i`,"data-framer-name":`CTA`,children:p!==!1&&D(`div`,{className:`framer-9aqjls`,"data-framer-name":`Container`,children:[b(W,{height:677,width:`min(100vw, 1400px)`,y:1953,children:b(Se,{className:`framer-1w558nd-container`,nodeId:`MZnzrpbQb`,rendersWithMotion:!0,scopeId:`j1g_d39hO`,children:b(Zl,{__framer__animateOnce:!1,__framer__obscuredVariantId:`S9BU72mBi`,__framer__threshold:.5,__framer__variantAppearEffectEnabled:!0,__framer__visibleVariantId:`qqtzmr701`,height:`100%`,id:`MZnzrpbQb`,layoutId:`MZnzrpbQb`,style:{height:`100%`,width:`100%`},variant:cu(`qqtzmr701`),width:`100%`})})}),D(`div`,{className:`framer-qr3vrw`,children:[b(q,{__fromCanvasComponent:!0,children:b(c,{children:b(`h2`,{className:`framer-styles-preset-1gn15j8`,"data-styles-preset":`uboWt2ocK`,dir:`auto`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))`},children:`Your data, finally connected`})}
```

### scroll-hook (2 matches, 2 windows)

_custom scroll-linked code components._

```js
// @114366
t)}}function ya(e,t){return e===1?Ma:e===2?t:1}function ba(e){getComputedStyle(e).position===`sticky`&&(e.style.setProperty(`position`,`static`),e.dataset.sticky=`true`),e.offsetParent&&ba(e.offsetParent)}function xa(e){e?.dataset?.sticky===`true`&&(e.style.removeProperty(`position`),delete e.dataset.sticky),e.offsetParent&&xa(e.offsetParent)}function Sa(e,t=0){let n=t+e.offsetTop;return e.offsetParent?Sa(e.offsetParent,n):n}function Ca(e,t=0){let n=t+e.offsetLeft;return e.offsetParent?Ca(e.offsetParent,n):n}function wa(e,t=0){let n=t+e.scrollTop;return e.offsetParent?wa(e.offsetParent,n):n+s.scrollY}function Ta(e,t=0){let n=t+e.scrollLeft;return e.offsetParent?Ta(e.offsetParent,n):n+s.scrollX}function Ea(){return Ra++}function Da({smooth:e,infinite:t,orientation:r,intensity:a,children:c,snap:l}){let u=n(),d=n(),f=n(),p=Ke();return o(()=>{if(p||c&&(!u.current||!d.current))return;u.current&&d.current&&(r===`horizontal`?u.current.style.setProperty(`overflowX`,`auto`):u.current.style.setProperty(`overflowY`,`auto`));let n=new Ia({smoothWheel:e,duration:a/10,infinite:t,orientation:r,gestureOrientation:r===`horizontal`?`both`:`vertical`,autoRaf:!0,autoToggle:!0,anchors:!0,allowNestedScr
```

```js
// @127040
_=Math.round(e.scrollTop),v=p-h,y=n,b=o,x=l,ee=d;else return!1;return!ee&&(_>=v||_<=0)||(y>0?_<v:_>0)&&b&&x}get rootElement(){return this.options.wrapper===s?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?`x`:`y`]}get isHorizontal(){return this.options.orientation===`horizontal`}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?_a(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling===`smooth`}get c
```

### hover-variant (16 matches, 6 windows)

_gesture variant maps; the component `transition` constant applies._

```js
// @143556
,className:H(M,`framer-1gkvrwn`,d,y),"data-border":!0,"data-framer-name":`Desktop`,"data-highlight":!0,layoutDependency:O,layoutId:`FqWGGH9Ju`,onTap:j,ref:i,style:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`,borderBottomLeftRadius:12,borderBottomRightRadius:12,borderTopLeftRadius:12,borderTopRightRadius:12,...u},variants:{"FqWGGH9Ju-hover":{"--border-color":`var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))`,backgroundColor:`var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))`}},...Ha({"FqWGGH9Ju-hover":{"data-framer-name":void 0},w5clkESbO:{"data-framer-name":`Tablet`},X7FQVeWxn:{"data-framer-name":`Phone`}},v,S),children:[D(A.div,{className:`framer-1rktaa5`,"data-framer-name":`Details`,layoutDependency:O,layoutId:`QCUVNPEBa`,children:[D(A.div,{className:`framer-34ef9s`,"data-framer-name":`Purchase Template`,layoutDependency:O,layoutId:`DrErbvfpa`,children:[D(A.div,{className:`framer-1cbou7l`,"data-framer-name":`Template Name`,layoutDependency:O,layoutId:`Va6h_e3Jn`,children:[b(q,{__fromCanvasComponent:!0,children:b(c,{children:b(A.p,{dir:`auto`,style:{"--font-selector":`R0Y7R2Vpc3Qt
```

```js
// @150356
 36))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8},children:b(je,{background:{alt:``,fit:`fill`,intrinsicHeight:128,intrinsicWidth:100,loading:me((l?.y||0)+(4+((l?.height||61)-8-60)/2)+0),pixelHeight:128,pixelWidth:100,sizes:`80px`,src:`https://framerusercontent.com/images/GBjHpEIYOMQ4OX3KkbWMP40QU.png?width=100&height=128`},className:`framer-15d7y5z`,fitImageDimension:`height`,layoutDependency:O,layoutId:`rgrdq0Flk`,...Ha({"FqWGGH9Ju-hover":{background:{alt:``,fit:`fill`,intrinsicHeight:128,intrinsicWidth:100,loading:me((l?.y||0)+(4+((l?.height||61)-8-60)/2)+-50),pixelHeight:128,pixelWidth:100,sizes:`80px`,src:`https://framerusercontent.com/images/GBjHpEIYOMQ4OX3KkbWMP40QU.png?width=100&height=128`}},X7FQVeWxn:{background:{alt:``,fit:`fill`,intrinsicHeight:128,intrinsicWidth:100,loading:me((l?.y||0)+(4+((l?.height||48)-8-53)/2)+0),pixelHeight:128,pixelWidth:100,sizes:`60px`,src:`https://framerusercontent.com/images/GBjHpEIYOMQ4OX3KkbWMP40QU.png?width=100&height=128`}}},v,S)})})]})})})})}),[`.framer-Ixlxu.framer-vecumv, .f
```

```js
// @158296
f/submit`,className:H(M,`framer-19cj0jd`,u,g),"data-border":!0,"data-framer-name":`Primary`,layoutDependency:w,layoutId:`EJmh9KJfM`,nodeId:`EJmh9KJfM`,ref:i,style:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,backgroundColor:`var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))`,borderBottomLeftRadius:12,borderBottomRightRadius:12,borderTopLeftRadius:12,borderTopRightRadius:12,...l},variants:{"EJmh9KJfM-hover":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`},"WX0LAmfO7-hover":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`},"xrhwSR_Qt-hover":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`},WX0LAmfO7:{"--border-color":`var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))`},xrhwSR_Qt:{"--border-color":`var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))`}},...no({"EJmh9KJfM-hover":{"data-framer-name":void 0},"WX0LAmfO7-hover":{"data-framer-name":void 0},"xrhwSR_Qt-hover":{"data-framer-name":void 0},WX0LAmfO7:{"data-framer-name":`Invalid`},xrhwSR_Qt:{"data-framer-name":`Focus`}},m,y),children:e=>b(h,{children:D(A.label,{className:`framer-s4lpcw`,layoutDependency:w,layoutId:`VgNZpoqQN`,children:[b(De,{className:`framer-rr54o1`,inputName:`Email`,layoutDependency:w,layoutId:`vV1N87Ghm`,onBlur:k,onFocus:O,onInvalid:ne,placeholder:`name@framer.com`,required:!0,style:{"--framer-input-border-radius-bottom-left":`10px`,"--framer-input-border-radius-bottom-right":`10px`,"--framer-input-border-radius-top-left":`10px`,"--framer-input-border-radius-top-right":`10px`,"--framer-input-font-color":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))`,"--framer-input-icon-color":`rgb(153, 153, 153)`,"--framer-input-placeholder-color":`var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))`},type:`email`,...no({"WX0LAmfO7-hover":{onFocus:void 0},WX0LAmfO7:{onFocus:void 0,onValid:j}},m,y)}),b(W,{height:32,y:(c?.y||0)+4+0+0,children:b(G,{className:`framer-1jl1owp-container`,layoutDependency:w,layoutId:`XNOQFfc27-container`,nodeId:`XNOQFfc27`,rendersWithMotion:!0,scopeId:`gqT9AQ1GA`,children:b(bt,{height:`100%`,I0Xd6ivlu:`Error`,id:`XNOQFfc27`,layoutId:`XNOQFfc27`,type:`submit`,variant:uo(e,{error:`sTeqYCuJm`,pending:`Gzs7KLdOZ`,success:`nqdgF8hBS`},lo(`ZVS9uEAOl`)),width:`100%`,ZkWpyy_im:`Subscribe`,...no({WX0LAmfO7:{variant:uo(e,{error:`sTeqYCuJm`,pending:`Gzs7KLdOZ`,success:`nqdgF8hBS`},lo(`EAtv73LHu`))}},m,y)
```

```js
// @218931
isPressed:!1}),_&&await _(...e)===!1)return!1}),N=H(Qs,vt,hn);return b(ie,{id:d??a,children:b(nc,{animate:O,initial:!1,children:b(tc,{value:ec,children:b(qe,{href:g,motionChild:!0,nodeId:`euEFdaNnL`,openInNewTab:!1,scopeId:`DIUDV3sid`,smoothScroll:!0,children:D(A.a,{...v,...S,className:`${H(N,`framer-vmtksx`,u,x)} framer-j3j25d`,"data-framer-name":`Variant 1`,"data-highlight":!0,layoutDependency:k,layoutId:`euEFdaNnL`,onTap:M,ref:i,style:{backgroundColor:`rgba(0, 0, 0, 0)`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8,...l},variants:{"euEFdaNnL-hover":{backgroundColor:`var(--token-efb6b80c-ff66-4fd5-b06e-7af1e4433402, rgb(41, 37, 36))`},"euEFdaNnL-pressed":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`}},...Xs({"euEFdaNnL-hover":{"data-framer-name":void 0},"euEFdaNnL-pressed":{"data-framer-name":void 0}},y,C),children:[b(A.div,{className:`framer-1l4uu33`,"data-border":!0,"data-framer-name":`Icon Container`,layoutDependency:k,layoutId:`bHOUHyw69`,style:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`,borderBottomLeftRadius:8,borderBottomRightRadius:8,bor
```

```js
// @228204
:O,initial:!1,children:b(pc,{value:fc,children:b(qe,{href:g,motionChild:!0,nodeId:`pxibwfkvW`,openInNewTab:!1,scopeId:`NvTyMkkvL`,smoothScroll:!0,children:D(A.a,{...v,...S,className:`${H(N,`framer-twqgdr`,u,x)} framer-li3w5f`,"data-framer-name":`Desktop`,"data-highlight":!0,layoutDependency:k,layoutId:`pxibwfkvW`,onTap:M,ref:i,style:{backgroundColor:`rgba(0, 0, 0, 0)`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8,...l},variants:{"MmZAy1YB2-pressed":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`},"pxibwfkvW-hover":{backgroundColor:`var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))`}},...sc({"MmZAy1YB2-pressed":{"data-framer-name":void 0},"pxibwfkvW-hover":{"data-framer-name":void 0},MmZAy1YB2:{"data-framer-name":`Horizontal`}},y,C),children:[b(xe,{animated:!0,className:`framer-4w5gwx`,Component:p,layoutDependency:k,layoutId:`UfoPd5ae4`}),D(A.div,{className:`framer-1oh6ac6`,"data-framer-name":`Content`,layoutDependency:k,layoutId:`ZcMglEl9J`,children:[b(q,{__fromCanvasComponent:!0,children:b(c,{children:b(A.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)))`},children:`Cortex`})
```

```js
// @235697
isPressed:!1}),h&&await h(...e)===!1)return!1}),ne=H(Sc,vt);return b(ie,{id:d??a,children:b(Ec,{animate:T,initial:!1,children:b(Tc,{value:wc,children:b(qe,{href:m,motionChild:!0,nodeId:`kwVzVR2l6`,openInNewTab:!1,scopeId:`XnG_KAtqY`,smoothScroll:!0,children:b(A.a,{...g,...x,className:`${H(ne,`framer-8f32ni`,u,v)} framer-1r7ki18`,"data-framer-name":`Variant 1`,"data-highlight":!0,layoutDependency:E,layoutId:`kwVzVR2l6`,onTap:k,ref:i,style:{backgroundColor:`rgba(0, 0, 0, 0)`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8,...l},variants:{"kwVzVR2l6-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(41, 37, 36))`},"kwVzVR2l6-pressed":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`}},...bc({"kwVzVR2l6-hover":{"data-framer-name":void 0},"kwVzVR2l6-pressed":{"data-framer-name":void 0}},_,ee),children:b(q,{__fromCanvasComponent:!0,children:b(c,{children:b(A.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249)))`},children:`Integrations`})}),className:`framer-1f2tqf3`,"data-framer-name":`Title`,fonts:[`Inter`],layoutDependency:E,layoutId:`WMJBzfSiQ`,style:{"--extracted-r6o4lv":`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 25
```

### canvas (8 matches, 4 windows)

_canvas / WebGL code to port verbatim (shader source, uniforms, draw loop)._

```js
// @175805
new Gt(R,3)),Re.setAttribute(`aTip`,new Gt(z,1,!1)),Re.setAttribute(`aLong`,new Gt(V,1,!1)),Re.setAttribute(`aSimCell`,new Gt(H,2)),Re.setIndex(new Gt(ve,1));let Be=new At(N,re,{type:Ut,format:Ft,minFilter:Ot,magFilter:Ot}),He=Be.clone(),Ue=new It(-1,1,1,-1,0,1),We=new Ht(2,2),Ge=new Mt({uniforms:{tData:{value:Ie},uAtlasPos:{value:P.clone()},uAtlasVel:{value:F.clone()},uDataTarget:{value:ae.clone()}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tData;
                uniform vec4 uAtlasPos;
                uniform vec4 uAtlasVel;
                uniform vec4 uDataTarget;
                varying vec2 vUv;

                vec2 atlasUV(vec2 cellUv, vec4 region) {
                    return cellUv * region.xy + region.zw;
                }
                vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) {
                    return (atlasUv - region.zw) / region.xy;
                }

                void main() {
                    bool isVelocity = vUv.y >= uAtlasVel.w;
                    if (isVelocity) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                    }
                    vec2 cellUv = cellUVfromAtlas(vUv, uAtlasPos);
                    vec3 restPos = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
                    gl_FragColor = vec4(restPos, 1.0);
                }
            `}),Ke=new Rt;Ke.add(new Wt(We,Ge)),_.setRenderTarget(Be),_.render(Ke,Ue),_.setRenderTarget(He),_.render(Ke,Ue),_.setRenderTarget(null),Ke.clear(),Ge.dispose();let qe=new Rt,Je=new Mt({uniforms:{tPrev:{value:Be.texture},tData:{value:Ie},uMouse:{value:new Yt(o,o)},uDelta:{value:0},uRadius:{value:Pe.get()},uStrength:{value:Fe.get()},uSpring:{value:Le.get()},uDamping:{value:ze.get()},uMaxVelocity:{value:Ve.get()},uHighlightRadius:{value:De.get()},uHighlightSpeed:{value:Ae.get()},uAtlasPos:{value:P.clone()},uAtlasVel:{value:F.clone()},uDataTarget:{value:ae.clone()},uDataHighlightRef:{value:oe.clone()}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tPrev;
                uniform sampler2D tData;
                uniform vec2  uMouse;
                uniform float uDelta;
                uniform float uRadius;
                uniform float uStrength;
                uniform float uSpring;
                uniform float uDamping;
                uniform float uMaxVelocity;
                uniform float uHighlightRadius;
                uniform float uHighlightSpeed;
                uniform vec4  uAtlasPos;
                uniform vec4  uAtlasVel;
                uniform vec4  uDataTarget;
  
```

```js
// @182713
(-x) matches it to
                    // first order and is stable for all inputs.
                    vel *= exp(-uDamping * uDelta);

                    pos += vel * uDelta;

                    // --- Highlight — distance from mouse to the nordwell's tip ---
                    float tipDist = length(uMouse - highlightRef.xy);
                    float target  = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);
                    highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
                    highlight = clamp(highlight, 0.0, 1.0);

                    gl_FragColor = isVelocity
                        ? vec4(vel, highlight)
                        : vec4(pos, 1.0);
                }
            `});qe.add(new Wt(We,Je));let Ye=new Mt({uniforms:{uTime:{value:0},uIntroProgress:{value:me.get()},uNoiseStrength:{value:B.get()},uNoiseScale:{value:ge.get()},uTubeRadius:{value:t},uTipRadius:{value:he.get()},uTipTexture:{value:le.current},uTipLayers:{value:r},uSizeVariance:{value:_e.get()},uDispersionOffset:{value:ye.get()},uDispersionBand:{value:xe.get()},uDispersion:{value:Ce.get()},uStrandOpacity:{value:Te.get()},uHighlightStrength:{value:Oe.get()
```

```js
// @188319
ionOffset * cycle;
        gl_Position = projectionMatrix * centerView;
    } else {
        float angle     = aSide * (2.0 * 3.14159265359 / 3.0);
        vec3 tangent    = aDir;
        vec3 worldUp    = abs(tangent.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0);
        vec3 right      = normalize(cross(tangent, worldUp));
        vec3 up         = normalize(cross(right, tangent));
        vec3 radial     = cos(angle) * right + sin(angle) * up;
        vec3 extruded   = displacedPos + radial * uTubeRadius;
        gl_Position     = projectionMatrix * modelViewMatrix * vec4(extruded, 1.0);
    }
}
`,fragmentShader:`
uniform float uTime;
uniform float uTipLayers;
uniform float uDispersionBand;
uniform float uDispersion;
uniform float uStrandOpacity;
uniform float uHighlightStrength;
uniform float uPulseStrength;
uniform float uPulseSpeedBase;
uniform float uPulseSpeedRandomMax;
uniform float uIntroProgress;
uniform sampler2D uTipTexture;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;

void main() {
    vec3 color = vec3(0.0);

    // Reveal the nordwell along its own length as Intro Progress increases,
    // root first: each point becomes visible 
```

```js
// @189994
1.0 - pulseDist);
    float pulse      = exp(-pulseDist * pulseDist * mix(5000.0, 10000.0, vRandom.y)) * vUV.x * uPulseStrength;

if (vTip > 0.5) {
        vec2 centered = vUV.xy - vec2(0.5);
        if (length(centered) > 0.5) discard;
        float uvMin = 0.5 - uDispersionBand * 0.5;
        float uvMax = 0.5 + uDispersionBand * 0.5;
        float texU  = mix(uvMin, uvMax, vUV.z);
        float texV  = uDispersion * vRandom.x;
        color = texture2D(uTipTexture, vec2(texU, texV)).xyz;

        float a = clamp((vRandom.y / uTipLayers) * clamp(uIntroProgress, 0.0, 1.0), 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    } else {
        vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0 * 1.0, uDispersion)).xyz;
        color = vec3(uStrandOpacity);
        color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
        color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;

        float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1
                         + vHighlight * vUV.x * vUV.x) * reveal, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    }
}
`,transparent:!0,depthTest:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:201,blendDstAlpha:201});se.current=Ye;let Xe=new Wt(Re,Ye);y.add(Xe),Xe.updateWorldMatrix(!0,!1);let Ze=Xe.matrixWorld.clone().invert(),Qe=document.visibilityState===`visible`,$e=!1,et=()=>{if(n.halted()){_.setAnimationLoop(null);return}Qe&&$e?_.setAnimationLoop(ft):_.setAnimationLoop(null)},tt=()=>{Qe=document.visibilityState===`visible`,et()};document.addEventListener(`visibilitychange`,tt);let nt=new Yt(o,o),rt=
```

## lYRm1Ytba0fEaT72gO8Y3cQH-To3rzGeaa6VatF3SJ8.d_xe5FNF.mjs (351 KB)

### transition constants

```js
const si={bounce:.2,delay:0,duration:.4,type:`spring`}
const Si={bounce:.2,delay:0,duration:.4,type:`spring`}
const ca={bounce:.2,delay:0,duration:.4,type:`spring`}
const Sa={bounce:.2,delay:0,duration:.4,type:`spring`}
const Pa={bounce:.2,delay:0,duration:.4,type:`spring`}
const Ja={bounce:.2,delay:0,duration:.4,type:`spring`}
const co={bounce:.2,delay:0,duration:.4,type:`spring`}
const xo={bounce:.2,delay:0,duration:.4,type:`spring`}
const Uo={bounce:.2,delay:0,duration:.4,type:`spring`}
const ss={bounce:.2,delay:0,duration:.4,type:`spring`}
const Ss={bounce:.2,delay:0,duration:.4,type:`spring`}
const Ks={delay:0,duration:.3,ease:[.12,.23,.5,1],type:`tween`}
const qc={bounce:.2,delay:0,duration:.4,type:`spring`}
```

### scroll-transform (1 match, 1 window)

_Framer "Enter" effect: scroll-progress-linked (offset start end / end end), first target = from state, __framer__spring = chase spring. NOT whileInView._

```js
// @312858
ildren:d(cn,{height:`100%`,id:`VnQCbEVki`,layoutId:`VnQCbEVki`,OBAEvnEgE:`View integrations`,onXXimdNH:e[0],width:`100%`})})})})})]}),d(Dc,{__framer__animate:{transition:qc},__framer__animateOnce:!0,__framer__enter:Kc,__framer__exit:Jc,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-n9voe3`,"data-framer-name":`Visual`,children:d(Q,{breakpoint:x,overrides:{unRQ49xdc:{height:360,width:`calc(min(${f?.width||`100vw`}, 1400px) - 32px)`}},children:d(K,{height:474,width:`642px`,children:d(Ec,{__framer__styleTransformEffectEnabled:!0,__framer__transformTargets:[{target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:120,y:0}},{ref:X,target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:0}}],__framer__transformTrigger:`onScrollTarget`,__framer__transformViewportThreshold:1,__perspectiveFX:!1,__targetOpacity:1,className:`framer-6okzgi-container`,nodeId:`FTLhHUANj`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(Q,{breakpoint:x,overrides:{unRQ49xdc:{boRManxAv:4,variant:$(`m29m57BbI`)}},children:d(Ft,{boRManxAv:3,height:`100%`,id:`FTLhHUANj`,layoutId:`FTLhHUANj`,style:{height:`100%`
```

### scroll-target (1 match, 1 window)

_transform driven by a scroll marker element (fixed nav reveal)._

```js
// @313059
framer__enter:Kc,__framer__exit:Jc,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-n9voe3`,"data-framer-name":`Visual`,children:d(Q,{breakpoint:x,overrides:{unRQ49xdc:{height:360,width:`calc(min(${f?.width||`100vw`}, 1400px) - 32px)`}},children:d(K,{height:474,width:`642px`,children:d(Ec,{__framer__styleTransformEffectEnabled:!0,__framer__transformTargets:[{target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:120,y:0}},{ref:X,target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:0}}],__framer__transformTrigger:`onScrollTarget`,__framer__transformViewportThreshold:1,__perspectiveFX:!1,__targetOpacity:1,className:`framer-6okzgi-container`,nodeId:`FTLhHUANj`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(Q,{breakpoint:x,overrides:{unRQ49xdc:{boRManxAv:4,variant:$(`m29m57BbI`)}},children:d(Ft,{boRManxAv:3,height:`100%`,id:`FTLhHUANj`,layoutId:`FTLhHUANj`,style:{height:`100%`,width:`100%`},variant:$(`hgluiL7kw`),width:`100%`})})})})})})]})}),d(g.div,{className:`framer-141n56s`,"data-framer-name":`Testimonials`,layout:k,children:p(`div`,{className:`framer-10ev3ja`,"data-bor
```

### variant-on-scroll (5 matches, 5 windows)

_variant switch by scroll ranges built from __framer__targets refs; animateOnce:false flips back._

```js
// @260649
,d(I,{children:d(En,{animated:!1,className:`framer-10wb9cu`,layoutId:`nFFDeLPfx`,q62kEvdOf:!0})}),d(I,{children:d(An,{animated:!1,className:`framer-10v9rg4`,layoutId:`IuS6NMSGg`,q62kEvdOf:!0})})]}),d(Q,{breakpoint:x,overrides:{rEV9rZoMS:{width:`min(${f?.width||`100vw`}, 1400px)`},unRQ49xdc:{width:`min(${f?.width||`100vw`}, 1400px)`}},children:d(K,{height:1,width:`min(${f?.width||`100vw`} - 128px, 1400px)`,children:d(W,{className:`framer-17vu96m-container`,nodeId:`Z3Ay9tvwc`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(gc,{__framer__animateOnce:!0,__framer__obscuredVariantId:`eaoQNLtEk`,__framer__threshold:1,__framer__variantAppearEffectEnabled:!0,__framer__visibleVariantId:`oPm9OVnZ7`,height:`100%`,id:`Z3Ay9tvwc`,layoutId:`Z3Ay9tvwc`,style:{width:`100%`},variant:$(`oPm9OVnZ7`),width:`100%`})})})})]})]})}),d(g.div,{className:`framer-r08n9p`,"data-framer-name":`Conversation`,layout:k,children:p(`div`,{className:`framer-12x5o77`,"data-border":!0,"data-framer-name":`Container`,children:[d(`div`,{className:`framer-ca5wfl`,"data-framer-name":`Tagline`,children:d(J,{__fromCanvasComponent:!0,children:d(s,{children:p(`h2`,{className:`framer-styles-preset-1p8mz83`,"data-styles-preset"
```

```js
// @310607
)]})}),d(g.div,{className:`framer-65i7ss`,"data-framer-name":`Integrations`,id:ae,layout:k,ref:X,children:p(`div`,{className:`framer-vedlvf`,"data-border":!0,"data-framer-name":`Container`,children:[d(Q,{breakpoint:x,overrides:{rEV9rZoMS:{width:`min(${f?.width||`100vw`}, 1400px)`},unRQ49xdc:{width:`min(${f?.width||`100vw`}, 1400px)`}},children:d(K,{height:1,width:`min(${f?.width||`100vw`} - 128px, 1400px)`,children:d(W,{className:`framer-ixio0v-container`,nodeId:`j9EHuYhM7`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(gc,{__framer__animateOnce:!0,__framer__obscuredVariantId:`eaoQNLtEk`,__framer__threshold:1,__framer__variantAppearEffectEnabled:!0,__framer__visibleVariantId:`oPm9OVnZ7`,height:`100%`,id:`j9EHuYhM7`,layoutId:`j9EHuYhM7`,style:{width:`100%`},variant:$(`oPm9OVnZ7`),width:`100%`})})})}),p(`div`,{className:`framer-19csyfa`,"data-framer-name":`Context`,children:[p(`div`,{className:`framer-mjvzh3`,"data-framer-name":`Context`,children:[d(J,{__fromCanvasComponent:!0,children:d(s,{children:d(`h2`,{className:`framer-styles-preset-1p8mz83`,"data-styles-preset":`omEb8Ipew`,dir:`auto`,style:{"--framer-text-color":`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 
```

```js
// @312532
webPageId:`l8a9kFfGN`},implicitPathVariables:void 0},{href:{webPageId:`l8a9kFfGN`},implicitPathVariables:void 0}],children:e=>d(K,{height:26,children:d(W,{className:`framer-1419ixl-container`,nodeId:`VnQCbEVki`,scopeId:`augiA20Il`,children:d(Q,{breakpoint:x,overrides:{rEV9rZoMS:{onXXimdNH:e[1]},unRQ49xdc:{onXXimdNH:e[2]}},children:d(cn,{height:`100%`,id:`VnQCbEVki`,layoutId:`VnQCbEVki`,OBAEvnEgE:`View integrations`,onXXimdNH:e[0],width:`100%`})})})})})]}),d(Dc,{__framer__animate:{transition:qc},__framer__animateOnce:!0,__framer__enter:Kc,__framer__exit:Jc,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-n9voe3`,"data-framer-name":`Visual`,children:d(Q,{breakpoint:x,overrides:{unRQ49xdc:{height:360,width:`calc(min(${f?.width||`100vw`}, 1400px) - 32px)`}},children:d(K,{height:474,width:`642px`,children:d(Ec,{__framer__styleTransformEffectEnabled:!0,__framer__transformTargets:[{target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:120,y:0}},{ref:X,target:{opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:0}}],__framer__transformTrigger:`onScrollTarget`,__framer__transformViewportTh
```

```js
// @316386
saved per week across the ops team`,width:`100%`,wWNMlWkQY:`80%`,Y4j3QcLtL:`"We used to stitch together Salesforce, Stripe, and Postgres by hand every Monday. Now it's one conversation."`})})})})}),d(Q,{breakpoint:x,overrides:{rEV9rZoMS:{width:`min(${f?.width||`100vw`}, 1400px)`},unRQ49xdc:{width:`min(${f?.width||`100vw`}, 1400px)`}},children:d(K,{height:1,width:`min(${f?.width||`100vw`} - 128px, 1400px)`,children:d(W,{className:`framer-1bxf2yj-container`,nodeId:`MSwOXYRCw`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(gc,{__framer__animateOnce:!0,__framer__obscuredVariantId:`eaoQNLtEk`,__framer__threshold:1,__framer__variantAppearEffectEnabled:!0,__framer__visibleVariantId:`oPm9OVnZ7`,height:`100%`,id:`MSwOXYRCw`,layoutId:`MSwOXYRCw`,style:{width:`100%`},variant:$(`oPm9OVnZ7`),width:`100%`})})})})]})}),d(g.div,{className:`framer-1ycn8bz`,"data-framer-name":`Statistics`,id:Z,layout:k,ref:le,children:p(`div`,{className:`framer-74z6vi`,"data-border":!0,"data-framer-name":`Container`,children:[d(`div`,{className:`framer-fjarzo`,children:d(J,{__fromCanvasComponent:!0,children:d(s,{children:p(`h2`,{className:`framer-styles-preset-1p8mz83`,"data-styles-preset":`omEb8Ipew`,dir:`auto
```

```js
// @324084
86d, rgb(161, 161, 161))`},children:`Saved per team per week`})}),className:`framer-1nu5b4j`,"data-framer-name":`Description`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]})]})]}),d(Q,{breakpoint:x,overrides:{rEV9rZoMS:{width:`min(${f?.width||`100vw`}, 1400px)`},unRQ49xdc:{width:`min(${f?.width||`100vw`}, 1400px)`}},children:d(K,{height:1,width:`min(${f?.width||`100vw`} - 128px, 1400px)`,children:d(W,{className:`framer-qwko6a-container`,nodeId:`YPSDP79B7`,rendersWithMotion:!0,scopeId:`augiA20Il`,children:d(gc,{__framer__animateOnce:!0,__framer__obscuredVariantId:`eaoQNLtEk`,__framer__threshold:1,__framer__variantAppearEffectEnabled:!0,__framer__visibleVariantId:`oPm9OVnZ7`,height:`100%`,id:`YPSDP79B7`,layoutId:`YPSDP79B7`,style:{width:`100%`},variant:$(`oPm9OVnZ7`),width:`100%`})})})})]})}),d(g.div,{className:`framer-ao75xt`,"data-framer-name":`FAQ`,layout:k,children:p(`div`,{className:`framer-1l77w07`,"data-border":!0,"data-framer-name":`Container`,children:[p(`div`,{className:`framer-1qqompg`,"data-framer-name":`Label Stack`,children:[d(J,{__fromCanvasComponent:!0,children:d(s,{children:d(`h2`,{className:`framer-styles-preset-1p8mz83`,"data-styles-preset":`omEb
```

### ticker (10 matches, 1 window)

_Ticker component props: speed, direction, gap, hover, fade edges, draggable._

```js
// @259369
3c`,"data-border":!0,"data-framer-name":`Title`,children:d(J,{__fromCanvasComponent:!0,children:d(s,{children:d(`p`,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))`},children:`Trusted by 56+ teams who are tired of tab-switching`})}),className:`framer-1hltyaa`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})})}),p(`div`,{className:`framer-149ica6`,"data-border":!0,"data-framer-name":`Ticker Container`,children:[p(mc,{className:`framer-1qbqem3`,tickerEffectAlign:`center`,tickerEffectDirectionModifier:`default`,tickerEffectDraggable:!1,tickerEffectEnabled:!0,tickerEffectGap:`46px`,tickerEffectHoverModifier:100,tickerEffectOverflow:`clip`,tickerEffectPosition:`relative`,tickerEffectStackDirection:`row`,tickerEffectVelocity:50,children:[d(I,{children:d(kn,{animated:!1,className:`framer-9jncga`,layoutId:`c8x4F7End`,q62kEvdOf:!0})}),d(I,{children:d(Cn,{animated:!1,className:`framer-1vynhgh`,layoutId:`jEO3wjEJJ`,q62kEvdOf:!0})}),d(I,{children:d(xn,{animated:!1,className:`framer-123r8k1`,layoutId:`xclNBxXuC`,q62kEvdOf:!0})}),d(I,{children:d(jn,{animated:!1,className:`framer-bo08ni`,layoutId:`d4UZ2Wbig`,q62kEvdOf:!0})}),d(I,{children:d(En,{animated:!1,className:`framer-10wb9cu`,layoutId:`nFFDeLPfx`,q62kEvdOf:!0})}),d(I,{children:d(An,{animated:!1,className:`framer-10v9rg4`,layoutId:`IuS6NMSGg`,q62
```

### loop (1 match, 1 window)

_infinite loops (pulses, rotating arrows)._

```js
// @227624
0,fonts:[]},..._s,...vs],{supportsExplicitInterCodegen:!0}),As.loader={load:(e,t)=>(t.locale,Promise.allSettled([k(ms,{},t)]))}}));function Ms({speed:e,text:n,gap:r,font:i}){let o=t(null),s=t(null),[l,u]=c(!1),f=_(`0%`);a(()=>{f.set(`0%`);let e=o.current,t=s.current;if(!e||!t)return;let n=()=>{let n=e.offsetWidth,r=t.scrollWidth;u(r>n)};n();let r=new ResizeObserver(n);return r.observe(e),r.observe(t),()=>{r.disconnect()}},[e,n,r,i]),a(()=>{if(!l){f.set(`0%`);return}let t=o.current,n=s.current;if(!t||!n)return;let r=n.scrollWidth;f.set(`0%`);let i=C(f,[`0%`,`-100%`],{duration:r/e,ease:`linear`,repeat:1/0});return()=>i.stop()},[l,e,r]);let m=l?`linear-gradient(90deg, ${Fs}, ${Is} ${Ns}, ${Is} ${Ps}, ${Fs})`:`none`;return d(g.div,{ref:o,style:{display:`flex`,overflow:`hidden`,maskImage:m,WebkitMaskImage:m},children:p(g.div,{style:{flexShrink:0,color:`white`,width:`max-content`,display:`flex`,...i},children:[d(g.p,{ref:s,style:{padding:`0px ${r}px 0px 0px`,margin:0,marginBottom:0,x:f},children:n}),l&&d(g.p,{style:{padding:`0px ${r}px 0px 0px`,margin:0,marginBottom:0,x:f},children:n})]})})}var Ns,Ps,Fs,Is,Ls=e((()=>{f(),D(),E(),i(),Ns=`7%`,Ps=`93%`,Fs=`#0000`,Is=`#000`,B(Ms,{speed:{type
```

### scroll-hook (2 matches, 2 windows)

_custom scroll-linked code components._

```js
// @8799
r-bEAlb`,r),layoutId:i,ref:t,role:`presentation`,style:{"--1m973uw":o,"--js9iwy":s,...n},viewBox:`0 0 24 24`,children:d(`use`,{href:l})})}),[`.framer-bEAlb { -webkit-mask: ${Zn}; aspect-ratio: 1; display: block; mask: ${Zn}; width: 24px; }`],`framer-bEAlb`),rr.displayName=`Message Circle Question Mark`,B(rr,{P_DcoRcrY:{defaultValue:`rgb(0, 0, 0)`,hidden:!1,title:`Color`,type:X.Color},JEeZYcamG:{defaultValue:2,displayStepper:!0,hidden:!1,max:16,min:1,title:`Width`,type:X.Number}})}));function ar({sections:e,sectionName:n,...r}){let i=t(null);a(()=>{i.current=document.getElementById(n)},[]);let{scrollYProgress:o}=b({target:i,offset:[`start start`,`end start`]}),s=y(o,{stiffness:300,damping:30}),c=x(s,[0,1],[`50%`,`-50%`]);return p(`div`,{style:{height:`100%`,maskImage:`linear-gradient(0deg, ${ur}, ${dr} ${cr}, ${dr} ${lr}, ${ur})`,display:`flex`,alignItems:`center`},children:[d(g.div,{style:{display:`flex`,flexDirection:`column`,position:`relative`,marginBottom:`calc(${r.font?.lineHeight??0})`,y:c},children:[...Array(e)].map((t,n)=>{let i=n===e-1,a=n*(1/(e-1)),o=(n+1)*(1/(e-1));return d(or,{index:n+1,range:[a,o],progress:s,isLast:i,...r},`section-${n}`)})}),d(`div`,{style:{width:5,he
```

```js
// @37668
pe:X.Number,defaultValue:1.8,min:-10,max:10,step:.05}}},...rt})})),Lr=e((()=>{Ir(),Ir()}));function Rr({sectionName:e,slot:n,previewShape:i,...o}){let s=ne(),l=r.toArray(n),f=l.length;if(f===0)return d(`div`,{style:{width:`100%`,height:`100%`,borderRadius:16,border:`solid 1px #7733ee`,backgroundColor:`#7733ee30`,color:`#7733ee`,padding:`24px 48px`,fontSize:`1rem`,textAlign:`center`,display:`flex`,flexDirection:`column`,justifyContent:`center`},children:`Add components to inside the property panel`});let m=t(null);a(()=>{if(!e)return;let t=document.getElementById(e);m.current=t??null},[e]);let{scrollYProgress:h}=b({target:m,offset:[`start center`,`end center`]}),[_,y]=c(0);a(()=>h.on(`change`,e=>{if(f===0)return;let t=Math.floor(e*f),n=Math.min(Math.max(t,0),f-1);y(n)}),[h,f]);let S=u(()=>1/(f*2),[f]),C=x(x(h,e=>Br(S,1-S,e)),e=>zr(e,f)*.5+.3>0),[T,E]=c(!0);v(C,`change`,e=>{E(e)});let D=l[_];return p(`div`,{style:{width:`100%`,height:`100%`},children:[d(Fr,{...o,style:{position:`absolute`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`},currentShape:s?i:_}),d(w,{mode:`wait`,initial:!1,children:T&&d(g.div,{initial:{opacity:0,scale:.95,filter:`blur(8px)`},animate:{opacity:1,scal
```

### hover-variant (7 matches, 3 windows)

_gesture variant maps; the component `transition` constant applies._

```js
// @113462
copeId:`NSsiXZyio`,smoothScroll:!0,children:d(g.a,{...v,...S,className:`${H(N,`framer-572w4h`,u,b)} framer-gg8330`,"data-border":!0,"data-framer-name":`Default`,"data-highlight":!0,"data-reset":`button`,layoutDependency:k,layoutId:`clkwCB8KL`,onTap:M,ref:i,style:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-style":`solid`,"--border-top-width":`0px`,backgroundColor:`var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(17, 15, 13))`,...l},variants:{"clkwCB8KL-hover":{backgroundColor:`var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))`},"clkwCB8KL-pressed":{backgroundColor:`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`},pcuDVrfxv:{"--border-color":`var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))`}},...ga({"clkwCB8KL-hover":{"data-framer-name":void 0},"clkwCB8KL-pressed":{"data-framer-name":void 0},pcuDVrfxv:{"data-framer-name":`Selected`}},y,C),children:d(g.div,{className:`framer-ytmu5g`,layoutDependency:k,layoutId:`dLRFyrhrR`,children:d(J,{__fromCanvasComponent:!0,children:d(s,{children:d(g.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108)))`},children:`Cortex`})}),className:`framer-pjcgz9`,fonts:[`Inter`],layoutDependency:k,layoutId:`O71sAr9mB`,style:{"--extracted-r6o4lv":`var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108))`,"--framer-link-text-color":`rgb(0, 153, 255)`,"--framer-link-text-decoration":`underline`},text:_,variants:{"clkwCB8KL-hover":{"--extracted-r6o4lv":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))`},"clkwCB8KL-pressed":{"--extracted-r6o4lv":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))`},pcuDVrfxv:{"--extracted-r6o4lv":`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))`}},verticalAlignment:`top`,withExternalLayout:!0,...ga({"clkwCB8KL-hover":{children:d(s,{children:d(g.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)))`},children:`Cortex`})})},"clkwCB8KL-pressed":{children:d(s,{children:d(g.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)))`},children:`Cortex`})})},pcuDVrfxv:{children:d(s,{children:d(g.p,
```

```js
// @209769
,N),{activeVariantCallback:F,delay:I}=re(w),L=F(async(...e)=>{if(v&&await v(...e)===!1)return!1}),z=H(as,fn,Ne);return d(T,{id:m??a,children:d(ds,{animate:N,initial:!1,children:d(ls,{value:ss,children:p(g.div,{...C,...O,className:H(z,`framer-18wxj0v`,f,E),"data-border":!0,"data-framer-name":`Open`,layoutDependency:P,layoutId:`eWOqytebR`,ref:i,style:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-style":`solid`,"--border-top-width":`0px`,...u},...ts({"eJSmG59zF-hover":{"data-framer-name":void 0},eJSmG59zF:{"data-framer-name":`Closed`}},w,k),children:[p(g.div,{className:`framer-ictz1l`,"data-framer-name":`Container`,layoutDependency:P,layoutId:`lmVZFz4Vc`,children:[p(g.div,{className:`framer-z5btwm`,"data-framer-name":`Question Stack`,"data-highlight":!0,layoutDependency:P,layoutId:`d4ar7cUdq`,onTap:L,children:[d(g.div,{className:`framer-107e5o5`,"data-framer-name":`Center Question`,layoutDependency:P,layoutId:`kxD7zFmFK`,children:d(J,{__fromCanvasComponent:!0,children:d(s,{children:d(g.h3,{className:`framer-styles-preset-1b45yw5`,"data-styles-preset
```

```js
// @230171
s:b,clearLoadingGesture:x,gestureHandlers:S,gestureVariant:C,isLoading:w,setGestureState:E,setVariant:D,variants:O}=R({defaultVariant:`yT3VtMIJu`,enabledGestures:Hs,ref:i,variant:f,variantClassNames:Ws}),k=Qs(e,O),A=H(Us);return d(T,{id:u??a,children:d(Xs,{animate:O,initial:!1,children:d(Ys,{value:Ks,children:d(le,{href:m,motionChild:!0,nodeId:`yT3VtMIJu`,openInNewTab:!1,scopeId:`wufo75t5m`,children:p(g.a,{...v,...S,className:`${H(A,`framer-1hpvfsx`,l,b)} framer-102di93`,"data-framer-name":`Variant 1`,layoutDependency:k,layoutId:`yT3VtMIJu`,ref:i,style:{"--37nty6":Gs(_),...c},...Rs({"yT3VtMIJu-hover":{"data-framer-name":void 0}},y,C),children:[d(K,{height:24,children:d(q,{className:`framer-viz05f-container`,layoutDependency:k,layoutId:`go7zELkvD-container`,nodeId:`go7zELkvD`,rendersWithMotion:!0,scopeId:`wufo75t5m`,children:d(xe,{height:`100%`,id:`go7zELkvD`,layoutId:`go7zELkvD`,variant:qs(`l4Rq4ITVJ`),width:`100%`,ywl5n_DJu:`New`,...Rs({"yT3VtMIJu-hover":{variant:qs(`vzx6FkGP4`)}},y,C)})})}),p(g.div,{className:`framer-10o8lwh`,"data-framer-name":`Message`,layoutDependency:k,layoutId:`TYoJy9zAI`,children:[d(K,{height:16,children:d(q,{className:`framer-1m0muau-container`,layoutDependency:k,layoutId:`EzZVSiMQP-container`,nodeId:`EzZVSiMQP`,rendersWithMotion:!0,scopeId:`wufo75t5m`,transformTemplate:Js,children:d(mn,{height:`100%`,id:`EzZVSiMQP`,layoutId:`EzZVSiMQP`,variant:qs(`bAhGXCi73`),width:`100%`})})}),d(K,{children:d(q,{className:`framer-18d75j4-container`,isAuthoredByUser:!0,isModuleExternal:!0,layoutDependency:k,layoutId:`t0DIJ0vc7
```

### canvas (8 matches, 5 windows)

_canvas / WebGL code to port verbatim (shader source, uniforms, draw loop)._

```js
// @20591
0,Math.min(n,ne.length-1))],Te=new We,Ee=new He(-1,1,1,-1,0,1),De=new qe(2,2),Oe=new ze({uniforms:{tPrev:{value:Se.texture},tData:{value:re},uDelta:{value:.016},uSimSpring:{value:p},uSimDamping:{value:m},uSimMaxVelocity:{value:h},uSpringVariance:{value:S},uOpacitySpeed:{value:g},uActiveShapeTransform:{value:we.clone()},uT_velocity:{value:Q.clone()},uRtSize:{value:T},uRowsPerDataset:{value:w}},vertexShader:`
                varying vec2 vFragUV;
                void main() {
                    vFragUV = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tPrev;
                uniform sampler2D tData;
                uniform float uDelta;
                uniform float uSimSpring;
                uniform float uSimDamping;
                uniform float uSimMaxVelocity;
                uniform float uSpringVariance;
                uniform float uOpacitySpeed;
                uniform vec4  uActiveShapeTransform;
                uniform vec4  uT_velocity;
                uniform float uRtSize;
                uniform float uRowsPerDataset;

                // Squared-magnitude ceiling for sanity 
```

```js
// @26310
                        // uSimDamping * uDelta exceeds 1 — reachable at the top
                        // of the Sim Damping range on a slow frame — which
                        // flips the velocity sign and amplifies it every step
                        // until it overflows. exp(-x) matches it to first order
                        // and is stable for all inputs.
                        vel *= exp(-uSimDamping * uDelta);

                        float speed = length(vel);
                        if (speed > uSimMaxVelocity) vel = vel / speed * uSimMaxVelocity;

                        gl_FragColor = vec4(vel, 0.0, 1.0);

                    } else {
                        // Read current position + opacity from dataset 0 — this fragment's own UV
                        vec4 posData  = texture2D(tPrev, vFragUV);
                        vec2 pos      = posData.rg;
                        float opacity = posData.a;

                        // Read velocity from dataset 1
                        // Transform from dataset 0 cell UV (= vFragUV here) → dataset 1 UV
                        vec4 velData = texture2D(tPrev, transformUV(cellUV, uT_velocity));
                        v
```

```js
// @28088
  // simply be re-read from the other one next frame.
                        if (!(dot(pos, pos) < SANE_SQ)) pos = target.rg;
                        if (!(dot(vel, vel) < SANE_SQ)) vel = vec2(0.0);
                        if (!(opacity >= 0.0)) opacity = 0.0;

                        // Integrate position
                        pos += vel * uDelta;

                        // Linear opacity interpolation
                        opacity += (targetOpacity - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
                        opacity = clamp(opacity, 0.0, 1.0);

                        gl_FragColor = vec4(pos, 0.0, opacity);
                    }
                }
            `});F.current=Oe,Te.add(new Ye(De,Oe));let ke=new ze({uniforms:{tSim:{value:Se.texture},uTipTexture:{value:z.current},uTipRadius:{value:r},uTipLayers:{value:i},uSizeVariance:{value:s},uDispersionBand:{value:c},uDispersion:{value:l},uDispersionOffset:{value:x},uTime:{value:0}},vertexShader:`
                attribute vec2  aRandom;
                attribute vec2  aSimUV;
                attribute vec3  aUV;

                uniform sampler2D tSim;
                uniform float uTipRadius;
               
```

```js
// @30765
                  float sv = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
                    float ox = (aUV.x - 0.5) * 2.0 * uTipRadius * sv;
                    float oy = (aUV.y - 0.5) * 2.0 * uTipRadius * sv;
                    centerView.xy += vec2(ox, oy);

                    // Layer Z offset — spreads tip layers in depth with animated cycle
                    float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
                    centerView.z += aUV.z * uDispersionOffset * cycle;

                    gl_Position = projectionMatrix * centerView;
                }
            `,fragmentShader:`
                uniform float     uTipLayers;
                uniform float     uDispersionBand;
                uniform float     uDispersion;
                uniform sampler2D uTipTexture;

                varying vec2  vRandom;
                varying vec3  vUV;
                varying float vOpacity;

                void main() {
                    // Circular clip
                    vec2 centered = vUV.xy - vec2(0.5);
                    if (length(centered) > 0.5) discard;

                    // Sample tip texture — same as original tip branch
                    float uvMin = 0.5 - uDispersionBand * 0.5;
                    float uvMax = 0.5 + uDispersionBand * 0.5;
                    float texU  = mix(uvMin, uvMax, vUV.z);
                    float texV  = uDispersion * vRandom.x;

                    vec3 color = texture2D(uTipTexture, vec2(texU, texV)).xyz;

                    float alpha = vOpacity * (vRandom.y / uTipLayers);
                    gl_FragColor = vec4(color * alpha, alpha);
                }
            `,transparent:!0,depthTest:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:201,blendDstAlpha:201});I.current=ke;let Ae=new Ye(be,ke);y.add(Ae);let je=0,Me=document.visibilityState===`visible`,Ne=!1,Pe=()=>{if(a.halted()){d.setAnimationLoop(null);return}Me&&Ne?d.setAnimationLoop(Re):d.setAnimationLoop(null)},Ie=()=>{Me=document.visibilityState===`visible`,Pe()};document.addEventListener(`visibilitychange`,Ie);function Re(e){if(a.shouldStop())return;let t=e*.001,n=Math.min(t-je
```

```js
// @34296
clear(),d.dispose(),t.contains(f)&&t.removeChild(f),setTimeout(()=>d.forceContextLoss(),1)}},[b,i,k]),a(()=>{if(!y)return;let e=`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,t=`
            uniform sampler2D tDebug;
            varying vec2 vUv;
            void main() {
                vec4 data = texture2D(tDebug, vUv);
                vec3 rgb = data.rgb * 0.5 + 0.5;
                // Tint by alpha so opacity state is visible
                gl_FragColor = vec4(rgb + vec3(data.a * 0.3, 0.0, 0.0), 1.0);
            }
        `,n=V.current;if(!n)return;let r=.3,i=new qe(r,r),a=new ze({uniforms:{tDebug:{value:H.current}},vertexShader:e,fragmentShader:t,depthTest:!1,transparent:!1}),o=new Ye(i,a);o.position.set(-.4,-.4,.5),n.add(o);let s=new qe(r,r),c=new ze({uniforms:{tDebug:{value:ee.current}},vertexShader:e,fragmentShader:t,depthTest:!1,transparent:!1}),l=new Ye(s,c);return l.position.set(.4,-.4,.5),n.add(l),te.current=o,U.current=l,W.current=i,ne.current=s,re.current=a,G.current=c,()=>{let e=V.current;e&&te.current&&e.remove(te.current),e&&U.current&&e.remove(U.current),W.current?.dispose(),ne.current?.dispose(),re.current?.dispose(),G.current?.dispose(),te.current=null,U.current=null,W.current=null,ne.current=null,re.current=null,G.current=null}},[y,b,i,k]),d(it,{mountRef:D,showFallback:!O,fallbackImage:w,fallbackFit:T,fallbackAlt:E,style:C})}var Ir=e((()=>{n(),f(),D(),i(),Pe(),wt(),B(Fr,{refre
```

## HeroThreeJSV2.BLMtRZnd.mjs (33 KB)

### canvas (9 matches, 4 windows)

_canvas / WebGL code to port verbatim (shader source, uniforms, draw loop)._

```js
// @5858
Attribute(`aUV`,new g(k,3)),G.setAttribute(`aTip`,new g(je,1,!0)),G.setAttribute(`aAdvect`,new g(A,1)),G.setAttribute(`aSimCell`,new g(j,2)),G.setIndex(new g(M,1));let K=new ie(o,c,{type:he,format:se,minFilter:ne,magFilter:ne}),q=K.clone(),He=new ce(-1,1,1,-1,0,1),We=new me(2,2),Ke=new ae({uniforms:{tData:{value:W},uAtlasPos:{value:C.clone()},uAtlasVel:{value:w.clone()},uDataStart:{value:Oe.clone()}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tData;
                uniform vec4 uAtlasPos;
                uniform vec4 uAtlasVel;
                uniform vec4 uDataStart;
                varying vec2 vUv;

                vec2 atlasUV(vec2 cellUv, vec4 region) {
                    return cellUv * region.xy + region.zw;
                }
                vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) {
                    return (atlasUv - region.zw) / region.xy;
                }

                void main() {
                    bool isVelocity = vUv.y >= uAtlasVel.w;
                    if (isVelocity) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                    }
                    vec2 cellUv = cellUVfromAtlas(vUv, uAtlasPos);
                    vec3 startPos = texture2D(tData, atlasUV(cellUv, uDataStart)).rgb;
                    gl_FragColor = vec4(startPos, 0.0);
                }
            `}),J=new ue;J.add(new ge(We,Ke)),_.setRenderTarget(K),_.render(J,He),_.setRenderTarget(q),_.render(J,He),_.setRenderTarget(null),J.clear(),Ke.dispose();let Ye=new ue,Y=new ae({uniforms:{tPrev:{value:K.texture},tData:{value:W},uMouse:{value:new ye(0,0)},uDelta:{value:0},uRadius:{value:rt.get()},uStrength:{value:at.get()},uSpring:{value:st.get()},uDamping:{value:lt.get()},uMaxVelocity:{value:ut.get()},uHighlightRadius:{value:ht.get()},uHighlightSpeed:{value:yt.get()},uOpacitySpeed:{value:dt.get()},uElapsed:{value:0},uMaxDelay:{value:pt.get()},uAtlasPos:{value:C.clone()},uAtlasVel:{value:w.clone()},uDataTarget:{value:De.clone()},uDataStart:{value:Oe.clone()},uDataHighlightRef:{value:ke.clone()}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tPrev;
                uniform sampler2D tData;
                uniform vec2  uMouse;
                uniform float uDelta;
                uniform float uRadius;
                uniform float uStrength;
                uniform float uSpring;
                uniform float uDamping;
                uniform float uMaxVelocity;
                uniform float uHighlightRadius;
                uniform float uHighlightSpeed;
                uniform float uOpacitySpeed;
                uniform float uElapsed;
                uniform float uMaxDelay;
 
```

```js
// @15124
l share the same reference point so
                    // the highlight value is identical for the whole nordwell.
                    float tipDist = length(uMouse - highlightRef.xy);
                    float target  = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);

                    // Smooth lerp toward target — rises fast when mouse approaches,
                    // fades naturally when mouse moves away.
                    highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
                    highlight = clamp(highlight, 0.0, 1.0);

                    gl_FragColor = isVelocity
                        ? vec4(vel, highlight)
                        : vec4(pos, opacity);
                }
            `});Ye.add(new ge(We,Y));let X=new ae({uniforms:{uTime:{value:0},uDirection:{value:new h().copy(b.extrudeOffset).normalize()},uNoiseStrength:{value:ze.get()},uNoiseScale:{value:Be.get()},uRandomOffset:{value:b.randomOffset},uTubeRadius:{value:p},uTipRadius:{value:Re.get()},uTipTexture:{value:Fe.current},uTipLayers:{value:b.tipLayers},uSizeVariance:{value:Ze.get()},uDispersionOffset:{value:Qe.get()},uDispersionBand:{value:$e.get()},uDispersion:{val
```

```js
// @20559
atrix * centerView;
    } else {
        float sideIndex = round(aSide * 255.0);
        float angle     = sideIndex * (2.0 * 3.14159265359 / 3.0);
        vec3 tangent    = aDir;
        vec3 worldUp    = abs(tangent.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0);
        vec3 right      = normalize(cross(tangent, worldUp));
        vec3 up         = normalize(cross(right, tangent));
        vec3 radial     = cos(angle) * right + sin(angle) * up;
        vec3 extruded   = displacedPos + radial * uTubeRadius;
        gl_Position     = projectionMatrix * modelViewMatrix * vec4(extruded, 1.0);
    }
}
`,fragmentShader:`
uniform float uTime;
uniform float uTipLayers;
uniform float uDispersionBand;
uniform float uDispersion;
uniform float uStrandOpacity;
uniform float uHighlightStrength;
uniform float uPulseStrength;
uniform float uPulseSpeedBase;
uniform float uPulseSpeedRandomMax;
uniform sampler2D uTipTexture;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;
varying float vOpacity;

void main() {
    vec3 color = vec3(0.0);

    float pulseSpeed = uPulseSpeedBase + vRandom.x * uPulseSpeedRandomMax;
    float pulsePos   = fract(uTime * pulseSpeed);
    
```

```js
// @21865
  float pulse      = exp(-pulseDist * pulseDist * mix(5000.0, 10000.0, vRandom.y)) * vUV.x * uPulseStrength;

    if (vTip > 0.5) {
        vec2 centered = vUV.xy - vec2(0.5);
        if (length(centered) > 0.5) discard;
        float uvMin = 0.5 - uDispersionBand * 0.5;
        float uvMax = 0.5 + uDispersionBand * 0.5;
        float texU  = mix(uvMin, uvMax, vUV.z);
        float texV  = uDispersion * vRandom.x;
        color = texture2D(uTipTexture, vec2(texU, texV)).xyz;
        // color += vHighlight * color;
        float a = clamp((vRandom.y / uTipLayers) * vOpacity, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);    } else {
        vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0 * 1.0, uDispersion)).xyz;
        color = vec3(uStrandOpacity);
        color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
        color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;
        float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1
                         + vHighlight * vUV.x * vUV.x) * vOpacity, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    }

    // gl_FragColor = vec4(vec3(vUV.x), 1.0);
}
`,transparent:!0,depthTest:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:201,blendDstAlpha:201});R.current=X;let Z=new ge(G,X);Z.rotateX(Math.PI),be.add(Z),Z.updateWorldMatrix(!0,!1);let et=Z.matrixWorld.clone().invert(),nt=document.visibilityState===`visible`,it=!1,ot=()=>{if(t.halted()){_.setAnimationLoop(null);return}console.log(`[Hero] resume?`,{isPageVisible:nt,isIntersecting:it}),nt&&it?_.setAnimationLoop(kt):_.setAnimationLoop(null)},ct=()=>{nt=document.visibilityState===`visible`,ot()};document.ad
```

## cZrCCoVsg.6VaJQZpD.mjs (23 KB)

### transition constants

```js
const N={bounce:.2,delay:0,duration:.4,type:`spring`}
```

### hover-variant (40 matches, 2 windows)

_gesture variant maps; the component `transition` constant applies._

```js
// @4078
:o(u.a,{...E,...B,className:`${y(X,`framer-1qc2red`,p,F)} framer-1cr0tx1`,"data-framer-name":`Primary / XL`,"data-highlight":!0,"data-reset":`button`,layoutDependency:K,layoutId:`SLXZ3TqyB`,onTap:Y,ref:i,style:{"--border-bottom-width":`0px`,"--border-color":`rgba(0, 0, 0, 0)`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-style":`solid`,"--border-top-width":`0px`,backgroundColor:`var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))`,borderBottomLeftRadius:52,borderBottomRightRadius:52,borderTopLeftRadius:52,borderTopRightRadius:52,...d},variants:{"BWnx7Fy38-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"BWnx7Fy38-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(64, 64, 64))`},"daBcqLcSh-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"daBcqLcSh-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"Ds9QQ9qkS-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"Ds9QQ9qkS-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"f2aAwZgz0-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"f2aAwZgz0-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"g7qpmuQW4-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"g7qpmuQW4-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"h9PYQoRoX-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"h9PYQoRoX-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"iFFAFWtOn-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"iFFAFWtOn-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"IHmlIlwnQ-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"IHmlIlwnQ-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"ik7iddnck-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"ik7iddnck-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"IzROFuuuh-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"IzROFuuuh-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"kDJy4jmgf-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"kDJy4jmgf-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"L7FsmLiTr-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"L7FsmLiTr-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"my2k7r7SN-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"my2k7r7SN-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"nB7BDBw0L-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"nB7BDBw0L-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"nM0UY9btt-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"nM0UY9btt-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"QYaeAlmyR-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"QYaeAlmyR-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"SLXZ3TqyB-hover":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"SLXZ3TqyB-pressed":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"T_NyAgmeA-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"T_NyAgmeA-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"tXZIR3JON-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"tXZIR3JON-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"XSi82891F-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"XSi82891F-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},BWnx7Fy38:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`},daBcqLcSh:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`rgba(0, 0, 0, 0)`},Ds9QQ9qkS:{"--border-botto
```

```js
// @14057
-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-5f5af133-2080-4ffb-a775-1ed7714f667c, rgb(68, 64, 59))`},XSi82891F:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`},zCwaap2aN:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-5f5af133-2080-4ffb-a775-1ed7714f667c, rgb(68, 64, 59))`}},...O({"BWnx7Fy38-hover":{"data-framer-name":void 0},"BWnx7Fy38-pressed":{"data-framer-name":void 0},"daBcqLcSh-hover":{"data-framer-name":void 0},"daBcqLcSh-pressed":{"data-framer-name":void 0},"Ds9QQ9qkS-hover":{"data-framer-name":void 0},"Ds9QQ9qkS-pressed":{"data-framer-name":void 0},"f2aAwZgz0-hover":{"data-framer-name":void 0},"f2aAwZgz0-pressed":{"data-framer-name":void 0},"g7qpmuQW4-hover":{"data-framer-name":void 0},"g7qpmuQW4-pressed":{"data-framer-name":void 0},"h9PYQoRoX-hover":{"data-framer-name":void 0},"h9PYQoRoX-pressed":{"data-framer-name":void 0},"iFFAFWtOn-hover":{"data-framer-name":void 0},"iFFAFWtOn-pressed":{"data-framer-name":void 0},"IHmlIlwnQ-hover":{"data-framer-name":void 0},"IHmlIlwnQ-pressed":{"data-framer-name":void 0},"ik7iddnck-hover":{"data-framer-name":void 0},"ik7iddnck-pressed":{"data-framer-name":void 0},"IzROFuuuh-hover":{"data-framer-name":void 0},"IzROFuuuh-pressed":{"data-framer-name":void 0},"kDJy4jmgf-hover":{"data-framer-name":void 0},"kDJy4jmgf-pressed":{"data-framer-name":void 0},"L7FsmLiTr-hover":{"data-framer-name":void 0},"L7FsmLiTr-pressed":{"data-framer-name":void 0},"my2k7r7SN-hover":{"data-framer-name":void 0},"my2k7r7SN-pressed":{"data-framer-name":void 0},"nB7BDBw0L-hover":{"data-framer-name":void 0},"nB7BDBw0L-pressed":{"data-framer-name":void 0},"nM0UY9btt-hover":{"data-framer-name":void 0},"nM0UY9btt-pressed":{"data-framer-name":void 0},"QYaeAlmyR-hover":{"data-framer-name":void 0},"QYaeAlmyR-pressed":{"data-framer-name":void 0},"SLXZ3TqyB-hover":{"data-framer-name":void 0},"SLXZ3TqyB-pressed":{"data-framer-name":void 0},"T_NyAgmeA-hover":{"data-framer-name":void 0},"T_NyAgmeA-pressed":{"data-framer-name":void 0},"tXZIR3JON-hover":{"data-framer-name":void 0},"tXZIR3JON-pressed":{"data-framer-name":void 0},"XSi82891F-hover":{"data-framer-name":void 0},"XSi82891F-pressed":{"data-framer-name":void 0},BWnx7Fy38:{"data-framer-name":`Light / XL`},daBcqLcSh:{"data-framer-name":`Ghost / SM`},Ds9QQ9qkS:{"data-framer-name":`Light / XS`},f2aAwZgz0:{"data-border":!0,"data-framer-name":`Secondary / LG`},g7qpmuQW4:{"data-border":!0,"data-framer-name":`Secondary / SM`},h9PYQoRoX:{"data-framer-name":`Primary / XS`},iFFAFWtOn:{"data-framer-name":`Light / LG`},IHmlIlwnQ:{"data-framer-name":`Primary / LG`},ik7iddnck:{"data-framer-name":`Ghost / LG`},IzROFuuuh:{"data-framer-name":`Light / MD`},kDJy4jmgf:{"data-framer-name":
```

## VDI2v9hjz.CSIN71cc.mjs (23 KB)

### transition constants

```js
const B={bounce:.2,delay:0,duration:.4,type:`spring`}
```

### hover-variant (24 matches, 2 windows)

_gesture variant maps; the component `transition` constant applies._

```js
// @3632
`${y(le,`framer-dfxefx`,h,q)} framer-m5ryuf`,"data-framer-name":`Primary / XL`,"data-highlight":!0,"data-reset":`button`,layoutDependency:Q,layoutId:`WFn7l_ycj`,onMouseEnter:se,onMouseLeave:ce,onTap:oe,ref:a,style:{"--border-bottom-width":`0px`,"--border-color":`rgba(0, 0, 0, 0)`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-style":`solid`,"--border-top-width":`0px`,backgroundColor:`var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8,...m},variants:{"B_d5gslqy-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"B_d5gslqy-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"BdqgXl6NE-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"BdqgXl6NE-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"BpAaIYVEg-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"BpAaIYVEg-pressed":{"--border-color":`var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(82, 82, 82))`,backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"CHKefkC3P-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"CHKefkC3P-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"fjOBCDEe9-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"fjOBCDEe9-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"mpynBH2Cv-hover":{"--border-color":`var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`,backgroundColor:`var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))`},"mpynBH2Cv-pressed":{backgroundColor:`var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`},"n_hWf18Dw-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"n_hWf18Dw-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},"nltwK9VLK-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"nltwK9VLK-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"pXjM1fasS-hover":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`},"pXjM1fasS-pressed":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"SrE8wxvlP-hover":{backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`},"SrE8wxvlP-pressed":{backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"WFn7l_ycj-hover":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))`},"WFn7l_ycj-pressed":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`},"wuA86V8Cd-hover":{backgroundColor:`var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`},"wuA86V8Cd-pressed":{backgroundColor:`var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`},B_d5gslqy:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`rgba(0, 0, 0, 0)`},BdqgXl6NE:{"--border-bottom-width":`1px`,"--border-color":`var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(34, 34, 34))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,b
```

```js
// @9116
ackgroundColor:`var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`},pXjM1fasS:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`},SrE8wxvlP:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`},wuA86V8Cd:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`rgba(0, 0, 0, 0)`}},...F({"B_d5gslqy-hover":{"data-framer-name":void 0},"B_d5gslqy-pressed":{"data-framer-name":void 0},"BdqgXl6NE-hover":{"data-framer-name":void 0},"BdqgXl6NE-pressed":{"data-framer-name":void 0},"BpAaIYVEg-hover":{"data-framer-name":void 0},"BpAaIYVEg-pressed":{"data-framer-name":void 0},"CHKefkC3P-hover":{"data-framer-name":void 0},"CHKefkC3P-pressed":{"data-framer-name":void 0},"fjOBCDEe9-hover":{"data-framer-name":void 0},"fjOBCDEe9-pressed":{"data-framer-name":void 0},"mpynBH2Cv-hover":{"data-framer-name":void 0},"mpynBH2Cv-pressed":{"data-framer-name":void 0},"n_hWf18Dw-hover":{"data-framer-name":void 0},"n_hWf18Dw-pressed":{"data-framer-name":void 0},"nltwK9VLK-hover":{"data-framer-name":void 0},"nltwK9VLK-pressed":{"data-framer-name":void 0},"pXjM1fasS-hover":{"data-framer-name":void 0},"pXjM1fasS-pressed":{"data-framer-name":void 0},"SrE8wxvlP-hover":{"data-framer-name":void 0},"SrE8wxvlP-pressed":{"data-framer-name":void 0},"WFn7l_ycj-hover":{"data-framer-name":void 0},"WFn7l_ycj-pressed":{"data-framer-name":void 0},"wuA86V8Cd-hover":{"data-framer-name":void 0},"wuA86V8Cd-pressed":{"data-framer-name":void 0},B_d5gslqy:{"data-framer-name":`Ghost / LG`},BdqgXl6NE:{"data-border":!0,"data-framer-name":`Secondary / MD`},BpAaIYVEg:{"data-border":!0,"data-framer-name":`Secondary / LG`},CHKefkC3P:{"data-framer-name":`Light / MD`},fjOBCDEe9:{"data-framer-name":`Primary / LG`},mpynBH2Cv:{"data-border":!0,"data-framer-name":`Secondary / XL`},n_hWf18Dw:{"data-framer-name":`Ghost / MD`},nltwK9VLK:{"data-framer-name":`Light / LG`},pXjM1fasS:{"data-framer-name":`Light / XL`},SrE8wxvlP:{"data-framer-name":`Primary / MD`},wuA86V8Cd
```

## FQ7fHGkTD.D5uGLdFt.mjs (11 KB)

### transition constants

```js
const V={delay:0,duration:.2,ease:[.44,0,.56,1],type:`tween`}
const H={delay:0,duration:1,ease:[0,0,1,1],type:`tween`}
```

### hover-variant (2 matches, 1 window)

_gesture variant maps; the component `transition` constant applies._

```js
// @2194
X,initial:!1,children:o(G,{value:V,children:c(d.button,{...x,...A,className:S(Q,`framer-8aqxp0`,h,E),"data-framer-name":`Default`,"data-reset":`button`,layoutDependency:Z,layoutId:`ZVS9uEAOl`,ref:a,style:{"--border-bottom-width":`0px`,"--border-color":`rgba(0, 0, 0, 0)`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-style":`solid`,"--border-top-width":`0px`,backgroundColor:`var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 244))`,borderBottomLeftRadius:8,borderBottomRightRadius:8,borderTopLeftRadius:8,borderTopRightRadius:8,opacity:1,...m},variants:{"ZVS9uEAOl-hover":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))`,opacity:1},"ZVS9uEAOl-pressed":{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(214, 211, 209))`,opacity:1},EAtv73LHu:{opacity:.5},nqdgF8hBS:{"--border-bottom-width":`1px`,"--border-color":`var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,backgroundColor:`rgba(0, 0, 0, 0)`,opacity:1},sTeqYCuJm:{"--border-bottom-width":`0px`,"--border-left-width":`0px`,"--border-right-width":`0px`,"--border-top-width":`0px`,backgroundColor:`var(--token-3a95eaa6-e51b-4092-9cd6-e78e24a17dd1, rgba(229, 72, 77, 0.2))`,opacity:1}},...P({"ZVS9uEAOl-hover":{"data-framer-name":void 0},"ZVS9uEAOl-pressed":{"data-framer-name":void 0},EAtv73LHu:{"data-framer-name":`Disabled`},Gzs7KLdOZ:{"data-framer-name":`Loading`},nqdgF8hBS:{"data-border":!0,"data-framer-name":`Success`},sTeqYCuJm:{"data-framer-name":`Error`}},w,j),children:[$()&&o(C,{__fromCanvasComponent:!0,children:o(r,{children:o(d.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-35e0c09c-bfbb-4fb7-9f38-c4d8879499d6, rgb(28, 25, 23)))`},children:`Submit`})}),className:`framer-1efjez
```

## R4iI64qGo.tEWc6BFP.mjs (7 KB)

### transition constants

```js
const z={delay:0,duration:.1,ease:[.44,0,.56,1],type:`tween`}
```

### hover-variant (4 matches, 1 window)

_gesture variant maps; the component `transition` constant applies._

```js
// @1295
classNames:O,clearLoadingGesture:A,gestureHandlers:j,gestureVariant:M,isLoading:F,setGestureState:W,setVariant:G,variants:K}=v({defaultVariant:`Rr1WCTEi6`,enabledGestures:I,ref:a,variant:_,variantClassNames:R}),q=U(e,K),J=x(L,N);return o(p,{id:g??s,children:o(V,{animate:K,initial:!1,children:o(B,{value:z,children:o(D,{href:b,motionChild:!0,nodeId:`Rr1WCTEi6`,openInNewTab:!1,scopeId:`R4iI64qGo`,smoothScroll:!0,children:c(d.a,{...C,...j,className:`${x(J,`framer-15dzpeo`,h,O)} framer-6dl3ic`,"data-framer-name":`Variant 1`,layoutDependency:q,layoutId:`Rr1WCTEi6`,ref:a,style:{...m},...P({"Rr1WCTEi6-hover":{"data-framer-name":void 0},"Rr1WCTEi6-pressed":{"data-framer-name":void 0}},T,M),children:[o(S,{__fromCanvasComponent:!0,children:o(r,{children:o(d.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)))`},children:`Browse all integrations`})}),className:`framer-unk2by`,"data-framer-name":`Title`,fonts:[`Inter`],layoutDependency:q,layoutId:`pQXTQoZsn`,style:{"--extracted-r6o4lv":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))`,"--framer-link-text-color":`rgb(0, 153, 255)`,"--framer-link-text-decoration":`underline`},text:y,variants:{"Rr1WCTEi6-hover":{"--extracted-r6o4lv":`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))`},"Rr1WCTEi6-pressed":{"--extracted-r6o4lv":`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))`}},verticalAlignment:`top`,withExternalLayout:!0,...P({"Rr1WCTEi6-hover":{children:o(r,{children:o(d.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)))`},children:`Browse all integrations`})})},"Rr1WCTEi6-pressed":{children:o(r,{children:o(d.p,{className:`framer-styles-preset-1h9i0d0`,"data-styles-preset":`HN3v7c7uq`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161)))`},children:`Browse all integrations`})})}},T,M)}),o(d.button,{className:`framer-1bs23ii`,"data-framer-name":`Circular Button`,"data-reset":`button`,layoutDependency:q,layoutId:`iqjTPscih`,style:{backgroundColor:`var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`,borderBottomLeftRadius:52,borderBottomRightRadius:52,borderTopLeftRadius:52,borderTopRightRadius:52},variants:{"Rr1WCTEi6-hover":{backgroundColor:`var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`},"Rr1WCTEi6-pressed":{backgroundColor:`var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`}},children:o(k,{animated:!0,className:`framer-ycs1mn`,layoutDependency:q,layoutId:`IJje8pIoa`,style:{"--1m973uw":`var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))`,"--js9iwy":2}})})]})})})})})}),[`.framer-z2KqL.framer-6dl3ic, .framer-z2KqL .framer-6dl3ic { display: block; }`,`.framer-z2KqL.framer-15dzpeo { align-content: center; align-items: center; cursor: pointer; display: 
```

## StatusPingV2.Dx0_L55Q.mjs (1 KB)

### loop (1 match, 1 window)

_infinite loops (pulses, rotating arrows)._

```js
// @45
D.mjs";import{l as t,s as n}from"./react.BpkJvQWg.mjs";import{C as r,t as i}from"./motion.CaYsD5Db.mjs";import{$ as a,P as o,o as s}from"./framer.Dy0MSJwM.mjs";function c({play:e,size:n,tint:i,pingSize:a,pingWeight:o,pingTransition:s,repeatDelay:c}){let u=Math.max(n-o*2,1),d=u+a;return t(r.div,{style:{width:n,height:n,borderRadius:9999,backgroundColor:i,position:`relative`},children:e&&t(r.div,{custom:{startSize:u,endSize:d},initial:`start`,animate:`end`,variants:l,style:{borderRadius:9999,outline:`${o}px solid ${i}`,position:`absolute`,top:`50%`,left:`50%`,x:`-50%`,y:`-50%`},transition:{...s,repeat:1/0,repeatDelay:c}})})}var l,u=e((()=>{n(),a(),i(),l={start:({startSize:e})=>({width:e,height:e,opacity:1}),end:({startSize:e,endSize:t})=>({width:t,height:t,opacity:0})},o(c,{play:{title:`Play`,type:s.Boolean,defaultValue:!1},size:{title:`Size`,type:s.Number,min:0,max:64,displayStepper:!0,defaultValue:6},tint:{title:`Tint`,type:s.Color,defaultValue:`#09F`},pingSize:{title:`Ping Size`,type:s.Number,min:0,max:64,displayStepper:!0,defaultValue:16},pingWeight:{title:`Weight`,type:s.Number,min:0,max:64,displayStepper:!0,defaultValue:2},pingTransition:{title:`Transition`,type:s.Transition,de
```
