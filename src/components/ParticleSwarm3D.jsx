import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleSwarm3D({ className = "fixed inset-0 w-full h-full pointer-events-none z-0" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement || document.body;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const COUNT = isMobile ? 3500 : 9000;
    const rand = Math.random;
    const gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;

    const posArr = new Float32Array(COUNT * 3);
    const ringId = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);

    const rings = [
      { r: 6.4, tx: -0.5, tz: 0 },
      { r: 5.3, tx: 0.9, tz: 0.7 },
      { r: 4.2, tx: 0.25, tz: -1.1 },
    ];

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const pick = rand();
      seeds[i] = rand();
      scales[i] = seeds[i] > 0.985 ? 2.4 : 0.5 + rand() * 0.9;

      if (pick < 0.12) {
        ringId[i] = 4;
        let x = gauss(), y = gauss(), z = gauss();
        const n = Math.hypot(x, y, z) || 1;
        const r = 7.5 + rand() * 5.5;
        posArr[i3] = (x / n) * r;
        posArr[i3 + 1] = (y / n) * r;
        posArr[i3 + 2] = (z / n) * r;
        continue;
      }
      if (pick < 0.24) {
        ringId[i] = 3;
        let x = gauss(), y = gauss(), z = gauss();
        const n = Math.hypot(x, y, z) || 1;
        const r = 1.7 * Math.cbrt(rand());
        posArr[i3] = (x / n) * r;
        posArr[i3 + 1] = (y / n) * r;
        posArr[i3 + 2] = (z / n) * r;
        continue;
      }

      ringId[i] = i % 3;
      const ring = rings[i % 3];
      const ang = rand() * Math.PI * 2;
      const x = Math.cos(ang) * ring.r + gauss() * 0.07;
      const y = gauss() * 0.07;
      const z = Math.sin(ang) * ring.r + gauss() * 0.07;

      let y2 = y * Math.cos(ring.tx) - z * Math.sin(ring.tx);
      const z2 = y * Math.sin(ring.tx) + z * Math.cos(ring.tx);
      const x2 = x * Math.cos(ring.tz) - y2 * Math.sin(ring.tz);
      y2 = x * Math.sin(ring.tz) + y2 * Math.cos(ring.tz);

      posArr[i3] = x2;
      posArr[i3 + 1] = y2;
      posArr[i3 + 2] = z2;
    }

    const SNOISE = `
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

    const VERT =
      `attribute float aSeed;attribute float aScale;attribute float aRing;uniform float uTime;uniform float uSize;uniform float uPixelRatio;uniform vec3 uColor;uniform vec3 uCore;uniform vec3 uRing0;uniform vec3 uRing1;uniform vec3 uRing2;varying vec3 vColor;varying float vTwinkle;` +
      SNOISE +
      `
      void main(){
      vec3 pos=position;
      if(aRing<2.5){vec3 ax=aRing<0.5?normalize(vec3(1.0,0.18,0.0)):aRing<1.5?normalize(vec3(0.0,1.0,0.22)):normalize(vec3(0.25,0.0,1.0));float ang=uTime*(aRing<0.5?0.24:aRing<1.5?-0.38:0.55);float c=cos(ang),s=sin(ang);pos=pos*c+cross(ax,pos)*s+ax*dot(ax,pos)*(1.0-c);}
      vec3 np=pos*0.2+vec3(uTime*0.18)+aSeed*6.28;
      pos+=vec3(snoise(np),snoise(np+31.7),snoise(np+74.3))*0.13;
      pos.x+=sin(uTime*0.9+aSeed*40.0)*0.05;
      pos.y+=cos(uTime*0.7+aSeed*30.0)*0.05;
      vColor=uColor;
      if(aRing<2.5){vColor=aRing<0.5?uRing0:aRing<1.5?uRing1:uRing2;}
      vColor=mix(vColor,uCore,smoothstep(2.5,1.4,length(pos)));
      vColor=mix(vColor,vec3(1.0),step(0.985,aSeed)*0.9);
      vTwinkle=0.6+0.4*sin(uTime*(0.6+aSeed*1.8)+aSeed*20.0);
      vec4 mv=modelViewMatrix*vec4(pos,1.0);
      gl_PointSize=uSize*aScale*uPixelRatio*(12.0/-mv.z);
      gl_Position=projectionMatrix*mv;
      }`;

    const FRAG = `precision mediump float;uniform float uOpacity;varying vec3 vColor;varying float vTwinkle;
      void main(){float d=length(gl_PointCoord-0.5);float alpha=smoothstep(0.5,0.12,d);alpha+=smoothstep(0.12,0.0,d)*0.5;gl_FragColor=vec4(vColor,alpha*vTwinkle*uOpacity);}`;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const getW = () => container.clientWidth || window.innerWidth;
    const getH = () => container.clientHeight || window.innerHeight;

    const pr = Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(getW(), getH());

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, getW() / getH(), 0.1, 100);
    camera.position.z = 14.5;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRing', new THREE.BufferAttribute(ringId, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uPixelRatio: { value: pr },
      uOpacity: { value: 0.85 },
      uColor: { value: new THREE.Color('#0d9488') },
      uCore: { value: new THREE.Color('#5eead4') },
      uRing0: { value: new THREE.Color('#0f766e') },
      uRing1: { value: new THREE.Color('#10b981') },
      uRing2: { value: new THREE.Color('#06b6d4') },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const group = new THREE.Group();
    group.add(new THREE.Points(geo, mat));
    scene.add(group);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const handleMouseMove = (e) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animId;

    function frame() {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      group.rotation.y = mx * 0.35 + t * 0.06 + Math.sin(t * 0.07) * 0.06;
      group.rotation.x = my * 0.22 + Math.sin(t * 0.23) * 0.1;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(frame);
    }

    frame();

    const handleResize = () => {
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
}
