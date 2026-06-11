// PISPARROW - Advanced High-Fidelity WebGL Footer Component
// GPU-Accelerated Localized Letter Distortion & Swirling FBM Smoke Shaders
// Powered by Three.js and Custom GLSL Shaders

class InteractiveFooter {
  constructor() {
    this.container = document.getElementById('interactive-footer');
    this.canvas = document.getElementById('footer-canvas');
    if (!this.container || !this.canvas) return;

    // Safety fallback: if container dimensions are 0 due to initial layout hiding,
    // fallback to window dimensions or defaults to prevent division by zero / NaN crashes
    this.width = this.container.clientWidth || window.innerWidth || 1920;
    this.height = this.container.clientHeight || window.innerHeight || 800;

    // Simulation settings
    this.fluidRes = 512; // high-resolution displacement map for wispier smoke details
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
    this.springVal = new THREE.Vector2(0, 0); // holds the spring displacement
    this.springVel = new THREE.Vector2(0, 0); // holds the spring velocity
    this.mouseVelocity = new THREE.Vector2(0, 0);
    this.easedMouseVelocity = new THREE.Vector2(0, 0);

    // Render loop state
    this.isVisible = false;
    this.animationFrameId = null;
    this.time = 0;

    // Initialize systems
    this.setupThree();
    this.setupFluidSim();
    this.setupTextTexture();
    this.setupShaderMesh();
    this.setupEvents();
    this.setupObserver();
  }

  // --- THREE.JS SCENE SETUP ---
  setupThree() {
    this.scene = new THREE.Scene();
    
    // Orthographic camera for rendering a flat full-screen quad
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.setClearColor(0xffe600, 1.0); // Vibrant Jagathi Yellow background
  }

  // --- 2D FLUID SIMULATION (Displacement Map Canvas) ---
  setupFluidSim() {
    this.fluidCanvas = document.createElement('canvas');
    this.fluidCanvas.width = this.fluidRes;
    this.fluidCanvas.height = this.fluidRes;
    this.fluidCtx = this.fluidCanvas.getContext('2d');

    // Start with a clean black background
    this.clearFluidCanvas();

    // Create Three.js texture from simulation canvas
    this.fluidTexture = new THREE.CanvasTexture(this.fluidCanvas);
    this.fluidTexture.minFilter = THREE.LinearFilter;
    this.fluidTexture.magFilter = THREE.LinearFilter;
  }

  clearFluidCanvas() {
    this.fluidCtx.fillStyle = '#000000';
    this.fluidCtx.fillRect(0, 0, this.fluidRes, this.fluidRes);
  }

  updateFluidSim() {
    // 1. Viscous Lerp: smooth brush coords catching up to mouse position
    const ease = 0.08; // Easing variable for viscous lag
    this.brushX += (this.targetMouseX - this.brushX) * ease;
    this.brushY += (this.targetMouseY - this.brushY) * ease;

    // Calculate momentum/speed of the brush
    const dx = this.brushX - this.prevBrushX;
    const dy = this.brushY - this.prevBrushY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Compute normalized velocity vector (positive Y is UP, matching Three.js coordinate system)
    // Division-by-zero guards prevent NaN values
    const vx = this.width > 0 ? dx / this.width : 0;
    const vy = this.height > 0 ? -dy / this.height : 0; 
    
    // 2. Fade visual trail on hidden canvas to black
    this.fluidCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail fade speed
    this.fluidCtx.fillRect(0, 0, this.fluidRes, this.fluidRes);

    // 3. Update distortion strength & velocity based on movement
    if (this.isMouseMoving && speed > 0.01) {
      this.distortionStrength = Math.min(speed * 0.20, 0.85);
      this.mouseVelocity.set(vx, vy);
    } else {
      // Smoothly snap back to zero when idle
      this.distortionStrength = THREE.MathUtils.lerp(this.distortionStrength, 0.0, 0.08);
      this.mouseVelocity.lerp(new THREE.Vector2(0, 0), 0.08);
    }

    // 4. Draw continuous trail by interpolating between previous and current brush positions
    const prevCx = this.width > 0 ? (this.prevBrushX / this.width) * this.fluidRes : this.fluidRes / 2;
    const prevCy = this.height > 0 ? (this.prevBrushY / this.height) * this.fluidRes : this.fluidRes / 2;
    const cx = this.width > 0 ? (this.brushX / this.width) * this.fluidRes : this.fluidRes / 2;
    const cy = this.height > 0 ? (this.brushY / this.height) * this.fluidRes : this.fluidRes / 2;

    const distCanvas = Math.hypot(cx - prevCx, cy - prevCy);
    // Draw circles every 2 canvas pixels to guarantee a continuous smooth line at high speeds
    const steps = Math.max(1, Math.floor(distCanvas / 2.0));

    // Dynamic brush radius and opacity matching speed/momentum (Refined for wispier detailed smoke)
    const radius = 3.5 + Math.min(speed * 0.1, 6.0); 
    const baseOpacity = Math.min(0.12 + speed * 0.02, 0.45); 
    // Scale step opacity to prevent saturation buildup on overlapping steps
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

    // Alert Three.js to re-upload texture
    this.fluidTexture.needsUpdate = true;
  }

  // --- DYNAMIC TEXT TEXTURE GENERATION ---
  setupTextTexture() {
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 2048;
    this.textCanvas.height = 512;
    this.textCtx = this.textCanvas.getContext('2d');

    this.textTexture = new THREE.CanvasTexture(this.textCanvas);
    this.textTexture.minFilter = THREE.LinearFilter;
    this.textTexture.magFilter = THREE.LinearFilter;

    // Check Google Font loading state
    this.drawText();
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.drawText();
      });
    }
  }

  drawText() {
    const w = this.textCanvas.width;
    const h = this.textCanvas.height;

    this.textCtx.clearRect(0, 0, w, h);

    // Font style: bold, condensed Anton font
    this.textCtx.font = 'condensed 340px Anton, Impact, sans-serif';
    this.textCtx.fillStyle = '#ffffff';
    this.textCtx.textAlign = 'center';
    this.textCtx.textBaseline = 'middle';

    // Draw the massive text centered
    this.textCtx.fillText('PISPARROW', w / 2, h / 2 + 25);

    // Alert Three.js to re-upload texture
    this.textTexture.needsUpdate = true;
  }

  // --- SHADER MESH SETUP ---
  setupShaderMesh() {
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tText: { value: this.textTexture },
        tFluid: { value: this.fluidTexture }, // displacementTexture
        uTime: { value: 0.0 },
        uDistortion: { value: 0.0 },
        uVelocity: { value: new THREE.Vector2(0, 0) }, // spring-damping velocity uniform
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // normalized brush coordinates [0, 1]
        uAspect: { value: this.width / this.height }    // Aspect ratio to correct UV spacing
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

          // 1. Calculate aspect-ratio corrected distance in mesh space
          // Mesh coordinates span from -1.0 to 1.0 on both X and Y.
          vec2 mouseMesh = uMouse * 2.0 - 1.0;
          vec2 diff = pos.xy - mouseMesh;
          
          // Multiply X by aspect ratio to make the distance check circular in screen space
          vec2 diffCorrected = diff;
          diffCorrected.x *= uAspect;
          
          float dist = length(diffCorrected);
          
          // Influence radius (circular boundary, maps to approx 1.5 character heights)
          float radius = 0.68;
          float influence = smoothstep(radius, 0.0, dist);

          float speed = length(uVelocity);

          if (influence > 0.0 && speed > 0.001) {
            vec2 velDir = uVelocity / speed;
            vec2 perpDir = vec2(-velDir.y, velDir.x);

            // 2. Localized Pull / Drag displacement (pure offset, not center-scaled coordinate multiplication)
            // Pulls the vertices locally under the cursor along the mouse trajectory
            pos.xy += uVelocity * influence * 0.40;

            // 3. Localized Poisson Stretch & Squeeze
            // Projects the vertex coordinate relative to the cursor onto velocity and perpendicular axes
            float proj = dot(diffCorrected, velDir);
            float projPerp = dot(diffCorrected, perpDir);

            // Stretch along motion direction, squeeze in the perpendicular direction
            vec2 stretchOffset = velDir * proj * speed * 0.75 * influence;
            vec2 squeezeOffset = perpDir * projPerp * speed * 0.38 * influence;
            pos.xy += (stretchOffset - squeezeOffset);

            // 4. Localized Twist / Spin
            // Rotates the vertex coordinates around the cursor, creating a liquid twist
            float angle = speed * 1.8 * influence * (1.0 - (dist / radius));
            float cosA = cos(angle);
            float sinA = sin(angle);
            vec2 rotatedDiff = vec2(
              diff.x * cosA - diff.y * sinA,
              diff.x * sinA + diff.y * cosA
            );
            pos.xy = mouseMesh + rotatedDiff;

            // 5. Localized Ripple Wave radiating outward from the cursor
            float ripple = sin(dist * 18.0 - uTime * 25.0) * speed * 0.09 * influence;
            pos.y += ripple;
            pos.x += cos(dist * 18.0 - uTime * 25.0) * speed * 0.03 * influence;
          }

          // 6. Localized Bow/Bend (restricted to cursor horizontal neighborhood)
          // Curves only the letters directly passing under the cursor, not the entire word
          if (influence > 0.0) {
            float dx = pos.x - mouseMesh.x;
            float localBend = cos(clamp(dx * 4.5, -1.570796, 1.570796)) * uVelocity.y * 0.42 * influence;
            pos.y += localBend;
          }

          // Project coordinates to calculate screen-space UVs for localized fluid rendering
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

        // Simple hash-based 2D noise helper
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        // Bilinear interpolation noise
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

        // 4-Octave Fractional Brownian Motion (FBM) noise generator for wispier details
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
          // 1. Distort the screen UV coordinates using animated FBM noise before fluid lookup
          // This breaks the smooth brush circles into fine, swirling smoke tendrils
          vec2 flowUv = vScreenUv * 6.0 - vec2(uTime * 0.25, uTime * 0.75);
          float flowX = fbm(flowUv) - 0.5;
          float flowY = fbm(flowUv + vec2(43.12, 79.34)) - 0.5;
          
          vec2 distortedScreenUv = vScreenUv + vec2(flowX, flowY) * 0.052;

          // Sample displacement map in screen space using distorted coordinates
          float t = texture2D(tFluid, distortedScreenUv).r;

          // 2. Heightmap gradient slope calculation in screen-space
          vec2 texelSize = vec2(1.0 / 512.0); // mapped to 512 canvas resolution
          float t_left = texture2D(tFluid, distortedScreenUv - vec2(texelSize.x, 0.0)).r;
          float t_right = texture2D(tFluid, distortedScreenUv + vec2(texelSize.x, 0.0)).r;
          float t_up = texture2D(tFluid, distortedScreenUv + vec2(0.0, texelSize.y)).r;
          float t_down = texture2D(tFluid, distortedScreenUv - vec2(0.0, texelSize.y)).r;

          // Displacement vector pointing outward from the trail slope
          vec2 displacement = vec2(t_right - t_left, t_up - t_down) * 0.075 * uDistortion;

          // 3. Swirling FBM Smoke Noise integration
          // Coordinates animated over uTime to make the smoke drift upward organically
          vec2 smokeUv = vScreenUv * 14.0 - vec2(0.0, uTime * 1.2);
          float smokeNoise = fbm(smokeUv) - 0.5;
          
          // Add wispy micro-turbulences to displacement coords where trail density (t) is active
          displacement += vec2(smokeNoise, -smokeNoise) * 0.016 * t * uDistortion;

          // 4. Chromatic Aberration RGB split on text alpha channel (using local coordinates)
          float r = texture2D(tText, vUv - displacement * 2.2).a;
          float g = texture2D(tText, vUv - displacement * 1.1).a;
          float b = texture2D(tText, vUv + displacement * 0.2).a;

          vec3 textCol = vec3(r, g, b);

          // Vibrant Jagathi Yellow background: #FFE600 (RGB: 255, 230, 0)
          vec3 bgCol = vec3(255.0 / 255.0, 230.0 / 255.0, 0.0 / 255.0);

          // Blend the dark charcoal text and its colored displacement fringes over the yellow bg
          vec3 finalColor = mix(bgCol, vec3(0.02, 0.02, 0.03), textCol);

          // 5. Subtle subtractive dark grey smoke shadow trail
          vec3 smokeCol = vec3(0.05, 0.05, 0.08);
          finalColor = mix(finalColor, smokeCol, t * 0.22);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    // Subdivide Plane to enable smooth bending distortions in the Vertex Shader
    const geom = new THREE.PlaneGeometry(2, 2, 64, 16);
    this.mesh = new THREE.Mesh(geom, this.shaderMaterial);
    this.scene.add(this.mesh);
  }

  // --- EVENT BINDINGS ---
  setupEvents() {
    const handleMove = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      
      // Keep track of cursor coordinates inside the footer bounding rect
      this.targetMouseX = clientX - rect.left;
      this.targetMouseY = clientY - rect.top;

      this.isMouseMoving = true;

      clearTimeout(this.mouseTimer);
      this.mouseTimer = setTimeout(() => {
        this.isMouseMoving = false;
      }, 30);
    };

    window.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.container.clientWidth || window.innerWidth || 1920;
    this.height = this.container.clientHeight || window.innerHeight || 800;

    this.renderer.setSize(this.width, this.height);
    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.uAspect.value = this.width / this.height;
    }
    this.drawText(); // Re-render canvas boundaries to keep text crisp
  }

  // --- INTERSECTIONOBSERVER PERFORMANCE OBSERVATION ---
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
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
      root: null, // viewport
      threshold: 0.02 // start loop when 2% of the footer is visible
    });

    observer.observe(this.container);
  }

  // --- ANIMATION LOOP ---
  animate() {
    if (!this.isVisible) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    this.time += 0.01;

    // 1. Advance trailing brush displacement map
    this.updateFluidSim();

    // 2. Solve Spring-Damping Physics for Inertia and elastic rebound
    const k = 0.06;         // stiffness of rubber band spring
    const mass = 1.0;       // mass of the word
    const damping = 0.82;   // friction/decay (0.82 permits slight overshoots and elastic springback)

    // Hooke's Law: F = -k * x (force pulling deformation back to zero)
    const forceX = -k * this.springVal.x;
    const forceY = -k * this.springVal.y;

    // Drag inertia forces: dragging cursor pulls deformation values
    const dragForceX = this.mouseVelocity.x * 2.2;
    const dragForceY = this.mouseVelocity.y * 2.2;

    const accelX = (forceX + dragForceX) / mass;
    const accelY = (forceY + dragForceY) / mass;

    // Integrate acceleration into velocity, apply friction damping, and update coordinates
    this.springVel.x += accelX;
    this.springVel.y += accelY;
    
    this.springVel.x *= damping;
    this.springVel.y *= damping;

    this.springVal.x += this.springVel.x;
    this.springVal.y += this.springVel.y;

    // Anchor text mesh at exact center (no position translation, only internal vertex warping)
    if (this.mesh) {
      this.mesh.position.set(0.0, 0.0, 0.0);
    }

    // 3. Interpolate/ease overall local distortion values
    this.easedDistortion = THREE.MathUtils.lerp(this.easedDistortion, this.distortionStrength, 0.08);

    // Ease spring velocity vector passed to vertex shader to avoid hard jumps
    this.easedMouseVelocity.lerp(this.springVal, 0.08);

    // Calculate normalized brush coordinate [0, 1] (inverted Y for UV space)
    const normBrushX = this.width > 0 ? this.brushX / this.width : 0.5;
    const normBrushY = this.height > 0 ? 1.0 - (this.brushY / this.height) : 0.5;

    // 4. Update shader material parameters
    this.shaderMaterial.uniforms.uTime.value = this.time;
    this.shaderMaterial.uniforms.uDistortion.value = this.easedDistortion;
    this.shaderMaterial.uniforms.uVelocity.value.copy(this.easedMouseVelocity);
    this.shaderMaterial.uniforms.uMouse.value.set(normBrushX, normBrushY);

    // 5. Render composite scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate interactive WebGL footer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new InteractiveFooter());
} else {
  new InteractiveFooter();
}
