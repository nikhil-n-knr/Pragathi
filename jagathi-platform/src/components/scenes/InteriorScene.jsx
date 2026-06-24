'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFluid } from '../../context/FluidContext';

// Position of interior scene: Y = -62
const centerY = -62;

// Material shaders shared across solid room elements to compute masking
const maskUniforms = {
  uTime: { value: 0 },
  uBulbPos: { value: new THREE.Vector3(0, centerY + 2.5, 0) },
  uLightConeDir: { value: new THREE.Vector3(0, -1, 0) },
  uConeAngleCos: { value: Math.cos(30 * Math.PI / 180) }, // 30 degrees cone
  uLightOn: { value: 0.0 }, // 0 = off, 1 = on
  uOpacity: { value: 0.0 }
};

export default function InteriorScene({ scrollProgress }) {
  const sceneRef = useRef();
  const bulbRef = useRef();
  const lightConeRef = useRef();
  const { mousePos, mouseVel } = useFluid();
  const { size } = useThree();

  const [lightOn, setLightOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Track light bulb physical parameters (pendulum swinging)
  const bulbPhysics = useRef({
    angleX: 0,
    angleZ: 0,
    velX: 0,
    velZ: 0,
    restY: centerY + 2.5 // height of the hanging bulb
  });

  useFrame((state) => {
    const p = scrollProgress && typeof scrollProgress === 'object' && 'current' in scrollProgress ? scrollProgress.current : Number(scrollProgress);

    const sceneOpacity = 1.0;
    if (sceneRef.current) {
      sceneRef.current.visible = true;
    }

    // Set camera position and lookAt target locally
    const camera = state.camera;
    // Slow camera zoom-in inspection pan across the room on scroll
    camera.position.x = 2.0 - p * 0.9;
    camera.position.z = 4.8;
    camera.position.y = centerY + 1.8 + p * 0.35;
    camera.lookAt(0.2, centerY + 1.0, 0);

    maskUniforms.uOpacity.value = sceneOpacity;
    maskUniforms.uTime.value = state.clock.getElapsedTime();

    // Bulb descent animation on scroll (bulb drops down from ceiling between local scroll 0.0 and 0.4)
    let dropProgress = 1.0;
    if (p < 0.4) {
      dropProgress = THREE.MathUtils.clamp(p / 0.4, 0.0, 1.0);
    }
    const currentRestY = centerY + 4.5 - dropProgress * 2.0;
    bulbPhysics.current.restY = currentRestY;

    // Swing physics: Mouse velocity pushes the bulb
    const phys = bulbPhysics.current;
    
    // Add mouse velocity impulses if hovering or moving fast
    const speed = mouseVel.current.speed;
    if (speed > 0.05 && p >= 0.0 && p <= 0.95) {
      phys.velX += mouseVel.current.x * 0.05;
      phys.velZ += mouseVel.current.y * 0.05;
    }

    // Pendulum gravity pull and friction damping
    const gravity = 0.035;
    const friction = 0.96;

    phys.velX += -phys.angleX * gravity;
    phys.velZ += -phys.angleZ * gravity;

    phys.velX *= friction;
    phys.velZ *= friction;

    phys.angleX += phys.velX;
    phys.angleZ += phys.velZ;

    // Compute actual bulb coordinates based on string length (L = 2.0)
    const L = 2.0;
    const bulbX = L * Math.sin(phys.angleX);
    const bulbZ = L * Math.sin(phys.angleZ);
    const bulbY = currentRestY - L * Math.cos(phys.angleX) * Math.cos(phys.angleZ);

    if (bulbRef.current) {
      bulbRef.current.position.set(bulbX, bulbY, bulbZ);
    }

    // Set uniform coordinates for masking
    maskUniforms.uBulbPos.value.set(bulbX, bulbY, bulbZ);

    // Compute light cone direction: points down from bulb along cord
    const dir = new THREE.Vector3(-bulbX, currentRestY - bulbY, -bulbZ).normalize();
    maskUniforms.uLightConeDir.value.copy(dir);

    // Dynamic volumetric light cone scale/position/rotation
    if (lightConeRef.current) {
      lightConeRef.current.position.set(bulbX, bulbY - 1.5, bulbZ);
      
      // Rotate cone to align with swinging direction
      const angle = Math.atan2(bulbX, currentRestY - bulbY);
      lightConeRef.current.rotation.z = -phys.angleX;
      lightConeRef.current.rotation.x = phys.angleZ;
      
      // Bulb glow intensity transition
      const targetConeOpacity = lightOn ? 0.35 * sceneOpacity : 0.0;
      lightConeRef.current.material.uniforms.uOpacity.value += (targetConeOpacity - lightConeRef.current.material.uniforms.uOpacity.value) * 0.15;
    }

    // Animate shader uniform representing light state
    const targetLightOnVal = lightOn ? 1.0 : 0.0;
    maskUniforms.uLightOn.value += (targetLightOnVal - maskUniforms.uLightOn.value) * 0.15;
  });

  // Custom Shader: Procedural Texturing + Cone Masking Fragment Shader
  const maskShader = useMemo(() => ({
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        // Calculate world coordinate position
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uBulbPos;
      uniform vec3 uLightConeDir;
      uniform float uConeAngleCos;
      uniform float uLightOn;
      uniform float uOpacity;
      
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      // Noise generator for marble/wood patterns
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i+vec2(0,0)), hash(i+vec2(1,0)), f.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }
      
      // Fractal Brownian Motion for rich details
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Compute direction vector from bulb to the pixel
        vec3 toFrag = vWorldPosition - uBulbPos;
        vec3 dirToFrag = normalize(toFrag);
        float distToFrag = length(toFrag);

        // Check angle inside cone
        float dotCone = dot(dirToFrag, normalize(uLightConeDir));
        
        // Threshold check with smooth boundary
        float insideCone = smoothstep(uConeAngleCos - 0.07, uConeAngleCos, dotCone);
        
        // Final activation intensity
        float intensity = insideCone * uLightOn;

        if (intensity <= 0.01) {
          // Completely transparent outside the active light cone
          // Reveals the wireframe meshes underneath
          discard;
        }

        // --- Render textured premium surface inside light cone ---
        
        // Material 1: Dark veined marble (floor/walls)
        vec3 baseMarble = vec3(0.04, 0.04, 0.04);
        float nVal = fbm(vWorldPosition.xz * 4.0 + vec2(fbm(vWorldPosition.xz * 2.0)));
        vec3 veinColor = vec3(1.0, 0.90, 0.4) * smoothstep(0.45, 0.65, nVal) * 0.5;
        vec3 marbleColor = baseMarble + veinColor;

        // Lighting calculation (diffuse + warm ambient)
        vec3 lightDir = normalize(uBulbPos - vWorldPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        float falloff = 1.0 / (1.0 + 0.12 * distToFrag * distToFrag); // quadratic attenuation
        
        vec3 warmLightColor = vec3(1.0, 0.88, 0.65) * 1.6;
        vec3 litColor = marbleColor * (0.15 + diff * warmLightColor * falloff);
        
        // Blend out near the light edges
        gl_FragColor = vec4(litColor, intensity * uOpacity);
      }
    `
  }), []);

  // Volumetric yellow cone shader
  const coneShader = useMemo(() => ({
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vec3 yellowGlow = vec3(66.0 / 255.0, 66.0 / 255.0, 66.0 / 255.0);
        
        // Fade vertical density (denser at top near bulb)
        float verticalFade = smoothstep(-1.5, 1.5, vPosition.y); // Y ranges -1.5 to 1.5
        
        // Fade radial density (denser at center axis)
        float radialFade = 1.0 - smoothstep(0.0, 0.5, length(vPosition.xz));
        
        float alpha = verticalFade * radialFade * uOpacity;
        
        gl_FragColor = vec4(yellowGlow, alpha);
      }
    `
  }), []);

  return (
    <group ref={sceneRef}>
      {/* 1. Wireframe Outlines (Visible when light is off or outside light cone) */}
      <group>
        {/* Floor wireframe */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, centerY, 0]}>
          <planeGeometry args={[6, 6, 8, 8]} />
          <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.3} depthWrite={false} />
        </mesh>
        
        {/* Back Wall wireframe */}
        <mesh position={[0, centerY + 2.0, -3.0]}>
          <planeGeometry args={[6, 4, 8, 6]} />
          <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.2} depthWrite={false} />
        </mesh>

        {/* Side Wall wireframe */}
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.0, centerY + 2.0, 0]}>
          <planeGeometry args={[6, 4, 8, 6]} />
          <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.2} depthWrite={false} />
        </mesh>

        {/* Dining Table wireframe */}
        <group position={[0.5, centerY, 0]}>
          {/* tabletop */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[2.0, 0.08, 1.2]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.4} />
          </mesh>
          {/* legs */}
          <mesh position={[-0.9, 0.375, -0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
          <mesh position={[0.9, 0.375, -0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
          <mesh position={[-0.9, 0.375, 0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
          <mesh position={[0.9, 0.375, 0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
        </group>

        {/* Chair wireframe */}
        <group position={[-0.8, centerY, 0.2]} rotation={[0, 0.3, 0]}>
          {/* seat */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.05, 0.5]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
          {/* backrest */}
          <mesh position={[0.2, 0.85, 0]}>
            <boxGeometry args={[0.05, 0.8, 0.5]} />
            <meshBasicMaterial color="#424242" wireframe={true} transparent={true} opacity={0.35} />
          </mesh>
        </group>
      </group>

      {/* 2. Solid Meshes with Texture Masking shader (Overlapping the wireframes) */}
      <group>
        {/* Floor solid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, centerY, 0]}>
          <planeGeometry args={[6, 6, 2, 2]} />
          <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} depthWrite={true} />
        </mesh>

        {/* Back wall solid */}
        <mesh position={[0, centerY + 2.0, -3.0]}>
          <planeGeometry args={[6, 4, 2, 2]} />
          <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} depthWrite={true} />
        </mesh>

        {/* Side wall solid */}
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.0, centerY + 2.0, 0]}>
          <planeGeometry args={[6, 4, 2, 2]} />
          <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} depthWrite={true} />
        </mesh>

        {/* Table solid */}
        <group position={[0.5, centerY, 0]}>
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[2.0, 0.08, 1.2]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
          <mesh position={[-0.9, 0.375, -0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
          <mesh position={[0.9, 0.375, -0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
          <mesh position={[-0.9, 0.375, 0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
          <mesh position={[0.9, 0.375, 0.5]}>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
        </group>

        {/* Chair solid */}
        <group position={[-0.8, centerY, 0.2]} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.05, 0.5]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
          <mesh position={[0.2, 0.85, 0]}>
            <boxGeometry args={[0.05, 0.8, 0.5]} />
            <shaderMaterial vertexShader={maskShader.vertexShader} fragmentShader={maskShader.fragmentShader} uniforms={maskUniforms} transparent={true} />
          </mesh>
        </group>
      </group>

      {/* 3. Volumetric Cone Light Beam */}
      <mesh
        ref={lightConeRef}
        position={[0, centerY + 1.0, 0]}
      >
        <coneGeometry args={[1.7, 3.0, 32, 1, true]} />
        <shaderMaterial
          vertexShader={coneShader.vertexShader}
          fragmentShader={coneShader.fragmentShader}
          uniforms={{
            uOpacity: { value: 0 }
          }}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Hanging Cord & Interactive Light Bulb */}
      <group>
        {/* Hanging wire */}
        <mesh position={[0, centerY + 3.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 2.0]} />
          <meshBasicMaterial color="#222222" />
        </mesh>

        {/* Light Bulb geometry with hover state */}
        <group
          ref={bulbRef}
          onPointerOver={() => {
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setIsHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={() => setLightOn(!lightOn)}
        >
          {/* Bulb cap */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12]} />
            <meshStandardMaterial color={isHovered ? '#424242' : '#888888'} roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Glowing filament/bulb sphere */}
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial
              color={lightOn ? '#424242' : '#888888'}
              emissive={lightOn ? '#424242' : '#000000'}
              emissiveIntensity={lightOn ? 1.0 : 0}
              roughness={0.05}
              metalness={0.9}
            />
          </mesh>

          {/* Light emission point source */}
          {lightOn && <pointLight position={[0, 0, 0]} color="#424242" intensity={1.8} distance={12} />}
        </group>
      </group>
    </group>
  );
}
