// Πsparrow Continuous 3D System Corridor with Fluid Energy Stream
// Powered by Three.js (r128), GSAP, and Lenis

// --- CONFIGURATION OBJECT ---
const Config = {
  viscosity: 0.95,       // Advected velocity dampening
  densityTealDecay: 0.98, // Teal stream core decay
  densityOrangeDecay: 0.92,// Click orange flare decay
  refractionStrength: 0.065,// Composite screen-space distortion coefficient
  particleScale: 1.0,     // Particle density scaler (managed by ResponsiveManager)
  fluidSimRes: 512,       // Resolution of simulation buffer (managed by ResponsiveManager)
  isMobile: false        // Mobile bypass active (managed by ResponsiveManager)
};

// --- GLOBAL VARIABLES ---
let renderer, scene3D, camera3D;
let sceneManager, architectureLayer, fluidLayer, sectionController, uiOverlay, responsiveManager;
let gridMaterial, floorGrid, ceilingGrid, heroGroup;
let lights = {};

// Camera spline checkpoints for scroll navigation
const checkpoints = [
  { z: 0.0,   x: 0.0,  y: 0.0,  targetX: 0.0,  targetY: 0.0,  targetZ: -6.0 },  // Hero
  { z: -10.0, x: -1.8, y: 0.2,  targetX: 1.2,  targetY: 0.0,  targetZ: -10.0 }, // About
  { z: -20.0, x: 0.0,  y: 0.0,  targetX: 0.0,  targetY: 0.0,  targetZ: -28.0 }, // Registry
  { z: -30.0, x: 1.5,  y: -0.2, targetX: -1.5, targetY: 0.0,  targetZ: -30.0 }, // Services
  { z: -40.0, x: -1.5, y: 0.2,  targetX: 1.5,  targetY: 0.0,  targetZ: -40.0 }, // Partners
  { z: -50.0, x: 0.0,  y: -0.6, targetX: 0.0,  targetY: 0.4,  targetZ: -55.0 }, // Contact
  { z: -60.0, x: 0.0,  y: 0.0,  targetX: 0.0,  targetY: 0.0,  targetZ: -65.0 }  // Footer
];

const mouseND = new THREE.Vector2(0, 0);
const targetMouseUV = new THREE.Vector2(0.5, 0.5);
const easedMouseUV = new THREE.Vector2(0.5, 0.5);
const prevMouseUV = new THREE.Vector2(0.5, 0.5);

let isMouseDown = false;
let scrollProgress = 0.0;
const targetTilt = new THREE.Vector2(0, 0);
const currentTilt = new THREE.Vector2(0, 0);

let submitPulseActive = false;
let submitPulseVal = 0.0;

// Setup meshes references arrays
const aboutCubes = [], registrySlabs = [], registryLines = [];
const serviceNodes = [], serviceStreams = [];
const partnerNodes = [];
let contactDeck, ambientParticles, clickParticlesPool = [];

// Start application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- RESPONSIVE MANAGER CLASS ---
class ResponsiveManager {
  constructor() {
    this.detectDevice();
  }

  detectDevice() {
    const width = window.innerWidth;
    if (width <= 768) {
      Config.isMobile = true;
      Config.fluidSimRes = 128;
      Config.particleScale = 0.2;
    } else if (width <= 1024) {
      Config.isMobile = false;
      Config.fluidSimRes = 256;
      Config.particleScale = 0.5;
    } else {
      Config.isMobile = false;
      Config.fluidSimRes = 512;
      Config.particleScale = 1.0;
    }
  }

  clampPixelRatio() {
    return Config.isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2.0);
  }
}

// --- SCENE MANAGER CLASS ---
class SceneManager {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.setupScene();
    this.setupTargets();
  }

  setupScene() {
    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: !Config.isMobile, // Disable MSAA on mobile for fillrate boosts
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(this.width, this.height);
    renderer.setPixelRatio(responsiveManager.clampPixelRatio());
    renderer.setClearColor(0xffffff, 1);
    this.container.appendChild(renderer.domElement);

    // 3D Scene with light volumetric-like fog
    scene3D = new THREE.Scene();
    scene3D.fog = new THREE.FogExp2(0xffffff, 0.038);

    // Primary perspective camera
    camera3D = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    camera3D.position.copy(checkpoints[0]);

    // Lights Setup
    lights.ambient = new THREE.AmbientLight(0x0a0d15, 2.0);
    scene3D.add(lights.ambient);

    lights.cyanPoint = new THREE.PointLight(0x44f5d2, 5.0, 20);
    lights.cyanPoint.position.set(0, 0, -4);
    scene3D.add(lights.cyanPoint);

    lights.indigoPoint = new THREE.PointLight(0x6366f1, 7.0, 22);
    lights.indigoPoint.position.set(0, 0, -25);
    scene3D.add(lights.indigoPoint);

    lights.contactPoint = new THREE.PointLight(0x44f5d2, 4.0, 15);
    lights.contactPoint.position.set(0, 0, -50);
    scene3D.add(lights.contactPoint);
  }

  setupTargets() {
    // Composite full-screen refraction/glow quad setup on both desktop and mobile
    this.compositeScene = new THREE.Scene();
    this.compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    if (Config.isMobile) {
      // Mobile: Render dark navy stream and golden flares blending using NormalBlending
      this.compositeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tFluid: { value: null }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tFluid;
          varying vec2 vUv;
          void main() {
            vec4 fluid = texture2D(tFluid, vUv);
            
            // Dark navy/indigo stream core
            vec3 streamCol = vec3(15.0 / 255.0, 20.0 / 255.0, 32.0 / 255.0);
            // Golden yellow drag flare
            vec3 goldenFlare = vec3(1.0, 0.70, 0.0);
            
            // Calculate opacity based on density layers
            float alpha = fluid.b * 0.58 + fluid.a * 0.62;
            vec3 finalColor = mix(vec3(0.0), streamCol, fluid.b * 0.58);
            finalColor = mix(finalColor, goldenFlare, fluid.a * 0.62);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
    } else {
      // Desktop: Scene render target for full screen-space refraction
      this.sceneTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        depthBuffer: true,
        stencilBuffer: false
      });

      this.compositeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tScene: { value: this.sceneTarget.texture },
          tFluid: { value: null },
          uRefraction: { value: Config.refractionStrength }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tScene;
          uniform sampler2D tFluid;
          uniform float uRefraction;
          varying vec2 vUv;

          void main() {
            // Read fluid vectors
            vec4 fluid = texture2D(tFluid, vUv);
            
            // Refract UVs using velocity channels (rg) and teal core density (b)
            vec2 displace = (fluid.rg * 0.14 + vec2(fluid.b * 0.035, -fluid.b * 0.035)) * uRefraction;
            vec2 sceneUv = vUv + displace;

            // Sample scene target with Chromatic Aberration
            float r = texture2D(tScene, sceneUv - displace * 1.5).r;
            float g = texture2D(tScene, sceneUv).g;
            float b = texture2D(tScene, sceneUv + displace * 1.5).b;
            vec3 sceneColor = vec3(r, g, b);

            // Subtractive blend with dark navy fluid stream core (fluid.b)
            vec3 streamCol = vec3(15.0 / 255.0, 20.0 / 255.0, 32.0 / 255.0);
            vec3 finalColor = mix(sceneColor, streamCol, fluid.b * 0.58);

            // Screen/mix blend with vibrant golden yellow drag flares (fluid.a)
            vec3 goldenFlare = vec3(1.0, 0.70, 0.0);
            finalColor = mix(finalColor, goldenFlare, fluid.a * 0.62);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      });
    }

    const compQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.compositeMaterial);
    this.compositeScene.add(compQuad);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;

    camera3D.aspect = w / h;
    camera3D.updateProjectionMatrix();

    renderer.setSize(w, h);
    if (!Config.isMobile && this.sceneTarget) {
      this.sceneTarget.setSize(w * responsiveManager.clampPixelRatio(), h * responsiveManager.clampPixelRatio());
    }
  }
}

// --- FLUID ENERGY LAYER CLASS ---
class FluidLayer {
  constructor() {
    this.mouse = new THREE.Vector2(0.5, 0.5);
    this.prevMouse = new THREE.Vector2(0.5, 0.5);
    this.mouseVelocity = new THREE.Vector2(0, 0);
    
    this.dragBoost = 0.0;
    this.easedDragBoost = 0.0;
    this.scrollSpeed = 0.0;

    this.setupTargets();
    this.setupShaders();
    this.setupInteractions();
    this.setupParticles();
  }

  setupTargets() {
    const size = Config.fluidSimRes;
    const rtOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false
    };

    // Ping-pong targets for velocity & density advection
    this.targetA = new THREE.WebGLRenderTarget(size, size, rtOptions);
    this.targetB = new THREE.WebGLRenderTarget(size, size, rtOptions);
  }

  setupShaders() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Curl-Noise Advection feedback shader
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uDragBoost: { value: 0.0 },
        uScrollSpeed: { value: 0.0 },
        uDecay: { value: Config.viscosity },
        uTealDecay: { value: Config.densityTealDecay },
        uOrangeDecay: { value: Config.densityOrangeDecay },
        uRadius: { value: 0.045 },
        uTime: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tPrev;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform vec2 uMouseVel;
        uniform float uDragBoost;
        uniform float uScrollSpeed;
        uniform float uDecay;
        uniform float uTealDecay;
        uniform float uOrangeDecay;
        uniform float uRadius;
        uniform float uTime;
        varying vec2 vUv;

        float distToSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a, ba = b - a;
          float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          // Read previous velocity/density state
          vec4 prev = texture2D(tPrev, vUv);
          vec2 vel = prev.rg;

          // Advection coordinate backtrace (drifting corridor stream down Y axis)
          vec2 advectUv = vUv - vel * 0.013 - vec2(0.0, 0.0025 + uScrollSpeed * 0.0095);
          vec4 diffuse = texture2D(tPrev, advectUv);

          // Add pseudo-curl noise vectors for turbulent loops
          vec2 curl = vec2(
            sin(advectUv.y * 14.0 + uTime * 1.6) * cos(advectUv.x * 7.0),
            cos(advectUv.x * 14.0 + uTime * 1.6) * sin(advectUv.y * 7.0)
          ) * (0.0007 + uScrollSpeed * 0.0012);
          diffuse.rg += curl;

          // Inject mouse dragging forces
          float d = distToSegment(vUv, uPrevMouse, uMouse);
          if (d < uRadius) {
            float brush = 1.0 - smoothstep(0.0, uRadius, d);
            diffuse.rg += uMouseVel * brush * 0.15;
            diffuse.b += brush * (0.42 + uDragBoost * 0.45);  // Teal core density
            diffuse.a += brush * uDragBoost * 0.95;          // Orange flare density
          }

          // Feed constant continuous stream energy at top edge (Y = 1.0)
          if (vUv.y > 0.98) {
            float streamGlow = (sin(vUv.x * 24.0 + uTime * 2.8) * 0.35 + 0.65) * 0.22;
            diffuse.b += streamGlow;
          }

          // Multiply decays
          diffuse.rg *= uDecay;
          diffuse.b *= uTealDecay;
          diffuse.a *= uOrangeDecay;

          gl_FragColor = clamp(diffuse, 0.0, 1.0);
        }
      `
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(quad);
  }

  setupInteractions() {
    const onPointerMove = (e) => {
      const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : undefined);
      const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : undefined);

      if (x !== undefined && y !== undefined) {
        // Normalized device coordinates for camera tilts & raycasting
        mouseND.x = (x / window.innerWidth) * 2 - 1;
        mouseND.y = -(y / window.innerHeight) * 2 + 1;

        // Direct screen-space UV coordinates (0 to 1) for the fluid simulation
        this.mouse.set(x / window.innerWidth, 1.0 - (y / window.innerHeight));
      }

      targetTilt.set(mouseND.x * 0.4, mouseND.y * 0.4);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    const onPointerDown = (e) => {
      // Don't trigger fluid burst on click if user clicks interactive form/nav items
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
        return;
      }
      isMouseDown = true;
      this.dragBoost = 1.0;
      this.triggerBurstParticles();
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown, { passive: true });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      this.dragBoost = 0.0;
    });
    window.addEventListener('touchend', () => {
      isMouseDown = false;
      this.dragBoost = 0.0;
    });
  }

  setupParticles() {
    // Floating ambient particle counts based on device capacities
    const count = Math.floor(250 * Config.particleScale);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15.0; // X
      positions[i + 1] = (Math.random() - 0.5) * 4.0; // Y
      positions[i + 2] = Math.random() * -65.0 + 5.0; // Z
      speeds.push(Math.random() * 0.009 + 0.004);
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x44f5d2,
      size: Config.isMobile ? 0.06 : 0.042,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });

    ambientParticles = new THREE.Points(geom, mat);
    ambientParticles.userData = { speeds: speeds };
    scene3D.add(ambientParticles);
  }

  triggerBurstParticles() {
    // Generate physical spark loops on touch/click
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseND, camera3D);
    const intersects = raycaster.intersectObject(floorGrid);
    if (intersects.length > 0) {
      const hit = intersects[0].point;
      let count = 0;
      
      for (let i = 0; i < clickParticlesPool.length; i++) {
        const p = clickParticlesPool[i];
        if (p.life <= 0.05 && count < 15) {
          p.mesh.position.copy(hit);
          p.mesh.material.opacity = 1.0;
          p.mesh.material.color.setHex(Math.random() > 0.4 ? 0x44f5d2 : 1.0 * 0xff9900); // Mix teal and warm orange sparks
          p.life = 1.0;
          p.velocity.set(
            (Math.random() - 0.5) * 0.16,
            Math.random() * 0.12 + 0.02,
            (Math.random() - 0.5) * 0.16
          );
          count++;
        }
      }
    }
  }

  update(time) {
    // Compute Mouse Velocity vector
    this.mouseVelocity.subVectors(this.mouse, this.prevMouse);
    this.prevMouse.copy(this.mouse);

    this.easedDragBoost = THREE.MathUtils.lerp(this.easedDragBoost, this.dragBoost, 0.1);

    // Swap buffers advect pass
    this.material.uniforms.tPrev.value = this.targetA.texture;
    this.material.uniforms.uMouse.value.copy(this.mouse);
    this.material.uniforms.uPrevMouse.value.copy(this.prevMouse);
    this.material.uniforms.uMouseVel.value.copy(this.mouseVelocity);
    this.material.uniforms.uDragBoost.value = this.easedDragBoost;
    this.material.uniforms.uScrollSpeed.value = this.scrollSpeed;
    this.material.uniforms.uTime.value = time;

    renderer.setRenderTarget(this.targetB);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    const temp = this.targetA;
    this.targetA = this.targetB;
    this.targetB = temp;
  }
}

// --- ARCHITECTURAL 3D LAYER CLASS ---
class ArchitectureLayer {
  constructor() {
    this.buildSlabs();
    this.buildInteractiveCubes();
    this.buildTriangleNodes();
    this.buildIdentityMonoliths();
  }

  buildSlabs() {
    // Section 1: Hero П structural frames
    heroGroup = new THREE.Group();
    heroGroup.position.set(2.0, 0.0, -3.0);
    scene3D.add(heroGroup);

    const buildSlabGeometry = (w, h, d, x, y, z, color = 0x44f5d2) => {
      const blockMat = new THREE.MeshPhysicalMaterial({
        color: 0x050a12,
        roughness: 0.18,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, blockMat);
      mesh.position.set(x, y, z);

      const edges = new THREE.EdgesGeometry(geom);
      const edgeMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.65 });
      const wire = new THREE.LineSegments(edges, edgeMat);
      mesh.add(wire);
      return mesh;
    };

    const topBar = buildSlabGeometry(1.6, 0.35, 0.35, 0, 0.85, 0);
    const legL = buildSlabGeometry(0.35, 1.4, 0.35, -0.55, 0.0, 0);
    const legR = buildSlabGeometry(0.35, 1.4, 0.35, 0.55, 0.0, 0);
    const cage = buildSlabGeometry(2.3, 2.3, 2.3, 0, 0, 0, 0x6366f1);

    heroGroup.add(topBar, legL, legR, cage);

    // Section 3: Registry grid slabs
    const registryGroup = new THREE.Group();
    registryGroup.position.set(0.0, 0.0, -22.0);
    scene3D.add(registryGroup);

    const cardCoords = [
      { x: -2.8, y: 0.8, z: 0.0 },
      { x: 0.0,  y: 0.8, z: -0.25 },
      { x: 2.8,  y: 0.8, z: 0.0 },
      { x: -2.8, y: -1.2, z: 0.0 },
      { x: 0.0,  y: -1.2, z: -0.25 },
      { x: 2.8,  y: -1.2, z: 0.0 }
    ];

    cardCoords.forEach((coord, i) => {
      const slab = buildSlabGeometry(2.1, 1.45, 0.1, coord.x, coord.y, coord.z, 0x1e293b);
      registryGroup.add(slab);
      registrySlabs.push(slab);

      // Cyber laser connections flaring from hero core
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(2.0, 0.0, -3.0),
        new THREE.Vector3(coord.x, coord.y, -22.0 + coord.z)
      ]);
      const laserMat = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.12
      });
      const laser = new THREE.Line(lineGeom, laserMat);
      scene3D.add(laser);
      registryLines.push(laser);
    });
  }

  buildInteractiveCubes() {
    // Section 2: About Point Cloud cubes
    const aboutGroup = new THREE.Group();
    aboutGroup.position.set(1.5, 0.0, -10.0);
    scene3D.add(aboutGroup);

    const coords = [
      { x: -0.65, y: -0.55, z: 0.0 },
      { x: 0.65,  y: -0.45, z: -0.6 },
      { x: -0.45, y: 0.65,  z: -0.3 },
      { x: 0.55,  y: 0.55,  z: 0.25 }
    ];

    const blockMat = new THREE.MeshPhysicalMaterial({
      color: 0x050a12,
      roughness: 0.18,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.6 });

    coords.forEach((coord, i) => {
      const geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const mesh = new THREE.Mesh(geom, blockMat);
      mesh.position.set(coord.x, coord.y, coord.z);

      const edges = new THREE.EdgesGeometry(geom);
      const wire = new THREE.LineSegments(edges, edgeMat);
      mesh.add(wire);
      
      aboutGroup.add(mesh);
      aboutCubes.push(mesh);
    });
  }

  buildTriangleNodes() {
    // Section 4: Service Triangle station nodes
    const servicesGroup = new THREE.Group();
    servicesGroup.position.set(-1.0, 0.0, -30.0);
    scene3D.add(servicesGroup);

    const coords = [
      { x: -1.6, y: 0.8,  z: 0.0 },
      { x: 1.6,  y: 0.8,  z: -0.4 },
      { x: 0.0,  y: -1.2, z: 0.2 }
    ];

    const mat = new THREE.MeshBasicMaterial({ color: 0x44f5d2, wireframe: true });
    coords.forEach((coord) => {
      const geom = new THREE.OctahedronGeometry(0.35, 0);
      const node = new THREE.Mesh(geom, mat);
      node.position.set(coord.x, coord.y, coord.z);
      servicesGroup.add(node);
      serviceNodes.push(node);
    });

    // Wires and streams loop
    const connect = (a, b) => {
      const lineGeom = new THREE.BufferGeometry().setFromPoints([coords[a], coords[b]]);
      const wire = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: 0x1e293b }));
      servicesGroup.add(wire);

      const count = 6;
      const ptsGeom = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      ptsGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const streams = new THREE.Points(ptsGeom, new THREE.PointsMaterial({
        color: 0x44f5d2,
        size: 0.05,
        transparent: true,
        opacity: 0.8
      }));
      servicesGroup.add(streams);

      serviceStreams.push({
        mesh: streams,
        start: new THREE.Vector3().copy(coords[a]),
        end: new THREE.Vector3().copy(coords[b]),
        progresses: Array.from({ length: count }, (_, k) => k / count),
        speed: 0.0028
      });
    };

    connect(0, 1);
    connect(1, 2);
    connect(2, 0);
  }

  buildIdentityMonoliths() {
    // Section 5: Partners identity monolith cards
    const teamGroup = new THREE.Group();
    teamGroup.position.set(1.5, 0.0, -40.0);
    scene3D.add(teamGroup);

    const buildMonolith = (color) => {
      const group = new THREE.Group();
      const pillarMat = new THREE.MeshPhysicalMaterial({
        color: 0x050a12,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8
      });
      const geom = new THREE.BoxGeometry(0.35, 1.25, 0.35);
      const leftPillar = new THREE.Mesh(geom, pillarMat);
      const rightPillar = new THREE.Mesh(geom, pillarMat);
      leftPillar.position.set(-0.25, 0, 0);
      rightPillar.position.set(0.25, 0, 0);

      const edges = new THREE.EdgesGeometry(geom);
      const wireL = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
      const wireR = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
      leftPillar.add(wireL);
      rightPillar.add(wireR);

      group.add(leftPillar, rightPillar);
      return group;
    };

    const NN = buildMonolith(0x44f5d2);
    NN.position.set(-1.4, 0, 0);
    teamGroup.add(NN);
    partnerNodes.push(NN);

    const AG = buildMonolith(0x6366f1);
    AG.position.set(1.4, 0, 0);
    teamGroup.add(AG);
    partnerNodes.push(AG);
  }
}

// --- SECTION CONTROLLER CLASS ---
class SectionController {
  constructor() {
    this.sections = document.querySelectorAll('.section-panel');
    this.navLinks = document.querySelectorAll('header nav a');
  }

  update(cameraZ) {
    let activeId = 'hero';

    this.sections.forEach((panel) => {
      const zValue = parseFloat(panel.getAttribute('data-z'));
      const dist = Math.abs(cameraZ - zValue);

      if (dist < 5.0) {
        // Compute precise opacity and translation offset
        const opacity = 1.0 - (dist / 5.0);
        const translateY = (cameraZ - zValue) * 22.0;

        panel.style.opacity = opacity;
        panel.style.transform = `translate3d(0, ${translateY}px, 0)`;
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto'; // Enable touch/clicks

        if (dist < 2.5) {
          activeId = panel.getAttribute('id');
        }
      } else {
        panel.style.opacity = 0;
        panel.style.transform = 'translate3d(0, 40px, -50px)';
        panel.style.visibility = 'hidden';
        panel.style.pointerEvents = 'none'; // Lock clicks
      }
    });

    // Update active indicators
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// --- UI OVERLAY LAYER CLASS ---
class UIOverlay {
  constructor() {
    this.setupKeywords();
    this.setupProductCards();
    this.setupServiceCards();
    this.setupPartnerCards();
  }

  setupKeywords() {
    document.querySelectorAll('.hover-word').forEach((word) => {
      word.addEventListener('mouseenter', () => {
        const boxIdx = parseInt(word.getAttribute('data-box'));
        if (!isNaN(boxIdx) && aboutCubes[boxIdx]) {
          aboutCubes[boxIdx].scale.set(1.6, 1.6, 1.6);
        }
      });
    });
  }

  setupProductCards() {
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        productHoverIndex = parseInt(card.getAttribute('data-index'));
      });
      card.addEventListener('mouseleave', () => {
        productHoverIndex = -1;
      });
    });
  }

  setupServiceCards() {
    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        serviceHoverIndex = parseInt(card.getAttribute('data-index'));
        serviceHoverActive = true;
      });
      card.addEventListener('mouseleave', () => {
        serviceHoverIndex = -1;
        serviceHoverActive = false;
      });
    });
  }

  setupPartnerCards() {
    document.querySelectorAll('.partner-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        partnerHoverIndex = parseInt(card.getAttribute('data-index'));
      });
      card.addEventListener('mouseleave', () => {
        partnerHoverIndex = -1;
      });
    });
  }
}

function create3DEnvironment() {
  // Custom displaced grid shader
  gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uTrailMap: { value: null },
      uColor: { value: new THREE.Color(0x4f46e5) }, // Deep Indigo grid lines
      uBgColor: { value: new THREE.Color(0xffffff) }, // White base background
      uPulseActive: { value: 0.0 },
      uPulseTime: { value: 0.0 }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec2 vScreenUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Subtle background sine wave
        pos.z += sin(uv.x * 20.0 + uTime * 0.8) * cos(uv.y * 20.0 + uTime * 0.8) * 0.08;

        vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vScreenUv = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
        gl_Position = clipPos;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTrailMap;
      uniform vec3 uColor;
      uniform vec3 uBgColor;
      uniform float uPulseActive;
      uniform float uPulseTime;
      varying vec2 vUv;
      varying vec2 vScreenUv;

      void main() {
        // High contrast grid lines using standard steps
        float gridX = step(0.98, sin(vUv.x * 3.14159 * 100.0));
        float gridY = step(0.98, sin(vUv.y * 3.14159 * 100.0));
        float gridLine = max(gridX, gridY);

        // Sample screen-space trail map
        vec4 trail = texture2D(uTrailMap, vScreenUv);
        // trail.b is teal core density, trail.a is orange flare density
        float displace = (trail.b + trail.a) * 1.5;

        vec3 color = uBgColor;
        vec3 glowColor = uColor * (0.12 + 0.88 * displace);

        // Add back-propagating pulse visual
        if (uPulseActive > 0.01) {
          float pulseWidth = 0.04;
          // Pulse moves down UV coordinate y (from 0 to 1)
          float pulse = smoothstep(pulseWidth, 0.0, abs(vUv.y - uPulseTime));
          glowColor = mix(glowColor, vec3(1.0, 1.0, 1.0), pulse * 0.95);
        }

        color = mix(color, glowColor, gridLine * 0.8);
        color += uColor * displace * 0.5; // Add extra glow around displacement area

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false
  });

  // Flat geometry layout spanning the entire corridor path
  const gridGeom = new THREE.PlaneGeometry(16, 62, 80, 160);

  // Floor grid laying down
  floorGrid = new THREE.Mesh(gridGeom, gridMaterial);
  floorGrid.rotation.x = -Math.PI / 2;
  floorGrid.position.set(0, -2.2, -26);
  scene3D.add(floorGrid);

  // Ceiling grid laying up
  ceilingGrid = new THREE.Mesh(gridGeom, gridMaterial);
  ceilingGrid.rotation.x = Math.PI / 2;
  ceilingGrid.position.set(0, 2.2, -26);
  scene3D.add(ceilingGrid);

  // Structural rails/wires along the sides
  const railGeom = new THREE.BufferGeometry();
  const railPos = [];
  // Vertices for horizontal bars connecting checkpoints
  for (let z = 5; z >= -60; z -= 2) {
    railPos.push(-7.8, -2.1, z, -7.8, 2.1, z);
    railPos.push(7.8, -2.1, z, 7.8, 2.1, z);
  }
  // Longitudinal rails
  railPos.push(-7.8, -2.1, 5, -7.8, -2.1, -60);
  railPos.push(-7.8, 2.1, 5, -7.8, 2.1, -60);
  railPos.push(7.8, -2.1, 5, 7.8, -2.1, -60);
  railPos.push(7.8, 2.1, 5, 7.8, 2.1, -60);

  railGeom.setAttribute('position', new THREE.Float32BufferAttribute(railPos, 3));
  const railMat = new THREE.LineBasicMaterial({ color: 0x1e293b });
  const structuralRails = new THREE.LineSegments(railGeom, railMat);
  scene3D.add(structuralRails);
}

// --- MAIN SETUP INITS ---
function init() {
  // 1. Instanciate responsive device detector
  responsiveManager = new ResponsiveManager();

  // 2. Scene setup
  sceneManager = new SceneManager();

  // Create background grids and particles
  create3DEnvironment();

  // 3. Setup double-buffered Curl-Noise fluid simulation advection loop
  fluidLayer = new FluidLayer();



  // 4. Build Corridor Architecture Layer
  architectureLayer = new ArchitectureLayer();

  // 5. Initialize Spline Camera Controllers & Overlays
  sectionController = new SectionController();
  uiOverlay = new UIOverlay();

  // Setup mobile physical particles pool
  const maxPool = Math.floor(40 * Config.particleScale);
  const clickGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const clickMat = new THREE.MeshBasicMaterial({ color: 0x44f5d2, transparent: true, opacity: 0 });
  for (let i = 0; i < maxPool; i++) {
    const mesh = new THREE.Mesh(clickGeom, clickMat.clone());
    mesh.position.set(0, 0, 999);
    scene3D.add(mesh);
    clickParticlesPool.push({
      mesh: mesh,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 0.0
    });
  }

  // 6. Initialize Lenis immediately so scroll state is ready — starts after preloaderComplete
  initPageAnimations();

  // Unlock scroll and enable form only after preloader finishes
  window.addEventListener('preloaderComplete', () => {
    if (window._lenis) window._lenis.start();
    initForm();
  });

  // 7. Start Render Loop
  animate(0);
}

// GSAP scroll path & camera checkpoints drive
function initPageAnimations() {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  // Start paused — will be started by preloaderComplete event
  lenis.stop();
  window._lenis = lenis; // expose globally so preloaderComplete can call lenis.start()

  lenis.on('scroll', (e) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = Math.max(0.0, Math.min(1.0, e.animatedScroll / maxScroll));
    // Set scroll speed parameter to increase turbulence in fluid loop
    fluidLayer.scrollSpeed = Math.abs(e.velocity) * 0.02;
  });

  function updateLenis(time) {
    lenis.raf(time);
    requestAnimationFrame(updateLenis);
  }
  requestAnimationFrame(updateLenis);

  // Connect links to target scrolling coordinate
  document.querySelectorAll('.select-anchor').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const zVal = parseFloat(link.getAttribute('data-target-z'));
      if (!isNaN(zVal)) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const targetScroll = (zVal / -50.0) * maxScroll;
        lenis.scrollTo(targetScroll);
      }
    });
  });
}

// Active hovers trackers
let productHoverIndex = -1;
let serviceHoverIndex = -1;
let serviceHoverActive = false;
let partnerHoverIndex = -1;

// Render loop parameters
const targetMouseNDCX = new THREE.Vector2(0, 0);
const targetCameraPos = new THREE.Vector3(0, 0, 0);
const targetCameraLookAt = new THREE.Vector3(0, 0, -6);

// --- FRAME UPDATE LOOP ---
function animate(time) {
  requestAnimationFrame(animate);

  const delta = time * 0.001;

  // Dynamic background color transition from White at top to Logo Yellow at bottom
  // Signature Jagathi Yellow: #FFE600 (R=1.0, G=0.902, B=0.0)
  const rVal = 1.0;
  const gVal = 1.0 - scrollProgress * 0.098;
  const bVal = 1.0 - scrollProgress;
  const currentBgColor = new THREE.Color(rVal, gVal, bVal);

  if (renderer && scene3D) {
    renderer.setClearColor(currentBgColor, 1.0);
    if (scene3D.fog) {
      scene3D.fog.color.copy(currentBgColor);
    }
  }

  // 1. Update fluid advection feedback pass
  fluidLayer.update(delta);

  // Update trail map & background color in grid material
  if (gridMaterial) {
    gridMaterial.uniforms.uTrailMap.value = fluidLayer.targetA.texture;
    gridMaterial.uniforms.uBgColor.value.copy(currentBgColor);
  }

  // Also update body background color so Lenis scroll track and CSS match
  const hexString = '#' + currentBgColor.getHexString();
  document.body.style.backgroundColor = hexString;
  document.documentElement.style.backgroundColor = hexString;

  // Handle back-propagation light wave
  if (submitPulseActive) {
    submitPulseVal += 0.012;
    gridMaterial.uniforms.uPulseTime.value = submitPulseVal;
    if (submitPulseVal > 1.1) {
      submitPulseActive = false;
      gridMaterial.uniforms.uPulseActive.value = 0.0;
    }
  }

  // Decay scroll turbulence multiplier back to normal
  fluidLayer.scrollSpeed = THREE.MathUtils.lerp(fluidLayer.scrollSpeed, 0.0, 0.08);

  // 2. Camera spline path checkpoints updates
  const segment = scrollProgress * (checkpoints.length - 1);
  const idx = Math.floor(segment);
  const frac = segment - idx;
  const t = frac * frac * (3.0 - 2.0 * frac); // smooth interpolation curve

  if (idx < checkpoints.length - 1) {
    const cpA = checkpoints[idx];
    const cpB = checkpoints[idx + 1];

    targetCameraPos.set(
      cpA.x + (cpB.x - cpA.x) * t,
      cpA.y + (cpB.y - cpA.y) * t,
      cpA.z + (cpB.z - cpA.z) * t
    );

    targetCameraLookAt.set(
      cpA.targetX + (cpB.targetX - cpA.targetX) * t,
      cpA.targetY + (cpB.targetY - cpA.targetY) * t,
      cpA.targetZ + (cpB.targetZ - cpA.targetZ) * t
    );
  } else {
    const cpLast = checkpoints[checkpoints.length - 1];
    targetCameraPos.copy(cpLast);
    targetCameraLookAt.set(cpLast.targetX, cpLast.targetY, cpLast.targetZ);
  }

  // Eased camera tilt mapping
  currentTilt.lerp(targetTilt, 0.05);

  camera3D.position.copy(targetCameraPos);
  camera3D.position.x += currentTilt.x;
  camera3D.position.y += currentTilt.y;
  camera3D.lookAt(targetCameraLookAt);

  // 3. Animate 3D meshes along Z path
  if (heroGroup) {
    heroGroup.rotation.y = time * 0.00015;
    heroGroup.rotation.x = Math.sin(time * 0.00008) * 0.12;
  }

  aboutCubes.forEach((cube, i) => {
    cube.rotation.y = time * 0.00018 * (i + 1);
    cube.rotation.x = time * 0.00012 * (i + 1);
    const scale = cube.scale.x;
    if (scale > 1.01) {
      const easedScale = THREE.MathUtils.lerp(scale, 1.0, 0.08);
      cube.scale.set(easedScale, easedScale, easedScale);
    }
  });

  registrySlabs.forEach((slab, i) => {
    // Card slide forward on hover
    const posZ = slab.position.z;
    const targetZ = productHoverIndex === i ? 0.35 : 0.0;
    slab.position.z = THREE.MathUtils.lerp(posZ, targetZ, 0.08);

    // Laser connection wire flares
    const lineMat = registryLines[i].material;
    const targetOpacity = productHoverIndex === i ? 0.65 : 0.12;
    lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetOpacity, 0.08);
    lineMat.color.setHex(productHoverIndex === i ? 0x44f5d2 : 0x6366f1);
  });

  serviceNodes.forEach((node, i) => {
    node.rotation.y = time * 0.0004 * (i + 1);
    node.rotation.x = time * 0.00025 * (i + 1);
    const scale = node.scale.x;
    const targetScale = serviceHoverIndex === i ? 1.45 : 1.0;
    const easedScale = THREE.MathUtils.lerp(scale, targetScale, 0.08);
    node.scale.set(easedScale, easedScale, easedScale);
  });

  // Dynamic streams along node meshes
  serviceStreams.forEach((stream) => {
    const pos = stream.mesh.geometry.attributes.position.array;
    const multiplier = serviceHoverActive ? 3.0 : 1.0;
    for (let k = 0; k < stream.progresses.length; k++) {
      stream.progresses[k] += stream.speed * multiplier;
      if (stream.progresses[k] > 1.0) stream.progresses[k] -= 1.0;

      const p = stream.progresses[k];
      const idx = k * 3;
      pos[idx] = stream.start.x + (stream.end.x - stream.start.x) * p;
      pos[idx + 1] = stream.start.y + (stream.end.y - stream.start.y) * p;
      pos[idx + 2] = stream.start.z + (stream.end.z - stream.start.z) * p;
    }
    stream.mesh.geometry.attributes.position.needsUpdate = true;
  });

  partnerNodes.forEach((node, i) => {
    const isHovered = partnerHoverIndex === i;
    const speed = isHovered ? 0.00085 : 0.00028;
    node.rotation.y += speed;
    const scale = node.scale.x;
    const targetScale = isHovered ? 1.35 : 1.0;
    const easedScale = THREE.MathUtils.lerp(scale, targetScale, 0.08);
    node.scale.set(easedScale, easedScale, easedScale);
  });

  // 4. Update physical particle pools
  if (ambientParticles) {
    const pos = ambientParticles.geometry.attributes.position.array;
    const speeds = ambientParticles.userData.speeds;
    for (let i = 2; i < pos.length; i += 3) {
      pos[i] += speeds[Math.floor(i / 3)];
      if (pos[i] > 5) {
        pos[i] = -65.0;
        pos[i - 1] = (Math.random() - 0.5) * 4.0;
        pos[i - 2] = (Math.random() - 0.5) * 15.0;
      }
    }
    ambientParticles.geometry.attributes.position.needsUpdate = true;
  }

  clickParticlesPool.forEach((p) => {
    if (p.life > 0.01) {
      p.mesh.position.add(p.velocity);
      p.life -= 0.015;
      p.mesh.material.opacity = p.life;
      if (p.life <= 0.01) {
        p.mesh.position.set(0, 0, 999);
      }
    }
  });

  // 5. Update HTML visibilities & depths
  sectionController.update(camera3D.position.z);

  // 6. Final Render compositing
  if (Config.isMobile) {
    // Mobile: Render 3D scene directly to screen, then blend screen-space fluid glow on top
    renderer.render(scene3D, camera3D);

    renderer.autoClear = false;
    sceneManager.compositeMaterial.uniforms.tFluid.value = fluidLayer.targetA.texture;
    renderer.render(sceneManager.compositeScene, sceneManager.compositeCamera);
    renderer.autoClear = true;
  } else {
    // Desktop: Render 3D Scene to sceneTarget texture
    renderer.setRenderTarget(sceneManager.sceneTarget);
    renderer.render(scene3D, camera3D);

    // Composite & draw quad onto canvas screen applying custom refraction displacement
    sceneManager.compositeMaterial.uniforms.tFluid.value = fluidLayer.targetA.texture;
    renderer.setRenderTarget(null);
    renderer.render(sceneManager.compositeScene, sceneManager.compositeCamera);
  }
}

// Bounding handler changes
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Let responsive manager check again
  responsiveManager.detectDevice();

  sceneManager.resize(w, h);
}

// Handle project form submission & logs console simulator
function initForm() {
  const form = document.getElementById('projectForm');
  const consoleOutput = document.getElementById('consoleOutput');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !consoleOutput) return;

  const logToConsole = (msg, isHighlight = false) => {
    const line = document.createElement('div');
    line.className = 'console-line';
    
    const prefix = document.createElement('span');
    prefix.className = 'prefix';
    prefix.innerText = '>';
    
    const textNode = document.createElement('span');
    textNode.className = isHighlight ? 'msg highlight' : 'msg';
    textNode.innerText = msg;
    
    line.appendChild(prefix);
    line.appendChild(textNode);
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    consoleOutput.innerHTML = '';

    if (!name || !email || !subject || !message) {
      logToConsole('TRANSMISSION_ABORTED: EMPTY_PARAMETERS', false);
      logToConsole('ERROR: Please verify all required registry fields.', false);
      showToast('Validation Error: All fields are required.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      logToConsole('TRANSMISSION_ABORTED: INVALID_EMAIL_FORMAT', false);
      logToConsole(`ERROR: "${email}" violates email verification protocol.`, false);
      showToast('Validation Error: Invalid email format.', 'error');
      return;
    }

    // Begin Dispatch
    logToConsole('INITIALIZING DATA CANAL CONDUIT...');
    submitBtn.disabled = true;
    submitBtn.innerText = 'DISPATCHING STREAM...';

    // Highlight console deck platform
    if (contactDeck) {
      contactDeck.scale.set(1.05, 2.5, 1.05);
      setTimeout(() => {
        contactDeck.scale.set(1.0, 1.0, 1.0);
      }, 500);
    }

    // Steps to compile transmission
    setTimeout(() => {
      logToConsole(`PACKAGING FILE DATA (Subject: "${subject.substring(0, 20)}...")`);
    }, 450);

    setTimeout(() => {
      logToConsole('ENCRYPTING STREAM WITH AES-256 CIPHER...');
    }, 950);

    setTimeout(() => {
      logToConsole('TRANSMITTING PACKETS... FIRING SIGNAL CONDUIT', true);
      
      // Trigger WebGL Back-propagating shockwave line
      submitPulseActive = true;
      submitPulseVal = 0.0;
      gridMaterial.uniforms.uPulseActive.value = 1.0;
    }, 1450);

    setTimeout(() => {
      logToConsole('TRANSMISSION DISPATCH SUCCESSFUL.', true);
      logToConsole('CANAL NODE DEALLOCATED.', false);
      
      showToast('Transmission dispatched successfully!', 'success');
      
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerText = 'Send Transmission';
    }, 2400);
  });

  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(input => {
    input.addEventListener('focus', () => {
      if (lights.contactPoint) lights.contactPoint.intensity = 8.0;
    });
    input.addEventListener('blur', () => {
      if (lights.contactPoint) lights.contactPoint.intensity = 4.0;
    });
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  const icon = type === 'success' 
    ? `<svg class="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg class="toast-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 4000);
}

// Start application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
