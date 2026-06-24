'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFluid } from '../../context/FluidContext';

export default function GenesisScene({ scrollProgress }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { mousePos } = useFluid();
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      const p = scrollProgress.current;
      
      // Genesis Scene is fully active from scroll 0.0 to 1.0.
      // We smoothly fade it out as we transition into Section 2 (Construction, scroll > 1.0).
      let opacity = 1.0;
      if (p > 0.8) {
        opacity = Math.max(0.0, 1.0 - (p - 0.8) / 0.4);
      }
      
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uScrollProgress.value = Math.min(1.0, p);
      materialRef.current.uniforms.uOpacity.value = opacity;
      materialRef.current.uniforms.uAspect.value = size.width / size.height;

      // Pass normalized mouse coordinates (-1 to 1) converted to 0..1 space
      materialRef.current.uniforms.uMouse.value.set(
        mousePos.current.normalizedX * 0.5 + 0.5,
        mousePos.current.normalizedY * 0.5 + 0.5
      );
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Position mesh facing the camera
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform vec2 uMouse;
    uniform float uAspect;
    uniform float uOpacity;
    varying vec2 vUv;

    // Pseudo-random noise
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      float n = i.x + i.y*57.0;
      return mix(mix(hash(n+  0.0), hash(n+  1.0), f.x),
                 mix(hash(n+ 57.0), hash(n+ 58.0), f.x), f.y);
    }

    void main() {
      if (uOpacity <= 0.001) discard;

      vec2 uv = vUv;
      vec3 brandYellow = vec3(1.0, 0.90, 0.0);
      
      // Heartbeat pulse frequency
      float pulse = 0.5 + 0.5 * sin(uTime * 3.5);
      
      // Calculate mouse displacement field (liquid wave ripple)
      // Distance is corrected for aspect ratio
      vec2 aspectUv = vec2(uv.x * uAspect, uv.y);
      vec2 aspectMouse = vec2(uMouse.x * uAspect, uMouse.y);
      float mouseDistance = distance(aspectUv, aspectMouse);
      
      // Mouse cursor generates a localized Gaussian displacement
      float localRipple = exp(-pow(mouseDistance * 12.0, 2.0)) * 0.04;
      
      // Global liquid wave motion
      float wave = sin(uv.x * 15.0 - uTime * 6.0) * (0.005 + localRipple * 1.5);
      
      // Define baseline height Y = 0.5
      float baseY = 0.5 + wave;
      
      // Calculate pixel intensity for lines
      float finalColorVal = 0.0;

      if (uScrollProgress < 0.01) {
        // --- Landing State (Genesis): Single razor-sharp line ---
        float lineDist = abs(uv.y - baseY);
        // Razor-sharp thickness + pulse glow
        float sharpness = 0.0025 + pulse * 0.0005;
        float intensity = smoothstep(sharpness, 0.0, lineDist);
        
        // Add subtle radial glow around the line
        float glowIntensity = exp(-lineDist * 35.0) * 0.2;
        
        finalColorVal = intensity + glowIntensity;
      } else {
        // --- Scroll State: Line branching off into grid vectors ---
        // How much lines have branched
        float t = uScrollProgress;
        
        // Let's compute multiple lines branching out
        // The base line splits into several, dropping down
        float count = 8.0;
        for (float i = 0.0; i < 8.0; i++) {
          float offsetFactor = (i / 7.0 - 0.5) * 2.0; // -1 to 1
          
          // Generate a curvy path branching downwards
          float branchOffset = offsetFactor * t * 0.25 * sin(uv.x * 4.0 + i + uTime * 0.2);
          
          // Vertical drop: branching pulls them downwards
          float lineY = baseY + branchOffset - (t * 0.15 * (1.0 - uv.x));
          
          float lineDist = abs(uv.y - lineY);
          float intensity = smoothstep(0.002, 0.0, lineDist);
          float glow = exp(-lineDist * 40.0) * 0.15;
          
          finalColorVal += (intensity + glow) * (1.0 / sqrt(i + 1.0));
        }

        // Add vertical coordinate grid drafting lines branching out
        // Only show columns as scroll increases
        float gridCols = 18.0;
        float colIndex = floor(uv.x * gridCols);
        float colX = (colIndex + 0.5) / gridCols;
        
        // Grid lines fade in as scroll increases
        float vLineDist = abs(uv.x - colX);
        
        // Only drop down from the baseline downwards
        if (uv.y < baseY + 0.15) {
          float vIntensity = smoothstep(0.001, 0.0, vLineDist);
          // Noise mask for vector grid lines to feel organic, like drafting paths assembling
          float n = noise(uv * 12.0 + uTime * 0.3);
          float gridFade = smoothstep(0.0, 0.8, t) * step(n, t);
          
          finalColorVal += vIntensity * gridFade * 0.4 * (baseY - uv.y);
        }
      }

      // Clamp color output
      finalColorVal = clamp(finalColorVal, 0.0, 1.5);
      
      vec3 finalRGB = brandYellow * finalColorVal * uOpacity;
      gl_FragColor = vec4(finalRGB, finalColorVal * uOpacity);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={useMemo(() => ({
          uTime: { value: 0 },
          uScrollProgress: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: size.width / size.height },
          uOpacity: { value: 1.0 }
        }), [size.width, size.height])}
        depthWrite={false}
        depthTest={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
