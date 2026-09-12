import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,B as n,E as r,F as i,H as ee,N as a,l as o,s}from"./react.BpkJvQWg.mjs";import{H as c,X as l,t as u}from"./motion.CaYsD5Db.mjs";import{$ as d,P as f,o as p}from"./framer.Dy0MSJwM.mjs";import{D as te,E as ne,O as re,S as ie,T as m,_ as ae,a as oe,b as h,c as se,d as ce,f as le,g as ue,l as de,n as fe,o as pe,p as me,r as he,s as ge,t as g,v as _,w as _e,x as ve,y as ye}from"./three.module.BQ2sF8ia.mjs";import{a as be,i as v,n as xe,r as y,t as b}from"./WebGLGuard.Cz0BfuzQ.mjs";var x=e((()=>{v()}));function S({points:e,threshold:n=.5,scale:r=1,extrudeScale:s=.9,extrudeOffset:u={x:0,y:.1,z:.1},randomOffset:d={x:.6,y:.2,z:.2},steps:f=16,tubeRadius:p=.0012,tipLayers:te=8,tipRadius:re=.0024,springSettings:m={duration:300,bounce:.2},noiseStrength:_e=.15,noiseScale:v=3.6,cameraFov:y=34,cameraPosition:x={x:0,y:0,z:1.8},cameraRotationX:S=0,cameraRotationY:Ee=0,sizeVariance:C=.5,dispersionOffset:w=.05,dispersionBand:De=.9,dispersion:Oe=.8,simRadius:ke=.15,simStrength:Ae=1,simSpring:T=40,simDamping:E=12,simMaxVelocity:D=5,opacitySpeed:O=2,maxDelay:k=.6,highlightRadius:je=.15,highlightStrength:A=.3,highlightSpeed:j=4,nordwellOpacity:M=.15,pulseStrength:N=.8,pulseSpeedBase:Me=.05,pulseSpeedRandomMax:P=.1,tipTexture:F,fallbackImage:Ne,fallbackFit:I=`cover`,fallbackAlt:L=``}){let Pe=t(null),R=t(null),z=t(new _),Fe=t(null),{webglAvailable:B,gpuEpoch:V,beginSession:Ie}=be(`HeroThreeJS`),{positions:H,numStrands:Le}=a(()=>Se(e,n),[e,n]),U={duration:m.duration,bounce:m.bounce},W=c(re),Re=l(W,U);i(()=>{W.set(re)},[re]);let G=c(_e),ze=l(G,U);i(()=>{G.set(_e)},[_e]);let K=c(v),Be=l(K,U);i(()=>{K.set(v)},[v]);let q=c(y),Ve=l(q,U);i(()=>{q.set(y)},[y]);let He=c(x.x),Ue=l(He,U);i(()=>{He.set(x.x)},[x.x]);let We=c(x.y),Ge=l(We,U);i(()=>{We.set(x.y)},[x.y]);let Ke=c(x.z),qe=l(Ke,U);i(()=>{Ke.set(x.z)},[x.z]);let J=c(S),Je=l(J,U);i(()=>{J.set(S)},[S]);let Ye=c(Ee),Xe=l(Ye,U);i(()=>{Ye.set(Ee)},[Ee]);let Y=c(C),Ze=l(Y,U);i(()=>{Y.set(C)},[C]);let X=c(w),Qe=l(X,U);i(()=>{X.set(w)},[w]);let Z=c(De),$e=l(Z,U);i(()=>{Z.set(De)},[De]);let et=c(Oe),tt=l(et,U);i(()=>{et.set(Oe)},[Oe]);let nt=c(ke),rt=l(nt,U);i(()=>{nt.set(ke)},[ke]);let it=c(Ae),at=l(it,U);i(()=>{it.set(Ae)},[Ae]);let ot=c(T),st=l(ot,U);i(()=>{ot.set(T)},[T]);let ct=c(E),lt=l(ct,U);i(()=>{ct.set(E)},[E]);let Q=c(D),ut=l(Q,U);i(()=>{Q.set(D)},[D]);let $=c(O),dt=l($,U);i(()=>{$.set(O)},[O]);let ft=c(k),pt=l(ft,U);i(()=>{ft.set(k)},[k]);let mt=c(je),ht=l(mt,U);i(()=>{mt.set(je)},[je]);let gt=c(A),_t=l(gt,U);i(()=>{gt.set(A)},[A]);let vt=c(j),yt=l(vt,U);i(()=>{vt.set(j)},[j]);let bt=c(M),xt=l(bt,U);i(()=>{bt.set(M)},[M]);let St=c(N),Ct=l(St,U);i(()=>{St.set(N)},[N]);let wt=c(Me),Tt=l(wt,U);i(()=>{wt.set(Me)},[Me]);let Et=c(P),Dt=l(Et,U);return i(()=>{Et.set(P)},[P]),i(()=>{let e=Pe.current;if(!e||!H)return;let t=Ie(),n=f+1,i=n+te,a=Le*i,o=Math.ceil(Math.sqrt(a)),c=o*2,l=o*3,m=xe(t,{params:{antialias:!0,alpha:!0},requirements:{vertexTextures:!0,floatDataTextures:!0,floatRenderTargets:!0,maxTextureSize:Math.max(o,c,l)}});if(!m)return;let _=m.renderer;_.setPixelRatio(Math.min(ee.devicePixelRatio,2)),_.setSize(e.clientWidth,e.clientHeight),e.appendChild(_.domElement);let _e=_.domElement,be=new ue,v=new de;be.add(v);let y=new le(Ve.get(),e.clientWidth/e.clientHeight,.1,100);y.position.set(Ue.get(),Ge.get(),qe.get()),v.add(y),v.rotation.x=Je.get()*Te,v.rotation.y=Xe.get()*Te;let b={scale:r,extrudeScale:s,extrudeOffset:new h(u.x,u.y,u.z),randomOffset:new h(d.x,d.y,d.z),steps:f,tubeRadius:p,tipRadius:re,noiseCurve:Ce,tipLayers:te},x=n*3+4*b.tipLayers,S=Le*x,Se=(n-1)*3*2*3,we=6*b.tipLayers,Ee=Le*(Se+we),C=new ve(1,.5,0,0),w=new ve(1,.5,0,.5),De=new ve(1,1/3,0,0),Oe=new ve(1,1/3,0,1/3),ke=new ve(1,1/3,0,2/3);function Ae(e){return[(e%o+.5)/o,(Math.floor(e/o)+.5)/o]}let T=new Float32Array(S*3),E=new Float32Array(S*3),D=new Uint8Array(S),O=new Float32Array(S*2),k=new Float32Array(S*3),je=new Uint8Array(S),A=new Float32Array(S),j=new Float32Array(S*2),M=new Uint32Array(Ee),N=new Float32Array(o*l*4),Me=o*o,P=Me,F=Me*2,Ne=new h,I=new h,L=new h,z=new h,B=0,V=0;function U(e){let t=e*3,r=Math.random(),ee=Math.random(),a=Math.random(),o=e*x;I.set(H[t],H[t+1],H[t+2]).multiplyScalar(b.scale),L.copy(I).multiplyScalar(b.extrudeScale).add(b.extrudeOffset),z.subVectors(L,I).normalize();for(let t=0;t<n;t++){let s=t/(n-1);Ne.lerpVectors(I,L,s);let c=Ne.x,l=Ne.y,u=Ne.z,d=1-s,f=e*i+t,[p,te]=Ae(f);N[(0+f)*4]=c,N[(0+f)*4+1]=l,N[(0+f)*4+2]=u,N[(0+f)*4+3]=d,N[(P+f)*4]=L.x,N[(P+f)*4+1]=L.y,N[(P+f)*4+2]=L.z,N[(P+f)*4+3]=a,N[(F+f)*4]=I.x,N[(F+f)*4+1]=I.y,N[(F+f)*4+2]=I.z,N[(F+f)*4+3]=0;for(let e=0;e<3;e++){let t=B*3,n=B*2,i=B*3,a=B*2;T[t]=L.x,T[t+1]=L.y,T[t+2]=L.z,E[t]=z.x,E[t+1]=z.y,E[t+2]=z.z,D[B]=e,O[n]=r,O[n+1]=ee,k[i]=d,k[i+1]=e/3,k[i+2]=0,A[B]=b.noiseCurve(1-d),j[a]=p,j[a+1]=te,B++}if(t<n-1)for(let e=0;e<3;e++){let n=o+t*3+e,r=o+t*3+(e+1)%3,i=o+(t+1)*3+e,ee=o+(t+1)*3+(e+1)%3;M[V++]=n,M[V++]=i,M[V++]=r,M[V++]=i,M[V++]=ee,M[V++]=r}}let s=[0,0,1,0,0,1,1,1];for(let t=0;t<b.tipLayers;t++){let c=b.tipLayers>1?t/(b.tipLayers-1):0,l=o+n*3+t*4,u=e*i+n+t,[d,f]=Ae(u);N[(0+u)*4]=I.x,N[(0+u)*4+1]=I.y,N[(0+u)*4+2]=I.z,N[(0+u)*4+3]=1,N[(P+u)*4]=L.x,N[(P+u)*4+1]=L.y,N[(P+u)*4+2]=L.z,N[(P+u)*4+3]=a,N[(F+u)*4]=I.x,N[(F+u)*4+1]=I.y,N[(F+u)*4+2]=I.z,N[(F+u)*4+3]=0;for(let e=0;e<4;e++){let t=B*3,n=B*2,i=B*3,a=B*2;T[t]=L.x,T[t+1]=L.y,T[t+2]=L.z,E[t]=z.x,E[t+1]=z.y,E[t+2]=z.z,D[B]=0,O[n]=r,O[n+1]=ee,k[i]=s[e*2],k[i+1]=s[e*2+1],k[i+2]=c,A[B]=b.noiseCurve(0),je[B]=255,j[a]=d,j[a+1]=f,B++}M[V++]=l+0,M[V++]=l+2,M[V++]=l+1,M[V++]=l+2,M[V++]=l+3,M[V++]=l+1}}for(let e=0;e<Le;e++)U(e);let W=new oe(N,o,l,se,pe);W.minFilter=ne,W.magFilter=ne,W.needsUpdate=!0;let G=new fe;G.setAttribute(`position`,new g(T,3)),G.setAttribute(`aDir`,new g(E,3)),G.setAttribute(`aSide`,new g(D,1,!0)),G.setAttribute(`aRandom`,new g(O,2)),G.setAttribute(`aUV`,new g(k,3)),G.setAttribute(`aTip`,new g(je,1,!0)),G.setAttribute(`aAdvect`,new g(A,1)),G.setAttribute(`aSimCell`,new g(j,2)),G.setIndex(new g(M,1));let K=new ie(o,c,{type:he,format:se,minFilter:ne,magFilter:ne}),q=K.clone(),He=new ce(-1,1,1,-1,0,1),We=new me(2,2),Ke=new ae({uniforms:{tData:{value:W},uAtlasPos:{value:C.clone()},uAtlasVel:{value:w.clone()},uDataStart:{value:Oe.clone()}},vertexShader:`
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
                uniform vec4  uAtlasPos;
                uniform vec4  uAtlasVel;
                uniform vec4  uDataTarget;
                uniform vec4  uDataStart;
                uniform vec4  uDataHighlightRef;

                // How long a nordwell takes to ramp from inactive to fully
                // active once its stagger delay has elapsed. Kept as a fixed
                // constant rather than a control — it's a smoothing detail,
                // not a creative parameter.
                const float ACTIVATE_EASE = 0.35;

                // Squared-magnitude ceiling for sanity checks. The render
                // targets are half-float, which saturates at 65504 — well
                // below this — so anything approaching it is already a
                // runaway, and everything in this scene lives near unit scale.
                const float SANE_SQ = 1.0e8;

                // Largest explicit-Euler spring impulse per step. Beyond ~2.0
                // the integrator overshoots and diverges. At 60fps with the
                // default uSpring this never clamps; it only engages on long
                // frames or extreme stiffness.
                const float MAX_SPRING_STEP = 2.0;

                varying vec2 vUv;

                vec2 atlasUV(vec2 cellUv, vec4 region) {
                    return cellUv * region.xy + region.zw;
                }

                vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) {
                    return (atlasUv - region.zw) / region.xy;
                }

                void main() {
                    bool isVelocity = vUv.y >= uAtlasVel.w;

                    vec2 cellUv = isVelocity
                        ? cellUVfromAtlas(vUv, uAtlasVel)
                        : cellUVfromAtlas(vUv, uAtlasPos);

                    // Read sim state
                    vec4 posData  = texture2D(tPrev, atlasUV(cellUv, uAtlasPos));
                    vec3 pos      = posData.rgb;
                    float opacity = posData.a;

                    vec4 velData    = texture2D(tPrev, atlasUV(cellUv, uAtlasVel));
                    vec3 vel        = velData.rgb;
                    float highlight = velData.a;

                    // Read static targets from the data texture
                    vec3 targetPos    = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
                    vec3 highlightRef = texture2D(tData, atlasUV(cellUv, uDataHighlightRef)).rgb;
                    float rStagger    = texture2D(tData, atlasUV(cellUv, uDataStart)).a;

                    // --- Sanitize incoming state ---
                    // A single NaN or Inf entering a ping-pong buffer never
                    // leaves it: the next frame reads it back, propagates it,
                    // and every subsequent frame is poisoned. Under additive
                    // blending with depth testing off, that reads on screen as
                    // a solid white canvas with no error and no context loss.
                    // The NOT-less-than form below is NaN-safe: it is true for
                    // NaN, where a greater-than test would be false.
                    if (!(dot(pos, pos) < SANE_SQ)) {
                        pos = targetPos;
                        vel = vec3(0.0);
                    }
                    if (!(dot(vel, vel) < SANE_SQ)) {
                        vel = vec3(0.0);
                    }
                    if (!(opacity >= 0.0))   opacity = 0.0;
                    if (!(highlight >= 0.0)) highlight = 0.0;

                    // --- Stagger activation ---
                    // Each nordwell waits rStagger * uMaxDelay seconds, then
                    // ramps smoothly to fully active over ACTIVATE_EASE seconds.
                    // Gates the spring pull and the opacity target below so an
                    // inactive nordwell stays parked at the launch point, invisible.
                    float nordwellDelay = rStagger * uMaxDelay;
                    float activeT = clamp((uElapsed - nordwellDelay) / ACTIVATE_EASE, 0.0, 1.0);

                    // --- Repulsion physics — mouse pushes the live position around ---
                    vec2 toCell   = pos.xy - uMouse;
                    float dist    = length(toCell);
                    float repulse = 1.0 - smoothstep(0.0, uRadius, dist);
                    vec2 repelDir = dist > 0.0001 ? toCell / dist : vec2(0.0, 1.0);
                    vel.xy       += repelDir * repulse * uStrength * uDelta;

                    float speed = length(vel);
                    if (speed > uMaxVelocity) vel = vel / speed * uMaxVelocity;

                    // --- Spring pulling the live position toward its target ---
                    // Gated by activeT: an inactive nordwell feels no pull yet,
                    // so it stays parked at the seeded launch point (velocity
                    // still damps down from any residual mouse repulsion).
                    // The impulse is clamped so a long frame (or a very stiff
                    // uSpring) can't overshoot into exponential divergence.
                    float springStep = min(uSpring * uDelta, MAX_SPRING_STEP);
                    vel -= (pos - targetPos) * springStep * activeT;

                    // Exponential damping. The naive form (1.0 - uDamping * uDelta)
                    // goes negative once uDamping * uDelta exceeds 1 — reachable at
                    // high damping on a slow frame — which flips the velocity sign
                    // and amplifies it every step until it overflows to Inf.
                    // exp(-x) matches it to first order and is stable for all inputs.
                    vel *= exp(-uDamping * uDelta);

                    // --- Integrate position + ease opacity toward its (gated) target ---
                    pos     += vel * uDelta;
                    opacity += (activeT - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
                    opacity  = clamp(opacity, 0.0, 1.0);

                    // --- Highlight ---
                    // Distance from mouse to this nordwell's reference point.
                    // All cells in the nordwell share the same reference point so
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
            `});Ye.add(new ge(We,Y));let X=new ae({uniforms:{uTime:{value:0},uDirection:{value:new h().copy(b.extrudeOffset).normalize()},uNoiseStrength:{value:ze.get()},uNoiseScale:{value:Be.get()},uRandomOffset:{value:b.randomOffset},uTubeRadius:{value:p},uTipRadius:{value:Re.get()},uTipTexture:{value:Fe.current},uTipLayers:{value:b.tipLayers},uSizeVariance:{value:Ze.get()},uDispersionOffset:{value:Qe.get()},uDispersionBand:{value:$e.get()},uDispersion:{value:tt.get()},uStrandOpacity:{value:xt.get()},uHighlightStrength:{value:_t.get()},uPulseStrength:{value:Ct.get()},uPulseSpeedBase:{value:Tt.get()},uPulseSpeedRandomMax:{value:Dt.get()},tSim:{value:K.texture},uAtlasPos:{value:C.clone()},uAtlasVel:{value:w.clone()}},vertexShader:`
#define OCTAVES 1

vec3 rand(in vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

vec3 quintic(const in vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin(in vec3 xyz) {
    vec3 gridUV = fract(xyz);
    vec3 gridID = floor(xyz);
    vec3 c000=vec3(0,0,0); vec3 c100=vec3(1,0,0);
    vec3 c010=vec3(0,1,0); vec3 c110=vec3(1,1,0);
    vec3 c001=vec3(0,0,1); vec3 c101=vec3(1,0,1);
    vec3 c011=vec3(0,1,1); vec3 c111=vec3(1,1,1);
    float r000=dot(gridUV-c000,rand(gridID+c000)); float r100=dot(gridUV-c100,rand(gridID+c100));
    float r010=dot(gridUV-c010,rand(gridID+c010)); float r110=dot(gridUV-c110,rand(gridID+c110));
    float r001=dot(gridUV-c001,rand(gridID+c001)); float r101=dot(gridUV-c101,rand(gridID+c101));
    float r011=dot(gridUV-c011,rand(gridID+c011)); float r111=dot(gridUV-c111,rand(gridID+c111));
    vec3 f=quintic(gridUV);
    float x0=mix(r000,r100,f.x); float x1=mix(r010,r110,f.x);
    float x2=mix(r001,r101,f.x); float x3=mix(r011,r111,f.x);
    float y0=mix(x0,x1,f.y); float y1=mix(x2,x3,f.y);
    return mix(y0,y1,f.z)*2.0;
}

float fractalBrownian(const in vec3 xyz, const in float ampWeight) {
    float result=0.0; float amp=1.0; float freq=1.0; float maxAmp=0.0;
    for(int i=0;i<OCTAVES;i++){
        result+=amp*perlin(xyz*freq); maxAmp+=amp; amp*=ampWeight; freq*=2.0;
    }
    return result/maxAmp;
}

attribute vec3  aDir;
attribute float aSide;
attribute vec2  aRandom;
attribute vec3  aUV;
attribute float aTip;
attribute float aAdvect;
attribute vec2  aSimCell;

uniform float uTime;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uTubeRadius;
uniform float uTipRadius;
uniform float uSizeVariance;
uniform float uDispersionOffset;
uniform vec3  uDirection;
uniform vec3  uRandomOffset;
uniform sampler2D tSim;
uniform vec4  uAtlasPos;
uniform vec4  uAtlasVel;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vAdvect;
varying float vHighlight;
varying float vOpacity;

vec2 atlasUV(vec2 cellUv, vec4 region) {
    return cellUv * region.xy + region.zw;
}

void main() {
    vRandom = aRandom;
    vUV     = aUV;
    vTip    = aTip;
    vAdvect = aAdvect;

    // Sample live position (rgb) + opacity (a) from the position section
    vec4 posData  = texture2D(tSim, atlasUV(aSimCell, uAtlasPos));
    vec3 worldPos = posData.rgb;
    vOpacity      = posData.a;

    // Sample highlight (a) from the velocity section
    vHighlight = texture2D(tSim, atlasUV(aSimCell, uAtlasVel)).a;

    // Second line of defence against a poisoned sim buffer. The sim shader
    // self-heals, but a bad value would still be visible for the one frame
    // before it does — and a non-finite gl_Position produces undefined,
    // often screen-filling, geometry. Collapse the vertex instead.
    if (!(dot(worldPos, worldPos) < 1.0e8)) {
        gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
        vOpacity = 0.0;
        return;
    }
    if (!(vOpacity >= 0.0))   vOpacity = 0.0;
    if (!(vHighlight >= 0.0)) vHighlight = 0.0;

    vec3 coords = worldPos * uNoiseScale
        + uTime * -0.15 * uDirection
        + aRandom.yxy * uRandomOffset;

    float dx = fractalBrownian(coords, 0.5);
    float dy = fractalBrownian(coords + vec3(3.963, 1.053, 5.263), 0.5);

    vec3 noiseDisp    = vec3(dx, dy, dx * dy) * aAdvect * uNoiseStrength;
    vec3 displacedPos = worldPos + noiseDisp;

    if (aTip > 0.5) {
        vec4 centerView = modelViewMatrix * vec4(displacedPos, 1.0);
        float sv  = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
        float ox  = (aUV.x - 0.5) * 2.0 * uTipRadius * sv;
        float oy  = (aUV.y - 0.5) * -2.0 * uTipRadius * sv;
        centerView.xy += vec2(ox, oy);
        float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
        centerView.z += aUV.z * uDispersionOffset * cycle;
        gl_Position = projectionMatrix * centerView;
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
    float pulseDist  = abs(vUV.x * 0.2 - pulsePos);
    pulseDist        = min(pulseDist, 1.0 - pulseDist);
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
`,transparent:!0,depthTest:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:201,blendDstAlpha:201});R.current=X;let Z=new ge(G,X);Z.rotateX(Math.PI),be.add(Z),Z.updateWorldMatrix(!0,!1);let et=Z.matrixWorld.clone().invert(),nt=document.visibilityState===`visible`,it=!1,ot=()=>{if(t.halted()){_.setAnimationLoop(null);return}console.log(`[Hero] resume?`,{isPageVisible:nt,isIntersecting:it}),nt&&it?_.setAnimationLoop(kt):_.setAnimationLoop(null)},ct=()=>{nt=document.visibilityState===`visible`,ot()};document.addEventListener(`visibilitychange`,ct);let Q=-9999,$=new ye(Q,Q),ft=new h,mt=new h,gt=new h,vt=new h,bt=new h,St=t=>{let n=e.getBoundingClientRect();$.set(t.clientX-n.left,t.clientY-n.top)},wt=e=>{$.set(Q,Q)};e.addEventListener(`mousemove`,St),e.addEventListener(`mouseleave`,wt);let Et=0,Ot=0;function kt(n){if(t.shouldStop())return;let r=n*.001,i=Math.min(r-Et,.1);Et=r,Ot+=i,y.fov=Ve.get(),y.updateProjectionMatrix(),y.position.set(Ue.get(),Ge.get(),qe.get()),v.rotation.x=Je.get()*Te,v.rotation.y=Xe.get()*Te,y.updateWorldMatrix(!0,!1);let ee=e.clientWidth,a=e.clientHeight;if($.x<=Q)Y.uniforms.uMouse.value.set(Q,Q);else{let e=$.x/ee*2-1,t=-($.y/a*2-1);ft.set(e,t,.5).applyMatrix4(y.projectionMatrixInverse).applyMatrix4(y.matrixWorld),mt.setFromMatrixPosition(y.matrixWorld),gt.copy(ft).sub(mt).normalize(),y.getWorldDirection(vt);let n=-vt.dot(mt)/vt.dot(gt);bt.copy(mt).addScaledVector(gt,n).applyMatrix4(et),Y.uniforms.uMouse.value.set(bt.x,bt.y)}Y.uniforms.tPrev.value=K.texture,Y.uniforms.uDelta.value=i,Y.uniforms.uRadius.value=rt.get(),Y.uniforms.uStrength.value=at.get(),Y.uniforms.uSpring.value=st.get(),Y.uniforms.uDamping.value=lt.get(),Y.uniforms.uMaxVelocity.value=ut.get(),Y.uniforms.uHighlightRadius.value=ht.get(),Y.uniforms.uHighlightSpeed.value=yt.get(),Y.uniforms.uOpacitySpeed.value=dt.get(),Y.uniforms.uElapsed.value=Ot,Y.uniforms.uMaxDelay.value=pt.get(),_.setRenderTarget(q),_.render(Ye,He),_.setRenderTarget(null);let o=K;K=q,q=o,X.uniforms.tSim.value=K.texture,X.uniforms.uTime.value=r,X.uniforms.uNoiseStrength.value=ze.get(),X.uniforms.uNoiseScale.value=Be.get(),X.uniforms.uTipRadius.value=Re.get(),X.uniforms.uSizeVariance.value=Ze.get(),X.uniforms.uDispersionOffset.value=Qe.get(),X.uniforms.uDispersionBand.value=$e.get(),X.uniforms.uDispersion.value=tt.get(),X.uniforms.uStrandOpacity.value=xt.get(),X.uniforms.uHighlightStrength.value=_t.get(),X.uniforms.uPulseStrength.value=Ct.get(),X.uniforms.uPulseSpeedBase.value=Tt.get(),X.uniforms.uPulseSpeedRandomMax.value=Dt.get(),_.render(be,y)}let At=new ResizeObserver(()=>{y.aspect=e.clientWidth/e.clientHeight,y.updateProjectionMatrix(),_.setSize(e.clientWidth,e.clientHeight)});At.observe(e);let jt=new IntersectionObserver(([e])=>{it=e.isIntersecting,ot()},{threshold:0});return jt.observe(e),t.ready(),()=>{t.end(),m.detach(),e.removeEventListener(`mousemove`,St),e.removeEventListener(`mouseleave`,wt),_.setAnimationLoop(null),At.disconnect(),jt.disconnect(),R.current=null,document.removeEventListener(`visibilitychange`,ct),be.clear(),G.dispose(),X.dispose(),W.dispose(),K.dispose(),q.dispose(),We.dispose(),Y.dispose(),_.dispose(),e.contains(_e)&&e.removeChild(_e),setTimeout(()=>_.forceContextLoss(),1)}},[H,r,s,u.x,u.y,u.z,d.x,d.y,d.z,f,p,te,V]),i(()=>{if(!F){Fe.current?.dispose(),Fe.current=null,R.current&&(R.current.uniforms.uTipTexture.value=null);return}return we(z.current,F,e=>{Fe.current?.dispose(),Fe.current=e,R.current&&(R.current.uniforms.uTipTexture.value=e)})},[F]),o(b,{mountRef:Pe,showFallback:!B||!H,fallbackImage:Ne,fallbackFit:I,fallbackAlt:L})}function Se(e,t=1){if(!e||!e.trim())return{positions:null,numStrands:0};let n=e.split(`,`).map(Number);if(n.length<2||n.length%2!=0||n.some(isNaN))return{positions:null,numStrands:0};let r=[];for(let e=0;e<n.length/2;e++)Math.random()>t||r.push(n[e*2],n[e*2+1],0);return r.length===0?{positions:null,numStrands:0}:{positions:r,numStrands:r.length/3}}function Ce(e){return e*e*(3-2*e)+.05}function we(e,t,n){let r=null;return e.load(t,e=>{e.wrapS=m,e.wrapT=m,e.minFilter=_e,e.magFilter=re,r=e,n(e)}),()=>{r?.dispose(),r=null}}var Te,Ee=e((()=>{n(),s(),d(),u(),r(),te(),x(),Te=Math.PI/180,f(S,{points:{title:`Points`,type:p.String,defaultValue:``,description:`Comma-separated x,y point pairs defining nordwell root positions`},threshold:{title:`Threshold`,type:p.Number,defaultValue:.4,min:0,max:1,step:.01,description:`Fraction of points kept when building strands (lower = fewer strands)`},scale:{title:`Scale`,type:p.Number,defaultValue:.9,min:0,max:2,step:.01,description:`Overall size multiplier for nordwell positions`},extrudeScale:{title:`Extrude Scale`,type:p.Number,defaultValue:.95,min:0,max:2,step:.01,description:`How much nordwell tips shrink/grow toward the extrude offset. Also defines the shared launch point every nordwell springs out from.`},extrudeOffset:{title:`Extrude Offset`,type:p.Object,description:`Direction and distance strands extrude toward. Also defines the shared launch point every nordwell springs out from.`,controls:{x:{type:p.Number,defaultValue:0,min:-4,max:4,step:.05},y:{type:p.Number,defaultValue:.1,min:-4,max:4,step:.05},z:{type:p.Number,defaultValue:.4,min:-4,max:4,step:.05}}},randomOffset:{title:`Random Offset`,type:p.Object,description:`Per-nordwell random seed offset used to vary noise`,controls:{x:{type:p.Number,defaultValue:.4,min:-1,max:1,step:.05},y:{type:p.Number,defaultValue:.2,min:-1,max:1,step:.05},z:{type:p.Number,defaultValue:.2,min:-1,max:1,step:.05}}},steps:{title:`Steps`,type:p.Number,defaultValue:32,min:1,max:32,step:1,description:`Number of segments (rings) per nordwell tube`},tipLayers:{title:`Tip Layers`,type:p.Number,defaultValue:8,min:1,max:16,step:1,description:`Number of stacked quads used to build each nordwell tip 
 --------- 
 The following properties can be animated`},springSettings:{title:`Spring Settings`,type:p.Object,description:`Duration/bounce used by every animatable property's spring`,controls:{duration:{title:`Duration`,type:p.Number,defaultValue:3e3,min:0,max:2e4,step:10},bounce:{title:`Bounce`,type:p.Number,defaultValue:.2,min:0,max:1,step:.01}}},tubeRadius:{title:`Tube Radius`,type:p.Number,defaultValue:.0032,min:1e-4,max:.1,step:1e-4,description:`Thickness of each nordwell tube`},tipRadius:{title:`Tip Radius`,type:p.Number,defaultValue:.0035,min:1e-4,max:.1,step:1e-4,description:`Size of the glowing tip quad at each nordwell's root.`},noiseStrength:{title:`Noise Strength`,type:p.Number,defaultValue:.15,min:0,max:10,step:.01,description:`Amount of turbulent displacement applied along strands`},noiseScale:{title:`Noise Scale`,type:p.Number,defaultValue:5,min:.1,max:20,step:.1,description:`Frequency of the turbulence noise field`},cameraFov:{title:`Camera FOV`,type:p.Number,defaultValue:36,min:10,max:120,step:1,description:`Camera field of view, in degrees`},cameraPosition:{title:`Camera Position`,type:p.Object,description:`Camera position offset (x, y, z)`,controls:{x:{type:p.Number,defaultValue:0,min:-10,max:10,step:.05},y:{type:p.Number,defaultValue:0,min:-10,max:10,step:.05},z:{type:p.Number,defaultValue:1.8,min:-10,max:10,step:.05}}},cameraRotationX:{title:`Camera Rotation X`,type:p.Number,defaultValue:2,min:-180,max:180,step:.5,description:`Camera parent rotation around the X axis, in degrees`},cameraRotationY:{title:`Camera Rotation Y`,type:p.Number,defaultValue:0,min:-180,max:180,step:.5,description:`Camera parent rotation around the Y axis, in degrees`},sizeVariance:{title:`Size Variance`,type:p.Number,defaultValue:.5,min:0,max:1,step:.01,description:`Random variation in tip quad size across strands`},dispersionOffset:{title:`Dispersion Offset`,type:p.Number,defaultValue:.05,min:0,max:.5,step:.001,description:`Depth offset applied to tips for a color-fringing effect`},dispersionBand:{title:`Dispersion Band`,type:p.Number,defaultValue:.9,min:0,max:1,step:.01,description:`Width of the texture band sampled for tip color dispersion`},dispersion:{title:`Dispersion`,type:p.Number,defaultValue:.8,min:0,max:1,step:.01,description:`Vertical texture coordinate used for dispersion color sampling`},simRadius:{title:`Sim Radius`,type:p.Number,defaultValue:.15,min:.01,max:1,step:.01,description:`Radius of the mouse repulsion effect`},simStrength:{title:`Sim Strength`,type:p.Number,defaultValue:8,min:0,max:10,step:.05,description:`Force strength of the mouse repulsion effect`},simSpring:{title:`Sim Spring`,type:p.Number,defaultValue:60,min:.1,max:100,step:.1,description:`Spring stiffness pulling each vertex from the shared launch point toward its final position (and back after mouse repulsion)`},simDamping:{title:`Sim Damping`,type:p.Number,defaultValue:6,min:.1,max:30,step:.1,description:`Damping applied to nordwell velocity each frame`},simMaxVelocity:{title:`Sim Max Velocity`,type:p.Number,defaultValue:5,min:.1,max:20,step:.1,description:`Speed cap for nordwell displacement velocity`},opacitySpeed:{title:`Opacity Speed`,type:p.Number,defaultValue:2,min:.1,max:20,step:.1,description:`How quickly each vertex eases from invisible to fully visible as it springs out from the launch point`},maxDelay:{title:`Max Delay`,type:p.Number,defaultValue:1,min:0,max:10,step:.05,description:`Each nordwell waits a random amount of time, up to this many seconds, before it starts springing out and fading in — strands with 0 delay start immediately`},highlightRadius:{title:`Highlight Radius`,type:p.Number,defaultValue:.3,min:.01,max:1,step:.01,description:`Radius around the mouse where nordwell tips light up`},highlightStrength:{title:`Highlight Strength`,type:p.Number,defaultValue:2,min:0,max:2,step:.01,description:`Intensity of the mouse-proximity highlight glow`},highlightSpeed:{title:`Highlight Speed`,type:p.Number,defaultValue:10,min:.1,max:20,step:.1,description:`How quickly the highlight fades in/out as the mouse moves`},nordwellOpacity:{title:`Nordwell Opacity`,type:p.Number,defaultValue:.25,min:0,max:1,step:.01,description:`Base opacity of nordwell tubes`},pulseStrength:{title:`Pulse Strength`,type:p.Number,defaultValue:1,min:0,max:2,step:.01,description:`Intensity of the traveling light pulse along strands`},pulseSpeedBase:{title:`Pulse Speed Base`,type:p.Number,defaultValue:.1,min:0,max:1,step:.005,description:`Baseline speed of the traveling light pulse`},pulseSpeedRandomMax:{title:`Pulse Speed Random`,type:p.Number,defaultValue:.1,min:0,max:1,step:.005,description:`Max random speed variation added per nordwell to the pulse`},tipTexture:{title:`Dispersion Map`,type:p.Image,description:`Texture sampled for nordwell tips and color dispersion`},...y})}));export{Ee as n,x as r,S as t};
//# sourceMappingURL=HeroThreeJSV2.BLMtRZnd.mjs.map