import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,B as n,E as r,F as i,H as a,L as o,l as s,s as c,u as l}from"./react.BpkJvQWg.mjs";import{$ as u,P as d,o as f}from"./framer.Dy0MSJwM.mjs";import{C as p,D as m,E as h,S as ee,_ as g,d as _,g as v,h as y,i as b,n as x,p as S,r as C,s as w,t as T,u as E,y as D}from"./three.module.BQ2sF8ia.mjs";function O(e=`WebGL`){let[n,r]=o(!0),[s,c]=o(0),l=t(0),u=t(!1),d=t(null);return i(()=>()=>{d.current!==null&&(clearTimeout(d.current),d.current=null)},[]),{webglAvailable:n,gpuEpoch:s,beginSession:()=>{u.current||(l.current=0),u.current=!1;let t=0,n={failed:!1,destroyed:!1,renderer:null,fail(t,i){n.failed||n.destroyed||(n.failed=!0,console.warn(`[`+e+`] showing fallback — `+t),n.renderer?.setAnimationLoop(null),i||(l.current=j),r(!1),l.current<j?(l.current+=1,u.current=!0,d.current!==null&&clearTimeout(d.current),d.current=a.setTimeout(()=>{d.current=null,c(e=>e+1)},M)):console.warn(`[`+e+`] recovery budget exhausted — staying on fallback`))},halted(){return n.failed||n.destroyed},shouldStop(){if(n.failed||n.destroyed)return!0;if(t++,t%N===0){let e=n.renderer?.getContext();if(!e||e.isContextLost())return n.fail(`context lost (watchdog)`,!0),!0}return!1},ready(){n.failed||r(!0)},end(){n.destroyed=!0},rebuildNow(){d.current!==null&&(clearTimeout(d.current),d.current=null,c(e=>e+1))}};return n}}}function te(e,t={}){let n=document.createElement(`canvas`),r=t=>{let n=t.statusMessage||`unknown reason`;e.fail(`context creation failed — `+n,!1)};n.addEventListener(`webglcontextcreationerror`,r);let i;try{i=new p({...t.params||{},canvas:n})}catch(t){return n.removeEventListener(`webglcontextcreationerror`,r),e.fail(`WebGLRenderer construction threw — `+String(t),!1),null}e.renderer=i;let a=k(i,t.requirements||{});if(a)return n.removeEventListener(`webglcontextcreationerror`,r),i.dispose(),e.fail(a,!1),null;i.debug&&(i.debug.checkShaderErrors=!0,i.debug.onShaderError=()=>{e.fail(`shader compile/link error`,!1)});let o=t=>{t.preventDefault(),e.fail(`webglcontextlost`,!0)},s=()=>{e.rebuildNow()};n.addEventListener(`webglcontextlost`,o),n.addEventListener(`webglcontextrestored`,s);let c=()=>{n.removeEventListener(`webglcontextcreationerror`,r),n.removeEventListener(`webglcontextlost`,o),n.removeEventListener(`webglcontextrestored`,s),i.debug&&(i.debug.onShaderError=null)};return{renderer:i,detach:c,require:t=>{let r=k(i,t);return r?(c(),i.dispose(),n.parentNode&&n.parentNode.removeChild(n),e.fail(r,!1),!1):!0}}}function k(e,t){if(!e.getContext())return`no WebGL context`;let n=e.capabilities;if(t.vertexTextures&&n.maxVertexTextures<1)return`GPU reports no vertex texture image units`;let r=n.isWebGL2!==!1;return t.floatRenderTargets&&!(r?e.extensions.has(`EXT_color_buffer_float`)||e.extensions.has(`EXT_color_buffer_half_float`):e.extensions.has(`OES_texture_half_float`)&&e.extensions.has(`EXT_color_buffer_half_float`))?`half-float render targets unsupported`:t.floatDataTextures&&!r&&!e.extensions.has(`OES_texture_float`)?`float data textures unsupported`:t.maxTextureSize&&t.maxTextureSize>n.maxTextureSize?`required texture size `+t.maxTextureSize+` exceeds GPU maximum `+n.maxTextureSize:null}function A({mountRef:e,showFallback:t,fallbackImage:n,fallbackFit:r=`cover`,fallbackAlt:a=``,style:o}){return i(()=>{if(!n)return;let e=new Image;e.src=n},[n]),l(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,minWidth:100,minHeight:60,overflow:`hidden`,...o},children:[s(`div`,{ref:e,style:{position:`absolute`,top:0,left:0,width:`100%`,height:`100%`,opacity:+!t}}),t&&n?s(`img`,{src:n,alt:a,draggable:!1,style:{position:`absolute`,top:0,left:0,width:`100%`,height:`100%`,objectFit:r,pointerEvents:`none`,userSelect:`none`}}):null]})}var j,M,N,P,F=e((()=>{n(),c(),u(),r(),m(),j=2,M=600,N=16,P={fallbackImage:{title:`Fallback Image`,type:f.Image,description:`Shown instead of the canvas when WebGL is unavailable, the GPU context is lost, or the effect cannot render. Preloaded at mount so the swap is instant.`},fallbackFit:{title:`Fallback Fit`,type:f.Enum,defaultValue:`cover`,options:[`cover`,`contain`,`fill`],optionTitles:[`Cover`,`Contain`,`Fill`],displaySegmentedControl:!0,description:`How the fallback image fills the frame`},fallbackAlt:{title:`Fallback Alt`,type:f.String,defaultValue:``,description:`Alt text for the fallback image`}}}));function I({decay:e,dotsX:n,dotsY:r,spacing:o,dotSize:c,dotColor:l,glowColor:u,fallbackImage:d,fallbackFit:f,fallbackAlt:p}){let m=t(null),{webglAvailable:k,gpuEpoch:j,beginSession:M}=O(`DotGridGL`),N=t(e);i(()=>{N.current=e},[e]);let P=t(c);i(()=>{P.current=c},[c]);let F=t(new b(l)),I=t(new b(u));return i(()=>{F.current.set(l)},[l]),i(()=>{I.current.set(u)},[u]),i(()=>{let e=m.current;if(!e)return;let t=M(),i=n*r,s=Math.ceil(Math.sqrt(i)),c=te(t,{params:{antialias:!0,alpha:!0},requirements:{vertexTextures:!0,floatRenderTargets:!0,maxTextureSize:s}});if(!c)return;let l=c.renderer;l.setPixelRatio(Math.min(a.devicePixelRatio,2)),l.setSize(e.clientWidth,e.clientHeight),e.appendChild(l.domElement);let u=l.domElement,d=new v,f=e.clientWidth,p=e.clientHeight,b=new _(-f/2,f/2,p/2,-p/2,.1,10);b.position.z=1;function O(e){let t=e%s+.5,n=Math.floor(e/s)+.5;return[t/s,n/s]}let k=new ee(s,s,{type:C,format:E,minFilter:h,magFilter:h}),A=k.clone(),j=new g({uniforms:{tPrev:{value:k.texture},uMouse:{value:new D(-9999,-9999)},uMousePrev:{value:new D(-9999,-9999)},uGridSize:{value:new D((n-1)*o,(r-1)*o)},uCanvasSize:{value:new D(f,p)},uDelta:{value:0},uDecay:{value:2},uDotsY:{value:r}},vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,fragmentShader:`
        uniform sampler2D tPrev;
        uniform vec2  uMouse;
        uniform vec2  uMousePrev;
        uniform vec2  uGridSize;
        uniform vec2  uCanvasSize;
        uniform float uDelta;
        uniform float uDecay;
        uniform float uDotsY;
        
        varying vec2 vUv;
        

        void main() {
            float prevT = texture2D(tPrev, vUv).r;

            // This sim cannot diverge — it is exponential decay of a value
            // already clamped to [0, 1] — but a ping-pong buffer never
            // clears itself, so one poisoned texel from a driver hiccup
            // would persist for the life of the component. The
            // NOT-greater-or-equal form is NaN-safe: it is true for NaN,
            // where a less-than test would be false.
            if (!(prevT >= 0.0)) prevT = 0.0;
        
            float mouseWorldY     = -(uMouse.y     - uCanvasSize.y * 0.5);
            float mouseWorldYPrev = -(uMousePrev.y - uCanvasSize.y * 0.5);
        
            float mouseV     = (mouseWorldY     + uGridSize.y * 0.5) / uGridSize.y;
            float mouseVPrev = (mouseWorldYPrev + uGridSize.y * 0.5) / uGridSize.y;
        
            // Ensure minV is always the smaller of the two
            float minV = min(mouseV, mouseVPrev);
            float maxV = max(mouseV, mouseVPrev);
        
            // Expand range by half a row on each side
            float halfRow = 0.5 / uDotsY;
            float lit = step(minV - halfRow, vUv.y) * step(vUv.y, maxV + halfRow);
        
            float mouseActive = step(0.0, uMouse.x) * step(0.0, uMousePrev.x);
            lit *= mouseActive;
        
            float newT = mix(prevT * exp(-uDecay * uDelta), 1.0, lit);
            gl_FragColor = vec4(newT, 0.0, 0.0, 1.0);
        }
    `}),R=new v,z=new _(-1,1,1,-1,0,1),B=new S(2,2),ne=new w(B,j);R.add(ne);let{positions:re,randoms:ie,aSimCell:ae}=L({dotsX:n,dotsY:r,spacing:o,cellToUV:O}),V=new x;V.setAttribute(`position`,new T(re,3)),V.setAttribute(`aRandom`,new T(ie,1)),V.setAttribute(`aSimCell`,new T(ae,2));let H={tSim:{value:null},uDotSize:{value:2},uTime:{value:0},uDotColor:{value:F.current},uGlowColor:{value:I.current},uMouse:{value:new D(-9999,-9999)},uResolution:{value:new D(f,p)}},U=new g({vertexShader:`
            attribute float aRandom;
            attribute vec2 aSimCell;

            uniform float uDotSize;
            uniform float uTime;

            uniform sampler2D tSim;

            varying float vGlow;

            void main() {
                // aSimCell is the exact texel-center UV baked at geometry
                // generation time — no gl_VertexID / runtime index math.
                vGlow = texture2D(tSim, aSimCell).r;
                if (!(vGlow >= 0.0)) vGlow = 0.0;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = uDotSize;
            }
        `,fragmentShader:`
            uniform vec3 uDotColor;
            uniform vec3 uGlowColor;

            varying float vGlow;

            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                // if (length(coord) > 0.5) discard;
                vec3 color = mix(uDotColor, uGlowColor, vGlow);
                gl_FragColor = vec4(color, 1.0);
            }
        `,uniforms:H}),oe=new y(V,U);d.add(oe);let W=document.visibilityState===`visible`,G=!1,K=()=>{if(t.halted()){l.setAnimationLoop(null);return}W&&G?l.setAnimationLoop(se):l.setAnimationLoop(null)},q=0;function se(e){if(t.shouldStop())return;let n=e*.001,r=Math.min(n-q,.1);q=n,H.uTime.value=n,H.uDotSize.value=P.current,H.uDotColor.value=F.current,H.uGlowColor.value=I.current,j.uniforms.uMousePrev.value.copy(j.uniforms.uMouse.value),j.uniforms.uMouse.value.copy(H.uMouse.value),j.uniforms.tPrev.value=k.texture,j.uniforms.uDelta.value=r,j.uniforms.uDecay.value=N.current,l.setRenderTarget(A),l.render(R,z),l.setRenderTarget(null);let i=k;k=A,A=i,H.tSim.value=k.texture,l.render(d,b)}let J=t=>{let n=e.getBoundingClientRect();H.uMouse.value.set(t.clientX-n.left,t.clientY-n.top)},Y=()=>H.uMouse.value.set(-9999,-9999);e.addEventListener(`mousemove`,J),e.addEventListener(`mouseleave`,Y);let X=new ResizeObserver(()=>{l.getContext()&&(f=e.clientWidth,p=e.clientHeight,l.setSize(f,p),b.left=-f/2,b.right=f/2,b.top=p/2,b.bottom=-p/2,b.updateProjectionMatrix(),H.uResolution.value.set(f,p),j.uniforms.uCanvasSize.value.set(f,p))});X.observe(e);let Z=()=>{W=document.visibilityState===`visible`,K()};document.addEventListener(`visibilitychange`,Z);let Q=()=>{l.setAnimationLoop(null),setTimeout(()=>{t.halted()||K()},300)};a.addEventListener(`orientationchange`,Q);let $=new IntersectionObserver(([e])=>{G=e.isIntersecting,K()},{threshold:0});return $.observe(e),t.ready(),()=>{t.end(),c.detach(),l.setAnimationLoop(null),X.disconnect(),$.disconnect(),document.removeEventListener(`visibilitychange`,Z),a.removeEventListener(`orientationchange`,Q),e.removeEventListener(`mousemove`,J),e.removeEventListener(`mouseleave`,Y),V.dispose(),U.dispose(),k.dispose(),A.dispose(),B.dispose(),j.dispose(),d.clear(),l.dispose(),e.contains(u)&&e.removeChild(u),setTimeout(()=>l.forceContextLoss(),100)}},[n,r,o,j]),s(A,{mountRef:m,showFallback:!k,fallbackImage:d,fallbackFit:f,fallbackAlt:p})}function L({dotsX:e,dotsY:t,spacing:n,cellToUV:r}){let i=e*t,a=(e-1)*n,o=(t-1)*n,s=new Float32Array(i*3),c=new Float32Array(i),l=new Float32Array(i*2),u=0;for(let i=0;i<t;i++)for(let t=0;t<e;t++){s[u*3+0]=-a/2+t*n,s[u*3+1]=-o/2+i*n,s[u*3+2]=0,c[u]=Math.random();let[d,f]=r(i*e+t);l[u*2]=d,l[u*2+1]=f,u++}return{positions:s,randoms:c,aSimCell:l}}var R=e((()=>{n(),c(),u(),r(),m(),F(),d(I,{dotSize:{type:f.Number,title:`Dot Size`,defaultValue:2,min:.5,max:10,step:.25},dotColor:{type:f.Color,title:`Dot Color`,defaultValue:`#333333`},glowColor:{type:f.Color,title:`Glow Color`,defaultValue:`#ffffff`},dotsX:{type:f.Number,title:`Dots X`,defaultValue:64,min:2,max:256,step:1},dotsY:{type:f.Number,title:`Dots Y`,defaultValue:64,min:2,max:256,step:1},spacing:{type:f.Number,title:`Spacing`,defaultValue:16,min:4,max:80,step:1},decay:{type:f.Number,title:`Decay`,defaultValue:2,min:.1,max:10,step:.1},...P})}));export{R as n,I as t};
//# sourceMappingURL=DotGridGL.CMWvKS01.mjs.map