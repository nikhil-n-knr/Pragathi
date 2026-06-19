'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function YellowFog({ scrollProgress = 0, baseOpacity = 0.05 }) {
  const meshRef = useRef();
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uBaseOpacity: { value: baseOpacity },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), [size.width, size.height, baseOpacity]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Support either a GSAP-animated Ref object or a direct number
    if (scrollProgress && typeof scrollProgress === 'object' && 'current' in scrollProgress) {
      uniforms.uScrollProgress.value = scrollProgress.current;
    } else {
      uniforms.uScrollProgress.value = Number(scrollProgress);
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uBaseOpacity;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = vUv;
      
      // Density changes dynamically based on scroll
      float scrollFactor = sin(uScrollProgress * 3.14159);
      float baseDensity = mix(uBaseOpacity, uBaseOpacity * 2.2, 0.5 + 0.5 * scrollFactor);
      
      // Moving mist noise patterns
      vec2 noiseUv1 = uv * 3.0 + vec2(uTime * 0.04, uTime * 0.015);
      vec2 noiseUv2 = uv * 6.0 - vec2(uTime * 0.02, -uTime * 0.04);
      
      float n = noise(noiseUv1) * 0.65 + noise(noiseUv2) * 0.35;
      float fogDensity = baseDensity * (0.35 + 0.65 * n);

      // Signature brand charcoal volumetric mist color
      vec3 charcoalFogColor = vec3(66.0 / 255.0, 66.0 / 255.0, 66.0 / 255.0);
      
      float distToCenter = length(uv - vec2(0.5));
      float glow = smoothstep(1.1, 0.0, distToCenter);
      
      vec3 finalColor = charcoalFogColor * fogDensity * glow;
      
      gl_FragColor = vec4(finalColor, fogDensity * 0.8);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        transparent={true}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
