'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

// Port of InteractiveFooter class from footer.js
class InteractiveFooter {
  constructor(container, canvas) {
    this.container = container;
    this.canvas = canvas;
    if (!this.container || !this.canvas) return;

    this.width = this.container.clientWidth || window.innerWidth || 1920;
    this.height = this.container.clientHeight || window.innerHeight || 800;

    // Simulation settings
    this.fluidRes = 512;
    this.targetMouseX = this.width / 2;
    this.targetMouseY = this.height / 2;
    this.brushX = this.width / 2;
    this.brushY = this.height / 2;
    this.prevBrushX = this.width / 2;
    this.prevBrushY = this.height / 2;
    
    this.isMouseMoving = false;
    this.mouseTimer = null;
    this.distortionStrength = 0.0;
    this.easedDistortion = 0.0;

    // Spring Physics & Inertia States
    this.springVal = new THREE.Vector2(0, 0);
    this.springVel = new THREE.Vector2(0, 0);
    this.mouseVelocity = new THREE.Vector2(0, 0);
    this.easedMouseVelocity = new THREE.Vector2(0, 0);

    // Render loop state
    this.isVisible = false;
    this.animationFrameId = null;
    this.time = 0;

    this.listeners = [];

    // Initialize systems
    this.setupThree();
    this.setupFluidSim();
    this.setupTextTexture();
    this.setupShaderMesh();
    this.setupEvents();
    this.setupObserver();
  }

  setupThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2.0));
    this.renderer.setClearColor(0xffea0a, 1.0);
  }

  setupFluidSim() {
    this.fluidCanvas = document.createElement('canvas');
    this.fluidCanvas.width = this.fluidRes;
    this.fluidCanvas.height = this.fluidRes;
    this.fluidCtx = this.fluidCanvas.getContext('2d');

    this.clearFluidCanvas();

    this.fluidTexture = new THREE.CanvasTexture(this.fluidCanvas);
    this.fluidTexture.minFilter = THREE.LinearFilter;
    this.fluidTexture.magFilter = THREE.LinearFilter;
  }

  clearFluidCanvas() {
    this.fluidCtx.fillStyle = '#000000';
    this.fluidCtx.fillRect(0, 0, this.fluidRes, this.fluidRes);
  }

  updateFluidSim() {
    const ease = 0.08;
    this.brushX += (this.targetMouseX - this.brushX) * ease;
    this.brushY += (this.targetMouseY - this.brushY) * ease;

    const dx = this.brushX - this.prevBrushX;
    const dy = this.brushY - this.prevBrushY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    const vx = this.width > 0 ? dx / this.width : 0;
    const vy = this.height > 0 ? -dy / this.height : 0; 
    
    this.fluidCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.fluidCtx.fillRect(0, 0, this.fluidRes, this.fluidRes);

    if (this.isMouseMoving && speed > 0.01) {
      this.distortionStrength = Math.min(speed * 0.20, 0.85);
      this.mouseVelocity.set(vx, vy);
    } else {
      this.distortionStrength = THREE.MathUtils.lerp(this.distortionStrength, 0.0, 0.08);
      this.mouseVelocity.lerp(new THREE.Vector2(0, 0), 0.08);
    }

    const prevCx = this.width > 0 ? (this.prevBrushX / this.width) * this.fluidRes : this.fluidRes / 2;
    const prevCy = this.height > 0 ? (this.prevBrushY / this.height) * this.fluidRes : this.fluidRes / 2;
    const cx = this.width > 0 ? (this.brushX / this.width) * this.fluidRes : this.fluidRes / 2;
    const cy = this.height > 0 ? (this.brushY / this.height) * this.fluidRes : this.fluidRes / 2;

    const distCanvas = Math.hypot(cx - prevCx, cy - prevCy);
    const steps = Math.max(1, Math.floor(distCanvas / 2.0));

    const radius = 3.5 + Math.min(speed * 0.1, 6.0); 
    const baseOpacity = Math.min(0.12 + speed * 0.02, 0.45); 
    const stepOpacity = baseOpacity / Math.sqrt(steps);

    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 0;
      const x = prevCx + (cx - prevCx) * t;
      const y = prevCy + (cy - prevCy) * t;

      const grad = this.fluidCtx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${stepOpacity})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.fluidCtx.fillStyle = grad;
      this.fluidCtx.beginPath();
      this.fluidCtx.arc(x, y, radius, 0, Math.PI * 2);
      this.fluidCtx.fill();
    }

    this.prevBrushX = this.brushX;
    this.prevBrushY = this.brushY;

    this.fluidTexture.needsUpdate = true;
  }

  setupTextTexture() {
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 2048;
    this.textCanvas.height = 512;
    this.textCtx = this.textCanvas.getContext('2d');

    this.textTexture = new THREE.CanvasTexture(this.textCanvas);
    this.textTexture.minFilter = THREE.LinearFilter;
    this.textTexture.magFilter = THREE.LinearFilter;

    this.drawText();
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        this.drawText();
      });
    }
  }

  drawText() {
    const w = this.textCanvas.width;
    const h = this.textCanvas.height;

    this.textCtx.clearRect(0, 0, w, h);

    this.textCtx.font = 'condensed 340px Anton, Impact, sans-serif';
    this.textCtx.fillStyle = '#ffffff';
    this.textCtx.textAlign = 'center';
    this.textCtx.textBaseline = 'middle';

    this.textCtx.fillText('JAGATHI', w / 2, h / 2 + 25);
    this.textTexture.needsUpdate = true;
  }

  setupShaderMesh() {
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tText: { value: this.textTexture },
        tFluid: { value: this.fluidTexture },
        uTime: { value: 0.0 },
        uDistortion: { value: 0.0 },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: this.width / this.height }
      },
      vertexShader: `
        uniform vec2 uVelocity;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uAspect;
        varying vec2 vUv;
        varying vec2 vScreenUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          vec2 mouseMesh = uMouse * 2.0 - 1.0;
          vec2 diff = pos.xy - mouseMesh;
          
          vec2 diffCorrected = diff;
          diffCorrected.x *= uAspect;
          
          float dist = length(diffCorrected);
          
          float radius = 0.68;
          float influence = smoothstep(radius, 0.0, dist);

          float speed = length(uVelocity);

          if (influence > 0.0 && speed > 0.001) {
            vec2 velDir = uVelocity / speed;
            vec2 perpDir = vec2(-velDir.y, velDir.x);

            pos.xy += uVelocity * influence * 0.40;

            float proj = dot(diffCorrected, velDir);
            float projPerp = dot(diffCorrected, perpDir);

            vec2 stretchOffset = velDir * proj * speed * 0.75 * influence;
            vec2 squeezeOffset = perpDir * projPerp * speed * 0.38 * influence;
            pos.xy += (stretchOffset - squeezeOffset);

            float angle = speed * 1.8 * influence * (1.0 - (dist / radius));
            float cosA = cos(angle);
            float sinA = sin(angle);
            vec2 rotatedDiff = vec2(
              diff.x * cosA - diff.y * sinA,
              diff.x * sinA + diff.y * cosA
            );
            pos.xy = mouseMesh + rotatedDiff;

            float ripple = sin(dist * 18.0 - uTime * 25.0) * speed * 0.09 * influence;
            pos.y += ripple;
            pos.x += cos(dist * 18.0 - uTime * 25.0) * speed * 0.03 * influence;
          }

          if (influence > 0.0) {
            float dx = pos.x - mouseMesh.x;
            float localBend = cos(clamp(dx * 4.5, -1.570796, 1.570796)) * uVelocity.y * 0.42 * influence;
            pos.y += localBend;
          }

          vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          vScreenUv = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D tText;
        uniform sampler2D tFluid;
        uniform float uTime;
        uniform float uDistortion;
        varying vec2 vUv;
        varying vec2 vScreenUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          float a = hash(i + vec2(0.0, 0.0));
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 4; ++i) {
            v += a * noise(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 flowUv = vScreenUv * 6.0 - vec2(uTime * 0.25, uTime * 0.75);
          float flowX = fbm(flowUv) - 0.5;
          float flowY = fbm(flowUv + vec2(43.12, 79.34)) - 0.5;
          
          vec2 distortedScreenUv = vScreenUv + vec2(flowX, flowY) * 0.052;

          float t = texture2D(tFluid, distortedScreenUv).r;

          vec2 texelSize = vec2(1.0 / 512.0);
          float t_left = texture2D(tFluid, distortedScreenUv - vec2(texelSize.x, 0.0)).r;
          float t_right = texture2D(tFluid, distortedScreenUv + vec2(texelSize.x, 0.0)).r;
          float t_up = texture2D(tFluid, distortedScreenUv + vec2(0.0, texelSize.y)).r;
          float t_down = texture2D(tFluid, distortedScreenUv - vec2(0.0, texelSize.y)).r;

          vec2 displacement = vec2(t_right - t_left, t_up - t_down) * 0.075 * uDistortion;

          vec2 smokeUv = vScreenUv * 14.0 - vec2(0.0, uTime * 1.2);
          float smokeNoise = fbm(smokeUv) - 0.5;
          
          displacement += vec2(smokeNoise, -smokeNoise) * 0.016 * t * uDistortion;

          float r = texture2D(tText, vUv - displacement * 2.2).a;
          float g = texture2D(tText, vUv - displacement * 1.1).a;
          float b = texture2D(tText, vUv + displacement * 0.2).a;

          vec3 textCol = vec3(r, g, b);
          vec3 bgCol = vec3(255.0 / 255.0, 234.0 / 255.0, 10.0 / 255.0);
          vec3 finalColor = mix(bgCol, vec3(0.02, 0.02, 0.03), textCol);

          vec3 smokeCol = vec3(0.05, 0.05, 0.08);
          finalColor = mix(finalColor, smokeCol, t * 0.22);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const geom = new THREE.PlaneGeometry(2, 2, 64, 16);
    this.mesh = new THREE.Mesh(geom, this.shaderMaterial);
    this.scene.add(this.mesh);
  }

  setupEvents() {
    const handleMove = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      
      this.targetMouseX = clientX - rect.left;
      this.targetMouseY = clientY - rect.top;

      this.isMouseMoving = true;

      clearTimeout(this.mouseTimer);
      this.mouseTimer = setTimeout(() => {
        this.isMouseMoving = false;
      }, 30);
    };

    const mouseMoveListener = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const touchMoveListener = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const resizeListener = () => this.resize();

    window.addEventListener('mousemove', mouseMoveListener, { passive: true });
    window.addEventListener('touchmove', touchMoveListener, { passive: true });
    window.addEventListener('resize', resizeListener);

    this.listeners.push(
      { type: 'mousemove', target: window, handler: mouseMoveListener },
      { type: 'touchmove', target: window, handler: touchMoveListener },
      { type: 'resize', target: window, handler: resizeListener }
    );
  }

  resize() {
    if (!this.container) return;
    this.width = this.container.clientWidth || window.innerWidth || 1920;
    this.height = this.container.clientHeight || window.innerHeight || 800;

    this.renderer.setSize(this.width, this.height);
    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.uAspect.value = this.width / this.height;
    }
    this.drawText();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isVisible) {
            this.isVisible = true;
            this.animate();
          }
        } else {
          this.isVisible = false;
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
        }
      });
    }, {
      root: null,
      threshold: 0.02
    });

    this.observer.observe(this.container);
  }

  animate() {
    if (!this.isVisible) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    this.time += 0.01;
    this.updateFluidSim();

    const k = 0.06;
    const mass = 1.0;
    const damping = 0.82;

    const forceX = -k * this.springVal.x;
    const forceY = -k * this.springVal.y;

    const dragForceX = this.mouseVelocity.x * 2.2;
    const dragForceY = this.mouseVelocity.y * 2.2;

    const accelX = (forceX + dragForceX) / mass;
    const accelY = (forceY + dragForceY) / mass;

    this.springVel.x += accelX;
    this.springVel.y += accelY;
    
    this.springVel.x *= damping;
    this.springVel.y *= damping;

    this.springVal.x += this.springVel.x;
    this.springVal.y += this.springVel.y;

    if (this.mesh) {
      this.mesh.position.set(0.0, 0.0, 0.0);
    }

    this.easedDistortion = THREE.MathUtils.lerp(this.easedDistortion, this.distortionStrength, 0.08);
    this.easedMouseVelocity.lerp(this.springVal, 0.08);

    const normBrushX = this.width > 0 ? this.brushX / this.width : 0.5;
    const normBrushY = this.height > 0 ? 1.0 - (this.brushY / this.height) : 0.5;

    this.shaderMaterial.uniforms.uTime.value = this.time;
    this.shaderMaterial.uniforms.uDistortion.value = this.easedDistortion;
    this.shaderMaterial.uniforms.uVelocity.value.copy(this.easedMouseVelocity);
    this.shaderMaterial.uniforms.uMouse.value.set(normBrushX, normBrushY);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isVisible = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove all event listeners
    this.listeners.forEach(({ type, target, handler }) => {
      target.removeEventListener(type, handler);
    });

    if (this.observer) {
      this.observer.disconnect();
    }

    // Dispose Three.js objects
    if (this.mesh) {
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
    }
    if (this.shaderMaterial) this.shaderMaterial.dispose();
    if (this.fluidTexture) this.fluidTexture.dispose();
    if (this.textTexture) this.textTexture.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}

export default function Footer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const footerInstance = new InteractiveFooter(container, canvas);

    return () => {
      footerInstance.destroy();
    };
  }, []);

  return (
    <section className="section-panel" id="interactive-footer" ref={containerRef}>
      <div className="footer-canvas-container">
        <canvas id="footer-canvas" ref={canvasRef}></canvas>
      </div>
      <div className="footer-overlay">
        {/* Footer Top: Columns */}
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Pillar 01 / Build</h4>
            <Link href="/construction" className="select-anchor">Construction Projects</Link>
            <a href="#consultation" className="select-anchor">Consultation Request</a>
          </div>
          <div className="footer-col">
            <h4>Pillar 02 / Secure</h4>
            <Link href="/real-estate" className="select-anchor">Real Estate Portfolio</Link>
            <a href="#advisory" className="select-anchor">Advisory Desk</a>
          </div>
          <div className="footer-col">
            <h4>Pillar 03 / Curate</h4>
            <Link href="/interior" className="select-anchor">Interior Systems</Link>
            <a href="mailto:info@jagathi.com" className="select-anchor">Contact Jagathi</a>
          </div>
        </div>

        {/* Footer Bottom: Status and copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            &copy; 2026 JAGATHI. All Rights Reserved.
          </div>
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>JAGATHI_NODE_OK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
